"""Tiny SQLite-backed fallback cache for registry results (offline-first).

Goal: when the upstream skill market (ClawHub / SkillHub) is unreachable, serve
the last *successful* lookup instead of an empty/error result — so search keeps
working during an outage. Strategy is **live-first, cache-as-fallback**: a live
success is always preferred (and refreshes the cache); the cache is only served
when the live call fails. This avoids serving stale data while online.

Stdlib only (`sqlite3`), profile-safe path under `state_dir()`, and every
function is defensive — a cache failure must never break a tool call.
"""

from __future__ import annotations

import hashlib
import json
import sqlite3
import time
from typing import Any, Callable

from .config import get_settings


def _db_path() -> str:
    return str(get_settings().state_dir() / "cache.db")


def _conn() -> sqlite3.Connection:
    c = sqlite3.connect(_db_path(), timeout=5)
    c.execute("CREATE TABLE IF NOT EXISTS cache (k TEXT PRIMARY KEY, ts REAL, payload TEXT)")
    return c


def make_key(*parts: Any) -> str:
    raw = "|".join("" if p is None else str(p) for p in parts)
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()  # noqa: S324 - cache key, not security


def cache_get(key: str) -> dict | None:
    try:
        c = _conn()
        try:
            row = c.execute("SELECT ts, payload FROM cache WHERE k=?", (key,)).fetchone()
        finally:
            c.close()
        if not row:
            return None
        return {"ts": float(row[0]), "payload": json.loads(row[1])}
    except Exception:
        return None


def cache_put(key: str, payload: dict) -> None:
    try:
        c = _conn()
        try:
            c.execute(
                "INSERT OR REPLACE INTO cache (k, ts, payload) VALUES (?, ?, ?)",
                (key, time.time(), json.dumps(payload, ensure_ascii=False, default=str)),
            )
            c.commit()
        finally:
            c.close()
    except Exception:
        pass


def cache_fresh(key: str, max_age_s: int) -> dict | None:
    """Fast-path: return the cached payload only if it's younger than max_age_s.

    Unlike :func:`cached` (which serves stale data only on live failure), this is
    a *freshness* read used to skip a live call entirely when a recent result
    exists — the basis for snappy repeat/paginated searches.
    """
    hit = cache_get(key)
    if not hit or not isinstance(hit.get("payload"), dict):
        return None
    age = time.time() - hit["ts"]
    if age > max_age_s:
        return None
    out = dict(hit["payload"])
    out["from_cache"] = True
    out["cache_age_s"] = int(age)
    return out


def cached(
    key: str,
    fn: Callable[[], dict],
    *,
    enabled: bool = True,
    max_age_s: int = 604800,
) -> dict:
    """Run *fn*; cache a success; on failure serve the last cached result.

    Returns the live result when it succeeds (and refreshes the cache). On
    failure, returns the cached payload annotated with ``from_cache``/``stale``/
    ``cache_age_s`` when a cache entry exists and is younger than *max_age_s*;
    otherwise returns the live failure result unchanged.
    """
    if not enabled:
        try:
            return fn()
        except Exception as exc:
            return {"ok": False, "error": f"{type(exc).__name__}: {exc}", "retryable": True}
    try:
        res = fn()
    except Exception as exc:
        res = {"ok": False, "error": f"{type(exc).__name__}: {exc}", "retryable": True}
    if isinstance(res, dict) and res.get("ok"):
        cache_put(key, res)
        return res
    hit = cache_get(key)
    if hit:
        age = int(time.time() - hit["ts"])
        if age <= max_age_s and isinstance(hit["payload"], dict):
            out = dict(hit["payload"])
            out["from_cache"] = True
            out["stale"] = True
            out["cache_age_s"] = age
            out["cache_note"] = "upstream unavailable — served cached result"
            return out
    return res
