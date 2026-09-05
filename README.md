# SightlineScan — Web Accessibility Auditor

## What This Is

A web app where you paste any URL and get back a real WCAG accessibility audit: what's broken, how severe it is, and exactly how to fix it. Same category of checks that trigger real ADA lawsuits — this makes them visible and actionable in seconds.

**Goal for today: a working, deployed MVP.** Polish and extra features come after — get the core loop functional first.

---

## Core User Flow

1. User lands on a clean single-page site with one input: a URL field.
2. User pastes a URL, clicks "Scan."
3. Loading state (a few seconds — it's actually crawling the live site).
4. Report renders: overall score, issues grouped by severity (Critical / Serious / Moderate / Minor), each issue showing:
   - What's wrong (plain English, not just the WCAG code)
   - The WCAG criterion it violates (e.g., "1.1.1 Non-text Content")
   - The exact HTML snippet that failed
   - A suggested fix
5. Nice-to-have if time allows: a shareable report link, and a "score badge" the user could embed.

---

## Tech Stack

- **Frontend:** React (Vite), plain CSS or Tailwind — keep it fast, not fancy yet
- **Backend:** Node.js + Express (or a Vercel serverless function if deploying on Vercel)
- **Crawler/audit engine:** Puppeteer (headless Chrome) + `axe-core` — axe-core does the actual WCAG rule-checking, don't reinvent this
- **Deployment:** Vercel (frontend + serverless function) — needs a real live URL by end of day

---

## How the Audit Actually Works

1. Backend receives a URL from the frontend.
2. Puppeteer launches headless Chrome, navigates to the URL, waits for the page to load.
3. Inject and run `axe-core` against the fully-rendered DOM (this matters — a lot of accessibility issues only show up after JS renders).
4. `axe-core` returns a list of violations, each with: rule ID, impact level (critical/serious/moderate/minor), the failing DOM nodes, and a description.
5. Backend transforms this raw output into a clean JSON shape the frontend can render (see below).
6. Frontend displays the grouped, formatted report.

---

## Suggested API Contract

`POST /api/scan`

Request:
```json
{ "url": "https://example.com" }
```

Response:
```json
{
  "url": "https://example.com",
  "score": 72,
  "totalIssues": 14,
  "summary": {
    "critical": 2,
    "serious": 5,
    "moderate": 4,
    "minor": 3
  },
  "issues": [
    {
      "id": "image-alt",
      "impact": "critical",
      "wcagCriterion": "1.1.1 Non-text Content",
      "description": "Image is missing alternative text",
      "htmlSnippet": "<img src=\"hero.jpg\">",
      "suggestedFix": "Add a descriptive alt attribute, e.g. alt=\"Team photo at company retreat\""
    }
  ]
}
```

The "score" can just be a simple weighted formula for now (e.g., 100 minus weighted penalty per issue by severity) — doesn't need to be scientifically rigorous for the MVP.

---

## MVP Scope (build this today)

- [ ] Single input page, URL submission
- [ ] Backend endpoint that runs Puppeteer + axe-core against the submitted URL
- [ ] Transform axe-core output into the report JSON shape above
- [ ] Report page rendering: score, severity counts, list of issues with snippet + fix
- [ ] Deployed and live on a public URL
- [ ] Basic error handling (invalid URL, site blocks headless browsers, timeout)

## Explicitly Out of Scope for Today

- User accounts / saved scan history
- PDF export of reports
- Scanning multiple pages of a site (single-page scan only for now)
- Custom rule configuration
- Polished animations/design — functional and clean is enough

---

## Notes for Claude Code

- Prioritize getting the full flow working end-to-end (even ugly) before polishing any one part.
- Use `axe-core`'s official Puppeteer integration pattern (there's a documented way to inject and run it against a page — look this up rather than hand-rolling injection).
- Handle sites that take a while to load or block headless browsers gracefully — don't let one bad URL crash the server.
- Keep the JSON contract above stable so frontend and backend can be built/tested somewhat independently.
- If time is short, hardcode a couple of known test URLs to demo against, in case live scanning of arbitrary sites is unreliable under time pressure.

---

## Project Layout

- `client/` — React + Vite frontend
- `server/` — Node + Express backend (Puppeteer + axe-core)

## Local Development

```bash
# Terminal 1 — backend
cd server
npm install
npm start        # http://localhost:3001

# Terminal 2 — frontend
cd client
npm install
npm run dev       # http://localhost:5173
```

The frontend reads the backend URL from `VITE_API_URL` (see `client/.env.development`, already set to `http://localhost:3001`).

## Deployment (free)

Puppeteer needs a real headless-Chrome environment with enough memory, which serverless functions (Vercel/Netlify Functions) handle poorly within their free-tier size/time limits. The split below keeps everything on free tiers:

- **Backend → [Render](https://render.com)**, free Web Service (persistent Node process, not a serverless function).
- **Frontend → [Netlify](https://netlify.com)**, free static hosting.

### 1. Push this repo to GitHub

Render and Netlify both deploy from a connected Git repo.

### 2. Deploy the backend to Render

Easiest: use the included `render.yaml` (Render calls this a "Blueprint").

1. In the Render dashboard: **New → Blueprint**, pick this repo.
2. Render reads `render.yaml` and creates a free Web Service named `sightlinescan-api` rooted at `server/`, using `server/render-build.sh` to install Puppeteer's Chromium into a cache path Render persists across deploys.
3. Deploy. First build takes a few minutes (downloading Chromium). Note the resulting URL, e.g. `https://sightlinescan-api.onrender.com`.

(No Blueprint? Create the Web Service manually: root directory `server`, build command `bash render-build.sh`, start command `npm start`, add env var `PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer`.)

Free-tier caveat: the service spins down after ~15 minutes of no traffic and takes 30–60s to wake back up on the next request — expected on a free plan, not a bug.

### 3. Deploy the frontend to Netlify

1. In the Netlify dashboard: **Add new site → Import an existing project**, pick this repo. `netlify.toml` already points Netlify at `client/` with the right build command and publish directory.
2. Add an environment variable: `VITE_API_URL` = your Render backend URL from step 2 (no trailing slash).
3. Deploy.

### 4. Lock down CORS

Back in Render, set the backend's `FRONTEND_URL` env var to your live Netlify URL (instead of `*`) and redeploy, so the API only accepts requests from your site.

### Costs

Both Render's free Web Service and Netlify's free static hosting tier cost nothing for this project's traffic. The only real trade-off is the Render cold-start after idling.