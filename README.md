# Midnight Ledger

A private internship application tracker with passwordless, email-delivered access tokens.

## Local setup

1. Install dependencies with `npm install`.
2. Create a Neon or Supabase Postgres database and run [`database/migration.sql`](database/migration.sql) in its SQL editor.
3. Copy `.env.example` to `.env.local` and fill in the values. Generate `SESSION_SECRET` with `openssl rand -base64 48` (or another cryptographically secure generator).
4. Create a Resend account. Add and verify a sending domain under **Domains**, add the required DNS records, then create an API key. Set `RESEND_FROM` to an address on that verified domain.
5. Run the full Vercel development environment with `npx vercel dev`. Plain `npm run dev` serves only the Vite frontend and does not emulate `/api` functions.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project**, import the repository, and keep the detected Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Under **Settings → Environment Variables**, add `DATABASE_URL`, `RESEND_API_KEY`, `RESEND_FROM`, `SESSION_SECRET`, and `APP_URL`. Apply them to Production and Preview as appropriate.
4. Deploy. Set `APP_URL` to the final HTTPS Vercel URL, then redeploy once so every function receives it.
5. In Resend, keep the verified domain active. The default `onboarding@resend.dev` sender is suitable only for limited testing to the account owner's email.

After later changes, push to the connected production branch; Vercel builds and deploys automatically. For a manual CLI deployment, use `npx vercel --prod` after logging in.

## Test checklist

- Register a new normalized email address and confirm no token is displayed in the browser.
- Receive the email and verify its dark Midnight Ledger design and `ml_` token.
- Paste an invalid token and confirm the generic error.
- Paste the emailed token and log in.
- If browser-local legacy data exists, accept its one-time account import.
- Add, edit, move, follow up on, and delete an application.
- Export JSON and import it back into the account.
- Log out and confirm the ledger is inaccessible.
- Log in on another browser or device with the token and confirm the same applications appear.
- Use **New token**, confirm the email arrives, and confirm the previous token no longer works for new logins.
- Use **Lost your token?** with both registered and unknown emails; confirm both screens show the same neutral response.
- Trigger six rapid attempts and confirm HTTP 429 / the rate-limit message.

## Security notes

- Access tokens and session cookie values are stored only as irreversible digests. Token verification uses a constant-time comparison.
- Session cookies are `HttpOnly`, `Secure`, `SameSite=Lax`, and expire after 30 days.
- Application queries always include the authenticated `user_id`; IDs alone never authorize access.
- API payloads are strict and length-limited. Vercel headers enforce HTTPS persistence, content restrictions, and clickjacking protection.
- Server errors never log access tokens.
