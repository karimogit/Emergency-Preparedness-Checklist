/**
 * Type Definitions
 * Centralized TypeScript type definitions for the application
 */

// Unit Types
export type VolumeUnit = 'gallons' | 'liters' | 'quarts'
export type WeightUnit = 'pounds' | 'kilograms' | 'ounces'
export type TemperatureUnit = 'fahrenheit' | 'celsius'
export type DistanceUnit = 'miles' | 'kilometers' | 'feet'

// Category Types
export type PantryCategory = 
  | 'Canned Goods'
  | 'Grains & Pasta'
  | 'Beverages'
  | 'Snacks'
  | 'Condiments'
  | 'Baking Supplies'
  | 'Frozen Foods'
  | 'Other'

export type ContactRelationship =
  | 'Emergency Services'
  | 'Medical'
  | 'Neighbor'
  | 'Work'
  | 'Insurance'
  | 'Utilities'
  | 'Family'
  | 'Friend'
  | 'Spouse'
  | 'Parent'
  | 'Child'
  | 'Sibling'
  | 'Doctor'
  | 'Lawyer'
  | 'Insurance Agent'
  | 'Work Contact'
  | 'Other'

export type BookCategory =
  | 'Medical'
  | 'Survival'
  | 'Food Storage'
  | 'Preparedness'
  | 'Homesteading'
  | 'Navigation'
  | 'Self-Defense'
  | 'Communication'
  | 'Other'

export type DocumentCategory =
  | 'Personal ID'
  | 'Financial'
  | 'Medical'
  | 'Insurance'
  | 'Legal'
  | 'Property'
  | 'Education'
  | 'Other'

export type HamLocationType =
  | 'Emergency Communications'
  | 'Local Repeater'
  | 'Long Distance'
  | 'Weather'
  | 'Other'

// Metrics Settings
export interface MetricsSettings {
  volume: VolumeUnit
  weight: WeightUnit
  temperature: TemperatureUnit
  distance: DistanceUnit
}

// Family Info
export interface FamilyInfo {
  adults: number
  children: number
  pets: number
  specialNeeds: string
  location: string
  emergencyPlan: string
}

// Checklist Types
export interface ChecklistSubItem {
  id: string
  text: string
  completed: boolean
  quantity: number
}

export interface ChecklistItem {
  id: number
  category: string
  items: ChecklistSubItem[]
}

// Pantry Item
export interface PantryItem {
  id: string
  name: string
  category: PantryCategory | string
  quantity: number
  unit: string
  expiryDate: string
  minQuantity: number
  notes: string
}

// Book
export interface Book {
  id: string
  title: string
  author: string
  category: BookCategory | string
  location: string
  notes: string
  isEssential: boolean
}

// Emergency Contact
export interface EmergencyContact {
  id: string
  name: string
  relationship: ContactRelationship | string
  phone: string
  email: string
  address: string
  isEmergencyContact: boolean
  notes: string
}

// HAM Radio Frequency
export interface HamFrequency {
  id: string
  frequency: string
  description: string
  location: HamLocationType | string
  notes: string
  isEmergency: boolean
}

// Document
export interface Document {
  id: string
  name: string
  category: DocumentCategory | string
  location: string
  expiryDate?: string
  isDigital: boolean
  notes: string
  isEssential: boolean
}

// Theme
export type Theme = 'light' | 'dark' | 'system'

// Display Settings
export type FontSize = 'sm' | 'md' | 'lg' | 'xl'
export type FontFamilyChoice = 'sans' | 'serif'

export interface DisplaySettings {
  fontSize: FontSize
  fontFamily: FontFamilyChoice
}

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

// Export Data Structure
export interface ExportData {
  familyInfo: FamilyInfo
  checklistItems: ChecklistItem[]
  pantryItems: PantryItem[]
  books: Book[]
  contacts: EmergencyContact[]
  frequencies: HamFrequency[]
  documents: Document[]
  metricsSettings: MetricsSettings
  exportDate: string
  appVersion: string
}
