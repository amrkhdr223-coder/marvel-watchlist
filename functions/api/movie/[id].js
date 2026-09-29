import { proxyDetails } from '../../_shared/tmdb.js';

// GET /api/movie/:id — TMDB movie details + credits + external_ids
export async function onRequestGet({ params, env }) {
  return proxyDetails('movie', params.id, env);
}
