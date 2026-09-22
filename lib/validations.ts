/**
 * Validation Schemas
 * Zod schemas for form validation throughout the application
 */

import { z } from 'zod'
import { 
  PANTRY_CATEGORIES, 
  CONTACT_RELATIONSHIPS, 
  BOOK_CATEGORIES, 
  DOCUMENT_CATEGORIES, 
  HAM_LOCATION_TYPES 
} from './constants'
import type { ExportData } from '@/types'

// Common validations
const requiredString = z.string().min(1, 'This field is required')
const optionalString = z.string().optional().default('')
const positiveNumber = z.number().min(0, 'Must be 0 or greater')

// Pantry Item Schema
export const pantryItemSchema = z.object({
  name: requiredString.max(100, 'Name must be 100 characters or less'),
  category: z.enum(PANTRY_CATEGORIES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a category' })
  }),
  quantity: positiveNumber,
  unit: requiredString,
  expiryDate: requiredString.refine((date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  }, 'Please enter a valid date'),
  minQuantity: positiveNumber,
  notes: optionalString.or(z.string())
})

export type PantryItemFormData = z.infer<typeof pantryItemSchema>

// Book Schema
export const bookSchema = z.object({
  title: requiredString.max(200, 'Title must be 200 characters or less'),
  author: requiredString.max(100, 'Author must be 100 characters or less'),
  category: z.enum(BOOK_CATEGORIES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a category' })
  }),
  location: optionalString.or(z.string()),
  notes: optionalString.or(z.string()),
  isEssential: z.boolean().default(false)
})

export type BookFormData = z.infer<typeof bookSchema>

// Emergency Contact Schema
export const contactSchema = z.object({
  name: requiredString.max(100, 'Name must be 100 characters or less'),
  relationship: z.enum(CONTACT_RELATIONSHIPS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a relationship' })
  }),
  phone: requiredString.regex(
    /^[\d\s\-\+\(\)]+$/,
    'Please enter a valid phone number'
  ),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  address: optionalString.or(z.string()),
  notes: optionalString.or(z.string()),
  isEmergencyContact: z.boolean().default(false)
})

export type ContactFormData = z.infer<typeof contactSchema>

// HAM Frequency Schema
export const hamFrequencySchema = z.object({
  frequency: requiredString.regex(
    /^[\d.]+\s*(MHz|kHz|GHz)?$/i,
    'Please enter a valid frequency (e.g., 146.520 MHz)'
  ),
  description: requiredString.max(200, 'Description must be 200 characters or less'),
  location: z.enum(HAM_LOCATION_TYPES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a location type' })
  }),
  notes: optionalString.or(z.string()),
  isEmergency: z.boolean().default(false)
})

export type HamFrequencyFormData = z.infer<typeof hamFrequencySchema>

// Document Schema
export const documentSchema = z.object({
  name: requiredString.max(100, 'Name must be 100 characters or less'),
  category: z.enum(DOCUMENT_CATEGORIES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a category' })
  }),
  location: requiredString.max(100, 'Location must be 100 characters or less'),
  expiryDate: z.string().optional().refine((date) => {
    if (!date) return true
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  }, 'Please enter a valid date'),
  isDigital: z.boolean().default(false),
  notes: optionalString.or(z.string()),
  isEssential: z.boolean().default(false)
})

export type DocumentFormData = z.infer<typeof documentSchema>

// Family Info Schema
export const familyInfoSchema = z.object({
  adults: z.number().min(0).max(20, 'Maximum 20 adults'),
  children: z.number().min(0).max(20, 'Maximum 20 children'),
  pets: z.number().min(0).max(20, 'Maximum 20 pets'),
  specialNeeds: optionalString.or(z.string()),
  location: optionalString.or(z.string()),
  emergencyPlan: optionalString.or(z.string())
})

export type FamilyInfoFormData = z.infer<typeof familyInfoSchema>

// Validation helper
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean
  data?: T
  errors?: Record<string, string>
} {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: Record<string, string> = {}
  result.error.issues.forEach(issue => {
    const path = issue.path.join('.')
    errors[path] = issue.message
  })
  
  return { success: false, errors }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Validate a backup file before it replaces local data.
 */
export function parseBackup(value: unknown): { success: true; data: ExportData } | { success: false; error: string } {
  if (!isRecord(value)) {
    return { success: false, error: 'Backup file must be a JSON object.' }
  }
  if (!isRecord(value.familyInfo)) {
    return { success: false, error: 'Backup is missing family information.' }
  }
  if (!Array.isArray(value.checklistItems)) {
    return { success: false, error: 'Backup is missing the checklist.' }
  }

  const adults = Number(value.familyInfo.adults)
  const children = Number(value.familyInfo.children)
  const pets = Number(value.familyInfo.pets)
  if (![adults, children, pets].every(count => Number.isFinite(count) && count >= 0 && count <= 100)) {
    return { success: false, error: 'Family counts in this backup are not valid.' }
  }

  for (const category of value.checklistItems) {
    if (!isRecord(category) || typeof category.category !== 'string' || !Array.isArray(category.items)) {
      return { success: false, error: 'Checklist categories in this backup are not valid.' }
    }
  }

  const listFields = ['pantryItems', 'books', 'contacts', 'frequencies', 'documents'] as const
  for (const field of listFields) {
    if (value[field] !== undefined && !Array.isArray(value[field])) {
      return { success: false, error: `The ${field} section must be a list.` }
    }
  }

  return { success: true, data: value as unknown as ExportData }
}
