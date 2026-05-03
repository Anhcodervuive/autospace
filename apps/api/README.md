# API Service (`@autospace/api`)

NestJS backend for AutoSpace.

## Run locally
```bash
yarn nx run @autospace/api:start:dev
```

## Build & run production
```bash
yarn nx run @autospace/api:build
yarn nx run @autospace/api:start:prod
```

## Required environment variables
- `JWT_SECRET` (mandatory in production)
- `PORT`
- `CORS_ORIGINS` (comma-separated allowlist, example: `https://app.example.com,https://admin.example.com`)
- `STRIPE_SECRET_KEY`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`
- `BOOKINGS_REDIRECT_URL`

## Production notes
- CORS is configured from `CORS_ORIGINS`.
- In development, localhost origins are allowed by default.
