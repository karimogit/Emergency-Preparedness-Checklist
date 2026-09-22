/**
 * ChecklistSection Component
 * Displays and manages the emergency preparedness checklist
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { CheckCircle, Circle, Users, Lightbulb, ChevronRight, Search, X, RotateCcw, Droplets } from 'lucide-react'
import { ChecklistItem, FamilyInfo, MetricsSettings } from '@/types'
import {
  formatDailyWaterRate,
  formatSupplyWater,
  getSupplyTargets,
  localizeVolumeText,
  matchesSearch,
} from '@/lib/utils'
import ConfirmDialog from './ConfirmDialog'

interface ChecklistSectionProps {
  checklistItems: ChecklistItem[]
  onUpdateItem: (categoryId: number, itemId: string, completed: boolean) => void
  onReset: () => void
  familyInfo: FamilyInfo
  metricsSettings: MetricsSettings
}

export default function ChecklistSection({ 
  checklistItems, 
  onUpdateItem, 
  onReset,
  familyInfo, 
  metricsSettings 
}: ChecklistSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  const selectCategory = useCallback((categoryId: number) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId)
  }, [])

  const getCategoryProgress = useCallback((category: ChecklistItem) => {
    const totalItems = category.items.length
    const completedItems = category.items.filter(item => item.completed).length
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    return { totalItems, completedItems, percentage }
  }, [])

  const completedCount = useMemo(
    () => checklistItems.reduce((sum, category) => sum + category.items.filter(item => item.completed).length, 0),
    [checklistItems]
  )

  const supplyTargets = useMemo(() => getSupplyTargets(familyInfo), [familyInfo])
  const waterTarget = formatSupplyWater(supplyTargets, metricsSettings.volume)
  const dailyRate = formatDailyWaterRate(metricsSettings.volume)
  const volume = metricsSettings.volume

  const getDisplayText = useCallback((item: { id: string; text: string }) => {
    const base = item.text || 'Untitled item'
    // Primary water store line: show household target in the selected unit
    if (item.id === 'water-1') {
      return `Water — store ${waterTarget} for ${supplyTargets.days} days`
    }
    return localizeVolumeText(base, volume)
  }, [waterTarget, supplyTargets.days, volume])

  const visibleCategories = useMemo(() => {
    const query = searchTerm.trim()
    if (!query) return checklistItems

    return checklistItems.flatMap(category => {
      if (matchesSearch(query, [category.category])) return [category]
      const items = category.items.filter(item =>
        matchesSearch(query, [getDisplayText(item), item.text])
      )
      return items.length > 0 ? [{ ...category, items }] : []
    })
  }, [checklistItems, searchTerm, getDisplayText])

  const householdLabel = supplyTargets.pets > 0
    ? `${supplyTargets.people} people and ${supplyTargets.pets} pets`
    : `${supplyTargets.people} ${supplyTargets.people === 1 ? 'person' : 'people'}`

  const tips = useMemo(() => [
    localizeVolumeText('Store water in food-grade containers and rotate every 6 months', volume),
    localizeVolumeText(`Aim for ${dailyRate} of drinking water per person per day`, volume),
    'Keep a 3-day supply of non-perishable food per person',
    'Include comfort items for children (books, games, stuffed animals)',
    "Don't forget pet supplies and medications",
    'Keep important documents in a waterproof container',
    'Practice your emergency plan with your family regularly',
  ], [volume, dailyRate])

  const getCategoryTheme = (index: number) => {
    const themes = [
      {
        bar: 'from-forest-500 to-emerald-600',
        border: 'border-forest-300 dark:border-forest-500',
        header: 'bg-forest-50 dark:bg-forest-800/80',
        badge: 'bg-forest-100 text-forest-800 dark:bg-forest-700 dark:text-forest-100',
      },
      {
        bar: 'from-amber-500 to-orange-500',
        border: 'border-amber-300 dark:border-amber-600',
        header: 'bg-amber-50 dark:bg-amber-950/40',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
      },
      {
        bar: 'from-sky-500 to-cyan-600',
        border: 'border-sky-300 dark:border-sky-600',
        header: 'bg-sky-50 dark:bg-sky-950/40',
        badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
      },
      {
        bar: 'from-violet-500 to-purple-600',
        border: 'border-violet-300 dark:border-violet-600',
        header: 'bg-violet-50 dark:bg-violet-950/40',
        badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
      },
      {
        bar: 'from-rose-500 to-pink-600',
        border: 'border-rose-300 dark:border-rose-600',
        header: 'bg-rose-50 dark:bg-rose-950/40',
        badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
      },
      {
        bar: 'from-teal-500 to-emerald-600',
        border: 'border-teal-300 dark:border-teal-600',
        header: 'bg-teal-50 dark:bg-teal-950/40',
        badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
      },
      {
        bar: 'from-orange-500 to-red-500',
        border: 'border-orange-300 dark:border-orange-600',
        header: 'bg-orange-50 dark:bg-orange-950/40',
        badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
      },
      {
        bar: 'from-indigo-500 to-blue-600',
        border: 'border-indigo-300 dark:border-indigo-600',
        header: 'bg-indigo-50 dark:bg-indigo-950/40',
        badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
      },
    ]
    return themes[index % themes.length]
  }

  const renderChecklistItem = (
    categoryId: number,
    item: ChecklistItem['items'][number],
    itemIndex: number,
    spacious = false
  ) => {
    const displayText = getDisplayText(item)

    return (
      <li
        key={item.id}
        className={`checklist-item group ${spacious ? 'p-4' : ''} ${item.completed ? 'completed' : ''}`}
        style={{ animationDelay: `${itemIndex * 30}ms` }}
      >
        <button
          type="button"
          className="mt-0.5 flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-forest-500"
          aria-pressed={item.completed}
          aria-label={item.completed ? `Mark "${displayText}" as incomplete` : `Mark "${displayText}" as complete`}
          onClick={() => onUpdateItem(categoryId, item.id, !item.completed)}
        >
          {item.completed ? (
            <CheckCircle className={`${spacious ? 'h-6 w-6' : 'h-5 w-5'} text-forest-600 dark:text-forest-300`} aria-hidden="true" />
          ) : (
            <Circle className={`${spacious ? 'h-6 w-6' : 'h-5 w-5'} text-sand-400 transition-colors group-hover:text-forest-500 dark:text-forest-400`} aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          className={`item-text min-w-0 flex-1 text-left text-sm leading-relaxed break-words focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 rounded ${
            item.completed
              ? 'text-sand-500 dark:text-sand-400'
              : 'text-forest-900 dark:text-sand-100'
          }`}
          onClick={() => onUpdateItem(categoryId, item.id, !item.completed)}
        >
          {displayText}
        </button>
      </li>
    )
  }

  return (
    <div className="p-5 sm:p-7">
      <div className="mb-8">
        <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-forest-600 dark:text-forest-400">
              72-hour readiness
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-forest-950 dark:text-sand-50">
              Emergency Checklist
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-lg border border-forest-200 bg-forest-50/70 px-3 py-2 dark:border-forest-700 dark:bg-forest-800/60">
              <Users className="h-4 w-4 text-forest-600 dark:text-forest-400" aria-hidden="true" />
              <span className="text-sm font-medium text-forest-700 dark:text-forest-300">
                {householdLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              disabled={completedCount === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-sand-200 px-3 py-2 text-sm font-medium text-sand-600 transition-colors hover:border-sand-300 hover:text-forest-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-forest-700 dark:text-sand-300 dark:hover:text-sand-100"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset checks
            </button>
          </div>
        </div>
        <p className="max-w-2xl text-sand-600 dark:text-sand-400">
          Work through the supplies, documents, and skills that matter in the first 72 hours.
          Water targets follow your household size and preferred units.
        </p>
      </div>

      <section className="mb-8 grid gap-4 sm:grid-cols-3" aria-label="72 hour supply targets">
        <div className="relative overflow-hidden rounded-2xl border-2 border-forest-300 bg-gradient-to-br from-forest-50 via-white to-cyan-50/40 p-5 dark:border-forest-500 dark:from-forest-900/70 dark:via-forest-900/40 dark:to-forest-800/30">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-forest-400/10 blur-2xl" aria-hidden="true" />
          <div className="relative">
            <div className="mb-2 flex items-center gap-2">
              <Droplets className="h-4 w-4 text-forest-600 dark:text-forest-400" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-600 dark:text-forest-300">
                Drinking water
              </p>
            </div>
            <p className="font-serif text-2xl font-semibold text-forest-950 dark:text-sand-50">{waterTarget}</p>
            <p className="mt-2 text-xs leading-relaxed text-sand-600 dark:text-sand-400">
              {dailyRate} per person per day
              {supplyTargets.pets > 0 ? ', plus an estimate for pets' : ''}, for {supplyTargets.days} days.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50/90 via-white to-sand-50 p-5 dark:border-amber-600 dark:from-amber-950/25 dark:via-forest-900/40 dark:to-forest-900/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Food</p>
          <p className="mt-2 font-serif text-2xl font-semibold text-forest-950 dark:text-sand-50">
            {supplyTargets.days} days / person
          </p>
          <p className="mt-2 text-xs leading-relaxed text-sand-600 dark:text-sand-400">
            Non-perishable food for each person. Keep pet food as its own supply.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-sky-300 bg-gradient-to-br from-sky-50 via-white to-indigo-50/40 p-5 dark:border-sky-600 dark:from-sky-950/30 dark:via-forest-900/40 dark:to-indigo-950/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Household</p>
          <p className="mt-2 font-serif text-2xl font-semibold text-forest-950 dark:text-sand-50">{householdLabel}</p>
          <p className="mt-2 text-xs leading-relaxed text-sand-600 dark:text-sand-400">
            Change adults, children, and pets in Settings to update these targets.
          </p>
        </div>
      </section>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sand-400" aria-hidden="true" />
        <input
          id="checklist-search"
          name="checklist-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search checklist items..."
          className="input-field pl-12 pr-12"
          aria-label="Search checklist items"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-sand-400 hover:bg-sand-100 hover:text-sand-600 dark:hover:bg-forest-800 dark:hover:text-sand-300"
            aria-label="Clear checklist search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`category-pill ${selectedCategory === null ? 'active' : ''}`}
            aria-pressed={selectedCategory === null}
          >
            All Categories
          </button>
          {checklistItems.map((category) => {
            const progress = getCategoryProgress(category)
            return (
              <button
                type="button"
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
                aria-pressed={selectedCategory === category.id}
              >
                <span>{category.category}</span>
                <span className="ml-1.5 text-xs opacity-70">
                  {progress.completedItems}/{progress.totalItems}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {selectedCategory === null ? (
        visibleCategories.length === 0 ? (
          <p className="rounded-xl border border-dashed border-sand-300 px-6 py-10 text-center text-sm text-sand-500 dark:border-forest-700 dark:text-sand-400">
            No checklist items match “{searchTerm.trim()}”.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 rounded-2xl bg-sand-100/90 p-3 dark:bg-black/25 sm:p-4 lg:grid-cols-2">
            {visibleCategories.map((category) => {
              const source = checklistItems.find(item => item.id === category.id) ?? category
              const categoryIndex = checklistItems.findIndex(item => item.id === category.id)
              const progress = getCategoryProgress(source)
              const theme = getCategoryTheme(categoryIndex)
              return (
                <article
                  key={category.id}
                  className={`flex min-h-[320px] flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-card animate-fade-in-up dark:bg-[#173017] sm:min-h-[380px] ${theme.border}`}
                  style={{ animationDelay: `${categoryIndex * 80}ms` }}
                >
                  <div className={`h-1.5 bg-gradient-to-r ${theme.bar}`} aria-hidden="true" />
                  <header className={`relative overflow-hidden border-b px-5 py-4 ${theme.header} ${theme.border}`}>
                    <div className="relative z-10">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="font-serif text-lg font-semibold text-forest-950 dark:text-sand-50">
                          {category.category}
                        </h3>
                        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                          progress.percentage === 100
                            ? 'bg-forest-100 text-forest-700 dark:bg-forest-800 dark:text-forest-300'
                            : theme.badge
                        }`}>
                          {progress.completedItems}/{progress.totalItems}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/80 dark:bg-forest-950/50">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-500`}
                          style={{ width: `${progress.percentage}%` }}
                          role="progressbar"
                          aria-valuenow={progress.percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) =>
                        renderChecklistItem(category.id, item, itemIndex)
                      )}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        )
      ) : (
        (() => {
            const category = visibleCategories.find(cat => cat.id === selectedCategory)
            const source = checklistItems.find(cat => cat.id === selectedCategory)
            const categoryIndex = checklistItems.findIndex(cat => cat.id === selectedCategory)
            const theme = getCategoryTheme(Math.max(categoryIndex, 0))

            if (!category || !source) {
              return (
                <div className="overflow-hidden rounded-2xl border-2 border-sand-300 bg-white shadow-card animate-fade-in dark:border-forest-600 dark:bg-[#173017]">
                  <p className="px-6 py-10 text-center text-sm text-sand-500 dark:text-sand-400">
                    Nothing in this category matches your search.
                  </p>
                </div>
              )
            }

            const progress = getCategoryProgress(source)

            return (
              <div className={`overflow-hidden rounded-2xl border-2 bg-white shadow-card animate-fade-in dark:bg-[#173017] ${theme.border}`}>
              <article>
                <div className={`h-1.5 bg-gradient-to-r ${theme.bar}`} aria-hidden="true" />
                <header className={`relative overflow-hidden border-b px-5 py-4 ${theme.header} ${theme.border}`}>
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(null)}
                          className="rounded-lg p-1.5 transition-colors hover:bg-white/70 dark:hover:bg-forest-700"
                          aria-label="Back to all categories"
                        >
                          <ChevronRight className="h-5 w-5 rotate-180 text-sand-500 dark:text-sand-400" />
                        </button>
                        <h3 className="font-serif text-lg font-semibold text-forest-950 dark:text-sand-50">
                          {category.category}
                        </h3>
                      </div>
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                        progress.percentage === 100
                          ? 'bg-forest-100 text-forest-700 dark:bg-forest-800 dark:text-forest-300'
                          : theme.badge
                      }`}>
                        {progress.completedItems}/{progress.totalItems}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/80 dark:bg-forest-950/50">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-500`}
                        style={{ width: `${progress.percentage}%` }}
                        role="progressbar"
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </header>

                <div className="p-4 sm:p-6">
                  <ul className="space-y-2.5">
                    {category.items.map((item, itemIndex) =>
                      renderChecklistItem(category.id, item, itemIndex, true)
                    )}
                  </ul>
                </div>
              </article>
              </div>
            )
        })()
      )}

      <aside className="tips-box mt-8">
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-forest-800 dark:text-forest-200">Pro Tips</h3>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {tips.map((tip, index) => (
              <li
                key={tip}
                className="flex items-start gap-3 rounded-lg border border-forest-200/50 bg-white/50 p-3 dark:border-forest-700/30 dark:bg-forest-900/30"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-bold text-forest-600 dark:bg-forest-800 dark:text-forest-400">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-forest-700 dark:text-forest-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <ConfirmDialog
        isOpen={confirmReset}
        title="Reset checklist"
        message="This clears every check mark. Your household notes, pantry, contacts, and other records stay as they are."
        confirmText="Reset checks"
        cancelText="Keep progress"
        variant="warning"
        onConfirm={() => {
          onReset()
          setConfirmReset(false)
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  )
}
