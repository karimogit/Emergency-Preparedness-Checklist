/**
 * PDF Export Utility
 * Handles PDF generation for checklists
 */

import { FamilyInfo, ChecklistItem, PantryItem, EmergencyContact, Book, HamFrequency, Document } from '@/types'

/**
 * Generate a printable HTML version of the data
 * This is a basic implementation - for more advanced PDF features,
 * consider integrating a library like jsPDF or Puppeteer
 */
export function generatePrintableHTML(data: {
  familyInfo: FamilyInfo
  checklistItems: ChecklistItem[]
  pantryItems: PantryItem[]
  contacts: EmergencyContact[]
  books: Book[]
  frequencies: HamFrequency[]
  documents: Document[]
}): string {
  const { familyInfo, checklistItems, pantryItems, contacts, books, frequencies, documents } = data

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Emergency Preparedness Checklist</title>
      <style>
        @media print {
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #8B4513; border-bottom: 2px solid #8B4513; padding-bottom: 10px; }
          h2 { color: #555; margin-top: 30px; }
          h3 { color: #666; margin-top: 20px; }
          .section { page-break-inside: avoid; margin-bottom: 20px; }
          .item { margin-left: 20px; }
          .checkbox { display: inline-block; width: 15px; height: 15px; border: 1px solid #000; margin-right: 10px; }
          .completed { background-color: #8B4513; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
        }
      </style>
    </head>
    <body>
      <h1>Emergency Preparedness Checklist</h1>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      
      <div class="section">
        <h2>Family Information</h2>
        <p><strong>Adults:</strong> ${familyInfo.adults}</p>
        <p><strong>Children:</strong> ${familyInfo.children}</p>
        <p><strong>Pets:</strong> ${familyInfo.pets}</p>
        <p><strong>Total Family Members:</strong> ${familyInfo.adults + familyInfo.children + familyInfo.pets}</p>
      </div>

      <div class="section">
        <h2>Checklist Items</h2>
        ${checklistItems.map(category => `
          <h3>${category.category}</h3>
          ${category.items.map(item => `
            <div class="item">
              <span class="checkbox ${item.completed ? 'completed' : ''}"></span>
              ${item.text} (Qty: ${item.quantity})
            </div>
          `).join('')}
        `).join('')}
      </div>

      ${pantryItems.length > 0 ? `
        <div class="section">
          <h2>Pantry Items</h2>
          <table>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
            </tr>
            ${pantryItems.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.quantity} ${item.unit}</td>
                <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}

      ${contacts.length > 0 ? `
        <div class="section">
          <h2>Emergency Contacts</h2>
          <table>
            <tr>
              <th>Name</th>
              <th>Relationship</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
            ${contacts.map(contact => `
              <tr>
                <td>${contact.name}</td>
                <td>${contact.relationship}</td>
                <td>${contact.phone}</td>
                <td>${contact.email || 'N/A'}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}

      ${books.length > 0 ? `
        <div class="section">
          <h2>Essential Books</h2>
          <table>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Location</th>
            </tr>
            ${books.map(book => `
              <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>${book.location}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}

      ${frequencies.length > 0 ? `
        <div class="section">
          <h2>HAM Radio Frequencies</h2>
          <table>
            <tr>
              <th>Frequency</th>
              <th>Description</th>
              <th>Location/Type</th>
            </tr>
            ${frequencies.map(freq => `
              <tr>
                <td>${freq.frequency}</td>
                <td>${freq.description}</td>
                <td>${freq.location}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}

      ${documents.length > 0 ? `
        <div class="section">
          <h2>Important Documents</h2>
          <table>
            <tr>
              <th>Document</th>
              <th>Category</th>
              <th>Location</th>
              <th>Type</th>
            </tr>
            ${documents.map(doc => `
              <tr>
                <td>${doc.name}</td>
                <td>${doc.category}</td>
                <td>${doc.location}</td>
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
export function printChecklist(data: any): void {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    const html = generatePrintableHTML(data)
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    
    // Wait for content to load then print
    printWindow.addEventListener('load', () => {
      printWindow.print()
    })
  }
}

/**
 * Generate PDF by opening print dialog
 * Alias for printChecklist for backward compatibility
 */
export const generatePDF = printChecklist
