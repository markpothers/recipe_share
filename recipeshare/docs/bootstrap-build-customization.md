# Bootstrap Build Customization Guide

This project follows an Expo-managed configuration model.

## Source Of Truth

Use these files as the only bootstrap build configuration inputs:

* app.json for Expo app config, permissions, native metadata, and plugin declarations.
* eas.json for build profile behavior and environment selection.

Generated native folders (`android/`, `ios/`) are outputs of prebuild/build and should not be manually edited for bootstrap-critical configuration.

## Android Policy

For Android manifest and application-level settings:

* Prefer first-party app.json fields (for example `expo.android.permissions`, `expo.plugins`, and plugin options).
* If a customization is required and not available in app.json primitives, use an Expo config plugin and declare it in `expo.plugins` in app.json.
* Do not patch `android/app/src/main/AndroidManifest.xml` directly for long-term behavior.

## iOS Policy

For iOS Info.plist and capability settings:

* Prefer app.json (`expo.ios.infoPlist`, associated domains, etc.).
* Use config plugins for unsupported settings.
* Avoid manual long-term edits under `ios/` unless there is a temporary debugging reason.

## Current Bootstrap-Critical Inputs

From this repo:

* app.json
  * app identity/version metadata
  * Android permissions list
  * iOS Info.plist permission strings
  * Expo plugin declarations and plugin options
* eas.json
  * build profiles
  * runtime env values consumed in app code

## Upgrade/Regression Checklist

After Expo SDK or plugin upgrades:

1. Run install and prebuild in a clean state when needed.
2. Confirm app.json plugin declarations still parse and apply.
3. Validate generated AndroidManifest from app.json inputs (permissions, queries, activity config).
4. Validate iOS Info.plist values generated from app.json.
5. Build at least one Android profile and one iOS profile from eas.json.
6. Smoke test login/bootstrap and media permission flows on device.

## Notes On Custom Plugins

This repo contains `plugins/android-manifest-plugin.js` as a custom plugin implementation.

At present, the active policy is:

* Keep bootstrap customizations in app.json and eas.json.
* Only activate custom plugins when there is a confirmed platform requirement not expressible through standard app.json fields.
