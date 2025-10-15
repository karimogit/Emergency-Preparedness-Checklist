/**
 * AppContext - Global State Management
 * Provides app-wide state including theme, family info, and metrics settings
 */

'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { FamilyInfo } from '@/types'
import { STORAGE_KEYS, DEFAULT_FAMILY_INFO, DEFAULT_METRICS_SETTINGS } from '@/lib/constants'

export interface MetricsSettings {
  volume: string
  weight: string
  temperature: string
  distance: string
}

export type Theme = 'light' | 'dark' | 'system'

interface AppContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  familyInfo: FamilyInfo
  setFamilyInfo: (info: FamilyInfo | ((prev: FamilyInfo) => FamilyInfo)) => void
  metricsSettings: MetricsSettings
  setMetricsSettings: (settings: MetricsSettings | ((prev: MetricsSettings) => MetricsSettings)) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.THEME, 'light')
  const [familyInfo, setFamilyInfo] = useLocalStorage<FamilyInfo>(
    STORAGE_KEYS.FAMILY_INFO,
    DEFAULT_FAMILY_INFO
  )
  const [metricsSettings, setMetricsSettings] = useLocalStorage<MetricsSettings>(
    STORAGE_KEYS.METRICS_SETTINGS,
    DEFAULT_METRICS_SETTINGS
  )

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        familyInfo,
        setFamilyInfo,
        metricsSettings,
        setMetricsSettings
      }}
    >
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
