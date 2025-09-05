'use client'

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TaskRegistrationForm } from './TaskRegistrationForm'
import type { TaskRegistration } from './TaskRegistrationForm'

const meta: Meta<typeof TaskRegistrationForm> = {
  title: 'Construction/Organisms/TaskRegistrationForm',
  component: TaskRegistrationForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete work completion registration form with photos and validation for construction activities.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-secondary-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['standard', 'compact', 'mobile'],
      description: 'Form size variant',
    },
    layout: {
      control: { type: 'select' },
      options: ['single', 'sectioned', 'wizard'],
      description: 'Form layout style',
    },
    status: {
      control: { type: 'select' },
      options: ['draft', 'in_progress', 'pending_approval', 'approved', 'rejected'],
      description: 'Current form status',
    },
    currentUserRole: {
      control: { type: 'select' },
      options: ['WORKER', 'SUPERVISOR', 'QUALITY_INSPECTOR', 'SITE_MANAGER'],
      description: 'Current user role',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'Read-only mode',
    },
    offlineMode: {
      control: { type: 'boolean' },
      description: 'Offline working mode',
    },
    autoSave: {
      control: { type: 'boolean' },
      description: 'Auto-save functionality',
    },
  },
}

export default meta
type Story = StoryObj<typeof TaskRegistrationForm>

// Sample materials
const sampleMaterials = [
  {
    id: 'mat1',
    code: 'HOR-H25',
    name: 'Hormigón H25 con aditivo',
    unit: 'm³',
    availableQuantity: 50,
  },
  {
    id: 'mat2',
    code: 'FE-A630-420H',
    name: 'Fierro A630-420H ø12mm',
    unit: 'kg',
    availableQuantity: 1500,
  },
  {
    id: 'mat3',
    code: 'CEM-ESP',
    name: 'Cemento especial',
    unit: 'saco',
    availableQuantity: 100,
  },
  {
    id: 'mat4',
    code: 'ARD-LAVADA',
    name: 'Arena lavada',
    unit: 'm³',
    availableQuantity: 25,
  },
]

// Sample personnel
const samplePersonnel = [
  { id: 'p1', name: 'Carlos Mendoza', role: 'Jefe de Terreno', available: true },
  { id: 'p2', name: 'Ana Rodriguez', role: 'Supervisor', available: true },
  { id: 'p3', name: 'Miguel Torres', role: 'Operario', available: true },
  { id: 'p4', name: 'Laura Silva', role: 'Inspector de Calidad', available: false },
]

// Sample task data
const sampleTaskDraft: Partial<TaskRegistration> = {
  taskId: 'task-001',
  activityCode: 'EAS-001',
  activityName: 'Hormigón armado losa de piso',
  unitCode: 'EA-101',
  location: {
    project: 'Torres del Mar',
    building: 'Edificio A',
    floor: 'Piso 1',
    unit: 'Departamento 101',
  },
  completion: {
    status: 'MATERIALS_PLANNED',
    executionDate: new Date(),
    completionPercentage: 0,
    workHours: 0,
    actualQuantity: 0,
    budgetedQuantity: 25.5,
    unit: 'm²',
  },
  metadata: {
    createdAt: new Date(),
    createdBy: 'worker-001',
    lastModified: new Date(),
    modifiedBy: 'worker-001',
    synced: true,
    version: 1,
  },
}

const sampleTaskInProgress: Partial<TaskRegistration> = {
  ...sampleTaskDraft,
  completion: {
    status: 'EXECUTED',
    executionDate: new Date(),
    completionPercentage: 85,
    workHours: 8,
    actualQuantity: 24.2,
    budgetedQuantity: 25.5,
    unit: 'm²',
  },
  materials: [
    {
      id: 'used1',
      code: 'HOR-H25',
      name: 'Hormigón H25 con aditivo',
      quantityUsed: 6.2,
      unit: 'm³',
      supplier: 'Hormigones SA',
      lotNumber: 'LOT-2024-001',
    },
    {
      id: 'used2',
      code: 'FE-A630-420H',
      name: 'Fierro A630-420H ø12mm',
      quantityUsed: 185,
      unit: 'kg',
      supplier: 'Aceros del Pacífico',
      lotNumber: 'LOT-2024-FE-045',
    },
  ],
  personnel: {
    executor: {
      id: 'worker-001',
      name: 'Miguel Torres',
      role: 'Operario Especializado',
    },
    supervisor: {
      id: 'sup-001',
      name: 'Carlos Mendoza',
    },
  },
  documentation: {
    photos: [
      {
        id: 'photo1',
        file: new File([''], 'before.jpg', { type: 'image/jpeg' }),
        url: 'https://via.placeholder.com/300x200/e0e7ff/6366f1?text=Antes',
        name: 'before.jpg',
        size: 102400,
        category: 'before',
        gpsLocation: { lat: -33.4489, lng: -70.6693 },
        timestamp: new Date(),
      },
      {
        id: 'photo2',
        file: new File([''], 'during.jpg', { type: 'image/jpeg' }),
        url: 'https://via.placeholder.com/300x200/fef3c7/f59e0b?text=Durante',
        name: 'during.jpg',
        size: 156800,
        category: 'during',
        gpsLocation: { lat: -33.4489, lng: -70.6693 },
        timestamp: new Date(),
      },
      {
        id: 'photo3',
        file: new File([''], 'after.jpg', { type: 'image/jpeg' }),
        url: 'https://via.placeholder.com/300x200/dcfce7/10b981?text=Después',
        name: 'after.jpg',
        size: 134400,
        category: 'after',
        gpsLocation: { lat: -33.4489, lng: -70.6693 },
        timestamp: new Date(),
      },
    ],
    requiredPhotos: ['before', 'after'],
    notes: 'Trabajo ejecutado según especificaciones. Se utilizó vibrador para compactar el hormigón. Clima favorable durante toda la jornada.',
  },
  quality: {
    conformsToSpecs: true,
    inspectionRequired: false,
  },
}

const sampleTaskCompleted: Partial<TaskRegistration> = {
  ...sampleTaskInProgress,
  completion: {
    ...sampleTaskInProgress.completion!,
    status: 'APPROVED',
    completionPercentage: 100,
  },
  quality: {
    conformsToSpecs: true,
    inspectionRequired: true,
    inspectionDate: new Date(),
    inspectionResult: 'APPROVED',
  },
  approval: {
    currentStep: 'FINAL_APPROVAL',
    history: [
      {
        step: 'SUPERVISOR_REVIEW',
        user: 'Carlos Mendoza',
        action: 'APPROVED',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        comments: 'Trabajo bien ejecutado, cumple especificaciones.',
      },
      {
        step: 'QUALITY_INSPECTION',
        user: 'Laura Silva',
        action: 'APPROVED',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        comments: 'Inspección conforme. Calidad aprobada.',
      },
    ],
    finalApproval: {
      approved: true,
      approvedBy: 'Ricardo Vargas',
      approvalDate: new Date(),
      comments: 'Aprobado para facturación.',
    },
  },
}

// Empty form for new task
export const NewTask: Story = {
  args: {
    currentUserRole: 'WORKER',
    availableMaterials: sampleMaterials,
    availablePersonnel: samplePersonnel,
    currentLocation: { lat: -33.4489, lng: -70.6693 },
    allowedActions: ['SAVE_DRAFT', 'SUBMIT'],
    autoSave: true,
  },
}

// Draft task
export const DraftTask: Story = {
  args: {
    task: sampleTaskDraft,
    status: 'draft',
    currentUserRole: 'WORKER',
    availableMaterials: sampleMaterials,
    availablePersonnel: samplePersonnel,
    currentLocation: { lat: -33.4489, lng: -70.6693 },
    allowedActions: ['SAVE_DRAFT', 'SUBMIT'],
    autoSave: true,
  },
}

// Task in progress
export const TaskInProgress: Story = {
  args: {
    task: sampleTaskInProgress,
    status: 'in_progress',
    currentUserRole: 'WORKER',
    availableMaterials: sampleMaterials,
    availablePersonnel: samplePersonnel,
    currentLocation: { lat: -33.4489, lng: -70.6693 },
    allowedActions: ['SAVE_DRAFT', 'SUBMIT'],
    autoSave: true,
  },
}

// Supervisor review
export const SupervisorReview: Story = {
  args: {
    task: sampleTaskInProgress,
    status: 'pending_approval',
    currentUserRole: 'SUPERVISOR',
    readOnly: false,
    allowedActions: ['APPROVE', 'REJECT', 'REQUEST_CHANGES'],
  },
}

// Quality inspector review
export const QualityInspection: Story = {
  args: {
    task: {
      ...sampleTaskInProgress,
      completion: {
        ...sampleTaskInProgress.completion!,
        status: 'QUALITY_SUBMITTED',
      },
    },
    status: 'pending_approval',
    currentUserRole: 'QUALITY_INSPECTOR',
    allowedActions: ['APPROVE', 'REJECT'],
  },
}

// Completed task (read-only)
export const CompletedTask: Story = {
  args: {
    task: sampleTaskCompleted,
    status: 'approved',
    currentUserRole: 'WORKER',
    readOnly: true,
    allowedActions: [],
  },
}

// Wizard layout
export const WizardLayout: Story = {
  args: {
    layout: 'wizard',
    currentUserRole: 'WORKER',
    availableMaterials: sampleMaterials,
    availablePersonnel: samplePersonnel,
    currentLocation: { lat: -33.4489, lng: -70.6693 },
    allowedActions: ['SAVE_DRAFT', 'SUBMIT'],
    autoSave: true,
  },
}

// Mobile view
export const MobileView: Story = {
  args: {
    variant: 'mobile',
    layout: 'wizard',
    currentUserRole: 'WORKER',
    availableMaterials: sampleMaterials,
    availablePersonnel: samplePersonnel,
    currentLocation: { lat: -33.4489, lng: -70.6693 },
    allowedActions: ['SAVE_DRAFT', 'SUBMIT'],
    autoSave: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Offline mode
export const OfflineMode: Story = {
  args: {
    task: sampleTaskDraft,
    currentUserRole: 'WORKER',
    offlineMode: true,
    availableMaterials: sampleMaterials,
    availablePersonnel: samplePersonnel,
    currentLocation: { lat: -33.4489, lng: -70.6693 },
    allowedActions: ['SAVE_DRAFT', 'SUBMIT'],
    autoSave: true,
  },
}

// Compact variant
export const CompactView: Story = {
  args: {
    variant: 'compact',
    layout: 'single',
    task: sampleTaskInProgress,
    currentUserRole: 'WORKER',
    availableMaterials: sampleMaterials,
    allowedActions: ['SAVE_DRAFT', 'SUBMIT'],
  },
}

// With validation errors
export const WithValidationErrors: Story = {
  args: {
    currentUserRole: 'WORKER',
    availableMaterials: sampleMaterials,
    errors: {
      'activityCode': 'Código de actividad es obligatorio',
      'completion.executionDate': 'Fecha de ejecución es obligatoria',
      'completion.actualQuantity': 'Cantidad ejecutada es obligatoria',
      'documentation.photos': 'Se requieren al menos 2 fotos',
      'documentation.photoTypes': 'Faltan fotos de: antes, después',
    },
    allowedActions: ['SAVE_DRAFT', 'SUBMIT'],
  },
}

// Loading state
export const LoadingState: Story = {
  args: {
    isLoading: true,
  },
}

// Interactive demo
export const InteractiveDemo: Story = {
  args: {
    currentUserRole: 'WORKER',
    availableMaterials: sampleMaterials,
    availablePersonnel: samplePersonnel,
    currentLocation: { lat: -33.4489, lng: -70.6693 },
    allowedActions: ['SAVE_DRAFT', 'SUBMIT'],
    autoSave: true,
  },
  render: function InteractiveTaskForm(args) {
    const [task, setTask] = React.useState<Partial<TaskRegistration>>(args.task || {})
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const [errors, setErrors] = React.useState<Record<string, string>>({})
    
    const handleTaskChange = (updatedTask: Partial<TaskRegistration>) => {
      setTask(updatedTask)
      // Clear related errors when field is updated
      const clearedErrors = { ...errors }
      Object.keys(clearedErrors).forEach(key => {
        if (updatedTask.hasOwnProperty(key.split('.')[0])) {
          delete clearedErrors[key]
        }
      })
      setErrors(clearedErrors)
    }
    
    const handleAction = async (action: string, data: Partial<TaskRegistration>) => {
      console.log(`Action: ${action}`, data)
      
      if (action === 'SAVE_DRAFT') {
        setIsSaving(true)
        setTimeout(() => {
          setIsSaving(false)
          alert('Borrador guardado correctamente')
        }, 1000)
      } else if (action === 'SUBMIT') {
        setIsSubmitting(true)
        setTimeout(() => {
          setIsSubmitting(false)
          alert('Tarea enviada para aprobación')
        }, 2000)
      } else if (action === 'APPROVE') {
        setIsSubmitting(true)
        setTimeout(() => {
          setIsSubmitting(false)
          alert('Tarea aprobada exitosamente')
        }, 1500)
      } else if (action === 'REJECT') {
        setIsSubmitting(true)
        setTimeout(() => {
          setIsSubmitting(false)
          alert('Tarea rechazada')
        }, 1500)
      }
    }
    
    const handleValidationError = (validationErrors: Record<string, string>) => {
      setErrors(validationErrors)
    }
    
    const handlePhotoCapture = (photo: any) => {
      console.log('Photo captured:', photo.name)
    }
    
    const handleMaterialAdd = (material: any) => {
      console.log('Material added:', material.name)
    }

    return (
      <TaskRegistrationForm
        {...args}
        task={task}
        onTaskChange={handleTaskChange}
        onAction={handleAction}
        isSubmitting={isSubmitting}
        isSaving={isSaving}
        errors={errors}
        onValidationError={handleValidationError}
        onPhotoCapture={handlePhotoCapture}
        onMaterialAdd={handleMaterialAdd}
        onSubmitSuccess={(completedTask) => {
          console.log('Task submitted successfully:', completedTask)
          alert('¡Tarea registrada exitosamente!')
        }}
        onSaveSuccess={(savedTask) => {
          console.log('Task saved successfully:', savedTask)
        }}
      />
    )
  },
}