import { memo } from 'react';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { useSprite } from '../../hooks/useSprite';
import { formatPokemonName, formatPokemonId, getPokemonTypes } from '../../utils/pokemonHelpers';
import { PokemonSprite } from './PokemonSprite';
import { TypeBadge } from '../common/TypeBadge';
import { CardSkeleton } from '../common/Loading';

interface PokemonCardProps {
  id: number;
  name: string;
}

export const PokemonCard = memo(({ id, name }: PokemonCardProps) => {
  const { data: pokemon, isLoading, isError } = usePokemonDetail(id);
  const { spriteUrl } = useSprite(pokemon);

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (isError || !pokemon) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold">{formatPokemonName(name)}</p>
          <p className="text-sm">Failed to load</p>
        </div>
      </div>
    );
  }

  const types = getPokemonTypes(pokemon);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 p-4 cursor-pointer group">
      <div className="flex flex-col items-center">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
          {formatPokemonName(pokemon.name)} {formatPokemonId(pokemon.id)}
        </h3>

        {/* Types */}
        <div className="flex gap-2 flex-wrap justify-center">
          {types.map((type) => (
            <TypeBadge key={type} type={type} size="md" />
          ))}
        </div>
        {/* Sprite */}
        <div className="mb-3 group-hover:scale-110 transition-transform duration-200">
          <PokemonSprite url={spriteUrl} alt={pokemon.name} size="md" />
        </div>

      </div>
    </div>
  );
});

PokemonCard.displayName = 'PokemonCard';
