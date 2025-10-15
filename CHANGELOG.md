# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-15

### Added
- **Dark Mode Support**: Full dark mode implementation with theme toggle
- **PWA Support**: Progressive Web App with offline functionality
- **Import/Export**: Import data from previous backups with validation
- **Search Functionality**: Search across all sections (pantry, contacts, books, etc.)
- **Sorting**: Sort items by multiple criteria
- **Bulk Operations**: Select and delete multiple items at once
- **Toast Notifications**: Real-time feedback for user actions
- **Error Boundaries**: Graceful error handling throughout the app
- **Context API**: Global state management for better performance
- **Custom Hooks**: Dedicated hooks for each data type
- **Utility Library**: Centralized helper functions
- **Constants**: Centralized configuration and constants
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Mobile Responsiveness**: Collapsible sidebar and touch-friendly interface
- **Print Support**: Enhanced print styles for checklists
- **Service Worker**: Offline support and caching
- **Confirmation Dialogs**: Confirm destructive actions
- **Loading States**: Better user feedback during operations

### Changed
- **Updated Next.js**: Upgraded from 14.0.4 to 15.0.3
- **Updated React**: Upgraded to 18.3.1
- **Updated TypeScript**: Upgraded to 5.6.3
- **Updated Tailwind CSS**: Upgraded to 3.4.14
- **Updated date-fns**: Upgraded to 4.1.0
- **Updated Lucide React**: Upgraded to 0.453.0
- **TypeScript Target**: Changed from ES5 to ES2015
- **Component Structure**: Refactored for better organization
- **State Management**: Moved from prop drilling to Context API
- **Performance**: Added memoization and optimization
- **UI/UX**: Enhanced with dark mode and better mobile support

### Fixed
- localStorage error handling
- Data persistence edge cases
- Mobile navigation issues
- Accessibility issues
- Type safety improvements

### Security
- Updated all dependencies to latest stable versions
- Fixed potential XSS vulnerabilities with input sanitization
- Improved data validation

## [1.0.0] - 2024-12-01

### Added
- Initial release
- Checklist with 200+ items across 10 categories
- Pantry management with expiry tracking
- Emergency contacts management
- HAM radio frequencies tracking
- Documents binder
- Books library
- Family information tracking
- Metrics settings (units)
- Export functionality (JSON, CSV, Text)
- Print functionality
- Copy to clipboard
- localStorage persistence
- Responsive design
- Color-coded categories
- Progress tracking
- Low stock alerts
- Expiring items alerts

### Features
- Two-column layout
- Category progress bars
- Family size-based recommendations
- Customizable units
- Essential item marking
- Notes fields
- Search within categories
- Data summary

[1.1.0]: https://github.com/KarimOsmanGH/Emergency-Preparedness-Checklist/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/KarimOsmanGH/Emergency-Preparedness-Checklist/releases/tag/v1.0.0
