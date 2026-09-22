/**
 * Settings modal for household size, units, and overall progress.
 */

'use client'

import { useEffect } from 'react'
import { Compass, Settings, Users, X } from 'lucide-react'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { FamilyInfo, MetricsSettings } from '@/types'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  familyInfo: FamilyInfo
  metricsSettings: MetricsSettings
  stats: { totalItems: number; completedItems: number; percentage: number }
  household: { people: number; pets: number }
  updateFamilyInfo: (field: keyof FamilyInfo, value: string | number) => void
  updateMetricsSettings: (field: string, value: string) => void
}

export default function SettingsModal({
  isOpen,
  onClose,
  familyInfo,
  metricsSettings,
  stats,
  household,
  updateFamilyInfo,
  updateMetricsSettings,
}: SettingsModalProps) {
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
      <div id="settings-dialog" className="modal-content max-w-xl">
        <div className="flex items-center justify-between border-b border-sand-200 px-5 py-4 dark:border-forest-700">
          <div className="flex items-center gap-3">
            <div className="icon-container flex h-10 w-10 items-center justify-center rounded-xl">
              <Settings className="h-5 w-5 text-forest-600 dark:text-forest-400" aria-hidden="true" />
            </div>
            <div>
              <h2 id="settings-title" className="font-serif text-lg font-semibold text-forest-950 dark:text-sand-50">
                Settings
              </h2>
              <p className="text-xs text-sand-500 dark:text-forest-400">
                Household, units, and progress
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-forest-700 hover:bg-sand-100 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-sand-300 dark:hover:bg-forest-800"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-5rem)] space-y-6 overflow-y-auto p-5">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-sand-50">
                Overall Progress
              </h3>
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
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-forest-600 dark:text-forest-400" aria-hidden="true" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-sand-50">Family</h3>
            </div>
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
              <p className="text-xs text-sand-500 dark:text-sand-400">
                {household.people} people{household.pets > 0 ? ` · ${household.pets} pets` : ''}
              </p>
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
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Compass className="h-4 w-4 text-forest-600 dark:text-forest-400" aria-hidden="true" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-sand-50">Units</h3>
            </div>
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
          </section>
        </div>
      </div>
    </div>
  )
}
