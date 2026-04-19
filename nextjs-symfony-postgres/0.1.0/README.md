# partrocks/nextjs-symfony-postgres — 0.1.0

A two-codebase application template:

- **`web`** — Next.js 15 frontend (React 19, TypeScript, App Router).
- **`api`** — PHP Symfony 7 + API Platform 4 backend.
- **`primary-db`** — shared Postgres 16 database, owned by the API.

## Topology (cloud)

```
web-host (EC2)  ──attachesTo──▶  api-host (EC2)  ──attachesTo──▶  primary-db (Postgres)
```

- `primary-db` is a non-hosting slot — no codebase, no env bindings. It only
  exposes `connectionString` as a slot output.
- `api-host` is the only codebase that gets `DATABASE_URL` (pulled from
  `primary-db.connectionString` via a `from: { slot, output }` binding).
- `web-host` only gets `NEXT_PUBLIC_API_URL` (from `api-host.url`); the web
  frontend never sees the database directly — it talks to the API.
- Deploy order is the topological sort over `attachesTo`:
  `primary-db → api-host → web-host`. Destroy order is the reverse.

All three slots are provisioned on AWS in v0.1.0 (`aws::hosting::ec2-single`
for the two apps, `aws::database::postgres` for the database). Swap the
`allowed` arrays in `manifest.yaml` to broaden or restrict the catalog.

## Develop environment

`environments.develop.type: docker`. Three services:

| service | image                      | role                                   |
| ------- | -------------------------- | -------------------------------------- |
| `web`   | `node:20-bookworm`         | Next.js dev server on host port 3000   |
| `api`   | `php:8.3-cli-bookworm`     | Symfony dev server on host port 8000   |
| `db`    | `postgres:16`              | Postgres; host port 5432 for tooling   |

Postgres data is persisted under `./data/postgres` (mount outside both
codebase paths — no overlap).

Develop-only env bindings:

- **`api`**: `APP_ENV=dev`, `APP_NAME={{ options.projectSlug }}`,
  `DATABASE_URL=postgresql://<user>:<password>@db:5432/<dbName>?...`,
  and `APP_SECRET` pulled via `fromSecret: api_app_secret`.
- **`web`**: `NODE_ENV=development`, `APP_NAME`, and
  `NEXT_PUBLIC_API_URL=http://localhost:8000`.

## Options

| id                 | type     | default  | notes                                                 |
| ------------------ | -------- | -------- | ----------------------------------------------------- |
| `projectSlug`      | string   | `my-app` | Displayed as app title; becomes `APP_NAME`.           |
| `databaseName`     | string   | `app`    | Postgres DB name used in the develop `DATABASE_URL`.  |
| `databaseUser`     | string   | `app`    | Develop-only Postgres user.                           |
| `databasePassword` | string   | `app`    | Develop-only Postgres password. **Not used in prod.** |

`{{ options.* }}` is the only substitution scope. The develop `DATABASE_URL`
uses it; cloud `DATABASE_URL` is resolved from `primary-db.connectionString`
at apply time, so cloud callers don't need to reason about user/password here.

## Layout

```
0.1.0/
├── manifest.yaml                 # v2 template manifest
├── README.md                     # this file
└── resources/
    ├── web/
    │   ├── package.json          # next 15 + react 19
    │   ├── next.config.mjs
    │   ├── tsconfig.json
    │   ├── app/layout.tsx        # root App Router layout
    │   ├── app/page.tsx          # fetches /api/greetings from the API
    │   └── .gitignore
    └── api/
        ├── composer.json         # symfony 7 + api-platform 4 + doctrine
        ├── public/index.php      # Symfony front controller
        ├── bin/console
        ├── src/Kernel.php
        ├── src/Entity/Greeting.php  # #[ApiResource] — GET /api/greetings
        ├── config/bundles.php
        ├── config/preload.php
        ├── config/services.yaml
        ├── config/packages/framework.yaml
        ├── config/packages/api_platform.yaml
        ├── config/packages/doctrine.yaml
        ├── config/packages/routing.yaml
        ├── config/routes/api_platform.yaml
        ├── .env
        └── .gitignore
```

## After scaffolding

```bash
# web (host)
cd apps/web && npm install && npm run dev

# api (inside the docker dev service)
docker compose exec api bash -lc '
  composer install &&
  php bin/console doctrine:migrations:migrate --no-interaction &&
  php -S 0.0.0.0:8000 -t public
'
```
