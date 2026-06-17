import { describe, it, expect, vi, afterEach } from 'vitest';
import api, { parsePokemonId, fetchTypePokemonIds } from './pokeapi';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('parsePokemonId', () => {
  it('extracts the id from a Pokemon resource URL', () => {
    expect(parsePokemonId('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('handles a URL without a trailing slash', () => {
    expect(parsePokemonId('https://pokeapi.co/api/v2/pokemon/150')).toBe(150);
  });

  it('returns 0 for a URL with no numeric id', () => {
    expect(parsePokemonId('https://pokeapi.co/api/v2/pokemon/')).toBe(0);
  });
});

describe('fetchTypePokemonIds', () => {
  it('requests the type endpoint and returns the parsed ids', async () => {
    const getSpy = vi.spyOn(api, 'get').mockResolvedValue({
      data: {
        pokemon: [
          { slot: 1, pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
          { slot: 1, pokemon: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' } },
          { slot: 1, pokemon: { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' } },
        ],
      },
    } as never);

    const ids = await fetchTypePokemonIds('fire');

    expect(getSpy).toHaveBeenCalledWith('/type/fire');
    expect(ids).toEqual([4, 5, 6]);
  });

  it('returns an empty array when the type has no Pokemon', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: { pokemon: [] } } as never);
    await expect(fetchTypePokemonIds('fire')).resolves.toEqual([]);
  });
});
