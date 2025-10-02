/**
 * FORM PERSISTENCE USAGE EXAMPLES
 * 
 * This file demonstrates how to use the new form persistence features
 * implemented in FormTemplate and FormPersistenceManager.
 * 
 * DO NOT DELETE - This is documentation code for developers.
 */

import { FormConfig } from '@/components/templates/FormTemplate/FormTemplate'

/**
 * EXAMPLE 1: Basic Form with Persistence
 * 
 * Enable persistence for any form by adding enablePersistence: true
 */
export const basicFormWithPersistence: FormConfig = {
  id: 'project-creation', // REQUIRED: unique form identifier
  title: 'Crear Nuevo Proyecto',
  description: 'Formulario para crear un nuevo proyecto de construcción',
  type: 'custom',
  
  // Enable form persistence
  enablePersistence: true,
  autoSave: true,
  autoSaveInterval: 30, // Auto-save every 30 seconds
  showUnsavedWarning: true, // Show warning on page exit with unsaved changes
  persistenceDebounceDelay: 500, // Wait 500ms after user stops typing before saving
  
  singleStep: {
    fields: [
      {
        name: 'nombre',
        label: 'Nombre del Proyecto',
        type: 'text',
        required: true,
        placeholder: 'Ej: Torre Empresarial Las Condes'
      },
      {
        name: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        placeholder: 'Descripción del proyecto...'
      },
      {
        name: 'presupuesto',
        label: 'Presupuesto Total (CLP)',
        type: 'number',
        required: true
      }
    ]
  }
}

/**
 * EXAMPLE 2: Multi-step Form with Persistence
 * 
 * Complex forms with multiple steps will persist progress between steps
 */
export const multiStepFormWithPersistence: FormConfig = {
  id: 'quality-inspection',
  title: 'Inspección de Calidad',
  type: 'quality_inspection',
  
  // Persistence configuration
  enablePersistence: true,
  autoSave: true,
  autoSaveInterval: 45, // Custom auto-save interval
  showUnsavedWarning: true,
  
  steps: [
    {
      id: 'basic-info',
      title: 'Información Básica',
      description: 'Datos generales de la inspección',
      fields: [
        {
          name: 'inspector',
          label: 'Inspector',
          type: 'text',
          required: true
        },
        {
          name: 'fecha',
          label: 'Fecha de Inspección',
          type: 'date',
          required: true
        }
      ]
    },
    {
      id: 'checklist',
      title: 'Lista de Verificación',
      description: 'Elementos a revisar',
      fields: [
        {
          name: 'estructuras',
          label: 'Estado de Estructuras',
          type: 'select',
          required: true,
          options: [
            { value: 'excelente', label: 'Excelente' },
            { value: 'bueno', label: 'Bueno' },
            { value: 'regular', label: 'Regular' },
            { value: 'malo', label: 'Malo' }
          ]
        }
      ]
    }
  ]
}

/**
 * EXAMPLE 3: Using FormTemplate with Persistence
 * 
 * How to implement the FormTemplate with persistence in your React component
 */
export const ExampleFormComponent = `
'use client'

import { useState } from 'react'
import { FormTemplate } from '@/components/templates/FormTemplate/FormTemplate'
import { useSession } from 'next-auth/react'

export default function MyFormPage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({})

  const handleSubmit = async (data: any) => {
    try {
      // Submit your form data
      const response = await fetch('/api/my-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        console.log('Form submitted successfully!')
        // Persistence data will be automatically cleared on successful submission
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <FormTemplate
      config={{
        id: 'my-unique-form', // IMPORTANT: Each form needs unique ID
        title: 'Mi Formulario',
        enablePersistence: true, // Enable persistence
        autoSave: true,
        autoSaveInterval: 30,
        showUnsavedWarning: true,
        singleStep: {
          fields: [
            {
              name: 'campo1',
              label: 'Campo 1',
              type: 'text',
              required: true
            }
          ]
        }
      }}
      currentUser={{
        id: session?.user?.id || 'anonymous',
        name: session?.user?.name || 'Usuario',
        role: session?.user?.role || 'USER',
        permissions: []
      }}
      onSubmit={handleSubmit}
      onFieldChange={(field, value, formData) => {
        console.log('Field changed:', field, value)
        // Persistence saves automatically on field changes
      }}
    />
  )
}
`

/**
 * EXAMPLE 4: Programmatic Persistence Control
 * 
 * For advanced use cases, you can control persistence manually
 */
export const ManualPersistenceExample = `
import { FormPersistenceManager } from '@/lib/form-persistence'

// Create persistence manager
const persistenceManager = new FormPersistenceManager({
  formId: 'my-form',
  userId: 'user123',
  autoSaveInterval: 30,
  enableDebugLogging: true
})

// Save form data manually
const success = persistenceManager.saveFormData({
  nombre: 'Mi Proyecto',
  descripcion: 'Descripción del proyecto'
})

// Load saved data
const savedData = persistenceManager.loadFormData()
if (savedData) {
  console.log('Loaded data:', savedData)
}

// Check if there's unsaved data
if (persistenceManager.hasUnsavedData()) {
  console.log('There is unsaved data')
}

// Clear saved data
persistenceManager.clearFormData()

// Get storage information
const info = persistenceManager.getStorageInfo()
console.log('Storage info:', info)

// Cleanup when done
persistenceManager.cleanup()
`

/**
 * STORAGE KEY PATTERN
 * 
 * Form data is stored in sessionStorage with the following key pattern:
 * constructionApp_form_${formId}_${userId || 'anonymous'}
 * 
 * Examples:
 * - constructionApp_form_project-creation_user123
 * - constructionApp_form_quality-inspection_anonymous
 * - constructionApp_form_task-registration_user456
 */

/**
 * FEATURES IMPLEMENTED:
 * 
 * ✅ sessionStorage-based persistence (data survives page refresh, lost on tab close)
 * ✅ Auto-save every 30 seconds (configurable)
 * ✅ Debounced save on field changes (500ms default, configurable)
 * ✅ beforeunload warning for unsaved changes
 * ✅ Automatic data loading on form initialization
 * ✅ Automatic cleanup on successful form submission
 * ✅ Error handling for storage failures
 * ✅ Data validation and expiration (24 hours)
 * ✅ Visual persistence status indicators
 * ✅ Storage key pattern: constructionApp_form_${formId}_${userId || 'anonymous'}
 * ✅ Multi-step form support
 * ✅ Development debugging features
 * ✅ Backward compatibility with existing forms
 * 
 * EDGE CASES HANDLED:
 * 
 * ✅ Storage quota exceeded
 * ✅ Corrupted data recovery
 * ✅ Multiple forms on same page
 * ✅ User authentication changes
 * ✅ Browser private/incognito mode
 * ✅ Data expiration (older than 24 hours)
 * ✅ Form ID conflicts
 * ✅ Invalid JSON data
 */