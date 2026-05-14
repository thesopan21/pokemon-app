/**
 * Pokemon API Type Definitions
 * Comprehensive types for all Pokemon-related API responses
 */

// ============================================================================
// Pokemon List & Pagination Types
// ============================================================================

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonResult[];
}

export interface PokemonResult {
  name: string;
  url: string;
}

// ============================================================================
// Pokemon Detail Types
// ============================================================================

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  species: {
    name: string;
    url: string;
  };
  stats: PokemonStat[];
  types: PokemonType[];
  abilities: PokemonAbility[];
  forms: Array<{
    name: string;
    url: string;
  }>;
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
    version_group_details: Array<{
      level_learned_at: number;
      version_group: {
        name: string;
        url: string;
      };
      move_learn_method: {
        name: string;
        url: string;
      };
    }>;
  }>;
  sprites: PokemonSprites;
  held_items: Array<{
    item: {
      name: string;
      url: string;
    };
    version_details: Array<{
      rarity: number;
      version: {
        name: string;
        url: string;
      };
    }>;
  }>;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other?: {
    dream_world?: {
      front_default?: string;
      front_female?: string;
    };
    'official-artwork'?: {
      front_default?: string;
      front_shiny?: string;
    };
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
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

// ============================================================================
// Pokemon Type Types
// ============================================================================

export interface TypeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TypeResult[];
}

export interface TypeResult {
  name: string;
  url: string;
}

export interface PokemonTypeDetail {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: Array<{ name: string; url: string }>;
    double_damage_to: Array<{ name: string; url: string }>;
    half_damage_from: Array<{ name: string; url: string }>;
    half_damage_to: Array<{ name: string; url: string }>;
    no_damage_from: Array<{ name: string; url: string }>;
    no_damage_to: Array<{ name: string; url: string }>;
  };
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }>;
}

// ============================================================================
// Application State Types
// ============================================================================

export interface PokemonAppState {
  // Filters
  selectedType: string | null; // "all" or specific type
  searchQuery: string;
  viewMode: 'grid' | 'list';

  // Pagination
  currentPage: number;
  itemsPerPage: number;

  // UI States
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

export interface FilterState {
  types: TypeResult[];
  selectedType: string | null; // "all" or specific type
  isOpen: boolean;
}

// ============================================================================
// Cached Data Types
// ============================================================================

export interface CachedPokemonList {
  [key: string]: Pokemon[];
}

export interface CachedTypeData {
  [typeKey: string]: PokemonTypeDetail;
}

// ============================================================================
// Network Request Types
// ============================================================================

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface GetPokemonListParams {
  limit?: number;
  offset?: number;
}

export interface GetPokemonByTypeParams {
  type: string;
}

// ============================================================================
// UI Component Props Types
// ============================================================================

export interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: (pokemon: Pokemon) => void;
}

export interface PokemonListProps {
  pokemons: Pokemon[];
  isLoading: boolean;
  onLoadMore: () => void;
  onPress: (pokemon: Pokemon) => void;
}

export interface FilterBottomSheetProps {
  isOpen: boolean;
  types: TypeResult[];
  selectedType: string | null;
  onTypeSelect: (type: string | null) => void;
  onClose: () => void;
}

// ============================================================================
// API Error Types
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  status: number;
}
