/**
 * PantryManager Component
 * Manages pantry items with expiry tracking and low stock alerts
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, AlertTriangle, Package, Trash2, Edit, Search, X, Calendar, Scale } from 'lucide-react'
import { PantryItem, MetricsSettings } from '@/types'
import { usePantryItems } from '@/hooks/usePantryItems'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { 
  PANTRY_CATEGORIES, 
  PANTRY_CATEGORY_COLORS 
} from '@/lib/constants'
import { getExpiryStatus, getCategoryColor, formatDate, matchesSearch } from '@/lib/utils'
import { pantryItemSchema, validateForm } from '@/lib/validations'

interface PantryManagerProps {
  metricsSettings: MetricsSettings
}

const EMPTY_ITEM: Omit<PantryItem, 'id'> = {
  name: '',
  category: '',
  quantity: 1,
  unit: 'units',
  expiryDate: '',
  minQuantity: 1,
  notes: ''
}

export default function PantryManager({ metricsSettings }: PantryManagerProps) {
  const { 
    items: pantryItems, 
    addItem, 
    updateItem, 
    deleteItem,
    lowStockItems,
    expiringItems 
  } = usePantryItems()
  
  const { showToast } = useToast()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null)
  const [newItem, setNewItem] = useState<Omit<PantryItem, 'id'>>(EMPTY_ITEM)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter items based on search
  const filteredItems = useMemo(() => {
    return pantryItems.filter(item => matchesSearch(searchTerm, [item.name, item.category, item.notes, item.unit]))
  }, [pantryItems, searchTerm])

  // Get units based on category. Always keep the current unit so edits stay valid
  // when the preferred volume/weight setting changes.
  const getUnitsForCategory = useCallback((category: string, currentUnit?: string) => {
    let options: string[]
    if (category === 'Beverages') {
      options = [metricsSettings.volume, 'bottles', 'cans', 'units']
    } else if (category === 'Baking Supplies') {
      options = [metricsSettings.weight, 'cups', 'tablespoons', 'teaspoons', 'units']
    } else {
      options = ['units', 'cans', 'boxes', 'bags', 'bottles', 'jars', metricsSettings.weight, 'ounces', 'grams']
    }
    if (currentUnit && !options.includes(currentUnit)) {
      options = [currentUnit, ...options]
    }
    return Array.from(new Set(options))
  }, [metricsSettings])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = editingItem || newItem
    const validation = validateForm(pantryItemSchema, formData)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      showToast('error', 'Please fix the form errors')
      return
    }
    
    setErrors({})
    
    if (editingItem) {
      updateItem(editingItem.id, editingItem)
      showToast('success', `${editingItem.name} updated successfully`)
      setEditingItem(null)
    } else {
      addItem(newItem)
      showToast('success', `${newItem.name} added to pantry`)
      setNewItem(EMPTY_ITEM)
      setShowAddModal(false)
    }
  }, [editingItem, newItem, addItem, updateItem, showToast])

  // Handle delete confirmation
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, itemId: id })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.itemId) {
      const item = pantryItems.find(i => i.id === deleteConfirm.itemId)
      deleteItem(deleteConfirm.itemId)
      showToast('success', `${item?.name || 'Item'} deleted`)
    }
    setDeleteConfirm({ isOpen: false, itemId: null })
  }, [deleteConfirm.itemId, pantryItems, deleteItem, showToast])

  // Handle input changes
  const handleInputChange = useCallback((field: keyof Omit<PantryItem, 'id'>, value: string | number) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value })
    } else {
      setNewItem(prev => ({ ...prev, [field]: value }))
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }, [editingItem, errors])

  const closeModal = useCallback(() => {
    setShowAddModal(false)
    setEditingItem(null)
    setErrors({})
    setNewItem(EMPTY_ITEM)
  }, [])

  useEscapeKey(showAddModal || editingItem !== null, closeModal)

  const currentItem = editingItem || newItem

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-stretch justify-between gap-3 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 dark:text-sand-50 mb-2">
            Pantry Management
          </h2>
          <p className="text-sand-600 dark:text-sand-400">
            Track your emergency food supplies and get alerts for expiring items and low stock.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary w-full sm:w-auto"
          aria-label="Add new pantry item"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" aria-hidden="true" />
          <input
            id="pantry-search"
            name="pantry-search"
            type="text"
            placeholder="Search pantry items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12 pr-12"
            aria-label="Search pantry items"
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

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {expiringItems.length > 0 && (
          <div className="alert-box danger" role="alert">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-red-800 dark:text-red-300">Expiring Items</h3>
            </div>
            <p className="text-sm text-red-700 dark:text-red-400 ml-12">
              {expiringItems.length} item(s) are expiring soon or have expired.
            </p>
          </div>
        )}
        
        {lowStockItems.length > 0 && (
          <div className="alert-box warning" role="alert">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-amber-800 dark:text-amber-300">Low Stock Alert</h3>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-400 ml-12">
              {lowStockItems.length} item(s) are running low on stock.
            </p>
          </div>
        )}
      </div>

      {/* Pantry Items List */}
      <div className="tactical-card overflow-hidden">
        <div className="section-header">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-forest-600 dark:text-forest-400" />
            <h3 className="text-lg font-bold text-forest-900 dark:text-sand-50">
              Your Pantry Items
            </h3>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300">
              {filteredItems.length}
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-sand-200 dark:divide-forest-700">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl icon-container mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-forest-400" aria-hidden="true" />
              </div>
              <p className="text-sand-500 dark:text-sand-400 font-medium">
                {searchTerm ? 'No items match your search.' : 'No pantry items added yet.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 text-sm font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                >
                  Add your first item →
                </button>
              )}
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const expiryStatus = getExpiryStatus(item.expiryDate)
              const isLowStock = item.quantity <= item.minQuantity
              
              return (
                <div 
                  key={item.id} 
                  className="p-4 hover:bg-sand-50 dark:hover:bg-forest-800/50 transition-colors animate-fade-in sm:p-5"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h4 className="font-bold text-forest-900 dark:text-sand-50">{item.name}</h4>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getCategoryColor(item.category, PANTRY_CATEGORY_COLORS)}`}>
                          {item.category}
                        </span>
                        {isLowStock && (
                          <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full border border-amber-200 dark:border-amber-700">
                            Low Stock
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-sand-500 dark:text-sand-400">Qty:</span>
                          <span className="font-semibold text-forest-700 dark:text-forest-300">{item.quantity} {item.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sand-500 dark:text-sand-400">Min:</span>
                          <span className="font-medium text-sand-600 dark:text-sand-300">{item.minQuantity} {item.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sand-500 dark:text-sand-400">Expires:</span>
                          <span className={`font-medium ${
                            expiryStatus.status === 'expired' ? 'text-red-600 dark:text-red-400' :
                            expiryStatus.status === 'expiring' ? 'text-amber-600 dark:text-amber-400' :
                            'text-forest-600 dark:text-forest-400'
                          }`}>
                            {formatDate(item.expiryDate)}
                            {expiryStatus.status === 'expired' && ' (Expired)'}
                            {expiryStatus.status === 'expiring' && ` (${expiryStatus.days}d)`}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="col-span-2 md:col-span-1">
                            <span className="text-sand-500 dark:text-sand-400">Notes:</span>
                            <span className="ml-1 text-sand-600 dark:text-sand-300">{item.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="touch-target rounded-xl text-sand-400 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-sand-100 dark:hover:bg-forest-800 transition-all focus:outline-none focus:ring-2 focus:ring-forest-500"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="touch-target rounded-xl text-sand-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete ${item.name}`}
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
      {(showAddModal || editingItem) && (
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
                {editingItem ? 'Edit Item' : 'Add Pantry Item'}
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
                <label htmlFor="name" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Item Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={currentItem.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., Canned Beans"
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
                  value={currentItem.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`select-field ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                >
                  <option value="">Select category</option>
                  {PANTRY_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p id="category-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                    Quantity *
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="0"
                    value={currentItem.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="unit" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                    Unit
                  </label>
                  <select
                    id="unit"
                    value={currentItem.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="select-field"
                  >
                    {getUnitsForCategory(currentItem.category, currentItem.unit).map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Expiry Date *
                </label>
                <input
                  id="expiryDate"
                  type="date"
                  value={currentItem.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className={`input-field ${errors.expiryDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={!!errors.expiryDate}
                  aria-describedby={errors.expiryDate ? 'expiryDate-error' : undefined}
                />
                {errors.expiryDate && (
                  <p id="expiryDate-error" className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.expiryDate}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="minQuantity" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Minimum Stock Level
                </label>
                <input
                  id="minQuantity"
                  type="number"
                  min="0"
                  value={currentItem.minQuantity}
                  onChange={(e) => handleInputChange('minQuantity', parseInt(e.target.value) || 0)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-forest-900 dark:text-sand-100 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={currentItem.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Optional notes about this item"
                />
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
                  className="btn-primary w-full sm:w-auto"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
      />
    </div>
  )
}
