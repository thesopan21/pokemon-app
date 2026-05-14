/**
 * Pokemon Detail API Slice
 * Handles fetching detailed information about a single Pokemon
 */

import { Pokemon } from '@/types/pokemon';
import { pokemonApi } from './baseApi';

/**
 * Store for abort controllers for detail requests
 */
const detailAbortControllers: Map<string, AbortController> = new Map();

/**
 * Get abort controller for a specific Pokemon detail key
 */
const getDetailAbortController = (key: string): AbortController => {
  // Cancel previous request if exists
  if (detailAbortControllers.has(key)) {
    const previousController = detailAbortControllers.get(key)!;
    previousController.abort();
  }

  // Create new abort controller
  const newController = new AbortController();
  detailAbortControllers.set(key, newController);
  return newController;
};

/**
 * Extend base API with Pokemon detail endpoints
 */
export const pokemonDetailApi = pokemonApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get detailed information about a specific Pokemon
     * Can query by ID or name
     */
    getPokemonDetail: builder.query<Pokemon, string | number>({
      query: (idOrName) => {
        const abortKey = `pokemonDetail_${idOrName}`;
        const controller = getDetailAbortController(abortKey);

        return {
          url: `/pokemon/${idOrName}`,
          signal: controller.signal,
        };
      },
      providesTags: (_result, _error, arg) => [{ type: 'PokemonDetail', id: arg }],
    }),

    /**
     * Prefetch Pokemon details (useful for optimistic loading)
     */
    prefetchPokemonDetail: builder.query<Pokemon, string | number>({
      query: (idOrName) => `/pokemon/${idOrName}`,
      providesTags: (_result, _error, arg) => [{ type: 'PokemonDetail', id: arg }],
    }),

    /**
     * Cancel ongoing Pokemon detail request for specific Pokemon
     */
    cancelGetPokemonDetail: builder.query<void, string | number>({
      queryFn: (idOrName) => {
        const abortKey = `pokemonDetail_${idOrName}`;
        if (detailAbortControllers.has(abortKey)) {
          const controller = detailAbortControllers.get(abortKey)!;
          controller.abort();
          detailAbortControllers.delete(abortKey);
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
export const { useGetPokemonDetailQuery, usePrefetchPokemonDetailQuery } = pokemonDetailApi;

/**
 * Export API for manual queries
 */
export default pokemonDetailApi;
