/**
 * usePantryItems Hook
 * Custom hook for managing pantry items with localStorage
 */

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { PantryItem } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId, getExpiryStatus } from '@/lib/utils'
import { DEFAULT_PANTRY_ITEMS, migratePantryItems } from '@/lib/defaultData'

export function usePantryItems() {
  const [items, setItems] = useLocalStorage<PantryItem[]>(
    STORAGE_KEYS.PANTRY_ITEMS,
    DEFAULT_PANTRY_ITEMS
  )
  const migrated = useRef(false)

  useEffect(() => {
    if (migrated.current) return
    migrated.current = true
    const next = migratePantryItems(items)
    if (next !== items) setItems(next)
  }, [items, setItems])

  const addItem = useCallback((item: Omit<PantryItem, 'id'>) => {
    const newItem: PantryItem = {
      ...item,
      id: generateId()
    }
    setItems(prev => [...prev, newItem])
    return newItem
  }, [setItems])

  const updateItem = useCallback((id: string, updates: Partial<PantryItem>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    )
  }, [setItems])

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [setItems])

  const deleteMultiple = useCallback((ids: string[]) => {
    setItems(prev => prev.filter(item => !ids.includes(item.id)))
  }, [setItems])

  // Computed values
  const lowStockItems = useMemo(() => 
    items.filter(item => item.quantity <= item.minQuantity),
    [items]
  )

  const expiringItems = useMemo(() => 
    items.filter(item => {
      const status = getExpiryStatus(item.expiryDate)
      return status.status === 'expired' || status.status === 'expiring'
    }),
    [items]
  )

  return {
    items,
    setItems,
    addItem,
    updateItem,
    deleteItem,
    deleteMultiple,
    lowStockItems,
    expiringItems
  }
}
