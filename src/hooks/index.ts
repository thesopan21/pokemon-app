/**
 * Custom Hooks for Pokemon App
 * Reusable hooks for common functionality
 */

import { useEffect, useRef, useState } from 'react';

/**
 * useDebounce Hook
 * Debounce a value with a specified delay
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useThrottle Hook
 * Throttle a callback function with a specified delay
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return ((...args) => {
    const now = Date.now();

    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
      }, delay - (now - lastCallRef.current));
    }
  }) as T;
}

/**
 * usePrevious Hook
 * Keep track of previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * useAsync Hook
 * Handle async operations with loading and error states
 */
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
): {
  status: 'idle' | 'pending' | 'success' | 'error';
  value: T | null;
  error: E | null;
} {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = async () => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error as E);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (!immediate) return;
    execute();
  }, [immediate]);

  return { status, value, error };
}

/**
 * useMount Hook
 * Run effect only on mount
 */
export function useMount(effect: () => void | (() => void)) {
  useEffect(effect, []);
}

/**
 * useUnmount Hook
 * Run effect only on unmount
 */
export function useUnmount(effect: () => void) {
  useEffect(() => {
    return effect;
  }, []);
}

/**
 * useLocalStorage Hook
 * Persist state to local storage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // This will be replaced with AsyncStorage usage in actual app
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // This will be replaced with AsyncStorage.setItem in actual app
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * useIsMounted Hook
 * Check if component is mounted
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
}

/**
 * useCallbackRef Hook
 * Create a stable reference to a callback
 */
export function useCallbackRef<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return ((...args) => callbackRef.current(...args)) as T;
}
