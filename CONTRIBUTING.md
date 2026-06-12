# Contributing to Omnilimb

Thanks for your interest in improving Omnilimb. This document covers how to set
up, test, and submit changes. This repository is the **free community edition**
(MIT).

## Ground rules

- **Hermes is the brain; Omnilimb is the hands/feet.** The execution path stays
  deterministic and **never calls an LLM itself** — zero extra model tokens.
- **The plugin must not import or modify Hermes core.** The single allowed
  exception is the guarded `hermes_constants` import in `config.py`, which has a
  fallback when Hermes isn't importable.
- **Every tool handler returns a JSON string and never raises.** Signature is
  `handler(args: dict, **kwargs) -> str`. Catch and serialize errors instead.
- Keep new dependencies minimal. Heavy/optional deps (Playwright) are lazily
  imported and declared as extras, not core requirements.

## Development setup

This repo is developed and tested on **Python 3.11**.

```bash
pip install -e ".[dev,browser]"
```

## Running tests

```bash
pytest -q
```

On Windows with the py launcher, pin the interpreter:

```powershell
py -3.11 -m pytest -q
```

- Add or update tests for any behavior change. New features and bug fixes need
  test coverage in `tests/test_omnilimb.py`.
- Property-based tests use Hypothesis; the `.hypothesis/` cache is git-ignored.

## Dashboard UI

The UI is a dependency-free IIFE at `omnilimb/dashboard/dist/index.js` using
`window.__HERMES_PLUGIN_SDK__`. After editing it, validate syntax:

```bash
node --check omnilimb/dashboard/dist/index.js
```

To see changes in a running dashboard, copy the plugin into your Hermes home and
restart `hermes dashboard`.

## Coding conventions

- Follow the existing style in each file; match the module's patterns.
- Backends implement the `Backend` ABC in `omnilimb/backends/base.py`. Adding a
  skill market = one adapter class in `omnilimb/registries.py`.
- User-facing strings in the dashboard go through the i18n table (provide at
  least `en` and `zh`; other locales fall back to English).
- Don't write to system directories or the user's hand-authored `config.yaml`.
  Dashboard settings persist to a separate overrides file
  (`omnilimb.overrides.json`); resolution order is env > overrides > config.yaml.

## Security

- Treat third-party skills as untrusted code. Preserve the sandbox defaults and
  path-traversal guards.
- See `SECURITY.md` for how to report vulnerabilities.

## Submitting changes

1. Branch from `main`.
2. Make the change with tests; run `pytest -q` (green) and `node --check` if you
   touched the UI.
3. Update `CHANGELOG.md`.
4. Open a pull request using the template. Describe what changed, what you
   tested, and any follow-ups.

## Releasing

Releases are tag-driven (`v*`): bump the version in `pyproject.toml`,
`omnilimb/__init__.py` (`__version__`), and `omnilimb/plugin.yaml`; add a
`CHANGELOG.md` entry; then push a `vX.Y.Z` tag. The release workflow builds and
attaches artifacts to the GitHub Release.
