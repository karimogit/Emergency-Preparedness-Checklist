/**
 * Main Home Page Component
 * Refactored with performance optimizations, accessibility, dark mode, and improved UX
 */

'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Shield, Users, BookOpen, Radio, FileText, Download, Menu, X } from 'lucide-react'
import ChecklistSection from '@/components/ChecklistSection'
import PantryManager from '@/components/PantryManager'
import BooksManager from '@/components/BooksManager'
import EmergencyContacts from '@/components/EmergencyContacts'
import HamRadioFrequencies from '@/components/HamRadioFrequencies'
import DocumentsBinder from '@/components/DocumentsBinder'
import ImportExportManager from '@/components/ImportExportManager'
import ThemeToggle from '@/components/ThemeToggle'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/components/Toast'
import { AppProvider, useApp } from '@/contexts/AppContext'
import { FamilyInfo, ChecklistItem } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS, APP_CONFIG } from '@/lib/constants'
import { calculateProgress } from '@/lib/utils'

/**
 * Default checklist items
 */
const DEFAULT_CHECKLIST: ChecklistItem[] = [
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
 * Main content wrapper component
 */
function HomeContent() {
  const { familyInfo, setFamilyInfo, metricsSettings, setMetricsSettings } = useApp()
  const [checklistItems, setChecklistItems] = useLocalStorage<ChecklistItem[]>(
    STORAGE_KEYS.CHECKLIST_ITEMS,
    DEFAULT_CHECKLIST
  )
  const [activeTab, setActiveTab] = useState('checklist')
  const [isEditingFamily, setIsEditingFamily] = useState(false)
  const [isEditingMetrics, setIsEditingMetrics] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Memoized progress calculation
  const stats = useMemo(() => {
    const totalItems = checklistItems.reduce((acc, category) => acc + category.items.length, 0)
    const completedItems = checklistItems.reduce((acc, category) => 
      acc + category.items.filter(item => item.completed).length, 0
    )
    const percentage = calculateProgress(completedItems, totalItems)
    
    return { totalItems, completedItems, percentage }
  }, [checklistItems])

  // Memoized total family members
  const totalFamilyMembers = useMemo(() => 
    familyInfo.adults + familyInfo.children + familyInfo.pets,
    [familyInfo]
  )

  // Optimized checklist update with useCallback
  const updateChecklistItem = useCallback((categoryId: number, itemId: string, completed: boolean) => {
    setChecklistItems(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, completed } : item
          )
        }
      }
      return category
    }))
  }, [setChecklistItems])

  // Optimized family info update
  const updateFamilyInfo = useCallback((field: keyof FamilyInfo, value: string | number) => {
    setFamilyInfo(prev => ({ ...prev, [field]: value }))
  }, [setFamilyInfo])

  // Optimized metrics update
  const updateMetricsSettings = useCallback((field: string, value: string) => {
    setMetricsSettings(prev => ({ ...prev, [field]: value }))
  }, [setMetricsSettings])

  const tabs = [
    { id: 'checklist', label: 'Checklist', icon: Shield },
    { id: 'pantry', label: 'Pantry', icon: Shield },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'radio', label: 'HAM Radio', icon: Radio },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'export', label: 'Data', icon: Download },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 no-print" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="p-2 bg-brown-100 dark:bg-brown-900 rounded-lg">
                <Shield className="h-8 w-8 text-brown-600 dark:text-brown-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {APP_CONFIG.APP_NAME}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {APP_CONFIG.APP_DESCRIPTION}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="flex">
        {/* Sidebar - 20% */}
        <div className={`${isSidebarOpen ? 'fixed inset-0 z-40 lg:relative lg:inset-auto' : 'hidden'} lg:block w-full lg:w-1/5 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen no-print`}>
          <div className="p-6">
            {/* Family Info Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Family</h3>
                <button
                  onClick={() => setIsEditingFamily(!isEditingFamily)}
                  className="text-xs text-brown-600 dark:text-brown-400 hover:text-brown-700 dark:hover:text-brown-300"
                  aria-label="Edit family information"
                >
                  {isEditingFamily ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingFamily ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Adults</label>
                      <input
                        type="number"
                        min="0"
                        value={familyInfo.adults}
                        onChange={(e) => updateFamilyInfo('adults', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        aria-label="Number of adults"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Children</label>
                      <input
                        type="number"
                        min="0"
                        value={familyInfo.children}
                        onChange={(e) => updateFamilyInfo('children', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        aria-label="Number of children"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Pets</label>
                      <input
                        type="number"
                        min="0"
                        value={familyInfo.pets}
                        onChange={(e) => updateFamilyInfo('pets', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        aria-label="Number of pets"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingFamily(false)}
                    className="w-full px-2 py-1 bg-brown-600 text-white rounded text-xs hover:bg-brown-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-brown-600 dark:text-brown-400">{familyInfo.adults}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Adults</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brown-600 dark:text-brown-400">{familyInfo.children}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Children</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brown-600 dark:text-brown-400">{familyInfo.pets}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pets</div>
                  </div>
                </div>
              )}
              
              {!isEditingFamily && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    Total: {totalFamilyMembers}
                  </div>
                </div>
              )}
            </div>

            {/* Metrics Settings Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Units</h3>
                <button
                  onClick={() => setIsEditingMetrics(!isEditingMetrics)}
                  className="text-xs text-brown-600 dark:text-brown-400 hover:text-brown-700 dark:hover:text-brown-300"
                  aria-label="Edit unit settings"
                >
                  {isEditingMetrics ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingMetrics ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Volume</label>
                    <select
                      value={metricsSettings.volume}
                      onChange={(e) => updateMetricsSettings('volume', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="gallons">Gallons</option>
                      <option value="liters">Liters</option>
                      <option value="quarts">Quarts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Weight</label>
                    <select
                      value={metricsSettings.weight}
                      onChange={(e) => updateMetricsSettings('weight', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="pounds">Pounds</option>
                      <option value="kilograms">Kilograms</option>
                      <option value="ounces">Ounces</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setIsEditingMetrics(false)}
                    className="w-full px-2 py-1 bg-brown-600 text-white rounded text-xs hover:bg-brown-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Volume:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{metricsSettings.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{metricsSettings.weight}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{stats.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-brown-500 to-brown-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.percentage}%` }}
                  role="progressbar"
                  aria-valuenow={stats.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                {stats.completedItems} of {stats.totalItems} items completed
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 80% */}
        <div className="w-full lg:w-4/5">
          <div className="p-6">
            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 no-print">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs" role="tablist">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`${tab.id}-panel`}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-brown-500 text-brown-600 dark:text-brown-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {activeTab === 'checklist' && (
                <ChecklistSection 
                  checklistItems={checklistItems}
                  onUpdateItem={updateChecklistItem}
                  familyInfo={familyInfo}
                  metricsSettings={metricsSettings}
                />
              )}
              {activeTab === 'pantry' && <PantryManager familyInfo={familyInfo} metricsSettings={metricsSettings} />}
              {activeTab === 'books' && <BooksManager />}
              {activeTab === 'contacts' && <EmergencyContacts />}
              {activeTab === 'radio' && <HamRadioFrequencies />}
              {activeTab === 'documents' && <DocumentsBinder />}
              {activeTab === 'export' && (
                <ImportExportManager 
                  familyInfo={familyInfo}
                  checklistItems={checklistItems}
                  metricsSettings={metricsSettings}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notion Template Promotion */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-blue-200 dark:border-blue-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-200 dark:border-blue-700 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933l3.222-.233c.514-.047.793.233.793.746z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Get the Notion Template</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Check out our premium Notion template with advanced features and detailed planning tools.
                  </p>
                </div>
              </div>
              <a
                href="https://www.notion.com/templates/emergency-preparedness-checklist"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span>View Template</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Main export wrapped with providers and error boundary
 */
export default function Home() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <HomeContent />
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  )
}
