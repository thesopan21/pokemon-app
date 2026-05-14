/**
 * Redux Store Configuration
 * Central store setup with RTK Query and other slices
 */

import { pokemonApi } from '@/api/baseApi';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

/**
 * Configure Redux store with all middleware and slices
 */
const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        // RTK Query uses AbortController which is not serializable
        ignoredActions: ['pokemon/fulfilled', 'pokemon/pending', 'pokemon/rejected'],
      },
    }).concat(pokemonApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Infer the RootState type from the store itself
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Infer the Dispatch type from the store itself
 */
export type AppDispatch = typeof store.dispatch;

/**
 * Custom hooks for using dispatch and selector throughout the app
 * Provide better TypeScript support
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Function to create a new store with preloaded state (useful for testing)
 */
export function setupStore(preloadedState?: ReturnType<typeof store.getState>) {
  return configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['pokemon/fulfilled', 'pokemon/pending', 'pokemon/rejected'],
        },
      }).concat(pokemonApi.middleware),
  });
}

export { store };
