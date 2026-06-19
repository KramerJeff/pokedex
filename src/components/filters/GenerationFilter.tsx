import { useFilterStore } from '../../store/filterStore';
import { MultiSelectDropdown } from '../common/MultiSelectDropdown';
import type { DropdownOption } from '../common/MultiSelectDropdown';

// Generation number → display label (Roman numerals) and the region it covers.
const GENERATION_OPTIONS: DropdownOption<number>[] = [
  { value: 1, label: 'Gen I', title: 'Kanto' },
  { value: 2, label: 'Gen II', title: 'Johto' },
  { value: 3, label: 'Gen III', title: 'Hoenn' },
  { value: 4, label: 'Gen IV', title: 'Sinnoh' },
  { value: 5, label: 'Gen V', title: 'Unova' },
  { value: 6, label: 'Gen VI', title: 'Kalos' },
  { value: 7, label: 'Gen VII', title: 'Alola' },
  { value: 8, label: 'Gen VIII', title: 'Galar' },
  { value: 9, label: 'Gen IX', title: 'Paldea' },
];

export const GenerationFilter = () => {
  const { selectedGenerations, toggleGeneration, clearGenerationFilters } = useFilterStore();

  return (
    <MultiSelectDropdown
      label="Generation"
      options={GENERATION_OPTIONS}
      selectedValues={selectedGenerations}
      onToggle={toggleGeneration}
      onClear={clearGenerationFilters}
    />
  );
};
