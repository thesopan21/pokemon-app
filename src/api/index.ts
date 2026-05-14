/**
 * API Slices Index
 * Central export point for all API slices
 */

export { default as baseApi, pokemonApi } from './baseApi';
export { pokemonByTypeApi, useGetPokemonByTypeQuery } from './pokemonByTypeSlice';
export { pokemonDetailApi, useGetPokemonDetailQuery, usePrefetchPokemonDetailQuery } from './pokemonDetailSlice';
export { pokemonListApi, useGetPokemonListQuery } from './pokemonListSlice';
export { pokemonTypeApi, useGetPokemonTypeDetailQuery, useGetPokemonTypesQuery } from './pokemonTypeSlice';

