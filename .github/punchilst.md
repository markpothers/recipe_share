# Punch List

1. Update app to use standard environment variables, and replace databaseURL.ts as the source of the api url for api calls to use.
2. Standardize startup auth state ownership so app readiness/login state comes from one global source of truth instead of local navigation state.
3. Standardize fetch request behavior across all api calls (timeout handling, auth header injection, logout/error behavior, and response/error shape).
4. Standardize root logging and warning policy at bootstrap (remove blanket warning suppression and use environment-aware logging rules).
5. Standardize runtime config surface across app config and build profiles (non-url runtime flags, dev/prod toggles, and profile consistency).
6. Standardize storage bootstrap behavior for session restoration (token/profile read/write guards, partial/corrupt data handling, and recovery path).
7. Standardize timeout and retry policy for network requests so transient failures behave consistently.
8. Standardize Redux side-effect posture for bootstrap-level async flows (clear baseline for where startup async logic lives).
9. Standardize plugin/build customization documentation for bootstrap-critical config, including Android-only manifest requirements.
10. Document the full app initialization sequence (entry to app root to navigator to auth restore) to reduce startup regressions.
