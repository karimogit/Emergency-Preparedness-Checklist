/**
 * EmergencyContacts Component
 * Manages emergency contact information
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, Phone, Mail, MapPin, Star, Trash2, Edit, Search, X, Users } from 'lucide-react'
import { EmergencyContact } from '@/types'
import { useContacts } from '@/hooks/useContacts'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { CONTACT_RELATIONSHIPS, CONTACT_RELATIONSHIP_COLORS } from '@/lib/constants'
import { getCategoryColor, matchesSearch } from '@/lib/utils'
import { contactSchema, validateForm } from '@/lib/validations'

const EMPTY_CONTACT: Omit<EmergencyContact, 'id'> = {
  name: '',
  relationship: '',
  phone: '',
  email: '',
  address: '',
  isEmergencyContact: false,
  notes: ''
}

export default function EmergencyContacts() {
  const { 
    contacts, 
    addContact, 
    updateContact, 
    deleteContact 
  } = useContacts()
  
  const { showToast } = useToast()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, 'id'>>(EMPTY_CONTACT)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => matchesSearch(searchTerm, [
      contact.name,
      contact.relationship,
      contact.phone,
      contact.email,
      contact.address,
      contact.notes,
    ]))
  }, [contacts, searchTerm])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = editingContact || newContact
    const validation = validateForm(contactSchema, formData)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      showToast('error', 'Please fix the form errors')
      return
    }
    
    setErrors({})
    
    if (editingContact) {
      updateContact(editingContact.id, editingContact)
      showToast('success', `${editingContact.name} updated successfully`)
      setEditingContact(null)
    } else {
      addContact(newContact)
      showToast('success', `${newContact.name} added to contacts`)
      setNewContact(EMPTY_CONTACT)
      setShowAddModal(false)
    }
  }, [editingContact, newContact, addContact, updateContact, showToast])

  // Handle delete confirmation
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, itemId: id })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.itemId) {
      const contact = contacts.find(c => c.id === deleteConfirm.itemId)
      deleteContact(deleteConfirm.itemId)
      showToast('success', `${contact?.name || 'Contact'} deleted`)
    }
    setDeleteConfirm({ isOpen: false, itemId: null })
  }, [deleteConfirm.itemId, contacts, deleteContact, showToast])

  // Handle input changes
  const handleInputChange = useCallback((field: keyof Omit<EmergencyContact, 'id'>, value: string | boolean) => {
    if (editingContact) {
      setEditingContact({ ...editingContact, [field]: value })
    } else {
      setNewContact(prev => ({ ...prev, [field]: value }))
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }, [editingContact, errors])

  const closeModal = useCallback(() => {
    setShowAddModal(false)
    setEditingContact(null)
    setErrors({})
    setNewContact(EMPTY_CONTACT)
  }, [])

  useEscapeKey(showAddModal || editingContact !== null, closeModal)

  const currentContact = editingContact || newContact

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 dark:text-sand-50 mb-2">
            Emergency Contacts
          </h2>
          <p className="text-sand-600 dark:text-sand-400">
            Keep track of important contacts for emergency situations.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          aria-label="Add new contact"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" aria-hidden="true" />
          <input
            id="contacts-search"
            name="contacts-search"
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12 pr-12"
            aria-label="Search contacts"
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

      {/* Contacts List */}
      <div className="tactical-card overflow-hidden">
        <div className="section-header">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-forest-600 dark:text-forest-400" />
            <h3 className="text-lg font-bold text-forest-900 dark:text-sand-50">
              Your Emergency Contacts
            </h3>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300">
              {filteredContacts.length}
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-sand-200 dark:divide-forest-700">
          {filteredContacts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl icon-container mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8 text-forest-400" aria-hidden="true" />
              </div>
              <p className="text-sand-500 dark:text-sand-400 font-medium">
                {searchTerm ? 'No contacts match your search.' : 'No contacts added yet.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 text-sm font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                >
                  Add your first contact →
                </button>
              )}
            </div>
          ) : (
            filteredContacts.map((contact, index) => (
              <div 
                key={contact.id} 
                className="p-5 hover:bg-sand-50 dark:hover:bg-forest-800/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h4 className="font-bold text-forest-900 dark:text-sand-50">{contact.name}</h4>
                      {contact.isEmergencyContact && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700">
                          <Star className="h-3.5 w-3.5 text-red-600 dark:text-red-400" aria-label="Primary emergency contact" />
                          <span className="text-xs font-medium text-red-700 dark:text-red-400">Primary</span>
                        </div>
                      )}
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getCategoryColor(contact.relationship, CONTACT_RELATIONSHIP_COLORS)}`}>
                        {contact.relationship}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-forest-100 dark:bg-forest-800">
                          <Phone className="h-3.5 w-3.5 text-forest-600 dark:text-forest-400" aria-hidden="true" />
                        </div>
                        <a 
                          href={`tel:${contact.phone}`}
                          className="text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 font-medium transition-colors"
                        >
                          {contact.phone}
                        </a>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-forest-100 dark:bg-forest-800">
                            <Mail className="h-3.5 w-3.5 text-forest-600 dark:text-forest-400" aria-hidden="true" />
                          </div>
                          <a 
                            href={`mailto:${contact.email}`}
                            className="text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 font-medium transition-colors truncate"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.address && (
                        <div className="flex items-start gap-2 md:col-span-2">
                          <div className="p-1.5 rounded-lg bg-sand-100 dark:bg-forest-800">
                            <MapPin className="h-3.5 w-3.5 text-sand-500 dark:text-sand-400" aria-hidden="true" />
                          </div>
                          <span className="text-sand-600 dark:text-sand-400">{contact.address}</span>
                        </div>
                      )}
                      {contact.notes && (
                        <div className="md:col-span-2 pl-8 text-sand-500 dark:text-sand-400 italic">
                          {contact.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingContact(contact)}
                      className="p-2.5 rounded-xl text-sand-400 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-sand-100 dark:hover:bg-forest-800 transition-all focus:outline-none focus:ring-2 focus:ring-forest-500"
                      aria-label={`Edit ${contact.name}`}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(contact.id)}
                      className="p-2.5 rounded-xl text-sand-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete ${contact.name}`}
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
      {(showAddModal || editingContact) && (
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
                {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
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
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={currentContact.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., John Smith"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="relationship" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Relationship *
                </label>
                <select
                  id="relationship"
                  value={currentContact.relationship}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  className={`select-field ${errors.relationship ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={!!errors.relationship}
                  aria-describedby={errors.relationship ? 'relationship-error' : undefined}
                >
                  <option value="">Select relationship</option>
                  {CONTACT_RELATIONSHIPS.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
                {errors.relationship && (
                  <p id="relationship-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.relationship}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={currentContact.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`input-field ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., (555) 123-4567"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={currentContact.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="email@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  value={currentContact.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  placeholder="Full mailing address"
                  className="input-field resize-none"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={currentContact.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={2}
                  placeholder="Any additional notes"
                  className="input-field resize-none"
                />
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <input
                  type="checkbox"
                  id="isEmergencyContact"
                  checked={currentContact.isEmergencyContact}
                  onChange={(e) => handleInputChange('isEmergencyContact', e.target.checked)}
                  className="h-5 w-5 text-red-600 focus:ring-red-500 border-red-300 dark:border-red-700 rounded"
                />
                <label htmlFor="isEmergencyContact" className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300">
                  <Star className="h-4 w-4" />
                  Mark as primary emergency contact
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
                  {editingContact ? 'Update' : 'Add'} Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
      />
    </div>
  )
}
