/**
 * Main Home Page Component
 * Refactored with performance optimizations, accessibility, dark mode, and improved UX
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Shield, Users, BookOpen, Radio, FileText, Download, Compass, Settings, Zap } from 'lucide-react'
import ChecklistSection from '@/components/ChecklistSection'
import PantryManager from '@/components/PantryManager'
import BooksManager from '@/components/BooksManager'
import EmergencyContacts from '@/components/EmergencyContacts'
import HamRadioFrequencies from '@/components/HamRadioFrequencies'
import DocumentsBinder from '@/components/DocumentsBinder'
import ImportExportManager from '@/components/ImportExportManager'
import SettingsModal from '@/components/SettingsModal'
import ThemeToggle from '@/components/ThemeToggle'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/components/Toast'
import { AppProvider, useApp } from '@/contexts/AppContext'
import { FamilyInfo, ChecklistItem } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS, APP_CONFIG } from '@/lib/constants'
import { calculateProgress } from '@/lib/utils'
import { DEFAULT_CHECKLIST } from '@/lib/defaultData'

/**
 * Main content wrapper component
 */
function HomeContent() {
  const { familyInfo, setFamilyInfo, metricsSettings, setMetricsSettings, isLoading } = useApp()
  const [checklistItems, setChecklistItems] = useLocalStorage<ChecklistItem[]>(
    STORAGE_KEYS.CHECKLIST_ITEMS,
    DEFAULT_CHECKLIST
  )
  const [activeTab, setActiveTab] = useState('checklist')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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
  const household = useMemo(() => {
    const people = (Number(familyInfo.adults) || 0) + (Number(familyInfo.children) || 0)
    const pets = Number(familyInfo.pets) || 0
    return { people, pets }
  }, [familyInfo])

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

  // Optimized family info update. Counts stay inside the planner's supported range.
  const updateFamilyInfo = useCallback((field: keyof FamilyInfo, value: string | number) => {
    setFamilyInfo(prev => {
      if (field === 'adults' || field === 'children' || field === 'pets') {
        const numeric = typeof value === 'number' ? value : parseInt(String(value), 10)
        const clamped = Number.isFinite(numeric) ? Math.min(20, Math.max(0, numeric)) : 0
        return { ...prev, [field]: clamped }
      }
      return { ...prev, [field]: value }
    })
  }, [setFamilyInfo])

  const resetChecklist = useCallback(() => {
    setChecklistItems(prev => prev.map(category => ({
      ...category,
      items: category.items.map(item => ({ ...item, completed: false }))
    })))
  }, [setChecklistItems])

  // Optimized metrics update
  const updateMetricsSettings = useCallback((field: string, value: string) => {
    setMetricsSettings(prev => ({ ...prev, [field]: value }))
  }, [setMetricsSettings])

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
  }, [])

  const closeSettings = useCallback(() => setIsSettingsOpen(false), [])

  const tabs = [
    { id: 'checklist', label: 'Checklist', icon: Shield },
    { id: 'pantry', label: 'Pantry', icon: Compass },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'radio', label: 'HAM Radio', icon: Radio },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'export', label: 'Data', icon: Download },
  ]

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl icon-container mx-auto flex items-center justify-center animate-float">
              <Shield className="h-10 w-10 text-forest-600 dark:text-forest-400" />
            </div>
            <div className="absolute -inset-2 bg-forest-400/20 rounded-3xl blur-xl animate-pulse-glow" />
          </div>
          <p className="text-sand-600 dark:text-sand-400 font-medium">Preparing your checklist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="header sticky top-0 z-30 no-print" role="banner">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                <div className="icon-container flex h-12 w-12 items-center justify-center rounded-xl">
                  <Shield className="h-6 w-6 text-forest-600 dark:text-forest-400" aria-hidden="true" />
                </div>
                <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
                  <Zap className="h-2.5 w-2.5 text-amber-900" aria-hidden="true" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="font-serif text-lg font-semibold leading-tight tracking-tight text-forest-950 dark:text-sand-50 sm:text-2xl">
                  {APP_CONFIG.APP_NAME}
                </h1>
                <p className="hidden text-sm text-sand-500 dark:text-forest-400 sm:block">
                  {APP_CONFIG.APP_DESCRIPTION}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="relative rounded-xl border border-sand-200 bg-sand-100 p-2.5 transition-all duration-300 hover:bg-sand-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-sand-50 dark:border-forest-700 dark:bg-forest-800 dark:hover:bg-forest-700 dark:focus:ring-offset-forest-950"
                aria-label="Open settings"
                aria-expanded={isSettingsOpen}
                aria-controls="settings-dialog"
                title="Settings"
              >
                <Settings className="h-5 w-5 text-forest-600 dark:text-forest-400" aria-hidden="true" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        familyInfo={familyInfo}
        metricsSettings={metricsSettings}
        stats={stats}
        household={household}
        updateFamilyInfo={updateFamilyInfo}
        updateMetricsSettings={updateMetricsSettings}
      />

      <main className="w-full">
        <div className="p-4 sm:p-6">
          <nav className="tactical-card mb-6 no-print animate-fade-in-down" aria-label="Main navigation">
            <div className="tab-strip border-b border-sand-200 dark:border-forest-700">
              <div className="flex gap-4 overflow-x-auto px-4 scrollbar-none" role="tablist">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`${tab.id}-panel`}
                      id={`${tab.id}-tab`}
                      className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>

          <div 
            className="tactical-card animate-fade-in-up"
            role="tabpanel"
            id={`${activeTab}-panel`}
            aria-labelledby={`${activeTab}-tab`}
          >
            {activeTab === 'checklist' && (
              <ChecklistSection 
                checklistItems={checklistItems}
                onUpdateItem={updateChecklistItem}
                onReset={resetChecklist}
                familyInfo={familyInfo}
                metricsSettings={metricsSettings}
              />
            )}
            {activeTab === 'pantry' && <PantryManager metricsSettings={metricsSettings} />}
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
      </main>
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
