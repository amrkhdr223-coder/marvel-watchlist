import { proxyDetails } from '../../_shared/tmdb.js';

// GET /api/tv/:id — TMDB tv details + credits + external_ids
export async function onRequestGet({ params, env }) {
  return proxyDetails('tv', params.id, env);
}
