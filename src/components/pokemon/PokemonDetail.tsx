import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { useSprite } from '../../hooks/useSprite';
import {
  formatPokemonName,
  formatPokemonId,
  getPokemonTypes,
  formatHeight,
  formatWeight,
  formatAbilityName,
  formatStatName,
} from '../../utils/pokemonHelpers';
import { TypeBadge } from '../common/TypeBadge';
import { PokemonSprite } from './PokemonSprite';
import { Loading } from '../common/Loading';
import type { SimplePokemon } from '../../api/types';

interface PokemonDetailProps {
  allPokemon: SimplePokemon[];
}

export const PokemonDetail = ({ allPokemon }: PokemonDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pokemonId = parseInt(id || '0', 10);

  const { data: pokemon, isLoading, isError } = usePokemonDetail(pokemonId);
  const { spriteUrl } = useSprite(pokemon);

  // Find current index and get prev/next Pokemon
  const currentIndex = allPokemon.findIndex((p) => p.id === pokemonId);
  const prevPokemon = currentIndex > 0 ? allPokemon[currentIndex - 1] : null;
  const nextPokemon = currentIndex < allPokemon.length - 1 ? allPokemon[currentIndex + 1] : null;

  // Handle close modal
  const handleClose = () => {
    navigate('/');
  };

  // Handle navigation
  const handlePrevious = () => {
    if (prevPokemon) {
      navigate(`/pokemon/${prevPokemon.id}`);
    }
  };

  const handleNext = () => {
    if (nextPokemon) {
      navigate(`/pokemon/${nextPokemon.id}`);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPokemon, nextPokemon]);

  if (!id) {
    handleClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
          aria-label="Close"
        >
          ✕
        </button>

        {isLoading && (
          <div className="p-12">
            <Loading message="Loading Pokémon details..." />
          </div>
        )}

        {isError && (
          <div className="p-12 text-center">
            <p className="text-xl text-red-600">Failed to load Pokémon</p>
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        )}

        {pokemon && (
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">{formatPokemonId(pokemon.id)}</p>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {formatPokemonName(pokemon.name)}
              </h2>
              <div className="flex gap-2 justify-center mb-6">
                {getPokemonTypes(pokemon).map((type) => (
                  <TypeBadge key={type} type={type} size="lg" />
                ))}
              </div>
            </div>

            {/* Sprite */}
            <div className="flex justify-center mb-6">
              <PokemonSprite url={spriteUrl} alt={pokemon.name} size="lg" />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm text-gray-600">Height</p>
                <p className="text-lg font-semibold">{formatHeight(pokemon.height)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="text-lg font-semibold">{formatWeight(pokemon.weight)}</p>
              </div>
            </div>

            {/* Abilities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Abilities</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <span
                    key={ability.ability.name}
                    className={`px-3 py-1 rounded-full text-sm ${
                      ability.is_hidden
                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {formatAbilityName(ability.ability.name)}
                    {ability.is_hidden && ' (Hidden)'}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Base Stats</h3>
              <div className="space-y-2">
                {pokemon.stats.map((stat) => {
                  const percentage = (stat.base_stat / 255) * 100;
                  return (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{formatStatName(stat.stat.name)}</span>
                        <span className="text-gray-600">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={handlePrevious}
                disabled={!prevPokemon}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  prevPokemon
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                ← Previous
                {prevPokemon && (
                  <span className="ml-2 text-sm">({formatPokemonName(prevPokemon.name)})</span>
                )}
              </button>
              <div className="text-xs text-gray-500">
                <p>Use ← → arrow keys to navigate</p>
                <p>Press ESC to close</p>
              </div>
              <button
                onClick={handleNext}
                disabled={!nextPokemon}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  nextPokemon
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next →
                {nextPokemon && (
                  <span className="mr-2 text-sm">({formatPokemonName(nextPokemon.name)})</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
