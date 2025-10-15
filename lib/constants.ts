/**
 * Application Constants
 * Centralized location for all constant values used throughout the application
 */

// Pantry Categories
export const PANTRY_CATEGORIES = [
  'Canned Goods',
  'Grains & Pasta',
  'Beverages',
  'Snacks',
  'Condiments',
  'Baking Supplies',
  'Frozen Foods',
  'Other'
] as const

export type PantryCategory = typeof PANTRY_CATEGORIES[number]

// Contact Relationships
export const CONTACT_RELATIONSHIPS = [
  'Emergency Services',
  'Medical',
  'Neighbor',
  'Work',
  'Insurance',
  'Utilities',
  'Family',
  'Friend',
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Doctor',
  'Lawyer',
  'Insurance Agent',
  'Work Contact',
  'Other'
] as const

export type ContactRelationship = typeof CONTACT_RELATIONSHIPS[number]

// Book Categories
export const BOOK_CATEGORIES = [
  'Medical',
  'Survival',
  'Food Storage',
  'Preparedness',
  'Homesteading',
  'Navigation',
  'Self-Defense',
  'Communication',
  'Other'
] as const

export type BookCategory = typeof BOOK_CATEGORIES[number]

// Document Categories
export const DOCUMENT_CATEGORIES = [
  'Personal ID',
  'Financial',
  'Medical',
  'Insurance',
  'Legal',
  'Property',
  'Education',
  'Other'
] as const

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number]

// HAM Radio Location Types
export const HAM_LOCATION_TYPES = [
  'Emergency Communications',
  'Local Repeater',
  'Long Distance',
  'Weather',
  'Other'
] as const

export type HamLocationType = typeof HAM_LOCATION_TYPES[number]

// Metrics Settings Options
export const VOLUME_UNITS = ['gallons', 'liters', 'quarts'] as const
export const WEIGHT_UNITS = ['pounds', 'kilograms', 'ounces'] as const
export const TEMPERATURE_UNITS = ['fahrenheit', 'celsius'] as const
export const DISTANCE_UNITS = ['miles', 'kilometers', 'feet'] as const

// Color Mappings
export const PANTRY_CATEGORY_COLORS: Record<string, string> = {
  'Canned Goods': 'bg-orange-100 text-orange-800 border-orange-200',
  'Grains & Pasta': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Beverages': 'bg-blue-100 text-blue-800 border-blue-200',
  'Snacks': 'bg-purple-100 text-purple-800 border-purple-200',
  'Condiments': 'bg-green-100 text-green-800 border-green-200',
  'Baking Supplies': 'bg-pink-100 text-pink-800 border-pink-200',
  'Frozen Foods': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Other': 'bg-gray-100 text-gray-800 border-gray-200'
}

export const CONTACT_RELATIONSHIP_COLORS: Record<string, string> = {
  'Emergency Services': 'bg-red-100 text-red-800 border-red-200',
  'Medical': 'bg-blue-100 text-blue-800 border-blue-200',
  'Neighbor': 'bg-green-100 text-green-800 border-green-200',
  'Work': 'bg-purple-100 text-purple-800 border-purple-200',
  'Insurance': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Utilities': 'bg-orange-100 text-orange-800 border-orange-200',
  'Family': 'bg-pink-100 text-pink-800 border-pink-200',
  'Friend': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
}

export const BOOK_CATEGORY_COLORS: Record<string, string> = {
  'Medical': 'bg-red-100 text-red-800 border-red-200',
  'Survival': 'bg-orange-100 text-orange-800 border-orange-200',
  'Food Storage': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Preparedness': 'bg-green-100 text-green-800 border-green-200',
  'Homesteading': 'bg-blue-100 text-blue-800 border-blue-200',
  'Navigation': 'bg-purple-100 text-purple-800 border-purple-200',
  'Self-Defense': 'bg-pink-100 text-pink-800 border-pink-200',
  'Communication': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Other': 'bg-gray-100 text-gray-800 border-gray-200'
}

export const DOCUMENT_CATEGORY_COLORS: Record<string, string> = {
  'Personal ID': 'bg-blue-100 text-blue-800 border-blue-200',
  'Financial': 'bg-green-100 text-green-800 border-green-200',
  'Medical': 'bg-red-100 text-red-800 border-red-200',
  'Insurance': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Legal': 'bg-purple-100 text-purple-800 border-purple-200',
  'Property': 'bg-orange-100 text-orange-800 border-orange-200',
  'Education': 'bg-pink-100 text-pink-800 border-pink-200',
  'Other': 'bg-gray-100 text-gray-800 border-gray-200'
}

export const HAM_LOCATION_COLORS: Record<string, string> = {
  'Emergency Communications': 'bg-red-100 text-red-800 border-red-200',
  'Local Repeater': 'bg-blue-100 text-blue-800 border-blue-200',
  'Long Distance': 'bg-green-100 text-green-800 border-green-200',
  'Weather': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Other': 'bg-gray-100 text-gray-800 border-gray-200'
}

// Storage Keys
export const STORAGE_KEYS = {
  FAMILY_INFO: 'familyInfo',
  CHECKLIST_ITEMS: 'checklistItems',
  METRICS_SETTINGS: 'metricsSettings',
  PANTRY_ITEMS: 'pantryItems',
  BOOKS: 'books',
  EMERGENCY_CONTACTS: 'emergencyContacts',
  HAM_FREQUENCIES: 'frequencies',
  DOCUMENTS: 'documents',
  THEME: 'theme'
} as const

// Expiry Status Thresholds
export const EXPIRY_THRESHOLDS = {
  EXPIRED: 0,
  EXPIRING_SOON: 7,
  WARNING: 30
} as const

// App Configuration
export const APP_CONFIG = {
  VERSION: '1.1.0',
  APP_NAME: 'Emergency Preparedness Checklist',
  APP_DESCRIPTION: 'Stay 10 steps ahead of the rest!',
  LOCAL_STORAGE_WARNING_THRESHOLD: 4.5 * 1024 * 1024, // 4.5MB warning (5MB limit)
  BACKUP_REMINDER_DAYS: 30
} as const

// Default Family Info
export const DEFAULT_FAMILY_INFO = {
  adults: 2,
  children: 0,
  pets: 0,
  specialNeeds: '',
  location: '',
  emergencyPlan: ''
} as const

// Default Metrics Settings
export const DEFAULT_METRICS_SETTINGS = {
  volume: 'gallons',
  weight: 'pounds',
  temperature: 'fahrenheit',
  distance: 'miles'
} as const
