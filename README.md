# Contrast Coffee

React 19 + TypeScript + Vite site with real Supabase email/password authentication.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and enter values from **Supabase Dashboard > Project Settings > API**:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
   ```

   Legacy anon key also works as client key, but never expose a service-role or secret key in Vite.

3. In **Supabase Dashboard > Authentication > Providers > Email**:
   - Enable Email provider.
   - Disable **Confirm email** so signup returns a session immediately and opens `/workspace`.
   - For self-hosted Supabase, set `GOTRUE_MAILER_AUTOCONFIRM=true` on the Auth/GoTrue service, then restart that service.

4. Run:

   ```bash
   npm run dev
   ```

## Checks

```bash
node src/features/auth/self-check.ts
npm run lint
npm run build
npm run smoke:auth # requires real .env; creates then deletes one test user
```

## Security note

Disabling Confirm email means an account email is not proof that the user owns that mailbox. Do not use it as a verified contact or recovery channel without adding verification later. Supabase handles passwords and sessions; database data must still use Row Level Security policies.

## User data schema

Run `supabase/migrations/20260828060000_user_data.sql` in self-hosted Supabase SQL editor before deploying this client. It creates attendance, one-time check-in tokens, drink orders, workspace tasks, Pomodoro preferences, focus sessions, RLS, and stats RPCs.

Grant a staff account access to one location from SQL editor:

```sql
insert into public.staff_locations (user_id, location_id)
values ('AUTH_USER_UUID', 'phan-van-tri');
```

Staff then opens `/staff/check-in` and generates a five-minute one-time token. Customer enters token from QR in workspace. Never put database password or service-role key in browser code.
