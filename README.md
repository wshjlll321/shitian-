# Shitian UAV Premium Site

Next.js App Router site for Shitian Aviation, including the public marketing pages, bilingual content routes, migrated legacy media, and a Prisma-backed admin CMS.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma with SQLite
- Three.js / React Three Fiber

## Getting Started

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env
```

> **Production deployments must set `ADMIN_SESSION_SECRET`** to a 32+
> character random string. The app refuses to start in `NODE_ENV=production`
> without it. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`.

Prepare the local database:

```bash
npx prisma migrate dev
npm run db:seed
```

Start development:

```bash
npm run dev
```

## Scripts

- `npm run dev` starts the local Next.js dev server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run db:seed` seeds CMS content into the SQLite database.
- `npm run db:admin` creates an admin account. Defaults to `admin / shitian2026` — **change immediately in production**: `ADMIN_USERNAME=foo ADMIN_PASSWORD=long-random-string npm run db:admin`.
- `npm run db:studio` opens Prisma Studio.

## Admin Notes

- `/admin/login` is protected by an 8-attempt-per-minute IP rate limit.
- Public `/api/inquiries` is throttled to 5 submissions per IP per hour.
- Uploads accept `image/*` (jpg/png/webp/gif/avif) and `video/*` (mp4/webm/mov), max 50 MB. SVG is rejected (XSS vector).
- Hero / Operational Proof / Scenario backgrounds support video — file plays muted & looped automatically.

## Repository Notes

Local environment files, generated Next.js output, dependency folders, logs, TypeScript build info, and local SQLite database files are intentionally ignored.
