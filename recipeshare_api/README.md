# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

## JWT configuration

Auth tokens are now signed with environment-specific configuration and include
`iss`, `aud`, and `exp` claims. This prevents a token minted in one environment
from being accepted in another environment.

Set these per environment (development and production must differ):

* `JWT_SECRET_KEY`
* `JWT_ISSUER`
* `JWT_AUDIENCE`
* `JWT_AUTH_TTL_SECONDS` (optional, default is 30 days)

Credentials can also be set per environment inside `JWT` using these keys:

* `development_secret_key`
* `production_secret_key`
* optional: `development_issuer`, `production_issuer`
* optional: `development_audience`, `production_audience`
* optional: `development_auth_token_ttl_seconds`, `production_auth_token_ttl_seconds`

Recommended values:

* development issuer/audience examples:
  * `JWT_ISSUER=recipe-share-development`
  * `JWT_AUDIENCE=recipe-share-mobile-development`
* production issuer/audience examples:
  * `JWT_ISSUER=recipe-share-production`
  * `JWT_AUDIENCE=recipe-share-mobile-production`

If `JWT_SECRET_KEY` is not set, the app falls back to
`Rails.application.credentials.dig(:JWT, :secret_key)`. For strict separation,
prefer setting explicit environment variables in each deployed environment.

### Local development

Add a dev-only JWT secret to credentials:

```bash
bin/rails credentials:edit --environment development
```

Example:

```yml
JWT:
  development_secret_key: your-long-random-dev-secret
```

Then start the API with:

```bash
yarn api:dev:jwt
```

The app will use development-scoped credential keys first, then generic JWT
credential keys, then environment variables.

### Production deployment

`app.yaml`, `app standard.yaml`, and `app flex.yaml` now define production JWT
issuer/audience/ttl and source `JWT_SECRET_KEY` from
`JWT.production_secret_key` with fallback to `JWT.secret_key`.
