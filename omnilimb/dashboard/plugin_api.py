"""Omnilimb dashboard — backend API routes (FastAPI).

Mounted by the Hermes dashboard at /api/plugins/omnilimb/. These endpoints thin-
wrap the plugin's tool handlers so the UI can drive the same headless engine the
agent uses. Each tool handler returns a JSON string; we parse and return a dict.

Importable regardless of how the plugin was installed (pip or directory drop-in):
we add the package's parent dir to sys.path so `import omnilimb` resolves.
"""

from __future__ import annotations

import contextlib
import json
import os
import re
import sys
import threading
from pathlib import Path

# Make `import omnilimb` work whether installed via pip or dropped into
# ~/.hermes/plugins/omnilimb/.  __file__ = .../omnilimb/dashboard/plugin_api.py
_PKG_DIR = Path(__file__).resolve().parents[1]          # .../omnilimb (package)
_PARENT = _PKG_DIR.parent                                # dir containing the package
if str(_PARENT) not in sys.path:
    sys.path.insert(0, str(_PARENT))

from fastapi import APIRouter  # noqa: E402

try:
    from omnilimb import tools  # noqa: E402
    from omnilimb.config import reload_settings, hermes_skills_dir  # noqa: E402
    from omnilimb.backends import reset_backend  # noqa: E402
except Exception as exc:  # pragma: no cover - surfaced to the UI
    tools = None
    _IMPORT_ERR = str(exc)
else:
    _IMPORT_ERR = ""

router = APIRouter()

# Serializes access to the shared, mutable backend state (the global settings
# cache + OMNILIMB_MARKET env that drives get_registry). Network-heavy endpoints
# are sync `def` so FastAPI runs them in its threadpool — that keeps the event
# loop free (UI stays responsive) while this lock preserves the single-flight
# semantics the handlers had when they ran serially on the loop.
_BACKEND_LOCK = threading.RLock()


@contextlib.contextmanager
def _market_override(market: str = ""):
    """Apply an optional per-request market override under the backend lock."""
    with _BACKEND_LOCK:
        prev = os.environ.get("OMNILIMB_MARKET")
        if market:
            os.environ["OMNILIMB_MARKET"] = market
            reload_settings()
            reset_backend()
        try:
            yield
        finally:
            if market:
                if prev is None:
                    os.environ.pop("OMNILIMB_MARKET", None)
                else:
                    os.environ["OMNILIMB_MARKET"] = prev
                reload_settings()
                reset_backend()


def _loads(raw: str) -> dict:
    try:
        return json.loads(raw)
    except Exception:
        return {"ok": False, "error": "unserializable tool result"}


def _friendly(result: dict) -> dict:
    """Feature H: attach human-friendly {reason, fix} to a failed result dict."""
    try:
        if isinstance(result, dict) and not result.get("ok") and result.get("error"):
            from omnilimb._errors import humanize

            f = humanize(result.get("error"))
            if f:
                result["friendly"] = f
    except Exception:
        pass
    return result


# Feature B: background install jobs (non-blocking + pollable + friendly errors).
_install_jobs: dict = {}
_install_lock = __import__("threading").Lock()


def _run_install_job(job_id: str, slug: str, market: str, git_fallback: bool) -> None:
    import time as _t

    prev = os.environ.get("OMNILIMB_MARKET")
    try:
        if market:
            os.environ["OMNILIMB_MARKET"] = market
            reload_settings()
            reset_backend()
        with _install_lock:
            if job_id in _install_jobs:
                _install_jobs[job_id]["stage"] = "download"
        res = _loads(tools.claw_skill_install(
            {"slug": slug, "verify": True, "git_fallback": git_fallback}
        ))
        res = _friendly(res)
        with _install_lock:
            j = _install_jobs.get(job_id)
            if j is not None:
                j["state"] = "done" if res.get("ok") else "failed"
                j["stage"] = "done"
                j["result"] = res
                j["finished"] = _t.time()
    except Exception as exc:
        with _install_lock:
            j = _install_jobs.get(job_id)
            if j is not None:
                j["state"] = "failed"
                j["stage"] = "done"
                j["result"] = _friendly({"ok": False, "error": f"{type(exc).__name__}: {exc}"})
                j["finished"] = _t.time()
    finally:
        if market:
            if prev is None:
                os.environ.pop("OMNILIMB_MARKET", None)
            else:
                os.environ["OMNILIMB_MARKET"] = prev
            reload_settings()
            reset_backend()


def _guard() -> dict | None:
    if tools is None:
        return {"ok": False, "error": f"omnilimb not importable: {_IMPORT_ERR}"}
    return None


@router.get("/status")
async def status() -> dict:
    err = _guard()
    if err:
        return err
    from omnilimb.config import get_settings
    from omnilimb.backends.cli_backend import openclaw_binary

    s = reload_settings()
    # Aggregate signals for the dashboard stat cards (local + cheap).
    try:
        _rsum = tools._runs_summary(tools.read_skill_runs(slug=None, limit=500))
    except Exception:
        _rsum = {"total": 0, "success_rate": None}
    try:
        from omnilimb.registries import list_markets

        _mkts_count = len(list_markets() or [])
    except Exception:
        _mkts_count = 0
    return {
        "ok": True,
        "version": getattr(__import__("omnilimb"), "__version__", "?"),
        "backend_configured": s.backend,
        "backend_resolved": s.resolved_backend(),
        "market": s.market,
        "markets_count": _mkts_count,
        "runs": {"total": int(_rsum.get("total", 0) or 0), "success_rate": _rsum.get("success_rate")},
        "openclaw_cli": openclaw_binary() or None,
        "sandbox_image": s.sandbox_image,
        "workspace": str(s.workspace_dir()),
    }


@router.get("/markets")
async def markets() -> dict:
    """List selectable skill markets (built-in + user-configured) for the UI dropdown."""
    err = _guard()
    if err:
        return err
    try:
        from omnilimb.registries import list_markets

        return {"ok": True, "markets": list_markets()}
    except Exception as exc:
        return {"ok": False, "error": str(exc),
                "markets": [{"id": "clawhub", "label": "ClawHub", "builtin": True}]}


@router.get("/search")
def search(q: str = "", market: str = "", limit: int = 12, page: int = 1,
           category: str = "", sort: str = "", browse: bool = False) -> dict:
    err = _guard()
    if err:
        return err
    # Optional per-request market override (no restart needed), serialized + in
    # the threadpool so it never blocks the dashboard event loop.
    with _market_override(market):
        a: dict = {"query": q, "limit": limit, "page": page}
        if category:
            a["category"] = category
        if sort:
            a["sort"] = sort
        if browse or not q:
            a["browse"] = True
        if q:
            try:
                tools.record_search(q)  # K: search history (best-effort)
            except Exception:
                pass
        return _loads(tools.claw_skill_search(a))


_DISCOVER_SORTS = [("recommended", "relevance"), ("rising", "stars"),
                   ("hot", "downloads"), ("newest", "latest")]
_DISCOVER_SORT_MAP = dict(_DISCOVER_SORTS)
_discover_lock = __import__("threading").Lock()
_discover_refreshing: set = set()


def _board_key(market: str, limit: int, tab: str) -> str:
    from omnilimb import _cache

    return _cache.make_key("discover_v2", market, limit, tab)


def _score_items(items: list) -> list:
    """Attach a quick health score (grade/score/recommendation) to market items,
    computed from each item's own metadata — pure function, no network."""
    try:
        from omnilimb import _scoring
    except Exception:
        return items or []
    for it in (items or []):
        try:
            meta = {
                "verified": it.get("verified"), "downloads": it.get("downloads"),
                "stars": it.get("stars"), "has_skill_md": True,
                "description": it.get("summary"), "version": it.get("version"),
                "requires_bins": [], "updated_at": it.get("updated_at"),
            }
            sc = _scoring.score_skill(meta)
            it["score"] = sc["score"]
            it["grade"] = sc["grade"]
            it["recommendation"] = sc["recommendation"]
        except Exception:
            pass
    return items or []


def _build_board(market: str, limit: int, tab: str) -> list:
    """Fetch one leaderboard for *market* (explicit market → thread-safe)."""
    from omnilimb.registries import get_registry

    reg = get_registry(market)
    so = _DISCOVER_SORT_MAP.get(tab, "relevance")
    try:
        res = reg.search("", limit, sort=so)  # empty query = browse
        return _score_items(res.get("skills", []) if res.get("ok") else [])
    except Exception:
        return []


def _refresh_board_bg(market: str, limit: int, tab: str) -> None:
    """Background single-board rebuild + cache (stale-while-revalidate, dedup)."""
    import threading

    rid = market + "|" + tab
    with _discover_lock:
        if rid in _discover_refreshing:
            return
        _discover_refreshing.add(rid)

    def run():
        try:
            from omnilimb import _cache

            sk = _build_board(market, limit, tab)
            _cache.cache_put(_board_key(market, limit, tab), {"ok": True, "skills": sk})
        except Exception:
            pass
        finally:
            with _discover_lock:
                _discover_refreshing.discard(rid)

    threading.Thread(target=run, daemon=True, name="omnilimb-board-refresh").start()


def _prewarm_discover() -> None:
    """Warm the default-market boards at startup — recommended first (fast), then
    the rest — so the first page open is instant. Fire-and-forget."""
    import threading

    def run():
        try:
            s = reload_settings()
            if not s.cache_enabled:
                return
            import time as _t

            from omnilimb import _cache

            for tab in ("recommended", "rising", "hot", "newest"):
                key = _board_key(s.market, s.discover_limit, tab)
                hit = _cache.cache_get(key)
                if hit and (_t.time() - hit["ts"]) < s.discover_ttl_s:
                    continue
                sk = _build_board(s.market, s.discover_limit, tab)
                _cache.cache_put(key, {"ok": True, "skills": sk})
        except Exception:
            pass

    threading.Thread(target=run, daemon=True, name="omnilimb-discover-prewarm").start()


@router.get("/discover")
async def discover(market: str = "", tab: str = "", force: bool = False) -> dict:
    """Discover leaderboards. Pass ``tab`` to get a single board fast (the UI
    loads "recommended" first, then prefetches the rest). Each board is cached
    independently in local SQLite; cold boards build in parallel off the loop,
    stale boards are served instantly and revalidated in the background.
    """
    err = _guard()
    if err:
        return err
    import asyncio
    import time as _time

    from omnilimb import _cache

    s = reload_settings()
    mk = (market or s.market or "clawhub").lower()
    limit = s.discover_limit
    ttl = s.discover_ttl_s
    if tab and tab not in _DISCOVER_SORT_MAP:
        return {"ok": False, "error": "unknown tab: " + tab}
    want = [tab] if tab else [tb for tb, _ in _DISCOVER_SORTS]

    sections: dict = {}
    meta: dict = {}
    cold: list = []
    now = _time.time()
    for tb in want:
        hit = _cache.cache_get(_board_key(mk, limit, tb)) if s.cache_enabled else None
        if hit and not force and isinstance(hit["payload"], dict):
            age = int(now - hit["ts"])
            sections[tb] = hit["payload"].get("skills", [])
            meta[tb] = {"cached": True, "age_s": age, "stale": age >= ttl}
            if age >= ttl:
                _refresh_board_bg(mk, limit, tb)
        else:
            cold.append(tb)

    if cold:
        def build_all():
            from concurrent.futures import ThreadPoolExecutor

            res = {}
            with ThreadPoolExecutor(max_workers=len(cold)) as ex:
                futs = {ex.submit(_build_board, mk, limit, tb): tb for tb in cold}
                for f in futs:
                    res[futs[f]] = f.result()
            return res

        built = await asyncio.get_event_loop().run_in_executor(None, build_all)
        for tb, sk in built.items():
            sections[tb] = sk
            meta[tb] = {"cached": False, "age_s": 0, "stale": False}
            if s.cache_enabled:
                _cache.cache_put(_board_key(mk, limit, tb), {"ok": True, "skills": sk})

    out = {"ok": True, "market": mk, "ttl_s": ttl, "sections": sections, "meta": meta}
    if tab:
        m = meta.get(tab, {})
        out["tab"] = tab
        out["skills"] = sections.get(tab, [])
        out["cached"] = m.get("cached", False)
        out["age_s"] = m.get("age_s", 0)
        out["stale"] = m.get("stale", False)
    return out


# Warm the discover cache in the background as soon as the plugin API loads.
try:
    if tools is not None:
        _prewarm_discover()
except Exception:
    pass


@router.get("/categories")
def categories(market: str = "") -> dict:
    """Distinct category slugs for the active market (sampled from popular skills)."""
    err = _guard()
    if err:
        return err
    with _market_override(market):
        from omnilimb.registries import get_registry

        reg = get_registry()
        try:
            cats = reg.list_categories()
        except Exception:
            cats = []
        return {"ok": True, "market": reg.id, "categories": cats}


@router.get("/audit")
def audit(tool: str = "", ok: str = "", limit: int = 200) -> dict:
    """Read the audit log (JSONL) with optional tool/status filters.

    Free for everyone to view — no license gate. Whether records are written is
    controlled separately by ``omnilimb.audit_log`` in config.yaml.
    """
    err = _guard()
    if err:
        return err

    s = reload_settings()
    path = s.state_dir() / "audit.jsonl"
    records: list[dict] = []
    tools_seen: list[str] = []
    want_ok = {"true": True, "false": False}.get(ok.lower()) if ok else None
    if path.exists():
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except Exception:
            lines = []
        for line in reversed(lines):  # newest first
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
            except Exception:
                continue
            tname = rec.get("tool")
            if tname and tname not in tools_seen:
                tools_seen.append(tname)
            if tool and tname != tool:
                continue
            if want_ok is not None and bool(rec.get("ok")) != want_ok:
                continue
            if len(records) < max(1, min(int(limit), 2000)):
                records.append(rec)
    return {
        "ok": True,
        "enabled": bool(s.audit_log),
        "count": len(records),
        "records": records,
        "tools": sorted(tools_seen),
        "log_path": str(path),
    }


@router.get("/installed")
def installed() -> dict:
    err = _guard()
    if err:
        return err
    out = _loads(tools.claw_skill_list({}))
    # Merge per-skill usage stats (call count + last run).
    try:
        usage = tools.read_usage()
        for sk in out.get("skills", []) or []:
            u = usage.get(sk.get("slug")) or usage.get(sk.get("name")) or {}
            sk["calls"] = int(u.get("count", 0))
            sk["last_ts"] = u.get("last_ts")
    except Exception:
        pass
    return out


@router.post("/uninstall")
async def uninstall(body: dict) -> dict:
    """Remove an installed skill directory (``<workspace>/skills/<slug>``).

    Path-guarded: the resolved target must live inside the skills root, so a
    crafted slug can't escape and delete arbitrary paths.
    """
    err = _guard()
    if err:
        return err
    import shutil

    slug = str(body.get("slug", "")).strip()
    if not slug:
        return {"ok": False, "error": "slug is required"}

    s = reload_settings()
    from omnilimb.backends.native_backend import NativeBackend

    skills_root = (s.workspace_dir() / "skills").resolve()
    # Resolve the real install dir the SAME way install/view do (_skill_dir applies
    # _safe_name, so "owner/skill" / "skill@1.0" map to the correct flat dir).
    target = NativeBackend()._skill_dir(slug).resolve()
    # Guard: target must be a direct, real child of skills_root (no traversal).
    if target == skills_root or target.parent != skills_root:
        return {"ok": False, "error": "invalid slug"}
    if not target.exists() or not target.is_dir():
        return {"ok": False, "error": f"skill not installed: {slug}"}
    try:
        shutil.rmtree(target)
        return {"ok": True, "slug": slug, "removed": str(target)}
    except Exception as exc:
        return {"ok": False, "error": f"uninstall failed: {type(exc).__name__}: {exc}"}


@router.get("/skill_runs")
async def skill_runs(slug: str = "", limit: int = 100, only_failed: bool = False) -> dict:
    """Per-skill run history + summary (recording and viewing are both free)."""
    err = _guard()
    if err:
        return err
    runs = tools.read_skill_runs(slug=(slug or None), limit=limit, only_failed=only_failed)
    return {
        "ok": True,
        "slug": slug or None,
        "count": len(runs),
        "runs": runs,
        "summary": tools._runs_summary(runs),
    }


def _declared_env_keys(slug: str) -> list:
    """Env-var/API-key names a skill declares it needs (from SKILL.md frontmatter)."""
    skill_dir, _, gerr = _resolve_skill_path(slug, None)
    if gerr:
        return []
    md = None
    try:
        for p in skill_dir.iterdir():
            if p.is_file() and p.name.lower() == "skill.md":
                md = p
                break
    except Exception:
        md = None
    text = ""
    if md is not None:
        try:
            text = md.read_text(encoding="utf-8")
        except Exception:
            text = ""
    return _parse_skill_frontmatter(text).get("requires_env", [])


@router.get("/skill_credentials")
async def skill_credentials(slug: str = "") -> dict:
    """Free: which API keys a skill declares + which are set (values never returned)."""
    err = _guard()
    if err:
        return err
    slug = (slug or "").strip()
    if not slug:
        return {"ok": False, "error": "slug is required"}
    have = tools.credentials_for(slug)
    return {
        "ok": True,
        "slug": slug,
        "declared": _declared_env_keys(slug),
        "set": sorted(have.keys()),
    }


@router.post("/skill_credentials")
async def skill_credentials_write(body: dict) -> dict:
    """Free: set (or clear when value empty) one credential for a skill. Never echoes values."""
    err = _guard()
    if err:
        return err
    slug = str(body.get("slug", "")).strip()
    key = str(body.get("key", "")).strip()
    value = body.get("value")
    if not slug or not key:
        return {"ok": False, "error": "slug and key are required"}
    tools.set_credential(slug, key, value)
    have = tools.credentials_for(slug)
    return {"ok": True, "slug": slug, "set": sorted(have.keys())}


# --- C: environment readiness check --------------------------------------
@router.get("/skill_requirements")
async def skill_requirements(slug: str = "") -> dict:
    """Free: check a skill's declared requires.bins + API keys against this machine."""
    err = _guard()
    if err:
        return err
    slug = (slug or "").strip()
    if not slug:
        return {"ok": False, "error": "slug is required"}
    from omnilimb.backends.native_backend import NativeBackend

    nb = NativeBackend()
    skill_dir, _, gerr = _resolve_skill_path(slug, None)
    bins: list = []
    envs: list = []
    if not gerr:
        md = None
        try:
            for p in skill_dir.iterdir():
                if p.is_file() and p.name.lower() == "skill.md":
                    md = p
                    break
        except Exception:
            md = None
        text = ""
        if md is not None:
            try:
                text = md.read_text(encoding="utf-8")
            except Exception:
                text = ""
        meta = _parse_skill_frontmatter(text)
        bins = meta.get("requires_bins", [])
        envs = meta.get("requires_env", [])
    have = tools.credentials_for(slug)
    checks: list = []
    for b in bins:
        present = False
        try:
            present = nb._which(b) is not None
        except Exception:
            present = False
        checks.append({"type": "bin", "name": b, "ok": present})
    for e in envs:
        checks.append({"type": "key", "name": e, "ok": e in have})
    from omnilimb import _scoring

    caps = _scoring.infer_capabilities({"requires_bins": bins, "requires_env": envs})
    return {"ok": True, "slug": slug, "ready": all(c["ok"] for c in checks) if checks else True,
            "checks": checks, "capabilities": caps}


# --- D: update-available indicator ---------------------------------------
_updates_cache: dict = {"ts": 0.0, "data": {}}
_updates_refreshing = {"v": False}
_UPDATES_TTL = 1800           # treat the update map as fresh for 30 min
_UPDATES_DISK_KEY = "skill_updates_v1"


def _compute_updates() -> dict:
    """Resolve every installed skill's latest version in parallel (slow, network)."""
    from concurrent.futures import ThreadPoolExecutor
    from omnilimb.registries import get_registry

    inst = _loads(tools.claw_skill_list({})).get("skills", []) or []
    reg_cache: dict = {}

    def _reg_for(mk):
        if mk not in reg_cache:
            try:
                reg_cache[mk] = get_registry(mk) if mk else get_registry()
            except Exception:
                reg_cache[mk] = get_registry()
        return reg_cache[mk]

    def _one(sk):
        slug = sk.get("slug") or sk.get("name")
        cur = sk.get("version")
        if not slug:
            return None
        latest = None
        try:
            meta = _reg_for(sk.get("market")).resolve(slug)
            latest = meta.get("version") if meta.get("ok") else None
        except Exception:
            latest = None
        return slug, {"current": cur, "latest": latest,
                      "update_available": bool(latest and cur and str(latest) != str(cur))}

    updates: dict = {}
    if inst:
        with ThreadPoolExecutor(max_workers=min(len(inst), 16)) as ex:
            for res in ex.map(_one, inst):
                if res:
                    updates[res[0]] = res[1]
    return updates


def _store_updates(data: dict) -> None:
    import time as _t

    _updates_cache["ts"] = _t.time()
    _updates_cache["data"] = data
    try:
        from omnilimb import _cache

        _cache.cache_put(_UPDATES_DISK_KEY, {"ok": True, "ts": _updates_cache["ts"], "updates": data})
    except Exception:
        pass


def _seed_updates_from_disk() -> None:
    if _updates_cache["data"]:
        return
    try:
        from omnilimb import _cache

        hit = _cache.cache_get(_UPDATES_DISK_KEY)
        if hit and isinstance(hit.get("payload"), dict):
            p = hit["payload"]
            _updates_cache["data"] = p.get("updates", {}) or {}
            _updates_cache["ts"] = float(p.get("ts", 0) or 0)
    except Exception:
        pass


def _refresh_updates_bg() -> None:
    if _updates_refreshing["v"]:
        return
    _updates_refreshing["v"] = True

    def run():
        try:
            _store_updates(_compute_updates())
        except Exception:
            pass
        finally:
            _updates_refreshing["v"] = False

    threading.Thread(target=run, daemon=True, name="omnilimb-updates").start()


@router.get("/skill_updates")
def skill_updates(force: bool = False) -> dict:
    """Free: which installed skills have a newer version upstream.

    Stale-while-revalidate: returns the cached map **instantly** (memory → disk)
    and kicks a background refresh when stale/cold, so opening the Installed tab
    never waits on ~N serial market round-trips. The version-badge fills in on a
    later open once the background check finishes.
    """
    err = _guard()
    if err:
        return err
    import time as _t

    if not force and _updates_cache["data"] and (_t.time() - _updates_cache["ts"]) < _UPDATES_TTL:
        return {"ok": True, "cached": True, "updates": _updates_cache["data"]}
    _seed_updates_from_disk()
    have = bool(_updates_cache["data"])
    age = _t.time() - _updates_cache["ts"]
    if force or not have or age >= _UPDATES_TTL:
        _refresh_updates_bg()
    return {"ok": True, "cached": have, "refreshing": _updates_refreshing["v"],
            "updates": _updates_cache["data"]}


# --- G: one-click smoke test ---------------------------------------------
def _guess_entry(slug: str) -> str:
    """Best-effort: find a likely runnable entry inside an installed skill."""
    skill_dir, _, gerr = _resolve_skill_path(slug, None)
    if gerr:
        return ""
    prefer = ["main.py", "run.py", "cli.py", "index.js", "main.js", "run.sh"]
    try:
        root = skill_dir.resolve()
        files = [str(p.resolve().relative_to(root)).replace("\\", "/")
                 for p in skill_dir.rglob("*") if p.is_file()]
    except Exception:
        files = []
    low = {f.lower(): f for f in files}
    for cand in prefer:
        for lf, f in low.items():
            if lf == cand or lf.endswith("/" + cand):
                return f
    for f in files:  # fall back to first script-like file
        if f.lower().endswith((".py", ".sh", ".js")):
            return f
    return ""


@router.post("/skill_smoketest")
def skill_smoketest(body: dict) -> dict:
    """Free: run a skill once (sample/empty args) to confirm it works. Recorded in run history."""
    err = _guard()
    if err:
        return err
    slug = str(body.get("slug", "")).strip()
    if not slug:
        return {"ok": False, "error": "slug is required"}
    entry = str(body.get("entry", "")).strip() or _guess_entry(slug)
    if not entry:
        return {"ok": False, "kind": "doc", "error": "no runnable entry found",
                "friendly": {"reason": "这是纯文档型技能（没有可运行脚本）", "fix": "无需冒烟测试 —— 它给 Agent 提供说明/提示词，不是可执行命令。若确有脚本，可在详情页指定 entry。"}}
    res = _loads(tools.claw_skill_run({"slug": slug, "entry": entry, "args": body.get("args") or {}}))
    res["entry"] = entry
    return _friendly(res)


# --- E: settings (UI-editable; written to overrides, never config.yaml) ---
_SETTINGS_WHITELIST = {
    "backend", "market", "workspace", "discover_ttl_s", "discover_limit",
    "cache_enabled", "cache_max_age_s", "audit_log", "sandbox_image",
    "browser_headless", "sandbox_network",
}


@router.get("/settings")
async def settings_get() -> dict:
    err = _guard()
    if err:
        return err
    s = reload_settings()
    return {
        "ok": True,
        "settings": {k: getattr(s, k) for k in sorted(_SETTINGS_WHITELIST)},
        "editable": sorted(_SETTINGS_WHITELIST),
    }


@router.post("/settings")
async def settings_set(body: dict) -> dict:
    err = _guard()
    if err:
        return err
    import json as _json

    from omnilimb.config import _overrides_path

    changes = body.get("settings") or body
    clean: dict = {}
    for k, v in changes.items():
        if k not in _SETTINGS_WHITELIST:
            continue
        if k == "backend":
            if str(v).lower() not in ("auto", "cli", "native"):
                return {"ok": False, "error": f"invalid backend: {v}"}
            clean[k] = str(v).lower()
        elif k == "market":
            try:
                from omnilimb.registries import list_markets
                valid = {m["id"] for m in list_markets()}
            except Exception:
                valid = {"clawhub", "skillhub"}
            if str(v).lower() not in valid:
                return {"ok": False, "error": f"invalid market: {v}"}
            clean[k] = str(v).lower()
        elif k in ("discover_ttl_s", "discover_limit", "cache_max_age_s"):
            try:
                clean[k] = int(v)
            except Exception:
                return {"ok": False, "error": f"{k} must be an integer"}
        elif k in ("cache_enabled", "audit_log", "browser_headless", "sandbox_network"):
            clean[k] = bool(v)
        else:
            clean[k] = str(v)
    p = _overrides_path()
    cur: dict = {}
    if p.exists():
        try:
            cur = _json.loads(p.read_text(encoding="utf-8")) or {}
        except Exception:
            cur = {}
    cur.update(clean)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(_json.dumps(cur, indent=2, ensure_ascii=False), encoding="utf-8")
    reload_settings()
    return {"ok": True, "saved": clean}


# --- skill health + Hermes-fit score (free, per-skill) -------------------
@router.get("/skill_score")
def skill_score(slug: str = "") -> dict:
    """Free (per-skill): transparent 0-100 health/fit score for a skill.

    Single-skill scoring is free — users click each skill's 体检 one by one. The
    batch "全部体检" convenience is gated to Pro in the UI, not here.
    """
    err = _guard()
    if err:
        return err
    slug = (slug or "").strip()
    if not slug:
        return {"ok": False, "error": "slug is required"}

    from omnilimb import _scoring
    from omnilimb.backends.native_backend import NativeBackend

    nb = NativeBackend()
    meta: dict = {"requires_bins": [], "requires_env": [], "has_skill_md": False}
    installed_bins: set = set()

    # Local SKILL.md (installed skills)
    skill_dir, _, gerr = _resolve_skill_path(slug, None)
    installed = gerr is None
    if installed:
        md = None
        try:
            for p in skill_dir.iterdir():
                if p.is_file() and p.name.lower() == "skill.md":
                    md = p
                    break
        except Exception:
            md = None
        text = ""
        if md is not None:
            meta["has_skill_md"] = True
            try:
                text = md.read_text(encoding="utf-8")
            except Exception:
                text = ""
        fm = _parse_skill_frontmatter(text)
        meta["description"] = fm.get("description")
        meta["requires_bins"] = fm.get("requires_bins", [])
        meta["requires_env"] = fm.get("requires_env", [])

    # Enrich with market metadata (verified/downloads/stars/version/updated_at) — best effort.
    try:
        from omnilimb.registries import get_registry

        rmeta = get_registry().resolve(slug)
        if rmeta and rmeta.get("ok"):
            for k in ("verified", "downloads", "stars", "installs", "version", "updated_at",
                      "license", "source", "description", "moderation_clean"):
                if rmeta.get(k) is not None and not meta.get(k):
                    meta[k] = rmeta.get(k)
            meta["requires_api_key"] = bool(rmeta.get("requires_api_key"))
            # A resolvable published skill ships a manifest; don't penalise its
            # completeness just because it isn't installed locally yet.
            if not installed:
                meta["has_skill_md"] = True
    except Exception:
        pass

    for b in meta.get("requires_bins", []):
        try:
            if nb._which(b) is not None:
                installed_bins.add(b)
        except Exception:
            pass

    runs_summary = None
    if installed:
        runs_summary = tools._runs_summary(tools.read_skill_runs(slug=slug, limit=200))

    result = _scoring.score_skill(meta, installed_bins=installed_bins, runs_summary=runs_summary)
    result["ok"] = True
    result["slug"] = slug
    result["installed"] = installed
    return result


# --- I: import / export installed skill set ------------------------------
@router.get("/export_skills")
async def export_skills() -> dict:
    """Free: export the installed skill set as a portable manifest."""
    err = _guard()
    if err:
        return err
    import time as _t

    inst = _loads(tools.claw_skill_list({})).get("skills", []) or []
    items = [{"slug": s.get("slug") or s.get("name"), "version": s.get("version"),
              "market": s.get("market")} for s in inst if (s.get("slug") or s.get("name"))]
    return {"ok": True, "exported_at": _t.time(), "count": len(items), "skills": items}


@router.post("/import_skills")
def import_skills(body: dict) -> dict:
    """Free: install every skill in a manifest (sequential, per-skill results)."""
    err = _guard()
    if err:
        return err
    manifest = body.get("manifest") if isinstance(body.get("manifest"), dict) else body
    skills = (manifest or {}).get("skills") or []
    results: list = []
    for it in skills:
        slug = (it.get("slug") if isinstance(it, dict) else str(it)) or ""
        market = it.get("market") if isinstance(it, dict) else ""
        slug = str(slug).strip()
        if not slug:
            continue
        with _market_override(str(market) if market else ""):
            try:
                r = _loads(tools.claw_skill_install({"slug": slug, "verify": True}))
            except Exception as exc:
                r = {"ok": False, "error": f"{type(exc).__name__}: {exc}"}
        results.append({"slug": slug, "ok": bool(r.get("ok")), "error": r.get("error")})
    return {"ok": all(x["ok"] for x in results) if results else True,
            "count": len(results), "results": results}


# --- K: favorites + search history ---------------------------------------
@router.get("/favorites")
async def favorites() -> dict:
    err = _guard()
    if err:
        return err
    return {"ok": True, "favorites": tools.read_favorites()}


@router.post("/favorites")
async def favorites_write(body: dict) -> dict:
    err = _guard()
    if err:
        return err
    slug = str(body.get("slug", "")).strip()
    if not slug:
        return {"ok": False, "error": "slug is required"}
    add = bool(body.get("add", True))
    meta = body.get("meta") if isinstance(body.get("meta"), dict) else None
    return {"ok": True, "favorites": tools.toggle_favorite(slug, add, meta)}


@router.get("/search_history")
async def search_history() -> dict:
    err = _guard()
    if err:
        return err
    return {"ok": True, "history": tools.read_search_history()}


def _resolve_skill_path(slug: str, rel: str | None):
    """Resolve <skill_dir>/<rel> with path-traversal protection.

    Returns (skill_dir, target_path_or_None, error_dict_or_None).
    """
    from omnilimb.backends.native_backend import NativeBackend

    skill_dir = NativeBackend()._skill_dir(slug)
    if not skill_dir.exists():
        return skill_dir, None, {"ok": False, "error": f"skill not installed: {slug}"}
    if rel is None:
        return skill_dir, None, None
    target = (skill_dir / rel).resolve()
    if not str(target).startswith(str(skill_dir.resolve())):
        return skill_dir, None, {"ok": False, "error": "path escapes skill directory"}
    return skill_dir, target, None


_EDITABLE_MAX_BYTES = 256 * 1024
_BINARY_EXT = {".png", ".jpg", ".jpeg", ".gif", ".zip", ".gz", ".whl", ".so", ".dll", ".exe", ".ico", ".pdf"}


def _parse_skill_frontmatter(text: str) -> dict:
    """Best-effort parse of SKILL.md YAML frontmatter → {description, homepage, requires_bins}."""
    meta: dict = {}
    try:
        if text.startswith("---"):
            import yaml  # type: ignore

            fm = text.split("---", 2)[1]
            data = yaml.safe_load(fm) or {}
            if isinstance(data, dict):
                meta["name"] = data.get("name")
                meta["description"] = data.get("description") or data.get("summary")
                meta["homepage"] = data.get("homepage") or (data.get("metadata") or {}).get("homepage")
                req = data.get("requires") or {}
                bins = req.get("bins") if isinstance(req, dict) else None
                meta["requires_bins"] = [str(b) for b in bins] if isinstance(bins, list) else []
                env = None
                if isinstance(req, dict):
                    env = req.get("env") or req.get("api_keys") or req.get("secrets")
                env = env or data.get("env")
                meta["requires_env"] = [str(e) for e in env] if isinstance(env, list) else []
    except Exception:
        pass
    return meta


@router.get("/skill")
async def skill(slug: str = "") -> dict:
    """List a skill's files + return its SKILL.md (with parsed meta) for view/edit."""
    err = _guard()
    if err:
        return err
    slug = (slug or "").strip()
    if not slug:
        return {"ok": False, "error": "slug is required"}
    skill_dir, _, gerr = _resolve_skill_path(slug, None)
    if gerr:
        return gerr
    files: list[str] = []
    skill_md = ""
    root = skill_dir.resolve()
    for p in sorted(skill_dir.rglob("*")):
        if p.is_dir():
            continue
        rel = str(p.resolve().relative_to(root)).replace("\\", "/")
        if rel.startswith(".git/") or "/.git/" in ("/" + rel):
            continue
        files.append(rel)
        if rel.lower() == "skill.md" and not skill_md:
            try:
                skill_md = p.read_text(encoding="utf-8")[:_EDITABLE_MAX_BYTES]
            except Exception:
                skill_md = ""
    return {"ok": True, "slug": slug, "dir": str(skill_dir), "files": files,
            "skill_md": skill_md, "meta": _parse_skill_frontmatter(skill_md)}


@router.get("/skill_file")
async def skill_file(slug: str = "", path: str = "") -> dict:
    """Read a single text file inside a skill directory."""
    err = _guard()
    if err:
        return err
    slug = (slug or "").strip()
    path = (path or "").strip()
    if not slug or not path:
        return {"ok": False, "error": "slug and path are required"}
    _, target, gerr = _resolve_skill_path(slug, path)
    if gerr:
        return gerr
    if target is None or not target.exists() or not target.is_file():
        return {"ok": False, "error": f"file not found: {path}"}
    if target.suffix.lower() in _BINARY_EXT:
        return {"ok": False, "error": "binary file not editable", "binary": True}
    try:
        if target.stat().st_size > _EDITABLE_MAX_BYTES:
            return {"ok": False, "error": "file too large to edit"}
        return {"ok": True, "slug": slug, "path": path, "content": target.read_text(encoding="utf-8")}
    except Exception as exc:
        return {"ok": False, "error": f"read failed: {exc}"}


@router.post("/skill_file")
async def skill_file_write(body: dict) -> dict:
    """Write/edit a single text file inside a skill directory (path-guarded)."""
    err = _guard()
    if err:
        return err
    slug = str(body.get("slug", "")).strip()
    path = str(body.get("path", "")).strip()
    content = body.get("content")
    if not slug or not path or content is None:
        return {"ok": False, "error": "slug, path and content are required"}
    if not isinstance(content, str) or len(content.encode("utf-8")) > _EDITABLE_MAX_BYTES:
        return {"ok": False, "error": "content must be text under 256KB"}
    _, target, gerr = _resolve_skill_path(slug, path)
    if gerr:
        return gerr
    if target is None:
        return {"ok": False, "error": "invalid path"}
    if target.suffix.lower() in _BINARY_EXT:
        return {"ok": False, "error": "binary file not editable"}
    try:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
        return {"ok": True, "slug": slug, "path": path, "bytes": len(content.encode("utf-8"))}
    except Exception as exc:
        return {"ok": False, "error": f"write failed: {exc}"}


# ---------------------------------------------------------------------------
# Health probe (cached). The raw probe runs a live market search (~2-3s) plus an
# `openclaw --version` subprocess, which made the StatusBar block the whole page
# on every open. We compute it off the event loop, cache it (TTL), serve cached
# instantly, and revalidate stale results in the background (stale-while-
# revalidate). Startup prewarm makes even the first open instant.
# ---------------------------------------------------------------------------
_HEALTH_TTL = 60.0
_health_cache: dict = {"payload": None, "ts": 0.0}
_health_lock = __import__("threading").Lock()
_health_refreshing = False


def _compute_health() -> dict:
    """Expensive, blocking health probe — always run in a worker thread."""
    import subprocess
    import time as _time

    from omnilimb.backends.cli_backend import openclaw_binary

    s = reload_settings()
    resolved = s.resolved_backend()

    cli = openclaw_binary()
    openclaw_installed = cli is not None
    openclaw_version = None
    if openclaw_installed:
        try:
            proc = subprocess.run(
                [cli, "--version"], capture_output=True, text=True, timeout=5, check=False
            )
            openclaw_version = (proc.stdout or proc.stderr or "").strip().splitlines()[0] if (
                proc.stdout or proc.stderr
            ) else None
        except Exception:
            openclaw_version = None

    t0 = _time.time()
    probe = _loads(tools.claw_skill_search({"query": "a", "limit": 1}))
    dt = int((_time.time() - t0) * 1000)
    market_reachable = bool(probe.get("ok"))
    healthy = market_reachable and (resolved != "cli" or openclaw_installed)

    checks = [
        {"name": "backend", "ok": True, "detail": f"{s.backend} → {resolved}"},
        {"name": "openclaw", "ok": (resolved != "cli") or openclaw_installed,
         "detail": (openclaw_version or cli or "not required (native backend)")},
        {"name": "market", "ok": market_reachable,
         "detail": (probe.get("error") or f"{s.market} reachable ({dt}ms)")},
    ]
    return {
        "ok": True,
        "healthy": healthy,
        "openclaw_installed": openclaw_installed,
        "openclaw_version": openclaw_version,
        "backend": resolved,
        "market": s.market,
        "market_reachable": market_reachable,
        "checks": checks,
    }


def _store_health(payload: dict) -> None:
    import time as _time

    _health_cache["payload"] = payload
    _health_cache["ts"] = _time.time()


def _refresh_health_bg() -> None:
    """Background, deduplicated health recompute (stale-while-revalidate)."""
    global _health_refreshing
    import threading

    with _health_lock:
        if _health_refreshing:
            return
        _health_refreshing = True

    def run():
        global _health_refreshing
        try:
            _store_health(_compute_health())
        except Exception:
            pass
        finally:
            with _health_lock:
                _health_refreshing = False

    threading.Thread(target=run, daemon=True, name="omnilimb-health-refresh").start()


@router.get("/health")
async def health() -> dict:
    """Health probe consumed by the StatusBar — cached + non-blocking.

    Fields match what the dashboard UI reads: ``openclaw_installed``,
    ``openclaw_version``, ``healthy``, plus a detailed ``checks`` list. Adds
    ``cached``/``age_s`` so the UI can show freshness.
    """
    err = _guard()
    if err:
        return err
    import asyncio
    import time as _time

    cached = _health_cache["payload"]
    if cached is not None:
        age = _time.time() - _health_cache["ts"]
        out = dict(cached)
        out["cached"] = True
        out["age_s"] = int(age)
        if age >= _HEALTH_TTL:
            _refresh_health_bg()  # serve stale now, refresh in background
        return out

    # Cold path: compute once off the event loop so we never block it, then cache.
    payload = await asyncio.get_event_loop().run_in_executor(None, _compute_health)
    _store_health(payload)
    out = dict(payload)
    out["cached"] = False
    out["age_s"] = 0
    return out


@router.post("/runtime")
def runtime(body: dict) -> dict:
    err = _guard()
    if err:
        return err
    lang = str(body.get("lang", "python"))
    code = str(body.get("code", ""))
    return _loads(tools.claw_runtime({"lang": lang, "code": code}))


@router.post("/sandbox")
def sandbox(body: dict) -> dict:
    err = _guard()
    if err:
        return err
    command = str(body.get("command", ""))
    return _loads(tools.claw_sandbox_exec({"command": command}))


@router.post("/install")
async def install(body: dict) -> dict:
    """Start a non-blocking install job. Returns a job_id to poll via /install_status.

    The old synchronous behaviour blocked the request (and the UI) for the whole
    resolve→download→verify, which felt like a hang. Now we run it on a background
    thread and the UI polls for progress + a friendly error on failure.
    """
    err = _guard()
    if err:
        return err
    import threading
    import time as _t
    import uuid as _uuid

    slug = str(body.get("slug", "")).strip()
    if not slug:
        return {"ok": False, "error": "slug is required"}
    market = str(body.get("market", ""))
    git_fallback = bool(body.get("git_fallback", False))

    job_id = _uuid.uuid4().hex[:12]
    with _install_lock:
        # prune old finished jobs (keep the map small)
        done = [k for k, v in _install_jobs.items()
                if v.get("finished") and (_t.time() - v["finished"]) > 600]
        for k in done:
            _install_jobs.pop(k, None)
        _install_jobs[job_id] = {
            "id": job_id, "slug": slug, "market": market or None,
            "state": "running", "stage": "resolve", "started": _t.time(),
            "finished": None, "result": None,
        }

    threading.Thread(
        target=_run_install_job, args=(job_id, slug, market, git_fallback),
        daemon=True, name="omnilimb-install",
    ).start()
    return {"ok": True, "job_id": job_id, "state": "running"}


@router.get("/install_status")
async def install_status(id: str = "") -> dict:
    """Poll an install job started by POST /install."""
    err = _guard()
    if err:
        return err
    import time as _t

    with _install_lock:
        j = _install_jobs.get(id)
        if not j:
            return {"ok": False, "error": "unknown or expired job"}
        out = {k: j.get(k) for k in ("id", "slug", "state", "stage", "result", "started", "finished")}
    out["ok"] = True
    out["elapsed_s"] = int((out.get("finished") or _t.time()) - out["started"])
    return out


# Warm the health probe in the background at startup so the StatusBar's first
# render is instant (the live market probe + openclaw --version are expensive).
try:
    if tools is not None:
        _refresh_health_bg()
except Exception:
    pass
