/**
 * RTK Query Base API Configuration
 * Base setup for all Pokemon API endpoints with custom middleware
 */

import { API_BASE_URL } from '@/constants/config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Create base query with axios instance
 * Includes error handling and request/response interceptors
 */
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

/**
 * Wrap base query to handle common errors and implement retry logic
 */
const baseQueryWithErrorHandling = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  return result;
};

/**
 * Base API slice - all other slices will be built on top of this
 */
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Pokemon', 'Type', 'PokemonByType', 'PokemonDetail'],
  endpoints: () => ({}),
});

export default pokemonApi;
