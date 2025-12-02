import { POKEMON_TYPES, type PokemonTypeName } from '../../api/types';
import { useFilterStore } from '../../store/filterStore';
import { getTypeColor } from '../../utils/pokemonHelpers';

export const TypeFilter = () => {
  const { selectedTypes, toggleType } = useFilterStore();

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Type</h3>
      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type);
          const bgColor = getTypeColor(type);

          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
                isSelected
                  ? 'text-white shadow-lg scale-105'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
              }`}
              style={
                isSelected
                  ? { backgroundColor: bgColor }
                  : {}
              }
              aria-pressed={isSelected}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
};
