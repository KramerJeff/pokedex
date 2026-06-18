import { create } from 'zustand';
import type { FilterMode, PokemonTypeName } from '../api/types';

interface FilterState {
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Type filter state
  selectedTypes: PokemonTypeName[];
  filterMode: FilterMode;
  toggleType: (type: PokemonTypeName) => void;
  setFilterMode: (mode: FilterMode) => void;
  clearTypeFilters: () => void;

  // Generation filter state
  selectedGenerations: number[];
  toggleGeneration: (generation: number) => void;
  clearGenerationFilters: () => void;

  // Reset all filters
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  // Initial state
  searchQuery: '',
  selectedTypes: [],
  filterMode: 'OR',
  selectedGenerations: [],

  // Search actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Type filter actions
  toggleType: (type) =>
    set((state) => ({
      selectedTypes: state.selectedTypes.includes(type)
        ? state.selectedTypes.filter((t) => t !== type)
        : [...state.selectedTypes, type],
    })),

  setFilterMode: (mode) => set({ filterMode: mode }),

  clearTypeFilters: () => set({ selectedTypes: [] }),

  // Generation filter actions
  toggleGeneration: (generation) =>
    set((state) => ({
      selectedGenerations: state.selectedGenerations.includes(generation)
        ? state.selectedGenerations.filter((g) => g !== generation)
        : [...state.selectedGenerations, generation],
    })),

  clearGenerationFilters: () => set({ selectedGenerations: [] }),

  // Reset all
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedTypes: [],
      filterMode: 'OR',
      selectedGenerations: [],
    }),
}));
