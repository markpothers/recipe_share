# Research: iOS agent verification (deferred)

**Ticket:** [#94](https://github.com/markpothers/recipe_share/issues/94)  
**Depends on:** [Android verification decision](./agent-verification-android.md)

## Decision

Defer a dedicated **agent-driven iOS simulator loop** until Maestro smoke flows exist for Android and Jest is green on the Expo 58 branch.

## When iOS joins the stack

- **Same Maestro YAML** as Android, run against iOS simulator build (`expo run:ios` locally or EAS `maestro` job with iOS build).
- **Store releases:** human pass on physical iPhone using `manual-test-list.md` until Maestro coverage matches critical paths.
- No separate Detox stack unless Maestro proves insufficient on iOS-only bugs.

## Timeline placement

After first Android Maestro smokes land; not on the critical path to the December Play update if Android + manual iOS smoke for Apple submit suffice.
