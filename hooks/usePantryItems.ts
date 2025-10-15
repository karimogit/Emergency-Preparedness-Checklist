/**
 * usePantryItems Hook
 * Custom hook for managing pantry items with localStorage
 */

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { PantryItem } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId } from '@/lib/utils'

const DEFAULT_PANTRY_ITEMS: PantryItem[] = [
  {
    id: '1',
    name: 'Canned Beans',
    category: 'Canned Goods',
    quantity: 6,
    unit: 'cans',
    expiryDate: '2025-06-15',
    minQuantity: 2,
    notes: 'Black beans and kidney beans for protein'
  },
  {
    id: '2',
    name: 'Rice',
    category: 'Grains & Pasta',
    quantity: 10,
    unit: 'pounds',
    expiryDate: '2026-03-20',
    minQuantity: 5,
    notes: 'Long grain white rice'
  },
  {
    id: '3',
    name: 'Bottled Water',
    category: 'Beverages',
    quantity: 24,
    unit: 'bottles',
    expiryDate: '2025-12-01',
    minQuantity: 12,
    notes: '16.9 oz bottles'
  },
  {
    id: '4',
    name: 'Protein Bars',
    category: 'Snacks',
    quantity: 8,
    unit: 'bars',
    expiryDate: '2024-11-30',
    minQuantity: 4,
    notes: 'High protein emergency food'
  },
  {
    id: '5',
    name: 'Canned Tuna',
    category: 'Canned Goods',
    quantity: 4,
    unit: 'cans',
    expiryDate: '2025-08-10',
    minQuantity: 2,
    notes: 'Albacore tuna in water'
  },
  {
    id: '6',
    name: 'Peanut Butter',
    category: 'Condiments',
    quantity: 2,
    unit: 'jars',
    expiryDate: '2025-02-15',
    minQuantity: 1,
    notes: 'Natural peanut butter'
  },
  {
    id: '7',
    name: 'Crackers',
    category: 'Snacks',
    quantity: 3,
    unit: 'boxes',
    expiryDate: '2024-12-20',
    minQuantity: 1,
    notes: 'Saltine crackers'
  },
  {
    id: '8',
    name: 'Canned Vegetables',
    category: 'Canned Goods',
    quantity: 8,
    unit: 'cans',
    expiryDate: '2025-07-05',
    minQuantity: 4,
    notes: 'Mixed vegetables and corn'
  }
]

export function usePantryItems() {
  const [items, setItems] = useLocalStorage<PantryItem[]>(
    STORAGE_KEYS.PANTRY_ITEMS,
    DEFAULT_PANTRY_ITEMS
  )

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

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    deleteMultiple
  }
}
