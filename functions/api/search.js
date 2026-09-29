import { json } from '../_shared/tmdb.js';

// GET /api/search?type=movie|tv|multi&query=...&year=...
export async function onRequestGet({ request, env }) {
  const TMDB_KEY = env.TMDB_API_KEY;
  if (!TMDB_KEY) return json({ error: 'Server is not configured with a TMDB API key yet.' }, 500);

  const url = new URL(request.url);
  const type = (url.searchParams.get('type') || 'multi').toLowerCase();
  const query = url.searchParams.get('query') || '';
  const year = url.searchParams.get('year') || '';

  if (!['movie', 'tv', 'multi'].includes(type)) {
    return json({ error: 'Invalid search type — expected movie, tv, or multi.' }, 400);
  }
  if (!query.trim()) return json({ results: [] }, 200);

  const upstream = new URL(`https://api.themoviedb.org/3/search/${type}`);
  upstream.searchParams.set('api_key', TMDB_KEY);
  upstream.searchParams.set('query', query);
  if (year && type !== 'multi') upstream.searchParams.set('year', year);

  try {
    const res = await fetch(upstream.toString());
    const data = await res.json();
    if (!res.ok) return json({ error: data?.status_message || 'TMDB search failed' }, res.status);
    // Short cache so identical/duplicate in-flight searches (e.g. fast typing,
    // a poster lookup for a title already searched this session) don't each
    // hit TMDB separately.
    return json(data, 200, { 'Cache-Control': 'public, max-age=1800' });
  } catch (e) {
    return json({ error: 'Unable to reach TMDB right now.' }, 502);
  }
}
