import { Layout } from './components/layout/Layout';
import { PokemonGrid } from './components/pokemon/PokemonGrid';
import { Loading } from './components/common/Loading';
import { usePokemonList } from './hooks/usePokemonList';

function App() {
  const { data: pokemonList, isLoading, isError } = usePokemonList();

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
        <PokemonGrid pokemonList={pokemonList} limit={50} />
      )}
    </Layout>
  );
}

export default App;
