## Summary

What does this PR change and why?

## Related issue

Closes #

## Changes

-
-

## Testing

- [ ] `pytest -q` passes (`py -3.11 -m pytest -q` on Windows)
- [ ] `node --check omnilimb/dashboard/dist/index.js` passes (if the UI changed)
- [ ] Added/updated tests for the change
- [ ] Updated `CHANGELOG.md` under `[Unreleased]`

Describe what you tested and how:

## Checklist

- [ ] No Hermes-core imports added (except the guarded `hermes_constants` in `config.py`)
- [ ] Tool handlers still return JSON strings and never raise
- [ ] No secrets committed (`.secrets/`, license keys, tokens)
- [ ] New dependencies are minimal and, if optional, declared as extras
- [ ] User-facing strings go through i18n (at least `en` + `zh`)

## Notes for reviewers

Anything that needs special attention, follow-ups, or known limitations.
