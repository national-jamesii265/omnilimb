# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/); versioning is [SemVer](https://semver.org/).

## [0.8.0] - 2026-06-12

First public release — the **free community edition**, licensed under MIT.

> A future stable version will adopt an AGPLv3 + commercial dual-license.

### Added
- Eight structured-JSON tools for Hermes: `claw_skill_search`,
  `claw_skill_install`, `claw_skill_run`, `claw_sandbox_exec`, `claw_browser`,
  `claw_runtime`, `claw_skill_list`, `claw_skill_runs`.
- Dual, switchable backends: `cli` (openclaw/clawhub bridge) and `native`
  (decoupled Python substrate), with `auto` detection.
- Multi-market registry layer: `clawhub`, `skillhub` (api.skillhub.cn),
  `clawhub-cn` (official China mirror), and `skillsmp` (GitHub index), plus
  user-defined markets via `omnilimb.markets` config.
- Retry + rollback wrapper; Docker sandbox with implicit rollback and local
  fallback; Playwright browser automation via a structured action list.
- Local SQLite cache with offline-first fallback for search and discovery.
- Per-skill health check / scoring, credential management, environment-readiness
  checks, smoke test, run history, favorites, search history, and an optional
  JSONL audit log.
- Dashboard UI tab (Search / Installed / Favorites / Audit / Settings) following
  the native plugin-UI contract, with FastAPI routes under `/api/plugins/omnilimb/`.
- Packaging via the `hermes_agent.plugins` entry point and a directory-drop install.

### Notes
- Commercial/Pro capabilities (skill → native Hermes conversion, AI curation,
  curated-pack install, auto-update, the assistant console) are **not** part of
  this community edition and are planned for a future Pro release under a
  separate license.
