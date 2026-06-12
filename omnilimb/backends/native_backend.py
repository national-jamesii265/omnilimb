"""Native backend — decoupled Python substrate (no Node / no `openclaw` needed).

Implements the same contract as the CLI backend using only Python + optional
host tools (git, docker, playwright). This is the "completely decoupled rewrite"
path: it can run on a machine that has never installed OpenClaw.

Honesty notes (read before shipping to customers):
- Skill *execution* (skill_run), sandbox_exec, browser and runtime are fully
  implemented and deterministic.
- Skill *registry* operations (search/install) talk to a configurable registry
  base URL. The exact ClawHub REST contract evolves; git: and local installs are
  rock-solid, while slug installs use a documented best-effort resolution and
  fall back with a clear, actionable error. For guaranteed registry parity, set
  `backend: cli`.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
import uuid
from pathlib import Path
from typing import Any

from ..config import get_settings
from .base import Backend

_IS_WIN = os.name == "nt"

_LANG_CMD = {
    "python": ["python", "-c"],
    "py": ["python", "-c"],
    "python3": ["python", "-c"],
    "node": ["node", "-e"],
    "js": ["node", "-e"],
    "javascript": ["node", "-e"],
    "bash": ["bash", "-c"],
    "sh": ["sh", "-c"],
    "shell": ["bash", "-c"],
    "ruby": ["ruby", "-e"],
    "rb": ["ruby", "-e"],
    "powershell": ["powershell", "-NoProfile", "-Command"],
    "pwsh": ["pwsh", "-NoProfile", "-Command"],
    "ps1": ["powershell", "-NoProfile", "-Command"],
}


def _which(name: str) -> str | None:
    return shutil.which(name)


def _shell_argv(command: str) -> list[str]:
    """Platform-appropriate 'run this shell command' argv (host fallback only)."""
    if _IS_WIN:
        return ["cmd", "/c", command]
    return ["sh", "-c", command]


def _safe_name(slug: str) -> str:
    return slug.replace("git:", "").rstrip("/").split("/")[-1].split("@")[0]


# Skill-market access goes through pluggable registry adapters (clawhub/skillhub).
from ..registries import get_registry  # noqa: E402


class NativeBackend(Backend):
    name = "native"

    # -- helpers -----------------------------------------------------------
    def _skill_dir(self, slug: str) -> Path:
        return get_settings().workspace_dir() / "skills" / _safe_name(slug)

    # -- skill registry (via market adapter) -------------------------------
    def skill_search(self, *, query: str, limit: int, page: int = 1,
                     category: str | None = None, sort: str | None = None) -> dict[str, Any]:
        from .._cache import cached, make_key

        reg = get_registry()
        s = get_settings()
        key = make_key("search", reg.id, query, limit, page, category, sort)
        res = cached(
            key,
            lambda: reg.search(query, limit, page=page, category=category, sort=sort),
            enabled=s.cache_enabled,
            max_age_s=s.cache_max_age_s,
        )
        if not res.get("ok"):
            res.setdefault("hint", "Check market/registry config, or use backend: cli.")
            res["market"] = reg.id
            return res
        skills = res.get("skills", [])
        out = {"ok": True, "market": reg.id, "query": query, "count": len(skills),
               "total": res.get("total"), "page": page, "pageSize": limit, "skills": skills}
        if res.get("from_cache"):
            out["from_cache"] = True
            out["stale"] = bool(res.get("stale"))
            out["cache_age_s"] = res.get("cache_age_s")
            out["cache_note"] = res.get("cache_note")
        return out

    def skill_install(
        self, *, slug: str, verify: bool, global_install: bool, git_fallback: bool = False
    ) -> dict[str, Any]:
        dest = self._skill_dir(slug)
        dest.parent.mkdir(parents=True, exist_ok=True)

        # 1) Local path install
        local = Path(slug).expanduser()
        if slug.startswith((".", "/", "~")) or local.exists():
            if not local.exists():
                return {"ok": False, "error": f"local path not found: {slug}"}
            if dest.exists():
                shutil.rmtree(dest, ignore_errors=True)
            shutil.copytree(local, dest)
            return self._finish_install(slug, dest, verify, source="local")

        # 2) git install: git:owner/repo@ref  OR  full git URL
        if slug.startswith("git:") or slug.endswith(".git") or slug.startswith("http"):
            return self._git_install(slug, dest, verify)

        # 3) ClawHub slug: owner/skill  -> registry tarball.
        res = self._registry_install(slug, dest, verify)
        if res.get("ok"):
            return res
        # Registry resolution failed. A blind git clone from github.com/<slug>
        # can install the WRONG repo and (on a slow/dead URL) hang for minutes,
        # so it is opt-in only. Surface a clear, actionable error otherwise.
        gh = f"https://github.com/{slug}"
        if git_fallback:
            fallback = self._git_install(f"git:{slug}", dest, verify)
            if fallback.get("ok"):
                fallback["note"] = "installed via git fallback"
                fallback["source_url"] = gh
                fallback["git_fallback"] = True
                return fallback
            return {
                "ok": False,
                "error": f"registry resolve failed and git fallback clone failed for '{slug}'.",
                "attempted_url": gh,
                "detail": fallback.get("error") or fallback.get("stderr"),
            }
        return {
            "ok": False,
            "error": res.get("error") or f"could not resolve slug '{slug}' via the {get_registry().id} registry.",
            "attempted_url": gh,
            "hint": "Pass git_fallback=true to try GitHub, or use 'git:owner/repo@ref' / a local path / backend: cli.",
        }

    def _git_install(self, slug: str, dest: Path, verify: bool) -> dict[str, Any]:
        git = _which("git")
        if not git:
            return {"ok": False, "error": "git not found on PATH"}
        ref = None
        spec = slug[4:] if slug.startswith("git:") else slug
        if "@" in spec and not spec.startswith("http"):
            spec, ref = spec.split("@", 1)
        url = spec if spec.startswith("http") else f"https://github.com/{spec}.git"
        if dest.exists():
            shutil.rmtree(dest, ignore_errors=True)
        argv = [git, "clone", "--depth", "1"]
        if ref:
            argv += ["--branch", ref]
        argv += [url, str(dest)]
        # Run git non-interactively so a missing/private repo fails fast instead
        # of blocking on a credential prompt (the usual cause of a "stuck"
        # install on Windows where Git Credential Manager pops a dialog).
        env = dict(os.environ)
        env["GIT_TERMINAL_PROMPT"] = "0"
        env.setdefault("GCM_INTERACTIVE", "Never")
        env.setdefault("GIT_ASKPASS", "")
        proc = subprocess.run(
            argv, capture_output=True, text=True, timeout=120, check=False, env=env
        )
        if proc.returncode != 0:
            return {"ok": False, "error": "git clone failed", "stderr": proc.stderr.strip()}
        return self._finish_install(slug, dest, verify, source="git")

    def _registry_install(self, slug: str, dest: Path, verify: bool) -> dict[str, Any]:
        reg = get_registry()
        # 1) Resolve the latest version
        meta = reg.resolve(slug)
        if not meta.get("ok"):
            return meta
        version = meta.get("version")
        if meta.get("blocked"):
            return {"ok": False, "error": f"'{slug}' is malware-blocked by {reg.id} moderation"}

        # 2) Download the ZIP
        dl = reg.download(slug, version)
        if not dl.get("ok"):
            return dl

        # 3) Extract the ZIP
        try:
            import io
            import zipfile

            if dest.exists():
                shutil.rmtree(dest, ignore_errors=True)
            dest.mkdir(parents=True, exist_ok=True)
            with zipfile.ZipFile(io.BytesIO(dl["bytes"])) as zf:
                self._safe_extract_zip(zf, dest)
        except Exception as exc:
            return {"ok": False, "error": f"extract failed: {exc}"}

        # 4) Record provenance (mirrors clawhub's .clawhub/origin.json)
        try:
            origin_dir = dest / ".clawhub"
            origin_dir.mkdir(exist_ok=True)
            (origin_dir / "origin.json").write_text(
                json.dumps({"slug": slug, "version": version,
                            "market": reg.id, "registry": reg.base()}),
                encoding="utf-8",
            )
        except Exception:
            pass

        out = self._finish_install(slug, dest, verify, source=reg.id)
        out["version"] = version
        out["market"] = reg.id
        # 5) Remote trust envelope (Skill Card / ClawScan verdict)
        if verify:
            tv = reg.verify(slug, version)
            if tv is not None:
                out["trust"] = tv
        return out

    @staticmethod
    def _safe_extract_zip(zf, dest: Path) -> None:
        """Extract a zip while preventing path traversal (zip-slip)."""
        dest_root = dest.resolve()
        for member in zf.namelist():
            target = (dest / member).resolve()
            if not str(target).startswith(str(dest_root)):
                raise ValueError(f"unsafe zip entry: {member}")
        zf.extractall(dest)  # noqa: S202 - members validated above

    def _finish_install(self, slug: str, dest: Path, verify: bool, *, source: str) -> dict[str, Any]:
        skill_md = dest / "SKILL.md"
        # some skills nest one level deep after clone
        if not skill_md.exists():
            for child in dest.iterdir():
                if child.is_dir() and (child / "SKILL.md").exists():
                    skill_md = child / "SKILL.md"
                    break
        out: dict[str, Any] = {
            "ok": skill_md.exists(),
            "installed": slug,
            "source": source,
            "skill_md_path": str(skill_md) if skill_md.exists() else None,
        }
        if not skill_md.exists():
            out["error"] = "no SKILL.md found in installed content"
            return out
        if verify:
            out.update(self._verify(skill_md))
        return out

    def _verify(self, skill_md: Path) -> dict[str, Any]:
        """Best-effort trust-envelope + requires.bins check."""
        result: dict[str, Any] = {"verified": True, "missing_bins": []}
        skill_dir = skill_md.parent
        # trust envelope / origin metadata
        for meta in ("origin.json", ".clawhub/origin.json", "clawhub.skill.verify.v1.json"):
            p = skill_dir / meta
            if p.exists():
                try:
                    result["origin"] = json.loads(p.read_text(encoding="utf-8"))
                except Exception:
                    result["origin"] = "<unparseable>"
                break
        # requires.bins from frontmatter (best-effort YAML parse)
        try:
            import yaml  # type: ignore

            text = skill_md.read_text(encoding="utf-8")
            if text.startswith("---"):
                fm = text.split("---", 2)[1]
                meta = yaml.safe_load(fm) or {}
                bins = (((meta.get("requires") or {}).get("bins")) or []) if isinstance(meta, dict) else []
                missing = [b for b in bins if not _which(str(b))]
                result["missing_bins"] = missing
                if missing:
                    result["verified"] = False
        except Exception:
            pass
        return result

    def skill_run(self, *, slug: str, entry: str, args: dict, sandbox: bool) -> dict[str, Any]:
        skill_dir = self._skill_dir(slug)
        if not skill_dir.exists():
            return {"ok": False, "error": f"skill not installed: {slug}"}
        entry_path = (skill_dir / entry).resolve()
        # path traversal guard
        if not str(entry_path).startswith(str(skill_dir.resolve())):
            return {"ok": False, "error": "entry escapes skill directory"}
        if not entry_path.exists():
            return {"ok": False, "error": f"entry not found: {entry}"}

        interpreter = self._interpreter_for(entry_path)
        if interpreter is None:
            return {"ok": False, "error": f"no interpreter for {entry_path.suffix or 'file'}"}
        # interpreter == [] means the entry is itself executable -> run directly
        argv = [*interpreter, str(entry_path)] if interpreter else [str(entry_path)]
        # pass args as JSON in env + as CLI flags (skills vary; provide both)
        env = dict(os.environ)
        env["CLAW_SKILL_ARGS"] = json.dumps(args or {})
        for k, v in (args or {}).items():
            argv += [f"--{k}", str(v)]

        if sandbox and _which("docker"):
            return self._docker_run(argv, cwd=str(skill_dir), env_extra={"CLAW_SKILL_ARGS": env["CLAW_SKILL_ARGS"]})
        return self._local_run(argv, cwd=str(skill_dir), env=env, timeout_s=get_settings().default_timeout_s)

    @staticmethod
    def _interpreter_for(path: Path) -> list[str] | None:
        """Resolve an interpreter argv prefix for a skill entry, cross-platform.

        Returns [] when the file should be executed directly (.exe/.bat/.cmd on
        Windows, or any +x file on POSIX), or None when nothing can run it.
        """
        ext = path.suffix.lower()
        table = {
            ".py": ["python"],
            ".js": ["node"],
            ".mjs": ["node"],
            ".sh": ["bash"],
            ".rb": ["ruby"],
            ".ps1": ["powershell", "-NoProfile", "-File"],
        }
        if ext in table:
            return table[ext] if _which(table[ext][0]) else None
        # Directly-runnable: Windows batch/exe, or POSIX executable bit.
        if ext in (".exe", ".bat", ".cmd"):
            return [] if _IS_WIN else None
        if not _IS_WIN and os.access(path, os.X_OK):
            return []
        return None

    def list_installed(self) -> dict[str, Any]:
        """List skills installed in the workspace (filesystem scan, deterministic)."""
        root = get_settings().workspace_dir() / "skills"
        items: list[dict[str, Any]] = []
        if root.is_dir():
            for child in sorted(root.iterdir()):
                if not child.is_dir() or child.name.startswith("."):
                    continue
                meta: dict[str, Any] = {}
                origin = child / ".clawhub" / "origin.json"
                if origin.exists():
                    try:
                        meta = json.loads(origin.read_text(encoding="utf-8"))
                    except Exception:
                        meta = {}
                has_skill_md = (child / "SKILL.md").exists() or any(
                    sub.is_dir() and (sub / "SKILL.md").exists() for sub in child.iterdir()
                )
                items.append({
                    "name": child.name,
                    "slug": meta.get("slug") or child.name,
                    "version": meta.get("version"),
                    "market": meta.get("market"),
                    "source": meta.get("registry"),
                    "has_skill_md": bool(has_skill_md),
                    "path": str(child),
                })
        return {"ok": True, "workspace": str(root), "count": len(items), "skills": items}

    def skill_update(self, *, slug: str | None, all_: bool) -> dict[str, Any]:
        """Re-resolve installed ClawHub skills and reinstall any that are stale."""
        skills_root = get_settings().workspace_dir() / "skills"
        targets: list[tuple[str, str | None]] = []
        if all_:
            if skills_root.exists():
                for child in skills_root.iterdir():
                    origin = child / ".clawhub" / "origin.json"
                    if origin.exists():
                        try:
                            o = json.loads(origin.read_text(encoding="utf-8"))
                            targets.append((o.get("slug") or child.name, o.get("version")))
                        except Exception:
                            continue
        elif slug:
            origin = self._skill_dir(slug) / ".clawhub" / "origin.json"
            cur = None
            if origin.exists():
                try:
                    cur = json.loads(origin.read_text(encoding="utf-8")).get("version")
                except Exception:
                    cur = None
            targets.append((slug, cur))
        else:
            return {"ok": False, "error": "pass slug or all=true"}

        reg = get_registry()
        results = []
        for sk, cur_ver in targets:
            meta = reg.resolve(sk)
            latest = meta.get("version") if meta.get("ok") else None
            if not meta.get("ok"):
                results.append({"slug": sk, "ok": False, "error": meta.get("error")})
                continue
            if latest and latest == cur_ver:
                results.append({"slug": sk, "ok": True, "updated": False, "version": cur_ver})
                continue
            inst = self._registry_install(sk, self._skill_dir(sk), verify=False)
            results.append({
                "slug": sk, "ok": bool(inst.get("ok")), "updated": bool(inst.get("ok")),
                "from": cur_ver, "to": inst.get("version"), "error": inst.get("error"),
            })
        return {"ok": all(r.get("ok") for r in results) if results else True,
                "checked": len(results), "results": results}

    # -- execution ---------------------------------------------------------
    def sandbox_exec(
        self, *, command: str, image: str, timeout_s: int, network: bool, workdir: str | None
    ) -> dict[str, Any]:
        if _which("docker"):
            return self._docker_exec(command, image, timeout_s, network, workdir)
        # local fallback (NOT a real sandbox) — clearly flagged, platform-aware
        res = self._local_run(_shell_argv(command), cwd=workdir, timeout_s=timeout_s)
        res["sandboxed"] = False
        res["warning"] = "docker not found; ran locally WITHOUT isolation"
        return res

    def _docker_exec(
        self, command: str, image: str, timeout_s: int, network: bool, workdir: str | None
    ) -> dict[str, Any]:
        name = f"clawlite_{uuid.uuid4().hex[:10]}"
        argv = ["docker", "run", "--rm", "--name", name]
        if not network:
            argv += ["--network", "none"]
        if workdir:
            argv += ["-v", f"{Path(workdir).resolve()}:/work", "-w", "/work"]
        argv += [image, "sh", "-c", command]
        res = self._local_run(argv, timeout_s=timeout_s + 10)
        res["sandboxed"] = True
        res["image"] = image
        res["network"] = network
        # rollback is implicit: --rm discards the container's filesystem on exit.
        res["rolled_back"] = (not res.get("ok")) and get_settings().rollback
        return res

    def _docker_run(self, argv: list[str], *, cwd: str, env_extra: dict[str, str]) -> dict[str, Any]:
        s = get_settings()
        mount = ["-v", f"{Path(cwd).resolve()}:/work", "-w", "/work"]
        env_flags: list[str] = []
        for k, v in env_extra.items():
            env_flags += ["-e", f"{k}={v}"]
        net = [] if s.sandbox_network else ["--network", "none"]
        full = ["docker", "run", "--rm", *net, *mount, *env_flags, s.sandbox_image, *argv]
        res = self._local_run(full, timeout_s=s.default_timeout_s + 10)
        res["sandboxed"] = True
        return res

    def browser(self, *, actions: list[dict], headless: bool) -> dict[str, Any]:
        try:
            try:
                from tools.lazy_deps import FeatureUnavailable, ensure  # type: ignore

                try:
                    ensure("omnilimb.playwright")
                except FeatureUnavailable as exc:
                    return {"ok": False, "error": str(exc)}
            except Exception:
                pass  # standalone: rely on a pre-installed playwright
            from playwright.sync_api import sync_playwright  # type: ignore
        except Exception:
            return {
                "ok": False,
                "error": "playwright not installed",
                "hint": "pip install playwright && playwright install chromium",
            }

        results: list[Any] = []
        shot_path = None
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=headless)
                page = browser.new_page()
                for act in actions:
                    if "goto" in act:
                        page.goto(act["goto"])
                        results.append({"goto": act["goto"], "ok": True})
                    elif "click" in act:
                        page.click(act["click"])
                        results.append({"click": act["click"], "ok": True})
                    elif "fill" in act:
                        sel, val = act["fill"]
                        page.fill(sel, val)
                        results.append({"fill": sel, "ok": True})
                    elif "wait" in act:
                        w = act["wait"]
                        if isinstance(w, int):
                            page.wait_for_timeout(w)
                        else:
                            page.wait_for_selector(str(w))
                        results.append({"wait": w, "ok": True})
                    elif "extract" in act:
                        loc = page.locator(act["extract"])
                        results.append({"extract": act["extract"], "text": loc.all_inner_texts()})
                    elif "eval" in act:
                        results.append({"eval": True, "value": page.evaluate(act["eval"])})
                    elif "screenshot" in act:
                        shot_path = str(get_settings().state_dir() / f"shot_{uuid.uuid4().hex[:8]}.png")
                        page.screenshot(path=shot_path, full_page=True)
                        results.append({"screenshot": shot_path})
                browser.close()
        except Exception as exc:
            return {"ok": False, "error": f"browser error: {exc}", "results": results}
        return {"ok": True, "results": results, "screenshot_path": shot_path}

    def runtime(self, *, lang: str, code: str, timeout_s: int) -> dict[str, Any]:
        spec = _LANG_CMD.get(lang)
        if lang == "go":
            return self._run_go(code, timeout_s)
        if spec is None:
            return {"ok": False, "error": f"unsupported lang: {lang}"}
        if not _which(spec[0]):
            return {"ok": False, "error": f"{spec[0]} not found on PATH"}
        return self._local_run([*spec, code], timeout_s=timeout_s)

    def _run_go(self, code: str, timeout_s: int) -> dict[str, Any]:
        if not _which("go"):
            return {"ok": False, "error": "go not found on PATH"}
        with tempfile.TemporaryDirectory() as td:
            f = Path(td) / "main.go"
            f.write_text(code, encoding="utf-8")
            return self._local_run(["go", "run", str(f)], cwd=td, timeout_s=timeout_s)

    # -- low-level ---------------------------------------------------------
    @staticmethod
    def _local_run(
        argv: list[str], *, cwd: str | None = None, env: dict | None = None, timeout_s: int = 120
    ) -> dict[str, Any]:
        try:
            proc = subprocess.run(
                argv,
                capture_output=True,
                text=True,
                cwd=cwd,
                env=env,
                timeout=timeout_s,
                check=False,
            )
        except FileNotFoundError as exc:
            return {"ok": False, "error": f"command not found: {exc}"}
        except subprocess.TimeoutExpired:
            return {"ok": False, "error": f"timeout after {timeout_s}s", "timed_out": True}
        return {
            "ok": proc.returncode == 0,
            "exit_code": proc.returncode,
            "stdout": (proc.stdout or "")[-20000:],
            "stderr": (proc.stderr or "")[-8000:],
        }
