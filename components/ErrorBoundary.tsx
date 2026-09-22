/**
 * Error Boundary Component
 * Catches and displays JavaScript errors in the component tree
 */

'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="modal-content max-w-md p-6 animate-scale-in">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-center text-forest-900 dark:text-sand-50 mb-2">Something went wrong</h2>
            <p className="text-sm text-center text-sand-600 dark:text-sand-400 leading-relaxed mb-5">
              Something unexpected happened. Your saved data is still on this device; refreshing the page should bring it back.
            </p>
            {this.state.error && (
              <details className="mb-5 rounded-lg border border-sand-200 dark:border-forest-700 bg-sand-50 dark:bg-forest-800/50">
                <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-sand-600 dark:text-sand-300 hover:text-forest-700 dark:hover:text-sand-100">
                  Technical details
                </summary>
                <pre className="px-3 pb-3 text-xs text-sand-700 dark:text-sand-300 overflow-auto whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
