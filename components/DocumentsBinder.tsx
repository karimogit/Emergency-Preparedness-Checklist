/**
 * DocumentsBinder Component
 * Manages important documents and their locations
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, FileText, MapPin, Star, Trash2, Edit, Calendar, Search, X } from 'lucide-react'
import { Document } from '@/types'
import { useDocuments } from '@/hooks/useDocuments'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_COLORS } from '@/lib/constants'
import { getCategoryColor, getExpiryStatus, formatDate, matchesSearch } from '@/lib/utils'
import { documentSchema, validateForm } from '@/lib/validations'

const EMPTY_DOCUMENT: Omit<Document, 'id'> = {
  name: '',
  category: '',
  location: '',
  expiryDate: '',
  isDigital: false,
  notes: '',
  isEssential: false
}

export default function DocumentsBinder() {
  const { 
    documents, 
    addDocument, 
    updateDocument, 
    deleteDocument,
    expiringDocuments 
  } = useDocuments()
  
  const { showToast } = useToast()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [newDocument, setNewDocument] = useState<Omit<Document, 'id'>>(EMPTY_DOCUMENT)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter documents based on search
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => matchesSearch(searchTerm, [doc.name, doc.category, doc.location, doc.notes]))
  }, [documents, searchTerm])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = editingDocument || newDocument
    const validation = validateForm(documentSchema, formData)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      showToast('error', 'Please fix the form errors')
      return
    }
    
    setErrors({})
    
    if (editingDocument) {
      updateDocument(editingDocument.id, editingDocument)
      showToast('success', `${editingDocument.name} updated successfully`)
      setEditingDocument(null)
    } else {
      addDocument(newDocument)
      showToast('success', `${newDocument.name} added`)
      setNewDocument(EMPTY_DOCUMENT)
      setShowAddModal(false)
    }
  }, [editingDocument, newDocument, addDocument, updateDocument, showToast])

  // Handle delete confirmation
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, itemId: id })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.itemId) {
      const doc = documents.find(d => d.id === deleteConfirm.itemId)
      deleteDocument(deleteConfirm.itemId)
      showToast('success', `${doc?.name || 'Document'} deleted`)
    }
    setDeleteConfirm({ isOpen: false, itemId: null })
  }, [deleteConfirm.itemId, documents, deleteDocument, showToast])

  // Handle input changes
  const handleInputChange = useCallback((field: keyof Omit<Document, 'id'>, value: string | boolean) => {
    if (editingDocument) {
      setEditingDocument({ ...editingDocument, [field]: value })
    } else {
      setNewDocument(prev => ({ ...prev, [field]: value }))
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }, [editingDocument, errors])

  const closeModal = useCallback(() => {
    setShowAddModal(false)
    setEditingDocument(null)
    setErrors({})
    setNewDocument(EMPTY_DOCUMENT)
  }, [])

  useEscapeKey(showAddModal || editingDocument !== null, closeModal)

  const currentDocument = editingDocument || newDocument

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 dark:text-sand-50 mb-2">
            Important Documents
          </h2>
          <p className="text-sand-600 dark:text-sand-400">
            Track your important documents and where they are stored for quick access during emergencies.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          aria-label="Add new document"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Document</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" aria-hidden="true" />
          <input
            id="documents-search"
            name="documents-search"
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12 pr-12"
            aria-label="Search documents"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-sand-400 hover:text-sand-600 dark:hover:text-sand-300 hover:bg-sand-100 dark:hover:bg-forest-800 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Expiring Documents Alert */}
      {expiringDocuments.length > 0 && (
        <div className="alert-box warning mb-8" role="alert">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
            <h3 className="font-bold text-amber-800 dark:text-amber-300">Expiring Documents</h3>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-400 ml-12">
            {expiringDocuments.length} document(s) are expiring soon or have expired.
          </p>
        </div>
      )}

      {/* Documents List */}
      <div className="tactical-card overflow-hidden">
        <div className="section-header">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-forest-600 dark:text-forest-400" />
            <h3 className="text-lg font-bold text-forest-900 dark:text-sand-50">
              Your Documents
            </h3>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300">
              {filteredDocuments.length}
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-sand-200 dark:divide-forest-700">
          {filteredDocuments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl icon-container mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-forest-400" aria-hidden="true" />
              </div>
              <p className="text-sand-500 dark:text-sand-400 font-medium">
                {searchTerm ? 'No documents match your search.' : 'No documents added yet.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 text-sm font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                >
                  Add your first document →
                </button>
              )}
            </div>
          ) : (
            filteredDocuments.map((doc, index) => {
              const expiryStatus = doc.expiryDate ? getExpiryStatus(doc.expiryDate) : null
              
              return (
                <div 
                  key={doc.id} 
                  className="p-5 hover:bg-sand-50 dark:hover:bg-forest-800/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h4 className="font-bold text-forest-900 dark:text-sand-50">{doc.name}</h4>
                        {doc.isEssential && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700">
                            <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-label="Essential document" />
                            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Essential</span>
                          </div>
                        )}
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getCategoryColor(doc.category, DOCUMENT_CATEGORY_COLORS)}`}>
                          {doc.category}
                        </span>
                        {doc.isDigital && (
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-sand-100 dark:bg-forest-800 text-sand-600 dark:text-sand-300 border border-sand-200 dark:border-forest-700">
                            Digital
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-forest-100 dark:bg-forest-800">
                            <MapPin className="h-3.5 w-3.5 text-forest-600 dark:text-forest-400" aria-hidden="true" />
                          </div>
                          <span className="text-sand-500 dark:text-sand-400">Location:</span>
                          <span className="font-medium text-forest-700 dark:text-forest-300 truncate">{doc.location || 'Not specified'}</span>
                        </div>
                        {doc.expiryDate && expiryStatus && (
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-sand-100 dark:bg-forest-800">
                              <Calendar className="h-3.5 w-3.5 text-sand-500 dark:text-sand-400" aria-hidden="true" />
                            </div>
                            <span className="text-sand-500 dark:text-sand-400">Expires:</span>
                            <span className={`font-medium ${expiryStatus.color}`}>
                              {formatDate(doc.expiryDate)}
                              {expiryStatus.status === 'expired' && ' (Expired)'}
                              {expiryStatus.status === 'expiring' && ` (${expiryStatus.days}d)`}
                            </span>
                          </div>
                        )}
                        {doc.notes && (
                          <div className="flex items-center gap-2 md:col-span-1">
                            <span className="text-sand-500 dark:text-sand-400">Notes:</span>
                            <span className="text-sand-600 dark:text-sand-300 truncate">{doc.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingDocument(doc)}
                        className="p-2.5 rounded-xl text-sand-400 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-sand-100 dark:hover:bg-forest-800 transition-all focus:outline-none focus:ring-2 focus:ring-forest-500"
                        aria-label={`Edit ${doc.name}`}
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(doc.id)}
                        className="p-2.5 rounded-xl text-sand-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete ${doc.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingDocument) && (
        <div 
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content">
            <div className="px-6 py-5 border-b border-sand-200 dark:border-forest-700 flex justify-between items-center">
              <h3 id="modal-title" className="text-lg font-bold text-forest-900 dark:text-sand-50">
                {editingDocument ? 'Edit Document' : 'Add Document'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl text-sand-400 hover:text-sand-600 dark:hover:text-sand-300 hover:bg-sand-100 dark:hover:bg-forest-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Document Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={currentDocument.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., Passport"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={currentDocument.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`select-field ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                >
                  <option value="">Select category</option>
                  {DOCUMENT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p id="category-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Location *
                </label>
                <input
                  id="location"
                  type="text"
                  value={currentDocument.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Where is this document stored?"
                  className={`input-field ${errors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? 'location-error' : undefined}
                />
                {errors.location && (
                  <p id="location-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="date"
                  value={currentDocument.expiryDate || ''}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={currentDocument.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Any additional notes about this document"
                  className="input-field resize-none"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-sand-50 dark:bg-forest-800/50 border border-sand-200 dark:border-forest-700">
                  <input
                    type="checkbox"
                    id="isDigital"
                    checked={currentDocument.isDigital}
                    onChange={(e) => handleInputChange('isDigital', e.target.checked)}
                    className="h-5 w-5 text-forest-600 focus:ring-forest-500 border-sand-300 dark:border-forest-600 rounded"
                  />
                  <label htmlFor="isDigital" className="text-sm font-medium text-forest-900 dark:text-sand-200">
                    Digital document (stored electronically)
                  </label>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl bg-sand-50 dark:bg-forest-800/50 border border-sand-200 dark:border-forest-700">
                  <input
                    type="checkbox"
                    id="isEssential"
                    checked={currentDocument.isEssential}
                    onChange={(e) => handleInputChange('isEssential', e.target.checked)}
                    className="h-5 w-5 text-forest-600 focus:ring-forest-500 border-sand-300 dark:border-forest-600 rounded"
                  />
                  <label htmlFor="isEssential" className="flex items-center gap-2 text-sm font-medium text-forest-900 dark:text-sand-200">
                    <Star className="h-4 w-4 text-amber-500" />
                    Mark as essential document
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingDocument ? 'Update' : 'Add'} Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
      />
    </div>
  )
}
