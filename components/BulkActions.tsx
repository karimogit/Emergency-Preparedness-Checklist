/**
 * BulkActions Component
 * Handles bulk operations on selected items
 */

'use client'

import { Trash2, X } from 'lucide-react'

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
    <div className="fixed bottom-3 left-1/2 z-50 flex w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2 flex-wrap items-center justify-between gap-3 rounded-xl border border-sand-200 bg-white p-3 shadow-lg animate-slide-in dark:border-forest-700 dark:bg-forest-900 sm:bottom-4 sm:w-auto sm:flex-nowrap sm:gap-4 sm:p-4">
      <span className="text-sm font-medium text-forest-900 dark:text-sand-50">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          <span>Delete</span>
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-sand-600 px-3 py-2 text-sm text-white transition-colors hover:bg-sand-700 dark:bg-forest-700 dark:hover:bg-forest-600"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  )
}
