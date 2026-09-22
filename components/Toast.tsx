/**
 * Toast Notification Component
 * Displays temporary notification messages
 */

'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, AlertTriangle, Info, X, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((type: ToastType, message: string, duration: number = 3000) => {
    const id = `${Date.now()}-${Math.random()}`
    const toast: Toast = { id, type, message, duration }
    
    setToasts(prev => [...prev, toast])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-stretch gap-3 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-4 sm:right-4 sm:items-end sm:p-0">
        {toasts.map((toast, index) => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onClose={() => removeToast(toast.id)}
            index={index} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose, index }: { toast: Toast; onClose: () => void; index: number }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  }

  const styles = {
    success: {
      container: 'bg-forest-50 dark:bg-forest-900/90 border-forest-200 dark:border-forest-700',
      icon: 'text-forest-500 dark:text-forest-400 bg-forest-100 dark:bg-forest-800',
      text: 'text-forest-800 dark:text-forest-200',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/90 border-red-200 dark:border-red-700',
      icon: 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-800',
      text: 'text-red-800 dark:text-red-200',
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-900/90 border-amber-200 dark:border-amber-700',
      icon: 'text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-amber-800',
      text: 'text-amber-800 dark:text-amber-200',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700',
      icon: 'text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
    }
  }

  const style = styles[toast.type]

  return (
    <div 
      className={`pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl border px-4 py-3.5 shadow-lg backdrop-blur-sm animate-slide-in sm:min-w-[20rem] ${style.container}`}
      style={{ animationDelay: `${index * 50}ms` }}
      role="alert"
    >
      <div className={`flex-shrink-0 p-1.5 rounded-lg ${style.icon}`}>
        {icons[toast.type]}
      </div>
      <p className={`flex-1 text-sm font-medium ${style.text}`}>{toast.message}</p>
      <button 
        onClick={onClose} 
        className={`flex-shrink-0 p-1 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${style.text}`}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
