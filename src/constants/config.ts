/**
 * Application Constants
 * Configuration values for the Pokemon app
 */

// ============================================================================
// API Configuration
// ============================================================================

export const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const API_ENDPOINTS = {
  POKEMON_LIST: '/pokemon',
  POKEMON_DETAIL: (id: string | number) => `/pokemon/${id}`,
  POKEMON_TYPES: '/type',
  POKEMON_BY_TYPE: (type: string) => `/type/${type}`,
} as const;

// ============================================================================
// Pagination
// ============================================================================

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  INITIAL_OFFSET: 0,
} as const;

// ============================================================================
// UI Configuration
// ============================================================================

export const UI_CONFIG = {
  GRID_COLUMNS: 2,
  ITEM_HEIGHT: 180,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
} as const;

// ============================================================================
// Cache Keys for RTK Query
// ============================================================================

export const CACHE_KEYS = {
  POKEMON_LIST: 'pokemonList',
  POKEMON_DETAIL: 'pokemonDetail',
  POKEMON_TYPES: 'pokemonTypes',
  POKEMON_BY_TYPE: 'pokemonByType',
} as const;

// ============================================================================
// Local Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  SELECTED_TYPE: '@pokemon_app/selected_type',
  VIEW_MODE: '@pokemon_app/view_mode',
  SEARCH_HISTORY: '@pokemon_app/search_history',
  LAST_FILTERS: '@pokemon_app/last_filters',
} as const;

// ============================================================================
// Pokemon Types (for UI)
// ============================================================================

export const POKEMON_TYPES = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
] as const;

export type PokemonTypeKey = (typeof POKEMON_TYPES)[number];

// ============================================================================
// Type Colors for UI
// ============================================================================

export const TYPE_COLORS: Record<PokemonTypeKey, { bg: string; text: string }> = {
  normal: { bg: '#A8A878', text: '#FFFFFF' },
  fighting: { bg: '#C03028', text: '#FFFFFF' },
  flying: { bg: '#A890F0', text: '#FFFFFF' },
  poison: { bg: '#A040A0', text: '#FFFFFF' },
  ground: { bg: '#E0C068', text: '#000000' },
  rock: { bg: '#B8A038', text: '#FFFFFF' },
  bug: { bg: '#A8B820', text: '#FFFFFF' },
  ghost: { bg: '#705898', text: '#FFFFFF' },
  steel: { bg: '#B8B8D0', text: '#000000' },
  fire: { bg: '#F08030', text: '#FFFFFF' },
  water: { bg: '#6890F0', text: '#FFFFFF' },
  grass: { bg: '#78C850', text: '#FFFFFF' },
  electric: { bg: '#F8D030', text: '#000000' },
  psychic: { bg: '#F85888', text: '#FFFFFF' },
  ice: { bg: '#98D8D8', text: '#000000' },
  dragon: { bg: '#7038F8', text: '#FFFFFF' },
  dark: { bg: '#705848', text: '#FFFFFF' },
  fairy: { bg: '#EE99AC', text: '#FFFFFF' },
} as const;

// ============================================================================
// API Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  FETCH_ERROR: 'Failed to fetch data. Please try again.',
  NOT_FOUND: 'Pokemon not found.',
  INVALID_TYPE: 'Invalid Pokemon type.',
  TIMEOUT: 'Request timeout. Please try again.',
} as const;

// ============================================================================
// Loading States
// ============================================================================

export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type LoadingState = (typeof LOADING_STATES)[keyof typeof LOADING_STATES];
