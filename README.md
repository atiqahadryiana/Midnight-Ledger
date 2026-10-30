# Midnight Ledger

> Every application, accounted for.

Midnight Ledger is a private internship application tracker with a calm, dark editorial interface. It combines Kanban and list workflows with follow-up reminders, account-scoped cloud storage, and passwordless access tokens delivered by email.

[Open Midnight Ledger](https://midnightledger.vercel.app)

## Features

- Private accounts with email-delivered access tokens
- Board and list views with search, filters, and sorting
- Automatic “days since applied” counters and follow-up reminders
- Dashboard totals for active applications, interviews, offers, and rejections
- Drag-and-drop status updates with an accessible selector alternative
- Responsive dark and light themes
- JSON import and export
- One-time migration of legacy browser-local applications
- Account-linked feedback with optional moon ratings and device context
- Developer credit linking to GitHub from every screen

## Technology

- React and Vite
- Vercel Functions
- PostgreSQL through Supabase or Neon
- Resend transactional email
- Zod validation and Lucide icons
- Plain CSS with responsive design tokens

## Security model

- Tokens contain at least 32 random bytes, are delivered by email, and are stored only as SHA-256 hashes.
- Token verification uses a constant-time comparison.
- Session identifiers are random, HMAC-protected, and stored as digests.
- Session cookies are `HttpOnly`, `Secure`, `SameSite=Lax`, and expire after 30 days.
- Authentication endpoints are rate limited by IP and account identifier.
- Every application query is scoped to the authenticated `user_id`.
- API inputs are strict, normalized, and length limited.

## Project structure

```text
api/                  Vercel authentication and application endpoints
database/             PostgreSQL migration
lib/                  Database, auth, email, validation, and rate limiting
src/                  React interface and design system
```

## Requirements

- Node.js 20 or later
- A Supabase or Neon Postgres database
- A Resend account
- A Vercel account for deployment

## Database setup with Supabase

1. Create a project in the [Supabase dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor** and run [`database/migration.sql`](database/migration.sql).
3. Block direct access through Supabase’s public Data API:

```sql
alter table public.users enable row level security;
alter table public.applications enable row level security;
alter table public.sessions enable row level security;
alter table public.rate_limits enable row level security;
alter table public.feedback enable row level security;
```

4. Select **Connect → Transaction pooler → URI**.
5. Replace the password placeholder and use port `6543`.
6. Append `?sslmode=require` if the URI has no query string.

```text
postgresql://postgres.PROJECT_REF:PASSWORD@POOLER_HOST:6543/postgres?sslmode=require
```

## Resend setup

1. Create an account at [Resend](https://resend.com/).
2. Add a sending domain and publish the supplied DNS records.
3. Wait for the domain to become verified.
4. Create a sending-only API key.
5. Use a sender on the verified domain:

```text
Midnight Ledger <access@mail.example.com>
```

`onboarding@resend.dev` is suitable only for limited testing with the Resend account owner’s email.

## Environment variables

Copy the template:

```powershell
Copy-Item .env.example .env.local
```

Configure:

```dotenv
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
RESEND_FROM=Midnight Ledger <access@mail.example.com>
SESSION_SECRET=replace-with-a-secure-random-value
APP_URL=http://localhost:3000
OWNER_EMAIL=owner@example.com
VITE_GITHUB_USERNAME=atiqahadryiana
```

Generate `SESSION_SECRET` in Windows PowerShell:

```powershell
$bytes = New-Object byte[] 48; $rng = [Security.Cryptography.RandomNumberGenerator]::Create(); $rng.GetBytes($bytes); [Convert]::ToBase64String($bytes); $rng.Dispose()
```

Never commit `.env.local` or expose secrets through variables prefixed with `VITE_`.

## Local development

```powershell
npm install
npx vercel login
npx vercel dev
```

Plain `npm run dev` starts only Vite and does not emulate the `/api` functions.

Create a production build with:

```powershell
npm run build
```

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, select **Add New → Project** and import it.
3. Use the following settings:

```text
Framework: Vite
Build command: npm run build
Output directory: dist
Install command: npm install
```

4. Add these environment variables under **Settings → Environment Variables**:

```text
DATABASE_URL
RESEND_API_KEY
RESEND_FROM
SESSION_SECRET
APP_URL
OWNER_EMAIL
VITE_GITHUB_USERNAME
```

5. Deploy, set `APP_URL` to the final HTTPS address, and redeploy.

## API routes

| Method   | Route                   | Purpose                               |
| -------- | ----------------------- | ------------------------------------- |
| `POST`   | `/api/auth/register`    | Register or replace an existing token |
| `POST`   | `/api/auth/login`       | Exchange a token for a session        |
| `POST`   | `/api/auth/recover`     | Replace a lost token                  |
| `POST`   | `/api/auth/regenerate`  | Regenerate a token while logged in    |
| `POST`   | `/api/auth/logout`      | End the current session               |
| `GET`    | `/api/auth/me`          | Read the current session              |
| `GET`    | `/api/applications`     | List the user’s applications          |
| `POST`   | `/api/applications`     | Create an application                 |
| `PUT`    | `/api/applications/:id` | Update an owned application           |
| `DELETE` | `/api/applications/:id` | Delete an owned application           |
| `POST`   | `/api/feedback`         | Submit authenticated user feedback    |

## Test checklist

- Register and confirm that no token appears in the browser.
- Receive the email and log in with its `ml_` token.
- Add, edit, move, follow up on, and delete an application.
- Log out and confirm that the ledger is inaccessible.
- Log in from another browser and confirm the same data appears.
- Regenerate the token and verify that the old token cannot create a new session.
- Test recovery with registered and unknown emails; both must show the same neutral message.
- Register a second account and confirm that the accounts cannot see each other’s data.

- Open the footer GitHub link and confirm it opens in a new tab.
- Submit feedback and confirm the owner email and database row arrive.
- Submit five notes within an hour and confirm the sixth is rate limited.

### Updating an existing database for feedback

If the original migration was already applied, run [`database/002_feedback.sql`](database/002_feedback.sql) in the Supabase SQL Editor. Add `OWNER_EMAIL` and `VITE_GITHUB_USERNAME` in Vercel, then redeploy.

## Redeploying changes

```powershell
npm run build
git add .
git commit -m "Describe the change"
git push origin main
```

Vercel builds and publishes changes pushed to the connected production branch automatically.
