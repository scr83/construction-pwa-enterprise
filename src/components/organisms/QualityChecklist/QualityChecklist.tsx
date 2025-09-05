'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { FormField } from '@/components/molecules/FormField'
import { StatusCard } from '@/components/molecules/StatusCard'
import { PhotoUploader, type PhotoFile } from '@/components/molecules/PhotoUploader'
import { DatePicker } from '@/components/molecules/DatePicker'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Loading } from '@/components/atoms/Loading'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'
import { Checkbox } from '@/components/atoms/Checkbox'

const qualityChecklistVariants = cva(
  'w-full max-w-5xl bg-white rounded-lg shadow-sm border border-secondary-200',
  {
    variants: {
      variant: {
        standard: 'p-6',
        compact: 'p-4',
        detailed: 'p-8',
      },
      layout: {
        single: 'space-y-6',
        grouped: 'space-y-8',
        sectioned: 'space-y-10',
      },
      status: {
        draft: 'border-l-4 border-l-gray-400',
        in_progress: 'border-l-4 border-l-blue-500',
        completed: 'border-l-4 border-l-green-500',
        approved: 'border-l-4 border-l-emerald-500',
        rejected: 'border-l-4 border-l-red-500',
        conditional: 'border-l-4 border-l-orange-500',
      },
    },
    defaultVariants: {
      variant: 'standard',
      layout: 'grouped',
      status: 'draft',
    },
  }
)

// Quality checklist item types
export type ChecklistItemType = 
  | 'VISUAL_INSPECTION'
  | 'MEASUREMENT' 
  | 'TEST'
  | 'DOCUMENTATION'
  | 'SAFETY_CHECK'
  | 'MATERIAL_VERIFICATION'
  | 'DIMENSIONAL_CONTROL'
  | 'SURFACE_FINISH'
  | 'STRUCTURAL_INTEGRITY'

// Quality checklist item
export interface ChecklistItem {
  id: string
  code: string
  description: string
  type: ChecklistItemType
  category: string
  
  // Requirements
  specification: string
  tolerance?: string
  acceptanceCriteria: string[]
  rejectCriteria: string[]
  
  // Inspection details
  inspection: {
    status: 'NOT_INSPECTED' | 'PASSED' | 'FAILED' | 'CONDITIONAL' | 'NOT_APPLICABLE'
    inspector?: {
      id: string
      name: string
      certification?: string
    }
    inspectionDate?: Date
    
    // Measurement data
    measuredValue?: number
    expectedValue?: number
    unit?: string
    tolerance?: number
    
    // Test results
    testResults?: Array<{
      parameter: string
      value: number | string | boolean
      expected: number | string | boolean
      passed: boolean
      unit?: string
    }>
    
    // Visual inspection
    visualResult?: {
      condition: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'UNACCEPTABLE'
      defects?: Array<{
        type: string
        severity: 'MINOR' | 'MAJOR' | 'CRITICAL'
        description: string
        location?: string
      }>
    }
    
    // Documentation
    photos: PhotoFile[]
    notes: string
    recommendations?: string
  }
  
  // Corrective actions
  correctiveActions: Array<{
    id: string
    description: string
    responsible: string
    dueDate: Date
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
    completionDate?: Date
    verificationPhotos?: PhotoFile[]
  }>
  
  // Metadata
  mandatory: boolean
  weight: number // For scoring
  dependencies?: string[] // Other checklist item IDs that must pass first
}

// Quality checklist configuration
export interface QualityChecklist {
  id: string
  name: string
  version: string
  activityCode: string
  activityName: string
  
  // Project context
  project: {
    id: string
    name: string
    code: string
  }
  
  location: {
    building?: string
    floor?: string
    unit?: string
    area?: string
    coordinates?: { lat: number; lng: number }
  }
  
  // Checklist items organized by categories
  categories: Array<{
    id: string
    name: string
    description?: string
    items: ChecklistItem[]
    weight: number // For category scoring
    mandatory: boolean
  }>
  
  // Overall assessment
  assessment: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED' | 'CONDITIONAL'
    overallScore?: number // 0-100
    categoryScores: Record<string, number>
    
    inspectorId?: string
    inspectorName?: string
    inspectionDate?: Date
    completionDate?: Date
    
    // Final decision
    decision: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONDITIONAL_APPROVAL'
    decisionReason?: string
    decisionBy?: string
    decisionDate?: Date
    
    // Summary counts
    summary: {
      totalItems: number
      passedItems: number
      failedItems: number
      conditionalItems: number
      notInspected: number
      notApplicable: number
    }
    
    // Critical issues
    criticalIssues: Array<{
      itemId: string
      description: string
      severity: 'HIGH' | 'CRITICAL'
      requiresImmediate: boolean
    }>
  }
  
  // Workflow
  workflow: {
    currentStep: 'INSPECTION' | 'REVIEW' | 'APPROVAL' | 'CORRECTIVE_ACTIONS' | 'RE_INSPECTION'
    history: Array<{
      step: string
      user: string
      action: string
      timestamp: Date
      comments?: string
    }>
    
    approvals: Array<{
      role: 'INSPECTOR' | 'SUPERVISOR' | 'QUALITY_MANAGER' | 'SITE_MANAGER'
      user?: string
      status: 'PENDING' | 'APPROVED' | 'REJECTED'
      date?: Date
      comments?: string
    }>
  }
  
  // Metadata
  metadata: {
    createdAt: Date
    createdBy: string
    lastModified: Date
    modifiedBy: string
    template: string
    offline?: boolean
    synced: boolean
    version: number
  }
}

export interface QualityChecklistProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof qualityChecklistVariants> {
  // Checklist data
  checklist: QualityChecklist
  onChecklistChange?: (checklist: QualityChecklist) => void
  
  // User context
  currentUser?: {
    id: string
    name: string
    role: 'INSPECTOR' | 'SUPERVISOR' | 'QUALITY_MANAGER' | 'SITE_MANAGER'
    certifications?: string[]
  }
  
  // Permissions and workflow
  readOnly?: boolean
  allowedActions?: Array<'INSPECT' | 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTIONS' | 'ADD_NOTES' | 'UPLOAD_PHOTOS'>
  
  // Display configuration
  showScoring?: boolean
  showPhotos?: boolean
  showCorrectiveActions?: boolean
  groupByCategory?: boolean
  expandedCategories?: string[]
  onCategoryExpand?: (categoryId: string, expanded: boolean) => void
  
  // Photo management
  maxPhotosPerItem?: number
  requiredPhotoTypes?: string[]
  onPhotoCapture?: (itemId: string, photo: PhotoFile) => void
  onPhotoDelete?: (itemId: string, photoId: string) => void
  
  // Actions
  onItemInspect?: (itemId: string, result: ChecklistItem['inspection']) => void
  onCorrectiveActionAdd?: (itemId: string, action: ChecklistItem['correctiveActions'][0]) => void
  onCorrectiveActionUpdate?: (itemId: string, actionId: string, updates: Partial<ChecklistItem['correctiveActions'][0]>) => void
  
  // Workflow actions
  onSubmitForApproval?: (checklist: QualityChecklist) => void
  onApprove?: (checklist: QualityChecklist, comments?: string) => void
  onReject?: (checklist: QualityChecklist, reason: string) => void
  onRequestCorrections?: (checklist: QualityChecklist, items: string[], comments: string) => void
  
  // Loading states
  isLoading?: boolean
  isSaving?: boolean
  isSubmitting?: boolean
  
  // Offline support
  offlineMode?: boolean
  autoSave?: boolean
  
  // Error handling
  errors?: Record<string, string>
  onValidationError?: (errors: Record<string, string>) => void
}

const QualityChecklist = React.forwardRef<HTMLDivElement, QualityChecklistProps>(
  (
    {
      className,
      variant,
      layout,
      status,
      checklist,
      onChecklistChange,
      currentUser,
      readOnly = false,
      allowedActions = ['INSPECT', 'ADD_NOTES', 'UPLOAD_PHOTOS'],
      showScoring = true,
      showPhotos = true,
      showCorrectiveActions = true,
      groupByCategory = true,
      expandedCategories = [],
      onCategoryExpand,
      maxPhotosPerItem = 5,
      requiredPhotoTypes = [],
      onPhotoCapture,
      onPhotoDelete,
      onItemInspect,
      onCorrectiveActionAdd,
      onCorrectiveActionUpdate,
      onSubmitForApproval,
      onApprove,
      onReject,
      onRequestCorrections,
      isLoading = false,
      isSaving = false,
      isSubmitting = false,
      offlineMode = false,
      autoSave = true,
      errors = {},
      onValidationError,
      ...props
    },
    ref
  ) => {
    const [localChecklist, setLocalChecklist] = React.useState(checklist)
    const [expandedItems, setExpandedItems] = React.useState<string[]>([])
    const [showCorrectiveActionForm, setShowCorrectiveActionForm] = React.useState<string | null>(null)
    const [newCorrectiveAction, setNewCorrectiveAction] = React.useState<Partial<ChecklistItem['correctiveActions'][0]>>({})
    
    // Update local state when prop changes
    React.useEffect(() => {
      setLocalChecklist(checklist)
    }, [checklist])
    
    // Update checklist helper
    const updateChecklist = (updates: Partial<QualityChecklist>) => {
      const updated = { ...localChecklist, ...updates }
      setLocalChecklist(updated)
      if (onChecklistChange) onChecklistChange(updated)
    }
    
    // Update checklist item
    const updateChecklistItem = (categoryId: string, itemId: string, updates: Partial<ChecklistItem>) => {
      const updatedCategories = localChecklist.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        }
        return category
      })
      
      updateChecklist({ categories: updatedCategories })
      recalculateScores(updatedCategories)
    }
    
    // Recalculate assessment scores
    const recalculateScores = (categories: QualityChecklist['categories']) => {
      let totalItems = 0
      let passedItems = 0
      let failedItems = 0
      let conditionalItems = 0
      let notInspected = 0
      let notApplicable = 0
      
      const categoryScores: Record<string, number> = {}
      const criticalIssues: QualityChecklist['assessment']['criticalIssues'] = []
      
      categories.forEach(category => {
        let categoryTotal = 0
        let categoryPassed = 0
        let categoryWeight = 0
        
        category.items.forEach(item => {
          totalItems++
          categoryTotal++
          categoryWeight += item.weight
          
          switch (item.inspection.status) {
            case 'PASSED':
              passedItems++
              categoryPassed += item.weight
              break
            case 'FAILED':
              failedItems++
              // Check for critical issues
              if (item.inspection.visualResult?.defects?.some(d => d.severity === 'CRITICAL')) {
                criticalIssues.push({
                  itemId: item.id,
                  description: item.description,
                  severity: 'CRITICAL',
                  requiresImmediate: true,
                })
              }
              break
            case 'CONDITIONAL':
              conditionalItems++
              categoryPassed += item.weight * 0.5 // Half credit for conditional
              break
            case 'NOT_APPLICABLE':
              notApplicable++
              totalItems-- // Don't count in totals
              categoryTotal--
              break
            case 'NOT_INSPECTED':
            default:
              notInspected++
              break
          }
        })
        
        categoryScores[category.id] = categoryWeight > 0 ? (categoryPassed / categoryWeight) * 100 : 0
      })
      
      const overallScore = totalItems > 0 ? (passedItems / totalItems) * 100 : 0
      
      updateChecklist({
        assessment: {
          ...localChecklist.assessment,
          overallScore,
          categoryScores,
          summary: {
            totalItems,
            passedItems,
            failedItems,
            conditionalItems,
            notInspected,
            notApplicable,
          },
          criticalIssues,
        }
      })
    }
    
    // Handle item inspection
    const handleItemInspect = (categoryId: string, itemId: string, inspection: Partial<ChecklistItem['inspection']>) => {
      const updatedInspection = {
        ...inspection,
        inspector: currentUser ? {
          id: currentUser.id,
          name: currentUser.name,
          certification: currentUser.certifications?.[0],
        } : undefined,
        inspectionDate: new Date(),
      }
      
      updateChecklistItem(categoryId, itemId, { inspection: updatedInspection })
      
      if (onItemInspect) {
        onItemInspect(itemId, updatedInspection as ChecklistItem['inspection'])
      }
    }
    
    // Handle photo management for items
    const handleItemPhotoAdd = (categoryId: string, itemId: string, photos: PhotoFile[]) => {
      const category = localChecklist.categories.find(c => c.id === categoryId)
      const item = category?.items.find(i => i.id === itemId)
      
      if (item) {
        const updatedPhotos = [...(item.inspection.photos || []), ...photos]
        updateChecklistItem(categoryId, itemId, {
          inspection: {
            ...item.inspection,
            photos: updatedPhotos,
          }
        })
        
        photos.forEach(photo => {
          if (onPhotoCapture) onPhotoCapture(itemId, photo)
        })
      }
    }
    
    const handleItemPhotoRemove = (categoryId: string, itemId: string, photoId: string) => {
      const category = localChecklist.categories.find(c => c.id === categoryId)
      const item = category?.items.find(i => i.id === itemId)
      
      if (item) {
        const updatedPhotos = item.inspection.photos.filter(p => p.id !== photoId)
        updateChecklistItem(categoryId, itemId, {
          inspection: {
            ...item.inspection,
            photos: updatedPhotos,
          }
        })
        
        if (onPhotoDelete) onPhotoDelete(itemId, photoId)
      }
    }
    
    // Handle corrective action management
    const handleAddCorrectiveAction = (categoryId: string, itemId: string) => {
      if (!newCorrectiveAction.description) return
      
      const action: ChecklistItem['correctiveActions'][0] = {
        id: `ca_${Date.now()}`,
        description: newCorrectiveAction.description,
        responsible: newCorrectiveAction.responsible || '',
        dueDate: newCorrectiveAction.dueDate || new Date(),
        priority: newCorrectiveAction.priority || 'MEDIUM',
        status: 'PENDING',
      }
      
      const category = localChecklist.categories.find(c => c.id === categoryId)
      const item = category?.items.find(i => i.id === itemId)
      
      if (item) {
        const updatedActions = [...item.correctiveActions, action]
        updateChecklistItem(categoryId, itemId, { correctiveActions: updatedActions })
        
        if (onCorrectiveActionAdd) onCorrectiveActionAdd(itemId, action)
      }
      
      setNewCorrectiveAction({})
      setShowCorrectiveActionForm(null)
    }
    
    // Get status configuration
    const getStatusConfig = (status: ChecklistItem['inspection']['status']) => {
      switch (status) {
        case 'PASSED':
          return { label: 'Aprobado', variant: 'success', color: 'text-green-700', icon: 'check-circle' }
        case 'FAILED':
          return { label: 'Rechazado', variant: 'danger', color: 'text-red-700', icon: 'x-circle' }
        case 'CONDITIONAL':
          return { label: 'Condicional', variant: 'warning', color: 'text-orange-700', icon: 'alert-circle' }
        case 'NOT_APPLICABLE':
          return { label: 'No Aplica', variant: 'secondary', color: 'text-gray-700', icon: 'minus-circle' }
        case 'NOT_INSPECTED':
        default:
          return { label: 'Pendiente', variant: 'info', color: 'text-blue-700', icon: 'clock' }
      }
    }
    
    // Get priority color
    const getPriorityColor = (priority: ChecklistItem['correctiveActions'][0]['priority']) => {
      switch (priority) {
        case 'CRITICAL':
          return 'bg-red-100 text-red-800 border-red-200'
        case 'HIGH':
          return 'bg-orange-100 text-orange-800 border-orange-200'
        case 'MEDIUM':
          return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'LOW':
          return 'bg-gray-100 text-gray-800 border-gray-200'
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }
    
    if (isLoading) {
      return (
        <div className={cn(qualityChecklistVariants({ variant, layout, status }), className)}>
          <div className="flex items-center justify-center py-12">
            <Loading size="lg" />
            <Typography variant="body-large" color="muted" className="ml-3">
              Cargando checklist de calidad...
            </Typography>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(qualityChecklistVariants({ variant, layout, status }), className)}
        {...props}
      >
        {/* Header */}
        <div className="border-b border-secondary-200 pb-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Typography variant="h4" className="font-bold">
                {localChecklist.name}
              </Typography>
              <Typography variant="body-default" color="muted" className="mt-1">
                {localChecklist.activityName} • Versión {localChecklist.version}
              </Typography>
              <Typography variant="body-small" color="muted" className="mt-1">
                {localChecklist.project.name} • {localChecklist.location.building} • {localChecklist.location.unit}
              </Typography>
            </div>
            
            <div className="flex items-center gap-3">
              <StatusCard
                status={{
                  value: localChecklist.assessment.status,
                  variant: localChecklist.assessment.status === 'APPROVED' ? 'success' : 
                          localChecklist.assessment.status === 'REJECTED' ? 'danger' : 'warning',
                }}
                size="sm"
              />
              {localChecklist.assessment.inspectorId && (
                <div className="flex items-center gap-2">
                  <Avatar
                    size="xs"
                    name={localChecklist.assessment.inspectorName || 'Inspector'}
                    roleIndicator={{
                      color: 'blue-600',
                      label: 'Inspector'
                    }}
                  />
                  <Badge variant="primary" size="xs">
                    Inspector
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          {/* Overall Progress */}
          {showScoring && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Typography variant="label-small" color="muted">Score General</Typography>
                <Typography variant="h5" className="font-bold text-primary-700">
                  {localChecklist.assessment.overallScore?.toFixed(1) || 0}%
                </Typography>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Typography variant="label-small" color="muted">Aprobados</Typography>
                <Typography variant="h5" className="font-bold text-green-700">
                  {localChecklist.assessment.summary.passedItems}
                </Typography>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Typography variant="label-small" color="muted">Rechazados</Typography>
                <Typography variant="h5" className="font-bold text-red-700">
                  {localChecklist.assessment.summary.failedItems}
                </Typography>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Typography variant="label-small" color="muted">Pendientes</Typography>
                <Typography variant="h5" className="font-bold text-blue-700">
                  {localChecklist.assessment.summary.notInspected}
                </Typography>
              </div>
            </div>
          )}
          
          {/* Critical Issues */}
          {localChecklist.assessment.criticalIssues.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="danger" size="sm" icon="alert-triangle" count={localChecklist.assessment.criticalIssues.length}>
                  Problemas Críticos
                </Badge>
              </div>
              <div className="space-y-1">
                {localChecklist.assessment.criticalIssues.map((issue) => (
                  <Typography key={issue.itemId} variant="body-small" className="text-red-700">
                    • {issue.description}
                  </Typography>
                ))}
              </div>
            </div>
          )}
          
          {/* Offline indicator */}
          {offlineMode && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
              <Badge variant="warning" size="sm" icon="wifi-off">
                Sin conexión - Sincronizando automáticamente
              </Badge>
            </div>
          )}
        </div>

        {/* Checklist Categories */}
        <div className="space-y-6">
          {localChecklist.categories.map((category) => (
            <div key={category.id} className="border border-secondary-200 rounded-lg">
              {/* Category Header */}
              <div 
                className="flex items-center justify-between p-4 bg-secondary-50 cursor-pointer hover:bg-secondary-100 transition-colors"
                onClick={() => {
                  const isExpanded = expandedCategories.includes(category.id)
                  if (onCategoryExpand) onCategoryExpand(category.id, !isExpanded)
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    name={expandedCategories.includes(category.id) ? 'chevron-down' : 'chevron-right'} 
                    size="sm" 
                  />
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      {category.name}
                    </Typography>
                    {category.description && (
                      <Typography variant="body-small" color="muted">
                        {category.description}
                      </Typography>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {showScoring && (
                    <div className="text-right">
                      <Typography variant="label-small" color="muted">Score</Typography>
                      <Typography variant="body-default" className="font-semibold">
                        {localChecklist.assessment.categoryScores[category.id]?.toFixed(1) || 0}%
                      </Typography>
                    </div>
                  )}
                  
                  <div className="text-right">
                    <Typography variant="label-small" color="muted">Items</Typography>
                    <Typography variant="body-default" className="font-semibold">
                      {category.items.filter(i => i.inspection.status === 'PASSED').length}/{category.items.length}
                    </Typography>
                  </div>
                </div>
              </div>
              
              {/* Category Items */}
              {expandedCategories.includes(category.id) && (
                <div className="divide-y divide-secondary-200">
                  {category.items.map((item) => (
                    <div key={item.id} className="p-4">
                      {/* Item Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Typography variant="body-default" className="font-semibold">
                              {item.code}
                            </Typography>
                            {item.mandatory && (
                              <Badge variant="danger" size="xs">
                                Obligatorio
                              </Badge>
                            )}
                            <Badge variant="secondary" size="xs">
                              {item.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <Typography variant="body-default" className="mb-2">
                            {item.description}
                          </Typography>
                          <Typography variant="body-small" color="muted">
                            {item.specification}
                          </Typography>
                        </div>
                        
                        <StatusCard
                          status={{
                            value: getStatusConfig(item.inspection.status).label,
                            variant: getStatusConfig(item.inspection.status).variant as any,
                          }}
                          size="sm"
                        />
                      </div>
                      
                      {/* Inspection Actions */}
                      {!readOnly && allowedActions.includes('INSPECT') && item.inspection.status === 'NOT_INSPECTED' && (
                        <div className="flex items-center gap-2 mb-4">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleItemInspect(category.id, item.id, { status: 'PASSED' })}
                            leftIcon={<Icon name="check" size="xs" />}
                          >
                            Aprobar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleItemInspect(category.id, item.id, { status: 'FAILED' })}
                            leftIcon={<Icon name="x" size="xs" />}
                          >
                            Rechazar
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleItemInspect(category.id, item.id, { status: 'CONDITIONAL' })}
                            leftIcon={<Icon name="alert-triangle" size="xs" />}
                          >
                            Condicional
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleItemInspect(category.id, item.id, { status: 'NOT_APPLICABLE' })}
                          >
                            No Aplica
                          </Button>
                        </div>
                      )}
                      
                      {/* Inspection Details */}
                      {expandedItems.includes(item.id) && (
                        <div className="mt-4 space-y-4 p-4 bg-secondary-25 rounded-lg">
                          {/* Acceptance/Reject Criteria */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Typography variant="label-small" className="font-semibold mb-2">
                                Criterios de Aceptación
                              </Typography>
                              <ul className="space-y-1">
                                {item.acceptanceCriteria.map((criterion, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <Icon name="check" size="xs" className="text-green-600 mt-0.5" />
                                    <span>{criterion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <Typography variant="label-small" className="font-semibold mb-2">
                                Criterios de Rechazo
                              </Typography>
                              <ul className="space-y-1">
                                {item.rejectCriteria.map((criterion, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <Icon name="x" size="xs" className="text-red-600 mt-0.5" />
                                    <span>{criterion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {/* Measurement Data */}
                          {item.type === 'MEASUREMENT' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <FormField
                                label="Valor Medido"
                                type="number"
                                value={item.inspection.measuredValue?.toString() || ''}
                                onChange={(value) => {
                                  const inspection = {
                                    ...item.inspection,
                                    measuredValue: parseFloat(value),
                                  }
                                  handleItemInspect(category.id, item.id, inspection)
                                }}
                                unit={item.inspection.unit}
                                disabled={readOnly || !allowedActions.includes('INSPECT')}
                                size="sm"
                              />
                              
                              <FormField
                                label="Valor Esperado"
                                type="number"
                                value={item.inspection.expectedValue?.toString() || ''}
                                onChange={(value) => {
                                  const inspection = {
                                    ...item.inspection,
                                    expectedValue: parseFloat(value),
                                  }
                                  handleItemInspect(category.id, item.id, inspection)
                                }}
                                unit={item.inspection.unit}
                                disabled={readOnly || !allowedActions.includes('INSPECT')}
                                size="sm"
                              />
                              
                              <FormField
                                label="Tolerancia"
                                type="number"
                                value={item.inspection.tolerance?.toString() || ''}
                                onChange={(value) => {
                                  const inspection = {
                                    ...item.inspection,
                                    tolerance: parseFloat(value),
                                  }
                                  handleItemInspect(category.id, item.id, inspection)
                                }}
                                unit={item.inspection.unit}
                                disabled={readOnly || !allowedActions.includes('INSPECT')}
                                size="sm"
                              />
                            </div>
                          )}
                          
                          {/* Notes */}
                          <FormField
                            label="Notas de Inspección"
                            type="textarea"
                            value={item.inspection.notes || ''}
                            onChange={(value) => {
                              const inspection = {
                                ...item.inspection,
                                notes: value,
                              }
                              handleItemInspect(category.id, item.id, inspection)
                            }}
                            placeholder="Observaciones sobre la inspección..."
                            rows={3}
                            disabled={readOnly || !allowedActions.includes('ADD_NOTES')}
                            size="sm"
                          />
                          
                          {/* Photos */}
                          {showPhotos && allowedActions.includes('UPLOAD_PHOTOS') && (
                            <div>
                              <Typography variant="label-small" className="font-semibold mb-3">
                                Fotos de Inspección
                              </Typography>
                              <PhotoUploader
                                photos={item.inspection.photos}
                                onPhotosAdd={(photos) => handleItemPhotoAdd(category.id, item.id, photos)}
                                onPhotoRemove={(photoId) => handleItemPhotoRemove(category.id, item.id, photoId)}
                                maxPhotos={maxPhotosPerItem}
                                categories={[
                                  { id: 'general', label: 'General', required: false },
                                  { id: 'defect', label: 'Defectos', required: false },
                                  { id: 'measurement', label: 'Medición', required: false },
                                ]}
                                captureGPS={true}
                                disabled={readOnly}
                                variant="compact"
                                size="sm"
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Toggle expanded details */}
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setExpandedItems(prev => 
                              prev.includes(item.id) 
                                ? prev.filter(id => id !== item.id)
                                : [...prev, item.id]
                            )
                          }}
                          rightIcon={
                            <Icon 
                              name={expandedItems.includes(item.id) ? 'chevron-up' : 'chevron-down'} 
                              size="xs" 
                            />
                          }
                        >
                          {expandedItems.includes(item.id) ? 'Ocultar detalles' : 'Ver detalles'}
                        </Button>
                      </div>
                      
                      {/* Corrective Actions */}
                      {showCorrectiveActions && (item.inspection.status === 'FAILED' || item.inspection.status === 'CONDITIONAL') && (
                        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <Typography variant="label-default" className="font-semibold">
                              Acciones Correctivas ({item.correctiveActions.length})
                            </Typography>
                            
                            {!readOnly && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCorrectiveActionForm(item.id)}
                                leftIcon={<Icon name="plus" size="xs" />}
                              >
                                Agregar Acción
                              </Button>
                            )}
                          </div>
                          
                          {/* Existing Actions */}
                          <div className="space-y-2">
                            {item.correctiveActions.map((action) => (
                              <div
                                key={action.id}
                                className="flex items-start justify-between p-3 bg-white border border-orange-200 rounded-md"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                      variant={action.priority === 'CRITICAL' ? 'danger' : 
                                              action.priority === 'HIGH' ? 'warning' : 
                                              action.priority === 'MEDIUM' ? 'primary' : 'secondary'}
                                      size="xs"
                                    >
                                      {action.priority}
                                    </Badge>
                                    <StatusCard
                                      status={{
                                        value: action.status,
                                        variant: action.status === 'COMPLETED' ? 'success' : 
                                                action.status === 'OVERDUE' ? 'danger' : 'info',
                                      }}
                                      size="xs"
                                    />
                                  </div>
                                  <Typography variant="body-small" className="mb-1">
                                    {action.description}
                                  </Typography>
                                  <Typography variant="caption" color="muted">
                                    Responsable: {action.responsible} • Vence: {action.dueDate.toLocaleDateString()}
                                  </Typography>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* New Action Form */}
                          {showCorrectiveActionForm === item.id && (
                            <div className="mt-4 p-4 bg-white border border-orange-300 rounded-md">
                              <Typography variant="label-default" className="font-semibold mb-3">
                                Nueva Acción Correctiva
                              </Typography>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <FormField
                                  label="Descripción"
                                  value={newCorrectiveAction.description || ''}
                                  onChange={(value) => setNewCorrectiveAction(prev => ({ ...prev, description: value }))}
                                  placeholder="Describir la acción correctiva..."
                                  size="sm"
                                />
                                
                                <FormField
                                  label="Responsable"
                                  value={newCorrectiveAction.responsible || ''}
                                  onChange={(value) => setNewCorrectiveAction(prev => ({ ...prev, responsible: value }))}
                                  placeholder="Nombre del responsable"
                                  size="sm"
                                />
                                
                                <div className="space-y-2">
                                  <Typography variant="label-default" className="font-medium">
                                    Fecha Límite
                                  </Typography>
                                  <DatePicker
                                    value={newCorrectiveAction.dueDate}
                                    onChange={(date) => date && setNewCorrectiveAction(prev => ({ ...prev, dueDate: date }))}
                                    placeholder="Seleccione fecha límite"
                                    variant="outline"
                                    showTime={false}
                                    minDate={new Date()}
                                    presets={[
                                      { label: 'En 1 semana', value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
                                      { label: 'En 2 semanas', value: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
                                      { label: 'En 1 mes', value: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
                                    ]}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                                    Prioridad
                                  </label>
                                  <select
                                    value={newCorrectiveAction.priority || 'MEDIUM'}
                                    onChange={(e) => setNewCorrectiveAction(prev => ({ 
                                      ...prev, 
                                      priority: e.target.value as ChecklistItem['correctiveActions'][0]['priority'] 
                                    }))}
                                    className="w-full px-3 py-2 border border-secondary-300 rounded-md text-sm"
                                  >
                                    <option value="LOW">Baja</option>
                                    <option value="MEDIUM">Media</option>
                                    <option value="HIGH">Alta</option>
                                    <option value="CRITICAL">Crítica</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleAddCorrectiveAction(category.id, item.id)}
                                  disabled={!newCorrectiveAction.description}
                                >
                                  Guardar Acción
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setShowCorrectiveActionForm(null)
                                    setNewCorrectiveAction({})
                                  }}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="border-t border-secondary-200 pt-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Typography variant="body-small" color="muted">
                Última modificación: {localChecklist.metadata.lastModified.toLocaleString()}
              </Typography>
              {isSaving && (
                <div className="flex items-center gap-2">
                  <Loading size="xs" />
                  <Typography variant="body-small" color="muted">
                    Guardando...
                  </Typography>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {allowedActions.includes('REQUEST_CORRECTIONS') && (
                <Button
                  variant="warning"
                  onClick={() => console.log('Request corrections')}
                  disabled={isSubmitting || readOnly}
                  leftIcon={<Icon name="edit" size="xs" />}
                >
                  Solicitar Correcciones
                </Button>
              )}
              
              {allowedActions.includes('REJECT') && (
                <Button
                  variant="destructive"
                  onClick={() => onReject && onReject(localChecklist, 'Checklist rechazado')}
                  disabled={isSubmitting || readOnly}
                  leftIcon={<Icon name="x" size="xs" />}
                >
                  Rechazar
                </Button>
              )}
              
              {allowedActions.includes('APPROVE') && (
                <Button
                  variant="success"
                  onClick={() => onApprove && onApprove(localChecklist)}
                  disabled={isSubmitting || readOnly}
                  leftIcon={<Icon name="check" size="xs" />}
                >
                  Aprobar
                </Button>
              )}
              
              <Button
                variant="primary"
                onClick={() => onSubmitForApproval && onSubmitForApproval(localChecklist)}
                disabled={isSubmitting || readOnly}
                leftIcon={isSubmitting ? <Loading size="xs" /> : <Icon name="send" size="xs" />}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar para Aprobación'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

QualityChecklist.displayName = 'QualityChecklist'

export { QualityChecklist, qualityChecklistVariants }
export type { ChecklistItem, ChecklistItemType }