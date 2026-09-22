/**
 * Default Data
 * Centralized location for all default/prefilled data used throughout the application
 */

import { ChecklistItem, PantryItem, Book, EmergencyContact, HamFrequency, Document, FamilyInfo } from '@/types'

/** Calendar date a number of months from today, used so sample stock is not already expired. */
function monthsFromToday(months: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Default Family Info
 */
export const DEFAULT_FAMILY_INFO: FamilyInfo = {
  adults: 2,
  children: 0,
  pets: 0,
  specialNeeds: '',
  location: '',
  emergencyPlan: ''
}

/**
 * Default Metrics Settings
 */
export const DEFAULT_METRICS_SETTINGS = {
  volume: 'gallons' as const,
  weight: 'pounds' as const,
  temperature: 'fahrenheit' as const,
  distance: 'miles' as const
}

export const DEFAULT_DISPLAY_SETTINGS = {
  fontSize: 'md' as const,
  fontFamily: 'sans' as const,
}

/**
 * Default Checklist Items
 */
export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 1,
    category: 'Water & Hydration',
    items: [
      { id: 'water-1', text: 'Water', completed: false, quantity: 1 },
      { id: 'water-2', text: 'Water filter', completed: false, quantity: 1 },
      { id: 'water-3', text: 'Water purification tablet', completed: false, quantity: 1 },
      { id: 'water-4', text: 'Distilled water', completed: false, quantity: 1 },
      { id: 'water-5', text: 'Water bottle', completed: false, quantity: 1 },
      { id: 'water-6', text: 'Foldable water bottle', completed: false, quantity: 1 },
      { id: 'water-7', text: 'Kettle', completed: false, quantity: 1 },
      { id: 'water-8', text: 'Thermos', completed: false, quantity: 1 },
    ]
  },
  {
    id: 2,
    category: 'Food & Nutrition',
    items: [
      { id: 'food-1', text: 'Salt', completed: false, quantity: 1 },
      { id: 'food-2', text: 'Sugar', completed: false, quantity: 1 },
      { id: 'food-3', text: 'Baby food', completed: false, quantity: 1 },
      { id: 'food-4', text: 'Dry fruits', completed: false, quantity: 1 },
      { id: 'food-5', text: 'Spices', completed: false, quantity: 1 },
      { id: 'food-6', text: 'Baking soda', completed: false, quantity: 1 },
      { id: 'food-7', text: 'Preserves', completed: false, quantity: 1 },
      { id: 'food-8', text: 'Biscuit', completed: false, quantity: 1 },
      { id: 'food-9', text: 'Protein bar', completed: false, quantity: 1 },
      { id: 'food-10', text: 'Mixed nuts', completed: false, quantity: 1 },
      { id: 'food-11', text: 'NRG-5 food ration', completed: false, quantity: 1 },
      { id: 'food-12', text: 'Cooking utensils', completed: false, quantity: 1 },
      { id: 'food-13', text: 'Animal foods', completed: false, quantity: 1 },
    ]
  },
  {
    id: 3,
    category: 'Medical & First Aid',
    items: [
      { id: 'medical-1', text: 'Medical adhesive tape', completed: false, quantity: 1 },
      { id: 'medical-2', text: 'Bandages', completed: false, quantity: 1 },
      { id: 'medical-3', text: 'Eye pads', completed: false, quantity: 1 },
      { id: 'medical-4', text: 'Waterproof band-aid', completed: false, quantity: 1 },
      { id: 'medical-5', text: 'Thermometer', completed: false, quantity: 1 },
      { id: 'medical-6', text: 'Medicine box', completed: false, quantity: 1 },
      { id: 'medical-7', text: 'Safety pin', completed: false, quantity: 1 },
      { id: 'medical-8', text: 'Disinfectant spray', completed: false, quantity: 1 },
      { id: 'medical-9', text: 'Oral thermometer', completed: false, quantity: 1 },
      { id: 'medical-10', text: 'Tweezers', completed: false, quantity: 1 },
      { id: 'medical-11', text: 'Antiseptics', completed: false, quantity: 1 },
      { id: 'medical-12', text: 'Eye drops', completed: false, quantity: 1 },
      { id: 'medical-13', text: 'Aspirin', completed: false, quantity: 1 },
      { id: 'medical-14', text: 'Hot compress', completed: false, quantity: 1 },
      { id: 'medical-15', text: 'Cold compress', completed: false, quantity: 1 },
      { id: 'medical-16', text: 'Burn cream', completed: false, quantity: 1 },
      { id: 'medical-17', text: 'Wrist splint', completed: false, quantity: 1 },
      { id: 'medical-18', text: 'Painkiller', completed: false, quantity: 1 },
      { id: 'medical-19', text: 'Necessary medicines', completed: false, quantity: 1 },
      { id: 'medical-20', text: 'Diarrhea medication', completed: false, quantity: 1 },
      { id: 'medical-21', text: 'Antihistamine tablets', completed: false, quantity: 1 },
      { id: 'medical-22', text: 'Antibiotics', completed: false, quantity: 1 },
      { id: 'medical-23', text: 'CPR Mask', completed: false, quantity: 1 },
      { id: 'medical-24', text: 'Elastic bandage', completed: false, quantity: 1 },
      { id: 'medical-25', text: 'Skin rash cream', completed: false, quantity: 1 },
      { id: 'medical-26', text: 'Tourniquet strap', completed: false, quantity: 1 },
      { id: 'medical-27', text: 'Medical mask', completed: false, quantity: 1 },
      { id: 'medical-28', text: 'Sterile gloves', completed: false, quantity: 1 },
      { id: 'medical-29', text: 'Sterile gauze pads', completed: false, quantity: 1 },
      { id: 'medical-30', text: 'Wound healing creme', completed: false, quantity: 1 },
      { id: 'medical-31', text: 'Vitamins', completed: false, quantity: 1 },
      { id: 'medical-32', text: 'First aid scissors', completed: false, quantity: 1 },
      { id: 'medical-33', text: 'First aid booklet', completed: false, quantity: 1 },
      { id: 'medical-34', text: 'Antiseptic wipes', completed: false, quantity: 1 },
    ]
  },
  {
    id: 4,
    category: 'Tools & Equipment',
    items: [
      { id: 'tools-1', text: 'Duct tape', completed: false, quantity: 1 },
      { id: 'tools-2', text: 'Gas mask', completed: false, quantity: 1 },
      { id: 'tools-3', text: 'Battery', completed: false, quantity: 1 },
      { id: 'tools-4', text: 'Lighter', completed: false, quantity: 1 },
      { id: 'tools-5', text: 'Whistle', completed: false, quantity: 1 },
      { id: 'tools-6', text: 'Firesteel', completed: false, quantity: 1 },
      { id: 'tools-7', text: 'Work gloves', completed: false, quantity: 1 },
      { id: 'tools-8', text: 'Portable pickaxe', completed: false, quantity: 1 },
      { id: 'tools-9', text: 'Razor blade', completed: false, quantity: 1 },
      { id: 'tools-10', text: 'Carabiner clips', completed: false, quantity: 1 },
      { id: 'tools-11', text: 'Pocket knife', completed: false, quantity: 1 },
      { id: 'tools-12', text: 'Watch', completed: false, quantity: 1 },
      { id: 'tools-13', text: 'Fishing gear', completed: false, quantity: 1 },
      { id: 'tools-14', text: 'Pen', completed: false, quantity: 1 },
      { id: 'tools-15', text: 'Screwdriver set', completed: false, quantity: 1 },
      { id: 'tools-16', text: 'Outdoor saw', completed: false, quantity: 1 },
      { id: 'tools-17', text: 'Plastic handcuff', completed: false, quantity: 1 },
      { id: 'tools-18', text: 'Rope', completed: false, quantity: 1 },
      { id: 'tools-19', text: 'Scissors', completed: false, quantity: 1 },
      { id: 'tools-20', text: 'Nail scissors', completed: false, quantity: 1 },
      { id: 'tools-21', text: 'Sewing kit', completed: false, quantity: 1 },
      { id: 'tools-22', text: 'Geiger counter', completed: false, quantity: 1 },
      { id: 'tools-23', text: 'Gas mask NBC filter', completed: false, quantity: 1 },
      { id: 'tools-24', text: 'Compass', completed: false, quantity: 1 },
      { id: 'tools-25', text: 'Map', completed: false, quantity: 1 },
      { id: 'tools-26', text: 'Tent', completed: false, quantity: 1 },
      { id: 'tools-27', text: 'Helmet', completed: false, quantity: 1 },
      { id: 'tools-28', text: 'Backpack', completed: false, quantity: 1 },
      { id: 'tools-29', text: 'Life vest', completed: false, quantity: 1 },
    ]
  },
  {
    id: 5,
    category: 'Electronics & Communication',
    items: [
      { id: 'electronics-1', text: 'Phone charger', completed: false, quantity: 1 },
      { id: 'electronics-2', text: 'USB battery', completed: false, quantity: 1 },
      { id: 'electronics-3', text: 'Portable solar panel', completed: false, quantity: 1 },
      { id: 'electronics-4', text: 'USB cooler/heater', completed: false, quantity: 1 },
      { id: 'electronics-5', text: 'Dumb phone', completed: false, quantity: 1 },
      { id: 'electronics-6', text: 'USB memory stick', completed: false, quantity: 1 },
      { id: 'electronics-7', text: 'Starlink', completed: false, quantity: 1 },
      { id: 'electronics-8', text: 'Powerbank', completed: false, quantity: 1 },
      { id: 'electronics-9', text: 'Headlamp', completed: false, quantity: 1 },
      { id: 'electronics-10', text: 'Headphone', completed: false, quantity: 1 },
      { id: 'electronics-11', text: 'Radio', completed: false, quantity: 1 },
      { id: 'electronics-12', text: 'HAM Radio', completed: false, quantity: 1 },
      { id: 'electronics-13', text: 'Flashlight (battery/dynamo/USB)', completed: false, quantity: 1 },
      { id: 'electronics-14', text: 'Candle', completed: false, quantity: 1 },
      { id: 'electronics-15', text: 'Matches', completed: false, quantity: 1 },
    ]
  },
  {
    id: 6,
    category: 'Personal Care & Hygiene',
    items: [
      { id: 'hygiene-1', text: 'Wet wipes', completed: false, quantity: 1 },
      { id: 'hygiene-2', text: 'T-shirt', completed: false, quantity: 1 },
      { id: 'hygiene-3', text: 'Towel', completed: false, quantity: 1 },
      { id: 'hygiene-4', text: 'Shampoo', completed: false, quantity: 1 },
      { id: 'hygiene-5', text: 'Hair comb', completed: false, quantity: 1 },
      { id: 'hygiene-6', text: 'Trousers', completed: false, quantity: 1 },
      { id: 'hygiene-7', text: 'Seasonal clothes', completed: false, quantity: 1 },
      { id: 'hygiene-8', text: 'Toothpaste', completed: false, quantity: 1 },
      { id: 'hygiene-9', text: 'Toothbrush', completed: false, quantity: 1 },
      { id: 'hygiene-10', text: 'Sneakers', completed: false, quantity: 1 },
      { id: 'hygiene-11', text: 'Socks', completed: false, quantity: 1 },
      { id: 'hygiene-12', text: 'Soap', completed: false, quantity: 1 },
      { id: 'hygiene-13', text: 'Underwear', completed: false, quantity: 1 },
      { id: 'hygiene-14', text: 'Protective clothes', completed: false, quantity: 1 },
      { id: 'hygiene-15', text: 'Dust mask', completed: false, quantity: 1 },
      { id: 'hygiene-16', text: 'Safety Glasses', completed: false, quantity: 1 },
      { id: 'hygiene-17', text: 'Sunglasses', completed: false, quantity: 1 },
      { id: 'hygiene-18', text: 'Sanitary pads', completed: false, quantity: 1 },
      { id: 'hygiene-19', text: 'Contact lenses', completed: false, quantity: 1 },
      { id: 'hygiene-20', text: 'Glasses', completed: false, quantity: 1 },
      { id: 'hygiene-21', text: 'Hair washing bonnet', completed: false, quantity: 1 },
      { id: 'hygiene-22', text: 'Toilet paper', completed: false, quantity: 1 },
      { id: 'hygiene-23', text: 'Garbage bag', completed: false, quantity: 1 },
      { id: 'hygiene-24', text: 'Laundry bag', completed: false, quantity: 1 },
      { id: 'hygiene-25', text: 'Alcohol wipes', completed: false, quantity: 1 },
      { id: 'hygiene-26', text: 'Insect repellent spray', completed: false, quantity: 1 },
    ]
  },
  {
    id: 7,
    category: 'Shelter & Comfort',
    items: [
      { id: 'shelter-1', text: 'Blanket', completed: false, quantity: 1 },
      { id: 'shelter-2', text: 'Mat', completed: false, quantity: 1 },
      { id: 'shelter-3', text: 'Hand warmer', completed: false, quantity: 1 },
      { id: 'shelter-4', text: 'Cotton', completed: false, quantity: 1 },
      { id: 'shelter-5', text: 'Sleeping bag', completed: false, quantity: 1 },
      { id: 'shelter-6', text: 'CVS cups', completed: false, quantity: 1 },
      { id: 'shelter-7', text: 'Inflatable bed', completed: false, quantity: 1 },
      { id: 'shelter-8', text: 'Pillow', completed: false, quantity: 1 },
      { id: 'shelter-9', text: 'Sleeping mat', completed: false, quantity: 1 },
      { id: 'shelter-10', text: 'Thermal blanket', completed: false, quantity: 1 },
      { id: 'shelter-11', text: 'Raincoat', completed: false, quantity: 1 },
    ]
  },
  {
    id: 8,
    category: 'Documents & Money',
    items: [
      { id: 'docs-1', text: 'Banknotes and coins', completed: false, quantity: 1 },
      { id: 'docs-2', text: 'Printed deed', completed: false, quantity: 1 },
      { id: 'docs-3', text: 'Printed military discharge certificate', completed: false, quantity: 1 },
      { id: 'docs-4', text: 'Printed diploma', completed: false, quantity: 1 },
      { id: 'docs-5', text: 'Printed copy of passport', completed: false, quantity: 1 },
      { id: 'docs-6', text: 'Printed headshot photos', completed: false, quantity: 1 },
      { id: 'docs-7', text: 'Printed driving license', completed: false, quantity: 1 },
      { id: 'docs-8', text: 'Printed identity card', completed: false, quantity: 1 },
      { id: 'docs-9', text: 'Printed insurance papers', completed: false, quantity: 1 },
      { id: 'docs-10', text: 'Wallet', completed: false, quantity: 1 },
      { id: 'docs-11', text: 'House keys', completed: false, quantity: 1 },
      { id: 'docs-12', text: 'Contacts list', completed: false, quantity: 1 },
      { id: 'docs-13', text: 'Notebook', completed: false, quantity: 1 },
      { id: 'docs-14', text: 'Jewelry', completed: false, quantity: 1 },
      { id: 'docs-15', text: 'Gold and silver', completed: false, quantity: 1 },
    ]
  },
  {
    id: 9,
    category: 'Special Items',
    items: [
      { id: 'special-1', text: 'Baby items', completed: false, quantity: 1 },
      { id: 'special-2', text: 'Diapers', completed: false, quantity: 1 },
      { id: 'special-3', text: 'Prostheses', completed: false, quantity: 1 },
      { id: 'special-4', text: 'Baby clothes', completed: false, quantity: 1 },
      { id: 'special-5', text: 'Mirror', completed: false, quantity: 1 },
    ]
  },
  {
    id: 10,
    category: 'Disaster Preparedness',
    items: [
      { id: 'prep-1', text: 'Emergency kit - Include water, non-perishable food, first-aid supplies, flashlights, batteries, powerbank, HAM radio, clothes, and important documents (digital and physical)', completed: false, quantity: 1 },
      { id: 'prep-2', text: 'Communication plan - Establish how family members will contact each other and where to meet in case of separation', completed: false, quantity: 1 },
      { id: 'prep-3', text: 'Evacuation routes - Familiarize yourself with multiple ways to leave your area safely', completed: false, quantity: 1 },
      { id: 'prep-4', text: 'Prepare home - Secure loose outdoor items, trim trees, and reinforce windows and doors as needed', completed: false, quantity: 1 },
      { id: 'prep-5', text: 'Stay informed - Have a battery-powered or hand-crank radio to receive emergency broadcasts. Alternatively, use HAM radio to communicate', completed: false, quantity: 1 },
      { id: 'prep-6', text: 'Insurance coverage - Ensure your insurance policies adequately cover potential disasters in your area', completed: false, quantity: 1 },
      { id: 'prep-7', text: 'Emergency skills - Take courses in first aid, CPR, and how to use a fire extinguisher', completed: false, quantity: 1 },
      { id: 'prep-8', text: 'Consider special needs - Plan for family members with disabilities, elderly relatives, or pets', completed: false, quantity: 1 },
      { id: 'prep-9', text: 'Valuable possessions - Create an inventory for insurance purposes', completed: false, quantity: 1 },
      { id: 'prep-10', text: 'Practice your plan - Conduct regular drills with your family to ensure everyone knows what to do', completed: false, quantity: 1 },
    ]
  }
]

/**
 * Default Pantry Items
 */
export const DEFAULT_PANTRY_ITEMS: PantryItem[] = [
  {
    id: '1',
    name: 'Canned Beans',
    category: 'Canned Goods',
    quantity: 6,
    unit: 'cans',
    expiryDate: monthsFromToday(18),
    minQuantity: 2,
    notes: 'Black beans and kidney beans for protein'
  },
  {
    id: '2',
    name: 'Rice',
    category: 'Grains & Pasta',
    quantity: 10,
    unit: 'pounds',
    expiryDate: monthsFromToday(24),
    minQuantity: 5,
    notes: 'Long grain white rice'
  },
  {
    id: '3',
    name: 'Bottled Water',
    category: 'Beverages',
    quantity: 24,
    unit: 'bottles',
    expiryDate: monthsFromToday(12),
    minQuantity: 12,
    notes: '16.9 oz bottles'
  },
  {
    id: '4',
    name: 'Protein Bars',
    category: 'Snacks',
    quantity: 8,
    unit: 'bars',
    expiryDate: monthsFromToday(10),
    minQuantity: 4,
    notes: 'High protein emergency food'
  },
  {
    id: '5',
    name: 'Canned Tuna',
    category: 'Canned Goods',
    quantity: 4,
    unit: 'cans',
    expiryDate: monthsFromToday(20),
    minQuantity: 2,
    notes: 'Albacore tuna in water'
  },
  {
    id: '6',
    name: 'Peanut Butter',
    category: 'Condiments',
    quantity: 2,
    unit: 'jars',
    expiryDate: monthsFromToday(14),
    minQuantity: 1,
    notes: 'Natural peanut butter'
  },
  {
    id: '7',
    name: 'Crackers',
    category: 'Snacks',
    quantity: 3,
    unit: 'boxes',
    expiryDate: monthsFromToday(8),
    minQuantity: 1,
    notes: 'Saltine crackers'
  },
  {
    id: '8',
    name: 'Canned Vegetables',
    category: 'Canned Goods',
    quantity: 8,
    unit: 'cans',
    expiryDate: monthsFromToday(16),
    minQuantity: 4,
    notes: 'Mixed vegetables and corn'
  }
]

const STALE_PANTRY_EXPIRY: Record<string, { name: string; expiryDate: string; months: number }> = {
  '1': { name: 'Canned Beans', expiryDate: '2025-06-15', months: 18 },
  '2': { name: 'Rice', expiryDate: '2026-03-20', months: 24 },
  '3': { name: 'Bottled Water', expiryDate: '2025-12-01', months: 12 },
  '4': { name: 'Protein Bars', expiryDate: '2024-11-30', months: 10 },
  '5': { name: 'Canned Tuna', expiryDate: '2025-08-10', months: 20 },
  '6': { name: 'Peanut Butter', expiryDate: '2025-02-15', months: 14 },
  '7': { name: 'Crackers', expiryDate: '2024-12-20', months: 8 },
  '8': { name: 'Canned Vegetables', expiryDate: '2025-07-05', months: 16 },
}

/** Move untouched sample pantry dates forward so first-run stock is not already expired. */
export function migratePantryItems(items: PantryItem[]): PantryItem[] {
  let changed = false
  const next = items.map(item => {
    const stale = STALE_PANTRY_EXPIRY[item.id]
    if (!stale || item.name !== stale.name || item.expiryDate !== stale.expiryDate) return item
    changed = true
    return { ...item, expiryDate: monthsFromToday(stale.months) }
  })
  return changed ? next : items
}

const STALE_DOCUMENT_EXPIRY: Record<string, { name: string; expiryDate: string; months: number }> = {
  '4': { name: 'Health Insurance Card', expiryDate: '2025-12-31', months: 18 },
}

export function migrateDocuments(documents: Document[]): Document[] {
  let changed = false
  const next = documents.map(document => {
    const stale = STALE_DOCUMENT_EXPIRY[document.id]
    if (!stale || document.name !== stale.name || document.expiryDate !== stale.expiryDate) return document
    changed = true
    return { ...document, expiryDate: monthsFromToday(stale.months) }
  })
  return changed ? next : documents
}

/**
 * Default Books
 */
export const DEFAULT_BOOKS: Book[] = [
  {
    id: '1',
    title: 'SAS Survival Handbook',
    author: 'John "Lofty" Wiseman',
    category: 'Survival',
    location: 'Home library',
    isEssential: true,
    notes: 'Comprehensive survival guide covering wilderness, urban, and disaster scenarios'
  },
  {
    id: '2',
    title: 'Where There Is No Doctor',
    author: 'David Werner',
    category: 'Medical',
    location: 'Home library',
    isEssential: true,
    notes: 'Essential medical guide for when professional help is unavailable'
  },
  {
    id: '3',
    title: 'The Prepper\'s Blueprint',
    author: 'Tess Pennington',
    category: 'Preparedness',
    location: 'Home library',
    isEssential: true,
    notes: 'Complete guide to emergency preparedness and survival planning'
  },
  {
    id: '4',
    title: 'Emergency Food Storage & Survival Handbook',
    author: 'Peggy Layton',
    category: 'Food Storage',
    location: 'Kitchen',
    isEssential: true,
    notes: 'Guide to storing and preparing emergency food supplies'
  },
  {
    id: '5',
    title: 'The Encyclopedia of Country Living',
    author: 'Carla Emery',
    category: 'Homesteading',
    location: 'Home library',
    isEssential: false,
    notes: 'Comprehensive guide to self-sufficient living and traditional skills'
  },
  {
    id: '6',
    title: 'First Aid Manual',
    author: 'American Red Cross',
    category: 'Medical',
    location: 'First aid kit',
    isEssential: true,
    notes: 'Official Red Cross first aid and emergency care guide'
  },
  {
    id: '7',
    title: 'The Complete Guide to Self-Sufficiency',
    author: 'John Seymour',
    category: 'Homesteading',
    location: 'Home library',
    isEssential: false,
    notes: 'Guide to living off the land and becoming self-sufficient'
  },
  {
    id: '8',
    title: 'Emergency Preparedness for Families',
    author: 'Various Authors',
    category: 'Preparedness',
    location: 'Home library',
    isEssential: true,
    notes: 'Family-focused emergency preparedness planning guide'
  }
]

/**
 * Default Emergency Contacts
 */
export const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: '1',
    name: 'Local Police Department',
    relationship: 'Emergency Services',
    phone: '911',
    email: '',
    address: 'Local jurisdiction',
    isEmergencyContact: true,
    notes: 'Primary emergency contact for law enforcement'
  },
  {
    id: '2',
    name: 'Local Fire Department',
    relationship: 'Emergency Services',
    phone: '911',
    email: '',
    address: 'Local jurisdiction',
    isEmergencyContact: true,
    notes: 'Primary emergency contact for fire and rescue'
  },
  {
    id: '3',
    name: 'Nearest Hospital',
    relationship: 'Medical',
    phone: '(555) 123-4567',
    email: '',
    address: '123 Medical Center Dr, City, State',
    isEmergencyContact: true,
    notes: 'Nearest emergency medical facility'
  },
  {
    id: '4',
    name: 'Family Doctor',
    relationship: 'Medical',
    phone: '(555) 234-5678',
    email: 'doctor@medicalclinic.com',
    address: '456 Health Ave, City, State',
    isEmergencyContact: false,
    notes: 'Primary care physician'
  },
  {
    id: '5',
    name: 'Neighbor - John Smith',
    relationship: 'Neighbor',
    phone: '(555) 345-6789',
    email: 'john.smith@email.com',
    address: '789 Oak Street, City, State',
    isEmergencyContact: true,
    notes: 'Trusted neighbor for emergency assistance'
  },
  {
    id: '6',
    name: 'Work Supervisor',
    relationship: 'Work',
    phone: '(555) 456-7890',
    email: 'supervisor@company.com',
    address: 'Company Office, City, State',
    isEmergencyContact: false,
    notes: 'Work supervisor for emergency notifications'
  },
  {
    id: '7',
    name: 'Insurance Agent',
    relationship: 'Insurance',
    phone: '(555) 567-8901',
    email: 'agent@insurance.com',
    address: 'Insurance Office, City, State',
    isEmergencyContact: false,
    notes: 'Insurance agent for claims and assistance'
  },
  {
    id: '8',
    name: 'Utility Company',
    relationship: 'Utilities',
    phone: '(555) 678-9012',
    email: 'emergency@utility.com',
    address: 'Utility Office, City, State',
    isEmergencyContact: false,
    notes: 'Emergency utility services contact'
  }
]

/**
 * Default HAM Radio Frequencies
 */
export const DEFAULT_HAM_FREQUENCIES: HamFrequency[] = [
  {
    id: '1',
    frequency: '146.520 MHz',
    description: '2m National Simplex Calling Frequency',
    location: 'Emergency Communications',
    notes: 'Primary VHF calling frequency',
    isEmergency: true
  },
  {
    id: '2',
    frequency: '446.000 MHz',
    description: '70cm National Simplex Calling Frequency',
    location: 'Emergency Communications',
    notes: 'Primary UHF calling frequency',
    isEmergency: true
  },
  {
    id: '3',
    frequency: '7.260 MHz',
    description: 'SATERN - Salvation Army Team Emergency Radio Network',
    location: 'Emergency Communications',
    notes: 'HF emergency net',
    isEmergency: true
  },
  {
    id: '4',
    frequency: '14.300 MHz',
    description: 'Maritime Mobile Service Net',
    location: 'Emergency Communications',
    notes: 'HF emergency and maritime net',
    isEmergency: true
  },
  {
    id: '5',
    frequency: '162.550 MHz',
    description: 'NOAA Weather Radio',
    location: 'Weather',
    notes: 'National Weather Service broadcasts',
    isEmergency: false
  },
  {
    id: '6',
    frequency: '147.000 MHz',
    description: 'Local 2m Repeater',
    location: 'Local Repeater',
    notes: 'Update with your local repeater frequency',
    isEmergency: false
  },
  {
    id: '7',
    frequency: '443.000 MHz',
    description: 'Local 70cm Repeater',
    location: 'Local Repeater',
    notes: 'Update with your local repeater frequency',
    isEmergency: false
  },
  {
    id: '8',
    frequency: '3.860 MHz',
    description: '75m Emergency Net',
    location: 'Long Distance',
    notes: 'HF regional emergency communications',
    isEmergency: true
  }
]

/**
 * Default Documents
 */
export const DEFAULT_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'Passport',
    category: 'Personal ID',
    location: 'Home safe',
    expiryDate: '2030-01-01',
    isDigital: false,
    notes: 'Keep in waterproof container',
    isEssential: true
  },
  {
    id: '2',
    name: 'Birth Certificate',
    category: 'Personal ID',
    location: 'Home safe',
    isDigital: false,
    notes: 'Original and certified copy',
    isEssential: true
  },
  {
    id: '3',
    name: 'Social Security Card',
    category: 'Personal ID',
    location: 'Home safe',
    isDigital: false,
    notes: 'Keep secure',
    isEssential: true
  },
  {
    id: '4',
    name: 'Health Insurance Card',
    category: 'Insurance',
    location: 'Wallet',
    expiryDate: monthsFromToday(18),
    isDigital: true,
    notes: 'Digital copy in phone',
    isEssential: true
  },
  {
    id: '5',
    name: 'Home Insurance Policy',
    category: 'Insurance',
    location: 'Filing cabinet',
    isDigital: true,
    notes: 'Review annually',
    isEssential: true
  },
  {
    id: '6',
    name: 'Property Deed',
    category: 'Property',
    location: 'Home safe',
    isDigital: true,
    notes: 'Original in safe, digital backup',
    isEssential: true
  },
  {
    id: '7',
    name: 'Will and Testament',
    category: 'Legal',
    location: 'Attorney office',
    isDigital: true,
    notes: 'Copy with attorney',
    isEssential: true
  },
  {
    id: '8',
    name: 'Medical Records',
    category: 'Medical',
    location: 'Home office',
    isDigital: true,
    notes: 'Include vaccination records',
    isEssential: true
  }
]
