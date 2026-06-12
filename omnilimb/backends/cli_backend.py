"""CLI backend — bridges to the real `openclaw` / `clawhub` Node CLIs.

This backend treats the official OpenClaw CLI as the source of truth. It is
version-tolerant: it shells out and parses the JSON envelope. Command surface
(verified against docs.openclaw.ai):

    openclaw skills search [query...] [--limit N] [--json]
    openclaw skills install <slug | git:owner/repo[@ref] | ./path> [--global] [--force]
    openclaw skills verify <slug>          # prints clawhub.skill.verify.v1 JSON (no --json flag)
    openclaw skills list [--json]

`--json` is appended to commands that support it; `verify` already emits JSON by
default so it gets no extra flag. We do NOT append `--non-interactive` to skills
subcommands — without a TTY the CLI is already non-interactive, and the flag is
not accepted everywhere. Browser/runtime fall back to the native backend
(Playwright / local subprocess) because those are deterministic and need no Node.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from functools import lru_cache
from typing import Any

from ..config import get_settings
from .base import Backend


@lru_cache(maxsize=1)
def openclaw_binary() -> str | None:
    explicit = os.environ.get("OMNILIMB_OPENCLAW_BIN")
    if explicit and shutil.which(explicit):
        return shutil.which(explicit)
    return shutil.which("openclaw")


@lru_cache(maxsize=1)
def clawhub_binary() -> str | None:
    explicit = os.environ.get("OMNILIMB_CLAWHUB_BIN")
    if explicit and shutil.which(explicit):
        return shutil.which(explicit)
    return shutil.which("clawhub") or shutil.which("npx")


def _run_cli(argv: list[str], *, timeout_s: int = 120) -> dict[str, Any]:
    """Run a CLI command and parse its JSON output (best-effort)."""
    try:
        proc = subprocess.run(
            argv,
            capture_output=True,
            text=True,
            timeout=timeout_s,
            check=False,
        )
    except FileNotFoundError:
        return {"ok": False, "error": f"binary not found: {argv[0]}"}
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": f"timeout after {timeout_s}s", "argv": argv}

    stdout = (proc.stdout or "").strip()
    parsed: Any = None
    if stdout:
        try:
            parsed = json.loads(stdout)
        except json.JSONDecodeError:
            # Some commands stream JSON lines; try the last line.
            for line in reversed(stdout.splitlines()):
                line = line.strip()
                if line.startswith("{") or line.startswith("["):
                    try:
                        parsed = json.loads(line)
                        break
                    except json.JSONDecodeError:
                        continue
    return {
        "ok": proc.returncode == 0,
        "exit_code": proc.returncode,
        "json": parsed,
        "stdout": stdout if parsed is None else None,
        "stderr": (proc.stderr or "").strip() or None,
    }


class CliBackend(Backend):
    name = "cli"

    def _openclaw(self, args: list[str], *, json_flag: bool = True, timeout_s: int = 120) -> dict[str, Any]:
        binp = openclaw_binary()
        if not binp:
            return {"ok": False, "error": "openclaw CLI not found on PATH"}
        argv = [binp, *args] + (["--json"] if json_flag else [])
        return _run_cli(argv, timeout_s=timeout_s)

    # -- skill registry ----------------------------------------------------
    def skill_search(self, *, query: str, limit: int, page: int = 1,
                     category: str | None = None, sort: str | None = None) -> dict[str, Any]:
        # The openclaw CLI only knows the ClawHub registry. For any other market
        # (e.g. skillhub) delegate to the native registry path so the configured
        # market — and its category/sort/pagination — is honored.
        if get_settings().market != "clawhub":
            from .native_backend import NativeBackend

            return NativeBackend().skill_search(
                query=query, limit=limit, page=page, category=category, sort=sort
            )
        args = ["skills", "search"]
        if query:
            args.append(query)
        args += ["--limit", str(limit)]
        res = self._openclaw(args)
        if not res.get("ok"):
            return res
        data = res.get("json")
        if isinstance(data, dict):
            skills = data.get("skills") or data.get("results") or data
        else:
            skills = data
        count = len(skills) if isinstance(skills, list) else None
        return {"ok": True, "market": "clawhub", "query": query, "count": count,
                "total": count, "page": page, "pageSize": limit, "skills": skills}

    def skill_install(
        self, *, slug: str, verify: bool, global_install: bool, git_fallback: bool = False
    ) -> dict[str, Any]:
        # The openclaw CLI installs from ClawHub only. For any other market
        # (e.g. skillhub) delegate to the native installer so the configured
        # market is honored even when the resolved backend is cli.
        if get_settings().market != "clawhub":
            from .native_backend import NativeBackend

            return NativeBackend().skill_install(
                slug=slug, verify=verify, global_install=global_install, git_fallback=git_fallback
            )
        # `install` natively handles slug, git:owner/repo[@ref] and ./local paths.
        args = ["skills", "install", slug]
        if global_install:
            args.append("--global")
        res = self._openclaw(args, timeout_s=300)
        if not res.get("ok"):
            return res
        out: dict[str, Any] = {"ok": True, "installed": slug, "detail": res.get("json")}
        if verify and not (slug.startswith("git:") or slug.startswith((".", "/", "~"))):
            # verify works against ClawHub slugs; it emits JSON by default (no --json).
            v = self._openclaw(["skills", "verify", slug], json_flag=False)
            out["verified"] = bool(v.get("ok"))
            out["verify_detail"] = v.get("json") or v.get("stderr")
        return out

    def skill_run(self, *, slug: str, entry: str, args: dict, sandbox: bool) -> dict[str, Any]:
        # OpenClaw has no generic "run a skill's script headless" verb; the
        # deterministic, portable path is to locate the installed skill dir and
        # execute the entry via the native runtime. This keeps behaviour identical
        # across backends.
        from .native_backend import NativeBackend

        return NativeBackend().skill_run(slug=slug, entry=entry, args=args, sandbox=sandbox)

    def skill_update(self, *, slug: str | None, all_: bool) -> dict[str, Any]:
        if all_:
            res = self._openclaw(["skills", "update", "--all"], timeout_s=600)
            return {"ok": bool(res.get("ok")), "updated": "all", "detail": res.get("json") or res.get("stderr")}
        # Per-slug update isn't a CLI verb; reuse the deterministic native path.
        from .native_backend import NativeBackend

        return NativeBackend().skill_update(slug=slug, all_=False)

    # -- execution: delegate to native (deterministic, no Node needed) -----
    def sandbox_exec(self, **kw: Any) -> dict[str, Any]:
        from .native_backend import NativeBackend

        return NativeBackend().sandbox_exec(**kw)

    def browser(self, **kw: Any) -> dict[str, Any]:
        from .native_backend import NativeBackend

        return NativeBackend().browser(**kw)

    def runtime(self, **kw: Any) -> dict[str, Any]:
        from .native_backend import NativeBackend

        return NativeBackend().runtime(**kw)
