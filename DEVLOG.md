# Dev Log — StackLeak (Credex Internship Assignment)

---

## Day 1 — May 7, 2026

**Hours worked:** 4

**What I did:**
Initialized the GitHub repo and scaffolded the full Next.js 14 (App Router) project with TypeScript, Tailwind CSS, ESLint, and Vitest. Set up the folder structure — `app/`, `lib/`, `data/`, `types/`, `__tests__/` — following the architecture I planned in `ARCHITECTURE.md`. Chose the project name **StackLeak** after brainstorming five options. Got local dev running (`npm run dev`), wrote the core audit engine as a pure TypeScript function, created stub API routes for `/api/audit` and `/api/leads`, added a seed `tools.json` with five AI tools and their canonical pricing, and wired up Supabase client (anon + service role). Also set up a GitHub Actions CI pipeline that runs lint and Vitest on every push to `main`.

**What I learned:**
Next.js 14 App Router handles API routes differently from the Pages Router — `route.ts` files replace `pages/api/`. I also learned that Supabase's `service_role` key must **never** be exposed to the browser, so I had to build a separate `supabaseAdmin()` factory that's only called inside server-side route handlers. Vitest's `jsdom` environment needs explicit setup via `vitest.setup.ts` to get `@testing-library/jest-dom` matchers working — this wasn't obvious from the docs and took a bit of debugging.

**Blockers / what I'm stuck on:**
The main decision I'm still not fully confident on: **Supabase vs. Cloudflare D1** for lead storage. Supabase has a more generous free tier, a JS client I already know, and Row Level Security built in — but D1 pairs natively with Cloudflare Pages if I ever want edge deployment. I went with Supabase for now because the assignment timeline is 7 days and I can't afford to learn a new edge SQL API mid-sprint, but I want to revisit this if Supabase's free tier becomes a constraint during demo.

**Plan for tomorrow:**
Build the `SubscriptionForm` component — a dynamic table where users can add/remove rows (tool name, plan, seats, monthly cost). Hook it up to `POST /api/audit` and render the `AuditReport` component with savings breakdown and alternative suggestions. Aim to have the full input → audit → results flow working end-to-end locally by end of Day 2, even if it's unstyled.
