# Emergency Preparedness Checklist - Development Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Key Features](#key-features)
5. [Development Guide](#development-guide)
6. [API Reference](#api-reference)

## Project Overview

Emergency Preparedness Checklist is a comprehensive Next.js application designed to help families and individuals prepare for emergency situations. The application provides tools for tracking supplies, managing contacts, organizing documents, and exporting data.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Date Handling**: date-fns 4.1
- **Storage**: Browser localStorage
- **PWA**: Service Worker implementation

## Architecture

### State Management
The application uses a combination of:
- **Context API** (`contexts/AppContext.tsx`): Global app state (theme, family info, metrics)
- **Custom Hooks** (`hooks/`): Encapsulated localStorage logic with type safety
- **Local State**: Component-level state with React hooks

### Data Flow
1. User interactions trigger state updates
2. State changes are persisted to localStorage via custom hooks
3. Components re-render with new data
4. No external API calls - fully offline-capable

## File Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   ├── globals.css         # Global styles and Tailwind
│   ├── robots.ts           # SEO robots configuration
│   └── sitemap.ts          # SEO sitemap generation
├── components/
│   ├── BooksManager.tsx           # Books tracking component
│   ├── BulkActions.tsx           # Bulk operations toolbar
│   ├── ChecklistSection.tsx      # Main checklist display
│   ├── ConfirmDialog.tsx         # Reusable confirmation dialog
│   ├── DocumentsBinder.tsx       # Documents management
│   ├── EmergencyContacts.tsx     # Contact management
│   ├── ErrorBoundary.tsx         # Error handling boundary
│   ├── HamRadioFrequencies.tsx   # HAM radio frequencies
│   ├── ImportExportManager.tsx   # Data import/export
│   ├── PantryManager.tsx         # Pantry inventory
│   ├── SearchBar.tsx             # Reusable search component
│   ├── SortableHeader.tsx        # Sortable table headers
│   ├── ThemeToggle.tsx           # Dark mode toggle
│   └── Toast.tsx                 # Notification system
├── contexts/
│   └── AppContext.tsx      # Global state context
├── hooks/
│   ├── useBooks.ts         # Books management hook
│   ├── useContacts.ts      # Contacts management hook
│   ├── useDebounce.ts      # Debounce hook
│   ├── useDocuments.ts     # Documents management hook
│   ├── useHamFrequencies.ts # Frequencies management hook
│   ├── useLocalStorage.ts  # localStorage wrapper hook
│   └── usePantryItems.ts   # Pantry management hook
├── lib/
│   ├── constants.ts        # Application constants
│   ├── pdfExport.ts        # PDF generation utility
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript type definitions
└── public/
    ├── manifest.json       # PWA manifest
    ├── sw.js              # Service worker
    ├── offline.html       # Offline fallback page
    └── robots.txt         # SEO robots file
```

## Key Features

### 1. Data Persistence
All data is stored in browser localStorage:
- Automatic saves on every change
- No server required
- Survives page refreshes
- Export/import capabilities

### 2. Dark Mode
Full dark mode support:
- System preference detection
- Manual toggle
- Persisted preference
- Tailwind dark: classes

### 3. PWA Support
Progressive Web App features:
- Installable on devices
- Offline functionality
- Service worker caching
- Manifest configuration

### 4. Accessibility
WCAG AA compliant:
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### 5. Performance
Optimized for speed:
- Memoized computations
- Debounced searches
- Code splitting ready
- Minimal re-renders

## Development Guide

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Adding a New Feature

1. **Create types** in `types/index.ts`
2. **Add constants** in `lib/constants.ts`
3. **Create custom hook** in `hooks/`
4. **Build component** in `components/`
5. **Integrate** in `app/page.tsx`

### Example: Adding a New Section

```typescript
// 1. Define type
export interface NewItem {
  id: string
  name: string
  category: string
}

// 2. Create hook
export function useNewItems() {
  const [items, setItems] = useLocalStorage<NewItem[]>('newItems', [])
  
  const addItem = useCallback((item: Omit<NewItem, 'id'>) => {
    const newItem = { ...item, id: generateId() }
    setItems(prev => [...prev, newItem])
  }, [setItems])
  
  return { items, addItem }
}

// 3. Create component
export default function NewItemsManager() {
  const { items, addItem } = useNewItems()
  // Component implementation
}
```

### Best Practices

1. **Type Safety**: Always use TypeScript types
2. **Error Handling**: Wrap localStorage calls in try-catch
3. **Memoization**: Use useMemo and useCallback for expensive operations
4. **Accessibility**: Add ARIA labels to interactive elements
5. **Dark Mode**: Use dark: classes for all colors
6. **Testing**: Test localStorage edge cases

### Common Patterns

#### localStorage Hook Pattern
```typescript
const [data, setData] = useLocalStorage<Type>('key', defaultValue)
```

#### Memoized Calculation
```typescript
const result = useMemo(() => expensiveCalculation(data), [data])
```

#### Debounced Search
```typescript
const debouncedTerm = useDebounce(searchTerm, 300)
useEffect(() => {
  performSearch(debouncedTerm)
}, [debouncedTerm])
```

## API Reference

### Hooks

#### useLocalStorage
```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, Error | null]
```
Manages localStorage with React state synchronization.

#### useDebounce
```typescript
function useDebounce<T>(value: T, delay: number): T
```
Debounces a value with specified delay.

#### useApp
```typescript
function useApp(): {
  theme: Theme
  setTheme: (theme: Theme) => void
  familyInfo: FamilyInfo
  setFamilyInfo: (info: FamilyInfo) => void
  metricsSettings: MetricsSettings
  setMetricsSettings: (settings: MetricsSettings) => void
}
```
Accesses global application context.

### Utility Functions

#### generateId
```typescript
function generateId(): string
```
Generates unique ID for items.

#### formatDate
```typescript
function formatDate(dateString: string, format?: 'short' | 'long'): string
```
Formats date strings.

#### getExpiryStatus
```typescript
function getExpiryStatus(expiryDate: string): ExpiryStatus
```
Calculates expiry status with color coding.

#### calculateProgress
```typescript
function calculateProgress(completed: number, total: number): number
```
Calculates progress percentage.

### Components

#### ConfirmDialog
```typescript
interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}
```

#### SearchBar
```typescript
interface SearchBarProps {
  placeholder?: string
  onSearch: (term: string) => void
  className?: string
}
```

#### Toast
```typescript
const { showToast } = useToast()
showToast(type: 'success' | 'error' | 'warning' | 'info', message: string, duration?: number)
```

## Testing

### Manual Testing Checklist

- [ ] All tabs navigate correctly
- [ ] Data persists after page refresh
- [ ] Search filters items correctly
- [ ] Dark mode toggles properly
- [ ] Export functions work (JSON, CSV, Text, PDF)
- [ ] Import restores data correctly
- [ ] Mobile responsive layout works
- [ ] Accessibility features function (keyboard nav, screen readers)
- [ ] Print functionality works
- [ ] PWA installs correctly
- [ ] Offline mode functions

### Browser Compatibility

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review code comments
