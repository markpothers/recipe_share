# Research: Expo SDK 55 → current (58) for one store release

**Ticket:** [#90](https://github.com/markpothers/recipe_share/issues/90)  
**Sources:** [Upgrade Expo SDK](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/), [SDK 58 changelog](https://expo.dev/changelog/sdk-58), [expo-upgrade skill](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-upgrade/SKILL.md), [SDK upgrade troubleshooting](https://github.com/expo/fyi/blob/main/troubleshooting-sdk-upgrades.md)

## Current state

- `recipeshare/package.json`: `expo` ^55.0.0, `react-native` 0.83.2.
- Uses **react-native-reanimated** and **react-native-worklets**—relevant to Hermes guidance below.
- EAS profiles exist (`production`, `devClient`, etc.); Android `versionCode` 59 in `app.json`.
- Google Play deadline cited in map: **18 Dec 2026** (ample time for a proper upgrade, not a minimal binary).

## Decision (upgrade path)

**Target:** Expo SDK **58** (current stable), shipped in **one** store release after verification—not a separate “clock reset” build on SDK 55.

**Steps (two SDK hops, not four):**

1. Branch from main; ensure Jest baseline documented (fix or quarantine the two `newRecipe` suite failures early on the branch).
2. **55 → 57:** Install `expo@^57.0.0` with `npx expo install --fix`, then `npx expo-doctor`. Use **57.0.9+** (expo-upgrade skill: skip SDK 56 when coming from 55; avoid Hermes V1 memory regression with Reanimated/Worklets on 55/56/early 57).
3. **57 → 58:** `npx expo install expo@^58.0.0 --fix`, read SDK 58 breaking changes (scene lifecycle / iOS if custom native dirs).
4. **Native projects:** If using CNG, delete `android/` and `ios/` under `recipeshare/` when upgrading per Expo docs; regenerate via EAS Build or `expo prebuild`.
5. **New dev client** after native bump; smoke on Android emulator + manual list from `manual-test-list.md`.
6. **EAS** `production` build for both platforms; submit Android (and iOS when ready).

## Verification checklist (minimum)

- [ ] `npx expo-doctor` clean on upgrade branch
- [ ] `yarn test` in `recipeshare/` (all suites green or explicit waivers removed)
- [ ] Dev client: cold start, login, recipe list pagination, recipe details (full + blog preview), new recipe save
- [ ] Manual items in `recipeshare/docs/manual-test-list.md` on physical Android (and iOS before Apple submit)
- [ ] EAS production build succeeds

## Risks

- React Native version jumps twice (via SDK 57 and 58)—third-party native modules must match each step.
- Speech recognition, secure store, splash plugins—confirm against SDK 58 release notes.
- Upgrade skill explicitly recommends **one SDK at a time** and a **separate git branch**—compatible with “one release” meaning one **store** release at the end, not one git commit.

## Out of scope for this research

- Rails API changes
- New Architecture toggle (handle only if expo-doctor or RN 0.8x requires it)
