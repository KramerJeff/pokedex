import { describe, it, expect } from 'vitest';
import type { SimplePokemon } from '../api/types';
import {
  combineIdSets,
  filterPokemonByGeneration,
  getPokemonGeneration,
} from './pokemonHelpers';

describe('combineIdSets', () => {
  it('returns an empty set for no input arrays', () => {
    expect(combineIdSets([], 'OR')).toEqual(new Set());
    expect(combineIdSets([], 'AND')).toEqual(new Set());
  });

  it('returns the same ids for a single array (OR)', () => {
    expect(combineIdSets([[1, 2, 3]], 'OR')).toEqual(new Set([1, 2, 3]));
  });

  it('returns the same ids for a single array (AND)', () => {
    expect(combineIdSets([[1, 2, 3]], 'AND')).toEqual(new Set([1, 2, 3]));
  });

  it('OR mode returns the union of all arrays', () => {
    const result = combineIdSets(
      [
        [1, 2, 3],
        [3, 4, 5],
      ],
      'OR'
    );
    expect(result).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  it('AND mode returns the intersection of all arrays', () => {
    const result = combineIdSets(
      [
        [1, 2, 3, 4],
        [3, 4, 5, 6],
      ],
      'AND'
    );
    expect(result).toEqual(new Set([3, 4]));
  });

  it('AND mode with no overlap returns an empty set', () => {
    expect(combineIdSets([[1, 2], [3, 4]], 'AND')).toEqual(new Set());
  });

  it('AND mode intersects across three arrays', () => {
    const result = combineIdSets(
      [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 9],
      ],
      'AND'
    );
    expect(result).toEqual(new Set([3, 4]));
  });

  it('de-duplicates ids in OR mode', () => {
    const result = combineIdSets([[1, 1, 2], [2, 2, 3]], 'OR');
    expect(result).toEqual(new Set([1, 2, 3]));
  });
});

describe('getPokemonGeneration', () => {
  it('maps ids to the correct generation at range boundaries', () => {
    expect(getPokemonGeneration(1)).toBe(1);
    expect(getPokemonGeneration(151)).toBe(1);
    expect(getPokemonGeneration(152)).toBe(2);
    expect(getPokemonGeneration(251)).toBe(2);
    expect(getPokemonGeneration(252)).toBe(3);
    expect(getPokemonGeneration(386)).toBe(3);
    expect(getPokemonGeneration(906)).toBe(9);
    expect(getPokemonGeneration(1025)).toBe(9);
  });
});

describe('filterPokemonByGeneration', () => {
  const pokemon: SimplePokemon[] = [
    { id: 1, name: 'bulbasaur' }, // gen 1
    { id: 25, name: 'pikachu' }, // gen 1
    { id: 152, name: 'chikorita' }, // gen 2
    { id: 252, name: 'treecko' }, // gen 3
    { id: 906, name: 'sprigatito' }, // gen 9
  ];

  it('returns the full list unchanged when no generations are selected', () => {
    expect(filterPokemonByGeneration(pokemon, [])).toBe(pokemon);
  });

  it('keeps only Pokemon from a single selected generation', () => {
    expect(filterPokemonByGeneration(pokemon, [1])).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 25, name: 'pikachu' },
    ]);
  });

  it('keeps Pokemon from any of several selected generations (union)', () => {
    expect(filterPokemonByGeneration(pokemon, [2, 9])).toEqual([
      { id: 152, name: 'chikorita' },
      { id: 906, name: 'sprigatito' },
    ]);
  });

  it('returns an empty list when no Pokemon match the selected generations', () => {
    expect(filterPokemonByGeneration(pokemon, [5])).toEqual([]);
  });
});
