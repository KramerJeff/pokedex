import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import type { FilterMode, PokemonTypeName } from '../api/types';
import { fetchTypePokemonIds } from '../api/pokeapi';
import { CACHE_CONFIG } from '../api/constants';
import { combineIdSets } from '../utils/pokemonHelpers';

/**
 * Hook to compute the set of Pokemon IDs matching the selected type filters.
 *
 * Instead of fetching every Pokemon's details to read its types, this fetches
 * the lightweight `/type/{name}` endpoint once per *selected* type (≤18 total,
 * usually 1-2) and combines the resulting ID lists:
 *   - OR  → union (matches at least one selected type)
 *   - AND → intersection (matches every selected type)
 *
 * @param selectedTypes - Selected type filters
 * @param filterMode - AND or OR mode
 * @returns `matchingIds` is a Set of IDs to keep, or `null` when no type filter
 *          is active (meaning "don't filter by type at all").
 */
export const useTypeFilter = (
  selectedTypes: PokemonTypeName[],
  filterMode: FilterMode
) => {
  const typeQueries = useQueries({
    queries: selectedTypes.map((type) => ({
      queryKey: ['type', type],
      queryFn: () => fetchTypePokemonIds(type),
      // Type membership rarely changes — cache it like Pokemon details.
      staleTime: CACHE_CONFIG.POKEMON_DETAIL_STALE_TIME,
      gcTime: CACHE_CONFIG.POKEMON_DETAIL_CACHE_TIME,
    })),
  });

  const isLoading = typeQueries.some((query) => query.isLoading);

  // Stable signature so the Set is only rebuilt when the resolved data changes,
  // not on every render (typeQueries is a fresh array each render).
  const signature = typeQueries
    .map((query) => (query.data ? query.data.length : 'pending'))
    .join('|');

  const matchingIds = useMemo<Set<number> | null>(() => {
    // No type filter active.
    if (selectedTypes.length === 0) return null;

    // Wait until every selected type has resolved before computing a result.
    if (isLoading) return null;

    const idArrays = typeQueries
      .map((query) => query.data)
      .filter((data): data is number[] => data !== undefined);

    return combineIdSets(idArrays, filterMode);
    // typeQueries intentionally omitted; `signature` captures its resolved data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypes.length, filterMode, isLoading, signature]);

  return {
    matchingIds,
    isLoading: selectedTypes.length > 0 ? isLoading : false,
  };
};
