/**
 * Main Home Page Component
 * Refactored with performance optimizations, accessibility, dark mode, and improved UX
 */

'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Shield, Users, BookOpen, Radio, FileText, Download, Menu, Compass } from 'lucide-react'
import ChecklistSection from '@/components/ChecklistSection'
import PantryManager from '@/components/PantryManager'
import BooksManager from '@/components/BooksManager'
import EmergencyContacts from '@/components/EmergencyContacts'
import HamRadioFrequencies from '@/components/HamRadioFrequencies'
import DocumentsBinder from '@/components/DocumentsBinder'
import ImportExportManager from '@/components/ImportExportManager'
import AppSidebar from '@/components/AppSidebar'
import ThemeToggle from '@/components/ThemeToggle'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/components/Toast'
import { AppProvider, useApp } from '@/contexts/AppContext'
import { FamilyInfo, ChecklistItem } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { STORAGE_KEYS } from '@/lib/constants'
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
  const [isEditingFamily, setIsEditingFamily] = useState(false)
  const [isEditingMetrics, setIsEditingMetrics] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage(
    STORAGE_KEYS.SIDEBAR_COLLAPSED,
    false
  )

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

  // Close sidebar on tab change for mobile
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
    setIsSidebarOpen(false)
  }, [])

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])
  const toggleSidebarCollapsed = useCallback(() => {
    setIsSidebarCollapsed((current) => !current)
    setIsEditingFamily(false)
    setIsEditingMetrics(false)
  }, [setIsSidebarCollapsed])
  useEscapeKey(isSidebarOpen, closeSidebar)

  useEffect(() => {
    if (!isSidebarOpen || window.matchMedia('(min-width: 1024px)').matches) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isSidebarOpen])

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
    <div className="flex min-h-screen">
      <AppSidebar
        familyInfo={familyInfo}
        metricsSettings={metricsSettings}
        stats={stats}
        household={household}
        isEditingFamily={isEditingFamily}
        isEditingMetrics={isEditingMetrics}
        setIsEditingFamily={setIsEditingFamily}
        setIsEditingMetrics={setIsEditingMetrics}
        updateFamilyInfo={updateFamilyInfo}
        updateMetricsSettings={updateMetricsSettings}
        isMobileOpen={isSidebarOpen}
        onMobileClose={closeSidebar}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapsed={toggleSidebarCollapsed}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mobile-shell-bar sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 no-print lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-sand-100 p-2.5 pr-3 text-forest-700 transition-colors hover:bg-sand-200 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:bg-forest-800 dark:text-sand-300 dark:hover:bg-forest-700"
            aria-label="Open household sidebar"
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="font-serif text-base font-semibold">Planner</span>
          </button>
          <ThemeToggle />
        </div>

        <main className="w-full flex-1">
          <div className="p-4 sm:p-6">
            {/* Navigation Tabs */}
            <nav className="tactical-card mb-6 no-print animate-fade-in-down" aria-label="Main navigation">
              <div className="tab-strip border-b border-sand-200 dark:border-forest-700">
                <div className="flex gap-4 px-4 overflow-x-auto scrollbar-none" role="tablist">
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

            {/* Tab Content */}
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

        {/* Notion Template Promotion */}
        <footer className="mt-auto p-4 sm:p-6 no-print">
          <div className="notion-promo">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933l3.222-.233c.514-.047.793.233.793.746z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Get the Notion Template</h3>
                  <p className="text-sm text-forest-100/80">
                    Premium template with advanced features and detailed planning tools.
                  </p>
                </div>
              </div>
              <a
                href="https://www.notion.com/templates/emergency-preparedness-checklist"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-forest-700 rounded-xl hover:bg-sand-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-forest-700"
              >
                <span>View Template</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
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
