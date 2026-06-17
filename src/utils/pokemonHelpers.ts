import type { FilterMode, Pokemon, PokemonTypeName } from '../api/types';

/**
 * Format Pokemon name for display (capitalize first letter)
 */
export const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * Format Pokemon ID with leading zeros (e.g., #001, #025, #150)
 */
export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

/**
 * Combine arrays of Pokemon IDs (one per selected type) into a single Set.
 * - OR mode  → union (Pokemon matching at least one selected type)
 * - AND mode → intersection (Pokemon matching every selected type)
 */
export const combineIdSets = (
  idArrays: number[][],
  mode: FilterMode
): Set<number> => {
  if (idArrays.length === 0) return new Set();

  if (mode === 'AND') {
    return idArrays.reduce((acc, ids) => {
      const idSet = new Set(ids);
      return new Set([...acc].filter((id) => idSet.has(id)));
    }, new Set<number>(idArrays[0]));
  }

  // OR → union
  const union = new Set<number>();
  idArrays.forEach((ids) => ids.forEach((id) => union.add(id)));
  return union;
};

/**
 * Get Pokemon types as an array of type names
 */
export const getPokemonTypes = (pokemon: Pokemon): PokemonTypeName[] => {
  return pokemon.types
    .sort((a, b) => a.slot - b.slot)
    .map((t) => t.type.name as PokemonTypeName);
};

/**
 * Convert height from decimeters to feet and inches
 */
export const formatHeight = (heightInDecimeters: number): string => {
  const heightInInches = heightInDecimeters * 3.937;
  const feet = Math.floor(heightInInches / 12);
  const inches = Math.round(heightInInches % 12);
  return `${feet}'${inches.toString().padStart(2, '0')}"`;
};

/**
 * Convert weight from hectograms to pounds
 */
export const formatWeight = (weightInHectograms: number): string => {
  const weightInPounds = (weightInHectograms * 0.220462).toFixed(1);
  return `${weightInPounds} lbs`;
};

/**
 * Format ability name (remove hyphens, capitalize)
 */
export const formatAbilityName = (name: string): string => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format stat name for display
 */
export const formatStatName = (name: string): string => {
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  };
  return statNames[name] || name;
};

/**
 * Get Pokemon generation based on ID
 */
export const getPokemonGeneration = (id: number): number => {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9;
};

/**
 * Get type color for UI styling
 */
export const getTypeColor = (type: PokemonTypeName): string => {
  const typeColors: Record<PokemonTypeName, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return typeColors[type] || '#777';
};
