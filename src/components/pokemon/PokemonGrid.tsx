import { useMemo, useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { PokemonCard } from './PokemonCard';
import { Loading } from '../common/Loading';
import type { SimplePokemon } from '../../api/types';
import { monitorScrollPerformance } from '../../utils/performance';

interface PokemonGridProps {
  pokemonList: SimplePokemon[];
  isLoading?: boolean;
  limit?: number;
}

const CARD_HEIGHT = 220; // Approximate card height in pixels
const GAP = 16; // Gap between cards

// Calculate number of columns based on viewport width
const useColumns = () => {
  const [columns, setColumns] = useState(() => {
    if (typeof window === 'undefined') return 2;
    const width = window.innerWidth;
    if (width >= 1280) return 6; // xl
    if (width >= 1024) return 5; // lg
    if (width >= 768) return 4;  // md
    if (width >= 640) return 3;  // sm
    return 2;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setColumns(6);
      else if (width >= 1024) setColumns(5);
      else if (width >= 768) setColumns(4);
      else if (width >= 640) setColumns(3);
      else setColumns(2);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return columns;
};

export const PokemonGrid = ({ pokemonList, isLoading, limit }: PokemonGridProps) => {
  const displayList = useMemo(() => {
    if (limit && limit > 0) {
      return pokemonList.slice(0, limit);
    }
    return pokemonList;
  }, [pokemonList, limit]);

  const parentRef = useRef<HTMLDivElement>(null);
  const columns = useColumns();

  // Group Pokemon into rows based on current column count
  const rows = useMemo(() => {
    const result: SimplePokemon[][] = [];
    for (let i = 0; i < displayList.length; i += columns) {
      result.push(displayList.slice(i, i + columns));
    }
    return result;
  }, [displayList, columns]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT + GAP,
    overscan: 5, // Render 5 extra rows above and below viewport
  });

  // Monitor scroll performance in development
  useEffect(() => {
    if (import.meta.env.DEV && parentRef.current) {
      return monitorScrollPerformance(parentRef.current);
    }
  }, []);

  if (isLoading) {
    return <Loading message="Loading Pokémon..." />;
  }

  if (displayList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No Pokémon found</p>
        <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <section className="mb-6" aria-labelledby="pokemon-count">
      <p id="pokemon-count" className="text-sm text-gray-600 mb-4" role="status" aria-live="polite">
        Showing {displayList.length} Pokémon
        {limit && pokemonList.length > limit && ` (limited to first ${limit})`}
      </p>
      <div
        ref={parentRef}
        className="h-[calc(100vh-320px)] overflow-auto custom-scrollbar"
        style={{ contain: 'strict' }}
        role="region"
        aria-label="Pokemon grid"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {row.map((pokemon) => (
                    <PokemonCard key={pokemon.id} id={pokemon.id} name={pokemon.name} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
