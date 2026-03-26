# Punch List

~~1. Standardize startup auth state ownership so app readiness/login state comes from one global source of truth instead of local navigation state.~~
2. Standardize fetch request behavior across all api calls (timeout handling, auth header injection, logout/error behavior, and response/error shape).
~~3. Standardize root logging and warning policy at bootstrap (remove blanket warning suppression and use environment-aware logging rules).~~
~~4. Standardize runtime config surface across app config and build profiles (non-url runtime flags, dev/prod toggles, and profile consistency).~~
~~5. Standardize storage bootstrap behavior for session restoration (token/profile read/write guards, partial/corrupt data handling, and recovery path).~~
6. Standardize timeout and retry policy for network requests so transient failures behave consistently.
~~7. Standardize Redux side-effect posture for bootstrap-level async flows (clear baseline for where startup async logic lives).~~
~~8. Standardize plugin/build customization documentation for bootstrap-critical config, including Android-only manifest requirements. (Policy: app.json/eas.json as source of truth; avoid manual native folder edits.)~~
~~9. Document the full app initialization sequence (entry to app root to navigator to auth restore) to reduce startup regressions.~~
