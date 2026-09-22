/**
 * useLocalStorage Hook
 * Custom hook for managing localStorage with type safety and error handling
 */

import { useState, useEffect, useCallback, useRef } from 'react'

type SetValue<T> = T | ((val: T) => T)

function readStoredValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue
  }

  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : initialValue
  } catch (error) {
    console.error(`Error loading localStorage key "${key}":`, error)
    return initialValue
  }
}

/**
 * Hook to use localStorage with React state.
 * Functional updates always see the latest value, including rapid successive writes.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, Error | null] {
  const [error, setError] = useState<Error | null>(null)
  const [storedValue, setStoredValue] = useState<T>(() => readStoredValue(key, initialValue))
  const storedValueRef = useRef(storedValue)
  storedValueRef.current = storedValue

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValueRef.current) : value
        storedValueRef.current = valueToStore
        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }

        setError(null)
      } catch (err) {
        console.error(`Error setting localStorage key "${key}":`, err)
        setError(err as Error)
      }
    },
    [key]
  )

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== window.localStorage) return

      try {
        const next = event.newValue === null
          ? initialValue
          : (JSON.parse(event.newValue) as T)
        storedValueRef.current = next
        setStoredValue(next)
        setError(null)
      } catch (err) {
        console.error(`Error syncing localStorage key "${key}":`, err)
        setError(err as Error)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, initialValue])

  return [storedValue, setValue, error]
}
