/**
 * Settings modal opened from the header gear, next to the theme toggle.
 */

'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Compass, Download, Settings, Type, Users, X } from 'lucide-react'
import SettingsContent from '@/components/SettingsContent'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { FamilyInfo, ChecklistItem } from '@/types'
import { useApp } from '@/contexts/AppContext'

const SETTINGS_NAV_ITEMS = [
  { id: 'settings-family', label: 'Family', icon: Users },
  { id: 'settings-units', label: 'Units', icon: Compass },
  { id: 'settings-appearance', label: 'Font & Size', icon: Type },
  { id: 'settings-data', label: 'Data', icon: Download },
  { id: 'settings-progress', label: 'Progress', icon: BarChart3 },
] as const

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  familyInfo: FamilyInfo
  metricsSettings: ReturnType<typeof useApp>['metricsSettings']
  checklistItems: ChecklistItem[]
  updateFamilyInfo: (field: keyof FamilyInfo, value: string | number) => void
  updateMetricsSettings: (field: string, value: string) => void
}

export default function SettingsModal({
  isOpen,
  onClose,
  familyInfo,
  metricsSettings,
  checklistItems,
  updateFamilyInfo,
  updateMetricsSettings,
}: SettingsModalProps) {
  const [activeSettingsTab, setActiveSettingsTab] = useState('settings-family')

  useEscapeKey(isOpen, onClose)

  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onClick={(event) => event.target === event.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div id="settings-dialog" className="modal-content max-w-2xl">
        <div className="flex items-center justify-between border-b border-sand-300 px-4 py-3 dark:border-forest-600 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="icon-container flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10">
              <Settings className="h-5 w-5 text-forest-600 dark:text-forest-400" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 id="settings-title" className="font-serif text-lg font-semibold text-forest-950 dark:text-sand-50">
                Settings
              </h2>
              <p className="hidden text-xs text-sand-500 dark:text-forest-400 sm:block">
                Household, units, appearance, and data
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-target shrink-0 rounded-xl text-forest-700 hover:bg-sand-100 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-sand-300 dark:hover:bg-forest-800"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="border-b border-sand-300 dark:border-forest-600">
          <div className="chip-scroll px-4 py-3 sm:px-5" role="tablist" aria-label="Settings sections">
            {SETTINGS_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeSettingsTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  onClick={() => setActiveSettingsTab(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                    isActive
                      ? 'border-forest-400 bg-forest-100 text-forest-800 dark:border-forest-500 dark:bg-forest-800 dark:text-forest-100'
                      : 'border-sand-300 bg-white text-sand-600 hover:border-forest-300 dark:border-forest-600 dark:bg-forest-900 dark:text-sand-300'
                  }`}
                  aria-selected={isActive}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="max-h-[calc(92dvh-10rem)] overflow-y-auto sm:max-h-[calc(90vh-11rem)]">
          <SettingsContent
            activeSettingsTab={activeSettingsTab}
            familyInfo={familyInfo}
            onUpdateFamilyInfo={updateFamilyInfo}
            checklistItems={checklistItems}
            metricsSettings={metricsSettings}
            onUpdateMetrics={updateMetricsSettings}
          />
        </div>
      </div>
    </div>
  )
}
