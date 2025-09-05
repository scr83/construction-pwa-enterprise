'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { FormField } from '@/components/molecules/FormField'
import { PhotoUploader, type PhotoFile } from '@/components/molecules/PhotoUploader'
import { StatusCard } from '@/components/molecules/StatusCard'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Loading } from '@/components/atoms/Loading'

const taskRegistrationFormVariants = cva(
  'w-full max-w-4xl bg-white rounded-lg shadow-sm border border-secondary-200',
  {
    variants: {
      variant: {
        standard: 'p-6',
        compact: 'p-4',
        mobile: 'p-3',
      },
      layout: {
        single: 'space-y-6',
        sectioned: 'space-y-8',
        wizard: 'space-y-4',
      },
      status: {
        draft: 'border-l-4 border-l-gray-400',
        in_progress: 'border-l-4 border-l-blue-500',
        pending_approval: 'border-l-4 border-l-orange-500',
        approved: 'border-l-4 border-l-green-500',
        rejected: 'border-l-4 border-l-red-500',
      },
    },
    defaultVariants: {
      variant: 'standard',
      layout: 'sectioned',
      status: 'draft',
    },
  }
)

// Construction task registration data
export interface TaskRegistration {
  // Task identification
  taskId: string
  activityCode: string
  activityName: string
  unitCode?: string
  location: {
    project: string
    building?: string
    floor?: string
    unit?: string
    coordinates?: { lat: number; lng: number }
  }
  
  // Work completion details
  completion: {
    status: 'MATERIALS_PLANNED' | 'EXECUTED' | 'QUALITY_SUBMITTED' | 'APPROVED' | 'REJECTED'
    executionDate: Date
    completionPercentage: number
    workHours: number
    actualQuantity: number
    budgetedQuantity: number
    unit: string // m², m³, kg, etc.
  }
  
  // Personnel involved
  personnel: {
    executor: {
      id: string
      name: string
      role: string
      signature?: string
    }
    supervisor?: {
      id: string
      name: string
      signature?: string
    }
    inspector?: {
      id: string
      name: string
      signature?: string
    }
  }
  
  // Materials used
  materials: Array<{
    id: string
    code: string
    name: string
    quantityUsed: number
    quantityWasted?: number
    unit: string
    supplier?: string
    lotNumber?: string
  }>
  
  // Quality information
  quality: {
    conformsToSpecs: boolean
    inspectionRequired: boolean
    inspectionDate?: Date
    inspectionResult?: 'APPROVED' | 'REJECTED' | 'CONDITIONAL'
    defects?: Array<{
      id: string
      type: string
      description: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      photos?: string[]
    }>
    correctiveActions?: Array<{
      id: string
      description: string
      responsible: string
      dueDate: Date
      completed: boolean
    }>
  }
  
  // Safety information
  safety: {
    incidentsReported: boolean
    incidents?: Array<{
      id: string
      type: string
      description: string
      severity: 'MINOR' | 'MAJOR' | 'SERIOUS' | 'FATAL'
      peopleInvolved: string[]
      actionsTaken: string
    }>
    safetyMeasuresApplied: string[]
    ppeUsed: string[]
  }
  
  // Documentation
  documentation: {
    photos: PhotoFile[]
    requiredPhotos: string[] // 'before', 'during', 'after', 'materials', 'defects'
    notes: string
    observations?: string
    supervisorNotes?: string
    inspectorNotes?: string
  }
  
  // Approval workflow
  approval: {
    currentStep: 'EXECUTION' | 'SUPERVISOR_REVIEW' | 'QUALITY_INSPECTION' | 'FINAL_APPROVAL'
    history: Array<{
      step: string
      user: string
      action: 'APPROVED' | 'REJECTED' | 'REQUESTED_CHANGES'
      timestamp: Date
      comments?: string
    }>
    finalApproval?: {
      approved: boolean
      approvedBy: string
      approvalDate: Date
      comments?: string
    }
  }
  
  // Metadata
  metadata: {
    createdAt: Date
    createdBy: string
    lastModified: Date
    modifiedBy: string
    offline?: boolean
    synced: boolean
    version: number
  }
}

// Form validation rules
export interface ValidationRules {
  requiredFields: string[]
  minimumPhotos: number
  requiredPhotoTypes: string[]
  maximumQuantityVariance: number // percentage
  requireInspection: boolean
  requireSupervisorApproval: boolean
}

export interface TaskRegistrationFormProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof taskRegistrationFormVariants> {
  // Form data
  task?: Partial<TaskRegistration>
  onTaskChange?: (task: Partial<TaskRegistration>) => void
  
  // Form configuration
  validationRules?: ValidationRules
  readOnly?: boolean
  currentUserRole?: 'WORKER' | 'SUPERVISOR' | 'QUALITY_INSPECTOR' | 'SITE_MANAGER'
  
  // Workflow control
  allowedActions?: Array<'SAVE_DRAFT' | 'SUBMIT' | 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES'>
  onAction?: (action: string, data: Partial<TaskRegistration>) => void
  
  // Data loading
  isLoading?: boolean
  isSaving?: boolean
  isSubmitting?: boolean
  
  // Offline support
  offlineMode?: boolean
  autoSave?: boolean
  autoSaveInterval?: number
  
  // Photo management
  maxPhotos?: number
  requiredPhotoTypes?: string[]
  onPhotoCapture?: (photo: PhotoFile) => void
  onPhotoDelete?: (photoId: string) => void
  
  // Material selection
  availableMaterials?: Array<{
    id: string
    code: string
    name: string
    unit: string
    availableQuantity: number
  }>
  onMaterialAdd?: (material: any) => void
  
  // Personnel data
  availablePersonnel?: Array<{
    id: string
    name: string
    role: string
    available: boolean
  }>
  
  // Location data
  currentLocation?: { lat: number; lng: number }
  
  // Error handling
  errors?: Record<string, string>
  onValidationError?: (errors: Record<string, string>) => void
  
  // Success handling
  onSubmitSuccess?: (task: TaskRegistration) => void
  onSaveSuccess?: (task: TaskRegistration) => void
}

const TaskRegistrationForm = React.forwardRef<HTMLDivElement, TaskRegistrationFormProps>(
  (
    {
      className,
      variant,
      layout,
      status,
      task = {},
      onTaskChange,
      validationRules = {
        requiredFields: ['activityCode', 'completion.executionDate', 'completion.actualQuantity'],
        minimumPhotos: 2,
        requiredPhotoTypes: ['before', 'after'],
        maximumQuantityVariance: 10,
        requireInspection: true,
        requireSupervisorApproval: true,
      },
      readOnly = false,
      currentUserRole = 'WORKER',
      allowedActions = ['SAVE_DRAFT', 'SUBMIT'],
      onAction,
      isLoading = false,
      isSaving = false,
      isSubmitting = false,
      offlineMode = false,
      autoSave = true,
      autoSaveInterval = 30000,
      maxPhotos = 10,
      requiredPhotoTypes = ['before', 'after'],
      onPhotoCapture,
      onPhotoDelete,
      availableMaterials = [],
      onMaterialAdd,
      availablePersonnel = [],
      currentLocation,
      errors = {},
      onValidationError,
      onSubmitSuccess,
      onSaveSuccess,
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = React.useState<Partial<TaskRegistration>>(task)
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>(errors)
    const [currentStep, setCurrentStep] = React.useState(0)
    const [showMaterialSelector, setShowMaterialSelector] = React.useState(false)
    const [selectedMaterials, setSelectedMaterials] = React.useState<TaskRegistration['materials']>(task.materials || [])
    const autoSaveTimer = React.useRef<NodeJS.Timeout>()
    
    // Auto-save functionality
    React.useEffect(() => {
      if (autoSave && !readOnly && Object.keys(formData).length > 0) {
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current)
        }
        
        autoSaveTimer.current = setTimeout(() => {
          handleSaveDraft()
        }, autoSaveInterval)
      }
      
      return () => {
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current)
        }
      }
    }, [formData, autoSave, autoSaveInterval])
    
    // Form field update handler
    const updateFormField = (path: string, value: any) => {
      const updatedTask = { ...formData }
      const keys = path.split('.')
      let current: any = updatedTask
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!current[key]) current[key] = {}
        current = current[key]
      }
      
      current[keys[keys.length - 1]] = value
      
      setFormData(updatedTask)
      if (onTaskChange) onTaskChange(updatedTask)
    }
    
    // Photo management
    const handlePhotoAdd = (photos: PhotoFile[]) => {
      const currentPhotos = formData.documentation?.photos || []
      const updatedPhotos = [...currentPhotos, ...photos]
      
      updateFormField('documentation.photos', updatedPhotos)
      
      photos.forEach(photo => {
        if (onPhotoCapture) onPhotoCapture(photo)
      })
    }
    
    const handlePhotoRemove = (photoId: string) => {
      const currentPhotos = formData.documentation?.photos || []
      const updatedPhotos = currentPhotos.filter(photo => photo.id !== photoId)
      
      updateFormField('documentation.photos', updatedPhotos)
      if (onPhotoDelete) onPhotoDelete(photoId)
    }
    
    // Material management
    const handleAddMaterial = (material: any) => {
      const updatedMaterials = [...selectedMaterials, {
        ...material,
        id: `${material.id}_${Date.now()}`,
        quantityUsed: 0,
      }]
      setSelectedMaterials(updatedMaterials)
      updateFormField('materials', updatedMaterials)
      setShowMaterialSelector(false)
      
      if (onMaterialAdd) onMaterialAdd(material)
    }
    
    const handleMaterialQuantityChange = (materialId: string, quantity: number) => {
      const updatedMaterials = selectedMaterials.map(m =>
        m.id === materialId ? { ...m, quantityUsed: quantity } : m
      )
      setSelectedMaterials(updatedMaterials)
      updateFormField('materials', updatedMaterials)
    }
    
    // Form validation
    const validateForm = (): boolean => {
      const errors: Record<string, string> = {}
      
      // Required fields validation
      validationRules.requiredFields.forEach(field => {
        const value = getNestedValue(formData, field)
        if (!value || value === '' || value === 0) {
          errors[field] = 'Este campo es obligatorio'
        }
      })
      
      // Photo validation
      const photos = formData.documentation?.photos || []
      if (photos.length < validationRules.minimumPhotos) {
        errors['documentation.photos'] = `Se requieren al menos ${validationRules.minimumPhotos} fotos`
      }
      
      // Required photo types validation
      const photoTypes = photos.map(p => p.category).filter(Boolean)
      const missingTypes = validationRules.requiredPhotoTypes.filter(type => !photoTypes.includes(type))
      if (missingTypes.length > 0) {
        errors['documentation.photoTypes'] = `Faltan fotos de: ${missingTypes.join(', ')}`
      }
      
      // Quantity variance validation
      const actualQuantity = formData.completion?.actualQuantity || 0
      const budgetedQuantity = formData.completion?.budgetedQuantity || 0
      if (budgetedQuantity > 0) {
        const variance = Math.abs(actualQuantity - budgetedQuantity) / budgetedQuantity * 100
        if (variance > validationRules.maximumQuantityVariance) {
          errors['completion.actualQuantity'] = `Variación excede el ${validationRules.maximumQuantityVariance}% permitido`
        }
      }
      
      setValidationErrors(errors)
      if (onValidationError) onValidationError(errors)
      
      return Object.keys(errors).length === 0
    }
    
    // Helper function to get nested object values
    const getNestedValue = (obj: any, path: string): any => {
      return path.split('.').reduce((current, key) => current?.[key], obj)
    }
    
    // Action handlers
    const handleSaveDraft = async () => {
      if (readOnly) return
      
      try {
        updateFormField('metadata.lastModified', new Date())
        updateFormField('completion.status', 'MATERIALS_PLANNED')
        
        if (onAction) {
          await onAction('SAVE_DRAFT', formData)
        }
        
        if (onSaveSuccess) {
          onSaveSuccess(formData as TaskRegistration)
        }
      } catch (error) {
        console.error('Error saving draft:', error)
      }
    }
    
    const handleSubmit = async () => {
      if (!validateForm()) return
      
      try {
        updateFormField('completion.status', 'EXECUTED')
        updateFormField('metadata.lastModified', new Date())
        
        if (onAction) {
          await onAction('SUBMIT', formData)
        }
        
        if (onSubmitSuccess) {
          onSubmitSuccess(formData as TaskRegistration)
        }
      } catch (error) {
        console.error('Error submitting task:', error)
      }
    }
    
    const handleApprove = async () => {
      if (!validateForm()) return
      
      try {
        updateFormField('completion.status', 'APPROVED')
        updateFormField('metadata.lastModified', new Date())
        
        if (onAction) {
          await onAction('APPROVE', formData)
        }
      } catch (error) {
        console.error('Error approving task:', error)
      }
    }
    
    const handleReject = async (reason: string) => {
      try {
        updateFormField('completion.status', 'REJECTED')
        updateFormField('metadata.lastModified', new Date())
        updateFormField('approval.history', [
          ...(formData.approval?.history || []),
          {
            step: 'REJECTION',
            user: 'current_user',
            action: 'REJECTED',
            timestamp: new Date(),
            comments: reason,
          }
        ])
        
        if (onAction) {
          await onAction('REJECT', formData)
        }
      } catch (error) {
        console.error('Error rejecting task:', error)
      }
    }
    
    // Form steps for wizard layout
    const formSteps = [
      {
        id: 'basic',
        title: 'Información Básica',
        description: 'Detalles de la actividad y ubicación',
      },
      {
        id: 'execution',
        title: 'Ejecución',
        description: 'Detalles de la faena ejecutada',
      },
      {
        id: 'materials',
        title: 'Materiales',
        description: 'Materiales utilizados',
      },
      {
        id: 'documentation',
        title: 'Documentación',
        description: 'Fotos y observaciones',
      },
      {
        id: 'quality',
        title: 'Calidad',
        description: 'Control de calidad y defectos',
      },
    ]
    
    if (isLoading) {
      return (
        <div className={cn(taskRegistrationFormVariants({ variant, layout, status }), className)}>
          <div className="flex items-center justify-center py-12">
            <Loading size="lg" />
            <Typography variant="body-large" color="muted" className="ml-3">
              Cargando formulario de registro...
            </Typography>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(taskRegistrationFormVariants({ variant, layout, status }), className)}
        {...props}
      >
        {/* Header */}
        <div className="border-b border-secondary-200 pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <Typography variant="h4" className="font-bold">
                Registro de Faena Ejecutada
              </Typography>
              <Typography variant="body-default" color="muted" className="mt-1">
                {formData.activityName || 'Nueva actividad'}
              </Typography>
              {formData.location && (
                <Typography variant="body-small" color="muted" className="mt-1">
                  {formData.location.project} • {formData.location.building} • {formData.location.unit}
                </Typography>
              )}
            </div>
            
            {formData.completion?.status && (
              <StatusCard
                status={{
                  value: formData.completion.status,
                  variant: formData.completion.status === 'APPROVED' ? 'success' : 
                          formData.completion.status === 'REJECTED' ? 'danger' : 'warning',
                }}
                size="sm"
              />
            )}
          </div>
          
          {/* Offline indicator */}
          {offlineMode && (
            <div className="flex items-center gap-2 mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
              <Icon name="wifi-off" size="sm" className="text-orange-600" />
              <Typography variant="body-small" className="text-orange-800">
                Trabajando sin conexión - Los cambios se sincronizarán automáticamente
              </Typography>
            </div>
          )}
          
          {/* Auto-save indicator */}
          {autoSave && !readOnly && (
            <div className="flex items-center gap-2 mt-2">
              <Icon name="save" size="xs" className="text-green-600" />
              <Typography variant="caption" className="text-green-700">
                Guardado automático activado
              </Typography>
            </div>
          )}
        </div>

        {/* Wizard Progress (if wizard layout) */}
        {layout === 'wizard' && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {formSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-center',
                    index < formSteps.length - 1 && 'flex-1'
                  )}
                >
                  <Badge
                    variant={index <= currentStep ? "primary" : "secondary"}
                    size="default"
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    {index + 1}
                  </Badge>
                  <div className="ml-3 hidden md:block">
                    <Typography variant="label-small" className="font-semibold">
                      {step.title}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {step.description}
                    </Typography>
                  </div>
                  {index < formSteps.length - 1 && (
                    <div className="flex-1 h-px bg-secondary-200 mx-4 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="space-y-8">
          {/* Basic Information */}
          {(layout !== 'wizard' || currentStep === 0) && (
            <section className="space-y-4">
              <Typography variant="h6" className="font-semibold">
                Información Básica
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Código de Actividad"
                  value={formData.activityCode || ''}
                  onChange={(value) => updateFormField('activityCode', value)}
                  placeholder="Ej: EAS-001"
                  required
                  disabled={readOnly}
                  error={validationErrors['activityCode']}
                />
                
                <FormField
                  label="Nombre de Actividad"
                  value={formData.activityName || ''}
                  onChange={(value) => updateFormField('activityName', value)}
                  placeholder="Ej: Hormigón armado losa"
                  required
                  disabled={readOnly}
                  error={validationErrors['activityName']}
                />
                
                <FormField
                  label="Código de Unidad"
                  value={formData.unitCode || ''}
                  onChange={(value) => updateFormField('unitCode', value)}
                  placeholder="Ej: EA-101"
                  disabled={readOnly}
                  error={validationErrors['unitCode']}
                />
                
                <FormField
                  label="Ubicación Específica"
                  value={formData.location?.unit || ''}
                  onChange={(value) => updateFormField('location.unit', value)}
                  placeholder="Ej: Dormitorio principal"
                  disabled={readOnly}
                  error={validationErrors['location.unit']}
                />
              </div>
              
              {currentLocation && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="map-pin" size="sm" className="text-blue-600" />
                    <Typography variant="label-small" className="font-semibold text-blue-800">
                      Ubicación GPS
                    </Typography>
                  </div>
                  <Typography variant="body-small" className="text-blue-700">
                    Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
                  </Typography>
                </div>
              )}
            </section>
          )}

          {/* Execution Details */}
          {(layout !== 'wizard' || currentStep === 1) && (
            <section className="space-y-4">
              <Typography variant="h6" className="font-semibold">
                Detalles de Ejecución
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Fecha de Ejecución"
                  type="date"
                  value={formData.completion?.executionDate ? 
                    formData.completion.executionDate.toISOString().split('T')[0] : ''}
                  onChange={(value) => updateFormField('completion.executionDate', new Date(value))}
                  required
                  disabled={readOnly}
                  error={validationErrors['completion.executionDate']}
                />
                
                <FormField
                  label="Porcentaje de Avance"
                  type="number"
                  value={formData.completion?.completionPercentage?.toString() || ''}
                  onChange={(value) => updateFormField('completion.completionPercentage', parseFloat(value))}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  unit="%"
                  required
                  disabled={readOnly}
                  error={validationErrors['completion.completionPercentage']}
                />
                
                <FormField
                  label="Cantidad Ejecutada"
                  type="number"
                  value={formData.completion?.actualQuantity?.toString() || ''}
                  onChange={(value) => updateFormField('completion.actualQuantity', parseFloat(value))}
                  placeholder="Cantidad real ejecutada"
                  unit={formData.completion?.unit || 'm²'}
                  required
                  disabled={readOnly}
                  error={validationErrors['completion.actualQuantity']}
                />
                
                <FormField
                  label="Cantidad Presupuestada"
                  type="number"
                  value={formData.completion?.budgetedQuantity?.toString() || ''}
                  onChange={(value) => updateFormField('completion.budgetedQuantity', parseFloat(value))}
                  placeholder="Cantidad según presupuesto"
                  unit={formData.completion?.unit || 'm²'}
                  disabled={readOnly}
                  error={validationErrors['completion.budgetedQuantity']}
                />
                
                <FormField
                  label="Horas de Trabajo"
                  type="number"
                  value={formData.completion?.workHours?.toString() || ''}
                  onChange={(value) => updateFormField('completion.workHours', parseFloat(value))}
                  placeholder="Horas trabajadas"
                  unit="hrs"
                  disabled={readOnly}
                  error={validationErrors['completion.workHours']}
                />
                
                <FormField
                  label="Unidad de Medida"
                  value={formData.completion?.unit || ''}
                  onChange={(value) => updateFormField('completion.unit', value)}
                  placeholder="m², m³, kg, etc."
                  disabled={readOnly}
                  error={validationErrors['completion.unit']}
                />
              </div>
            </section>
          )}

          {/* Materials */}
          {(layout !== 'wizard' || currentStep === 2) && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <Typography variant="h6" className="font-semibold">
                  Materiales Utilizados
                </Typography>
                {!readOnly && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMaterialSelector(true)}
                    leftIcon={<Icon name="plus" size="xs" />}
                  >
                    Agregar Material
                  </Button>
                )}
              </div>
              
              {selectedMaterials.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  <Icon name="package" size="lg" className="mx-auto mb-3" />
                  <Typography variant="body-default">
                    No se han agregado materiales
                  </Typography>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedMaterials.map((material, index) => (
                    <div
                      key={material.id}
                      className="flex items-center gap-4 p-3 bg-secondary-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <Typography variant="body-default" className="font-medium">
                          {material.code} - {material.name}
                        </Typography>
                        <Typography variant="body-small" color="muted">
                          Unidad: {material.unit}
                        </Typography>
                      </div>
                      
                      <div className="w-32">
                        <FormField
                          label="Cantidad"
                          type="number"
                          value={material.quantityUsed?.toString() || ''}
                          onChange={(value) => handleMaterialQuantityChange(material.id, parseFloat(value))}
                          placeholder="0"
                          unit={material.unit}
                          size="sm"
                          disabled={readOnly}
                        />
                      </div>
                      
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = selectedMaterials.filter(m => m.id !== material.id)
                            setSelectedMaterials(updated)
                            updateFormField('materials', updated)
                          }}
                        >
                          <Icon name="trash" size="xs" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Material selector modal */}
              {showMaterialSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h6" className="font-semibold">
                        Seleccionar Material
                      </Typography>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMaterialSelector(false)}
                      >
                        <Icon name="x" size="sm" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableMaterials.map((material) => (
                        <button
                          key={material.id}
                          className="w-full text-left p-3 hover:bg-secondary-50 rounded-md border border-secondary-200"
                          onClick={() => handleAddMaterial(material)}
                        >
                          <Typography variant="body-default" className="font-medium">
                            {material.code} - {material.name}
                          </Typography>
                          <Typography variant="body-small" color="muted">
                            Disponible: {material.availableQuantity} {material.unit}
                          </Typography>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Documentation */}
          {(layout !== 'wizard' || currentStep === 3) && (
            <section className="space-y-4">
              <Typography variant="h6" className="font-semibold">
                Documentación Fotográfica
              </Typography>
              
              {validationErrors['documentation.photos'] && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <Typography variant="body-small" className="text-red-800">
                    {validationErrors['documentation.photos']}
                  </Typography>
                </div>
              )}
              
              {validationErrors['documentation.photoTypes'] && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <Typography variant="body-small" className="text-orange-800">
                    {validationErrors['documentation.photoTypes']}
                  </Typography>
                </div>
              )}
              
              <PhotoUploader
                photos={formData.documentation?.photos || []}
                onPhotosAdd={handlePhotoAdd}
                onPhotoRemove={handlePhotoRemove}
                maxPhotos={maxPhotos}
                categories={[
                  { id: 'before', label: 'Antes', required: true },
                  { id: 'during', label: 'Durante', required: false },
                  { id: 'after', label: 'Después', required: true },
                  { id: 'materials', label: 'Materiales', required: false },
                  { id: 'defects', label: 'Defectos', required: false },
                ]}
                captureGPS={true}
                disabled={readOnly}
                variant="construction"
              />
              
              <FormField
                label="Observaciones"
                type="textarea"
                value={formData.documentation?.notes || ''}
                onChange={(value) => updateFormField('documentation.notes', value)}
                placeholder="Describa cualquier observación relevante sobre la ejecución..."
                rows={4}
                disabled={readOnly}
                error={validationErrors['documentation.notes']}
              />
            </section>
          )}

          {/* Quality Control */}
          {(layout !== 'wizard' || currentStep === 4) && (
            <section className="space-y-4">
              <Typography variant="h6" className="font-semibold">
                Control de Calidad
              </Typography>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="conformsToSpecs"
                    checked={formData.quality?.conformsToSpecs || false}
                    onChange={(e) => updateFormField('quality.conformsToSpecs', e.target.checked)}
                    disabled={readOnly}
                    className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="conformsToSpecs">
                    <Typography variant="body-default">
                      La faena cumple con las especificaciones técnicas
                    </Typography>
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="inspectionRequired"
                    checked={formData.quality?.inspectionRequired || false}
                    onChange={(e) => updateFormField('quality.inspectionRequired', e.target.checked)}
                    disabled={readOnly}
                    className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="inspectionRequired">
                    <Typography variant="body-default">
                      Requiere inspección adicional
                    </Typography>
                  </label>
                </div>
                
                {!formData.quality?.conformsToSpecs && (
                  <FormField
                    label="Descripción de No Conformidades"
                    type="textarea"
                    value={formData.quality?.defects?.[0]?.description || ''}
                    onChange={(value) => updateFormField('quality.defects', [{
                      id: '1',
                      type: 'SPECIFICATION',
                      description: value,
                      severity: 'MEDIUM',
                      photos: [],
                    }])}
                    placeholder="Describa las no conformidades encontradas..."
                    rows={3}
                    disabled={readOnly}
                    required
                  />
                )}
              </div>
            </section>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-secondary-200 pt-6 mt-8">
          {layout === 'wizard' ? (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                leftIcon={<Icon name="chevron-left" size="xs" />}
              >
                Anterior
              </Button>
              
              <div className="flex items-center gap-2">
                {allowedActions.includes('SAVE_DRAFT') && (
                  <Button
                    variant="ghost"
                    onClick={handleSaveDraft}
                    disabled={isSaving || readOnly}
                    leftIcon={isSaving ? <Loading size="xs" /> : <Icon name="save" size="xs" />}
                  >
                    {isSaving ? 'Guardando...' : 'Guardar Borrador'}
                  </Button>
                )}
                
                {currentStep < formSteps.length - 1 ? (
                  <Button
                    variant="default"
                    onClick={() => setCurrentStep(Math.min(formSteps.length - 1, currentStep + 1))}
                    rightIcon={<Icon name="chevron-right" size="xs" />}
                  >
                    Siguiente
                  </Button>
                ) : (
                  allowedActions.includes('SUBMIT') && (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting || readOnly}
                      leftIcon={isSubmitting ? <Loading size="xs" /> : <Icon name="send" size="xs" />}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar para Aprobación'}
                    </Button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {allowedActions.includes('SAVE_DRAFT') && (
                  <Button
                    variant="ghost"
                    onClick={handleSaveDraft}
                    disabled={isSaving || readOnly}
                    leftIcon={isSaving ? <Loading size="xs" /> : <Icon name="save" size="xs" />}
                  >
                    {isSaving ? 'Guardando...' : 'Guardar Borrador'}
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {allowedActions.includes('REJECT') && (
                  <Button
                    variant="destructive"
                    onClick={() => handleReject('Rechazado por supervisor')}
                    disabled={isSubmitting || readOnly}
                    leftIcon={<Icon name="x" size="xs" />}
                  >
                    Rechazar
                  </Button>
                )}
                
                {allowedActions.includes('APPROVE') && (
                  <Button
                    variant="success"
                    onClick={handleApprove}
                    disabled={isSubmitting || readOnly}
                    leftIcon={<Icon name="check" size="xs" />}
                  >
                    Aprobar
                  </Button>
                )}
                
                {allowedActions.includes('SUBMIT') && (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting || readOnly}
                    leftIcon={isSubmitting ? <Loading size="xs" /> : <Icon name="send" size="xs" />}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar para Aprobación'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

TaskRegistrationForm.displayName = 'TaskRegistrationForm'

export { TaskRegistrationForm, taskRegistrationFormVariants }
export type { TaskRegistration, ValidationRules }