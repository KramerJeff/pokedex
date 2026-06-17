import { describe, it, expect } from 'vitest';
import { combineIdSets } from './pokemonHelpers';

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
