#!/usr/bin/env python3
"""Local hands-on demo for Omnilimb — try every tool and see the JSON output.

This plugin has NO GUI (by design: headless execution engine). The way to
"experience" it is to call its tools and inspect the structured JSON they return.
This script lets you do that without installing Hermes.

Usage:
    python scripts/demo.py doctor
    python scripts/demo.py search <query> [limit]
    python scripts/demo.py list
    python scripts/demo.py runtime <lang> "<code>"
    python scripts/demo.py sandbox "<shell command>"
    python scripts/demo.py install <slug>
    python scripts/demo.py menu          # interactive

Backend is chosen by OMNILIMB_BACKEND (auto|cli|native); default auto.
Registry override: set CLAWHUB_REGISTRY to point at a different skills market.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from omnilimb import tools  # noqa: E402


def show(raw: str) -> None:
    try:
        print(json.dumps(json.loads(raw), indent=2, ensure_ascii=False))
    except Exception:
        print(raw)


def run(argv: list[str]) -> None:
    if not argv:
        argv = ["doctor"]
    cmd, rest = argv[0], argv[1:]

    if cmd == "doctor":
        print(tools.slash_claw("doctor"))
    elif cmd == "list":
        show(tools.claw_skill_list({}))
    elif cmd == "search":
        query = rest[0] if rest else "github"
        limit = int(rest[1]) if len(rest) > 1 else 5
        show(tools.claw_skill_search({"query": query, "limit": limit}))
    elif cmd == "runtime":
        lang = rest[0] if rest else "python"
        code = rest[1] if len(rest) > 1 else "print('hello from omnilimb')"
        show(tools.claw_runtime({"lang": lang, "code": code}))
    elif cmd == "sandbox":
        command = rest[0] if rest else "echo hello"
        show(tools.claw_sandbox_exec({"command": command}))
    elif cmd == "install":
        if not rest:
            print("usage: install <slug>")
            return
        show(tools.claw_skill_install({"slug": rest[0]}))
    elif cmd == "menu":
        _menu()
    else:
        print(__doc__)


def _menu() -> None:
    actions = {
        "1": ("doctor", lambda: print(tools.slash_claw("doctor"))),
        "2": ("list installed skills", lambda: show(tools.claw_skill_list({}))),
        "3": ("search ClawHub", lambda: show(
            tools.claw_skill_search({"query": input("  query: ") or "github", "limit": 5}))),
        "4": ("run python snippet", lambda: show(
            tools.claw_runtime({"lang": "python", "code": input("  code: ") or "print(2+2)"}))),
        "5": ("sandbox command", lambda: show(
            tools.claw_sandbox_exec({"command": input("  cmd: ") or "echo hi"}))),
        "q": ("quit", None),
    }
    while True:
        print("\n=== Omnilimb demo ===")
        for k, (label, _) in actions.items():
            print(f"  {k}) {label}")
        choice = input("> ").strip()
        if choice == "q":
            break
        entry = actions.get(choice)
        if entry and entry[1]:
            try:
                entry[1]()
            except Exception as exc:
                print("error:", exc)


if __name__ == "__main__":
    run(sys.argv[1:])
