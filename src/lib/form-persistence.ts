/**
 * Form Persistence Utility
 * 
 * Provides sessionStorage-based form persistence with auto-save functionality.
 * Handles storage key patterns, debouncing, and error recovery.
 */

export interface FormPersistenceData {
  formData: Record<string, any>
  timestamp: number
  version: string
  userId?: string
  formId: string
}

export interface FormPersistenceConfig {
  formId: string
  userId?: string
  autoSaveInterval?: number // seconds
  debounceDelay?: number // milliseconds for field change debouncing
  maxRetries?: number
  enableDebugLogging?: boolean
}

export class FormPersistenceManager {
  private config: FormPersistenceConfig
  private storageKey: string
  private autoSaveTimer?: NodeJS.Timeout
  private debounceTimer?: NodeJS.Timeout
  private retryCount = 0

  constructor(config: FormPersistenceConfig) {
    this.config = {
      autoSaveInterval: 30, // Default 30 seconds
      debounceDelay: 500, // Default 500ms debounce
      maxRetries: 3,
      enableDebugLogging: false,
      ...config
    }
    
    // Generate storage key pattern: constructionApp_form_${formId}_${userId || 'anonymous'}
    this.storageKey = `constructionApp_form_${this.config.formId}_${this.config.userId || 'anonymous'}`
    
    this.log('FormPersistenceManager initialized', { storageKey: this.storageKey })
  }

  /**
   * Save form data to sessionStorage
   */
  saveFormData(formData: Record<string, any>): boolean {
    try {
      const persistenceData: FormPersistenceData = {
        formData,
        timestamp: Date.now(),
        version: '1.0',
        userId: this.config.userId,
        formId: this.config.formId
      }

      sessionStorage.setItem(this.storageKey, JSON.stringify(persistenceData))
      this.retryCount = 0 // Reset retry count on successful save
      this.log('Form data saved successfully', { dataKeys: Object.keys(formData) })
      return true
    } catch (error) {
      this.log('Error saving form data', { error: error instanceof Error ? error.message : 'Unknown error' })
      return false
    }
  }

  /**
   * Load form data from sessionStorage
   */
  loadFormData(): Record<string, any> | null {
    try {
      const stored = sessionStorage.getItem(this.storageKey)
      if (!stored) {
        this.log('No stored form data found')
        return null
      }

      const persistenceData: FormPersistenceData = JSON.parse(stored)
      
      // Validate data structure
      if (!persistenceData.formData || !persistenceData.timestamp) {
        this.log('Invalid stored data structure, removing')
        this.clearFormData()
        return null
      }

      // Check if data is from the same session (within last 24 hours)
      const twentyFourHours = 24 * 60 * 60 * 1000
      if (Date.now() - persistenceData.timestamp > twentyFourHours) {
        this.log('Stored data is too old, removing')
        this.clearFormData()
        return null
      }

      this.log('Form data loaded successfully', { 
        dataKeys: Object.keys(persistenceData.formData),
        savedAt: new Date(persistenceData.timestamp).toISOString()
      })
      
      return persistenceData.formData
    } catch (error) {
      this.log('Error loading form data', { error: error instanceof Error ? error.message : 'Unknown error' })
      this.clearFormData() // Clear corrupted data
      return null
    }
  }

  /**
   * Clear stored form data
   */
  clearFormData(): void {
    try {
      sessionStorage.removeItem(this.storageKey)
      this.log('Form data cleared')
    } catch (error) {
      this.log('Error clearing form data', { error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  /**
   * Check if there is unsaved data
   */
  hasUnsavedData(): boolean {
    try {
      const stored = sessionStorage.getItem(this.storageKey)
      return !!stored
    } catch {
      return false
    }
  }

  /**
   * Start auto-save with debounced field changes
   */
  startAutoSave(
    getCurrentFormData: () => Record<string, any>,
    onAutoSave?: (success: boolean) => void
  ): void {
    this.log('Starting auto-save', { interval: `${this.config.autoSaveInterval}s` })
    
    this.stopAutoSave() // Clear any existing timer
    
    this.autoSaveTimer = setInterval(() => {
      const formData = getCurrentFormData()
      if (formData && Object.keys(formData).length > 0) {
        const success = this.saveFormData(formData)
        onAutoSave?.(success)
      }
    }, (this.config.autoSaveInterval || 30) * 1000)
  }

  /**
   * Stop auto-save
   */
  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = undefined
      this.log('Auto-save stopped')
    }
  }

  /**
   * Debounced save on field change
   */
  debouncedSave(
    formData: Record<string, any>,
    onSave?: (success: boolean) => void
  ): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      const success = this.saveFormData(formData)
      onSave?.(success)
    }, this.config.debounceDelay || 500)
  }

  /**
   * Cleanup - stop all timers
   */
  cleanup(): void {
    this.stopAutoSave()
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = undefined
    }
    this.log('FormPersistenceManager cleaned up')
  }

  /**
   * Get storage information
   */
  getStorageInfo(): {
    storageKey: string
    hasData: boolean
    dataAge?: number
    dataSize?: number
  } {
    const hasData = this.hasUnsavedData()
    let dataAge: number | undefined
    let dataSize: number | undefined

    if (hasData) {
      try {
        const stored = sessionStorage.getItem(this.storageKey)
        if (stored) {
          const data = JSON.parse(stored)
          dataAge = Date.now() - data.timestamp
          dataSize = new Blob([stored]).size
        }
      } catch {
        // Ignore errors
      }
    }

    return {
      storageKey: this.storageKey,
      hasData,
      dataAge,
      dataSize
    }
  }

  /**
   * Debug logging
   */
  private log(message: string, data?: any): void {
    if (this.config.enableDebugLogging) {
      console.log(`[FormPersistence] ${message}`, data || '')
    }
  }
}

/**
 * React hook for form persistence
 */
export function useFormPersistence(config: FormPersistenceConfig) {
  const managerRef = React.useRef<FormPersistenceManager | null>(null)

  React.useEffect(() => {
    managerRef.current = new FormPersistenceManager(config)
    
    return () => {
      managerRef.current?.cleanup()
    }
  }, [config.formId, config.userId])

  return managerRef.current
}

/**
 * Browser beforeunload handler for unsaved changes warning
 */
export function setupBeforeUnloadWarning(
  isDirty: boolean,
  message: string = '¿Estás seguro de que quieres salir? Tienes cambios sin guardar.'
): () => void {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (isDirty) {
      event.preventDefault()
      event.returnValue = message
      return message
    }
  }

  window.addEventListener('beforeunload', handleBeforeUnload)

  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
}

// Import React for the hook
import * as React from 'react'