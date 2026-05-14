/**
 * Pokemon By Type API Slice
 * Handles fetching Pokemon filtered by type with pagination
 */

import { PokemonTypeDetail } from '@/types/pokemon';
import { pokemonApi } from './baseApi';

/**
 * Store for abort controllers for type-based queries
 */
const byTypeAbortControllers: Map<string, AbortController> = new Map();

/**
 * Get abort controller for a specific type key
 */
const getByTypeAbortController = (key: string): AbortController => {
  // Cancel previous request if exists
  if (byTypeAbortControllers.has(key)) {
    const previousController = byTypeAbortControllers.get(key)!;
    previousController.abort();
  }

  // Create new abort controller
  const newController = new AbortController();
  byTypeAbortControllers.set(key, newController);
  return newController;
};

/**
 * Extend base API with Pokemon by type endpoints
 */
export const pokemonByTypeApi = pokemonApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get all Pokemon of a specific type
     * This includes damage relations and all Pokemon in that type
     */
    getPokemonByType: builder.query<PokemonTypeDetail, string>({
      query: (typeName) => {
        const abortKey = `pokemonByType_${typeName}`;
        const controller = getByTypeAbortController(abortKey);

        return {
          url: `/type/${typeName}`,
          signal: controller.signal,
        };
      },
      // Cache type data for 30 minutes
      keepUnusedDataFor: 30 * 60,
      providesTags: (result, _error, arg) => [{ type: 'PokemonByType', id: arg }],
    }),

    /**
     * Cancel ongoing Pokemon by type request
     */
    cancelGetPokemonByType: builder.query<void, string>({
      queryFn: (typeName) => {
        const abortKey = `pokemonByType_${typeName}`;
        if (byTypeAbortControllers.has(abortKey)) {
          const controller = byTypeAbortControllers.get(abortKey)!;
          controller.abort();
          byTypeAbortControllers.delete(abortKey);
        }
        return { data: undefined };
      },
      providesTags: [],
    }),

    /**
     * Cancel all ongoing Pokemon by type requests
     * Useful when switching types rapidly
     */
    cancelAllPokemonByTypeRequests: builder.query<void, void>({
      queryFn: () => {
        // Cancel all type-based requests
        byTypeAbortControllers.forEach((controller) => {
          controller.abort();
        });
        byTypeAbortControllers.clear();
        return { data: undefined };
      },
      providesTags: [],
    }),
  }),
});

/**
 * Export hooks for use in components
 */
export const { useGetPokemonByTypeQuery } = pokemonByTypeApi;

/**
 * Export API for manual queries
 */
export default pokemonByTypeApi;
