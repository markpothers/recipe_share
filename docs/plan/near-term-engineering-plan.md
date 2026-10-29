# Near-term engineering plan (Recipe-Share)

**Wayfinder map:** [#88](https://github.com/markpothers/recipe_share/issues/88)  
**Status:** Decisions locked 2026-10-28 — execution follows this order; no shortcut release on old SDK.

## Goal

Run **AI-first development** on a **store-stable** Expo app: shared vocabulary, agent verification rules, GitHub Issues, one **Expo-current** store release, then structured robustness work. Product features and Rails API work are **out of scope** here.

## Shared context

| Artifact | Purpose |
| --- | --- |
| [`GLOSSARY.md`](../../GLOSSARY.md) | Product language (Chef, List Recipe, blog preview, screens) |
| [`recipeshare/src/centralTypes.ts`](../../recipeshare/src/centralTypes.ts) | Canonical type names; annotation backlog below |
| [`docs/agents/execution-workflow.md`](../agents/execution-workflow.md) | Triage labels, PR bar, what agents may execute |
| [`docs/research/`](../research/) | Verification, Expo upgrade, Jest gaps |

## Phase 1 — Agent-ready process (parallel with Phase 2 prep)

- Use GitHub Issues + triage labels (`ready-for-agent` bar).
- Agents run `yarn test` in `recipeshare/` every batch; fix keyboard-controller Jest mock so newRecipe suites pass.
- Introduce Maestro **after** Phase 2 branch is stable (smoke: login, list, details, new recipe).

## Phase 2 — Expo upgrade → single store release

1. Upgrade branch: **SDK 55 → 57 (≥57.0.9) → 58** per [`expo-upgrade-55-to-58.md`](../research/expo-upgrade-55-to-58.md).
2. `expo-doctor`, regenerated native projects via EAS/prebuild as needed, new dev client.
3. Verification: green Jest, manual Android list, EAS production builds.
4. Submit **Android** (Play deadline Dec 2026); **iOS** with human device check when ready.

## Phase 3 — Robustness (after Phase 2 ships)

Ordered for leverage on a live store app:

1. **CentralTypes annotations** — mark wire (API) vs local (UI/draft) vs shared; agents read before touching fetches.
2. **Jest gaps** — fetch contract tests (list, details, login, post/patch recipe); keep coverage goal pragmatic (~40% → targeted modules, not blanket %).
3. **TypeScript + hooks** — remaining class components and large JS files (`profile`, `createChef`, `MainDrawerNavigatorContainer`, dualOSPicker, etc.).
4. **Input / form UI abstraction** — dedupe wrappers used across new recipe and profile flows.
5. **Test cleanup** — remove dead Enzyme paths; align `.te.test` patterns with RTL where touched.
6. **Maestro + optional EAS Workflow** on labeled PRs.

## Explicitly later (new wayfinder map)

- LLM-assisted recipe authoring
- Rails API tests, SQL performance
- iOS agent loop formalized (see [`ios-agent-verification-deferred.md`](../research/ios-agent-verification-deferred.md))
- Filter/attribute glossary expansion

## Principles

- **Robustness over speed:** December deadline does not skip glossary, tests, or incremental SDK hops.
- **One store release** means one **binary** on current Expo, not one SDK jump.
- **Agents do not** store-submit or guess on device-only behavior without `ready-for-human`.
