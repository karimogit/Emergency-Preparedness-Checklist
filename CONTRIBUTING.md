# Contributing to Emergency Preparedness Checklist

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Emergency-Preparedness-Checklist.git`
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Make your changes
5. Test your changes thoroughly
6. Commit with clear messages: `git commit -m 'Add: Description of feature'`
7. Push to your fork: `git push origin feature/my-feature`
8. Open a Pull Request

## Code Style

### TypeScript
- Use TypeScript for all new code
- Add proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes

### React
- Use functional components with hooks
- Use `useCallback` and `useMemo` for optimization
- Keep components focused and small
- Extract reusable logic into custom hooks

### Naming Conventions
- Components: PascalCase (e.g., `MyComponent.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useMyHook.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_ITEMS`)

### Comments
- Add JSDoc comments to all exported functions
- Explain complex logic with inline comments
- Keep comments up-to-date with code changes

## Testing

Before submitting a PR:
- Test on both light and dark modes
- Test on mobile and desktop
- Verify accessibility with keyboard navigation
- Check for console errors
- Test data persistence (localStorage)

## Pull Request Process

1. Update documentation for any new features
2. Add yourself to CONTRIBUTORS.md
3. Ensure all tests pass
4. Get approval from at least one maintainer
5. Squash commits if requested

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards others

## Questions?

Feel free to open an issue for any questions or concerns.

Thank you for contributing! 🎉
