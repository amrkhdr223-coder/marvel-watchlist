import { json } from '../_shared/tmdb.js';

// GET /api/omdb?imdb_id=tt1234567
// Optional: the app has never required an IMDb rating to function, so a
// missing OMDB_API_KEY on the server is not an error — it just means no
// server-side rating source is configured (mirrors the old "skip this and
// everything else still works fine" behavior from the Settings modal).
export async function onRequestGet({ request, env }) {
  const OMDB_KEY = env.OMDB_API_KEY;
  if (!OMDB_KEY) return json({ configured: false }, 200);

  const url = new URL(request.url);
  const imdbId = url.searchParams.get('imdb_id') || '';
  if (!imdbId) return json({ error: 'Missing imdb_id' }, 400);

  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${encodeURIComponent(imdbId)}&apikey=${encodeURIComponent(OMDB_KEY)}`);
    const data = await res.json();
    // OMDb responds 200 even for a "not found" result (Response: "False"), so
    // just pass it straight through — the frontend already only reads
    // data.imdbRating and treats anything else as "no rating".
    return json(data, 200, { 'Cache-Control': 'public, max-age=86400' });
  } catch (e) {
    return json({ error: 'Unable to reach OMDb right now.' }, 502);
  }
}
