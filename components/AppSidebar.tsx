/**
 * App sidebar: branding, household planner, units, and progress.
 * Folds to an icon rail on large screens; on small screens it is a drawer.
 */

'use client'

import { useEffect, useState } from 'react'
import { Compass, MapPin, PanelLeftClose, PanelLeftOpen, Shield, Users, X, Zap } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { APP_CONFIG } from '@/lib/constants'
import { FamilyInfo, MetricsSettings } from '@/types'

interface AppSidebarProps {
  familyInfo: FamilyInfo
  metricsSettings: MetricsSettings
  stats: { totalItems: number; completedItems: number; percentage: number }
  household: { people: number; pets: number }
  isEditingFamily: boolean
  isEditingMetrics: boolean
  setIsEditingFamily: (value: boolean) => void
  setIsEditingMetrics: (value: boolean) => void
  updateFamilyInfo: (field: keyof FamilyInfo, value: string | number) => void
  updateMetricsSettings: (field: string, value: string) => void
  isMobileOpen: boolean
  onMobileClose: () => void
  isCollapsed: boolean
  onToggleCollapsed: () => void
}

export default function AppSidebar({
  familyInfo,
  metricsSettings,
  stats,
  household,
  isEditingFamily,
  isEditingMetrics,
  setIsEditingFamily,
  setIsEditingMetrics,
  updateFamilyInfo,
  updateMetricsSettings,
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapsed,
}: AppSidebarProps) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const sync = () => setIsDesktop(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const isOffCanvas = !isDesktop && !isMobileOpen

  const expandSidebar = () => {
    if (isCollapsed) onToggleCollapsed()
  }

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-forest-950/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="app-sidebar"
        className={`sidebar no-print fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden transition-[width,transform] duration-300 ease-out w-[min(100%,20rem)] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto lg:h-auto lg:min-h-screen lg:translate-x-0 ${
          isCollapsed ? 'lg:w-[4.75rem]' : 'lg:w-80'
        }`}
        aria-label="Household planner"
        aria-hidden={isOffCanvas || undefined}
        inert={isOffCanvas || undefined}
      >
        <div className={`flex min-h-0 flex-1 flex-col ${isCollapsed ? 'lg:hidden' : ''}`}>
          <div className="border-b border-sand-200 px-4 py-4 dark:border-forest-700" role="banner">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <div className="icon-container flex h-12 w-12 items-center justify-center rounded-xl">
                    <Shield className="h-6 w-6 text-forest-600 dark:text-forest-400" aria-hidden="true" />
                  </div>
                  <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
                    <Zap className="h-2.5 w-2.5 text-amber-900" aria-hidden="true" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="font-serif text-lg font-semibold leading-tight tracking-tight text-forest-950 dark:text-sand-50">
                    {APP_CONFIG.APP_NAME}
                  </h1>
                  <p className="mt-0.5 text-xs text-sand-500 dark:text-forest-400">
                    {APP_CONFIG.APP_DESCRIPTION}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={onToggleCollapsed}
                  className="hidden rounded-xl p-2 text-forest-700 hover:bg-sand-100 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-sand-300 dark:hover:bg-forest-800 lg:inline-flex"
                  aria-label="Collapse sidebar"
                  aria-expanded="true"
                  aria-controls="app-sidebar"
                >
                  <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="rounded-xl p-2 text-forest-700 hover:bg-sand-100 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-sand-300 dark:hover:bg-forest-800 lg:hidden"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="tactical-card animate-fade-in-up stagger-1 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-forest-600 dark:text-forest-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-forest-900 dark:text-sand-50">Family</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingFamily(!isEditingFamily)}
                  className="text-xs font-medium text-forest-600 transition-colors hover:text-forest-700 focus:underline focus:outline-none dark:text-forest-400 dark:hover:text-forest-300"
                  aria-label={isEditingFamily ? 'Save family information' : 'Edit family information'}
                >
                  {isEditingFamily ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingFamily ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="min-w-0">
                      <label htmlFor="adults" className="mb-1 block truncate text-[10px] font-medium text-sand-500 dark:text-sand-400">Adults</label>
                      <input
                        id="adults"
                        type="number"
                        min="0"
                        max="20"
                        value={familyInfo.adults}
                        onChange={(e) => updateFamilyInfo('adults', parseInt(e.target.value) || 0)}
                        className="input-field py-2 text-center text-sm"
                      />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="children" className="mb-1 block truncate text-[10px] font-medium text-sand-500 dark:text-sand-400">Children</label>
                      <input
                        id="children"
                        type="number"
                        min="0"
                        max="20"
                        value={familyInfo.children}
                        onChange={(e) => updateFamilyInfo('children', parseInt(e.target.value) || 0)}
                        className="input-field py-2 text-center text-sm"
                      />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="pets" className="mb-1 block truncate text-[10px] font-medium text-sand-500 dark:text-sand-400">Pets</label>
                      <input
                        id="pets"
                        type="number"
                        min="0"
                        max="20"
                        value={familyInfo.pets}
                        onChange={(e) => updateFamilyInfo('pets', parseInt(e.target.value) || 0)}
                        className="input-field py-2 text-center text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="location" className="mb-1 block text-[10px] font-medium uppercase text-sand-500 dark:text-sand-400">Meeting place</label>
                    <input
                      id="location"
                      type="text"
                      value={familyInfo.location ?? ''}
                      onChange={(e) => updateFamilyInfo('location', e.target.value)}
                      placeholder="Home, school, or rally point"
                      className="input-field py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="specialNeeds" className="mb-1 block text-[10px] font-medium uppercase text-sand-500 dark:text-sand-400">Special needs</label>
                    <textarea
                      id="specialNeeds"
                      value={familyInfo.specialNeeds ?? ''}
                      onChange={(e) => updateFamilyInfo('specialNeeds', e.target.value)}
                      placeholder="Medications, mobility, allergies"
                      rows={2}
                      className="input-field resize-none py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="emergencyPlan" className="mb-1 block text-[10px] font-medium uppercase text-sand-500 dark:text-sand-400">Plan notes</label>
                    <textarea
                      id="emergencyPlan"
                      value={familyInfo.emergencyPlan ?? ''}
                      onChange={(e) => updateFamilyInfo('emergencyPlan', e.target.value)}
                      placeholder="Out-of-town contact, evacuation route"
                      rows={3}
                      className="input-field resize-none py-2 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingFamily(false)}
                    className="btn-primary w-full text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Adults', value: familyInfo.adults },
                      { label: 'Children', value: familyInfo.children },
                      { label: 'Pets', value: familyInfo.pets },
                    ].map((item, i) => (
                      <div key={item.label} className={`min-w-0 rounded-lg border border-sand-200 bg-sand-50 p-2 dark:border-forest-700 dark:bg-forest-800/50 animate-scale-in stagger-${i + 1}`}>
                        <div className="text-xl font-bold text-forest-600 dark:text-forest-400">{item.value}</div>
                        <div className="text-[9px] font-medium uppercase tracking-tight text-sand-500 dark:text-sand-400">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-sand-200 pt-4 text-center dark:border-forest-700">
                    <div className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-100 px-4 py-2 dark:border-forest-700 dark:bg-forest-800">
                      <span className="text-sm font-bold text-forest-700 dark:text-forest-300">
                        {household.people} people{household.pets > 0 ? ` · ${household.pets} pets` : ''}
                      </span>
                    </div>
                  </div>
                  {(familyInfo.location || familyInfo.specialNeeds || familyInfo.emergencyPlan) && (
                    <div className="mt-4 space-y-2 text-left">
                      {familyInfo.location && (
                        <p className="flex items-start gap-2 text-xs text-sand-600 dark:text-sand-300">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-forest-500" aria-hidden="true" />
                          <span>{familyInfo.location}</span>
                        </p>
                      )}
                      {familyInfo.specialNeeds && (
                        <p className="text-xs leading-relaxed text-sand-600 dark:text-sand-300">
                          <span className="font-semibold text-forest-700 dark:text-forest-300">Needs: </span>
                          {familyInfo.specialNeeds}
                        </p>
                      )}
                      {familyInfo.emergencyPlan && (
                        <p className="text-xs leading-relaxed text-sand-600 dark:text-sand-300">
                          <span className="font-semibold text-forest-700 dark:text-forest-300">Plan: </span>
                          {familyInfo.emergencyPlan}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="tactical-card animate-fade-in-up stagger-2 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-forest-600 dark:text-forest-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-forest-900 dark:text-sand-50">Units</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingMetrics(!isEditingMetrics)}
                  className="text-xs font-medium text-forest-600 transition-colors hover:text-forest-700 focus:underline focus:outline-none dark:text-forest-400 dark:hover:text-forest-300"
                  aria-label={isEditingMetrics ? 'Save unit settings' : 'Edit unit settings'}
                >
                  {isEditingMetrics ? 'Done' : 'Edit'}
                </button>
              </div>

              {isEditingMetrics ? (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="volume" className="mb-1.5 block text-xs font-medium text-sand-500 dark:text-sand-400">Volume</label>
                    <select
                      id="volume"
                      value={metricsSettings.volume}
                      onChange={(e) => updateMetricsSettings('volume', e.target.value)}
                      className="select-field text-sm"
                    >
                      <option value="gallons">Gallons</option>
                      <option value="liters">Liters</option>
                      <option value="quarts">Quarts</option>
                    </select>
                    <p className="mt-1.5 text-[11px] leading-snug text-sand-500 dark:text-sand-400">
                      Checklist water targets and tips use this unit.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="weight" className="mb-1.5 block text-xs font-medium text-sand-500 dark:text-sand-400">Weight</label>
                    <select
                      id="weight"
                      value={metricsSettings.weight}
                      onChange={(e) => updateMetricsSettings('weight', e.target.value)}
                      className="select-field text-sm"
                    >
                      <option value="pounds">Pounds</option>
                      <option value="kilograms">Kilograms</option>
                      <option value="ounces">Ounces</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="temperature" className="mb-1.5 block text-xs font-medium text-sand-500 dark:text-sand-400">Temperature</label>
                    <select
                      id="temperature"
                      value={metricsSettings.temperature}
                      onChange={(e) => updateMetricsSettings('temperature', e.target.value)}
                      className="select-field text-sm"
                    >
                      <option value="fahrenheit">Fahrenheit</option>
                      <option value="celsius">Celsius</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="distance" className="mb-1.5 block text-xs font-medium text-sand-500 dark:text-sand-400">Distance</label>
                    <select
                      id="distance"
                      value={metricsSettings.distance}
                      onChange={(e) => updateMetricsSettings('distance', e.target.value)}
                      className="select-field text-sm"
                    >
                      <option value="miles">Miles</option>
                      <option value="kilometers">Kilometers</option>
                      <option value="feet">Feet</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { label: 'Volume', value: metricsSettings.volume },
                    { label: 'Weight', value: metricsSettings.weight },
                    { label: 'Temp', value: metricsSettings.temperature },
                    { label: 'Distance', value: metricsSettings.distance },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg bg-sand-50 px-3 py-2 dark:bg-forest-800/50">
                      <span className="text-xs font-medium uppercase tracking-wide text-sand-500 dark:text-sand-400">{item.label}</span>
                      <span className="text-sm font-semibold capitalize text-forest-700 dark:text-forest-300">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="tactical-card animate-fade-in-up stagger-3 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-sand-50">Overall Progress</span>
                <span className="text-lg font-bold text-forest-600 dark:text-forest-400">{stats.percentage}%</span>
              </div>
              <div className="progress-bar mb-3">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${stats.percentage}%` }}
                  role="progressbar"
                  aria-valuenow={stats.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${stats.percentage}% complete`}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-sand-500 dark:text-sand-400">
                  <span className="font-semibold text-forest-600 dark:text-forest-400">{stats.completedItems}</span> of {stats.totalItems} items
                </span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {stats.totalItems - stats.completedItems} left
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`hidden min-h-0 flex-1 flex-col items-center gap-3 px-2 py-4 ${isCollapsed ? 'lg:flex' : ''}`} role="banner">
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="rounded-xl p-2 text-forest-700 hover:bg-sand-100 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-sand-300 dark:hover:bg-forest-800"
            aria-label="Expand sidebar"
            aria-expanded="false"
            aria-controls="app-sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={expandSidebar}
            className="relative"
            title={APP_CONFIG.APP_NAME}
            aria-label={`Expand sidebar, ${APP_CONFIG.APP_NAME}`}
          >
            <div className="icon-container flex h-11 w-11 items-center justify-center rounded-xl">
              <Shield className="h-5 w-5 text-forest-600 dark:text-forest-400" aria-hidden="true" />
            </div>
            <div className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400">
              <Zap className="h-2 w-2 text-amber-900" aria-hidden="true" />
            </div>
          </button>
          <ThemeToggle />
          <div className="my-1 h-px w-8 bg-sand-200 dark:bg-forest-700" />
          <button
            type="button"
            onClick={expandSidebar}
            className="rounded-xl p-2.5 text-forest-700 hover:bg-sand-100 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-sand-300 dark:hover:bg-forest-800"
            title="Family"
            aria-label="Expand sidebar to family details"
          >
            <Users className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={expandSidebar}
            className="rounded-xl p-2.5 text-forest-700 hover:bg-sand-100 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-sand-300 dark:hover:bg-forest-800"
            title="Units"
            aria-label="Expand sidebar to unit settings"
          >
            <Compass className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={expandSidebar}
            className="flex h-11 w-11 flex-col items-center justify-center rounded-xl border border-sand-200 bg-sand-50 text-forest-700 hover:bg-sand-100 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:border-forest-700 dark:bg-forest-800/50 dark:text-forest-300 dark:hover:bg-forest-800"
            title={`${stats.percentage}% complete`}
            aria-label={`Expand sidebar, overall progress ${stats.percentage}%`}
          >
            <span className="text-xs font-bold leading-none">{stats.percentage}%</span>
          </button>
        </div>
      </aside>
    </>
  )
}
