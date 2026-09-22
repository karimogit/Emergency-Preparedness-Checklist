/**
 * ConfirmDialog Component
 * Modal dialog for confirming destructive actions
 */

'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useCallback } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }, [onCancel])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const variantStyles = {
    danger: {
      icon: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      button: 'btn-danger',
    },
    warning: {
      icon: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      button: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white focus:ring-amber-500',
    },
    info: {
      icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      button: 'btn-primary',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div 
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="modal-content max-w-sm">
        <div className="relative p-6">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-lg text-sand-400 hover:text-sand-600 dark:hover:text-sand-300 hover:bg-sand-100 dark:hover:bg-forest-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${styles.icon}`}>
            <AlertTriangle className="h-7 w-7" />
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 id="dialog-title" className="text-lg font-bold text-forest-900 dark:text-sand-50 mb-2">
              {title}
            </h3>
            <p className="text-sm text-sand-600 dark:text-sand-400 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-5 py-2.5 rounded-lg font-medium shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
