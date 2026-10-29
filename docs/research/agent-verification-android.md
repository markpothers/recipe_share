# Research: Agent verification on Android (Expo RN)

**Ticket:** [#89](https://github.com/markpothers/recipe_share/issues/89)  
**Sources:** [Maestro React Native](https://docs.maestro.dev/get-started/supported-platform/react-native), [Expo E2E with Maestro](https://docs.expo.dev/tutorial/cicd/e2e-tests/), [Expo Simulators + Maestro](https://docs.expo.dev/preview/simulators/works-with/maestro/)

## Question

How should agents verify Recipe-Share changes on Android, alongside the existing Jest suite?

## Decision (for the near-term plan)

Use a **layered** verification model:

| Layer | What | Who runs it | When |
| --- | --- | --- | --- |
| **1. Unit/integration** | Jest + React Native Testing Library (`yarn test` in `recipeshare/`) | Agent in Cursor (shell) | Every change batch |
| **2. Manual smoke** | `recipeshare/docs/manual-test-list.md` | Human on device/emulator | Before store submit |
| **3. E2E (introduce)** | Maestro flows in `.maestro/` | Agent locally if emulator up; EAS Workflows on labeled PRs later | Critical paths after SDK upgrade stabilizes |

Cursor does **not** drive a React Native app inside the chat browser. Agents verify via **shell**: Jest, `npx expo run:android` (when an emulator or device is available), and **`maestro test`** against a dev or release build. “GrokBot” or any cloud agent is optional; the same Maestro YAML runs locally or on EAS.

## Options considered

### Jest + RTL (keep, expand)

- Already ~35 suites, ~349 passing tests; ~40% statement coverage on `src/`.
- Two `newRecipe` suites fail today because `react-native-keyboard-controller` is not mocked in Jest—fix belongs on the robustness track, not a blocker for planning.
- Best ROI for agents: pure logic, redux, fetch mappers, list/detail components with heavy mocking (existing pattern).

### Maestro (recommended E2E)

- No in-app npm test driver; tests the built binary via accessibility layer.
- Official Expo path: `.maestro/*.yml`, EAS Workflow job type `maestro` (alpha), triggers on PR or label.
- Fits Recipe-Share: login → open recipe list → open recipe details → open new recipe (smoke).

### Detox / Appium

- Heavier setup, in-repo native test harness. Not chosen for first E2E layer given Maestro + EAS alignment.

### Expo Go only

- Not suitable for production-parity checks; app already uses dev client / EAS (`eas.json`).

## Recommended rollout

1. **Now:** Agents must run `yarn test` in `recipeshare/` before marking work ready; document failing suites as known debt.
2. **After Expo 58 release branch is green:** Add 2–3 Maestro smoke flows; run locally on Android emulator with `maestro test`.
3. **Later:** EAS Workflow on `pull_request_labeled: test` to avoid 20-minute native builds on every agent PR (fingerprint + update pattern per [Expo blog](https://expo.dev/blog/use-expo-ship-faster)).

## iOS

Follow-on [#94](https://github.com/markpothers/recipe_share/issues/94): same Maestro flows on iOS simulator / EAS when Android path is proven; store release still gets human pass on device.
