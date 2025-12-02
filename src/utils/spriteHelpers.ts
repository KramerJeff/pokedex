import type { Pokemon, PokemonSprites } from '../api/types';

/**
 * Get sprite URL for a Pokemon with fallback hierarchy
 * Priority: FireRed/LeafGreen > Emerald > Platinum > HeartGold/SoulSilver > Ruby/Sapphire > Diamond/Pearl > Official Artwork > Default
 */
export const getSpriteUrl = (pokemon: Pokemon | null | undefined): string | null => {
  if (!pokemon?.sprites) return null;

  const sprites = pokemon.sprites;

  // Try Gen III-IV sprites in order of priority
  const genSprites = [
    sprites.versions?.['generation-iii']?.['firered-leafgreen']?.front_default,
    sprites.versions?.['generation-iii']?.emerald?.front_default,
    sprites.versions?.['generation-iv']?.platinum?.front_default,
    sprites.versions?.['generation-iv']?.['heartgold-soulsilver']?.front_default,
    sprites.versions?.['generation-iii']?.['ruby-sapphire']?.front_default,
    sprites.versions?.['generation-iv']?.['diamond-pearl']?.front_default,
  ];

  // Find first available Gen III-IV sprite
  for (const sprite of genSprites) {
    if (sprite) return sprite;
  }

  // Fallback to official artwork
  if (sprites.other?.['official-artwork']?.front_default) {
    return sprites.other['official-artwork'].front_default;
  }

  // Final fallback to default sprite
  return sprites.front_default;
};

/**
 * Get shiny sprite URL for a Pokemon with fallback hierarchy
 */
export const getShinySpritUrl = (pokemon: Pokemon | null | undefined): string | null => {
  if (!pokemon?.sprites) return null;

  const sprites = pokemon.sprites;

  // Try Gen III-IV shiny sprites
  const genSprites = [
    sprites.versions?.['generation-iii']?.['firered-leafgreen']?.front_shiny,
    sprites.versions?.['generation-iii']?.emerald?.front_shiny,
    sprites.versions?.['generation-iv']?.platinum?.front_shiny,
    sprites.versions?.['generation-iv']?.['heartgold-soulsilver']?.front_shiny,
    sprites.versions?.['generation-iii']?.['ruby-sapphire']?.front_shiny,
    sprites.versions?.['generation-iv']?.['diamond-pearl']?.front_shiny,
  ];

  // Find first available Gen III-IV shiny sprite
  for (const sprite of genSprites) {
    if (sprite) return sprite;
  }

  // Fallback to official artwork shiny
  if (sprites.other?.['official-artwork']?.front_shiny) {
    return sprites.other['official-artwork'].front_shiny;
  }

  // Final fallback to default shiny sprite
  return sprites.front_shiny;
};

/**
 * Preload an image to improve loading performance
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Preload multiple sprites
 */
export const preloadSprites = async (urls: (string | null)[]): Promise<void> => {
  const validUrls = urls.filter((url): url is string => url !== null);
  await Promise.allSettled(validUrls.map(preloadImage));
};
