# Vite + React + SSR (Vercel) — Minimal Demo

## Scripts
- `npm run dev` — local dev (CSR only)
- `npm run build` — builds client to `dist/` and SSR bundle to `dist-ssr/`
- `vercel dev` — run with Vercel emulation (SSR API route)

## Deploy to Vercel
1. Push to a Git repo and import into Vercel.
2. Ensure **Output Directory** is `dist`.
3. `vercel.json` routes all requests to `api/ssr.ts` (SSR), except static assets.
