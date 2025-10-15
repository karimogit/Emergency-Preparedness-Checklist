/**
 * BulkActions Component
 * Handles bulk operations on selected items
 */

'use client'

import { Trash2, Check, X } from 'lucide-react'
import { useState } from 'react'

interface BulkActionsProps {
  selectedCount: number
  onDelete: () => void
  onCancel: () => void
}

export default function BulkActions({
  selectedCount,
  onDelete,
  onCancel
}: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-4 z-50 animate-slide-in">
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onDelete}
          className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
        
        <button
          onClick={onCancel}
          className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  )
}
