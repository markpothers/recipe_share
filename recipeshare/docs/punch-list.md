# Punch List

1. Standardize fetch request behavior across all api calls (timeout handling, auth header injection, logout/error behavior, and response/error shape).
2. Standardize timeout and retry policy for network requests so transient failures behave consistently.

## Completed

- Standardize startup auth state ownership so app readiness/login state comes from one global source of truth instead of local navigation state.
- Standardize root logging and warning policy at bootstrap (remove blanket warning suppression and use environment-aware logging rules).
- Standardize runtime config surface across app config and build profiles (non-url runtime flags, dev/prod toggles, and profile consistency).
- Standardize storage bootstrap behavior for session restoration (token/profile read/write guards, partial/corrupt data handling, and recovery path).
- Standardize Redux side-effect posture for bootstrap-level async flows (clear baseline for where startup async logic lives).
- Standardize plugin/build customization documentation for bootstrap-critical config, including Android-only manifest requirements. (Policy: app.json/eas.json as source of truth; avoid manual native folder edits.)
- Document the full app initialization sequence (entry to app root to navigator to auth restore) to reduce startup regressions.
- Add iOS vs Android onEndReached manual parity test to release manual test list.

## Agent Suite — Phase 2 Backlog

The following agents are planned for a future phase once the core refactoring workflow (Phase 1 agents) is proven stable. These support feature development, UI work, and platform-specific release concerns.

- **UIAgent** — discuss and make pixel-perfect UI changes; understands layout, spacing, animation, and cross-platform render differences
- **FeatureAgent** — add new features using current app patterns, maintaining stability while refactorings transition to newer patterns in parallel
- **BuildDeployAgent** — assess build and production differences between Android and iOS (EAS profiles, native folder changes, app store requirements, app.yaml deployment)
- **PlatformTestingAgent** — for a given feature or change, decide what needs platform-specific manual device testing vs what can be covered by extending the Jest test suite; produces a structured manual test checklist in `docs/manual-test-list.md` format

See `.github/agents/` for Phase 1 agents (RefactoringCoordinator, RefactorAgent, RegressionReviewAgent, TestCoverageAgent, TypeGuardianAgent).

## Related Docs

- docs/manual-test-list.md
- docs/app-initialization-sequence.md
- docs/bootstrap-build-customization.md
