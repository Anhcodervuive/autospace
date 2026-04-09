# Autospace Local Setup

This repository is an Nx monorepo with:
- Frontend: Next.js app at `apps/web` (runs on `http://localhost:3001`)
- Backend: NestJS app at `apps/api` (runs on `http://localhost:3000`)
- Database: PostgreSQL via Docker Compose at `apps/api/docker-compose.yaml` (host port `2010`)

## Prerequisites

- Node.js 20+ (LTS recommended)
- Yarn 4
- Docker Desktop (or Docker Engine with Compose)

## 1. Install dependencies

From repository root:

```bash
yarn install
```

## 2. Verify environment files

These files already exist in this repo:
- `apps/api/.env`
- `apps/web/.env`

Expected values:

```env
# apps/api/.env
DATABASE_URL="postgres://postgres:password@localhost:2010/postgres"
JWT_SECRET="dev-secret"
```

```env
# apps/web/.env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 3. Start PostgreSQL with Docker

From repository root:

```bash
docker compose -f apps/api/docker-compose.yaml up -d
```

Optional check:

```bash
docker ps --filter "name=autospace_db"
```

## 4. Apply database migrations (Prisma)

From repository root:

```bash
yarn workspace @autospace/api exec prisma migrate deploy
yarn workspace @autospace/api exec prisma generate
```

## 5. Run backend

In terminal 1 (from repository root):

```bash
yarn workspace @autospace/api start:dev
```

Backend endpoints:
- Swagger: `http://localhost:3000/`
- GraphQL: `http://localhost:3000/graphql`

## 6. Run frontend

In terminal 2 (from repository root):

```bash
yarn workspace @autospace/web dev
```

Frontend URL:
- `http://localhost:3001`

## Stop everything

- Stop frontend/backend: `Ctrl + C` in each terminal
- Stop database:

```bash
docker compose -f apps/api/docker-compose.yaml down
```

- Stop database and remove data volume:

```bash
docker compose -f apps/api/docker-compose.yaml down -v
```

## Notes

- If Yarn is blocked in PowerShell by execution policy, use `yarn.cmd` instead of `yarn`.
- PostgreSQL credentials from compose file:
  - User: `postgres`
  - Password: `password`
  - Database: `postgres`
  - Host: `localhost`
  - Port: `2010`
