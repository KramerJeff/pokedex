import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import type { Pokemon, FilterMode, PokemonTypeName } from '../api/types';
import { fetchPokemon } from '../api/pokeapi';
import { CACHE_CONFIG } from '../api/constants';

/**
 * Hook to filter Pokemon by types
 * @param pokemonIds - List of Pokemon IDs to filter
 * @param selectedTypes - Selected type filters
 * @param filterMode - AND or OR mode
 * @returns Filtered Pokemon IDs
 */
export const useTypeFilter = (
  pokemonIds: number[],
  selectedTypes: PokemonTypeName[],
  filterMode: FilterMode
) => {
  // Fetch Pokemon details for all IDs (will use cache for already-fetched Pokemon)
  // Always call useQueries to maintain hook order
  const pokemonQueries = useQueries({
    queries: pokemonIds.map((id) => ({
      queryKey: ['pokemon', 'detail', id],
      queryFn: () => fetchPokemon(id),
      staleTime: CACHE_CONFIG.POKEMON_DETAIL_STALE_TIME,
      gcTime: CACHE_CONFIG.POKEMON_DETAIL_CACHE_TIME,
      enabled: selectedTypes.length > 0, // Only fetch if types are selected
    })),
  });

  const isLoading = pokemonQueries.some((query) => query.isLoading);

  const filteredIds = useMemo(() => {
    // If no filters, return all IDs
    if (selectedTypes.length === 0) {
      return pokemonIds;
    }

    // Wait for all queries to complete
    if (isLoading) return [];

    const pokemonData = pokemonQueries
      .map((query) => query.data)
      .filter((data): data is Pokemon => data !== undefined);

    return pokemonData
      .filter((pokemon) => {
        const pokemonTypes = pokemon.types.map((t) => t.type.name as PokemonTypeName);

        if (filterMode === 'AND') {
          // Pokemon must have ALL selected types
          return selectedTypes.every((type) => pokemonTypes.includes(type));
        } else {
          // Pokemon must have AT LEAST ONE selected type
          return selectedTypes.some((type) => pokemonTypes.includes(type));
        }
      })
      .map((pokemon) => pokemon.id);
  }, [pokemonQueries, selectedTypes, filterMode, isLoading, pokemonIds]);

  return {
    filteredIds,
    isLoading: selectedTypes.length > 0 ? isLoading : false,
  };
};
