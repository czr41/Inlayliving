# Inlay Living

Dependency-free modular static rendering with Vercel Node API routes. The supplied design, typography, animation, and embedded photography are preserved. Components live in src/components, shared CSS and behaviour in public/assets, and category data in src/content/categories.json. CategoryCard is reused for each category. Build with `node scripts/build.mjs`; preview with `node scripts/dev.mjs`.

## Staff studio

`/staff` edits contact fields, 63 plain-text content fields, and 17 media slots. JPG, PNG, and WebP uploads use Supabase Storage; published content is stored in Postgres. All writes verify the Supabase user and an explicit staff allowlist. Access tokens are in Secure HttpOnly SameSite cookies with a maximum one-hour session. Sign in again when a session expires. No self-registration or public staff grants.

## Backend activation

Create a separate Inlay Supabase project in the organization chosen by the owner. Run backend-setup.sql, configure SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY on Vercel, create the initial Auth account for the designated staff member, and add its actual user ID to inlay_staff. Use Supabase's dashboard for secure password setup; never commit credentials. Redeploy after setting environment variables. Public pages use bundled defaults until the backend is ready. Staff publishing and uploads intentionally fail closed while unconfigured.

## Content limitations

Phone, WhatsApp, address, and social destinations await real details. Enquiries open an email draft to the configured contact email or a WhatsApp draft; the visitor must send it. It is not automatic email delivery. No invented phone numbers or directions. Some original media slots have no photograph. Staff edits text and media, not arbitrary HTML or page structure. Uploaded but unpublished media remains in the library. Concurrent editors should coordinate publishing; this initial editor does not support multi-user draft merging.
