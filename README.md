# Omnilimb — Hermes plugin

> Give your Hermes agent OpenClaw / ClawHub's hands and feet.
> Run community skills, an isolated sandbox, a Playwright browser, and
> multi-language runtimes — through a tiny structured-JSON tool surface, with
> **zero extra LLM tokens** on the execution path.

Hermes is the brain. Omnilimb is the deterministic execution substrate. It
never calls a model itself on the execution path, has no conversation/memory of
its own, and exposes a small set of structured-JSON tools plus an optional
dashboard UI.

> ℹ️ Compatible with OpenClaw & ClawHub; not affiliated with them.
> "Omnilimb" is an independent product (omnilimb.com).

## License & editions

> **This is an early test / community edition, licensed under MIT — free to use.
> A future stable version will adopt an AGPLv3 + commercial dual-license; please
> plan accordingly.**

This repository contains the **free community edition** only. It is feature-
complete for finding, installing, running, and managing OpenClaw / ClawHub
skills locally.

## Tools

Omnilimb registers these structured-JSON tools the agent can call:

| Tool | What it does |
|------|--------------|
| `claw_skill_search` | Search the ClawHub / SkillHub registry |
| `claw_skill_install` | Install + verify a skill (slug / `git:owner/repo@ref` / local path) |
| `claw_skill_run` | Deterministically run a skill's script entrypoint |
| `claw_sandbox_exec` | Run a command in an isolated (Docker) sandbox with rollback |
| `claw_browser` | Playwright browser automation via a structured action list |
| `claw_runtime` | Quick snippet in python / node / bash / ruby / go |
| `claw_skill_list` | List locally installed skills and their provenance |
| `claw_skill_runs` | Recent run history for installed skills (diagnostics) |

## Multiple skill markets

Switch the skills marketplace with `omnilimb.market` (or `OMNILIMB_MARKET`):

| Market | Source | Notes |
|--------|--------|-------|
| `clawhub` (default) | clawhub.ai | Official OpenClaw registry, HTTP API v1 |
| `skillhub` | api.skillhub.cn | China-focused market; server-side keyword search, public zip download |
| `clawhub-cn` | mirror-cn.clawhub.com | Official China mirror (Volcengine) |
| `skillsmp` | skillsmp.com | GitHub-hosted skill index |

You can add more markets in `~/.hermes/config.yaml` under `omnilimb.markets`
(each is `{id, type, base_url, label}` where `type` is one of
`clawhub | skillhub | clawhub_mirror | skillsmp`). Adding a new adapter class is
a small change in `omnilimb/registries.py`.

## Two interchangeable backends

Set `omnilimb.backend` in `~/.hermes/config.yaml` (or `OMNILIMB_BACKEND`):

| Mode | Behaviour |
|------|-----------|
| `cli` | Bridges to the real `openclaw` / `clawhub` CLIs. Best registry parity. Requires Node + OpenClaw installed. |
| `native` | Fully decoupled Python substrate. No Node needed. Handles sandbox/browser/runtime + `git:`/local skill installs natively. |
| `auto` (default) | `cli` if the `openclaw` binary is on PATH, else `native`. |

## Install

**As a directory plugin (simplest):**

```bash
cp -r omnilimb ~/.hermes/plugins/omnilimb
hermes plugins enable omnilimb
```

**As a pip package:**

```bash
pip install omnilimb               # core
pip install "omnilimb[browser]"    # + Playwright
playwright install chromium        # one-time browser download
hermes plugins enable omnilimb
```

Verify inside a session:

```
/exo doctor
```

## Configure (`~/.hermes/config.yaml`)

```yaml
omnilimb:
  backend: auto            # auto | cli | native
  market: clawhub          # clawhub | skillhub | clawhub-cn | skillsmp
  sandbox_enabled: true
  sandbox_image: "python:3.12-slim"
  sandbox_network: false
  default_timeout_s: 120
  max_retries: 2
  rollback: true
  registry_base_url: "https://clawhub.ai"
  browser_headless: true
  audit_log: false         # write a JSONL audit log of tool calls
  cache_enabled: true      # local SQLite cache for discovery + search fallback
  discover_ttl_s: 21600    # discovery leaderboard cache TTL (6h)
  cache_max_age_s: 604800  # max staleness for offline search fallback (7d)
```

Settings changed from the dashboard's **Settings** tab are written to a separate
overrides file (`omnilimb.overrides.json`), never to your hand-authored
`config.yaml`. Resolution order is env > overrides > `config.yaml`.

## Security

Third-party skills are untrusted code. Prefer `claw_sandbox_exec` with
`network: false` for anything you don't fully trust. Without Docker, sandbox
calls run locally and are flagged `"sandboxed": false`. Skill file operations
and uninstall are path-traversal guarded; archive extraction is zip-slip
protected.

## Dashboard UI (optional)

A web UI ships in `dashboard/` for the Hermes dashboard (`hermes dashboard`).
Install the plugin into your Hermes home and restart the dashboard:

```bash
cp -r omnilimb "$HERMES_HOME/plugins/omnilimb"   # default HERMES_HOME = ~/.hermes
# restart: hermes dashboard
```

An **Omnilimb** tab appears (after Skills) with these sub-tabs:

- **Search** — skill search/discovery across markets (toggle, leaderboards,
  categories) and a per-skill health check (体检).
- **Installed** — view/edit `SKILL.md`, run, smoke-test, manage credentials,
  check readiness, import/export, and uninstall installed skills.
- **Favorites** — bookmarked skills.
- **Audit** — the JSONL audit log (toggled by `omnilimb.audit_log`).
- **Settings** — backend / market / cache / paths, plus a diagnostics panel.

The UI follows the active dashboard theme and language automatically. Backend
routes are mounted at `/api/plugins/omnilimb/` on dashboard startup.

## Try it locally (no Hermes, no GUI)

```bash
python scripts/demo.py doctor                  # backend status
python scripts/demo.py list                    # installed skills
python scripts/demo.py search github 5         # live ClawHub search
python scripts/demo.py runtime python "print(6*7)"
python scripts/demo.py sandbox "echo hi"
python scripts/demo.py menu                     # interactive
```

## Development

```bash
pip install -e ".[dev,browser]"
pytest -q
```

## License

MIT (this plugin) — see `LICENSE`. Not affiliated with OpenClaw / ClawHub.
A future stable version will move to an AGPLv3 + commercial dual-license.
