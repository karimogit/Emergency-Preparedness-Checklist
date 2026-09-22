/**
 * useDocuments Hook
 * Custom hook for managing documents with localStorage
 */

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { Document } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId, getExpiryStatus } from '@/lib/utils'
import { DEFAULT_DOCUMENTS, migrateDocuments } from '@/lib/defaultData'

export function useDocuments() {
  const [documents, setDocuments] = useLocalStorage<Document[]>(
    STORAGE_KEYS.DOCUMENTS,
    DEFAULT_DOCUMENTS
  )
  const migrated = useRef(false)

  useEffect(() => {
    if (migrated.current) return
    migrated.current = true
    const next = migrateDocuments(documents)
    if (next !== documents) setDocuments(next)
  }, [documents, setDocuments])

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

  // Computed values
  const essentialDocuments = useMemo(() => 
    documents.filter(doc => doc.isEssential),
    [documents]
  )

  const expiringDocuments = useMemo(() => 
    documents.filter(doc => {
      if (!doc.expiryDate) return false
      const status = getExpiryStatus(doc.expiryDate)
      return status.status === 'expired' || status.status === 'expiring'
    }),
    [documents]
  )

  const documentsByCategory = useMemo(() => {
    const grouped: Record<string, Document[]> = {}
    documents.forEach(doc => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = []
      }
      grouped[doc.category].push(doc)
    })
    return grouped
  }, [documents])

  return {
    documents,
    setDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    deleteMultiple,
    essentialDocuments,
    expiringDocuments,
    documentsByCategory
  }
}
