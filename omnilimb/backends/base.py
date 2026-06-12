"""Backend abstract base class.

A backend is the deterministic execution substrate. Two implementations:
- CliBackend    : shells out to `openclaw` / `clawhub`.
- NativeBackend : decoupled Python re-implementation (no Node dependency).

All methods return a plain dict (NOT a JSON string); tools.py handles
serialization, retry, rollback and audit. Methods may raise — the caller
wraps them. Prefer returning {"ok": False, "error": ...} for expected
failures and raising only for unexpected ones.
"""

from __future__ import annotations

import abc
from typing import Any


class Backend(abc.ABC):
    name: str = "base"

    # -- skill registry ----------------------------------------------------
    @abc.abstractmethod
    def skill_search(self, *, query: str, limit: int, page: int = 1,
                     category: str | None = None, sort: str | None = None) -> dict[str, Any]: ...

    @abc.abstractmethod
    def skill_install(
        self, *, slug: str, verify: bool, global_install: bool, git_fallback: bool = False
    ) -> dict[str, Any]: ...

    @abc.abstractmethod
    def skill_run(
        self, *, slug: str, entry: str, args: dict, sandbox: bool
    ) -> dict[str, Any]: ...

    @abc.abstractmethod
    def skill_update(self, *, slug: str | None, all_: bool) -> dict[str, Any]: ...

    # -- execution ---------------------------------------------------------
    @abc.abstractmethod
    def sandbox_exec(
        self,
        *,
        command: str,
        image: str,
        timeout_s: int,
        network: bool,
        workdir: str | None,
    ) -> dict[str, Any]: ...

    @abc.abstractmethod
    def browser(self, *, actions: list[dict], headless: bool) -> dict[str, Any]: ...

    @abc.abstractmethod
    def runtime(self, *, lang: str, code: str, timeout_s: int) -> dict[str, Any]: ...
