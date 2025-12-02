import { useMemo } from 'react';
import type { SimplePokemon } from '../api/types';

/**
 * Hook to filter Pokemon by search query
 * Supports searching by name (partial match) or ID (exact match)
 * @param pokemonList - List of Pokemon to filter
 * @param searchQuery - Search query string
 * @returns Filtered Pokemon list
 */
export const useSearch = (pokemonList: SimplePokemon[] | undefined, searchQuery: string) => {
  return useMemo(() => {
    if (!pokemonList || !searchQuery.trim()) {
      return pokemonList || [];
    }

    const query = searchQuery.trim().toLowerCase();

    // Check if query is a number (ID search)
    const queryAsNumber = parseInt(query, 10);
    const isNumericSearch = !isNaN(queryAsNumber) && query === queryAsNumber.toString();

    return pokemonList.filter((pokemon) => {
      // Exact ID match
      if (isNumericSearch && pokemon.id === queryAsNumber) {
        return true;
      }

      // Partial name match (case-insensitive)
      return pokemon.name.toLowerCase().includes(query);
    });
  }, [pokemonList, searchQuery]);
};
