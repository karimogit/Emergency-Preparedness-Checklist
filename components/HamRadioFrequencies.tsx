/**
 * HamRadioFrequencies Component
 * Manages HAM radio frequencies for emergency communication
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, Radio, MapPin, Star, Trash2, Edit, Search, X } from 'lucide-react'
import { HamFrequency } from '@/types'
import { useHamFrequencies } from '@/hooks/useHamFrequencies'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { HAM_LOCATION_TYPES, HAM_LOCATION_COLORS } from '@/lib/constants'
import { getCategoryColor, matchesSearch } from '@/lib/utils'
import { hamFrequencySchema, validateForm } from '@/lib/validations'

const EMPTY_FREQUENCY: Omit<HamFrequency, 'id'> = {
  frequency: '',
  description: '',
  location: '',
  notes: '',
  isEmergency: false
}

export default function HamRadioFrequencies() {
  const { 
    frequencies, 
    addFrequency, 
    updateFrequency, 
    deleteFrequency 
  } = useHamFrequencies()
  
  const { showToast } = useToast()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFrequency, setEditingFrequency] = useState<HamFrequency | null>(null)
  const [newFrequency, setNewFrequency] = useState<Omit<HamFrequency, 'id'>>(EMPTY_FREQUENCY)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter frequencies based on search
  const filteredFrequencies = useMemo(() => {
    return frequencies.filter(freq => matchesSearch(searchTerm, [freq.frequency, freq.description, freq.location, freq.notes]))
  }, [frequencies, searchTerm])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = editingFrequency || newFrequency
    const validation = validateForm(hamFrequencySchema, formData)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      showToast('error', 'Please fix the form errors')
      return
    }
    
    setErrors({})
    
    if (editingFrequency) {
      updateFrequency(editingFrequency.id, editingFrequency)
      showToast('success', `${editingFrequency.frequency} updated successfully`)
      setEditingFrequency(null)
    } else {
      addFrequency(newFrequency)
      showToast('success', `${newFrequency.frequency} added`)
      setNewFrequency(EMPTY_FREQUENCY)
      setShowAddModal(false)
    }
  }, [editingFrequency, newFrequency, addFrequency, updateFrequency, showToast])

  // Handle delete confirmation
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, itemId: id })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.itemId) {
      const freq = frequencies.find(f => f.id === deleteConfirm.itemId)
      deleteFrequency(deleteConfirm.itemId)
      showToast('success', `${freq?.frequency || 'Frequency'} deleted`)
    }
    setDeleteConfirm({ isOpen: false, itemId: null })
  }, [deleteConfirm.itemId, frequencies, deleteFrequency, showToast])

  // Handle input changes
  const handleInputChange = useCallback((field: keyof Omit<HamFrequency, 'id'>, value: string | boolean) => {
    if (editingFrequency) {
      setEditingFrequency({ ...editingFrequency, [field]: value })
    } else {
      setNewFrequency(prev => ({ ...prev, [field]: value }))
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }, [editingFrequency, errors])

  const closeModal = useCallback(() => {
    setShowAddModal(false)
    setEditingFrequency(null)
    setErrors({})
    setNewFrequency(EMPTY_FREQUENCY)
  }, [])

  useEscapeKey(showAddModal || editingFrequency !== null, closeModal)

  const currentFrequency = editingFrequency || newFrequency

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 dark:text-sand-50 mb-2">
            HAM Radio Frequencies
          </h2>
          <p className="text-sand-600 dark:text-sand-400">
            Store important HAM radio frequencies for emergency communication.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          aria-label="Add new frequency"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Frequency</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" aria-hidden="true" />
          <input
            id="frequencies-search"
            name="frequencies-search"
            type="text"
            placeholder="Search frequencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12 pr-12"
            aria-label="Search frequencies"
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

      {/* Frequencies List */}
      <div className="tactical-card overflow-hidden">
        <div className="section-header">
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 text-forest-600 dark:text-forest-400" />
            <h3 className="text-lg font-bold text-forest-900 dark:text-sand-50">
              Your Frequencies
            </h3>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300">
              {filteredFrequencies.length}
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-sand-200 dark:divide-forest-700">
          {filteredFrequencies.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl icon-container mx-auto mb-4 flex items-center justify-center">
                <Radio className="h-8 w-8 text-forest-400" aria-hidden="true" />
              </div>
              <p className="text-sand-500 dark:text-sand-400 font-medium">
                {searchTerm ? 'No frequencies match your search.' : 'No frequencies added yet.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 text-sm font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                >
                  Add your first frequency →
                </button>
              )}
            </div>
          ) : (
            filteredFrequencies.map((freq, index) => (
              <div 
                key={freq.id} 
                className="p-5 hover:bg-sand-50 dark:hover:bg-forest-800/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-bold text-forest-900 dark:text-sand-50 font-mono tracking-tight">{freq.frequency}</h4>
                      {freq.isEmergency && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700">
                          <Star className="h-3.5 w-3.5 text-red-600 dark:text-red-400" aria-label="Emergency frequency" />
                          <span className="text-xs font-medium text-red-700 dark:text-red-400">Emergency</span>
                        </div>
                      )}
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getCategoryColor(freq.location, HAM_LOCATION_COLORS)}`}>
                        {freq.location}
                      </span>
                    </div>
                    
                    <p className="text-sm text-sand-600 dark:text-sand-400 mb-3">{freq.description}</p>
                    
                    {freq.notes && (
                      <div className="flex items-start gap-2 text-sm">
                        <div className="p-1.5 rounded-lg bg-sand-100 dark:bg-forest-800">
                          <MapPin className="h-3.5 w-3.5 text-sand-500 dark:text-sand-400" aria-hidden="true" />
                        </div>
                        <span className="text-sand-600 dark:text-sand-300 pt-1">{freq.notes}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingFrequency(freq)}
                      className="p-2.5 rounded-xl text-sand-400 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-sand-100 dark:hover:bg-forest-800 transition-all focus:outline-none focus:ring-2 focus:ring-forest-500"
                      aria-label={`Edit ${freq.frequency}`}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(freq.id)}
                      className="p-2.5 rounded-xl text-sand-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete ${freq.frequency}`}
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
      {(showAddModal || editingFrequency) && (
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
                {editingFrequency ? 'Edit Frequency' : 'Add Frequency'}
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
                <label htmlFor="frequency" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Frequency *
                </label>
                <input
                  id="frequency"
                  type="text"
                  value={currentFrequency.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  placeholder="e.g., 146.520 MHz"
                  className={`input-field font-mono ${errors.frequency ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={!!errors.frequency}
                  aria-describedby={errors.frequency ? 'frequency-error' : undefined}
                />
                {errors.frequency && (
                  <p id="frequency-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.frequency}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Description *
                </label>
                <input
                  id="description"
                  type="text"
                  value={currentFrequency.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="e.g., Local repeater, Emergency frequency"
                  className={`input-field ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                />
                {errors.description && (
                  <p id="description-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Type *
                </label>
                <select
                  id="location"
                  value={currentFrequency.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`select-field ${errors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? 'location-error' : undefined}
                >
                  <option value="">Select type</option>
                  {HAM_LOCATION_TYPES.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {errors.location && (
                  <p id="location-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={currentFrequency.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Additional notes about this frequency"
                  className="input-field resize-none"
                />
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <input
                  type="checkbox"
                  id="isEmergency"
                  checked={currentFrequency.isEmergency}
                  onChange={(e) => handleInputChange('isEmergency', e.target.checked)}
                  className="h-5 w-5 text-red-600 focus:ring-red-500 border-red-300 dark:border-red-700 rounded"
                />
                <label htmlFor="isEmergency" className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300">
                  <Star className="h-4 w-4" />
                  Mark as emergency frequency
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
                  {editingFrequency ? 'Update' : 'Add'} Frequency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Frequency"
        message="Are you sure you want to delete this frequency? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
      />
    </div>
  )
}
