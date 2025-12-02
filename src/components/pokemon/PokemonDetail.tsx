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
  const { spriteUrl, shinySpriteUrl } = useSprite(pokemon);

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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pokemon-name"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative focus:outline-none">
        {/* Close Button - Enhanced touch target for mobile */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 md:w-auto md:h-auto flex items-center justify-center text-gray-500 hover:text-gray-700 text-2xl font-bold z-10 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          aria-label="Close dialog"
          title="Close (ESC)"
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
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">{formatPokemonId(pokemon.id)}</p>
              <h2 id="pokemon-name" className="text-3xl font-bold text-gray-800 mb-4">
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
              <PokemonSprite
                url={spriteUrl}
                shinyUrl={shinySpriteUrl}
                alt={pokemon.name}
                size="lg"
              />
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
            <nav className="flex flex-col md:flex-row justify-between items-center pt-4 border-t gap-4">
              <button
                onClick={handlePrevious}
                disabled={!prevPokemon}
                className={`w-full md:w-auto px-6 py-3 md:px-4 md:py-2 rounded-lg font-medium transition-colors touch-manipulation ${
                  prevPokemon
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                aria-label={prevPokemon ? `Previous Pokemon: ${formatPokemonName(prevPokemon.name)}` : 'No previous Pokemon'}
              >
                <span className="flex items-center justify-center">
                  ← Previous
                  {prevPokemon && (
                    <span className="ml-2 text-sm hidden md:inline">({formatPokemonName(prevPokemon.name)})</span>
                  )}
                </span>
              </button>
              <div className="text-xs text-gray-500 text-center hidden md:block">
                <p>Use ← → arrow keys to navigate</p>
                <p>Press ESC to close</p>
              </div>
              <button
                onClick={handleNext}
                disabled={!nextPokemon}
                className={`w-full md:w-auto px-6 py-3 md:px-4 md:py-2 rounded-lg font-medium transition-colors touch-manipulation ${
                  nextPokemon
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                aria-label={nextPokemon ? `Next Pokemon: ${formatPokemonName(nextPokemon.name)}` : 'No next Pokemon'}
              >
                <span className="flex items-center justify-center">
                  Next →
                  {nextPokemon && (
                    <span className="mr-2 text-sm hidden md:inline">({formatPokemonName(nextPokemon.name)})</span>
                  )}
                </span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
