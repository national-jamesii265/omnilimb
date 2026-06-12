"""Backend resolver — picks CLI vs native per config and caches the instance."""

from __future__ import annotations

import threading

from ..config import get_settings
from .base import Backend

_lock = threading.Lock()
_cache: dict[str, Backend] = {}


def get_backend() -> Backend:
    """Resolve the active backend (thread-safe, cached by resolved name)."""
    resolved = get_settings().resolved_backend()
    cached = _cache.get(resolved)
    if cached is not None:
        return cached
    with _lock:
        cached = _cache.get(resolved)
        if cached is not None:
            return cached
        if resolved == "cli":
            from .cli_backend import CliBackend

            backend: Backend = CliBackend()
        else:
            from .native_backend import NativeBackend

            backend = NativeBackend()
        _cache[resolved] = backend
        return backend


def reset_backend() -> None:
    """Drop cached backends (tests / config reload)."""
    with _lock:
        _cache.clear()


__all__ = ["Backend", "get_backend", "reset_backend"]
