'use client'

import { useEffect } from 'react'

/**
 * Registers the production service worker.
 * Development skips registration so Next.js hot reload is not cached.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error)
    })
  }, [])

  return null
}
