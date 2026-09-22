/**
 * Import/Export Manager Component
 * Handles importing and exporting application data
 */

'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { Download, Upload, FileJson, FileSpreadsheet, FileText, Printer, Copy, Check, FileDown } from 'lucide-react'
import { FamilyInfo, ChecklistItem, MetricsSettings, ExportData } from '@/types'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { downloadFile, copyToClipboard, escapeCsv } from '@/lib/utils'
import { STORAGE_KEYS, APP_CONFIG } from '@/lib/constants'
import { generatePDF } from '@/lib/pdfExport'
import { parseBackup } from '@/lib/validations'
import {
  DEFAULT_BOOKS,
  DEFAULT_CONTACTS,
  DEFAULT_DOCUMENTS,
  DEFAULT_HAM_FREQUENCIES,
  DEFAULT_PANTRY_ITEMS,
} from '@/lib/defaultData'

function readStoredList<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback
  const raw = window.localStorage.getItem(key)
  if (raw === null) return fallback
  try {
    const value = JSON.parse(raw) as unknown
    return Array.isArray(value) ? value as T[] : fallback
  } catch {
    return fallback
  }
}

interface ImportExportManagerProps {
  familyInfo: FamilyInfo
  checklistItems: ChecklistItem[]
  metricsSettings: MetricsSettings
}

export default function ImportExportManager({
  familyInfo,
  checklistItems,
  metricsSettings
}: ImportExportManagerProps) {
  const [copied, setCopied] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [pendingImport, setPendingImport] = useState<ExportData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const getAllData = useCallback((): ExportData => {
    return {
      familyInfo,
      checklistItems,
      pantryItems: readStoredList(STORAGE_KEYS.PANTRY_ITEMS, DEFAULT_PANTRY_ITEMS),
      books: readStoredList(STORAGE_KEYS.BOOKS, DEFAULT_BOOKS),
      contacts: readStoredList(STORAGE_KEYS.EMERGENCY_CONTACTS, DEFAULT_CONTACTS),
      frequencies: readStoredList(STORAGE_KEYS.HAM_FREQUENCIES, DEFAULT_HAM_FREQUENCIES),
      documents: readStoredList(STORAGE_KEYS.DOCUMENTS, DEFAULT_DOCUMENTS),
      metricsSettings,
      exportDate: new Date().toISOString(),
      appVersion: APP_CONFIG.VERSION
    }
  }, [familyInfo, checklistItems, metricsSettings])

  const handleExportJSON = useCallback(() => {
    const data = getAllData()
    const json = JSON.stringify(data, null, 2)
    downloadFile(
      json,
      `emergency-prep-backup-${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    )
    showToast('success', 'Data exported as JSON successfully')
  }, [getAllData, showToast])

  const handleExportCSV = useCallback(() => {
    const data = getAllData()
    const rows = ['Type,Category,Name,Details,Status']

    data.checklistItems.forEach(category => {
      category.items.forEach(item => {
        rows.push([
          escapeCsv('Checklist'),
          escapeCsv(category.category),
          escapeCsv(item.text),
          escapeCsv(`Quantity: ${item.quantity}`),
          escapeCsv(item.completed ? 'Completed' : 'Pending'),
        ].join(','))
      })
    })

    data.pantryItems.forEach(item => {
      rows.push([
        escapeCsv('Pantry'),
        escapeCsv(item.category),
        escapeCsv(item.name),
        escapeCsv(`${item.quantity} ${item.unit}; expires ${item.expiryDate || 'n/a'}`),
        escapeCsv(item.notes),
      ].join(','))
    })

    data.contacts.forEach(contact => {
      rows.push([
        escapeCsv('Contact'),
        escapeCsv(contact.relationship),
        escapeCsv(contact.name),
        escapeCsv([contact.phone, contact.email, contact.address].filter(Boolean).join(' · ')),
        escapeCsv(contact.isEmergencyContact ? 'Priority' : ''),
      ].join(','))
    })

    data.documents.forEach(document => {
      rows.push([
        escapeCsv('Document'),
        escapeCsv(document.category),
        escapeCsv(document.name),
        escapeCsv(document.location),
        escapeCsv(document.isDigital ? 'Digital' : 'Physical'),
      ].join(','))
    })
    
    downloadFile(
      rows.join('\n'),
      `emergency-prep-backup-${new Date().toISOString().split('T')[0]}.csv`,
      'text/csv'
    )
    showToast('success', 'Data exported as CSV successfully')
  }, [getAllData, showToast])

  const handleExportText = useCallback(() => {
    const data = getAllData()
    let text = '=== EMERGENCY PREPAREDNESS CHECKLIST ===\n\n'
    
    text += `Export Date: ${new Date().toLocaleString()}\n\n`
    text += `Family Information:\n`
    text += `- Adults: ${data.familyInfo.adults}\n`
    text += `- Children: ${data.familyInfo.children}\n`
    text += `- Pets: ${data.familyInfo.pets}\n`
    if (data.familyInfo.location) text += `- Meeting place: ${data.familyInfo.location}\n`
    if (data.familyInfo.specialNeeds) text += `- Special needs: ${data.familyInfo.specialNeeds}\n`
    if (data.familyInfo.emergencyPlan) text += `- Plan: ${data.familyInfo.emergencyPlan}\n`
    text += '\n'
    
    data.checklistItems.forEach(category => {
      text += `\n${category.category}:\n`
      text += '=' + '='.repeat(category.category.length) + '\n'
      category.items.forEach(item => {
        const status = item.completed ? '[✓]' : '[ ]'
        text += `${status} ${item.text} (Qty: ${item.quantity})\n`
      })
    })

    if (data.contacts.length > 0) {
      text += '\nEmergency Contacts:\n'
      text += '====================\n'
      data.contacts.forEach(contact => {
        text += `- ${contact.name} (${contact.relationship}): ${contact.phone}\n`
      })
    }

    if (data.pantryItems.length > 0) {
      text += '\nPantry:\n'
      text += '=======\n'
      data.pantryItems.forEach(item => {
        text += `- ${item.name}: ${item.quantity} ${item.unit}`
        if (item.expiryDate) text += `, expires ${item.expiryDate}`
        text += '\n'
      })
    }
    
    downloadFile(
      text,
      `emergency-prep-checklist-${new Date().toISOString().split('T')[0]}.txt`,
      'text/plain'
    )
    showToast('success', 'Data exported as text successfully')
  }, [getAllData, showToast])

  const handleCopyJSON = useCallback(async () => {
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
  }, [getAllData, showToast])

  const handlePrint = useCallback(() => {
    window.print()
    showToast('info', 'Opening print dialog')
  }, [showToast])

  const handleExportPDF = useCallback(() => {
    const data = getAllData()
    generatePDF(data)
    showToast('success', 'Generating PDF...')
  }, [getAllData, showToast])

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = parseBackup(JSON.parse(content))
        if (!parsed.success) {
          showToast('error', parsed.error)
          return
        }
        setPendingImport(parsed.data)
      } catch (error) {
        console.error('Import error:', error)
        showToast('error', 'Failed to import data. Please check the file format.')
      } finally {
        setIsImporting(false)
      }
    }
    
    reader.onerror = () => {
      showToast('error', 'Failed to read file')
      setIsImporting(false)
    }
    
    reader.readAsText(file)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [showToast])

  const applyImport = useCallback(() => {
    if (!pendingImport) return
    const data = pendingImport
    localStorage.setItem(STORAGE_KEYS.FAMILY_INFO, JSON.stringify(data.familyInfo))
    localStorage.setItem(STORAGE_KEYS.CHECKLIST_ITEMS, JSON.stringify(data.checklistItems))
    if (Array.isArray(data.pantryItems)) {
      localStorage.setItem(STORAGE_KEYS.PANTRY_ITEMS, JSON.stringify(data.pantryItems))
    }
    if (Array.isArray(data.books)) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(data.books))
    }
    if (Array.isArray(data.contacts)) {
      localStorage.setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, JSON.stringify(data.contacts))
    }
    if (Array.isArray(data.frequencies)) {
      localStorage.setItem(STORAGE_KEYS.HAM_FREQUENCIES, JSON.stringify(data.frequencies))
    }
    if (Array.isArray(data.documents)) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(data.documents))
    }
    if (data.metricsSettings) {
      localStorage.setItem(STORAGE_KEYS.METRICS_SETTINGS, JSON.stringify(data.metricsSettings))
    }
    showToast('success', 'Data imported successfully! Refreshing page...')
    window.setTimeout(() => window.location.reload(), 600)
  }, [pendingImport, showToast])

  const counts = useMemo(() => {
    const data = getAllData()
    return {
      checklistItems: data.checklistItems.reduce((sum, cat) => sum + cat.items.length, 0),
      pantryItems: data.pantryItems.length,
      books: data.books.length,
      contacts: data.contacts.length,
      frequencies: data.frequencies.length,
      documents: data.documents.length
    }
  }, [getAllData])

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
      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
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
      </section>

      {/* Import Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Upload className="h-5 w-5 mr-2" aria-hidden="true" />
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
          aria-label="Choose file to import"
          disabled={isImporting}
        />
        <label
          htmlFor="import-file"
          className={`inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800 ${
            isImporting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          <span>{isImporting ? 'Importing...' : 'Choose File to Import'}</span>
        </label>
      </section>

      {/* Export Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Download className="h-5 w-5 mr-2" aria-hidden="true" />
          Export Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Export your data in various formats for backup or sharing.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <FileJson className="h-5 w-5" aria-hidden="true" />
            <span>Export as JSON</span>
          </button>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
            <span>Export as CSV</span>
          </button>
          
          <button
            onClick={handleExportText}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            <span>Export as Text</span>
          </button>
          
          <button
            onClick={handleCopyJSON}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <FileDown className="h-5 w-5" aria-hidden="true" />
            <span>Export as PDF</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Printer className="h-5 w-5" aria-hidden="true" />
            <span>Print</span>
          </button>
        </div>
      </section>

      {/* Tips */}
      <aside className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          💡 Backup Tips
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Export your data regularly to avoid losing important information</li>
          <li>• Store backups in multiple locations (cloud storage, USB drive, etc.)</li>
          <li>• JSON format is recommended for complete backup with all features</li>
          <li>• CSV and text exports include the checklist, pantry, contacts, and documents</li>
        </ul>
      </aside>

      <ConfirmDialog
        isOpen={pendingImport !== null}
        title="Replace current data?"
        message="Importing this backup overwrites the household, checklist, and any sections included in the file."
        confirmText="Import backup"
        cancelText="Cancel"
        variant="warning"
        onConfirm={applyImport}
        onCancel={() => setPendingImport(null)}
      />
    </div>
  )
}
