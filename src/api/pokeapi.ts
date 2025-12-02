import axios from 'axios';
import { POKEAPI_BASE_URL, ENDPOINTS, POKEMON_LIMIT } from './constants';
import type { PokemonListResponse, Pokemon, SimplePokemon } from './types';

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
 * Fetch the complete list of Pokemon (lightweight - just names and URLs)
 * This returns ~1000+ Pokemon with minimal data
 */
export const fetchPokemonList = async (): Promise<SimplePokemon[]> => {
  const response = await api.get<PokemonListResponse>(ENDPOINTS.POKEMON_LIST, {
    params: { limit: POKEMON_LIMIT },
  });

  // Parse Pokemon IDs from URLs and return simplified list
  return response.data.results.map((pokemon) => {
    // Extract ID from URL: https://pokeapi.co/api/v2/pokemon/1/
    const id = parseInt(pokemon.url.split('/').filter(Boolean).pop() || '0');
    return {
      id,
      name: pokemon.name,
    };
  });
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
