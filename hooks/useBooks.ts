/**
 * useBooks Hook
 * Custom hook for managing books with localStorage
 */

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { Book } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId } from '@/lib/utils'

const DEFAULT_BOOKS: Book[] = [
  {
    id: '1',
    title: 'SAS Survival Handbook',
    author: 'John "Lofty" Wiseman',
    category: 'Survival',
    location: 'Home library',
    isEssential: true,
    notes: 'Comprehensive survival guide covering wilderness, urban, and disaster scenarios'
  },
  {
    id: '2',
    title: 'Where There Is No Doctor',
    author: 'David Werner',
    category: 'Medical',
    location: 'Home library',
    isEssential: true,
    notes: 'Essential medical guide for when professional help is unavailable'
  }
]

export function useBooks() {
  const [books, setBooks] = useLocalStorage<Book[]>(
    STORAGE_KEYS.BOOKS,
    DEFAULT_BOOKS
  )

  const addBook = useCallback((book: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...book,
      id: generateId()
    }
    setBooks(prev => [...prev, newBook])
    return newBook
  }, [setBooks])

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks(prev =>
      prev.map(book => (book.id === id ? { ...book, ...updates } : book))
    )
  }, [setBooks])

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id))
  }, [setBooks])

  const deleteMultiple = useCallback((ids: string[]) => {
    setBooks(prev => prev.filter(book => !ids.includes(book.id)))
  }, [setBooks])

  return {
    books,
    addBook,
    updateBook,
    deleteBook,
    deleteMultiple
  }
}
