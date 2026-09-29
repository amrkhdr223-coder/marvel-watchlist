// Shared helpers for the /api/* Cloudflare Pages Functions.
// Lives under an underscore-prefixed folder so Pages does NOT treat it as
// a route by itself — only api/search.js, api/movie/[id].js, etc. are routes.

export function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders }
  });
}

// GET /api/movie/:id or /api/tv/:id — proxies TMDB's details endpoint with
// credits + external_ids appended (the app always needs both together).
export async function proxyDetails(kind, id, env) {
  const TMDB_KEY = env.TMDB_API_KEY;
  if (!TMDB_KEY) return json({ error: 'Server is not configured with a TMDB API key yet.' }, 500);
  if (!id) return json({ error: 'Missing id' }, 400);

  const upstream = `https://api.themoviedb.org/3/${kind}/${encodeURIComponent(id)}` +
    `?api_key=${encodeURIComponent(TMDB_KEY)}&append_to_response=credits,external_ids`;

  try {
    const res = await fetch(upstream);
    const data = await res.json();
    if (!res.ok) {
      // Pass through TMDB's own status (404 for unknown id, 401 for a bad
      // server key, 429 for rate limiting) so the frontend's existing
      // catch/empty-state handling reacts the same way it always has.
      return json({ error: data?.status_message || `TMDB ${kind} lookup failed` }, res.status);
    }
    // Short cache: details rarely change minute to minute, and this cuts
    // duplicate upstream calls when several viewers open the same title.
    return json(data, 200, { 'Cache-Control': 'public, max-age=3600' });
  } catch (e) {
    return json({ error: 'Unable to reach TMDB right now.' }, 502);
  }
}
