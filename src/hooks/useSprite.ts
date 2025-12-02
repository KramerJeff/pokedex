import { useMemo } from 'react';
import type { Pokemon } from '../api/types';
import { getSpriteUrl, getShinySpritUrl } from '../utils/spriteHelpers';

/**
 * Hook to get sprite URLs for a Pokemon with proper fallback hierarchy
 * @param pokemon - Pokemon data
 * @returns Both normal and shiny sprite URLs with fallback support
 */
export const useSprite = (pokemon: Pokemon | null | undefined) => {
  const spriteUrl = useMemo(() => getSpriteUrl(pokemon), [pokemon]);
  const shinySpriteUrl = useMemo(() => getShinySpritUrl(pokemon), [pokemon]);

  return {
    spriteUrl,
    shinySpriteUrl,
    hasSprite: !!spriteUrl,
    hasShinySprite: !!shinySpriteUrl,
  };
};
