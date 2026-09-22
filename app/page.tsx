/**
 * Main Home Page Component
 * Refactored with performance optimizations, accessibility, dark mode, and improved UX
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { Shield, Menu, X, Zap } from 'lucide-react'
import ChecklistSection from '@/components/ChecklistSection'
import PantryManager from '@/components/PantryManager'
import BooksManager from '@/components/BooksManager'
import EmergencyContacts from '@/components/EmergencyContacts'
import HamRadioFrequencies from '@/components/HamRadioFrequencies'
import DocumentsBinder from '@/components/DocumentsBinder'
import AppSidebar, { isSettingsTab } from '@/components/AppSidebar'
import SettingsContent from '@/components/SettingsContent'
import ThemeToggle from '@/components/ThemeToggle'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/components/Toast'
import { AppProvider, useApp } from '@/contexts/AppContext'
import { FamilyInfo, ChecklistItem } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { STORAGE_KEYS, APP_CONFIG } from '@/lib/constants'
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
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage(STORAGE_KEYS.SIDEBAR_OPEN, true)
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false)

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

  const updateMetricsSettings = useCallback((field: string, value: string) => {
    setMetricsSettings(prev => ({ ...prev, [field]: value }))
  }, [setMetricsSettings])

  const handleNavigate = useCallback((tabId: string) => {
    setActiveTab(tabId)
    if (isSettingsTab(tabId)) {
      setIsSettingsExpanded(true)
    }
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setIsSidebarOpen(false)
    }
  }, [setIsSidebarOpen])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [setIsSidebarOpen])

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [setIsSidebarOpen])

  const toggleSettings = useCallback(() => {
    setIsSettingsExpanded(prev => !prev)
  }, [])

  useEscapeKey(isSidebarOpen, closeSidebar)

  useEffect(() => {
    if (isSettingsTab(activeTab)) {
      setIsSettingsExpanded(true)
    }
  }, [activeTab])

  useEffect(() => {
    if (!isSidebarOpen || window.matchMedia('(min-width: 1024px)').matches) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isSidebarOpen])

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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2.5 rounded-xl bg-sand-100 dark:bg-forest-800 hover:bg-sand-200 dark:hover:bg-forest-700 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500"
                aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isSidebarOpen}
                aria-controls="main-navigation"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5 text-forest-700 dark:text-sand-300" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5 text-forest-700 dark:text-sand-300" aria-hidden="true" />
                )}
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl icon-container flex items-center justify-center">
                    <Shield className="h-6 w-6 text-forest-600 dark:text-forest-400" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                    <Zap className="h-2.5 w-2.5 text-amber-900" />
                  </div>
                </div>
                <div>
                  <h1 className="font-serif text-lg sm:text-2xl font-semibold text-forest-950 dark:text-sand-50 tracking-tight leading-tight">
                    {APP_CONFIG.APP_NAME}
                  </h1>
                  <p className="text-sm text-sand-500 dark:text-forest-400 hidden sm:block">
                    {APP_CONFIG.APP_DESCRIPTION}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <AppSidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        isSettingsExpanded={isSettingsExpanded}
        onToggleSettings={toggleSettings}
        onNavigate={handleNavigate}
        onClose={closeSidebar}
      />

      <main
        className={`min-h-[calc(100vh-73px)] transition-[margin] duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
        id="main-content"
      >
        <div className="p-4 sm:p-6">
          <div className="tactical-card animate-fade-in-up">
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
            {isSettingsTab(activeTab) && (
              <SettingsContent
                activeSettingsTab={activeTab}
                familyInfo={familyInfo}
                onUpdateFamilyInfo={updateFamilyInfo}
                checklistItems={checklistItems}
                metricsSettings={metricsSettings}
                onUpdateMetrics={updateMetricsSettings}
              />
            )}
          </div>
        </div>
      </main>

      <footer className={`mt-8 p-4 sm:p-6 no-print transition-[margin] duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto">
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
        </div>
      </footer>
    </div>
  )
}

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
