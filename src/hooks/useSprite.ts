import { useMemo } from 'react';
import type { Pokemon } from '../api/types';
import { getSpriteUrl, getShinySpritUrl } from '../utils/spriteHelpers';

/**
 * Hook to get sprite URLs for a Pokemon with proper fallback hierarchy
 * @param pokemon - Pokemon data
 * @param shiny - Whether to use shiny sprites (default: false)
 * @returns Sprite URL with fallback support
 */
export const useSprite = (pokemon: Pokemon | null | undefined, shiny = false) => {
  const spriteUrl = useMemo(() => {
    if (shiny) {
      return getShinySpritUrl(pokemon);
    }
    return getSpriteUrl(pokemon);
  }, [pokemon, shiny]);

  return {
    spriteUrl,
    hasSprite: !!spriteUrl,
  };
};
