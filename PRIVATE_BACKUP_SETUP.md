# EasyCV private cloud backup setup

## Railway

1. Open the existing EasyCV Railway project.
2. Add a PostgreSQL database service: New -> Database -> PostgreSQL.
3. Open the EasyCV web service -> Variables.
4. Add a reference variable named `DATABASE_URL` whose value is `${{Postgres.DATABASE_URL}}`. If the database service has a different name, select its `DATABASE_URL` from Railway's reference-variable picker.
5. Add `PRIVATE_ACCESS_PASSWORD` with a long, unique password. Do not use a password you use anywhere else.
6. Add `PRIVATE_SESSION_SECRET` with at least 32 random characters. A 64-character random value is recommended.
7. Seal both secret variables from their three-dot menus if your Railway plan supports sealed variables.
8. Deploy the staged changes.

The database table is created automatically the first time the private backup is accessed. No SQL migration is required.

## Use

1. Edit a resume normally on the public editor. The draft remains in that browser's local storage.
2. Manually open `/private`, for example `https://your-domain.up.railway.app/private`.
3. Enter the private password.
4. Choose **Save to cloud** to replace the single cloud backup with this browser's current draft.
5. On another device, open `/private`, sign in, and choose **Load into editor**.

The public editor does not link to `/private`. Knowing the URL does not grant access: all resume read/write API calls require the signed, HTTP-only login cookie.

## Local development

Create `.env.local` in the repository root with a PostgreSQL connection string and the two secrets from `.env.example`. `.env.local` is already ignored by the standard Next.js `.gitignore` and must never be committed.
