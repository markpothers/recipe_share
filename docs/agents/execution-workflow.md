# Agent execution workflow (Recipe-Share)

**Ticket:** [#93](https://github.com/markpothers/recipe_share/issues/93)

Planning maps use `wayfinder:*` labels ([#88](https://github.com/markpothers/recipe_share/issues/88)). Day-to-day implementation uses the triage labels in `docs/agents/triage-labels.md`.

## Issue lifecycle

1. **Open an issue** with a clear outcome (bug, chore, feature slice). Link the wayfinder map only when the work traces to that plan.
2. **`needs-triage`** — default for new items; maintainer sets direction.
3. **`needs-info`** — blocked on human input (credentials, store console, repro on device).
4. **`ready-for-agent`** — fully specified: files/area, acceptance criteria, verification steps. Safe for AFK agents on a production app.
5. **`ready-for-human`** — store submit, Apple/Google consoles, physical device checks, or judgment calls.
6. **`wontfix`** — closed without work.

Agents **only** pick up **`ready-for-agent`** issues assigned to them or explicitly named in chat.

## Pull requests

- One issue per PR when practical; PR body: `Fixes #n` or `Refs #n`.
- Before marking ready for review: run `yarn test` in `recipeshare/` and `yarn lint` if the change touches linted paths.
- Do not bump store version or submit to Play/App Store without **`ready-for-human`** and explicit ask.

## Verification bar for agents

| Change type | Minimum verification |
| --- | --- |
| Logic, types, UI in Jest-covered areas | `yarn test` |
| Navigation / native / upgrade | Human or Maestro (when introduced); see `docs/research/agent-verification-android.md` |
| Release candidate | `recipeshare/docs/manual-test-list.md` on device |

## Where vocabulary lives

- Product terms: root `GLOSSARY.md`
- Wire/local types: `recipeshare/src/centralTypes.ts` (annotations backlog is execution work, not glossary)

## Tracker

GitHub Issues on `markpothers/recipe_share` via `gh`. See `docs/agents/issue-tracker.md`.
