/**
 * Import/Export Manager Component
 * Handles importing and exporting application data
 */

'use client'

import { useState, useRef } from 'react'
import { Download, Upload, FileJson, FileSpreadsheet, FileText, Printer, Copy, Check, FileDown } from 'lucide-react'
import { FamilyInfo, ChecklistItem } from '@/types'
import { useToast } from './Toast'
import { downloadFile, copyToClipboard } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'
import { generatePDF } from '@/lib/pdfExport'

interface ImportExportManagerProps {
  familyInfo: FamilyInfo
  checklistItems: ChecklistItem[]
  metricsSettings: {
    volume: string
    weight: string
    temperature: string
    distance: string
  }
}

export default function ImportExportManager({
  familyInfo,
  checklistItems,
  metricsSettings
}: ImportExportManagerProps) {
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'txt'>('json')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const getAllData = () => {
    return {
      familyInfo,
      checklistItems,
      pantryItems: JSON.parse(localStorage.getItem(STORAGE_KEYS.PANTRY_ITEMS) || '[]'),
      books: JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || '[]'),
      contacts: JSON.parse(localStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS) || '[]'),
      frequencies: JSON.parse(localStorage.getItem(STORAGE_KEYS.HAM_FREQUENCIES) || '[]'),
      documents: JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS) || '[]'),
      metricsSettings,
      exportDate: new Date().toISOString(),
      appVersion: '1.1.0'
    }
  }

  const handleExportJSON = () => {
    const data = getAllData()
    const json = JSON.stringify(data, null, 2)
    downloadFile(
      json,
      `emergency-prep-backup-${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    )
    showToast('success', 'Data exported as JSON successfully')
  }

  const handleExportCSV = () => {
    const data = getAllData()
    let csv = 'Category,Name,Details,Status\n'
    
    // Add checklist items
    data.checklistItems.forEach(category => {
      category.items.forEach(item => {
        csv += `"${category.category}","${item.text}","Quantity: ${item.quantity}","${item.completed ? 'Completed' : 'Pending'}"\n`
      })
    })
    
    downloadFile(
      csv,
      `emergency-prep-checklist-${new Date().toISOString().split('T')[0]}.csv`,
      'text/csv'
    )
    showToast('success', 'Data exported as CSV successfully')
  }

  const handleExportText = () => {
    const data = getAllData()
    let text = '=== EMERGENCY PREPAREDNESS CHECKLIST ===\n\n'
    
    text += `Export Date: ${new Date().toLocaleString()}\n\n`
    text += `Family Information:\n`
    text += `- Adults: ${data.familyInfo.adults}\n`
    text += `- Children: ${data.familyInfo.children}\n`
    text += `- Pets: ${data.familyInfo.pets}\n\n`
    
    data.checklistItems.forEach(category => {
      text += `\n${category.category}:\n`
      text += '=' + '='.repeat(category.category.length) + '\n'
      category.items.forEach(item => {
        const status = item.completed ? '[✓]' : '[ ]'
        text += `${status} ${item.text} (Qty: ${item.quantity})\n`
      })
    })
    
    downloadFile(
      text,
      `emergency-prep-checklist-${new Date().toISOString().split('T')[0]}.txt`,
      'text/plain'
    )
    showToast('success', 'Data exported as text successfully')
  }

  const handleCopyJSON = async () => {
    const data = getAllData()
    const json = JSON.stringify(data, null, 2)
    const success = await copyToClipboard(json)
    
    if (success) {
      setCopied(true)
      showToast('success', 'Data copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } else {
      showToast('error', 'Failed to copy to clipboard')
    }
  }

  const handlePrint = () => {
    window.print()
    showToast('info', 'Opening print dialog')
  }

  const handleExportPDF = () => {
    const data = getAllData()
    generatePDF(data)
    showToast('success', 'Generating PDF...')
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        
        // Validate the data structure
        if (!data.familyInfo || !data.checklistItems) {
          throw new Error('Invalid data format')
        }

        // Import data to localStorage
        if (data.familyInfo) {
          localStorage.setItem(STORAGE_KEYS.FAMILY_INFO, JSON.stringify(data.familyInfo))
        }
        if (data.checklistItems) {
          localStorage.setItem(STORAGE_KEYS.CHECKLIST_ITEMS, JSON.stringify(data.checklistItems))
        }
        if (data.pantryItems) {
          localStorage.setItem(STORAGE_KEYS.PANTRY_ITEMS, JSON.stringify(data.pantryItems))
        }
        if (data.books) {
          localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(data.books))
        }
        if (data.contacts) {
          localStorage.setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, JSON.stringify(data.contacts))
        }
        if (data.frequencies) {
          localStorage.setItem(STORAGE_KEYS.HAM_FREQUENCIES, JSON.stringify(data.frequencies))
        }
        if (data.documents) {
          localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(data.documents))
        }
        if (data.metricsSettings) {
          localStorage.setItem(STORAGE_KEYS.METRICS_SETTINGS, JSON.stringify(data.metricsSettings))
        }

        showToast('success', 'Data imported successfully! Refreshing page...')
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } catch (error) {
        console.error('Import error:', error)
        showToast('error', 'Failed to import data. Please check the file format.')
      }
    }
    
    reader.readAsText(file)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getDataCounts = () => {
    const data = getAllData()
    return {
      checklistItems: data.checklistItems.reduce((sum, cat) => sum + cat.items.length, 0),
      pantryItems: data.pantryItems.length,
      books: data.books.length,
      contacts: data.contacts.length,
      frequencies: data.frequencies.length,
      documents: data.documents.length
    }
  }

  const counts = getDataCounts()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Import & Export Data
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Backup your emergency preparedness data or import from a previous backup.
        </p>
      </div>

      {/* Data Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Data Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-brown-600 dark:text-brown-400">
              {counts.checklistItems}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Checklist Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brown-600 dark:text-brown-400">
              {counts.pantryItems}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pantry Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brown-600 dark:text-brown-400">
              {counts.books}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Books</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brown-600 dark:text-brown-400">
              {counts.contacts}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brown-600 dark:text-brown-400">
              {counts.frequencies}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">HAM Frequencies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brown-600 dark:text-brown-400">
              {counts.documents}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Documents</div>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Import Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Import a previously exported backup file. This will overwrite your current data.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          id="import-file"
        />
        <label
          htmlFor="import-file"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span>Choose File to Import</span>
        </label>
      </div>

      {/* Export Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Export Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Export your data in various formats for backup or sharing.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileJson className="h-5 w-5" />
            <span>Export as JSON</span>
          </button>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileSpreadsheet className="h-5 w-5" />
            <span>Export as CSV</span>
          </button>
          
          <button
            onClick={handleExportText}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span>Export as Text</span>
          </button>
          
          <button
            onClick={handleCopyJSON}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FileDown className="h-5 w-5" />
            <span>Export as PDF</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors"
          >
            <Printer className="h-5 w-5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          💡 Backup Tips
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Export your data regularly to avoid losing important information</li>
          <li>• Store backups in multiple locations (cloud storage, USB drive, etc.)</li>
          <li>• JSON format is recommended for complete backup with all features</li>
          <li>• CSV format is useful for importing into spreadsheet applications</li>
        </ul>
      </div>
    </div>
  )
}
