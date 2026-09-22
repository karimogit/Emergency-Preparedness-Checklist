/**
 * BooksManager Component
 * Manages essential books and resources for emergency preparedness
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, BookOpen, MapPin, Star, Trash2, Edit, Search, X } from 'lucide-react'
import { Book } from '@/types'
import { useBooks } from '@/hooks/useBooks'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { BOOK_CATEGORIES, BOOK_CATEGORY_COLORS } from '@/lib/constants'
import { getCategoryColor, matchesSearch } from '@/lib/utils'
import { bookSchema, validateForm } from '@/lib/validations'

const EMPTY_BOOK: Omit<Book, 'id'> = {
  title: '',
  author: '',
  category: '',
  location: '',
  notes: '',
  isEssential: false
}

export default function BooksManager() {
  const { 
    books, 
    addBook, 
    updateBook, 
    deleteBook 
  } = useBooks()
  
  const { showToast } = useToast()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [newBook, setNewBook] = useState<Omit<Book, 'id'>>(EMPTY_BOOK)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter books based on search
  const filteredBooks = useMemo(() => {
    return books.filter(book => matchesSearch(searchTerm, [book.title, book.author, book.category, book.location, book.notes]))
  }, [books, searchTerm])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = editingBook || newBook
    const validation = validateForm(bookSchema, formData)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      showToast('error', 'Please fix the form errors')
      return
    }
    
    setErrors({})
    
    if (editingBook) {
      updateBook(editingBook.id, editingBook)
      showToast('success', `${editingBook.title} updated successfully`)
      setEditingBook(null)
    } else {
      addBook(newBook)
      showToast('success', `${newBook.title} added to library`)
      setNewBook(EMPTY_BOOK)
      setShowAddModal(false)
    }
  }, [editingBook, newBook, addBook, updateBook, showToast])

  // Handle delete confirmation
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, itemId: id })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.itemId) {
      const book = books.find(b => b.id === deleteConfirm.itemId)
      deleteBook(deleteConfirm.itemId)
      showToast('success', `${book?.title || 'Book'} deleted`)
    }
    setDeleteConfirm({ isOpen: false, itemId: null })
  }, [deleteConfirm.itemId, books, deleteBook, showToast])

  // Handle input changes
  const handleInputChange = useCallback((field: keyof Omit<Book, 'id'>, value: string | boolean) => {
    if (editingBook) {
      setEditingBook({ ...editingBook, [field]: value })
    } else {
      setNewBook(prev => ({ ...prev, [field]: value }))
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }, [editingBook, errors])

  const closeModal = useCallback(() => {
    setShowAddModal(false)
    setEditingBook(null)
    setErrors({})
    setNewBook(EMPTY_BOOK)
  }, [])

  useEscapeKey(showAddModal || editingBook !== null, closeModal)

  const currentBook = editingBook || newBook

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 dark:text-sand-50 mb-2">
            Essential Books
          </h2>
          <p className="text-sand-600 dark:text-sand-400">
            Track your essential books and resources for emergency preparedness and survival.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          aria-label="Add new book"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Book</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" aria-hidden="true" />
          <input
            id="books-search"
            name="books-search"
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12 pr-12"
            aria-label="Search books"
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

      {/* Books List */}
      <div className="tactical-card overflow-hidden">
        <div className="section-header">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-forest-600 dark:text-forest-400" />
            <h3 className="text-lg font-bold text-forest-900 dark:text-sand-50">
              Your Books Collection
            </h3>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300">
              {filteredBooks.length}
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-sand-200 dark:divide-forest-700">
          {filteredBooks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl icon-container mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-forest-400" aria-hidden="true" />
              </div>
              <p className="text-sand-500 dark:text-sand-400 font-medium">
                {searchTerm ? 'No books match your search.' : 'No books added yet.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 text-sm font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                >
                  Add your first book →
                </button>
              )}
            </div>
          ) : (
            filteredBooks.map((book, index) => (
              <div 
                key={book.id} 
                className="p-5 hover:bg-sand-50 dark:hover:bg-forest-800/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-bold text-forest-900 dark:text-sand-50">{book.title}</h4>
                      {book.isEssential && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700">
                          <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-label="Essential book" />
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Essential</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-sand-600 dark:text-sand-400 mb-3">by {book.author}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getCategoryColor(book.category, BOOK_CATEGORY_COLORS)}`}>
                        {book.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-sand-500 dark:text-sand-400">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        <span>{book.location || 'Location not set'}</span>
                      </div>
                      {book.notes && (
                        <span className="text-sand-500 dark:text-sand-400 italic">{book.notes}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingBook(book)}
                      className="p-2.5 rounded-xl text-sand-400 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-sand-100 dark:hover:bg-forest-800 transition-all focus:outline-none focus:ring-2 focus:ring-forest-500"
                      aria-label={`Edit ${book.title}`}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(book.id)}
                      className="p-2.5 rounded-xl text-sand-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete ${book.title}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingBook) && (
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
                {editingBook ? 'Edit Book' : 'Add Book'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl text-sand-400 hover:text-sand-600 dark:hover:text-sand-300 hover:bg-sand-100 dark:hover:bg-forest-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Book Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={currentBook.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., SAS Survival Handbook"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {errors.title && (
                  <p id="title-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="author" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Author *
                </label>
                <input
                  id="author"
                  type="text"
                  value={currentBook.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className={`input-field ${errors.author ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., John Wiseman"
                  aria-invalid={!!errors.author}
                  aria-describedby={errors.author ? 'author-error' : undefined}
                />
                {errors.author && (
                  <p id="author-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.author}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={currentBook.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`select-field ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                >
                  <option value="">Select category</option>
                  {BOOK_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p id="category-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={currentBook.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Where is this book stored?"
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={currentBook.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Any additional notes about this book"
                  className="input-field resize-none"
                />
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-xl bg-sand-50 dark:bg-forest-800/50 border border-sand-200 dark:border-forest-700">
                <input
                  type="checkbox"
                  id="isEssential"
                  checked={currentBook.isEssential}
                  onChange={(e) => handleInputChange('isEssential', e.target.checked)}
                  className="h-5 w-5 text-forest-600 focus:ring-forest-500 border-sand-300 dark:border-forest-600 rounded"
                />
                <label htmlFor="isEssential" className="flex items-center gap-2 text-sm font-medium text-forest-900 dark:text-sand-200">
                  <Star className="h-4 w-4 text-amber-500" />
                  Mark as essential book
                </label>
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
                  {editingBook ? 'Update' : 'Add'} Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
      />
    </div>
  )
}
