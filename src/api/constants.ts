// PokeAPI Constants

export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export const ENDPOINTS = {
  POKEMON_LIST: '/pokemon',
  POKEMON_DETAIL: (id: number | string) => `/pokemon/${id}`,
  TYPE: (name: string) => `/type/${name}`,
} as const;

// Sprite fallback priority for Gen III-IV
export const SPRITE_PRIORITY = [
  'generation-iii.firered-leafgreen',
  'generation-iii.emerald',
  'generation-iv.platinum',
  'generation-iv.heartgold-soulsilver',
  'generation-iii.ruby-sapphire',
  'generation-iv.diamond-pearl',
] as const;

// Cache configuration
export const CACHE_CONFIG = {
  POKEMON_LIST_STALE_TIME: 1000 * 60 * 60 * 24, // 24 hours
  POKEMON_LIST_CACHE_TIME: 1000 * 60 * 60 * 24 * 7, // 7 days
  POKEMON_DETAIL_STALE_TIME: 1000 * 60 * 60, // 1 hour
  POKEMON_DETAIL_CACHE_TIME: 1000 * 60 * 60 * 24 * 30, // 30 days
} as const;

// Pagination
export const POKEMON_LIMIT = 10000; // Get all Pokemon
export const INITIAL_LOAD_COUNT = 50; // Load first 50 Pokemon details initially
