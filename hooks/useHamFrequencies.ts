/**
 * useHamFrequencies Hook
 * Custom hook for managing HAM radio frequencies with localStorage
 */

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { HamFrequency } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId } from '@/lib/utils'

const DEFAULT_FREQUENCIES: HamFrequency[] = [
  {
    id: '1',
    frequency: '146.52 MHz',
    description: 'National Calling Frequency (2m) - FM',
    location: 'Emergency Communications',
    notes: 'Primary emergency calling frequency for 2-meter band',
    isEmergency: true
  },
  {
    id: '2',
    frequency: '446.00 MHz',
    description: 'National Calling Frequency (70cm) - FM',
    location: 'Emergency Communications',
    notes: 'Primary emergency calling frequency for 70cm band',
    isEmergency: true
  }
]

export function useHamFrequencies() {
  const [frequencies, setFrequencies] = useLocalStorage<HamFrequency[]>(
    STORAGE_KEYS.HAM_FREQUENCIES,
    DEFAULT_FREQUENCIES
  )

  const addFrequency = useCallback((frequency: Omit<HamFrequency, 'id'>) => {
    const newFrequency: HamFrequency = {
      ...frequency,
      id: generateId()
    }
    setFrequencies(prev => [...prev, newFrequency])
    return newFrequency
  }, [setFrequencies])

  const updateFrequency = useCallback((id: string, updates: Partial<HamFrequency>) => {
    setFrequencies(prev =>
      prev.map(freq => (freq.id === id ? { ...freq, ...updates } : freq))
    )
  }, [setFrequencies])

  const deleteFrequency = useCallback((id: string) => {
    setFrequencies(prev => prev.filter(freq => freq.id !== id))
  }, [setFrequencies])

  const deleteMultiple = useCallback((ids: string[]) => {
    setFrequencies(prev => prev.filter(freq => !ids.includes(freq.id)))
  }, [setFrequencies])

  return {
    frequencies,
    addFrequency,
    updateFrequency,
    deleteFrequency,
    deleteMultiple
  }
}
