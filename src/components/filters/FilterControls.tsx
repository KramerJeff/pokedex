import { useFilterStore } from '../../store/filterStore';

export const FilterControls = () => {
  const {
    selectedTypes,
    filterMode,
    setFilterMode,
    clearTypeFilters,
    selectedGenerations,
    clearGenerationFilters,
    resetFilters,
  } = useFilterStore();

  const hasActiveFilters = selectedTypes.length > 0 || selectedGenerations.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* AND/OR Toggle - only show when types are selected */}
      {selectedTypes.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Match:</span>
          <div className="inline-flex rounded-lg border border-gray-300 bg-white">
            <button
              onClick={() => setFilterMode('OR')}
              className={`px-3 py-1 text-sm font-medium rounded-l-lg transition-colors ${
                filterMode === 'OR'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Any
            </button>
            <button
              onClick={() => setFilterMode('AND')}
              className={`px-3 py-1 text-sm font-medium rounded-r-lg transition-colors ${
                filterMode === 'AND'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
          </div>
          <span className="text-xs text-gray-500">
            {filterMode === 'OR' ? '(at least one type)' : '(all selected types)'}
          </span>
        </div>
      )}

      {/* Clear Buttons */}
      {hasActiveFilters && (
        <div className="flex gap-2">
          {selectedTypes.length > 0 && (
            <button
              onClick={clearTypeFilters}
              className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Types
            </button>
          )}
          {selectedGenerations.length > 0 && (
            <button
              onClick={clearGenerationFilters}
              className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Generations
            </button>
          )}
          <button
            onClick={resetFilters}
            className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
