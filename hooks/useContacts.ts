/**
 * useContacts Hook
 * Custom hook for managing emergency contacts with localStorage
 */

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { EmergencyContact } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId } from '@/lib/utils'

const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: '1',
    name: 'Local Police Department',
    relationship: 'Emergency Services',
    phone: '911',
    email: '',
    address: 'Local jurisdiction',
    isEmergencyContact: true,
    notes: 'Primary emergency contact for law enforcement'
  },
  {
    id: '2',
    name: 'Local Fire Department',
    relationship: 'Emergency Services',
    phone: '911',
    email: '',
    address: 'Local jurisdiction',
    isEmergencyContact: true,
    notes: 'Primary emergency contact for fire and rescue'
  },
  {
    id: '3',
    name: 'Nearest Hospital',
    relationship: 'Medical',
    phone: '(555) 123-4567',
    email: '',
    address: '123 Medical Center Dr, City, State',
    isEmergencyContact: true,
    notes: 'Nearest emergency medical facility'
  },
  {
    id: '4',
    name: 'Family Doctor',
    relationship: 'Medical',
    phone: '(555) 234-5678',
    email: 'doctor@medicalclinic.com',
    address: '456 Health Ave, City, State',
    isEmergencyContact: false,
    notes: 'Primary care physician'
  }
]

export function useContacts() {
  const [contacts, setContacts] = useLocalStorage<EmergencyContact[]>(
    STORAGE_KEYS.EMERGENCY_CONTACTS,
    DEFAULT_CONTACTS
  )

  const addContact = useCallback((contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: generateId()
    }
    setContacts(prev => [...prev, newContact])
    return newContact
  }, [setContacts])

  const updateContact = useCallback((id: string, updates: Partial<EmergencyContact>) => {
    setContacts(prev =>
      prev.map(contact => (contact.id === id ? { ...contact, ...updates } : contact))
    )
  }, [setContacts])

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id))
  }, [setContacts])

  const deleteMultiple = useCallback((ids: string[]) => {
    setContacts(prev => prev.filter(contact => !ids.includes(contact.id)))
  }, [setContacts])

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    deleteMultiple
  }
}
