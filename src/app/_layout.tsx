/**
 * Root Layout with Redux Provider
 * Main entry point for the app with Redux store setup
 */

import { store } from '@/store';
import { Stack } from 'expo-router';
import React from 'react';
import { Provider } from 'react-redux';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F5F5F5' },
        }}
      />
    </Provider>
  );
}
