import { useMemo } from 'react';
import { Layout } from './components/layout/Layout';
import { PokemonGrid } from './components/pokemon/PokemonGrid';
import { Loading } from './components/common/Loading';
import { SearchBar } from './components/filters/SearchBar';
import { TypeFilter } from './components/filters/TypeFilter';
import { FilterControls } from './components/filters/FilterControls';
import { usePokemonList } from './hooks/usePokemonList';
import { useSearch } from './hooks/useSearch';
import { useTypeFilter } from './hooks/useTypeFilter';
import { useFilterStore } from './store/filterStore';

function App() {
  const { data: pokemonList, isLoading, isError } = usePokemonList();
  const { searchQuery, selectedTypes, filterMode } = useFilterStore();

  // Apply search filter
  const searchedPokemon = useSearch(pokemonList, searchQuery);

  // Get IDs from searched Pokemon
  const searchedIds = useMemo(
    () => searchedPokemon.map((p) => p.id),
    [searchedPokemon]
  );

  // Apply type filter
  const { filteredIds, isLoading: isFilterLoading } = useTypeFilter(
    searchedIds,
    selectedTypes,
    filterMode
  );

  // Get final filtered list
  const finalPokemonList = useMemo(() => {
    if (selectedTypes.length === 0) {
      return searchedPokemon;
    }
    return searchedPokemon.filter((p) => filteredIds.includes(p.id));
  }, [searchedPokemon, filteredIds, selectedTypes.length]);

  return (
    <Layout>
      {isLoading && <Loading message="Loading Pokédex..." />}

      {isError && (
        <div className="text-center py-12">
          <p className="text-xl text-red-600">Failed to load Pokémon data</p>
          <p className="text-sm text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      )}

      {pokemonList && !isLoading && (
        <div className="space-y-6">
          {/* Search Bar */}
          <SearchBar />

          {/* Type Filter */}
          <TypeFilter />

          {/* Filter Controls */}
          <FilterControls />

          {/* Pokemon Grid */}
          {isFilterLoading ? (
            <Loading message="Filtering Pokémon..." />
          ) : (
            <PokemonGrid pokemonList={finalPokemonList} />
          )}
        </div>
      )}
    </Layout>
  );
}

export default App;
