# AutoSpace Monorepo

AutoSpace is an Nx monorepo containing multiple Next.js frontends, a NestJS API, and shared libraries.

## Tech Stack
- Nx workspace orchestration
- Next.js applications (`apps/web*`, `apps/web-manager`, `apps/web-valet`)
- NestJS API (`apps/api`)
- Shared libraries (`libs/ui`, `libs/util`, `libs/forms`, `libs/network`, `libs/3d`)

## Prerequisites
- Node.js 20+
- Yarn (workspace scripts use Yarn)

## Installation
```bash
yarn install
```

## Run projects with Nx
```bash
# List projects
yarn nx show projects

# Start API
yarn nx run @autospace/api:start:dev

# Start a web app
yarn nx run @autospace/web:dev
```

## Environment Variables
Create local env files for apps as needed. Important production variables include:
- `JWT_SECRET`
- `CORS_ORIGINS` (comma-separated list)
- `PORT`
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`
- `BOOKINGS_REDIRECT_URL`

## Quality checks
```bash
yarn nx run-many -t lint
yarn nx run-many -t tsc
yarn nx run-many -t build
```
