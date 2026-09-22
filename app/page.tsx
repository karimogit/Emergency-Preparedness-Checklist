/**
 * Main Home Page Component
 * Refactored with performance optimizations, accessibility, dark mode, and improved UX
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { Shield, Menu, X, Zap, Settings } from 'lucide-react'
import ChecklistSection from '@/components/ChecklistSection'
import PantryManager from '@/components/PantryManager'
import BooksManager from '@/components/BooksManager'
import EmergencyContacts from '@/components/EmergencyContacts'
import HamRadioFrequencies from '@/components/HamRadioFrequencies'
import DocumentsBinder from '@/components/DocumentsBinder'
import AppSidebar from '@/components/AppSidebar'
import SettingsModal from '@/components/SettingsModal'
import ThemeToggle from '@/components/ThemeToggle'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/components/Toast'
import { AppProvider, useApp } from '@/contexts/AppContext'
import { FamilyInfo, ChecklistItem } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { STORAGE_KEYS, APP_CONFIG } from '@/lib/constants'
import { DEFAULT_CHECKLIST } from '@/lib/defaultData'

const DESKTOP_MQ = '(min-width: 1024px)'

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
  // Persist open/closed only for desktop; mobile drawer always starts closed
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useLocalStorage(STORAGE_KEYS.SIDEBAR_OPEN, true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(DESKTOP_MQ).matches
  )
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const isSidebarOpen = isDesktop ? desktopSidebarOpen : mobileNavOpen

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ)
    const sync = () => {
      setIsDesktop(mq.matches)
      if (!mq.matches) setMobileNavOpen(false)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

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
    setMobileNavOpen(false)
  }, [])

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia(DESKTOP_MQ).matches) {
      setDesktopSidebarOpen(prev => !prev)
    } else {
      setMobileNavOpen(prev => !prev)
    }
  }, [setDesktopSidebarOpen])

  const closeSidebar = useCallback(() => setMobileNavOpen(false), [])
  const closeSettings = useCallback(() => setIsSettingsOpen(false), [])

  useEscapeKey(mobileNavOpen && !isSettingsOpen, closeSidebar)

  useEffect(() => {
    if (!mobileNavOpen || isDesktop) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileNavOpen, isDesktop])

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
      <header className="header sticky top-0 z-40 no-print" role="banner">
        <div className="safe-px px-3 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-2 sm:h-[4.75rem] sm:gap-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={toggleSidebar}
                className="touch-target shrink-0 rounded-xl bg-sand-100 transition-colors hover:bg-sand-200 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:bg-forest-800 dark:hover:bg-forest-700"
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

              <div className="relative hidden shrink-0 min-[400px]:block">
                <div className="icon-container flex h-9 w-9 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl">
                  <Shield className="h-5 w-5 text-forest-600 dark:text-forest-400 sm:h-6 sm:w-6" aria-hidden="true" />
                </div>
                <div className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 sm:h-4 sm:w-4">
                  <Zap className="h-2 w-2 text-amber-900 sm:h-2.5 sm:w-2.5" aria-hidden="true" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-serif text-base font-semibold leading-tight tracking-tight text-forest-950 dark:text-sand-50 sm:truncate sm:text-2xl">
                  <span className="sm:hidden">Checklist</span>
                  <span className="hidden sm:inline">{APP_CONFIG.APP_NAME}</span>
                </h1>
                <p className="hidden text-sm text-sand-500 dark:text-forest-400 sm:block">
                  {APP_CONFIG.APP_DESCRIPTION}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="touch-target relative rounded-xl border border-sand-200 bg-sand-100 transition-all duration-300 hover:bg-sand-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-sand-50 dark:border-forest-700 dark:bg-forest-800 dark:hover:bg-forest-700 dark:focus:ring-offset-forest-950"
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
        checklistItems={checklistItems}
        updateFamilyInfo={updateFamilyInfo}
        updateMetricsSettings={updateMetricsSettings}
      />

      <AppSidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onClose={closeSidebar}
      />

      <main
        className={`min-h-[calc(100dvh-3.5rem)] transition-[margin] duration-300 ease-in-out sm:min-h-[calc(100dvh-4.75rem)] ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
        id="main-content"
      >
        <div className="safe-px p-2 sm:p-6">
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
          </div>
        </div>
      </main>
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
