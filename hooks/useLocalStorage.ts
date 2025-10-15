/**
 * useLocalStorage Hook
 * Custom hook for managing localStorage with type safety and error handling
 */

import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = T | ((val: T) => T)

/**
 * Hook to use localStorage with React state
 * @param key - localStorage key
 * @param initialValue - initial value if key doesn't exist
 * @returns [storedValue, setValue, error]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, Error | null] {
  const [error, setError] = useState<Error | null>(null)
  
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
      setError(error as Error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value
        
        // Save state
        setStoredValue(valueToStore)
        
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
        
        // Clear any previous errors
        setError(null)
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
        setError(error as Error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue, error]
}
