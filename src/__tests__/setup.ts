/**
 * Jest Setup File
 * Configure testing environment and global mocks
 */

import '@testing-library/react-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  Stack: jest.fn(({ children }) => children),
  useNavigation: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock console methods to reduce noise in test output
global.console.error = jest.fn();
global.console.warn = jest.fn();

// Setup RTK Query
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  http.get('https://pokeapi.co/api/v2/pokemon', () => {
    return HttpResponse.json({
      count: 1292,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    });
  })
);

// Start server before tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Cleanup after all tests
afterAll(() => server.close());
