import { useQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../api/pokeapi';
import { CACHE_CONFIG } from '../api/constants';

/**
 * Hook to fetch the complete list of Pokemon
 * Returns a lightweight list of all Pokemon with just ID and name
 * Results are cached for 24 hours in memory and 7 days in localStorage
 */
export const usePokemonList = () => {
  return useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: fetchPokemonList,
    staleTime: CACHE_CONFIG.POKEMON_LIST_STALE_TIME,
    gcTime: CACHE_CONFIG.POKEMON_LIST_CACHE_TIME,
  });
};
