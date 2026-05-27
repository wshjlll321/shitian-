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
- `npm run db:admin` creates an admin account.
- `npm run db:studio` opens Prisma Studio.

## Repository Notes

Local environment files, generated Next.js output, dependency folders, logs, TypeScript build info, and local SQLite database files are intentionally ignored.
