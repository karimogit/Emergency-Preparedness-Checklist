/**
 * useDocuments Hook
 * Custom hook for managing documents with localStorage
 */

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { Document } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId } from '@/lib/utils'

const DEFAULT_DOCUMENTS: Document[] = []

export function useDocuments() {
  const [documents, setDocuments] = useLocalStorage<Document[]>(
    STORAGE_KEYS.DOCUMENTS,
    DEFAULT_DOCUMENTS
  )

  const addDocument = useCallback((document: Omit<Document, 'id'>) => {
    const newDocument: Document = {
      ...document,
      id: generateId()
    }
    setDocuments(prev => [...prev, newDocument])
    return newDocument
  }, [setDocuments])

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, ...updates } : doc))
    )
  }, [setDocuments])

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }, [setDocuments])

  const deleteMultiple = useCallback((ids: string[]) => {
    setDocuments(prev => prev.filter(doc => !ids.includes(doc.id)))
  }, [setDocuments])

  return {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    deleteMultiple
  }
}
