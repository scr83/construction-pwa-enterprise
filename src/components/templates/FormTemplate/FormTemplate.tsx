'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { FormPersistenceManager, setupBeforeUnloadWarning } from '@/lib/form-persistence'

// Import organisms
import { NavigationBar } from '@/components/organisms/NavigationBar'
import { TaskRegistrationForm } from '@/components/organisms/TaskRegistrationForm'
import { PhotoGallery } from '@/components/organisms/PhotoGallery'

// Import molecules
import { FormField } from '@/components/molecules/FormField'
import { PhotoUploader } from '@/components/molecules/PhotoUploader'
import { StatusCard } from '@/components/molecules/StatusCard'

// Import atoms
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Badge } from '@/components/atoms/Badge'
import { Loading } from '@/components/atoms/Loading'
import { ProgressBar } from '@/components/atoms/ProgressBar'

const formTemplateVariants = cva(
  'min-h-screen bg-secondary-25',
  {
    variants: {
      layout: {
        single: 'flex flex-col',
        multi: 'flex flex-col',
        wizard: 'flex flex-col',
        modal: 'flex flex-col',
      },
      size: {
        compact: '',
        default: '',
        full: '',
      },
      mode: {
        create: '',
        edit: '',
        review: '',
        readonly: '',
      },
    },
    defaultVariants: {
      layout: 'single',
      size: 'default',
      mode: 'create',
    },
  }
)

// Form step configuration
export interface FormStep {
  id: string
  title: string
  description?: string
  icon?: string
  component?: React.ComponentType<any>
  fields?: FormFieldConfig[]
  validation?: (data: any) => string[] | null
  optional?: boolean
  permissions?: string[]
  dependsOn?: string[]
  estimatedTime?: number // minutes
  mobileOptimized?: boolean
}

// Field configuration
export interface FormFieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime-local' | 'time' | 'select' | 'multiselect' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'photo' | 'signature' | 'location' | 'barcode' | 'qr'
  required?: boolean
  placeholder?: string
  helperText?: string
  options?: Array<{ value: string; label: string; description?: string }>
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    custom?: (value: any, formData: any) => string | null
  }
  conditional?: {
    field: string
    value: any
    operator?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  }
  constructionContext?: string
  defaultValue?: any
  readonly?: boolean
  hidden?: boolean
  permissions?: string[]
  mobileLayout?: 'full' | 'half' | 'third'
}

// Form configuration
export interface FormConfig {
  id: string
  title: string
  description?: string
  type: 'work_order' | 'quality_inspection' | 'material_request' | 'team_assignment' | 'incident_report' | 'progress_update' | 'custom'
  steps?: FormStep[]
  singleStep?: {
    fields: FormFieldConfig[]
    sections?: Array<{
      id: string
      title: string
      fields: string[]
      collapsible?: boolean
      icon?: string
    }>
  }
  
  // Form behavior
  autoSave?: boolean
  autoSaveInterval?: number // seconds
  allowDraft?: boolean
  requiresApproval?: boolean
  enableOfflineMode?: boolean
  
  // Form persistence
  enablePersistence?: boolean
  persistenceDebounceDelay?: number // milliseconds
  showUnsavedWarning?: boolean
  
  // Validation
  validation?: 'client' | 'server' | 'both'
  validationRules?: Array<{
    fields: string[]
    rule: string
    message: string
  }>
  
  // UI configuration
  showProgress?: boolean
  allowNavigation?: boolean
  confirmOnExit?: boolean
  mobileOptimized?: boolean
  
  // Permissions and workflow
  permissions?: {
    create?: string[]
    edit?: string[]
    view?: string[]
    approve?: string[]
  }
  
  // Construction-specific
  projectRequired?: boolean
  locationRequired?: boolean
  photosRequired?: boolean
  signatureRequired?: boolean
  gpsRequired?: boolean
}

// Form data and state
export interface FormData {
  [key: string]: any
}

export interface FormState {
  currentStep: number
  totalSteps: number
  completedSteps: number[]
  errors: Record<string, string[]>
  warnings: Record<string, string[]>
  isDirty: boolean
  isValid: boolean
  isSubmitting: boolean
  lastAutoSave?: Date
  draftId?: string
}

// Form actions
export interface FormAction {
  id: string
  label: string
  icon?: string
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  action: (formData: FormData) => void | Promise<void>
  conditions?: (formData: FormData, state: FormState) => boolean
  loading?: boolean
  confirmation?: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
  }
  permissions?: string[]
}

export interface FormTemplateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formTemplateVariants> {
  // Form configuration
  config: FormConfig
  initialData?: FormData
  formState?: Partial<FormState>
  
  // Navigation and header
  showNavigation?: boolean
  navigationProps?: any
  title?: string
  subtitle?: string
  showProgress?: boolean
  
  // Actions and buttons
  primaryActions?: FormAction[]
  secondaryActions?: FormAction[]
  showDefaultActions?: boolean
  
  // Callbacks
  onSubmit?: (data: FormData) => void | Promise<void>
  onSaveDraft?: (data: FormData) => void | Promise<void>
  onStepChange?: (step: number, direction: 'next' | 'prev') => void
  onFieldChange?: (field: string, value: any, formData: FormData) => void
  onValidation?: (errors: Record<string, string[]>) => void
  onAutoSave?: (data: FormData) => void
  
  // Upload and files
  onPhotoUpload?: (files: File[], field?: string) => void
  onFileUpload?: (files: File[], field: string) => void
  
  // Location and scanning
  onLocationCapture?: (location: any) => void
  onBarcodeScanned?: (code: string, field: string) => void
  onQRScanned?: (code: string, field: string) => void
  onSignatureCapture?: (signature: string, field: string) => void
  
  // Permissions and context
  currentUser?: {
    id: string
    name: string
    role: string
    permissions: string[]
  }
  
  currentProject?: {
    id: string
    name: string
    code: string
  }
  
  // Loading and state
  isLoading?: boolean
  isSubmitting?: boolean
  isValidating?: boolean
  
  // Mobile and offline
  enableMobileOptimizations?: boolean
  enableOfflineMode?: boolean
  offlineData?: any
  
  // Customization
  theme?: 'light' | 'dark' | 'construction'
  compactMode?: boolean
}

const FormTemplate = React.forwardRef<HTMLDivElement, FormTemplateProps>(
  (
    {
      className,
      layout,
      size,
      mode,
      config,
      initialData = {},
      formState: externalFormState,
      showNavigation = true,
      navigationProps,
      title,
      subtitle,
      showProgress = true,
      primaryActions = [],
      secondaryActions = [],
      showDefaultActions = true,
      onSubmit,
      onSaveDraft,
      onStepChange,
      onFieldChange,
      onValidation,
      onAutoSave,
      onPhotoUpload,
      onFileUpload,
      onLocationCapture,
      onBarcodeScanned,
      onQRScanned,
      onSignatureCapture,
      currentUser,
      currentProject,
      isLoading = false,
      isSubmitting = false,
      isValidating = false,
      enableMobileOptimizations = false,
      enableOfflineMode = false,
      offlineData,
      theme = 'construction',
      compactMode = false,
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = React.useState<FormData>({ ...initialData })
    const [formState, setFormState] = React.useState<FormState>({
      currentStep: 0,
      totalSteps: config?.steps?.length || 1,
      completedSteps: [],
      errors: {},
      warnings: {},
      isDirty: false,
      isValid: false,
      isSubmitting: false,
      ...externalFormState
    })
    const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set())
    const [showExitConfirmation, setShowExitConfirmation] = React.useState(false)
    const autoSaveRef = React.useRef<NodeJS.Timeout>()
    
    // Form persistence
    const persistenceManagerRef = React.useRef<FormPersistenceManager | null>(null)
    const [persistenceStatus, setPersistenceStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
    const [lastPersistenceTime, setLastPersistenceTime] = React.useState<Date | null>(null)

    // Initialize form persistence
    React.useEffect(() => {
      if (!config?.enablePersistence) return

      // Initialize persistence manager
      persistenceManagerRef.current = new FormPersistenceManager({
        formId: config.id,
        userId: currentUser?.id,
        autoSaveInterval: config.autoSaveInterval || 30,
        debounceDelay: config.persistenceDebounceDelay || 500,
        enableDebugLogging: process.env.NODE_ENV === 'development'
      })

      // Load existing data if available
      const savedData = persistenceManagerRef.current.loadFormData()
      if (savedData && Object.keys(savedData).length > 0) {
        setFormData(prevData => ({ ...prevData, ...savedData }))
        setFormState(prev => ({ ...prev, isDirty: true }))
        setLastPersistenceTime(new Date())
      }

      // Setup auto-save
      if (config.autoSave) {
        persistenceManagerRef.current.startAutoSave(
          () => formData,
          (success) => {
            setPersistenceStatus(success ? 'saved' : 'error')
            if (success) {
              setLastPersistenceTime(new Date())
              setFormState(prev => ({ ...prev, lastAutoSave: new Date() }))
            }
          }
        )
      }

      return () => {
        persistenceManagerRef.current?.cleanup()
      }
    }, [config?.enablePersistence, config?.id, currentUser?.id, config?.autoSave, config?.autoSaveInterval])

    // Setup beforeunload warning
    React.useEffect(() => {
      if (!config?.showUnsavedWarning) return

      const cleanup = setupBeforeUnloadWarning(
        formState.isDirty,
        '¿Estás seguro de que quieres salir? Tienes cambios sin guardar que se perderán.'
      )

      return cleanup
    }, [formState.isDirty, config?.showUnsavedWarning])

    // Auto-save functionality (legacy - for backward compatibility)
    React.useEffect(() => {
      if (!config?.autoSave || !config.autoSaveInterval || !formState.isDirty || config?.enablePersistence) return

      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }

      autoSaveRef.current = setTimeout(() => {
        onAutoSave?.(formData)
        setFormState(prev => ({ ...prev, lastAutoSave: new Date() }))
      }, (config?.autoSaveInterval || 30) * 1000)

      return () => {
        if (autoSaveRef.current) {
          clearTimeout(autoSaveRef.current)
        }
      }
    }, [formData, formState.isDirty, config?.autoSave, config?.autoSaveInterval, config?.enablePersistence, onAutoSave])

    // Handle field change
    const handleFieldChange = (field: string, value: any) => {
      const newFormData = { ...formData, [field]: value }
      setFormData(newFormData)
      setFormState(prev => ({ ...prev, isDirty: true }))
      onFieldChange?.(field, value, newFormData)

      // Validate field
      validateField(field, value, newFormData)

      // Trigger debounced persistence save
      if (config?.enablePersistence && persistenceManagerRef.current) {
        setPersistenceStatus('saving')
        persistenceManagerRef.current.debouncedSave(
          newFormData,
          (success) => {
            setPersistenceStatus(success ? 'saved' : 'error')
            if (success) {
              setLastPersistenceTime(new Date())
            }
          }
        )
      }
    }

    // Field validation
    const validateField = (field: string, value: any, currentFormData: FormData) => {
      const fieldConfig = getAllFields().find(f => f.name === field)
      if (!fieldConfig) return

      const errors: string[] = []

      // Required validation - only show error if user has interacted with form
      if (fieldConfig.required && (!value || value === '' || (Array.isArray(value) && value.length === 0)) && formState.isDirty) {
        errors.push(`${fieldConfig.label} es requerido`)
      }

      // Type-specific validation
      if (value && fieldConfig.validation) {
        const { min, max, minLength, maxLength, pattern, custom } = fieldConfig.validation

        if (typeof value === 'string') {
          if (minLength && value.length < minLength) {
            errors.push(`${fieldConfig.label} debe tener al menos ${minLength} caracteres`)
          }
          if (maxLength && value.length > maxLength) {
            errors.push(`${fieldConfig.label} no puede tener más de ${maxLength} caracteres`)
          }
          if (pattern && !new RegExp(pattern).test(value)) {
            errors.push(`${fieldConfig.label} no tiene el formato correcto`)
          }
        }

        if (typeof value === 'number') {
          if (min !== undefined && value < min) {
            errors.push(`${fieldConfig.label} debe ser mayor o igual a ${min}`)
          }
          if (max !== undefined && value > max) {
            errors.push(`${fieldConfig.label} debe ser menor o igual a ${max}`)
          }
        }

        // Custom validation
        if (custom) {
          const customError = custom(value, currentFormData)
          if (customError) {
            errors.push(customError)
          }
        }
      }

      // Update field errors
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: errors
        }
      }))
    }

    // Get all fields from config
    const getAllFields = (): FormFieldConfig[] => {
      if (config?.steps) {
        return config.steps.flatMap(step => step.fields || [])
      }
      return config?.singleStep?.fields || []
    }

    // Get current step fields
    const getCurrentStepFields = (): FormFieldConfig[] => {
      if (!config?.steps) {
        return config?.singleStep?.fields || []
      }
      
      const currentStep = config?.steps?.[formState.currentStep]
      return currentStep?.fields || []
    }

    // Step navigation
    const handleNextStep = () => {
      if (!config?.steps || formState.currentStep >= config.steps.length - 1) return

      // Validate current step
      const currentStepFields = getCurrentStepFields()
      const hasErrors = currentStepFields.some(field => 
        formState.errors[field.name]?.length > 0
      )

      if (hasErrors) {
        onValidation?.(formState.errors)
        return
      }

      const nextStep = formState.currentStep + 1
      setFormState(prev => ({
        ...prev,
        currentStep: nextStep,
        completedSteps: [...prev.completedSteps, prev.currentStep]
      }))
      onStepChange?.(nextStep, 'next')
    }

    const handlePrevStep = () => {
      if (formState.currentStep <= 0) return
      
      const prevStep = formState.currentStep - 1
      setFormState(prev => ({ ...prev, currentStep: prevStep }))
      onStepChange?.(prevStep, 'prev')
    }

    // Clear persistence data
    const clearPersistenceData = () => {
      if (persistenceManagerRef.current) {
        persistenceManagerRef.current.clearFormData()
        setPersistenceStatus('idle')
        setLastPersistenceTime(null)
      }
    }

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (isSubmitting) return

      // Final validation
      const allFields = getAllFields()
      let hasErrors = false
      
      allFields.forEach(field => {
        validateField(field.name, formData[field.name], formData)
        if (formState.errors[field.name]?.length > 0) {
          hasErrors = true
        }
      })

      if (hasErrors) {
        onValidation?.(formState.errors)
        return
      }

      setFormState(prev => ({ ...prev, isSubmitting: true }))
      
      try {
        await onSubmit?.(formData)
        setFormState(prev => ({ ...prev, isDirty: false }))
        
        // Clear persistence data on successful submission
        if (config?.enablePersistence) {
          clearPersistenceData()
        }
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setFormState(prev => ({ ...prev, isSubmitting: false }))
      }
    }

    // Save draft
    const handleSaveDraft = async () => {
      if (!config?.allowDraft) return
      
      await onSaveDraft?.(formData)
      setFormState(prev => ({ 
        ...prev, 
        isDirty: false,
        lastAutoSave: new Date()
      }))
    }

    // Section toggle
    const toggleSection = (sectionId: string) => {
      const newExpanded = new Set(expandedSections)
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId)
      } else {
        newExpanded.add(sectionId)
      }
      setExpandedSections(newExpanded)
    }

    // Render field
    const renderField = (field: FormFieldConfig) => {
      // Check conditional visibility
      if (field.conditional) {
        const { field: conditionField, value: conditionValue, operator = 'equals' } = field.conditional
        const fieldValue = formData[conditionField]
        
        let conditionMet = false
        switch (operator) {
          case 'equals':
            conditionMet = fieldValue === conditionValue
            break
          case 'not_equals':
            conditionMet = fieldValue !== conditionValue
            break
          case 'contains':
            conditionMet = Array.isArray(fieldValue) && fieldValue.includes(conditionValue)
            break
          case 'greater_than':
            conditionMet = fieldValue > conditionValue
            break
          case 'less_than':
            conditionMet = fieldValue < conditionValue
            break
        }
        
        if (!conditionMet) return null
      }

      // Check permissions
      if (field.permissions && currentUser) {
        const hasPermission = field.permissions.some(permission => 
          currentUser.permissions.includes(permission)
        )
        if (!hasPermission) return null
      }

      // Hidden fields
      if (field.hidden) return null

      const fieldValue = formData[field.name] || field.defaultValue
      const fieldErrors = formState.errors[field.name] || []
      const isReadonly = field.readonly || mode === 'readonly'

      // Special field types
      if (field.type === 'photo') {
        return (
          <div key={field.name} className="space-y-2">
            <Typography variant="label-default" className="font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
            <PhotoUploader
              multiple
              maxFiles={10}
              acceptedFileTypes={['image/jpeg', 'image/png']}
              captureGPS={config?.gpsRequired}
              constructionContext={field.constructionContext as any}
              onFilesSelected={(files) => {
                onPhotoUpload?.(files.map(f => f as File), field.name)
                handleFieldChange(field.name, files)
              }}
              disabled={isReadonly}
              showPreview
            />
            {fieldErrors.length > 0 && (
              <div className="text-red-500 text-sm">
                {fieldErrors.map(error => (
                  <div key={error}>{error}</div>
                ))}
              </div>
            )}
          </div>
        )
      }

      if (field.type === 'signature') {
        return (
          <div key={field.name} className="space-y-2">
            <Typography variant="label-default" className="font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
            <div className="border border-secondary-200 rounded-lg p-4 bg-white">
              <div className="aspect-[3/1] bg-secondary-50 rounded border-2 border-dashed border-secondary-300 flex items-center justify-center">
                <Typography variant="caption" color="muted">
                  Área de firma digital
                </Typography>
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Mock signature capture
                    onSignatureCapture?.('signature-data', field.name)
                    handleFieldChange(field.name, 'signature-captured')
                  }}
                  disabled={isReadonly}
                >
                  Capturar Firma
                </Button>
              </div>
            </div>
          </div>
        )
      }

      if (field.type === 'location') {
        return (
          <div key={field.name} className="space-y-2">
            <Typography variant="label-default" className="font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
            <div className="flex gap-2">
              <FormField
                name={field.name}
                label=""
                placeholder="Ubicación GPS"
                value={fieldValue}
                onChange={(value) => handleFieldChange(field.name, value)}
                readonly={isReadonly}
                errorMessage={fieldErrors}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Mock GPS capture
                  onLocationCapture?.({ lat: -33.4372, lng: -70.6506 })
                  handleFieldChange(field.name, 'GPS: -33.4372, -70.6506')
                }}
                disabled={isReadonly}
                leftIcon={<Icon name="map-pin" size="xs" />}
              >
                GPS
              </Button>
            </div>
          </div>
        )
      }

      if (field.type === 'barcode' || field.type === 'qr') {
        return (
          <div key={field.name} className="space-y-2">
            <Typography variant="label-default" className="font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
            <div className="flex gap-2">
              <FormField
                name={field.name}
                label=""
                placeholder={`Código ${field.type.toUpperCase()}`}
                value={fieldValue}
                onChange={(value) => handleFieldChange(field.name, value)}
                readonly={isReadonly}
                errorMessage={fieldErrors}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Mock scan
                  const mockCode = field.type === 'barcode' ? '1234567890123' : 'QR-CODE-DATA'
                  if (field.type === 'barcode') {
                    onBarcodeScanned?.(mockCode, field.name)
                  } else {
                    onQRScanned?.(mockCode, field.name)
                  }
                  handleFieldChange(field.name, mockCode)
                }}
                disabled={isReadonly}
                leftIcon={<Icon name={field.type === 'barcode' ? 'maximize' : 'square'} size="xs" />}
              >
                Escanear
              </Button>
            </div>
          </div>
        )
      }

      // Regular form field
      return (
        <FormField
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type as any}
          required={field.required}
          placeholder={field.placeholder}
          helperText={field.helperText}
          value={fieldValue}
          onChange={(value) => handleFieldChange(field.name, value)}
          readonly={isReadonly}
          errorMessage={fieldErrors}
          constructionContext={field.constructionContext as any}
          options={field.options}
        />
      )
    }

    if (isLoading) {
      return (
        <div className={cn(formTemplateVariants({ layout, size, mode }), className)}>
          {showNavigation && (
            <NavigationBar {...navigationProps} />
          )}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Loading size="lg" />
              <Typography variant="body-default" color="muted" className="mt-4">
                Cargando formulario...
              </Typography>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(formTemplateVariants({ layout, size, mode }), className)}
        {...props}
      >
        {/* Navigation */}
        {showNavigation && (
          <NavigationBar {...navigationProps} />
        )}

        {/* Form Header */}
        <div className="bg-white border-b border-secondary-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" className="font-bold">
                {title || config?.title}
              </Typography>
              {(subtitle || config?.description) && (
                <Typography variant="body-default" color="muted">
                  {subtitle || config?.description}
                </Typography>
              )}
            </div>
            
            {/* Form actions */}
            <div className="flex items-center gap-2">
              {/* Persistence status */}
              {config?.enablePersistence && (
                <div className="flex items-center gap-2">
                  {persistenceStatus === 'saving' && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Loading size="xs" />
                      <Typography variant="caption">
                        Guardando...
                      </Typography>
                    </div>
                  )}
                  {persistenceStatus === 'saved' && lastPersistenceTime && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Icon name="check" size="xs" />
                      <Typography variant="caption">
                        <span suppressHydrationWarning>
                          Guardado: {lastPersistenceTime.toLocaleTimeString('es-CL', { hour12: false })}
                        </span>
                      </Typography>
                    </div>
                  )}
                  {persistenceStatus === 'error' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <Icon name="alert-circle" size="xs" />
                      <Typography variant="caption">
                        Error al guardar
                      </Typography>
                    </div>
                  )}
                </div>
              )}

              {/* Legacy auto-save status */}
              {!config?.enablePersistence && config?.autoSave && formState.lastAutoSave && (
                <Typography variant="caption" color="muted">
                  <span suppressHydrationWarning>
                    Guardado: {formState.lastAutoSave.toLocaleTimeString('es-CL', { hour12: false })}
                  </span>
                </Typography>
              )}
              
              {config?.allowDraft && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={!formState.isDirty}
                  leftIcon={<Icon name="save" size="xs" />}
                >
                  Guardar Borrador
                </Button>
              )}

              {/* Clear persistence button (development only) */}
              {config?.enablePersistence && process.env.NODE_ENV === 'development' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearPersistenceData}
                  leftIcon={<Icon name="trash-2" size="xs" />}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {showProgress && config?.steps && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="caption" color="muted">
                  Paso {formState.currentStep + 1} de {formState.totalSteps}
                </Typography>
                <Typography variant="caption" color="muted">
                  {Math.round(((formState.currentStep + 1) / formState.totalSteps) * 100)}% completado
                </Typography>
              </div>
              <ProgressBar
                progress={(formState.currentStep + 1) / formState.totalSteps * 100}
                size="sm"
                showLabel={false}
              />
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
            {/* Multi-step wizard */}
            {config?.steps && (
              <div className="space-y-6">
                {/* Step navigation */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    {config.steps?.map((step, index) => (
                      <div
                        key={step.id}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                          index === formState.currentStep && 'bg-primary-100 text-primary-700',
                          formState.completedSteps.includes(index) && 'bg-success-100 text-success-700',
                          index > formState.currentStep && 'text-secondary-400'
                        )}
                      >
                        <div className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                          index === formState.currentStep && 'bg-primary-500 text-white',
                          formState.completedSteps.includes(index) && 'bg-success-500 text-white',
                          index > formState.currentStep && 'bg-secondary-200 text-secondary-500'
                        )}>
                          {formState.completedSteps.includes(index) ? (
                            <Icon name="check" size="xs" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="hidden sm:inline text-sm font-medium">
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current step content */}
                <div className="bg-white rounded-lg border border-secondary-200 p-6">
                  {config?.steps?.[formState.currentStep] && (
                    <>
                      <div className="mb-6">
                        <Typography variant="h5" className="font-semibold mb-2">
                          {config.steps?.[formState.currentStep]?.title}
                        </Typography>
                        {config.steps?.[formState.currentStep]?.description && (
                          <Typography variant="body-default" color="muted">
                            {config.steps?.[formState.currentStep]?.description}
                          </Typography>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getCurrentStepFields().map(renderField)}
                      </div>
                    </>
                  )}
                </div>

                {/* Step navigation buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrevStep}
                    disabled={formState.currentStep === 0}
                    leftIcon={<Icon name="arrow-left" size="xs" />}
                  >
                    Anterior
                  </Button>

                  <div className="flex items-center gap-2">
                    {formState.currentStep === formState.totalSteps - 1 ? (
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        leftIcon={isSubmitting ? <Loading size="xs" /> : <Icon name="check" size="xs" />}
                      >
                        {isSubmitting ? 'Enviando...' : 'Finalizar'}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleNextStep}
                        rightIcon={<Icon name="arrow-right" size="xs" />}
                      >
                        Siguiente
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Single step form */}
            {!config?.steps && config?.singleStep && (
              <div className="space-y-6">
                {config?.singleStep?.sections ? (
                  // Sectioned form
                  config.singleStep.sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-lg border border-secondary-200">
                      <button
                        type="button"
                        onClick={() => section.collapsible && toggleSection(section.id)}
                        className={cn(
                          'w-full flex items-center justify-between p-4 text-left',
                          section.collapsible && 'hover:bg-secondary-25'
                        )}
                        disabled={!section.collapsible}
                      >
                        <div className="flex items-center gap-3">
                          {section.icon && <Icon name={section.icon as any} size="sm" />}
                          <Typography variant="h6" className="font-semibold">
                            {section.title}
                          </Typography>
                        </div>
                        {section.collapsible && (
                          <Icon 
                            name={expandedSections.has(section.id) ? "chevron-up" : "chevron-down"} 
                            size="sm" 
                          />
                        )}
                      </button>

                      {(!section.collapsible || expandedSections.has(section.id)) && (
                        <div className="px-4 pb-4 border-t border-secondary-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            {section.fields
                              .map(fieldName => config?.singleStep?.fields?.find(f => f.name === fieldName))
                              .filter(Boolean)
                              .map(renderField)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  // Simple form
                  <div className="bg-white rounded-lg border border-secondary-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {config?.singleStep?.fields?.map(renderField)}
                    </div>
                  </div>
                )}

                {/* Form actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {secondaryActions.map((action) => (
                      <Button
                        key={action.id}
                        type="button"
                        variant={action.variant}
                        onClick={() => action.action(formData)}
                        disabled={action.loading}
                        leftIcon={action.icon ? <Icon name={action.icon as any} size="xs" /> : undefined}
                      >
                        {action.loading ? <Loading size="xs" /> : action.label}
                      </Button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {showDefaultActions && (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            if (formState.isDirty && config.confirmOnExit) {
                              setShowExitConfirmation(true)
                            } else {
                              // Navigate back
                            }
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isSubmitting}
                          leftIcon={isSubmitting ? <Loading size="xs" /> : <Icon name="check" size="xs" />}
                        >
                          {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                      </>
                    )}
                    
                    {primaryActions.map((action) => (
                      <Button
                        key={action.id}
                        type="button"
                        variant={action.variant}
                        onClick={() => action.action(formData)}
                        disabled={action.loading}
                        leftIcon={action.icon ? <Icon name={action.icon as any} size="xs" /> : undefined}
                      >
                        {action.loading ? <Loading size="xs" /> : action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Exit confirmation dialog */}
        {showExitConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <Typography variant="h6" className="font-semibold mb-2">
                ¿Descartar Cambios?
              </Typography>
              <Typography variant="body-default" color="muted" className="mb-6">
                Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?
              </Typography>
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowExitConfirmation(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowExitConfirmation(false)
                    setFormState(prev => ({ ...prev, isDirty: false }))
                    // Navigate back
                  }}
                >
                  Descartar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

FormTemplate.displayName = 'FormTemplate'

export { FormTemplate, formTemplateVariants }
export type { 
  FormTemplateProps,
  FormConfig,
  FormStep,
  FormFieldConfig,
  FormData,
  FormState,
  FormAction
}