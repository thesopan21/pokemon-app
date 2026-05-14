/**
 * Utility Functions
 * Common utility functions for the app
 */

import { Pokemon } from '@/types/pokemon';

/**
 * Get Pokemon image URL from sprites
 */
export const getPokemonImageUrl = (pokemon: Pokemon | null): string => {
  if (!pokemon?.sprites) return '';

  // Try official artwork first, then back_default, then front_default
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.other?.dream_world?.front_default ||
    pokemon.sprites.front_default ||
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
  );
};

/**
 * Get Pokemon image URL directly from ID (for list views without full sprites data)
 */
export const getPokemonImageUrlById = (pokemonId: number | string): string => {
  if (!pokemonId) return '';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
};

/**
 * Extract Pokemon ID from URL
 */
export const getPokemonIdFromUrl = (url: string): number => {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * Extract Pokemon name from URL
 */
export const getPokemonNameFromUrl = (url: string): string => {
  return url.split('/').filter(Boolean).pop() || '';
};

/**
 * Format Pokemon stat name
 */
export const formatStatName = (statName: string): string => {
  const statMap: Record<string, string> = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SP.ATK',
    'special-defense': 'SP.DEF',
    speed: 'SPD',
  };
  return statMap[statName.toLowerCase()] || statName;
};

/**
 * Format height to feet and inches
 */
export const formatHeight = (decimeters: number): string => {
  const meters = decimeters / 10;
  const feet = Math.floor(meters * 3.28084);
  const inches = Math.round((meters * 3.28084 - feet) * 12);
  return `${feet}'${inches}" (${meters}m)`;
};

/**
 * Format weight to pounds and kg
 */
export const formatWeight = (hectograms: number): string => {
  const kg = hectograms / 10;
  const pounds = kg * 2.20462;
  return `${pounds.toFixed(1)} lbs (${kg}kg)`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format ability name
 */
export const formatAbilityName = (ability: string): string => {
  return ability
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Sort Pokemon by ID
 */
export const sortPokemonById = (pokemons: Pokemon[]): Pokemon[] => {
  return [...pokemons].sort((a, b) => a.id - b.id);
};

/**
 * Search Pokemon by name or ID
 */
export const searchPokemon = (
  pokemons: Pokemon[],
  query: string
): Pokemon[] => {
  if (!query.trim()) return pokemons;

  const lowerQuery = query.toLowerCase();
  return pokemons.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(lowerQuery) ||
      pokemon.id.toString().includes(lowerQuery)
  );
};

/**
 * Filter Pokemon by type
 */
export const filterPokemonByType = (
  pokemons: Pokemon[],
  type: string
): Pokemon[] => {
  if (!type || type === 'all') return pokemons;

  const lowerType = type.toLowerCase();
  return pokemons.filter((pokemon) =>
    pokemon.types.some((t) => t.type.name.toLowerCase() === lowerType)
  );
};

/**
 * Get Pokemon primary type
 */
export const getPrimaryType = (pokemon: Pokemon): string => {
  return pokemon.types[0]?.type.name || 'unknown';
};

/**
 * Get Pokemon secondary type (if exists)
 */
export const getSecondaryType = (pokemon: Pokemon): string | null => {
  return pokemon.types[1]?.type.name || null;
};

/**
 * Format Pokemon data for display
 */
export const formatPokemonData = (pokemon: Pokemon) => {
  return {
    id: pokemon.id,
    name: capitalize(pokemon.name),
    height: formatHeight(pokemon.height),
    weight: formatWeight(pokemon.weight),
    types: pokemon.types.map((t) => capitalize(t.type.name)),
    abilities: pokemon.abilities.map((a) => ({
      name: formatAbilityName(a.ability.name),
      isHidden: a.is_hidden,
    })),
    stats: pokemon.stats.map((s) => ({
      name: formatStatName(s.stat.name),
      value: s.base_stat,
    })),
    image: getPokemonImageUrl(pokemon),
  };
};

/**
 * Calculate stat percentage for visualization
 */
export const getStatPercentage = (value: number): number => {
  const maxStat = 255; // Max possible stat value
  return (value / maxStat) * 100;
};

/**
 * Get color for stat based on value
 */
export const getStatColor = (percentage: number): string => {
  if (percentage >= 80) return '#4CAF50'; // Green
  if (percentage >= 60) return '#8BC34A'; // Light Green
  if (percentage >= 40) return '#FFC107'; // Amber
  if (percentage >= 20) return '#FF9800'; // Orange
  return '#F44336'; // Red
};
