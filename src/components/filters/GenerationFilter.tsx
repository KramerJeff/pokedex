import { useFilterStore } from '../../store/filterStore';

// Generation number → display label (Roman numerals, as used in the games)
const GENERATIONS: { value: number; label: string, region: string }[] = [
  { value: 1, label: 'Gen I', region: 'Kanto' },
  { value: 2, label: 'Gen II', region: 'Johto' },
  { value: 3, label: 'Gen III', region: 'Hoenn' },
  { value: 4, label: 'Gen IV', region: 'Sinnoh' },
  { value: 5, label: 'Gen V', region: 'Unova' },
  { value: 6, label: 'Gen VI', region: 'Kalos' },
  { value: 7, label: 'Gen VII', region: 'Alola' },
  { value: 8, label: 'Gen VIII', region: 'Galar' },
  { value: 9, label: 'Gen IX', region: 'Paldea' },
];

export const GenerationFilter = () => {
  const { selectedGenerations, toggleGeneration } = useFilterStore();

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Generation</h3>
      <div className="flex flex-wrap gap-2">
        {GENERATIONS.map(({ value, label, region }) => {
          const isSelected = selectedGenerations.includes(value);

          return (
            <button
              title={region}
              key={value}
              onClick={() => toggleGeneration(value)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-red-600 text-white shadow-lg scale-105'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
              }`}
              aria-pressed={isSelected}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
