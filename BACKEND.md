# Backend API proxy

The app's TMDB/OMDb calls now go through same-origin `/api/*` endpoints
instead of hitting `api.themoviedb.org` / `www.omdbapi.com` directly from the
browser with a key pasted into Settings. The API keys live only in
server-side environment variables — they're never shipped in the HTML/JS,
never sent from the browser, and never written to localStorage.

```
Before:  PWA (with a pasted key)  →  TMDB / OMDb
Now:     PWA  →  /api/*  (Cloudflare Pages Function, holds the key)  →  TMDB / OMDb
```

## What was added

```
pwa/
  functions/
    _shared/tmdb.js       shared proxy helper (not a route — underscore prefix)
    api/search.js         GET /api/search?type=movie|tv|multi&query=...&year=...
    api/movie/[id].js     GET /api/movie/:id   (TMDB details + credits + external_ids)
    api/tv/[id].js        GET /api/tv/:id      (same, for series)
    api/omdb.js           GET /api/omdb?imdb_id=tt...  (optional IMDb rating)
  .dev.vars.example       template for local env vars (copy to .dev.vars, gitignored)
```

Nothing in `index.html`'s UI, storage keys, data model, or routing changed.
The only thing that changed is *where* the three TMDB call shapes and the one
OMDb call shape go out to — everything is routed through a small set of new
helper functions (`apiFetchJSON`, `tmdbSearch`, `tmdbDetails`,
`fetchImdbRating`) that try the backend first.

## Deploying (Cloudflare Pages)

1. Push this repo (with the `functions/` folder alongside `index.html`) and
   connect it as a Cloudflare Pages project. Pages auto-detects
   `functions/**` and deploys each file as a Function — no build step or
   `wrangler.toml` required for this.
2. In the Pages project → **Settings → Environment variables**, add:
   - `TMDB_API_KEY` (required — a free key from
     https://www.themoviedb.org/settings/api)
   - `OMDB_API_KEY` (optional — from https://www.omdbapi.com/apikey.aspx;
     only adds the IMDb rating shown on some titles)
3. Set both for the **Production** environment, and again for **Preview** if
   you want preview deployments to also have working posters/search.
4. Redeploy (or trigger a new build) so the Functions pick up the variables.

That's the whole setup — normal users never see or enter a key.

### Local dev

```
cp pwa/.dev.vars.example pwa/.dev.vars   # then fill in a real TMDB key
npx wrangler pages dev pwa
```

### Other static hosts

If this is ever deployed somewhere without a Cloudflare Pages Functions
equivalent, the `/api/*` routes simply won't exist. The frontend detects that
(a 404/non-JSON response, once, per session) and falls back to the old
behavior: it works for a user only if they paste a personal key into the
existing Settings modal, exactly like before this update. Nothing needs to be
reconfigured for that fallback to kick in — it's automatic.

## Verifying no secret leaks

- `TMDB_API_KEY` / `OMDB_API_KEY` only exist as Cloudflare env vars, read via
  `env.TMDB_API_KEY` / `env.OMDB_API_KEY` inside `functions/`. They are never
  interpolated into `index.html`, `service-worker.js`, or any response sent
  to the browser.
- The old `mw_tmdb_key` / `mw_omdb_key` localStorage entries are untouched
  and still exist for backward compatibility (a personal key someone already
  saved keeps working as a fallback), but nothing writes a value into them
  automatically and no request needs them when the backend is reachable.
- Browser dev tools → Network tab: search/detail/poster requests now show as
  `GET /api/search?...`, `GET /api/movie/123`, etc. — no `api_key=` query
  param, no `api.themoviedb.org` request unless the backend is genuinely
  unavailable and a personal key is saved.

## Caching / rate-limit behavior

- `/api/search` and `/api/movie|tv/:id` responses are sent with a
  `Cache-Control: public, max-age=...` header, so Cloudflare's edge cache can
  absorb duplicate requests (e.g. the same poster looked up by two users)
  without extra TMDB calls.
- `/api/omdb` is cached for a day, since a rating changes rarely.
- The service worker explicitly never caches `/api/*` or the direct
  TMDB/OMDb URLs (same as before), so results are always fresh at the app
  layer; edge caching above is what absorbs repeat load.
- TMDB rate-limit responses (429) and any other upstream error are passed
  through with their original status code, so the app's existing
  catch-block/empty-state handling reacts exactly as it already did for a
  failed request.
