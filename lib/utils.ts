/**
 * Utility Functions
 * Reusable helper functions used throughout the application
 */

import { EXPIRY_THRESHOLDS } from './constants'
import type { VolumeUnit } from '@/types'

/**
 * Parse a calendar date without shifting it across timezones.
 * Date-only strings such as "2026-06-15" are treated as local dates.
 */
export function parseDateOnly(dateString: string): Date | null {
  if (!dateString || !dateString.trim()) return null

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateString.trim())
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const date = new Date(year, month - 1, day)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null
    }
    return date
  }

  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  try {
    const date = parseDateOnly(dateString)
    if (!date) {
      return dateString ? 'Invalid date' : 'No date'
    }
    
    if (format === 'long') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

/**
 * Calculate days until expiry. Returns null when the date cannot be parsed.
 */
export function getDaysUntilExpiry(expiryDate: string): number | null {
  const expiry = parseDateOnly(expiryDate)
  if (!expiry) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  expiry.setHours(0, 0, 0, 0)
  return Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Get expiry status for an item
 */
export interface ExpiryStatus {
  status: 'expired' | 'expiring' | 'warning' | 'good' | 'unknown'
  days: number
  color: string
}

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const days = getDaysUntilExpiry(expiryDate)

  if (days === null) {
    return { status: 'unknown', days: 0, color: 'text-sand-500 dark:text-sand-400' }
  }
  
  if (days < EXPIRY_THRESHOLDS.EXPIRED) {
    return { status: 'expired', days: Math.abs(days), color: 'text-red-600 dark:text-red-400' }
  }
  if (days <= EXPIRY_THRESHOLDS.EXPIRING_SOON) {
    return { status: 'expiring', days, color: 'text-orange-600 dark:text-orange-400' }
  }
  if (days <= EXPIRY_THRESHOLDS.WARNING) {
    return { status: 'warning', days, color: 'text-yellow-600 dark:text-yellow-400' }
  }
  return { status: 'good', days, color: 'text-green-600 dark:text-green-400' }
}

export interface SupplyTargets {
  people: number
  pets: number
  days: number
  waterGallons: number
  waterLiters: number
  waterQuarts: number
}

/**
 * FEMA 72-hour planning targets.
 * Water is 1 gallon per person per day. Pet water is estimated at 0.5 gallon per pet per day.
 */
export function getSupplyTargets(
  family: { adults: number; children: number; pets: number },
  days = 3
): SupplyTargets {
  const people = Math.max(0, family.adults) + Math.max(0, family.children)
  const pets = Math.max(0, family.pets)
  const waterGallons = roundQuantity(people * days + pets * days * 0.5)

  return {
    people,
    pets,
    days,
    waterGallons,
    waterLiters: roundQuantity(waterGallons * 3.785411784),
    waterQuarts: roundQuantity(waterGallons * 4),
  }
}

export function formatSupplyWater(targets: SupplyTargets, unit: VolumeUnit): string {
  if (unit === 'liters') return `${targets.waterLiters} liters`
  if (unit === 'quarts') return `${targets.waterQuarts} quarts`
  return `${targets.waterGallons} gallons`
}

function roundQuantity(value: number): number {
  return Math.round(value * 10) / 10
}

/**
 * Case-insensitive search that tolerates missing fields.
 */
export function matchesSearch(term: string, values: unknown[]): boolean {
  const query = term.trim().toLowerCase()
  if (!query) return true
  return values.some(value => String(value ?? '').toLowerCase().includes(query))
}

/**
 * Escape text for insertion into HTML.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Escape a value for a CSV cell, including spreadsheet formula injection.
 */
export function escapeCsv(value: unknown): string {
  const raw = String(value ?? '')
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw
  return `"${safe.replace(/"/g, '""')}"`
}

export function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return fallback
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Safely parse JSON with fallback
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return fallback
  }
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Check localStorage available space
 */
export function getLocalStorageSize(): number {
  let total = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return total
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Convert metric units
 */
export function convertWaterText(text: string, toUnit: string): string {
  if (text.includes('gallon') && toUnit !== 'gallons') {
    if (toUnit === 'liters') {
      return text.replace(/gallon/g, 'liter')
    } else if (toUnit === 'quarts') {
      return text.replace(/gallon/g, 'quart')
    }
  }
  return text
}

/**
 * Get category color with fallback
 */
export function getCategoryColor(category: string, colorMap: Record<string, string>): string {
  return colorMap[category] || colorMap['default'] || colorMap['Other'] || 'bg-sand-100 dark:bg-forest-800 text-sand-700 dark:text-sand-200 border-sand-200 dark:border-forest-600'
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone format (flexible)
 */
export function isValidPhone(phone: string): boolean {
  // Allow various phone formats including international
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 3
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

/**
 * Export data to file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Sort array by property
 */
export function sortByProperty<T>(
  array: T[],
  property: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[property]
    const bVal = b[property]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Filter array by search term
 */
export function filterBySearch<T>(
  array: T[],
  searchTerm: string,
  properties: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return array
  
  const lowerSearch = searchTerm.toLowerCase()
  
  return array.filter(item =>
    properties.some(prop => {
      const value = item[prop]
      return String(value).toLowerCase().includes(lowerSearch)
    })
  )
}

/**
 * Group array by property
 */
export function groupBy<T>(array: T[], property: keyof T): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const key = String(item[property])
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Get contrasting text color for background
 */
export function getContrastColor(hexColor: string): 'light' | 'dark' {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? 'dark' : 'light'
}

/**
 * Pluralize word based on count
 */
export function pluralize(word: string, count: number, suffix = 's'): string {
  return count === 1 ? word : word + suffix
}
