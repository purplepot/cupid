# VMET Campus

Match VIT students by campus and shared interests. Built with Vite, React, TypeScript, Tailwind, and Supabase (auth, storage, RLS).

## Features

- Student auth via Supabase; VIT-email gate for signup.
- Profile creation and editing (bio, campus, gender, interests, hobbies).
- Admin panel to generate and reveal matches (campus-only pairing, shared hobbies required).
- Realtime dashboard updates on match reveal; partner profile visible when revealed.
- Responsive UI with shadcn-ui components.

## Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn-ui
- Supabase (Postgres + Auth + RLS)
- React Router, TanStack Query

## Getting Started

```sh
git clone <repo>
cd vmet
npm install
npm run dev
```

### Env vars (required)

Create `.env.local` (or `.env`) with:

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_ADMIN_EMAILS=admin1@vitstudent.ac.in,admin2@vitstudent.ac.in
```

Rebuild/redeploy after changing envs (Vite reads at build time).

### Supabase policies (must exist)

Ensure RLS on `profiles` and `matches`, plus policies such as:

- profiles: insert/update/select where `auth.uid() = user_id`.
- matches: user can select their rows; admin can select/insert/update.
- partner view: allow selecting matched partner profile when a revealed match exists.

### Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview build
- `npm run lint` – lint
- `npm run test` / `npm run test:watch` – unit tests

## Admin Usage

- Log in with an admin email (in `VITE_ADMIN_EMAILS`) or a user whose `app_metadata.role` is `admin`.
- Go to `/admin` to generate matches and reveal all.
- Dashboard shows an Admin button for admins and realtime match updates.

## Matching Logic (current)

- Greedy pairing within the same campus.
- Requires mutual interest compatibility and at least one shared hobby.
- Each matched user gets a mirrored row; reveal flips `revealed` to true.

## Deployment Notes

- Set envs in your host (e.g., Vercel) and redeploy.
- Confirm the frontend points to the correct Supabase project (URL/key).
- If admin access fails in prod, recheck envs and ensure a fresh login for a JWT carrying `role: admin`.

## Troubleshooting

- Duplicate key on profiles: ensure upsert uses `onConflict: user_id` (implemented) and policies allow upsert.
- Cannot see partner after reveal: confirm partner-view RLS policy and that the match is `revealed = true`.
- Mobile admin button missing: ensured visible for all sizes; hard refresh after deploy.
