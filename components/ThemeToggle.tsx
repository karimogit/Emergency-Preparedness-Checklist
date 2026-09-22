/**
 * ThemeToggle Component
 * Toggle button for switching between light and dark themes.
 * The first visit follows the operating system until the user chooses a theme.
 */

'use client'

import { Moon, Sun } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useApp()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const label = resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      onClick={toggleTheme}
      className="touch-target relative rounded-xl border border-sand-200 bg-sand-100 transition-all duration-300 group hover:bg-sand-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-sand-50 dark:border-forest-700 dark:bg-forest-800 dark:hover:bg-forest-700 dark:focus:ring-offset-forest-950"
      aria-label={label}
      title={theme === 'system' ? `${label}. Currently matching your system theme.` : label}
    >
      <div className="relative w-5 h-5">
        {resolvedTheme === 'light' ? (
          <Moon className="h-5 w-5 text-forest-600 dark:text-forest-400 transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>
      
      <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
        resolvedTheme === 'light' 
          ? 'bg-gradient-to-br from-indigo-400/10 to-purple-400/10' 
          : 'bg-gradient-to-br from-amber-400/10 to-orange-400/10'
      }`} />
    </button>
  )
}
