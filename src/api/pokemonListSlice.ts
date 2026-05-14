/**
 * Pokemon List API Slice
 * Handles fetching paginated Pokemon list with cancellation support
 */

import { PAGINATION } from '@/constants/config';
import { PokemonListResponse } from '@/types/pokemon';
import { pokemonApi } from './baseApi';

/**
 * Store for abort controllers to manage multiple concurrent requests
 */
const abortControllers: Map<string, AbortController> = new Map();

/**
 * Get abort controller for a specific key
 */
const getAbortController = (key: string): AbortController => {
  // Cancel previous request if exists
  if (abortControllers.has(key)) {
    const previousController = abortControllers.get(key)!;
    previousController.abort();
  }

  // Create new abort controller
  const newController = new AbortController();
  abortControllers.set(key, newController);
  return newController;
};

/**
 * Extend base API with Pokemon list endpoints
 */
export const pokemonListApi = pokemonApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get paginated list of all Pokemon
     * Supports pagination with limit and offset
     * Includes automatic cancellation of previous requests
     */
    getPokemonList: builder.query<
      PokemonListResponse,
      {
        limit?: number;
        offset?: number;
      }
    >({
      query: ({ limit = PAGINATION.DEFAULT_LIMIT, offset = PAGINATION.INITIAL_OFFSET }) => {
        const abortKey = 'pokemonList';
        const controller = getAbortController(abortKey);

        return {
          url: '/pokemon',
          params: { limit, offset },
          signal: controller.signal,
        };
      },
      // Merge pagination results
      merge: (currentCache, newData, { arg }) => {
        if (arg.offset === 0) {
          // Reset cache when offset is 0 (first page)
          return newData;
        }
        // Append new results to existing cache
        return {
          ...newData,
          results: [...(currentCache?.results || []), ...newData.results],
        };
      },
      // Keep previous data while fetching new data
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return { endpointName, queryArgs: { limit: queryArgs.limit } };
      },
      // Keep cache data while fetching
      forceRefetch({ currentCacheStatus, endpointName }) {
        return currentCacheStatus === 'uninitialized';
      },
      providesTags: ['Pokemon'],
    }),

    /**
     * Cancel ongoing Pokemon list request
     */
    cancelGetPokemonList: builder.query<void, void>({
      queryFn: () => {
        const abortKey = 'pokemonList';
        if (abortControllers.has(abortKey)) {
          const controller = abortControllers.get(abortKey)!;
          controller.abort();
          abortControllers.delete(abortKey);
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
export const { useGetPokemonListQuery, useGetPokemonListQueryState } = pokemonListApi;

/**
 * Export API for manual queries
 */
export default pokemonListApi;
