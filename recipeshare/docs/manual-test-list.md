# Manual Test List

This checklist tracks manual release validation items.

Use this file as the release punch list for manual QA. Keep items unchecked until they pass on physical devices.

## Punch List Additions

- [ ] Validate `onEndReached` behavior parity on iOS vs Android in recipe lists.

## Recipe Lists

### Infinite Scroll: iOS vs Android `onEndReached`

- [ ] Preconditions:
  - Build has enough recipes to paginate (at least 2 pages).
  - User is logged in.
  - Start from a list that supports pagination (for example `All Recipes`).
- [ ] Steps:
  1. Open the recipe list and wait for initial load.
  2. Scroll to the bottom slowly once.
  3. Confirm exactly one additional page request is triggered.
  4. Scroll again to the bottom and confirm next page appends.
  5. Pull to refresh.
  6. Confirm list resets to first page and does not keep the previous offset.
  7. Repeat steps 1-6 on both Android and iOS.
- [ ] Pass criteria:
  - No duplicate page fetches for a single end-reach gesture.
  - No jump back to page 1 when loading more.
  - Refresh always restarts paging from offset 0.
  - Behavior is consistent on Android and iOS.

### Search + Pagination Interaction

- [ ] Type a search term, verify request uses `offset=0` and correct search term.
- [ ] Clear search, verify request uses `offset=0` and empty search term.
- [ ] Scroll to bottom after search, verify pagination continues from filtered list length.

## Startup and Auth

- [ ] Cold start with valid session lands in authenticated flow.
- [ ] Cold start with invalid/missing session lands on login.
- [ ] Logout returns to login and blocks protected screens.

## Notes

- Record failed runs with platform, device, build version, reproduction steps, and logs.
- Once a manual case becomes stable and repeatable, move it to automated test backlog.
