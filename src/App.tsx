import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PokemonGrid } from './components/pokemon/PokemonGrid';
import { PokemonDetail } from './components/pokemon/PokemonDetail';
import { Loading } from './components/common/Loading';
import { SearchBar } from './components/filters/SearchBar';
import { TypeFilter } from './components/filters/TypeFilter';
import { GenerationFilter } from './components/filters/GenerationFilter';
import { FilterControls } from './components/filters/FilterControls';
import { usePokemonList } from './hooks/usePokemonList';
import { useSearch } from './hooks/useSearch';
import { useTypeFilter } from './hooks/useTypeFilter';
import { filterPokemonByGeneration } from './utils/pokemonHelpers';
import { useFilterStore } from './store/filterStore';

function App() {
  const { data: pokemonList, isLoading, isError } = usePokemonList();
  const { searchQuery, selectedTypes, filterMode, selectedGenerations } = useFilterStore();

  // Apply search filter
  const searchedPokemon = useSearch(pokemonList, searchQuery);

  // Resolve the set of IDs matching the selected types (null = no type filter)
  const { matchingIds, isLoading: isFilterLoading } = useTypeFilter(
    selectedTypes,
    filterMode
  );

  // Get final filtered list: type filter (O(1) Set lookups) + generation filter
  const finalPokemonList = useMemo(() => {
    const typeFiltered = matchingIds
      ? searchedPokemon.filter((p) => matchingIds.has(p.id))
      : searchedPokemon;
    return filterPokemonByGeneration(typeFiltered, selectedGenerations);
  }, [searchedPokemon, matchingIds, selectedGenerations]);

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
        <>
          <div className="space-y-6">
            {/* Search + filters: one row on large viewports, each on its own row below */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              {/* Search Bar - grows to fill, but never narrower than 400px on a shared row */}
              <div className="w-full lg:flex-1 lg:min-w-[400px]">
                <SearchBar />
              </div>

              {/* Type Filter */}
              <TypeFilter />

              {/* Generation Filter */}
              <GenerationFilter />
            </div>

            {/* Filter Controls */}
            <FilterControls />

            {/* Pokemon Grid - fills remaining viewport height */}
            <div className="flex-1 min-h-0">
              {isFilterLoading ? (
                <Loading message="Filtering Pokémon..." />
              ) : (
                <PokemonGrid pokemonList={finalPokemonList} />
              )}
            </div>
          </div>

          {/* Pokemon Detail Modal - Uses React Router */}
          <Routes>
            <Route path="/pokemon/:id" element={<PokemonDetail allPokemon={pokemonList} />} />
          </Routes>
        </>
      )}
    </Layout>
  );
}

export default App;
