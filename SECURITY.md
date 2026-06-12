# Security Policy

## Reporting a vulnerability

If you discover a security issue, please report it **privately**:

- Use GitHub's **Report a vulnerability** (Security → Advisories) on the
  repository, or
- Email the maintainer: `yase19636404@163.com` with the subject
  `[security] omnilimb`.

Please do **not** open a public issue for security problems. Include:

- a description of the issue and its impact,
- steps to reproduce (a minimal proof-of-concept if possible),
- affected version(s) and environment.

We aim to acknowledge reports within a few days and will coordinate a fix and
disclosure timeline with you.

## Supported versions

Security fixes target the latest released version. Older versions may not receive
backports.

## Security model (what to keep in mind)

- **Third-party skills are untrusted code.** Omnilimb runs them in an isolated
  Docker sandbox by default (`claw_sandbox_exec` with `network: false`). Without
  Docker, calls run locally and are flagged `"sandboxed": false` — callers must
  treat such output as untrusted.
- **Path-traversal guards.** Skill file read/write and uninstall operations are
  restricted to the skill directory; `../`-style escapes are rejected.
- **Archive extraction** is protected against zip-slip; registry-flagged
  malicious skills are refused.
- **No phone-home.** The plugin does not transmit your code or data to any
  Omnilimb-operated server. Skill search/install talks only to the skill market
  you configure; the optional audit log and caches stay on your machine.
- **Credentials** you store for a skill are kept in a local file under your
  Hermes home (not echoed back by the API) and injected into a skill's
  environment only for the duration of a run.

## Handling untrusted external content

Treat skill metadata, registry responses, and skill scripts as untrusted input.
Do not disable the sandbox or path guards when running skills you don't fully
trust.
