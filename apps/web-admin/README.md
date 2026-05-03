# Web Application

This project is a Next.js frontend managed by Nx.

## Run locally
```bash
yarn nx run <project-name>:dev
```

Replace `<project-name>` with one of:
- `@autospace/web`
- `@autospace/web-admin`
- `@autospace/web-manager`
- `@autospace/web-valet`

## Build
```bash
yarn nx run <project-name>:build
```

## Required environment variables
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_MAPBOX_TOKEN` (if map features are used)
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (if uploads are used)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (if uploads are used)
