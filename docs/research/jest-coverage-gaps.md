# Research: Jest coverage and highest-value gaps

**Ticket:** [#92](https://github.com/markpothers/recipe_share/issues/92)  
**Method:** `yarn test --coverage` in `recipeshare/` (2026-10-28)

## Snapshot

| Metric | Coverage |
| --- | --- |
| Statements | 40.5% (1488/3674) |
| Branches | 32.4% |
| Functions | 30.1% |
| Lines | 40.6% |

- **35** test suites; **349** tests passing; **5** skipped; **83** snapshots.
- **2 suites failing:** `newRecipe-create.test.js`, `newRecipe-edit.test.js` — import `react-native-keyboard-controller` without a Jest mock (native module not linked in test env).

## What is already well covered

- Auth entry: `login.test.tsx`, `appLoading.test.tsx`, token storage tests
- Recipe details and comments (several component tests)
- New recipe flows (large tests, but currently broken at import)
- Aux local persistence (recipe/chef lists and details)
- Shared UI: search bar, filter menu, alerts, offline message
- `apiCall.test.js` for shared fetch wrapper

## High-leverage gaps (for agent-led work)

1. **Fix newRecipe test harness** — unblocks the largest existing integration tests; add `jest.mock('react-native-keyboard-controller')` in setup or module mock.
2. **`fetches/`** — ~25 TS modules, almost no direct tests; behavior is typed but regressions hit production. Priority: `getRecipeList`, `getRecipeDetails`, `postRecipe`, `patchRecipe`, `loginChef` (happy path + `ApiError`).
3. **List hooks / models** — e.g. `useChefListModel`, recipe list containers: pagination and offline paths align with `manual-test-list.md` risks.
4. **Navigation smoke** — no tests on `MainDrawerNavigatorContainer.jsx`; lower priority than data layer.
5. **Legacy** — Enzyme remnants unused; `.te.test.js` naming suggests old test renderer patterns; consolidate when touching files, not a standalone sprint.

## Recommendation

Agents should **not** chase 80% coverage globally. Order:

1. Green suite (fix keyboard-controller mock).
2. Thin contract tests on top 5 fetch modules used by list + details + login.
3. One pagination/regression test for recipe list state if a hook is extracted during TS migration.

Maestro (see agent-verification research) covers cross-screen flows agents cannot assert in Jest alone.
