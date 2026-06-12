"""Retry + rollback helper.

`with_retry` runs an operation that returns a result dict. It retries on
*recoverable* failures (exceptions, or dicts with a truthy `retryable` flag /
network-ish errors) up to `retries` times with exponential backoff. The operation
itself is responsible for being safe to retry — pass `retries=0` for
non-idempotent operations.
"""

from __future__ import annotations

import logging
import time
from typing import Any, Callable

logger = logging.getLogger(__name__)

_RETRYABLE_HINTS = ("timeout", "unreachable", "temporarily", "connection", "reset", "502", "503", "504")


def _looks_retryable(result: Any) -> bool:
    if not isinstance(result, dict):
        return False
    if result.get("ok"):
        return False
    if result.get("retryable") is True:
        return True
    err = str(result.get("error", "")).lower()
    return any(h in err for h in _RETRYABLE_HINTS)


def with_retry(
    op: Callable[[], dict],
    *,
    retries: int = 2,
    backoff_s: float = 1.0,
    rollback: bool = True,
) -> dict:
    attempt = 0
    last: dict = {"ok": False, "error": "not executed"}
    while True:
        try:
            result = op()
            if isinstance(result, dict) and result.get("ok"):
                if attempt:
                    result.setdefault("attempts", attempt + 1)
                return result
            last = result if isinstance(result, dict) else {"ok": False, "error": str(result)}
            if not _looks_retryable(last) or attempt >= retries:
                if rollback and not last.get("ok"):
                    last.setdefault("rolled_back", True)
                last.setdefault("attempts", attempt + 1)
                return last
        except Exception as exc:  # treat as retryable transient
            last = {"ok": False, "error": f"{type(exc).__name__}: {exc}"}
            if attempt >= retries:
                if rollback:
                    last.setdefault("rolled_back", True)
                last.setdefault("attempts", attempt + 1)
                return last
        sleep_for = backoff_s * (2**attempt)
        logger.debug("with_retry: attempt %s failed, sleeping %.1fs", attempt + 1, sleep_for)
        time.sleep(min(sleep_for, 30.0))
        attempt += 1
