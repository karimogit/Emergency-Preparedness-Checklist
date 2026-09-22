/**
 * ChecklistSection Component
 * Displays and manages the emergency preparedness checklist
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { CheckCircle, Circle, Users, Lightbulb, ChevronRight, Search, X, RotateCcw } from 'lucide-react'
import { ChecklistItem, FamilyInfo, MetricsSettings } from '@/types'
import { formatSupplyWater, getSupplyTargets, matchesSearch } from '@/lib/utils'
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

  const visibleCategories = useMemo(() => {
    const query = searchTerm.trim()
    if (!query) return checklistItems

    return checklistItems.flatMap(category => {
      if (matchesSearch(query, [category.category])) return [category]
      const items = category.items.filter(item => matchesSearch(query, [item.text]))
      return items.length > 0 ? [{ ...category, items }] : []
    })
  }, [checklistItems, searchTerm])

  const householdLabel = supplyTargets.pets > 0
    ? `${supplyTargets.people} people and ${supplyTargets.pets} pets`
    : `${supplyTargets.people} ${supplyTargets.people === 1 ? 'person' : 'people'}`

  // Get a color for category based on index
  const getCategoryColor = (index: number) => {
    const colors = [
      'from-forest-500 to-forest-600',
      'from-amber-500 to-amber-600',
      'from-emerald-500 to-emerald-600',
      'from-cyan-500 to-cyan-600',
      'from-violet-500 to-violet-600',
      'from-rose-500 to-rose-600',
      'from-orange-500 to-orange-600',
      'from-teal-500 to-teal-600',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <h2 className="text-2xl font-bold text-forest-900 dark:text-sand-50">Emergency Checklist</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 dark:bg-forest-800 border border-forest-200 dark:border-forest-700">
              <Users className="h-4 w-4 text-forest-600 dark:text-forest-400" aria-hidden="true" />
              <span className="text-sm font-medium text-forest-700 dark:text-forest-300">
                Planned for {householdLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              disabled={completedCount === 0}
              className="inline-flex items-center gap-2 rounded-full border border-sand-200 px-4 py-2 text-sm font-medium text-sand-600 transition-colors hover:border-sand-300 hover:text-forest-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-forest-700 dark:text-sand-300 dark:hover:text-sand-100"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset checks
            </button>
          </div>
        </div>
        <p className="text-sand-600 dark:text-sand-400 max-w-3xl">
          Work through the supplies, documents, and skills that matter in the first 72 hours.
          Water and food targets below follow your household size.
        </p>
      </div>

      <section className="mb-8 grid gap-3 sm:grid-cols-3" aria-label="72 hour supply targets">
        <div className="rounded-xl border border-forest-200 bg-forest-50/80 p-4 dark:border-forest-700 dark:bg-forest-900/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-600 dark:text-forest-300">Drinking water</p>
          <p className="mt-1 text-lg font-bold text-forest-900 dark:text-sand-50">{waterTarget}</p>
          <p className="mt-1 text-xs text-sand-600 dark:text-sand-400">1 gallon per person per day, plus an estimate for pets, for {supplyTargets.days} days.</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Food</p>
          <p className="mt-1 text-lg font-bold text-forest-900 dark:text-sand-50">{supplyTargets.days} days / person</p>
          <p className="mt-1 text-xs text-sand-600 dark:text-sand-400">Non-perishable food for each person. Keep pet food as its own supply.</p>
        </div>
        <div className="rounded-xl border border-sand-200 bg-sand-50 p-4 dark:border-forest-700 dark:bg-forest-900/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-sand-500 dark:text-sand-400">Household</p>
          <p className="mt-1 text-lg font-bold text-forest-900 dark:text-sand-50">{householdLabel}</p>
          <p className="mt-1 text-xs text-sand-600 dark:text-sand-400">Change adults, children, and pets in the sidebar to update these targets.</p>
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

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
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

      {/* Checklist Items */}
      {selectedCategory === null ? (
        visibleCategories.length === 0 ? (
          <p className="rounded-xl border border-dashed border-sand-300 px-6 py-10 text-center text-sm text-sand-500 dark:border-forest-700 dark:text-sand-400">
            No checklist items match “{searchTerm.trim()}”.
          </p>
        ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {visibleCategories.map((category) => {
            const source = checklistItems.find(item => item.id === category.id) ?? category
            const categoryIndex = checklistItems.findIndex(item => item.id === category.id)
            const progress = getCategoryProgress(source)
            return (
              <article
                key={category.id}
                className="flex flex-col tactical-card overflow-hidden h-[420px] animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 100}ms` }}
              >
                <header className="relative overflow-hidden px-6 py-5 border-b border-sand-200 dark:border-forest-700">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(categoryIndex)} opacity-5 dark:opacity-10`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-forest-900 dark:text-sand-50">{category.category}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        progress.percentage === 100 
                          ? 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300' 
                          : 'bg-sand-100 dark:bg-forest-800 text-sand-600 dark:text-sand-400'
                      }`}>
                        {progress.completedItems}/{progress.totalItems}
                      </span>
                    </div>
                    
                    <div className="w-full bg-sand-200 dark:bg-forest-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(categoryIndex)} transition-all duration-500`}
                        style={{ width: `${progress.percentage}%` }}
                        role="progressbar"
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </header>

                <div className="flex-1 p-5 overflow-y-auto">
                  <ul className="space-y-2.5">
                    {category.items.map((item, itemIndex) => {
                      const displayText = item.text || 'Untitled item'
                      
                      return (
                        <li 
                          key={item.id} 
                          className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                            item.completed 
                              ? 'bg-forest-50/80 dark:bg-forest-900/30 border border-forest-200/50 dark:border-forest-700/30' 
                              : 'hover:bg-sand-50 dark:hover:bg-forest-800/50 border border-transparent'
                          }`}
                          onClick={() => onUpdateItem(category.id, item.id, !item.completed)}
                          style={{ animationDelay: `${itemIndex * 30}ms` }}
                        >
                          <button
                            className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-forest-500 rounded-full"
                            aria-label={item.completed ? `Mark "${displayText}" as incomplete` : `Mark "${displayText}" as complete`}
                            onClick={(e) => {
                              e.stopPropagation()
                              onUpdateItem(category.id, item.id, !item.completed)
                            }}
                          >
                            {item.completed ? (
                              <CheckCircle className="h-5 w-5 text-forest-500 dark:text-forest-400" aria-hidden="true" />
                            ) : (
                              <Circle className="h-5 w-5 text-sand-300 dark:text-forest-600 group-hover:text-forest-400 transition-colors" aria-hidden="true" />
                            )}
                          </button>
                          
                          <span className={`flex-1 min-w-0 text-sm leading-relaxed break-words ${
                            item.completed 
                              ? 'line-through text-sand-400 dark:text-sand-600' 
                              : 'text-forest-800 dark:text-sand-200'
                          }`}>
                            {displayText}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </article>
            )
          })}
        </div>
        )
      ) : (
        <div className="tactical-card overflow-hidden animate-fade-in">
          {(() => {
            const category = visibleCategories.find(cat => cat.id === selectedCategory)
            const source = checklistItems.find(cat => cat.id === selectedCategory)
            if (!category || !source) {
              return (
                <p className="px-6 py-10 text-center text-sm text-sand-500 dark:text-sand-400">
                  Nothing in this category matches your search.
                </p>
              )
            }
            
            const progress = getCategoryProgress(source)
            const categoryIndex = checklistItems.findIndex(cat => cat.id === selectedCategory)
            
            return (
              <article>
                <header className="relative overflow-hidden px-6 py-5 border-b border-sand-200 dark:border-forest-700">
                  <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(categoryIndex)} opacity-5 dark:opacity-10`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-forest-700 transition-colors"
                          aria-label="Back to all categories"
                        >
                          <ChevronRight className="h-5 w-5 rotate-180 text-sand-500 dark:text-sand-400" />
                        </button>
                        <h3 className="text-lg font-bold text-forest-900 dark:text-sand-50">{category.category}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        progress.percentage === 100 
                          ? 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300' 
                          : 'bg-sand-100 dark:bg-forest-800 text-sand-600 dark:text-sand-400'
                      }`}>
                        {progress.completedItems}/{progress.totalItems}
                      </span>
                    </div>
                    
                    <div className="w-full bg-sand-200 dark:bg-forest-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(categoryIndex)} transition-all duration-500`}
                        style={{ width: `${progress.percentage}%` }}
                        role="progressbar"
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </header>

                <div className="p-6">
                  <ul className="space-y-2.5">
                    {category.items.map((item, itemIndex) => {
                      const displayText = item.text || 'Untitled item'
                      
                      return (
                        <li 
                          key={item.id} 
                          className={`group flex items-start gap-3 p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                            item.completed 
                              ? 'bg-forest-50/80 dark:bg-forest-900/30 border border-forest-200/50 dark:border-forest-700/30' 
                              : 'hover:bg-sand-50 dark:hover:bg-forest-800/50 border border-transparent'
                          }`}
                          onClick={() => onUpdateItem(category.id, item.id, !item.completed)}
                          style={{ animationDelay: `${itemIndex * 30}ms` }}
                        >
                          <button
                            className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-forest-500 rounded-full"
                            aria-label={item.completed ? `Mark "${displayText}" as incomplete` : `Mark "${displayText}" as complete`}
                            onClick={(e) => {
                              e.stopPropagation()
                              onUpdateItem(category.id, item.id, !item.completed)
                            }}
                          >
                            {item.completed ? (
                              <CheckCircle className="h-6 w-6 text-forest-500 dark:text-forest-400" aria-hidden="true" />
                            ) : (
                              <Circle className="h-6 w-6 text-sand-300 dark:text-forest-600 group-hover:text-forest-400 transition-colors" aria-hidden="true" />
                            )}
                          </button>
                          
                          <span className={`flex-1 min-w-0 text-sm leading-relaxed break-words ${
                            item.completed 
                              ? 'line-through text-sand-400 dark:text-sand-600' 
                              : 'text-forest-800 dark:text-sand-200'
                          }`}>
                            {displayText}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </article>
            )
          })()}
        </div>
      )}

      {/* Tips Section */}
      <aside className="mt-8 tips-box">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-forest-800 dark:text-forest-200">Pro Tips</h3>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              'Store water in food-grade containers and rotate every 6 months',
              'Keep a 3-day supply of non-perishable food per person',
              'Include comfort items for children (books, games, stuffed animals)',
              "Don't forget pet supplies and medications",
              'Keep important documents in a waterproof container',
              'Practice your emergency plan with your family regularly'
            ].map((tip, index) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-forest-900/30 border border-forest-200/50 dark:border-forest-700/30">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-600 dark:text-forest-400 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm text-forest-700 dark:text-forest-300 leading-relaxed">{tip}</span>
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
