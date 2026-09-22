/**
 * Import/Export Manager Component
 * Handles importing and exporting application data
 */

'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { Download, Upload, FileJson, FileSpreadsheet, FileText, Printer, Copy, Check, FileDown, Database, ShieldCheck, Lightbulb } from 'lucide-react'
import { FamilyInfo, ChecklistItem, MetricsSettings, ExportData } from '@/types'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { downloadFile, copyToClipboard, escapeCsv, formatSupplyWater, getSupplyTargets, localizeVolumeText } from '@/lib/utils'
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
    const targets = getSupplyTargets(data.familyInfo)
    const waterTarget = formatSupplyWater(targets, data.metricsSettings.volume)

    let text = '=== EMERGENCY PREPAREDNESS CHECKLIST ===\n\n'
    
    text += `Export Date: ${new Date().toLocaleString()}\n\n`
    text += `Family Information:\n`
    text += `- Adults: ${data.familyInfo.adults}\n`
    text += `- Children: ${data.familyInfo.children}\n`
    text += `- Pets: ${data.familyInfo.pets}\n`
    if (data.familyInfo.location) text += `- Meeting place: ${data.familyInfo.location}\n`
    if (data.familyInfo.specialNeeds) text += `- Special needs: ${data.familyInfo.specialNeeds}\n`
    if (data.familyInfo.emergencyPlan) text += `- Plan: ${data.familyInfo.emergencyPlan}\n`
    text += `- 72-hour water target: ${waterTarget}\n`
    text += `- Preferred volume unit: ${data.metricsSettings.volume}\n`
    text += '\n'
    
    data.checklistItems.forEach(category => {
      text += `\n${category.category}:\n`
      text += '=' + '='.repeat(category.category.length) + '\n'
      category.items.forEach(item => {
        const status = item.completed ? '[✓]' : '[ ]'
        const label = item.id === 'water-1'
          ? `Water — store ${waterTarget} for ${targets.days} days`
          : localizeVolumeText(item.text, data.metricsSettings.volume)
        text += `${status} ${label}\n`
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
    generatePDF(getAllData())
    showToast('info', 'Opening printable checklist')
  }, [getAllData, showToast])

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

  const summary = [
    { label: 'Checklist items', value: counts.checklistItems },
    { label: 'Pantry items', value: counts.pantryItems },
    { label: 'Books', value: counts.books },
    { label: 'Contacts', value: counts.contacts },
    { label: 'HAM frequencies', value: counts.frequencies },
    { label: 'Documents', value: counts.documents },
  ]

  const exportOptions = [
    {
      label: 'JSON backup',
      hint: 'Complete backup. Restore it on any device.',
      icon: FileJson,
      onClick: handleExportJSON,
      recommended: true,
    },
    {
      label: 'PDF',
      hint: 'Formatted checklist for a printed binder.',
      icon: FileDown,
      onClick: handleExportPDF,
    },
    {
      label: 'CSV',
      hint: 'Spreadsheet-friendly rows for analysis.',
      icon: FileSpreadsheet,
      onClick: handleExportCSV,
    },
    {
      label: 'Plain text',
      hint: 'Readable summary you can paste anywhere.',
      icon: FileText,
      onClick: handleExportText,
    },
    {
      label: copied ? 'Copied to clipboard' : 'Copy JSON',
      hint: 'Copy the backup to share or paste elsewhere.',
      icon: copied ? Check : Copy,
      onClick: handleCopyJSON,
    },
    {
      label: 'Print',
      hint: 'Open the print dialog for this page.',
      icon: Printer,
      onClick: handlePrint,
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-forest-900 dark:text-sand-50 mb-2">
          Import & Export Data
        </h2>
        <p className="text-sand-600 dark:text-sand-400 max-w-3xl">
          Back up your emergency preparedness data or restore it from a previous backup.
          Everything stays on this device until you export it.
        </p>
      </div>

      {/* Data Summary */}
      <section className="tactical-card overflow-hidden mb-6 animate-fade-in-up stagger-1" aria-label="Data summary">
        <div className="section-header">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-forest-600 dark:text-forest-400" aria-hidden="true" />
            <h3 className="text-lg font-bold text-forest-900 dark:text-sand-50">Your Data</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-sand-200 dark:divide-forest-700">
          {summary.map((item) => (
            <div key={item.label} className="px-4 py-5 text-center">
              <div className="text-2xl font-bold text-forest-600 dark:text-forest-400 tabular-nums">
                {item.value}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-sand-500 dark:text-sand-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Import Section */}
        <section className="tactical-card p-6 animate-fade-in-up stagger-2" aria-labelledby="import-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Upload className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
            <h3 id="import-heading" className="text-lg font-bold text-forest-900 dark:text-sand-50">Import a backup</h3>
          </div>
          <p className="text-sm text-sand-600 dark:text-sand-400 mb-5 leading-relaxed">
            Restore a JSON backup exported from this app. You will be asked to confirm before anything is replaced.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="sr-only"
            id="import-file"
            aria-label="Choose file to import"
            disabled={isImporting}
          />
          <label
            htmlFor="import-file"
            className={`btn-secondary w-full cursor-pointer focus-within:ring-2 focus-within:ring-forest-500 focus-within:ring-offset-2 ${
              isImporting ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span>{isImporting ? 'Reading file...' : 'Choose JSON file'}</span>
          </label>
          <p className="mt-4 flex items-start gap-2 text-xs text-sand-500 dark:text-sand-400">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-forest-500" aria-hidden="true" />
            Files are read locally in your browser and never uploaded.
          </p>
        </section>

        {/* Export Section */}
        <section className="tactical-card p-6 animate-fade-in-up stagger-3" aria-labelledby="export-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-forest-100 dark:bg-forest-800">
              <Download className="h-5 w-5 text-forest-600 dark:text-forest-400" aria-hidden="true" />
            </div>
            <h3 id="export-heading" className="text-lg font-bold text-forest-900 dark:text-sand-50">Export your data</h3>
          </div>
          <p className="text-sm text-sand-600 dark:text-sand-400 mb-5 leading-relaxed">
            Choose a format for backup, printing, or sharing.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {exportOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={option.onClick}
                  className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 dark:focus:ring-offset-forest-900 ${
                    option.recommended
                      ? 'border-forest-300 bg-forest-50/80 hover:border-forest-400 dark:border-forest-600 dark:bg-forest-800/50'
                      : 'border-sand-200 bg-white hover:border-forest-300 dark:border-forest-700 dark:bg-forest-900/50 dark:hover:border-forest-500'
                  }`}
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                    option.recommended
                      ? 'bg-forest-600 text-white dark:bg-forest-500'
                      : 'bg-sand-100 text-forest-600 group-hover:bg-forest-100 dark:bg-forest-800 dark:text-forest-300 dark:group-hover:bg-forest-700'
                  }`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-forest-900 dark:text-sand-50">{option.label}</span>
                      {option.recommended && (
                        <span className="rounded-full bg-forest-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white dark:bg-forest-500">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-sand-500 dark:text-sand-400">{option.hint}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      </div>

      {/* Tips */}
      <aside className="mt-6 tips-box animate-fade-in-up stagger-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-forest-800 dark:text-forest-200">Backup Tips</h3>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              'Export your data regularly so nothing important is lost.',
              'Keep backups in more than one place: cloud storage, a USB drive, or your emergency binder.',
              'JSON is the only format that restores everything, including household settings.',
              'CSV and text exports cover the checklist, pantry, contacts, and documents.',
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
