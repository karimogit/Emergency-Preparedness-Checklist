/**
 * AppContext - Global State Management
 * Provides app-wide state including theme, family info, and metrics settings
 */

'use client'

import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { DisplaySettings, FamilyInfo, MetricsSettings, Theme } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { DEFAULT_DISPLAY_SETTINGS, DEFAULT_FAMILY_INFO, DEFAULT_METRICS_SETTINGS } from '@/lib/defaultData'

interface AppContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  familyInfo: FamilyInfo
  setFamilyInfo: (info: FamilyInfo | ((prev: FamilyInfo) => FamilyInfo)) => void
  metricsSettings: MetricsSettings
  setMetricsSettings: (settings: MetricsSettings | ((prev: MetricsSettings) => MetricsSettings)) => void
  displaySettings: DisplaySettings
  setDisplaySettings: (settings: DisplaySettings | ((prev: DisplaySettings) => DisplaySettings)) => void
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.THEME, 'system')
  const [systemDark, setSystemDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [familyInfo, setFamilyInfo] = useLocalStorage<FamilyInfo>(
    STORAGE_KEYS.FAMILY_INFO,
    DEFAULT_FAMILY_INFO
  )
  const [metricsSettings, setMetricsSettings] = useLocalStorage<MetricsSettings>(
    STORAGE_KEYS.METRICS_SETTINGS,
    DEFAULT_METRICS_SETTINGS
  )
  const [displaySettings, setDisplaySettings] = useLocalStorage<DisplaySettings>(
    STORAGE_KEYS.DISPLAY_SETTINGS,
    DEFAULT_DISPLAY_SETTINGS
  )

  // Older saves may lack temperature/distance; keep volume/weight and fill the rest.
  const normalizedMetrics: MetricsSettings = {
    ...DEFAULT_METRICS_SETTINGS,
    ...metricsSettings,
  }

  const normalizedDisplay: DisplaySettings = {
    ...DEFAULT_DISPLAY_SETTINGS,
    ...displaySettings,
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => setSystemDark(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const resolvedTheme: 'light' | 'dark' = theme === 'dark' || (theme === 'system' && systemDark)
    ? 'dark'
    : 'light'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.fontSize = normalizedDisplay.fontSize
    root.dataset.fontFamily = normalizedDisplay.fontFamily
  }, [normalizedDisplay.fontSize, normalizedDisplay.fontFamily])

  // Handle initial loading state
  useEffect(() => {
    setIsLoading(false)
  }, [])

  const value = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    familyInfo,
    setFamilyInfo,
    metricsSettings: normalizedMetrics,
    setMetricsSettings,
    displaySettings: normalizedDisplay,
    setDisplaySettings,
    isLoading
  }), [theme, resolvedTheme, setTheme, familyInfo, setFamilyInfo, normalizedMetrics, setMetricsSettings, normalizedDisplay, setDisplaySettings, isLoading])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
