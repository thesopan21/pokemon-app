/**
 * Pokemon Types API Slice
 * Handles fetching all Pokemon types for filter dropdown
 */

import { PokemonTypeDetail, TypeListResponse } from '@/types/pokemon';
import { pokemonApi } from './baseApi';

/**
 * Store for abort controllers for type requests
 */
const typeAbortControllers: Map<string, AbortController> = new Map();

/**
 * Get abort controller for a specific type key
 */
const getTypeAbortController = (key: string): AbortController => {
  // Cancel previous request if exists
  if (typeAbortControllers.has(key)) {
    const previousController = typeAbortControllers.get(key)!;
    previousController.abort();
  }

  // Create new abort controller
  const newController = new AbortController();
  typeAbortControllers.set(key, newController);
  return newController;
};

/**
 * Extend base API with Pokemon type endpoints
 */
export const pokemonTypeApi = pokemonApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get list of all Pokemon types
     * Used for the filter dropdown
     */
    getPokemonTypes: builder.query<TypeListResponse, void>({
      query: () => {
        const abortKey = 'pokemonTypes';
        const controller = getTypeAbortController(abortKey);

        return {
          url: '/type',
          signal: controller.signal,
        };
      },
      // Cache this data for 1 hour (60 * 60 * 1000 ms)
      keepUnusedDataFor: 60 * 60,
      providesTags: ['Type'],
    }),

    /**
     * Get detailed information about a specific Pokemon type
     * Includes damage relations and Pokemon of that type
     */
    getPokemonTypeDetail: builder.query<PokemonTypeDetail, string>({
      query: (typeName) => {
        const abortKey = `pokemonTypeDetail_${typeName}`;
        const controller = getTypeAbortController(abortKey);

        return {
          url: `/type/${typeName}`,
          signal: controller.signal,
        };
      },
      providesTags: (_result, _error, arg) => [{ type: 'Type', id: arg }],
    }),

    /**
     * Cancel ongoing type request
     */
    cancelGetPokemonTypes: builder.query<void, void>({
      queryFn: () => {
        const abortKey = 'pokemonTypes';
        if (typeAbortControllers.has(abortKey)) {
          const controller = typeAbortControllers.get(abortKey)!;
          controller.abort();
          typeAbortControllers.delete(abortKey);
        }
        return { data: undefined };
      },
      providesTags: [],
    }),
  }),
});

/**
 * Export hooks for use in components
 */
export const { useGetPokemonTypesQuery, useGetPokemonTypeDetailQuery } = pokemonTypeApi;

/**
 * Export API for manual queries
 */
export default pokemonTypeApi;
