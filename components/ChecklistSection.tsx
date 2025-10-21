'use client'

import { useState } from 'react'
import { CheckCircle, Circle, AlertTriangle, Users, ChevronDown, ChevronRight } from 'lucide-react'
import { ChecklistItem, FamilyInfo } from '@/types'

interface ChecklistSectionProps {
  checklistItems: ChecklistItem[]
  onUpdateItem: (categoryId: number, itemId: string, completed: boolean) => void
  familyInfo: FamilyInfo
  metricsSettings: {
    volume: string
    weight: string
    temperature: string
    distance: string
  }
}

export default function ChecklistSection({ checklistItems, onUpdateItem, familyInfo, metricsSettings }: ChecklistSectionProps) {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<number>>(new Set())

  const toggleCategory = (categoryId: number) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const getCategoryProgress = (category: ChecklistItem) => {
    const totalItems = category.items.length
    const completedItems = category.items.filter(item => item.completed).length
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    return { totalItems, completedItems, percentage }
  }

  const convertWaterText = (text: string) => {
    if (text.includes('gallon') && metricsSettings.volume !== 'gallons') {
      if (metricsSettings.volume === 'liters') {
        return text.replace('gallon', 'liter').replace('gallons', 'liters')
      } else if (metricsSettings.volume === 'quarts') {
        return text.replace('gallon', 'quart').replace('gallons', 'quarts')
      }
    }
    return text
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Checklist</h2>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Recommended for {familyInfo.adults + familyInfo.children + familyInfo.pets} family members
            </span>
          </div>
        </div>
        <p className="text-gray-600">
          Complete these essential items to ensure your family is prepared for any emergency. 
          Quantities are automatically adjusted based on your family size.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {checklistItems.map((category) => {
            const progress = getCategoryProgress(category)
            
            return (
              <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="bg-gradient-to-r from-brown-50 to-brown-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                    </div>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-1 rounded-lg hover:bg-brown-200 dark:hover:bg-brown-700 transition-colors"
                      aria-label={collapsedCategories.has(category.id) ? 'Expand category' : 'Collapse category'}
                    >
                      {collapsedCategories.has(category.id) ? (
                        <ChevronRight className="h-5 w-5 text-brown-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-brown-600" />
                      )}
                    </button>
                  </div>
                  
                  {/* Category Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs text-gray-500">{progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-brown-500 to-brown-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {!collapsedCategories.has(category.id) && (
                  <div className="p-6">
                    <div className="space-y-3">
                      {category.items.map((item) => {
                        const displayText = convertWaterText(item.text)
                        
                        return (
                          <div 
                            key={item.id} 
                            className={`checklist-item ${item.completed ? 'completed' : ''}`}
                          >
                            <button
                              onClick={() => onUpdateItem(category.id, item.id, !item.completed)}
                              className="flex-shrink-0"
                            >
                              {item.completed ? (
                                <CheckCircle className="h-6 w-6 text-brown-600" />
                              ) : (
                                <Circle className="h-6 w-6 text-gray-400 hover:text-brown-500" />
                              )}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <p className={`item-text text-sm font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {displayText}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-brown-50 to-brown-100 border border-brown-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-brown-800 mb-3">💡 Pro Tips</h3>
        <ul className="space-y-2 text-sm text-brown-700">
          <li>• Store water in food-grade containers and rotate every 6 months</li>
          <li>• Keep a 3-day supply of non-perishable food per person</li>
          <li>• Include comfort items for children (books, games, stuffed animals)</li>
          <li>• Don't forget pet supplies and medications</li>
          <li>• Keep important documents in a waterproof container</li>
          <li>• Practice your emergency plan with your family regularly</li>
        </ul>
      </div>
    </div>
  )
} 