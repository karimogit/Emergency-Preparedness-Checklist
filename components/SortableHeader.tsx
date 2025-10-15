/**
 * SortableHeader Component
 * Reusable header component with sorting functionality
 */

'use client'

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc' | null
}

interface SortableHeaderProps {
  label: string
  sortKey: string
  currentSort: SortConfig
  onSort: (key: string) => void
  className?: string
}

export default function SortableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  className = ''
}: SortableHeaderProps) {
  const isSorted = currentSort.key === sortKey
  const direction = isSorted ? currentSort.direction : null

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center space-x-1 hover:text-brown-600 dark:hover:text-brown-400 transition-colors ${className}`}
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      {direction === 'asc' && <ChevronUp className="h-4 w-4" />}
      {direction === 'desc' && <ChevronDown className="h-4 w-4" />}
      {direction === null && <ChevronsUpDown className="h-4 w-4 opacity-50" />}
    </button>
  )
}
