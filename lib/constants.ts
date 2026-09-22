/**
 * Application Constants
 * Centralized location for all constant values used throughout the application
 */

import type { 
  PantryCategory, 
  ContactRelationship, 
  BookCategory, 
  DocumentCategory, 
  HamLocationType,
  VolumeUnit,
  WeightUnit,
  TemperatureUnit,
  DistanceUnit,
  FontSize,
  FontFamilyChoice
} from '@/types'

// Pantry Categories
export const PANTRY_CATEGORIES: readonly PantryCategory[] = [
  'Canned Goods',
  'Grains & Pasta',
  'Beverages',
  'Snacks',
  'Condiments',
  'Baking Supplies',
  'Frozen Foods',
  'Other'
] as const

// Contact Relationships
export const CONTACT_RELATIONSHIPS: readonly ContactRelationship[] = [
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

// Book Categories
export const BOOK_CATEGORIES: readonly BookCategory[] = [
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

// Document Categories
export const DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  'Personal ID',
  'Financial',
  'Medical',
  'Insurance',
  'Legal',
  'Property',
  'Education',
  'Other'
] as const

// HAM Radio Location Types
export const HAM_LOCATION_TYPES: readonly HamLocationType[] = [
  'Emergency Communications',
  'Local Repeater',
  'Long Distance',
  'Weather',
  'Other'
] as const

// Metrics Settings Options
export const VOLUME_UNITS: readonly VolumeUnit[] = ['gallons', 'liters', 'quarts'] as const
export const WEIGHT_UNITS: readonly WeightUnit[] = ['pounds', 'kilograms', 'ounces'] as const
export const TEMPERATURE_UNITS: readonly TemperatureUnit[] = ['fahrenheit', 'celsius'] as const
export const DISTANCE_UNITS: readonly DistanceUnit[] = ['miles', 'kilometers', 'feet'] as const

export const FONT_SIZES: readonly FontSize[] = ['sm', 'md', 'lg', 'xl'] as const
export const FONT_SIZE_LABELS: Record<FontSize, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
}
export const FONT_FAMILIES: readonly FontFamilyChoice[] = ['sans', 'serif'] as const
export const FONT_FAMILY_LABELS: Record<FontFamilyChoice, string> = {
  sans: 'Outfit (Sans)',
  serif: 'Source Serif (Serif)',
}

// Color Mappings
export const PANTRY_CATEGORY_COLORS: Record<PantryCategory | 'default', string> = {
  'Canned Goods': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700',
  'Grains & Pasta': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700',
  'Beverages': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
  'Snacks': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700',
  'Condiments': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
  'Baking Supplies': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-700',
  'Frozen Foods': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-700',
  'Other': 'bg-sand-100 dark:bg-forest-800 text-sand-700 dark:text-sand-200 border-sand-200 dark:border-forest-600',
  'default': 'bg-sand-100 dark:bg-forest-800 text-sand-700 dark:text-sand-200 border-sand-200 dark:border-forest-600'
}

export const CONTACT_RELATIONSHIP_COLORS: Record<string, string> = {
  'Emergency Services': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700',
  'Medical': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
  'Neighbor': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
  'Work': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700',
  'Insurance': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700',
  'Utilities': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700',
  'Family': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-700',
  'Friend': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-700',
  'default': 'bg-sand-100 dark:bg-forest-800 text-sand-700 dark:text-sand-200 border-sand-200 dark:border-forest-600'
}

export const BOOK_CATEGORY_COLORS: Record<string, string> = {
  'Medical': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700',
  'Survival': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700',
  'Food Storage': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700',
  'Preparedness': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
  'Homesteading': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
  'Navigation': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700',
  'Self-Defense': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-700',
  'Communication': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-700',
  'Other': 'bg-sand-100 dark:bg-forest-800 text-sand-700 dark:text-sand-200 border-sand-200 dark:border-forest-600',
  'default': 'bg-sand-100 dark:bg-forest-800 text-sand-700 dark:text-sand-200 border-sand-200 dark:border-forest-600'
}

export const DOCUMENT_CATEGORY_COLORS: Record<string, string> = {
  'Personal ID': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
  'Financial': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
  'Medical': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700',
  'Insurance': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700',
  'Legal': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700',
  'Property': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700',
  'Education': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-700',
  'Other': 'bg-sand-100 dark:bg-forest-800 text-sand-700 dark:text-sand-200 border-sand-200 dark:border-forest-600',
  'default': 'bg-sand-100 dark:bg-forest-800 text-sand-700 dark:text-sand-200 border-sand-200 dark:border-forest-600'
}

export const HAM_LOCATION_COLORS: Record<string, string> = {
  'Emergency Communications': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700',
  'Local Repeater': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
  'Long Distance': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
  'Weather': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700',
  'Other': 'bg-sand-100 dark:bg-forest-800 text-sand-700 dark:text-sand-200 border-sand-200 dark:border-forest-600',
  'default': 'bg-sand-100 dark:bg-forest-800 text-sand-700 dark:text-sand-200 border-sand-200 dark:border-forest-600'
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
  THEME: 'theme',
  DISPLAY_SETTINGS: 'displaySettings',
  SIDEBAR_OPEN: 'sidebarOpen',
} as const

// Expiry Status Thresholds
export const EXPIRY_THRESHOLDS = {
  EXPIRED: 0,
  EXPIRING_SOON: 7,
  WARNING: 30
} as const

// App Configuration
export const APP_CONFIG = {
  VERSION: '1.2.0',
  APP_NAME: 'Emergency Preparedness Checklist',
  APP_DESCRIPTION: 'Stay 10 steps ahead of the rest!',
  LOCAL_STORAGE_WARNING_THRESHOLD: 4.5 * 1024 * 1024, // 4.5MB warning (5MB limit)
  BACKUP_REMINDER_DAYS: 30
} as const
