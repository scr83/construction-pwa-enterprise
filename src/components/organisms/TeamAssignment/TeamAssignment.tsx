'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { FormField } from '@/components/molecules/FormField'
import { StatusCard } from '@/components/molecules/StatusCard'
import { UserMenu } from '@/components/molecules/UserMenu'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Badge } from '@/components/atoms/Badge'
import { Avatar } from '@/components/atoms/Avatar'
import { Loading } from '@/components/atoms/Loading'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { Checkbox } from '@/components/atoms/Checkbox'

const teamAssignmentVariants = cva(
  'bg-white rounded-lg border border-secondary-200 shadow-sm',
  {
    variants: {
      variant: {
        default: 'p-6',
        compact: 'p-4',
        full: 'p-8',
        mobile: 'p-3',
      },
      layout: {
        dashboard: 'grid gap-6',
        list: 'flex flex-col space-y-4',
        cards: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        timeline: 'flex flex-col space-y-6',
      },
      mode: {
        view: '',
        edit: 'border-primary-200',
        assign: 'border-success-200',
        review: 'border-warning-200',
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'dashboard',
      mode: 'view',
    },
  }
)

// Team member interfaces
export interface TeamMember {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  
  // Role and specialization
  role: 'JEFE_TERRENO' | 'CAPATAZ' | 'MAESTRO' | 'OFICIAL' | 'AYUDANTE' | 'ESPECIALISTA'
  specialization?: string[]
  certifications?: Array<{
    id: string
    name: string
    issuedBy: string
    issuedDate: Date
    expiryDate?: Date
    status: 'valid' | 'expired' | 'pending'
    documentUrl?: string
  }>
  
  // Performance metrics
  performance: {
    productivity: number // 0-100%
    quality: number // 0-100%
    safety: number // 0-100%
    reliability: number // 0-100%
    overall: number // calculated average
  }
  
  // Work status
  status: 'available' | 'assigned' | 'busy' | 'on_leave' | 'inactive'
  availability: {
    startDate?: Date
    endDate?: Date
    hoursPerDay: number
    daysPerWeek: number[]
    shift?: 'morning' | 'afternoon' | 'night' | 'full'
  }
  
  // Current assignments
  currentAssignments: Array<{
    id: string
    projectId: string
    projectName: string
    workOrderId?: string
    workOrderTitle?: string
    startDate: Date
    endDate?: Date
    workload: number // percentage of capacity
    priority: 'low' | 'medium' | 'high' | 'critical'
  }>
  
  // Historical data
  history: {
    projectsCompleted: number
    totalWorkHours: number
    averageRating: number
    lastAssignmentDate?: Date
    joinDate: Date
  }
  
  // Skills and equipment
  skills: Array<{
    name: string
    level: 'basic' | 'intermediate' | 'advanced' | 'expert'
    yearsExperience: number
    lastUsed?: Date
  }>
  equipment?: Array<{
    id: string
    name: string
    type: string
    certified: boolean
    certificationExpiry?: Date
  }>
  
  // Emergency contact
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  
  // Location and logistics
  location?: {
    zone?: string
    baseLocation?: string
    transportMethod?: 'own' | 'company' | 'public'
    travelTime?: number // minutes to project site
  }
}

// Subcontractor interfaces
export interface Subcontractor {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  rut: string // Chilean tax ID
  
  // Company details
  specialties: string[]
  serviceTypes: Array<{
    id: string
    name: string
    category: string
    unitOfMeasure: string
    baseRate: number
    currency: string
  }>
  
  // Performance and ratings
  rating: {
    overall: number // 0-5 stars
    quality: number
    timeliness: number
    communication: number
    safety: number
    cost: number
    reviewCount: number
  }
  
  // Work capacity
  capacity: {
    maxSimultaneousProjects: number
    teamSize: {
      min: number
      max: number
      current: number
    }
    availability: {
      startDate?: Date
      endDate?: Date
      blackoutDates?: Date[]
    }
    workingHours: {
      startTime: string
      endTime: string
      daysPerWeek: number[]
    }
  }
  
  // Current assignments
  currentProjects: Array<{
    id: string
    name: string
    role: string
    startDate: Date
    endDate: Date
    workload: number
    status: 'active' | 'paused' | 'completed'
  }>
  
  // Compliance and certifications
  compliance: {
    insurance: {
      hasInsurance: boolean
      insuranceExpiry?: Date
      coverageAmount?: number
    }
    licenses: Array<{
      type: string
      number: string
      expiryDate: Date
      status: 'valid' | 'expired' | 'pending'
    }>
    safetyRecord: {
      incidentCount: number
      lastIncidentDate?: Date
      safetyScore: number
    }
  }
  
  // Financial information
  financial: {
    paymentTerms: string
    preferredPaymentMethod: string
    averageInvoiceAmount: number
    paymentHistory: {
      onTimePayments: number
      latePayments: number
      averagePaymentDelay: number
    }
  }
  
  // Historical performance
  history: {
    projectsCompleted: number
    totalRevenue: number
    averageProjectDuration: number
    clientSince: Date
    lastProjectDate?: Date
  }
}

// Assignment interfaces
export interface WorkAssignment {
  id: string
  title: string
  description?: string
  
  // Assignment details
  projectId: string
  projectName: string
  workOrderId?: string
  activityId?: string
  activityName?: string
  partida?: string
  
  // Timing
  plannedStartDate: Date
  plannedEndDate: Date
  actualStartDate?: Date
  actualEndDate?: Date
  duration: number // planned hours
  
  // Assignment requirements
  requirements: {
    skills: Array<{
      name: string
      level: 'basic' | 'intermediate' | 'advanced' | 'expert'
      required: boolean
    }>
    equipment?: string[]
    certifications?: string[]
    experience?: {
      minYears: number
      preferredYears?: number
    }
    teamSize: {
      min: number
      max: number
      preferred: number
    }
  }
  
  // Assigned resources
  assignedMembers: Array<{
    memberId: string
    member: TeamMember
    assignedDate: Date
    assignedBy: string
    role: string
    workload: number // percentage
    status: 'assigned' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  }>
  
  assignedSubcontractors: Array<{
    subcontractorId: string
    subcontractor: Subcontractor
    assignedDate: Date
    assignedBy: string
    serviceType: string
    scope: string
    estimatedCost: number
    status: 'assigned' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  }>
  
  // Status and progress
  status: 'planning' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progress: number // 0-100%
  
  // Location and conditions
  location: {
    zone: string
    level?: string
    area?: string
    coordinates?: { lat: number; lng: number }
    accessInstructions?: string
  }
  
  workConditions: {
    safety: string[]
    weather: 'indoor' | 'outdoor' | 'covered'
    specialRequirements?: string[]
    hazards?: string[]
  }
  
  // Communication and notifications
  notifications: Array<{
    id: string
    type: 'assignment' | 'change' | 'reminder' | 'completion'
    recipient: string
    message: string
    sentDate: Date
    read: boolean
  }>
  
  // Workflow tracking
  workflow: {
    createdBy: string
    createdDate: Date
    approvedBy?: string
    approvedDate?: Date
    modifiedBy?: string
    modifiedDate?: Date
    comments?: Array<{
      id: string
      author: string
      message: string
      timestamp: Date
      type: 'note' | 'change' | 'issue' | 'resolution'
    }>
  }
}

// Performance tracking
export interface TeamPerformance {
  teamId: string
  period: {
    startDate: Date
    endDate: Date
  }
  
  // Productivity metrics
  productivity: {
    plannedHours: number
    actualHours: number
    efficiency: number
    completedTasks: number
    delayedTasks: number
    averageTaskDuration: number
  }
  
  // Quality metrics
  quality: {
    inspectionsPassed: number
    inspectionsFailed: number
    reworkRequired: number
    qualityScore: number
    clientSatisfaction?: number
  }
  
  // Safety metrics
  safety: {
    incidentCount: number
    nearMissCount: number
    safetyTrainingHours: number
    safetyScore: number
    daysWithoutIncident: number
  }
  
  // Cost metrics
  cost: {
    budgetedAmount: number
    actualAmount: number
    variance: number
    costPerHour: number
    overtime: {
      hours: number
      cost: number
    }
  }
  
  // Team dynamics
  teamwork: {
    communicationScore: number
    collaborationScore: number
    conflictCount: number
    teamSatisfaction?: number
  }
}

export interface TeamAssignmentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof teamAssignmentVariants> {
  // Data
  teamMembers?: TeamMember[]
  subcontractors?: Subcontractor[]
  assignments?: WorkAssignment[]
  performance?: TeamPerformance[]
  
  // Display configuration
  showTeamMembers?: boolean
  showSubcontractors?: boolean
  showAssignments?: boolean
  showPerformance?: boolean
  showWorkload?: boolean
  showAvailability?: boolean
  
  // Assignment workflow
  enableAssignment?: boolean
  enableReassignment?: boolean
  enableBulkOperations?: boolean
  enableAutoAssignment?: boolean
  
  // Filtering and searching
  memberFilters?: {
    roles?: string[]
    skills?: string[]
    availability?: 'available' | 'assigned' | 'busy'
    performance?: { min: number; max: number }
    location?: string[]
  }
  
  subcontractorFilters?: {
    specialties?: string[]
    rating?: { min: number; max: number }
    availability?: boolean
    compliance?: boolean
  }
  
  assignmentFilters?: {
    status?: string[]
    priority?: string[]
    projects?: string[]
    dateRange?: { start: Date; end: Date }
  }
  
  // Actions and callbacks
  onMemberAssign?: (memberId: string, assignmentId: string) => void
  onMemberUnassign?: (memberId: string, assignmentId: string) => void
  onSubcontractorAssign?: (subcontractorId: string, assignmentId: string) => void
  onSubcontractorUnassign?: (subcontractorId: string, assignmentId: string) => void
  
  onAssignmentCreate?: (assignment: Partial<WorkAssignment>) => void
  onAssignmentUpdate?: (assignmentId: string, updates: Partial<WorkAssignment>) => void
  onAssignmentDelete?: (assignmentId: string) => void
  
  onMemberPerformanceView?: (memberId: string) => void
  onSubcontractorPerformanceView?: (subcontractorId: string) => void
  onTeamPerformanceView?: (teamId: string) => void
  
  onNotificationSend?: (recipients: string[], message: string, type: string) => void
  onWorkloadOptimize?: (parameters: any) => void
  onScheduleConflictResolve?: (conflicts: any[]) => void
  
  // Bulk operations
  onBulkAssign?: (memberIds: string[], assignmentIds: string[]) => void
  onBulkUnassign?: (memberIds: string[], assignmentIds: string[]) => void
  onBulkStatusUpdate?: (assignmentIds: string[], status: string) => void
  
  // Auto-assignment
  autoAssignmentRules?: Array<{
    id: string
    name: string
    conditions: any
    actions: any
    enabled: boolean
  }>
  onAutoAssignmentRuleUpdate?: (ruleId: string, updates: any) => void
  
  // UI state
  selectedMembers?: string[]
  selectedSubcontractors?: string[]
  selectedAssignments?: string[]
  
  onSelectionChange?: (type: 'members' | 'subcontractors' | 'assignments', selection: string[]) => void
  
  // Loading states
  isLoading?: boolean
  isAssigning?: boolean
  isSyncing?: boolean
  
  // User context
  currentUser?: {
    id: string
    name: string
    role: string
    permissions: string[]
  }
  
  // Project context
  currentProject?: {
    id: string
    name: string
    code: string
  }
  
  // Mobile optimizations
  enableSwipeActions?: boolean
  compactView?: boolean
  
  // Real-time features
  enableRealTimeUpdates?: boolean
  onlineUsers?: string[]
  
  // Notifications
  pendingNotifications?: Array<{
    id: string
    type: string
    message: string
    timestamp: Date
    priority: 'low' | 'medium' | 'high'
  }>
}

const TeamAssignment = React.forwardRef<HTMLDivElement, TeamAssignmentProps>(
  (
    {
      className,
      variant,
      layout,
      mode,
      teamMembers = [],
      subcontractors = [],
      assignments = [],
      performance = [],
      showTeamMembers = true,
      showSubcontractors = true,
      showAssignments = true,
      showPerformance = true,
      showWorkload = true,
      showAvailability = true,
      enableAssignment = true,
      enableReassignment = true,
      enableBulkOperations = false,
      enableAutoAssignment = false,
      memberFilters = {},
      subcontractorFilters = {},
      assignmentFilters = {},
      onMemberAssign,
      onMemberUnassign,
      onSubcontractorAssign,
      onSubcontractorUnassign,
      onAssignmentCreate,
      onAssignmentUpdate,
      onAssignmentDelete,
      onMemberPerformanceView,
      onSubcontractorPerformanceView,
      onTeamPerformanceView,
      onNotificationSend,
      onWorkloadOptimize,
      onScheduleConflictResolve,
      onBulkAssign,
      onBulkUnassign,
      onBulkStatusUpdate,
      autoAssignmentRules = [],
      onAutoAssignmentRuleUpdate,
      selectedMembers = [],
      selectedSubcontractors = [],
      selectedAssignments = [],
      onSelectionChange,
      isLoading = false,
      isAssigning = false,
      isSyncing = false,
      currentUser,
      currentProject,
      enableSwipeActions = false,
      compactView = false,
      enableRealTimeUpdates = false,
      onlineUsers = [],
      pendingNotifications = [],
      ...props
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = React.useState<'members' | 'subcontractors' | 'assignments' | 'performance'>('members')
    const [selectedMemberIds, setSelectedMemberIds] = React.useState<Set<string>>(new Set(selectedMembers))
    const [selectedSubcontractorIds, setSelectedSubcontractorIds] = React.useState<Set<string>>(new Set(selectedSubcontractors))
    const [selectedAssignmentIds, setSelectedAssignmentIds] = React.useState<Set<string>>(new Set(selectedAssignments))
    const [assignmentDialogOpen, setAssignmentDialogOpen] = React.useState(false)
    const [performanceDialogOpen, setPerformanceDialogOpen] = React.useState(false)
    const [bulkOperationsMode, setBulkOperationsMode] = React.useState(false)
    const [draggedItem, setDraggedItem] = React.useState<{ type: string; id: string } | null>(null)

    // Filter available members based on current filters
    const filteredMembers = React.useMemo(() => {
      return teamMembers.filter(member => {
        if (memberFilters.roles?.length && !memberFilters.roles.includes(member.role)) return false
        if (memberFilters.availability && member.status !== memberFilters.availability) return false
        if (memberFilters.performance) {
          if (member.performance.overall < memberFilters.performance.min ||
              member.performance.overall > memberFilters.performance.max) return false
        }
        if (memberFilters.skills?.length) {
          const memberSkills = member.skills.map(s => s.name)
          if (!memberFilters.skills.some(skill => memberSkills.includes(skill))) return false
        }
        if (memberFilters.location?.length) {
          if (!member.location?.zone || !memberFilters.location.includes(member.location.zone)) return false
        }
        return true
      })
    }, [teamMembers, memberFilters])

    // Filter available subcontractors
    const filteredSubcontractors = React.useMemo(() => {
      return subcontractors.filter(subcontractor => {
        if (subcontractorFilters.specialties?.length) {
          if (!subcontractorFilters.specialties.some(spec => subcontractor.specialties.includes(spec))) return false
        }
        if (subcontractorFilters.rating) {
          if (subcontractor.rating.overall < subcontractorFilters.rating.min ||
              subcontractor.rating.overall > subcontractorFilters.rating.max) return false
        }
        if (subcontractorFilters.availability && !subcontractor.capacity.availability.startDate) return false
        if (subcontractorFilters.compliance && !subcontractor.compliance.insurance.hasInsurance) return false
        return true
      })
    }, [subcontractors, subcontractorFilters])

    // Filter assignments
    const filteredAssignments = React.useMemo(() => {
      return assignments.filter(assignment => {
        if (assignmentFilters.status?.length && !assignmentFilters.status.includes(assignment.status)) return false
        if (assignmentFilters.priority?.length && !assignmentFilters.priority.includes(assignment.priority)) return false
        if (assignmentFilters.projects?.length && !assignmentFilters.projects.includes(assignment.projectId)) return false
        if (assignmentFilters.dateRange) {
          const assignmentStart = assignment.plannedStartDate
          const assignmentEnd = assignment.plannedEndDate
          if (assignmentStart > assignmentFilters.dateRange.end || assignmentEnd < assignmentFilters.dateRange.start) return false
        }
        return true
      })
    }, [assignments, assignmentFilters])

    // Calculate workload distribution
    const workloadDistribution = React.useMemo(() => {
      return filteredMembers.map(member => {
        const totalWorkload = member.currentAssignments.reduce((sum, assignment) => sum + assignment.workload, 0)
        return {
          memberId: member.id,
          memberName: member.name,
          totalWorkload,
          status: totalWorkload > 100 ? 'overloaded' : totalWorkload > 80 ? 'high' : totalWorkload > 50 ? 'medium' : 'low',
          availableCapacity: Math.max(0, 100 - totalWorkload),
        }
      })
    }, [filteredMembers])

    // Handle member selection
    const handleMemberSelection = (memberId: string, selected: boolean) => {
      const newSelection = new Set(selectedMemberIds)
      if (selected) {
        newSelection.add(memberId)
      } else {
        newSelection.delete(memberId)
      }
      setSelectedMemberIds(newSelection)
      onSelectionChange?.('members', Array.from(newSelection))
    }

    // Handle assignment drag and drop
    const handleDragStart = (type: string, id: string) => {
      setDraggedItem({ type, id })
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent, targetType: string, targetId: string) => {
      e.preventDefault()
      if (!draggedItem) return

      if (draggedItem.type === 'member' && targetType === 'assignment') {
        onMemberAssign?.(draggedItem.id, targetId)
      } else if (draggedItem.type === 'subcontractor' && targetType === 'assignment') {
        onSubcontractorAssign?.(draggedItem.id, targetId)
      }

      setDraggedItem(null)
    }

    // Get member status color
    const getMemberStatusColor = (member: TeamMember) => {
      const workload = workloadDistribution.find(w => w.memberId === member.id)
      switch (workload?.status) {
        case 'overloaded': return 'danger'
        case 'high': return 'warning'
        case 'medium': return 'primary'
        default: return 'success'
      }
    }

    // Get performance color
    const getPerformanceColor = (score: number) => {
      if (score >= 90) return 'success'
      if (score >= 75) return 'primary'
      if (score >= 60) return 'warning'
      return 'danger'
    }

    if (isLoading) {
      return (
        <div
          className={cn(
            teamAssignmentVariants({ variant, layout, mode }),
            'animate-pulse',
            className
          )}
        >
          <div className="space-y-6">
            <div className="h-8 bg-secondary-200 rounded w-1/3"></div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-secondary-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(teamAssignmentVariants({ variant, layout, mode }), className)}
        {...props}
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Typography variant="h4" className="font-bold">
                Asignación de Equipos
              </Typography>
              {currentProject && (
                <Badge variant="primary" icon="folder">
                  {currentProject.code}
                </Badge>
              )}
              
              {/* Real-time indicators */}
              {enableRealTimeUpdates && (
                <div className="flex items-center gap-2">
                  {isSyncing && (
                    <Badge variant="primary" size="xs">
                      <Icon name="refresh-cw" size="xs" className="animate-spin mr-1" />
                      Sincronizando
                    </Badge>
                  )}
                  {onlineUsers.length > 0 && (
                    <Badge variant="success" size="xs" count={onlineUsers.length}>
                      En línea
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {/* Summary stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
              <span className="flex items-center gap-1">
                <Icon name="users" size="xs" />
                {filteredMembers.length} miembros
              </span>
              <span className="flex items-center gap-1">
                <Icon name="building" size="xs" />
                {filteredSubcontractors.length} subcontratistas
              </span>
              <span className="flex items-center gap-1">
                <Icon name="clipboard-list" size="xs" />
                {filteredAssignments.filter(a => a.status === 'assigned').length} asignaciones activas
              </span>
              {pendingNotifications.length > 0 && (
                <span className="flex items-center gap-1 text-warning-600">
                  <Icon name="bell" size="xs" />
                  {pendingNotifications.length} notificaciones
                </span>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Workload optimization */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWorkloadOptimize?.({})}
              leftIcon={<Icon name="activity" size="xs" />}
              title="Optimizar carga de trabajo"
            >
              {!compactView && 'Optimizar'}
            </Button>
            
            {/* Bulk operations toggle */}
            {enableBulkOperations && (
              <Button
                variant={bulkOperationsMode ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setBulkOperationsMode(!bulkOperationsMode)}
                leftIcon={<Icon name="layers" size="xs" />}
              >
                {!compactView && 'Bulk'}
              </Button>
            )}
            
            {/* Create assignment */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAssignmentDialogOpen(true)}
              leftIcon={<Icon name="plus" size="xs" />}
              disabled={isAssigning}
            >
              {isAssigning ? <Loading size="xs" /> : (!compactView && 'Nueva Asignación')}
            </Button>
            
            {/* Performance overview */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPerformanceDialogOpen(true)}
              leftIcon={<Icon name="bar-chart-2" size="xs" />}
            >
              {!compactView && 'Rendimiento'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-secondary-200">
          <nav className="flex space-x-8">
            {[
              { id: 'members', label: 'Equipo', icon: 'users', count: filteredMembers.length },
              { id: 'subcontractors', label: 'Subcontratistas', icon: 'building', count: filteredSubcontractors.length },
              { id: 'assignments', label: 'Asignaciones', icon: 'clipboard-list', count: filteredAssignments.length },
              { id: 'performance', label: 'Rendimiento', icon: 'trending-up', count: performance.length }
            ].map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  )}
                >
                  <Icon name={tab.icon as any} size="xs" />
                  {tab.label}
                  <Badge size="xs" variant={isActive ? 'primary' : 'secondary'} count={tab.count} />
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {/* Team Members Tab */}
          {activeTab === 'members' && (
            <div>
              {/* Members grid */}
              {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="users" size="lg" className="text-secondary-400" />
                  </div>
                  <Typography variant="h6" className="font-semibold mb-2">
                    No hay miembros del equipo
                  </Typography>
                  <Typography variant="body-default" color="muted">
                    Agrega miembros al equipo para comenzar las asignaciones
                  </Typography>
                </div>
              ) : (
                <div className={cn(
                  layout === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
                  'grid grid-cols-1 gap-4'
                )}>
                  {filteredMembers.map((member) => {
                    const isSelected = selectedMemberIds.has(member.id)
                    const workload = workloadDistribution.find(w => w.memberId === member.id)
                    const isOnline = onlineUsers.includes(member.id)
                    
                    return (
                      <div
                        key={member.id}
                        draggable={enableAssignment}
                        onDragStart={() => handleDragStart('member', member.id)}
                        className={cn(
                          'p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-all cursor-pointer',
                          isSelected && 'border-primary-500 bg-primary-25',
                          member.status === 'available' && 'hover:border-success-300',
                          member.status === 'busy' && 'hover:border-warning-300',
                        )}
                        onClick={() => handleMemberSelection(member.id, !isSelected)}
                      >
                        {/* Member header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar
                                size="md"
                                name={member.name}
                                src={member.avatar}
                                status={isOnline ? 'online' : member.status === 'available' ? 'available' : 'busy'}
                              />
                              {isOnline && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <Typography variant="body-default" className="font-semibold truncate">
                                {member.name}
                              </Typography>
                              <Typography variant="caption" color="muted" className="truncate">
                                {member.role.replace('_', ' ')}
                                {member.specialization && ` • ${member.specialization[0]}`}
                              </Typography>
                            </div>
                          </div>
                          
                          {/* Selection checkbox */}
                          {bulkOperationsMode && (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleMemberSelection(member.id, checked)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          
                          {/* Status indicator */}
                          <StatusCard
                            status={{
                              value: member.status.replace('_', ' '),
                              variant: member.status === 'available' ? 'success' :
                                      member.status === 'assigned' ? 'primary' :
                                      member.status === 'busy' ? 'warning' : 'secondary'
                            }}
                            size="sm"
                          />
                        </div>
                        
                        {/* Performance metrics */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="text-center">
                            <Typography variant="h6" className={cn(
                              'font-bold',
                              getPerformanceColor(member.performance.overall) === 'success' ? 'text-green-600' :
                              getPerformanceColor(member.performance.overall) === 'primary' ? 'text-blue-600' :
                              getPerformanceColor(member.performance.overall) === 'warning' ? 'text-orange-600' :
                              'text-red-600'
                            )}>
                              {member.performance.overall}%
                            </Typography>
                            <Typography variant="caption" color="muted">
                              Rendimiento
                            </Typography>
                          </div>
                          
                          <div className="text-center">
                            <Typography variant="h6" className={cn(
                              'font-bold',
                              workload?.status === 'low' ? 'text-green-600' :
                              workload?.status === 'medium' ? 'text-blue-600' :
                              workload?.status === 'high' ? 'text-orange-600' :
                              'text-red-600'
                            )}>
                              {workload?.totalWorkload || 0}%
                            </Typography>
                            <Typography variant="caption" color="muted">
                              Carga Trabajo
                            </Typography>
                          </div>
                        </div>
                        
                        {/* Workload bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Capacidad</span>
                            <span>{workload?.availableCapacity}% disponible</span>
                          </div>
                          <ProgressBar
                            progress={workload?.totalWorkload || 0}
                            variant={
                              (workload?.status === 'overloaded') ? 'danger' :
                              (workload?.status === 'high') ? 'warning' :
                              (workload?.status === 'medium') ? 'primary' : 'success'
                            }
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                        
                        {/* Current assignments */}
                        {member.currentAssignments.length > 0 && (
                          <div className="mb-3">
                            <Typography variant="caption" className="font-medium mb-1 block">
                              Asignaciones Actuales
                            </Typography>
                            <div className="space-y-1">
                              {member.currentAssignments.slice(0, 2).map((assignment, index) => (
                                <div key={index} className="flex items-center justify-between text-xs">
                                  <span className="truncate flex-1">{assignment.projectName}</span>
                                  <Badge
                                    size="xs"
                                    variant={assignment.priority === 'critical' ? 'danger' :
                                            assignment.priority === 'high' ? 'warning' : 'secondary'}
                                  >
                                    {assignment.workload}%
                                  </Badge>
                                </div>
                              ))}
                              {member.currentAssignments.length > 2 && (
                                <Typography variant="caption" color="muted">
                                  +{member.currentAssignments.length - 2} más
                                </Typography>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Skills */}
                        {member.skills.length > 0 && (
                          <div className="mb-3">
                            <Typography variant="caption" className="font-medium mb-1 block">
                              Habilidades
                            </Typography>
                            <div className="flex flex-wrap gap-1">
                              {member.skills.slice(0, 3).map((skill) => (
                                <Badge
                                  key={skill.name}
                                  size="xs"
                                  variant={skill.level === 'expert' ? 'primary' :
                                          skill.level === 'advanced' ? 'success' : 'secondary'}
                                >
                                  {skill.name}
                                </Badge>
                              ))}
                              {member.skills.length > 3 && (
                                <Badge size="xs" variant="secondary">
                                  +{member.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              onMemberPerformanceView?.(member.id)
                            }}
                            leftIcon={<Icon name="bar-chart" size="xs" />}
                          >
                            Detalle
                          </Button>
                          
                          {member.status === 'available' && enableAssignment && (
                            <Button
                              variant="primary"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                setAssignmentDialogOpen(true)
                              }}
                              leftIcon={<Icon name="plus" size="xs" />}
                            >
                              Asignar
                            </Button>
                          )}
                          
                          <UserMenu
                            user={{
                              id: member.id,
                              name: member.name,
                              email: member.email,
                              role: member.role as any,
                              avatar: member.avatar,
                              status: isOnline ? 'online' : 'offline'
                            }}
                            showStatus
                            showActions
                            actions={[
                              { id: 'assign', label: 'Asignar Trabajo', icon: 'plus', action: () => {} },
                              { id: 'performance', label: 'Ver Rendimiento', icon: 'bar-chart', action: () => {} },
                              { id: 'contact', label: 'Contactar', icon: 'phone', action: () => {} },
                            ]}
                            variant="compact"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Subcontractors Tab */}
          {activeTab === 'subcontractors' && (
            <div>
              {filteredSubcontractors.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="building" size="lg" className="text-secondary-400" />
                  </div>
                  <Typography variant="h6" className="font-semibold mb-2">
                    No hay subcontratistas disponibles
                  </Typography>
                  <Typography variant="body-default" color="muted">
                    Agrega subcontratistas para ampliar la capacidad del equipo
                  </Typography>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSubcontractors.map((subcontractor) => {
                    const isSelected = selectedSubcontractorIds.has(subcontractor.id)
                    
                    return (
                      <div
                        key={subcontractor.id}
                        draggable={enableAssignment}
                        onDragStart={() => handleDragStart('subcontractor', subcontractor.id)}
                        className={cn(
                          'p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-all cursor-pointer',
                          isSelected && 'border-primary-500 bg-primary-25'
                        )}
                        onClick={() => {
                          const newSelection = new Set(selectedSubcontractorIds)
                          if (isSelected) {
                            newSelection.delete(subcontractor.id)
                          } else {
                            newSelection.add(subcontractor.id)
                          }
                          setSelectedSubcontractorIds(newSelection)
                          onSelectionChange?.('subcontractors', Array.from(newSelection))
                        }}
                      >
                        {/* Company header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <Typography variant="body-default" className="font-semibold truncate">
                              {subcontractor.companyName}
                            </Typography>
                            <Typography variant="caption" color="muted" className="truncate">
                              {subcontractor.contactPerson} • {subcontractor.specialties.join(', ')}
                            </Typography>
                          </div>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            <Icon name="star" size="xs" className="text-yellow-500" />
                            <Typography variant="caption" className="font-medium">
                              {subcontractor.rating.overall.toFixed(1)}
                            </Typography>
                          </div>
                        </div>
                        
                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="text-center">
                            <Typography variant="h6" className="font-bold text-blue-600">
                              {subcontractor.currentProjects.length}
                            </Typography>
                            <Typography variant="caption" color="muted">
                              Proyectos
                            </Typography>
                          </div>
                          
                          <div className="text-center">
                            <Typography variant="h6" className="font-bold text-green-600">
                              {subcontractor.capacity.teamSize.current}
                            </Typography>
                            <Typography variant="caption" color="muted">
                              Equipo
                            </Typography>
                          </div>
                          
                          <div className="text-center">
                            <Typography variant="h6" className="font-bold text-purple-600">
                              {subcontractor.history.projectsCompleted}
                            </Typography>
                            <Typography variant="caption" color="muted">
                              Completados
                            </Typography>
                          </div>
                        </div>
                        
                        {/* Specialties */}
                        <div className="mb-3">
                          <Typography variant="caption" className="font-medium mb-1 block">
                            Especialidades
                          </Typography>
                          <div className="flex flex-wrap gap-1">
                            {subcontractor.specialties.slice(0, 3).map((specialty) => (
                              <Badge key={specialty} size="xs" variant="primary">
                                {specialty}
                              </Badge>
                            ))}
                            {subcontractor.specialties.length > 3 && (
                              <Badge size="xs" variant="secondary">
                                +{subcontractor.specialties.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Compliance indicators */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {subcontractor.compliance.insurance.hasInsurance && (
                              <Badge size="xs" variant="success" icon="shield">
                                Seguro
                              </Badge>
                            )}
                            {subcontractor.compliance.licenses.length > 0 && (
                              <Badge size="xs" variant="success" icon="award">
                                {subcontractor.compliance.licenses.length} Licencias
                              </Badge>
                            )}
                          </div>
                          
                          <Typography variant="caption" color="muted">
                            Score: {subcontractor.compliance.safetyRecord.safetyScore}%
                          </Typography>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSubcontractorPerformanceView?.(subcontractor.id)
                            }}
                            leftIcon={<Icon name="bar-chart" size="xs" />}
                          >
                            Detalle
                          </Button>
                          
                          {enableAssignment && (
                            <Button
                              variant="primary"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                setAssignmentDialogOpen(true)
                              }}
                              leftIcon={<Icon name="plus" size="xs" />}
                            >
                              Asignar
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Open contact menu
                            }}
                            leftIcon={<Icon name="phone" size="xs" />}
                          >
                            Contacto
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div>
              {filteredAssignments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="clipboard-list" size="lg" className="text-secondary-400" />
                  </div>
                  <Typography variant="h6" className="font-semibold mb-2">
                    No hay asignaciones
                  </Typography>
                  <Typography variant="body-default" color="muted" className="mb-4">
                    Crea la primera asignación de trabajo para el equipo
                  </Typography>
                  <Button
                    variant="primary"
                    onClick={() => setAssignmentDialogOpen(true)}
                    leftIcon={<Icon name="plus" size="xs" />}
                  >
                    Nueva Asignación
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'assignment', assignment.id)}
                      className="p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-all"
                    >
                      {/* Assignment header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <Typography variant="body-default" className="font-semibold truncate">
                            {assignment.title}
                          </Typography>
                          <Typography variant="caption" color="muted" className="truncate">
                            {assignment.projectName} • {assignment.activityName}
                            {assignment.partida && ` • ${assignment.partida}`}
                          </Typography>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              assignment.priority === 'critical' ? 'danger' :
                              assignment.priority === 'high' ? 'warning' :
                              assignment.priority === 'medium' ? 'primary' : 'secondary'
                            }
                            size="xs"
                          >
                            {assignment.priority}
                          </Badge>
                          
                          <StatusCard
                            status={{
                              value: assignment.status.replace('_', ' '),
                              variant: assignment.status === 'completed' ? 'success' :
                                      assignment.status === 'in_progress' ? 'primary' :
                                      assignment.status === 'assigned' ? 'warning' :
                                      'secondary'
                            }}
                            size="sm"
                          />
                        </div>
                      </div>
                      
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span>{assignment.progress}%</span>
                        </div>
                        <ProgressBar
                          progress={assignment.progress}
                          variant={
                            assignment.progress >= 90 ? 'success' :
                            assignment.progress >= 60 ? 'primary' :
                            assignment.progress >= 30 ? 'warning' : 'danger'
                          }
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                      
                      {/* Assigned resources */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Team members */}
                        <div>
                          <Typography variant="caption" className="font-medium mb-2 block">
                            Miembros Asignados ({assignment.assignedMembers.length})
                          </Typography>
                          <div className="space-y-2">
                            {assignment.assignedMembers.slice(0, 3).map((assigned) => (
                              <div key={assigned.memberId} className="flex items-center gap-2">
                                <Avatar
                                  size="xs"
                                  name={assigned.member.name}
                                  src={assigned.member.avatar}
                                />
                                <div className="flex-1 min-w-0">
                                  <Typography variant="caption" className="font-medium truncate">
                                    {assigned.member.name}
                                  </Typography>
                                </div>
                                <Badge size="xs" variant="secondary">
                                  {assigned.workload}%
                                </Badge>
                                <StatusCard
                                  status={{
                                    value: assigned.status.replace('_', ' '),
                                    variant: assigned.status === 'completed' ? 'success' :
                                            assigned.status === 'in_progress' ? 'primary' :
                                            'secondary'
                                  }}
                                  size="sm"
                                />
                              </div>
                            ))}
                            {assignment.assignedMembers.length > 3 && (
                              <Typography variant="caption" color="muted">
                                +{assignment.assignedMembers.length - 3} más
                              </Typography>
                            )}
                          </div>
                        </div>
                        
                        {/* Subcontractors */}
                        <div>
                          <Typography variant="caption" className="font-medium mb-2 block">
                            Subcontratistas ({assignment.assignedSubcontractors.length})
                          </Typography>
                          <div className="space-y-2">
                            {assignment.assignedSubcontractors.slice(0, 3).map((assigned) => (
                              <div key={assigned.subcontractorId} className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-secondary-100 rounded flex items-center justify-center">
                                  <Icon name="building" size="xs" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Typography variant="caption" className="font-medium truncate">
                                    {assigned.subcontractor.companyName}
                                  </Typography>
                                </div>
                                <Badge size="xs" variant="primary">
                                  ${(assigned.estimatedCost / 1000000).toFixed(1)}M
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Timeline */}
                      <div className="mb-4 p-3 bg-secondary-25 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <Typography variant="caption" color="muted">Inicio Planificado</Typography>
                            <Typography variant="caption" className="font-medium block">
                              {assignment.plannedStartDate.toLocaleDateString()}
                            </Typography>
                          </div>
                          <div className="text-center">
                            <Typography variant="caption" color="muted">Duración</Typography>
                            <Typography variant="caption" className="font-medium block">
                              {assignment.duration}h
                            </Typography>
                          </div>
                          <div className="text-right">
                            <Typography variant="caption" color="muted">Fin Planificado</Typography>
                            <Typography variant="caption" className="font-medium block">
                              {assignment.plannedEndDate.toLocaleDateString()}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                              // Open assignment details
                            }}
                            leftIcon={<Icon name="eye" size="xs" />}
                          >
                            Detalle
                          </Button>
                          
                          {enableReassignment && (
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => {
                                // Open reassignment dialog
                              }}
                              leftIcon={<Icon name="users" size="xs" />}
                            >
                              Reasignar
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {assignment.status === 'assigned' && (
                            <Button
                              variant="primary"
                              size="xs"
                              onClick={() => {
                                onAssignmentUpdate?.(assignment.id, { status: 'in_progress' })
                              }}
                              leftIcon={<Icon name="play" size="xs" />}
                            >
                              Iniciar
                            </Button>
                          )}
                          
                          {assignment.status === 'in_progress' && (
                            <Button
                              variant="success"
                              size="xs"
                              onClick={() => {
                                onAssignmentUpdate?.(assignment.id, { status: 'completed' })
                              }}
                              leftIcon={<Icon name="check" size="xs" />}
                            >
                              Completar
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                              if (confirm('¿Eliminar esta asignación?')) {
                                onAssignmentDelete?.(assignment.id)
                              }
                            }}
                            leftIcon={<Icon name="trash-2" size="xs" />}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div>
              {performance.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="trending-up" size="lg" className="text-secondary-400" />
                  </div>
                  <Typography variant="h6" className="font-semibold mb-2">
                    No hay datos de rendimiento
                  </Typography>
                  <Typography variant="body-default" color="muted">
                    Los datos de rendimiento aparecerán cuando haya asignaciones completadas
                  </Typography>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {performance.map((perf) => (
                    <div
                      key={perf.teamId}
                      className="p-4 border border-secondary-200 rounded-lg"
                    >
                      <Typography variant="body-default" className="font-semibold mb-3">
                        Período: {perf.period.startDate.toLocaleDateString()} - {perf.period.endDate.toLocaleDateString()}
                      </Typography>
                      
                      {/* Productivity metrics */}
                      <div className="space-y-3">
                        <div>
                          <Typography variant="caption" className="font-medium">Productividad</Typography>
                          <div className="flex justify-between text-sm">
                            <span>Eficiencia:</span>
                            <span className="font-medium">{perf.productivity.efficiency}%</span>
                          </div>
                          <ProgressBar
                            progress={perf.productivity.efficiency}
                            variant={perf.productivity.efficiency >= 90 ? 'success' : perf.productivity.efficiency >= 75 ? 'primary' : 'warning'}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                        
                        <div>
                          <Typography variant="caption" className="font-medium">Calidad</Typography>
                          <div className="flex justify-between text-sm">
                            <span>Score:</span>
                            <span className="font-medium">{perf.quality.qualityScore}%</span>
                          </div>
                          <ProgressBar
                            progress={perf.quality.qualityScore}
                            variant={perf.quality.qualityScore >= 95 ? 'success' : perf.quality.qualityScore >= 85 ? 'primary' : 'warning'}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                        
                        <div>
                          <Typography variant="caption" className="font-medium">Seguridad</Typography>
                          <div className="flex justify-between text-sm">
                            <span>Score:</span>
                            <span className="font-medium">{perf.safety.safetyScore}%</span>
                          </div>
                          <ProgressBar
                            progress={perf.safety.safetyScore}
                            variant={perf.safety.safetyScore >= 95 ? 'success' : perf.safety.safetyScore >= 85 ? 'primary' : 'danger'}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assignment Dialog */}
        {assignmentDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h5" className="font-semibold">
                  Nueva Asignación
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAssignmentDialogOpen(false)}
                >
                  <Icon name="x" size="sm" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    name="title"
                    label="Título de la Asignación"
                    placeholder="Ej: Vaciado losa piso 5"
                    required
                  />
                  
                  <FormField
                    name="description"
                    label="Descripción"
                    placeholder="Descripción detallada del trabajo..."
                    variant="compact"
                  />
                  
                  <FormField
                    name="plannedStartDate"
                    label="Fecha de Inicio"
                    type="date"
                    required
                  />
                  
                  <FormField
                    name="plannedEndDate"
                    label="Fecha de Fin"
                    type="date"
                    required
                  />
                </div>
                
                <div>
                  <FormField
                    name="priority"
                    label="Prioridad"
                    placeholder="Seleccionar prioridad"
                    required
                  />
                  
                  <FormField
                    name="location"
                    label="Ubicación"
                    placeholder="Zona, nivel, área"
                    required
                  />
                  
                  <FormField
                    name="duration"
                    label="Duración Estimada (horas)"
                    type="number"
                    placeholder="40"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setAssignmentDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    // Handle create assignment
                    setAssignmentDialogOpen(false)
                  }}
                >
                  Crear Asignación
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

TeamAssignment.displayName = 'TeamAssignment'

export { TeamAssignment, teamAssignmentVariants }
export type { 
  TeamAssignmentProps,
  TeamMember,
  Subcontractor,
  WorkAssignment,
  TeamPerformance
}