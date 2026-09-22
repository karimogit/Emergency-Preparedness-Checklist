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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            HAM Radio Frequencies
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Store important HAM radio frequencies for emergency communication.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Add new frequency"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Frequency</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <input
            id="frequencies-search"
            name="frequencies-search"
            type="text"
            placeholder="Search frequencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            aria-label="Search frequencies"
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

      {/* Frequencies List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-brown-50 to-brown-100 dark:from-brown-900/30 dark:to-brown-800/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Frequencies ({filteredFrequencies.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredFrequencies.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <Radio className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" aria-hidden="true" />
              <p>{searchTerm ? 'No frequencies match your search.' : 'No frequencies added yet. Add your first frequency to get started!'}</p>
            </div>
          ) : (
            filteredFrequencies.map((freq) => (
              <div key={freq.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white font-mono">{freq.frequency}</h4>
                      {freq.isEmergency && (
                        <Star className="h-4 w-4 text-brown-500 dark:text-brown-400 flex-shrink-0" aria-label="Emergency frequency" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{freq.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                        <span className="font-medium">Type:</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getCategoryColor(freq.location, HAM_LOCATION_COLORS)}`}>
                          {freq.location}
                        </span>
                      </div>
                      {freq.notes && (
                        <div>
                          <span className="font-medium">Notes:</span>
                          <span className="ml-1">{freq.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingFrequency(freq)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 rounded"
                      aria-label={`Edit ${freq.frequency}`}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(freq.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingFrequency ? 'Edit Frequency' : 'Add Frequency'}
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
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frequency *
                </label>
                <input
                  id="frequency"
                  type="text"
                  value={currentFrequency.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  placeholder="e.g., 146.520 MHz"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.frequency ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.frequency}
                  aria-describedby={errors.frequency ? 'frequency-error' : undefined}
                />
                {errors.frequency && (
                  <p id="frequency-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.frequency}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <input
                  id="description"
                  type="text"
                  value={currentFrequency.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="e.g., Local repeater, Emergency frequency"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                />
                {errors.description && (
                  <p id="description-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type *
                </label>
                <select
                  id="location"
                  value={currentFrequency.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? 'location-error' : undefined}
                >
                  <option value="">Select type</option>
                  {HAM_LOCATION_TYPES.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {errors.location && (
                  <p id="location-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={currentFrequency.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Additional notes about this frequency"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEmergency"
                  checked={currentFrequency.isEmergency}
                  onChange={(e) => handleInputChange('isEmergency', e.target.checked)}
                  className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="isEmergency" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Mark as emergency frequency
                </label>
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
