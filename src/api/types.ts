// Pokemon API Response Types

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

// Response shape for the /type/{name} endpoint
export interface TypeResponse {
  pokemon: Array<{
    pokemon: PokemonListItem;
    slot: number;
  }>;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world?: {
      front_default: string | null;
      front_female: string | null;
    };
  };
  versions?: {
    'generation-i'?: {
      'red-blue'?: GenericSprite;
      yellow?: GenericSprite;
    };
    'generation-ii'?: {
      crystal?: GenericSprite;
      gold?: GenericSprite;
      silver?: GenericSprite;
    };
    'generation-iii'?: {
      'firered-leafgreen'?: GenericSprite;
      emerald?: GenericSprite;
      'ruby-sapphire'?: GenericSprite;
    };
    'generation-iv'?: {
      'diamond-pearl'?: GenericSprite;
      platinum?: GenericSprite;
      'heartgold-soulsilver'?: GenericSprite;
    };
  };
}

export interface GenericSprite {
  front_default: string | null;
  front_shiny?: string | null;
  back_default?: string | null;
  back_shiny?: string | null;
  front_female?: string | null;
  back_female?: string | null;
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  types: PokemonType[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
  species: {
    name: string;
    url: string;
  };
}

// Helper type for parsed Pokemon from list
export interface SimplePokemon {
  id: number;
  name: string;
}

// Filter state types
export type FilterMode = 'AND' | 'OR';

export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const;

export type PokemonTypeName = typeof POKEMON_TYPES[number];
