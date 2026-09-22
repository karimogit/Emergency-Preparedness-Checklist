/**
 * Foldable sidebar navigation with main menu items and collapsible Settings section.
 */

'use client'

import { ChevronDown, ChevronRight, Settings, Shield, Compass, BookOpen, Users, Radio, FileText, Download, Type, BarChart3 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

export interface SettingsNavItem {
  id: string
  label: string
  icon: LucideIcon
}

interface AppSidebarProps {
  isOpen: boolean
  activeTab: string
  isSettingsExpanded: boolean
  onToggleSettings: () => void
  onNavigate: (tabId: string) => void
  onClose: () => void
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'checklist', label: 'Checklist', icon: Shield },
  { id: 'pantry', label: 'Pantry', icon: Compass },
  { id: 'books', label: 'Books', icon: BookOpen },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'radio', label: 'HAM Radio', icon: Radio },
  { id: 'documents', label: 'Documents', icon: FileText },
]

export const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  { id: 'settings-family', label: 'Family', icon: Users },
  { id: 'settings-units', label: 'Units', icon: Compass },
  { id: 'settings-appearance', label: 'Font & Size', icon: Type },
  { id: 'settings-data', label: 'Data', icon: Download },
  { id: 'settings-progress', label: 'Progress', icon: BarChart3 },
]

export function isSettingsTab(tabId: string): boolean {
  return tabId.startsWith('settings-')
}

export default function AppSidebar({
  isOpen,
  activeTab,
  isSettingsExpanded,
  onToggleSettings,
  onNavigate,
  onClose,
}: AppSidebarProps) {
  const settingsActive = isSettingsTab(activeTab)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-forest-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="main-navigation"
        className={`sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 ease-in-out no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col overflow-y-auto p-4 pt-[5.5rem]">
          <nav className="flex-1 space-y-1" aria-label="Menu">
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              )
            })}

            <div className="pt-2">
              <button
                onClick={onToggleSettings}
                className={`sidebar-nav-item w-full ${settingsActive && !isSettingsExpanded ? 'active' : ''}`}
                aria-expanded={isSettingsExpanded}
                aria-controls="settings-submenu"
              >
                <Settings className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="flex-1 text-left">Settings</span>
                {isSettingsExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-60" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0 opacity-60" aria-hidden="true" />
                )}
              </button>

              {isSettingsExpanded && (
                <div id="settings-submenu" className="mt-1 space-y-0.5" role="group" aria-label="Settings">
                  {SETTINGS_NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`sidebar-nav-subitem ${isActive ? 'active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="h-3.5 w-3.5 flex-shrink-0 opacity-70" aria-hidden="true" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}
