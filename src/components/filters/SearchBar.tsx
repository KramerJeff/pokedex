import { useEffect, useState } from 'react';
import { useFilterStore } from '../../store/filterStore';

const DEBOUNCE_DELAY = 300;

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  // Sync with store if external changes occur
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleClear = () => {
    setLocalQuery('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search by name or ID..."
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {localQuery && (
        <p className="text-xs text-gray-500 mt-1">
          Searching for: <span className="font-semibold">{localQuery}</span>
        </p>
      )}
    </div>
  );
};
