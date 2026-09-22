/**
 * Foldable sidebar navigation for the main planner sections.
 * Settings live in the header gear, not in this menu.
 */

'use client'

import { Shield, Compass, BookOpen, Users, Radio, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

interface AppSidebarProps {
  isOpen: boolean
  activeTab: string
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

export default function AppSidebar({
  isOpen,
  activeTab,
  onNavigate,
  onClose,
}: AppSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-forest-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="main-navigation"
        className={`sidebar no-print fixed bottom-0 left-0 top-14 z-30 flex w-[min(18rem,85vw)] flex-col transition-transform duration-300 ease-in-out sm:top-[4.75rem] lg:w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col overflow-y-auto p-3 sm:p-4">
          <nav className="flex-1 space-y-1" aria-label="Menu">
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
