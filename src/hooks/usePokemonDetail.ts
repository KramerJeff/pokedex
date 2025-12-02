import { useQuery } from '@tanstack/react-query';
import { fetchPokemon } from '../api/pokeapi';
import { CACHE_CONFIG } from '../api/constants';

/**
 * Hook to fetch detailed information for a specific Pokemon
 * @param id - Pokemon ID or name
 * @param enabled - Whether the query should run (default: true)
 * Results are cached for 1 hour in memory and 30 days in localStorage
 */
export const usePokemonDetail = (id: number | string, enabled = true) => {
  return useQuery({
    queryKey: ['pokemon', 'detail', id],
    queryFn: () => fetchPokemon(id),
    enabled: enabled && (!!id || id === 0),
    staleTime: CACHE_CONFIG.POKEMON_DETAIL_STALE_TIME,
    gcTime: CACHE_CONFIG.POKEMON_DETAIL_CACHE_TIME,
  });
};
