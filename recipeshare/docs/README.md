# RecipeShare Docs Index

Use this page as the default starting point for process and release documentation.

## Planning and Tracking

- [Punch List](punch-list.md)

## Release Validation

- [Manual Test List](manual-test-list.md)

## Release Commands and Versioning

- `yarn build:production:android`
	- Builds Android with the production EAS profile and does not submit to Play.
- `yarn release:open-testing`
	- Builds Android with the production EAS profile and auto-submits to Play Open Testing.
- `yarn release:production`
	- Builds Android with the production EAS profile and auto-submits to Play Production.

Versioning policy:

- EAS remote app versioning is enabled in `eas.json` (`cli.appVersionSource: remote`).
- Build counters auto-increment for production profile builds (`autoIncrement: true`).
- Keep `ios.buildNumber` and `android.versionCode` in `app.json` as fallback values for local/native build paths.
- Do not manually increment `ios.buildNumber` or `android.versionCode` for normal EAS release builds.

## App Startup and Bootstrap

- [App Initialization Sequence](app-initialization-sequence.md)
- [Bootstrap Build Customization Guide](bootstrap-build-customization.md)

## Notes for Future Automation

Manual checks in the release validation list are candidates for automated tests over time.
When automating a manual case, update both the test suite and the linked docs above.
