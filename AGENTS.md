## Agent skills

### Issue tracker

GitHub Issues in `markpothers/recipe_share` via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles with matching label strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` and `docs/adr/` when they exist. See `docs/agents/domain.md`.

### Near-term plan

Locked engineering plan: `docs/plan/near-term-engineering-plan.md` (wayfinder [#88](https://github.com/markpothers/recipe_share/issues/88)). Research notes: `docs/research/`. Agent PR bar: `docs/agents/execution-workflow.md`.

## Cursor Cloud specific instructions

The environment boots Postgres, a local SMTP sink on port 1025, a local OAuth token sink on port 1026, the Vite dev server on port 3036, and the Rails API on port 3000. If those are down, read `/tmp/cursor/start-user/start-user.log` and `/tmp/recipeshare-rails.log`.

- Ruby is 3.2 from apt. Node 22 and Yarn 1 are on `PATH`. API gems install to `/usr/local/bundle` (`bundle config get path`). Run `bundle install` in `recipeshare_api`, then `yarn install --frozen-lockfile` in both `recipeshare_api` and `recipeshare`.
- `recipeshare_api/bin/rails` is not executable in git. Use `bundle exec rails`.
- Local databases are `recipeshare_development` and `recipeshare_test` on `127.0.0.1`, role `recipeshare`. `config/database.yml` reads Rails credentials. The committed `config/credentials.yml.enc` is the Cloud SQL file and is not decrypted here. Boot writes gitignored `config/credentials/development.yml.enc` and `config/credentials/test.yml.enc` that point at local Postgres. Do not commit them.
- Image upload still calls Google Cloud Storage. The local token sink only lets the Storage client initialize. Do not point this environment at Cloud SQL or production buckets.
- `db/seeds.rb` is a large faker dataset and is not loaded on boot. Run `bundle exec rails db:seed` only when that dataset is needed.
- API check: `bundle exec rspec` in `recipeshare_api`.
- The Expo app in `recipeshare/` is iOS and Android only. Verify it with `yarn test` in `recipeshare/`. This environment has no Android emulator or iOS simulator. Two `newRecipe` suites fail today because `react-native-keyboard-controller` is not mocked; that is existing test debt, tracked in `docs/research/agent-verification-android.md`.

