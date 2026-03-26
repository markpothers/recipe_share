# App Initialization Sequence

This document describes the startup path from app entry to authenticated routing.

## Sequence Overview

1. Expo entry registers the app root.
2. Root app shell prevents splash auto-hide, mounts providers, and renders navigation.
3. App navigator gates routes using Redux auth bootstrap state.
4. Loading screen dispatches startup side effects.
5. Redux thunk restores persisted session and sets final auth gate state.

## Detailed Flow

### 1) Entry Registration

File: `index.js`

* `registerRootComponent(App)` is called.
* This hands off execution to `App.tsx` in Expo Go and native builds.

### 2) Root Shell + Splash Control

File: `App.tsx`

* `prepare()` calls `SplashScreen.preventAutoHideAsync()` during initial mount.
* Local `appIsReady` is set to true in `finally`, then first layout triggers `SplashScreen.hideAsync()`.
* App tree composition:
  * `SafeAreaProvider`
  * `NavigationContainer`
  * Redux `Provider` with `store`
  * `AppNavigator`

This means startup rendering is splash-gated first, then auth-gated by Redux state.

### 3) Auth-Gated Navigation Branching

File: `src/navigation/AppNavigator.tsx`

Selectors:

* `getAuthLoaded`
* `getAuthLoggedIn`

Branch behavior:

* `loaded = true`, `loggedIn = true` -> `Home` stack (`MainDrawerNavigator`).
* `loaded = true`, `loggedIn = false` -> auth stack (`Login`, `CreateChef`).
* `loaded = false` -> `AppLoadingStack` (`AppLoading`).

Initial Redux values are `authLoaded: false` and `authLoggedIn: false`, so startup enters `AppLoading` first.

### 4) Loading Screen Startup Side Effects

File: `src/users/appLoading.tsx`

On mount, `AppLoading` dispatches:

* `setDeviceType(...)` after `expo-device` lookup
* `initializeAuthBootstrap()` to restore session and set auth gate state

No route switching is done directly in this component. It only dispatches bootstrap actions.

### 5) Persisted Session Restore + Final Auth State

Files:

* `src/redux/rootReducer.ts` (`initializeAuthBootstrap` thunk)
* `src/auxFunctions/authSessionStorage.ts` (`restorePersistedSession`)

Restore behavior:

1. Load token and stored chef data in parallel.
2. If both exist and parse correctly:
   * `stayLoggedIn(true)`
   * `updateLoggedInChef(chefWithToken)`
   * `setAuthBootstrapState({ loaded: true, loggedIn: true })`
3. If data is partial/corrupt:
   * clear persisted storage
   * `stayLoggedIn(false)`
   * `setAuthBootstrapState({ loaded: true, loggedIn: false })`
4. If no session exists:
   * `stayLoggedIn(false)`
   * `setAuthBootstrapState({ loaded: true, loggedIn: false })`

Once `loaded` becomes true, `AppNavigator` re-renders out of `AppLoading` into `Home` or `Login`.

## Auth Gate State Matrix

| authLoaded | authLoggedIn | Rendered branch |
| --- | --- | --- |
| false | false/true | `AppLoadingStack` |
| true | true | `Home` (`MainDrawerNavigator`) |
| true | false | `Login` + `CreateChef` |

## Regression Checklist (Startup-Specific)

After startup/auth refactors, verify:

1. Splash appears and exits once root layout is complete.
2. Cold start with valid persisted session lands in `Home`.
3. Cold start with missing/corrupt session lands in `Login` and clears stale storage.
4. Logout transitions to `Login` without returning to protected screens.
5. Device type still populates in Redux during loading.

## Ownership Boundary

Bootstrap ownership is split intentionally:

* `App.tsx`: platform shell and splash lifecycle.
* `AppLoading`: dispatch-only startup trigger.
* Redux thunk + storage helpers: auth restore logic and state transitions.
* `AppNavigator`: pure render gate from Redux auth state.