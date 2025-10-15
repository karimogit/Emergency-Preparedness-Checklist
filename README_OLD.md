# Emergency Preparedness Checklist

A comprehensive Next.js application for emergency preparedness planning and management. This app helps users organize their emergency supplies, contacts, documents, and preparedness plans in one centralized location.

**Version 1.1.0** - Now with dark mode, PWA support, improved accessibility, and enhanced features!

## ✨ New in Version 1.1.0

- **🌙 Dark Mode** - Full dark mode support with system preference detection
- **📱 PWA Support** - Install as a native app on any device, works offline
- **♿ Enhanced Accessibility** - WCAG AA compliant with full keyboard navigation
- **⚡ Performance Optimizations** - Memoization, debouncing, and optimized renders
- **📥 Import/Export** - Import previous backups with full data restoration
- **🔍 Search & Filter** - Search across all sections with real-time filtering
- **📊 Bulk Operations** - Select and manage multiple items at once
- **🎨 Improved UI/UX** - Better mobile responsiveness and user experience
- **📄 PDF Export** - Generate professionally formatted PDF checklists
- **🔔 Toast Notifications** - Real-time feedback for all actions

## 🌟 Features

### 📋 Comprehensive Checklist
- **10 Categories** with 200+ essential items
- **Checkable items** - Track your progress
- **Family-based recommendations** - Adjusts quantities based on family size
- **Two-column responsive layout** - Optimized for all screen sizes

### 🏠 Family Management
- **Family size tracking** - Adults, children, and pets
- **Automatic quantity adjustments** - Recommendations scale with family size
- **Compact sidebar display** - Always visible family information

### 📏 Metrics Settings
- **Customizable units** - Choose between metric and imperial
- **Volume options** - Gallons, liters, quarts
- **Weight options** - Pounds, kilograms, ounces
- **Temperature options** - Fahrenheit, Celsius
- **Distance options** - Miles, kilometers, feet

### 🥫 Pantry Management
- **Color-coded categories** - Easy visual organization
- **Expiry date tracking** - Automatic alerts for expiring items
- **Low stock alerts** - Never run out of essential supplies
- **Quantity management** - Track current and minimum stock levels
- **Example items included** - 8 pre-filled items to get started

### 📚 Books & Resources
- **Essential books tracking** - Store your preparedness library
- **Category organization** - Medical, survival, food preservation, etc.
- **Location tracking** - Know where each book is stored
- **Color-coded categories** - Visual organization system

### 📞 Emergency Contacts
- **Comprehensive contact management** - All important numbers in one place
- **Relationship categorization** - Emergency services, medical, work, etc.
- **Color-coded relationships** - Easy visual identification
- **Multiple contact methods** - Phone, email, address

### 📻 HAM Radio Frequencies
- **20 pre-filled frequencies** - Emergency and local communications
- **Multiple bands covered** - 2m, 70cm, HF bands
- **Emergency frequencies** - International and national calling frequencies
- **Color-coded locations** - Emergency, local, long distance, weather

### 📄 Documents Binder
- **Important document tracking** - Birth certificates, passports, insurance
- **Digital/physical tracking** - Know what's stored where
- **Expiry date management** - Track document expiration
- **Color-coded categories** - Personal ID, financial, medical, etc.

### 💾 Data Import/Export & Backup
- **Multiple export formats** - JSON, CSV, Text, and PDF formats
- **Import functionality** - Restore data from previous backups
- **Complete data backup** - Export all your preparedness data
- **PDF generation** - Create professional PDF checklists
- **Print functionality** - Print clean, formatted checklists
- **Clipboard support** - Copy data to clipboard for sharing
- **Data summary** - Overview of all your stored information

### 💾 Data Persistence
- **Browser localStorage** - All data saved automatically
- **Cross-session persistence** - Data survives browser restarts
- **No server required** - Complete offline functionality
- **Private and secure** - Data never leaves your device

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KarimOsmanGH/Emergency-Preparedness-Checklist.git
   cd Emergency-Preparedness-Checklist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4 with dark mode
- **Icons**: Lucide React
- **Date Handling**: date-fns 4.1
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Storage**: Browser localStorage
- **PWA**: Service Worker with offline support
- **State Management**: Context API + Custom Hooks

## 📱 Features Overview

### Main Checklist Categories
1. **Water & Hydration** - Water storage, filters, purification
2. **Food & Nutrition** - Non-perishable foods, cooking supplies
3. **Medical & First Aid** - Comprehensive medical supplies
4. **Tools & Equipment** - Survival tools, gas masks, compass
5. **Electronics & Communication** - Radios, powerbanks, solar panels
6. **Personal Care & Hygiene** - Clothing, toiletries, protective gear
7. **Shelter & Comfort** - Blankets, sleeping bags, thermal protection
8. **Documents & Money** - Important documents, cash, precious metals
9. **Special Items** - Baby items, prostheses, special needs
10. **Disaster Preparedness** - Planning, skills, family coordination

### Export/Import Options
- **JSON Export** - Complete data backup for restoring to another device
- **JSON Import** - Restore data from previous backups
- **CSV Export** - Spreadsheet format for analysis and sharing
- **Text Export** - Human-readable format perfect for printing
- **PDF Export** - Professional formatted PDF for printing or sharing
- **Print Function** - Clean, formatted checklist for physical backup
- **Copy to Clipboard** - Quick sharing of JSON data

### Color-Coded Organization
- **Pantry**: Orange (canned), Yellow (grains), Blue (beverages), Purple (snacks), Green (condiments)
- **Books**: Red (medical), Orange (survival), Yellow (food), Green (preparedness), Blue (navigation)
- **Contacts**: Red (emergency), Blue (medical), Green (neighbor), Purple (work), Yellow (insurance)
- **Documents**: Blue (ID), Green (financial), Red (medical), Yellow (insurance), Purple (legal)
- **HAM Radio**: Red (emergency), Blue (local), Green (long distance), Yellow (weather)

## 🎯 Use Cases

### For Families
- **Emergency planning** - Complete family preparedness
- **Supply tracking** - Know what you have and what you need
- **Contact management** - All emergency contacts in one place
- **Document organization** - Important papers tracked and organized
- **Data backup** - Export and share preparedness plans

### For Preppers
- **Comprehensive checklist** - 200+ essential items covered
- **HAM radio management** - Professional frequency tracking
- **Resource library** - Essential books and materials
- **Advanced planning** - Strategic preparedness tasks
- **Data portability** - Export data for offline access

### For Emergency Responders
- **Contact management** - Professional emergency contacts
- **Document tracking** - Important paperwork organization
- **Communication planning** - HAM radio frequency management
- **Resource inventory** - Equipment and supply tracking
- **Team coordination** - Share preparedness data with team members

## 🔧 Customization

### Adding New Items
- All sections support adding custom items
- Categories can be customized
- Color coding automatically applies

### Modifying Categories
- Edit category colors in the respective component files
- Add new categories to the dropdown lists
- Customize category names and descriptions

### Data Export/Import
- Data is stored in browser localStorage
- Can be exported/imported via browser developer tools
- Multiple export formats available
- No external dependencies for data storage

## 📊 Data Structure

### Family Information
```typescript
interface FamilyInfo {
  adults: number
  children: number
  pets: number
  specialNeeds: string
  location: string
  emergencyPlan: string
}
```

### Checklist Items
```typescript
interface ChecklistItem {
  id: number
  category: string
  items: ChecklistSubItem[]
}

interface ChecklistSubItem {
  id: string
  text: string
  completed: boolean
  quantity: number
}
```

### Pantry Items
```typescript
interface PantryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  expiryDate: string
  minQuantity: number
  notes: string
}
```

## 🎁 Premium Notion Template

Looking for a more comprehensive emergency preparedness solution? Check out our premium [Notion Emergency Preparedness Checklist Template](https://www.notion.com/templates/emergency-preparedness-checklist) featuring:

- **Advanced planning tools** - More detailed preparedness workflows
- **Team collaboration** - Share plans with family members
- **Advanced templates** - Pre-built emergency scenarios
- **Integration capabilities** - Connect with other Notion databases
- **Professional layouts** - Enhanced visual organization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Emergency Preparedness Community** - For comprehensive item lists and best practices
- **HAM Radio Community** - For frequency information and emergency communication protocols
- **Next.js Team** - For the excellent framework
- **Tailwind CSS** - For the beautiful styling system
- **Notion** - For the premium template platform

## 📞 Support

If you have any questions or need support:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

## 🔄 Version History

### Version 1.1.0 (Latest)
- Added dark mode with system preference detection
- Implemented PWA support for offline functionality
- Enhanced accessibility (WCAG AA compliant)
- Added data import functionality
- Implemented search and filtering across all sections
- Added bulk operations support
- Performance optimizations with memoization
- Improved mobile responsiveness
- Added PDF export capability
- Implemented toast notification system
- Updated all dependencies to latest versions
- Added comprehensive error boundaries

### Version 1.0.0
- Initial release
- Core checklist functionality
- Pantry, books, contacts, HAM radio, documents management
- Data export in JSON, CSV, and text formats
- Family size management
- Metrics settings

---

**Stay prepared, stay safe!** 🛡️ 