import { useMemo } from 'react';
import { PokemonCard } from './PokemonCard';
import { Loading } from '../common/Loading';
import type { SimplePokemon } from '../../api/types';

interface PokemonGridProps {
  pokemonList: SimplePokemon[];
  isLoading?: boolean;
  limit?: number;
}

export const PokemonGrid = ({ pokemonList, isLoading, limit }: PokemonGridProps) => {
  const displayList = useMemo(() => {
    if (limit && limit > 0) {
      return pokemonList.slice(0, limit);
    }
    return pokemonList;
  }, [pokemonList, limit]);

  if (isLoading) {
    return <Loading message="Loading Pokémon..." />;
  }

  if (displayList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No Pokémon found</p>
        <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-600 mb-4">
        Showing {displayList.length} Pokémon
        {limit && pokemonList.length > limit && ` (limited to first ${limit})`}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayList.map((pokemon) => (
          <PokemonCard key={pokemon.id} id={pokemon.id} name={pokemon.name} />
        ))}
      </div>
    </div>
  );
};
