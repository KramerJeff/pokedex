import { useMemo } from 'react';
import { POKEMON_TYPES } from '../../api/types';
import { useFilterStore } from '../../store/filterStore';
import { formatPokemonName, getTypeColor } from '../../utils/pokemonHelpers';
import { MultiSelectDropdown } from '../common/MultiSelectDropdown';
import type { DropdownOption } from '../common/MultiSelectDropdown';
import type { PokemonTypeName } from '../../api/types';

export const TypeFilter = () => {
  const { selectedTypes, toggleType, clearTypeFilters } = useFilterStore();

  const options = useMemo<DropdownOption<PokemonTypeName>[]>(
    () =>
      POKEMON_TYPES.map((type) => ({
        value: type,
        label: formatPokemonName(type),
        swatchColor: getTypeColor(type),
      })),
    []
  );

  return (
    <MultiSelectDropdown
      label="Type"
      options={options}
      selectedValues={selectedTypes}
      onToggle={toggleType}
      onClear={clearTypeFilters}
    />
  );
};
