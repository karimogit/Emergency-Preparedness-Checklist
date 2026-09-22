/**
 * Settings content panels shown in the main area when a Settings sub-item is selected.
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { Users, Compass, Type, Download, BarChart3, MapPin } from 'lucide-react'
import ImportExportManager from '@/components/ImportExportManager'
import { useApp } from '@/contexts/AppContext'
import { FamilyInfo, ChecklistItem, FontFamilyChoice, FontSize } from '@/types'
import {
  FONT_FAMILIES,
  FONT_FAMILY_LABELS,
  FONT_SIZE_LABELS,
  FONT_SIZES,
} from '@/lib/constants'
import { calculateProgress } from '@/lib/utils'

interface SettingsContentProps {
  activeSettingsTab: string
  familyInfo: FamilyInfo
  onUpdateFamilyInfo: (field: keyof FamilyInfo, value: string | number) => void
  checklistItems: ChecklistItem[]
  metricsSettings: ReturnType<typeof useApp>['metricsSettings']
  onUpdateMetrics: (field: string, value: string) => void
}

export default function SettingsContent({
  activeSettingsTab,
  familyInfo,
  onUpdateFamilyInfo,
  checklistItems,
  metricsSettings,
  onUpdateMetrics,
}: SettingsContentProps) {
  const { displaySettings, setDisplaySettings } = useApp()
  const [isEditingFamily, setIsEditingFamily] = useState(false)
  const [isEditingMetrics, setIsEditingMetrics] = useState(false)

  const stats = useMemo(() => {
    const totalItems = checklistItems.reduce((acc, category) => acc + category.items.length, 0)
    const completedItems = checklistItems.reduce(
      (acc, category) => acc + category.items.filter((item) => item.completed).length,
      0
    )
    return { totalItems, completedItems, percentage: calculateProgress(completedItems, totalItems) }
  }, [checklistItems])

  const household = useMemo(() => {
    const people = (Number(familyInfo.adults) || 0) + (Number(familyInfo.children) || 0)
    const pets = Number(familyInfo.pets) || 0
    return { people, pets }
  }, [familyInfo])

  const updateDisplaySetting = useCallback(
    (field: keyof typeof displaySettings, value: string) => {
      setDisplaySettings((prev) => ({ ...prev, [field]: value }))
    },
    [setDisplaySettings]
  )

  if (activeSettingsTab === 'settings-family') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Users className="h-5 w-5 text-forest-600 dark:text-forest-400" />
          <h2 className="font-serif text-xl font-semibold text-forest-950 dark:text-sand-50">Family</h2>
        </div>

        <div className="tactical-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-sand-500 dark:text-sand-400">Household members and emergency plan details</p>
            <button
              onClick={() => setIsEditingFamily(!isEditingFamily)}
              className="text-xs font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors focus:outline-none focus:underline"
            >
              {isEditingFamily ? 'Save' : 'Edit'}
            </button>
          </div>

          {isEditingFamily ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {(['adults', 'children', 'pets'] as const).map((field) => (
                  <div key={field} className="min-w-0">
                    <label htmlFor={field} className="mb-1 block text-xs font-medium capitalize text-sand-500 dark:text-sand-400">
                      {field}
                    </label>
                    <input
                      id={field}
                      type="number"
                      min="0"
                      max="20"
                      value={familyInfo[field]}
                      onChange={(e) => onUpdateFamilyInfo(field, parseInt(e.target.value) || 0)}
                      className="input-field text-center text-sm py-2"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="location" className="mb-1 block text-xs font-medium uppercase text-sand-500 dark:text-sand-400">
                  Meeting place
                </label>
                <input
                  id="location"
                  type="text"
                  value={familyInfo.location ?? ''}
                  onChange={(e) => onUpdateFamilyInfo('location', e.target.value)}
                  placeholder="Home, school, or rally point"
                  className="input-field text-sm py-2"
                />
              </div>
              <div>
                <label htmlFor="specialNeeds" className="mb-1 block text-xs font-medium uppercase text-sand-500 dark:text-sand-400">
                  Special needs
                </label>
                <textarea
                  id="specialNeeds"
                  value={familyInfo.specialNeeds ?? ''}
                  onChange={(e) => onUpdateFamilyInfo('specialNeeds', e.target.value)}
                  placeholder="Medications, mobility, allergies"
                  rows={2}
                  className="input-field resize-none text-sm py-2"
                />
              </div>
              <div>
                <label htmlFor="emergencyPlan" className="mb-1 block text-xs font-medium uppercase text-sand-500 dark:text-sand-400">
                  Plan notes
                </label>
                <textarea
                  id="emergencyPlan"
                  value={familyInfo.emergencyPlan ?? ''}
                  onChange={(e) => onUpdateFamilyInfo('emergencyPlan', e.target.value)}
                  placeholder="Out-of-town contact, evacuation route"
                  rows={3}
                  className="input-field resize-none text-sm py-2"
                />
              </div>
              <button onClick={() => setIsEditingFamily(false)} className="btn-primary w-full text-sm">
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Adults', value: familyInfo.adults },
                  { label: 'Children', value: familyInfo.children },
                  { label: 'Pets', value: familyInfo.pets },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="min-w-0 rounded-lg border border-sand-200 bg-sand-50 p-3 dark:border-forest-700 dark:bg-forest-800/50"
                  >
                    <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">{item.value}</div>
                    <div className="text-xs font-medium uppercase tracking-tight text-sand-500 dark:text-sand-400">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-sand-200 pt-4 text-center dark:border-forest-700">
                <span className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-100 px-4 py-2 text-sm font-bold text-forest-700 dark:border-forest-700 dark:bg-forest-800 dark:text-forest-300">
                  {household.people} people{household.pets > 0 ? ` · ${household.pets} pets` : ''}
                </span>
              </div>
              {(familyInfo.location || familyInfo.specialNeeds || familyInfo.emergencyPlan) && (
                <div className="mt-4 space-y-2">
                  {familyInfo.location && (
                    <p className="flex items-start gap-2 text-sm text-sand-600 dark:text-sand-300">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest-500" />
                      <span>{familyInfo.location}</span>
                    </p>
                  )}
                  {familyInfo.specialNeeds && (
                    <p className="text-sm leading-relaxed text-sand-600 dark:text-sand-300">
                      <span className="font-semibold text-forest-700 dark:text-forest-300">Needs: </span>
                      {familyInfo.specialNeeds}
                    </p>
                  )}
                  {familyInfo.emergencyPlan && (
                    <p className="text-sm leading-relaxed text-sand-600 dark:text-sand-300">
                      <span className="font-semibold text-forest-700 dark:text-forest-300">Plan: </span>
                      {familyInfo.emergencyPlan}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  if (activeSettingsTab === 'settings-units') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Compass className="h-5 w-5 text-forest-600 dark:text-forest-400" />
          <h2 className="font-serif text-xl font-semibold text-forest-950 dark:text-sand-50">Units</h2>
        </div>

        <div className="tactical-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-sand-500 dark:text-sand-400">Measurement units used across the app</p>
            <button
              onClick={() => setIsEditingMetrics(!isEditingMetrics)}
              className="text-xs font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors focus:outline-none focus:underline"
            >
              {isEditingMetrics ? 'Done' : 'Edit'}
            </button>
          </div>

          {isEditingMetrics ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="volume" className="mb-1.5 block text-xs font-medium text-sand-500 dark:text-sand-400">
                  Volume
                </label>
                <select
                  id="volume"
                  value={metricsSettings.volume}
                  onChange={(e) => onUpdateMetrics('volume', e.target.value)}
                  className="select-field text-sm"
                >
                  <option value="gallons">Gallons</option>
                  <option value="liters">Liters</option>
                  <option value="quarts">Quarts</option>
                </select>
              </div>
              <div>
                <label htmlFor="weight" className="mb-1.5 block text-xs font-medium text-sand-500 dark:text-sand-400">
                  Weight
                </label>
                <select
                  id="weight"
                  value={metricsSettings.weight}
                  onChange={(e) => onUpdateMetrics('weight', e.target.value)}
                  className="select-field text-sm"
                >
                  <option value="pounds">Pounds</option>
                  <option value="kilograms">Kilograms</option>
                  <option value="ounces">Ounces</option>
                </select>
              </div>
              <div>
                <label htmlFor="temperature" className="mb-1.5 block text-xs font-medium text-sand-500 dark:text-sand-400">
                  Temperature
                </label>
                <select
                  id="temperature"
                  value={metricsSettings.temperature}
                  onChange={(e) => onUpdateMetrics('temperature', e.target.value)}
                  className="select-field text-sm"
                >
                  <option value="fahrenheit">Fahrenheit</option>
                  <option value="celsius">Celsius</option>
                </select>
              </div>
              <div>
                <label htmlFor="distance" className="mb-1.5 block text-xs font-medium text-sand-500 dark:text-sand-400">
                  Distance
                </label>
                <select
                  id="distance"
                  value={metricsSettings.distance}
                  onChange={(e) => onUpdateMetrics('distance', e.target.value)}
                  className="select-field text-sm"
                >
                  <option value="miles">Miles</option>
                  <option value="kilometers">Kilometers</option>
                  <option value="feet">Feet</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { label: 'Volume', value: metricsSettings.volume },
                { label: 'Weight', value: metricsSettings.weight },
                { label: 'Temperature', value: metricsSettings.temperature },
                { label: 'Distance', value: metricsSettings.distance },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg bg-sand-50 px-4 py-3 dark:bg-forest-800/50"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-sand-500 dark:text-sand-400">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold capitalize text-forest-700 dark:text-forest-300">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (activeSettingsTab === 'settings-appearance') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Type className="h-5 w-5 text-forest-600 dark:text-forest-400" />
          <h2 className="font-serif text-xl font-semibold text-forest-950 dark:text-sand-50">Font & Size</h2>
        </div>

        <div className="tactical-card p-5 space-y-6">
          <p className="text-sm text-sand-500 dark:text-sand-400">
            Adjust text appearance for easier reading.
          </p>

          <div>
            <label htmlFor="fontFamily" className="mb-2 block text-sm font-medium text-forest-800 dark:text-sand-200">
              Font
            </label>
            <select
              id="fontFamily"
              value={displaySettings.fontFamily}
              onChange={(e) => updateDisplaySetting('fontFamily', e.target.value as FontFamilyChoice)}
              className="select-field text-sm"
            >
              {FONT_FAMILIES.map((family) => (
                <option key={family} value={family}>
                  {FONT_FAMILY_LABELS[family]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-forest-800 dark:text-sand-200">
              Text size
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateDisplaySetting('fontSize', size as FontSize)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                    displaySettings.fontSize === size
                      ? 'border-forest-400 bg-forest-100 text-forest-800 dark:border-forest-600 dark:bg-forest-800 dark:text-forest-200'
                      : 'border-sand-200 bg-sand-50 text-sand-600 hover:border-forest-300 dark:border-forest-700 dark:bg-forest-800/50 dark:text-sand-300'
                  }`}
                >
                  {FONT_SIZE_LABELS[size]}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-sand-200 bg-sand-50 p-4 dark:border-forest-700 dark:bg-forest-800/50">
            <p className="text-sm text-sand-600 dark:text-sand-300">
              Preview: The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (activeSettingsTab === 'settings-data') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Download className="h-5 w-5 text-forest-600 dark:text-forest-400" />
          <h2 className="font-serif text-xl font-semibold text-forest-950 dark:text-sand-50">Data</h2>
        </div>
        <ImportExportManager
          familyInfo={familyInfo}
          checklistItems={checklistItems}
          metricsSettings={metricsSettings}
        />
      </div>
    )
  }

  if (activeSettingsTab === 'settings-progress') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-forest-600 dark:text-forest-400" />
          <h2 className="font-serif text-xl font-semibold text-forest-950 dark:text-sand-50">Overall Progress</h2>
        </div>

        <div className="tactical-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-sand-500 dark:text-sand-400">Checklist completion</span>
            <span className="text-3xl font-bold text-forest-600 dark:text-forest-400">{stats.percentage}%</span>
          </div>
          <div className="progress-bar mb-4">
            <div
              className="progress-bar-fill"
              style={{ width: `${stats.percentage}%` }}
              role="progressbar"
              aria-valuenow={stats.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sand-500 dark:text-sand-400">
              <span className="font-semibold text-forest-600 dark:text-forest-400">{stats.completedItems}</span> of{' '}
              {stats.totalItems} items complete
            </span>
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {stats.totalItems - stats.completedItems} remaining
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}
