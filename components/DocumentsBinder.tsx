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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Important Documents Binder
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your important documents and their locations for quick access during emergencies.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Add new document"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Document</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <input
            id="documents-search"
            name="documents-search"
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            aria-label="Search documents"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Expiring Documents Alert */}
      {expiringDocuments.length > 0 && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4" role="alert">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">Expiring Documents</h3>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            {expiringDocuments.length} document(s) are expiring soon or have expired.
          </p>
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-brown-50 to-brown-100 dark:from-brown-900/30 dark:to-brown-800/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Documents ({filteredDocuments.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredDocuments.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" aria-hidden="true" />
              <p>{searchTerm ? 'No documents match your search.' : 'No documents added yet. Add your first document to get started!'}</p>
            </div>
          ) : (
            filteredDocuments.map((doc) => {
              const expiryStatus = doc.expiryDate ? getExpiryStatus(doc.expiryDate) : null
              
              return (
                <div key={doc.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{doc.name}</h4>
                        {doc.isEssential && (
                          <Star className="h-4 w-4 text-brown-500 dark:text-brown-400 flex-shrink-0" aria-label="Essential document" />
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(doc.category, DOCUMENT_CATEGORY_COLORS)}`}>
                          {doc.category}
                        </span>
                        {doc.isDigital && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            Digital
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                          <span className="font-medium">Location:</span>
                          <span className="ml-1">{doc.location || 'Not specified'}</span>
                        </div>
                        {doc.expiryDate && expiryStatus && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                            <span className="font-medium">Expires:</span>
                            <span className={`ml-1 ${expiryStatus.color}`}>
                              {formatDate(doc.expiryDate)}
                              {expiryStatus.status === 'expired' && ' (Expired)'}
                              {expiryStatus.status === 'expiring' && ` (${expiryStatus.days} days)`}
                            </span>
                          </div>
                        )}
                        {doc.notes && (
                          <div>
                            <span className="font-medium">Notes:</span>
                            <span className="ml-1">{doc.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setEditingDocument(doc)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 rounded"
                        aria-label={`Edit ${doc.name}`}
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(doc.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingDocument ? 'Edit Document' : 'Add Document'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={currentDocument.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  value={currentDocument.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                >
                  <option value="">Select category</option>
                  {DOCUMENT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p id="category-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location *
                </label>
                <input
                  id="location"
                  type="text"
                  value={currentDocument.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Where is this document stored?"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? 'location-error' : undefined}
                />
                {errors.location && (
                  <p id="location-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  id="expiryDate"
                  type="date"
                  value={currentDocument.expiryDate || ''}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={currentDocument.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Any additional notes about this document"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDigital"
                    checked={currentDocument.isDigital}
                    onChange={(e) => handleInputChange('isDigital', e.target.checked)}
                    className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="isDigital" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Digital document (stored electronically)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isEssential"
                    checked={currentDocument.isEssential}
                    onChange={(e) => handleInputChange('isEssential', e.target.checked)}
                    className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="isEssential" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Mark as essential document
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500"
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
