# RecipeShare Agent Instructions

Use this file as the default context for all coding agents working in this repository.

## Overview

Recipe-Share is a social media type app for browsing, creating, and interacting with recipes and chefs, where lists of recipes are displayed to the user with images. Touching a recipe opens its details with descriptions/images/ingredients lists/instructions/comments/likes/shares etc.
Lists of Chefs are also available with a similar format of a profile picture/description and lists of recipes this Chef (aka User) has created/interacted with.

Recipe-Share is available on the Google Play and Apple App Stores. The major goal is to maintain a stable app while adding features that will draw users to join the app, use it regularly and add recipes to create a growing library of content.

## History

The app started as a Coding BootCamp final project and has been developed into a fully functional app. It started as a very simple app and has had numerous features added with an 'if it ain't broke, don't fix it' attitude. This means that while some parts of the app are modern, maintained and tested, others are rudimentary, with significant code duplication and lower code quality or even missing basic functionality. The app has been heavily user tested thanks to its full release status and while it may contain logical flaws, most workflows have been shown to be robust for their actual use cases.

## Mission

Build and maintain RecipeShare, which is an Expo + React Native mobile app with a Ruby On Rails API and PostgreSQL database.

## Objectives

1. Add user facing features to the app to develop its utility and increase its attractiveness as a tool for creating, cataloging and sharing recipes.
2. Continual updates to keep pace with Expo releases ensuring that the underlying tech stack is kept secure and up to date
3. Refactoring:
   - a. Continue the transition from JavaScript to TypeScript. Maximize the use of domain-wide types in `./recipeshare/CentralTypes.ts`
   - b. Continue the transition from class components to functional components and hooks
   - c. Continued development of test cases to ensure minimal functional regressions as refactoring and feature addition continues
   - d. Abstract duplicated UI and functional code into reusable components
   - e. Improve the basic code setup (e.g. moving to environment files instead of hardcoded URLs)
4. Minimal/No changes to the api at this time unless specific bugs are found

## Rules of Engagement

- Do not start making code changes until told to proceed. Discuss first how a solution will be implmented. Discussions about code do not immediately require code changes until agreed.
For any task that will change more than a handful of lines of code in one file, establish a clear understanding of how a task will be completed before proceeding
- Keep user flows stable (auth, browse, details, create/edit recipe, profile).
- Make safe, incremental changes with tests.
- Minimize the number of collateral changes made when executing a task. Do not refactor some code if that refactoring was not part of the agreed task. If a piece of code needs is insecure/non-performant/needs refactoring, note it for discussion when the current task is complete
- Do not delete commented code when making changes unless requested. Commented code is present throughout the app to ease debugging.
- Optimize for agent-driven delivery with minimal repeated human context.
- Prefer small, reviewable edits.
- Preserve public behavior unless task explicitly requests a behavior change.
- If a task is unclear, ask for clarification as to how it should be handled.
- Always include a short verification summary in the final response.
- If initial edits do not solve a problem, reconsider the proposed solution, do not layer non-working fixes without discussion
- Definition of Done (Default). A task is complete when:
  - Code compiles and targeted flows are verified.
  - Relevant tests pass (or new tests added for changed behavior).
  - Lint passes for touched areas.
  - Final summary includes changed files, validation performed, and residual risks.

## Tech Stack (versions will change as Expo updates)

The app contains two source folders:

### RecipeShare mobile app

The `./recipshare` folder contains the front end app built with:

- React Native + Expo
- React
- TypeScript + JavaScript mixed codebase
- Navigation: React Navigation (stack, drawer, tabs)
- State: Redux Toolkit (`src/redux`) with a single root slice reducer
- Testing: Jest + `@testing-library/react-native`
- Linting: ESLint
- iOS/Android native folders managed via Expo prebuild + EAS build profiles

**Quick Start**

1. Install dependencies:

```bash
yarn install
```

2. Run app (dev client):

```bash
yarn go
```

3. Running on device is done through the Expo Go app or a Development build which can be built with EAS build scripts:

```bash
yarn build:devClient:android
# or
yarn build:devClient:ios
```

4. Validate changes:

- the project is linted directly in the IDE (VS Code)
- to run tests:

```bash
yarn test
```

5. Test Server
   A json test server is available by calling

```bash
yarn testServer
```

but this is not the primary test server I use.

**App Architecture Map**

- App bootstrapping:
  - `index.js` registers root component.
  - `App.tsx` initializes splash/navigation/provider shell.
- Navigation:
  - `src/navigation/AppNavigator.tsx` controls auth/loading/main app flows.
  - Additional navigators/tabs/drawers in `src/navigation`.
- State and data model:
  - Redux store in `src/redux/store.ts`.
  - Main slice in `src/redux/rootReducer.ts`.
  - Domain types in `src/centralTypes.ts` and redux-specific types in `src/redux/types.ts`.
- Networking:
  - API calls in `src/fetches`.
- Feature areas:
  - `src/newRecipe`, `src/recipeDetails`, `src/recipeLists`, `src/chefDetails`, `src/profile`, `src/users`, `src/about`.
- Shared UI and utilities:
  - Components in `src/components`.
  - Helpers in `src/auxFunctions`.
  - Constants in `src/constants`.

### RecipeShare mobile app

The `./recipshare_api` folder contains the back end api built with:

- Ruby on Rails api run locally and deployed to appEngine on Google Cloud Services
- PostgreSQL database running on Google Cloud Services SQL
- React/Vite based web app to serve a rudimentary web interface primarily used for email verification and required web pages for startup and app store compliance

**Quick Start**

1. Install dependencies:

```bash
yarn install
bundle install
```

2. Start GCloud SQL proxy

```bash
yarn sql
```

3. Start Rails api

```bash
yarn api
```

4. Start Vite development server

```bash
yarn go
```

**Build and Environment Notes**

- Runtime/deploy target is Ruby 3.2 + Rails 7 on Google App Engine (`app.yaml`, `app standard.yaml`, `app flex.yaml`).
- Local api runs via `yarn api` (`rails s -b 10.0.0.250 -p 3000`); production profile is `yarn api:prod`.
- Frontend dev/build uses Vite + `vite_rails` (`yarn go` for dev server, `yarn build` for production assets).
- Vite host/port is configured in `config/vite.json` (`10.0.0.250:3036`; test port `3037`).
- Database is PostgreSQL in all environments via Rails credentials in `config/database.yml` (`Google` credential keys for username/password/database/host).
- Cloud SQL local tunnel is started with `yarn sql` using `cloud-sql-proxy` and instance `recipe-share-272202:us-central1:recipe-share`.
- App Engine config pins one instance by default (standard and flex variants) and connects Cloud SQL via `beta_settings.cloud_sql_instances`.
- Mail delivery is SMTP-based in environment configs and expects credentials at `Rails.application.credentials.email[:details]`.

**Architecture Map**

- Request routing and entry:
  - `config/routes.rb` defines REST API resources under `/api` plus auth/activation utility endpoints.
  - Non-XHR HTML requests route to `WebController#index` to serve the web frontend shell.
- API layer:
  - Controllers are in `app/controllers` (for example `recipes_controller.rb`, `chefs_controller.rb`, plus interactions such as likes/comments/follows/shares).
  - `ApplicationController` centralizes token auth (`Authorization` header + JWT decode) for protected requests.
- Domain/data layer:
  - ActiveRecord models in `app/models` map core entities (`Recipe`, `Chef`, `Comment`, `Ingredient`, interaction join models, etc.).
  - Persistence uses PostgreSQL with schema/migrations in `db/`.
- Web frontend layer (verification/support/static pages):
  - React source lives in `app/frontend` with entrypoint `entrypoints/index.jsx`.
  - Client routing uses `@tanstack/react-router` in `app/frontend/components/router`.
  - Static compliance/support pages are in `app/frontend/components/staticPages`.
  - `vite-plugin-ruby` + `vite_rails` bridge Rails and Vite asset serving/build.
- Additional Rails subsystems:
  - Mailers in `app/mailers` (account lifecycle email flows).
  - Background job base in `app/jobs/application_job.rb`.
  - Server-rendered wrappers/layouts in `app/views`.

## Planning Protocol (Agent-First)

When starting a task, the agent should produce a concise plan:

1. Goal and acceptance criteria.
2. Files likely to change.
3. Risks/regressions to watch.
4. Validation commands.

For larger tasks, execute in phases:

- Phase 1: Read-only discovery
- Phase 2: Minimal implementation
- Phase 3: Verification
- Phase 4: Optional cleanup follow-up

## Reusable Task Brief Template

Use this prompt template for future tasks to reduce repeated context:

```text
Task: <what to change>
User impact: <why it matters>
Scope: <allowed files/areas>
Out of scope: <what not to touch>
Definition of done:
- [ ] behavior
- [ ] tests
- [ ] lint
Constraints:
- Keep changes minimal
- Preserve existing patterns in src/<feature>
- Summarize risks and follow-ups
```

## Testing Strategy for Agents

- Prefer targeted tests near changed feature first (example: `src/newRecipe/**/*.test.*`).
- Run full suite when touching shared modules (`src/components`, `src/redux`, navigation, or fetch primitives).
- If test updates are needed, ensure they prove behavior rather than implementation details.

## High-Leverage Follow-Up Improvements (Backlog)

These are recommended to further improve productivity in an agent-heavy workflow:

1. Add file-scoped instruction docs for major domains:
   - `src/navigation/navigation.instructions.md`
   - `src/fetches/fetches.instructions.md`
   - `src/redux/redux.instructions.md`
2. Replace hard-coded local API IP handling in `src/constants/databaseURL.ts` with env-driven config.
3. Add CI checks for lint + test to enforce quick agent feedback loops.
4. Standardize mixed TS/JS boundaries over time (start with shared modules and network layer).
5. Add architecture decision records for navigation/state/fetch patterns.

## Notes for Human + Agent Collaboration

- Keep tasks narrow and explicit.
- Prefer one feature or fix per PR.
- Ask agents to list assumptions before coding when requirements are underspecified.
- Encourage agents to call out risky areas (navigation transitions, async fetch + store updates, auth state).
