/**
 * PDF Export Utility
 * Handles PDF generation for checklists
 */

import { FamilyInfo, ChecklistItem, PantryItem, EmergencyContact, Book, HamFrequency, Document, MetricsSettings } from '@/types'
import { escapeHtml, formatDate, formatSupplyWater, getSupplyTargets, localizeVolumeText } from '@/lib/utils'
import { DEFAULT_METRICS_SETTINGS } from '@/lib/defaultData'

/**
 * Generate a printable HTML version of the data
 */
export function generatePrintableHTML(data: {
  familyInfo: FamilyInfo
  checklistItems: ChecklistItem[]
  pantryItems: PantryItem[]
  contacts: EmergencyContact[]
  books: Book[]
  frequencies: HamFrequency[]
  documents: Document[]
  metricsSettings?: MetricsSettings
}): string {
  const { familyInfo, checklistItems, pantryItems, contacts, books, frequencies, documents } = data
  const metrics = data.metricsSettings ?? DEFAULT_METRICS_SETTINGS
  const supplyTargets = getSupplyTargets(familyInfo)
  const waterTarget = formatSupplyWater(supplyTargets, metrics.volume)

  const displayItemText = (item: { id: string; text: string }) => {
    if (item.id === 'water-1') {
      return `Water — store ${waterTarget} for ${supplyTargets.days} days`
    }
    return localizeVolumeText(item.text || 'Untitled item', metrics.volume)
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Emergency Preparedness Checklist</title>
      <style>
        body { font-family: Georgia, 'Times New Roman', serif; margin: 24px; color: #1a2e1a; line-height: 1.45; }
        h1 { color: #254d25; border-bottom: 2px solid #3d7a3d; padding-bottom: 10px; font-size: 1.75rem; }
        h2 { color: #2d5f2d; margin-top: 28px; font-size: 1.25rem; }
        h3 { color: #3d7a3d; margin-top: 18px; font-size: 1.05rem; }
        .section { page-break-inside: avoid; margin-bottom: 20px; }
        .item { margin: 6px 0 6px 8px; }
        .checkbox { display: inline-block; width: 12px; height: 12px; border: 1px solid #254d25; margin-right: 8px; vertical-align: middle; }
        .completed { background-color: #3d7a3d; }
        .meta { color: #5e4a35; font-size: 0.95rem; }
        .target { background: #f0f7f0; border: 1px solid #bbd8bb; padding: 12px 14px; border-radius: 8px; margin: 12px 0; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; font-family: system-ui, sans-serif; font-size: 0.9rem; }
        th, td { border: 1px solid #dcebdc; padding: 8px; text-align: left; }
        th { background-color: #f0f7f0; }
        @media print {
          body { margin: 16px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>Emergency Preparedness Checklist</h1>
      <p class="meta"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      
      <div class="section">
        <h2>Family Information</h2>
        <p><strong>Adults:</strong> ${familyInfo.adults}</p>
        <p><strong>Children:</strong> ${familyInfo.children}</p>
        <p><strong>Pets:</strong> ${familyInfo.pets}</p>
        <p><strong>People:</strong> ${familyInfo.adults + familyInfo.children}</p>
        ${familyInfo.location ? `<p><strong>Meeting place:</strong> ${escapeHtml(familyInfo.location)}</p>` : ''}
        ${familyInfo.specialNeeds ? `<p><strong>Special needs:</strong> ${escapeHtml(familyInfo.specialNeeds)}</p>` : ''}
        ${familyInfo.emergencyPlan ? `<p><strong>Plan:</strong> ${escapeHtml(familyInfo.emergencyPlan)}</p>` : ''}
        <div class="target">
          <strong>72-hour drinking water target:</strong> ${escapeHtml(waterTarget)}
          <span class="meta"> (volume unit: ${escapeHtml(metrics.volume)})</span>
        </div>
      </div>

      <div class="section">
        <h2>Checklist Items</h2>
        ${checklistItems.map(category => `
          <h3>${escapeHtml(category.category)}</h3>
          ${category.items.map(item => `
            <div class="item">
              <span class="checkbox ${item.completed ? 'completed' : ''}"></span>
              ${escapeHtml(displayItemText(item))}
            </div>
          `).join('')}
        `).join('')}
      </div>

      ${(pantryItems ?? []).length > 0 ? `
        <div class="section">
          <h2>Pantry Items</h2>
          <table>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
            </tr>
            ${(pantryItems ?? []).map(item => `
              <tr>
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.category)}</td>
                <td>${escapeHtml(item.quantity)} ${escapeHtml(item.unit)}</td>
                <td>${escapeHtml(item.expiryDate ? formatDate(item.expiryDate) : '')}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}

      ${(contacts ?? []).length > 0 ? `
        <div class="section">
          <h2>Emergency Contacts</h2>
          <table>
            <tr>
              <th>Name</th>
              <th>Relationship</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
            ${(contacts ?? []).map(contact => `
              <tr>
                <td>${escapeHtml(contact.name)}</td>
                <td>${escapeHtml(contact.relationship)}</td>
                <td>${escapeHtml(contact.phone)}</td>
                <td>${escapeHtml(contact.email || 'N/A')}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}

      ${(books ?? []).length > 0 ? `
        <div class="section">
          <h2>Essential Books</h2>
          <table>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Location</th>
            </tr>
            ${(books ?? []).map(book => `
              <tr>
                <td>${escapeHtml(book.title)}</td>
                <td>${escapeHtml(book.author)}</td>
                <td>${escapeHtml(book.category)}</td>
                <td>${escapeHtml(book.location)}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}

      ${(frequencies ?? []).length > 0 ? `
        <div class="section">
          <h2>HAM Radio Frequencies</h2>
          <table>
            <tr>
              <th>Frequency</th>
              <th>Description</th>
              <th>Location/Type</th>
            </tr>
            ${(frequencies ?? []).map(freq => `
              <tr>
                <td>${escapeHtml(freq.frequency)}</td>
                <td>${escapeHtml(freq.description)}</td>
                <td>${escapeHtml(freq.location)}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}

      ${(documents ?? []).length > 0 ? `
        <div class="section">
          <h2>Important Documents</h2>
          <table>
            <tr>
              <th>Document</th>
              <th>Category</th>
              <th>Location</th>
              <th>Type</th>
            </tr>
            ${(documents ?? []).map(doc => `
              <tr>
                <td>${escapeHtml(doc.name)}</td>
                <td>${escapeHtml(doc.category)}</td>
                <td>${escapeHtml(doc.location)}</td>
                <td>${doc.isDigital ? 'Digital' : 'Physical'}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}

      <div class="section">
        <p style="margin-top: 40px; text-align: center; color: #666;">
          <strong>Stay prepared, stay safe!</strong>
        </p>
      </div>
    </body>
    </html>
  `
}

/**
 * Trigger print dialog with custom content
 */
export function printChecklist(data: {
  familyInfo: FamilyInfo
  checklistItems: ChecklistItem[]
  pantryItems?: PantryItem[]
  contacts?: EmergencyContact[]
  books?: Book[]
  frequencies?: HamFrequency[]
  documents?: Document[]
  metricsSettings?: MetricsSettings
}): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const html = generatePrintableHTML({
    familyInfo: data.familyInfo,
    checklistItems: data.checklistItems,
    pantryItems: data.pantryItems ?? [],
    contacts: data.contacts ?? [],
    books: data.books ?? [],
    frequencies: data.frequencies ?? [],
    documents: data.documents ?? [],
    metricsSettings: data.metricsSettings,
  })
  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  window.setTimeout(() => printWindow.print(), 250)
}

/**
 * Generate PDF by opening print dialog
 * Alias for printChecklist for backward compatibility
 */
export const generatePDF = printChecklist
