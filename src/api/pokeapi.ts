import axios from 'axios';
import { POKEAPI_BASE_URL, ENDPOINTS, POKEMON_LIMIT } from './constants';
import type { PokemonListResponse, Pokemon, SimplePokemon, TypeResponse } from './types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: POKEAPI_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Error setting up request
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Extract a Pokemon ID from a PokeAPI resource URL.
 * e.g. "https://pokeapi.co/api/v2/pokemon/25/" → 25
 */
export const parsePokemonId = (url: string): number => {
  const id = parseInt(url.split('/').filter(Boolean).pop() || '0', 10);
  return Number.isNaN(id) ? 0 : id;
};

/**
 * Fetch the complete list of Pokemon (lightweight - just names and URLs)
 * This returns ~1000+ Pokemon with minimal data
 */
export const fetchPokemonList = async (): Promise<SimplePokemon[]> => {
  const response = await api.get<PokemonListResponse>(ENDPOINTS.POKEMON_LIST, {
    params: { limit: POKEMON_LIMIT },
  });

  // Parse Pokemon IDs from URLs and return simplified list
  return response.data.results.map((pokemon) => ({
    id: parsePokemonId(pokemon.url),
    name: pokemon.name,
  }));
};

/**
 * Fetch the IDs of every Pokemon belonging to a given type.
 * One request per type (vs. one per Pokemon) — the efficient way to type-filter.
 * Returns a plain number[] so React Query can persist it to localStorage.
 */
export const fetchTypePokemonIds = async (type: string): Promise<number[]> => {
  const response = await api.get<TypeResponse>(ENDPOINTS.TYPE(type));
  return response.data.pokemon.map((entry) => parsePokemonId(entry.pokemon.url));
};

/**
 * Fetch detailed information for a specific Pokemon
 */
export const fetchPokemon = async (id: number | string): Promise<Pokemon> => {
  const response = await api.get<Pokemon>(ENDPOINTS.POKEMON_DETAIL(id));
  return response.data;
};

/**
 * Fetch multiple Pokemon in parallel
 * Useful for initial batch loading
 */
export const fetchPokemonBatch = async (ids: number[]): Promise<Pokemon[]> => {
  const promises = ids.map((id) => fetchPokemon(id));
  return Promise.all(promises);
};

export default api;
