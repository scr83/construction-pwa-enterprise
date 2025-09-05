import type { Meta, StoryObj } from '@storybook/react'
import { TeamAssignment } from './TeamAssignment'
import type { TeamMember, Subcontractor, WorkAssignment, TeamPerformance } from './TeamAssignment'

const meta = {
  title: 'Components/Organisms/TeamAssignment',
  component: TeamAssignment,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive team assignment and workforce coordination system with performance tracking, workload optimization, subcontractor management, and real-time collaboration features for construction project management.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'full', 'mobile'],
      description: 'Visual variant of the team assignment interface',
    },
    layout: {
      control: { type: 'select' },
      options: ['dashboard', 'list', 'cards', 'timeline'],
      description: 'Layout configuration for different views',
    },
    mode: {
      control: { type: 'select' },
      options: ['view', 'edit', 'assign', 'review'],
      description: 'Current operation mode',
    },
    showTeamMembers: {
      control: { type: 'boolean' },
      description: 'Show team members section',
    },
    showSubcontractors: {
      control: { type: 'boolean' },
      description: 'Show subcontractors section',
    },
    showAssignments: {
      control: { type: 'boolean' },
      description: 'Show assignments section',
    },
    enableAssignment: {
      control: { type: 'boolean' },
      description: 'Enable assignment functionality',
    },
    enableBulkOperations: {
      control: { type: 'boolean' },
      description: 'Enable bulk operations',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TeamAssignment>

export default meta
type Story = StoryObj<typeof meta>

// Sample team members data
const sampleTeamMembers: TeamMember[] = [
  {
    id: 'member-001',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@constructora.cl',
    phone: '+56 9 8765 4321',
    avatar: '/avatars/carlos-rodriguez.jpg',
    role: 'JEFE_TERRENO',
    specialization: ['Hormigón Armado', 'Coordinación General'],
    certifications: [
      {
        id: 'cert-001',
        name: 'Jefe de Terreno Clase A',
        issuedBy: 'CChC',
        issuedDate: new Date('2020-03-15'),
        expiryDate: new Date('2025-03-15'),
        status: 'valid'
      }
    ],
    performance: {
      productivity: 92,
      quality: 88,
      safety: 95,
      reliability: 90,
      overall: 91
    },
    status: 'assigned',
    availability: {
      hoursPerDay: 8,
      daysPerWeek: [1, 2, 3, 4, 5],
      shift: 'full'
    },
    currentAssignments: [
      {
        id: 'assign-001',
        projectId: 'proj-001',
        projectName: 'Torre Las Condes',
        workOrderId: 'wo-001',
        workOrderTitle: 'Estructura Piso 5',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-30'),
        workload: 75,
        priority: 'high'
      }
    ],
    history: {
      projectsCompleted: 12,
      totalWorkHours: 2400,
      averageRating: 4.2,
      lastAssignmentDate: new Date('2024-03-10'),
      joinDate: new Date('2019-08-15')
    },
    skills: [
      { name: 'Hormigón Armado', level: 'expert', yearsExperience: 8 },
      { name: 'Coordinación', level: 'advanced', yearsExperience: 5 },
      { name: 'Lectura de Planos', level: 'expert', yearsExperience: 10 },
      { name: 'Control de Calidad', level: 'advanced', yearsExperience: 6 }
    ],
    equipment: [
      {
        id: 'eq-001',
        name: 'Grúa Torre',
        type: 'Maquinaria Pesada',
        certified: true,
        certificationExpiry: new Date('2024-12-15')
      }
    ],
    emergencyContact: {
      name: 'María Rodriguez',
      relationship: 'Esposa',
      phone: '+56 9 1234 5678'
    },
    location: {
      zone: 'Torre A',
      baseLocation: 'Las Condes',
      transportMethod: 'own',
      travelTime: 45
    }
  },
  {
    id: 'member-002',
    name: 'Miguel Torres',
    email: 'miguel.torres@constructora.cl',
    phone: '+56 9 8765 4322',
    role: 'CAPATAZ',
    specialization: ['Albañilería', 'Terminaciones'],
    performance: {
      productivity: 85,
      quality: 92,
      safety: 87,
      reliability: 88,
      overall: 88
    },
    status: 'available',
    availability: {
      hoursPerDay: 8,
      daysPerWeek: [1, 2, 3, 4, 5, 6],
      shift: 'full'
    },
    currentAssignments: [
      {
        id: 'assign-002',
        projectId: 'proj-001',
        projectName: 'Torre Las Condes',
        workOrderTitle: 'Tabiquería Piso 3',
        startDate: new Date('2024-03-18'),
        workload: 60,
        priority: 'medium'
      }
    ],
    history: {
      projectsCompleted: 8,
      totalWorkHours: 1600,
      averageRating: 4.0,
      joinDate: new Date('2021-05-20')
    },
    skills: [
      { name: 'Albañilería', level: 'expert', yearsExperience: 12 },
      { name: 'Yeso Cartón', level: 'advanced', yearsExperience: 8 },
      { name: 'Cerámica', level: 'advanced', yearsExperience: 10 }
    ],
    location: {
      zone: 'Torre A',
      baseLocation: 'Providencia',
      transportMethod: 'public',
      travelTime: 60
    }
  },
  {
    id: 'member-003',
    name: 'Ana Morales',
    email: 'ana.morales@constructora.cl',
    role: 'ESPECIALISTA',
    specialization: ['Control de Calidad', 'Inspecciones'],
    performance: {
      productivity: 90,
      quality: 96,
      safety: 94,
      reliability: 93,
      overall: 93
    },
    status: 'busy',
    availability: {
      hoursPerDay: 8,
      daysPerWeek: [1, 2, 3, 4, 5],
      shift: 'full'
    },
    currentAssignments: [
      {
        id: 'assign-003',
        projectId: 'proj-001',
        projectName: 'Torre Las Condes',
        workOrderTitle: 'Inspección Estructura',
        startDate: new Date('2024-03-16'),
        workload: 85,
        priority: 'critical'
      },
      {
        id: 'assign-004',
        projectId: 'proj-002',
        projectName: 'Centro Comercial',
        workOrderTitle: 'Inspección Final',
        startDate: new Date('2024-03-20'),
        workload: 40,
        priority: 'high'
      }
    ],
    history: {
      projectsCompleted: 15,
      totalWorkHours: 3200,
      averageRating: 4.5,
      joinDate: new Date('2018-03-10')
    },
    skills: [
      { name: 'Control de Calidad', level: 'expert', yearsExperience: 10 },
      { name: 'Normativa SEC', level: 'expert', yearsExperience: 8 },
      { name: 'Instrumentos Medición', level: 'advanced', yearsExperience: 6 }
    ],
    certifications: [
      {
        id: 'cert-003',
        name: 'Inspector Calidad NCH',
        issuedBy: 'INN',
        issuedDate: new Date('2022-06-01'),
        expiryDate: new Date('2025-06-01'),
        status: 'valid'
      }
    ]
  },
  {
    id: 'member-004',
    name: 'Juan Pérez',
    email: 'juan.perez@constructora.cl',
    role: 'MAESTRO',
    specialization: ['Fierrería', 'Soldadura'],
    performance: {
      productivity: 87,
      quality: 89,
      safety: 91,
      reliability: 85,
      overall: 88
    },
    status: 'available',
    availability: {
      hoursPerDay: 8,
      daysPerWeek: [1, 2, 3, 4, 5],
      shift: 'morning'
    },
    currentAssignments: [],
    history: {
      projectsCompleted: 6,
      totalWorkHours: 1200,
      averageRating: 3.8,
      joinDate: new Date('2022-11-15')
    },
    skills: [
      { name: 'Fierrería', level: 'expert', yearsExperience: 15 },
      { name: 'Soldadura', level: 'advanced', yearsExperience: 12 },
      { name: 'Estructuras Metálicas', level: 'intermediate', yearsExperience: 8 }
    ]
  },
  {
    id: 'member-005',
    name: 'Luis González',
    email: 'luis.gonzalez@constructora.cl',
    role: 'OFICIAL',
    specialization: ['Instalaciones', 'Electricidad'],
    performance: {
      productivity: 82,
      quality: 85,
      safety: 88,
      reliability: 80,
      overall: 84
    },
    status: 'on_leave',
    availability: {
      startDate: new Date('2024-04-01'),
      hoursPerDay: 8,
      daysPerWeek: [1, 2, 3, 4, 5],
      shift: 'full'
    },
    currentAssignments: [],
    history: {
      projectsCompleted: 4,
      totalWorkHours: 800,
      averageRating: 3.5,
      joinDate: new Date('2023-07-20')
    },
    skills: [
      { name: 'Instalaciones Eléctricas', level: 'advanced', yearsExperience: 7 },
      { name: 'Domótica', level: 'intermediate', yearsExperience: 3 }
    ]
  }
]

// Sample subcontractors data
const sampleSubcontractors: Subcontractor[] = [
  {
    id: 'sub-001',
    companyName: 'Construcciones del Sur Ltda.',
    contactPerson: 'Roberto Martinez',
    email: 'contacto@construsur.cl',
    phone: '+56 2 2555 1234',
    rut: '76.123.456-7',
    specialties: ['Hormigón Armado', 'Estructuras', 'Fundaciones'],
    serviceTypes: [
      {
        id: 'service-001',
        name: 'Vaciado Hormigón',
        category: 'Estructura',
        unitOfMeasure: 'm³',
        baseRate: 85000,
        currency: 'CLP'
      },
      {
        id: 'service-002',
        name: 'Enfierradura',
        category: 'Estructura',
        unitOfMeasure: 'kg',
        baseRate: 1200,
        currency: 'CLP'
      }
    ],
    rating: {
      overall: 4.2,
      quality: 4.3,
      timeliness: 4.0,
      communication: 4.1,
      safety: 4.5,
      cost: 3.8,
      reviewCount: 15
    },
    capacity: {
      maxSimultaneousProjects: 3,
      teamSize: { min: 8, max: 25, current: 18 },
      availability: {
        startDate: new Date('2024-03-20'),
        endDate: new Date('2024-12-31')
      },
      workingHours: {
        startTime: '07:00',
        endTime: '17:00',
        daysPerWeek: [1, 2, 3, 4, 5, 6]
      }
    },
    currentProjects: [
      {
        id: 'proj-001',
        name: 'Torre Las Condes',
        role: 'Estructura Principal',
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-05-30'),
        workload: 65,
        status: 'active'
      }
    ],
    compliance: {
      insurance: {
        hasInsurance: true,
        insuranceExpiry: new Date('2024-12-31'),
        coverageAmount: 500000000
      },
      licenses: [
        {
          type: 'Construcción Clase A',
          number: 'CA-2019-001234',
          expiryDate: new Date('2025-08-15'),
          status: 'valid'
        }
      ],
      safetyRecord: {
        incidentCount: 0,
        safetyScore: 98
      }
    },
    financial: {
      paymentTerms: '30 días',
      preferredPaymentMethod: 'Transferencia',
      averageInvoiceAmount: 15000000,
      paymentHistory: {
        onTimePayments: 28,
        latePayments: 2,
        averagePaymentDelay: 3
      }
    },
    history: {
      projectsCompleted: 8,
      totalRevenue: 450000000,
      averageProjectDuration: 120,
      clientSince: new Date('2020-05-15'),
      lastProjectDate: new Date('2024-01-30')
    }
  },
  {
    id: 'sub-002',
    companyName: 'Instalaciones Técnicas SpA',
    contactPerson: 'María Silva',
    email: 'maria@instecnicas.cl',
    phone: '+56 2 2555 5678',
    rut: '77.234.567-8',
    specialties: ['Instalaciones Eléctricas', 'Climatización', 'Domótica'],
    serviceTypes: [
      {
        id: 'service-003',
        name: 'Instalación Eléctrica',
        category: 'Instalaciones',
        unitOfMeasure: 'punto',
        baseRate: 25000,
        currency: 'CLP'
      }
    ],
    rating: {
      overall: 4.6,
      quality: 4.8,
      timeliness: 4.5,
      communication: 4.4,
      safety: 4.7,
      cost: 4.2,
      reviewCount: 22
    },
    capacity: {
      maxSimultaneousProjects: 5,
      teamSize: { min: 4, max: 12, current: 8 },
      availability: {
        startDate: new Date('2024-04-01')
      },
      workingHours: {
        startTime: '08:00',
        endTime: '18:00',
        daysPerWeek: [1, 2, 3, 4, 5]
      }
    },
    currentProjects: [
      {
        id: 'proj-002',
        name: 'Centro Comercial',
        role: 'Instalaciones Técnicas',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-06-15'),
        workload: 45,
        status: 'active'
      }
    ],
    compliance: {
      insurance: {
        hasInsurance: true,
        insuranceExpiry: new Date('2025-03-31'),
        coverageAmount: 300000000
      },
      licenses: [
        {
          type: 'Instalador SEC Clase A',
          number: 'SEC-2021-5678',
          expiryDate: new Date('2025-12-01'),
          status: 'valid'
        }
      ],
      safetyRecord: {
        incidentCount: 1,
        lastIncidentDate: new Date('2023-08-15'),
        safetyScore: 94
      }
    },
    financial: {
      paymentTerms: '45 días',
      preferredPaymentMethod: 'Cheque',
      averageInvoiceAmount: 8500000,
      paymentHistory: {
        onTimePayments: 18,
        latePayments: 1,
        averagePaymentDelay: 2
      }
    },
    history: {
      projectsCompleted: 12,
      totalRevenue: 280000000,
      averageProjectDuration: 85,
      clientSince: new Date('2019-11-20'),
      lastProjectDate: new Date('2024-02-28')
    }
  },
  {
    id: 'sub-003',
    companyName: 'Terminaciones Premium',
    contactPerson: 'Pedro Ramirez',
    email: 'pedro@terminacionespremium.cl',
    phone: '+56 2 2555 9999',
    rut: '78.345.678-9',
    specialties: ['Terminaciones', 'Pintura', 'Revestimientos'],
    serviceTypes: [
      {
        id: 'service-004',
        name: 'Pintura Interior',
        category: 'Terminaciones',
        unitOfMeasure: 'm²',
        baseRate: 3500,
        currency: 'CLP'
      }
    ],
    rating: {
      overall: 3.9,
      quality: 4.1,
      timeliness: 3.6,
      communication: 3.8,
      safety: 4.2,
      cost: 4.0,
      reviewCount: 11
    },
    capacity: {
      maxSimultaneousProjects: 4,
      teamSize: { min: 6, max: 15, current: 10 },
      availability: {
        startDate: new Date('2024-05-15')
      },
      workingHours: {
        startTime: '08:00',
        endTime: '17:00',
        daysPerWeek: [1, 2, 3, 4, 5]
      }
    },
    currentProjects: [],
    compliance: {
      insurance: {
        hasInsurance: false
      },
      licenses: [],
      safetyRecord: {
        incidentCount: 2,
        lastIncidentDate: new Date('2024-01-20'),
        safetyScore: 86
      }
    },
    financial: {
      paymentTerms: '21 días',
      preferredPaymentMethod: 'Transferencia',
      averageInvoiceAmount: 5200000,
      paymentHistory: {
        onTimePayments: 8,
        latePayments: 4,
        averagePaymentDelay: 8
      }
    },
    history: {
      projectsCompleted: 6,
      totalRevenue: 125000000,
      averageProjectDuration: 60,
      clientSince: new Date('2022-03-10'),
      lastProjectDate: new Date('2024-01-15')
    }
  }
]

// Sample assignments data
const sampleAssignments: WorkAssignment[] = [
  {
    id: 'assign-001',
    title: 'Vaciado Losa Piso 5',
    description: 'Vaciado de losa de hormigón armado para piso 5, sector norte',
    projectId: 'proj-001',
    projectName: 'Torre Las Condes',
    workOrderId: 'wo-001',
    activityId: 'act-001',
    activityName: 'Estructura Hormigón',
    partida: 'E.01.05 - Losas de Entrepiso',
    plannedStartDate: new Date('2024-03-20'),
    plannedEndDate: new Date('2024-03-22'),
    actualStartDate: new Date('2024-03-20'),
    duration: 24,
    requirements: {
      skills: [
        { name: 'Hormigón Armado', level: 'advanced', required: true },
        { name: 'Coordinación', level: 'intermediate', required: true }
      ],
      equipment: ['Bomba Hormigón', 'Vibrador'],
      certifications: ['Operador Grúa'],
      experience: { minYears: 3, preferredYears: 5 },
      teamSize: { min: 6, max: 10, preferred: 8 }
    },
    assignedMembers: [
      {
        memberId: 'member-001',
        member: sampleTeamMembers[0],
        assignedDate: new Date('2024-03-15'),
        assignedBy: 'supervisor-001',
        role: 'Coordinador',
        workload: 100,
        status: 'in_progress'
      },
      {
        memberId: 'member-002',
        member: sampleTeamMembers[1],
        assignedDate: new Date('2024-03-15'),
        assignedBy: 'supervisor-001',
        role: 'Capataz',
        workload: 80,
        status: 'confirmed'
      }
    ],
    assignedSubcontractors: [
      {
        subcontractorId: 'sub-001',
        subcontractor: sampleSubcontractors[0],
        assignedDate: new Date('2024-03-10'),
        assignedBy: 'supervisor-001',
        serviceType: 'Vaciado Hormigón',
        scope: '45 m³ de hormigón H25',
        estimatedCost: 3825000,
        status: 'confirmed'
      }
    ],
    status: 'in_progress',
    priority: 'high',
    progress: 65,
    location: {
      zone: 'Torre A',
      level: 'Piso 5',
      area: 'Sector Norte',
      coordinates: { lat: -33.4372, lng: -70.6506 },
      accessInstructions: 'Acceso por ascensor de obra hasta piso 5'
    },
    workConditions: {
      safety: ['Casco', 'Chaleco', 'Zapatos de seguridad', 'Arnés'],
      weather: 'covered',
      specialRequirements: ['Trabajo en altura'],
      hazards: ['Caída de altura', 'Manipulación material pesado']
    },
    notifications: [
      {
        id: 'notif-001',
        type: 'assignment',
        recipient: 'member-001',
        message: 'Asignado como coordinador para vaciado losa piso 5',
        sentDate: new Date('2024-03-15'),
        read: true
      }
    ],
    workflow: {
      createdBy: 'supervisor-001',
      createdDate: new Date('2024-03-10'),
      approvedBy: 'manager-001',
      approvedDate: new Date('2024-03-12'),
      comments: [
        {
          id: 'comment-001',
          author: 'supervisor-001',
          message: 'Prioridad alta debido a cronograma crítico',
          timestamp: new Date('2024-03-10'),
          type: 'note'
        }
      ]
    }
  },
  {
    id: 'assign-002',
    title: 'Inspección Calidad Estructura',
    description: 'Inspección técnica de calidad para estructura de hormigón',
    projectId: 'proj-001',
    projectName: 'Torre Las Condes',
    activityName: 'Control de Calidad',
    plannedStartDate: new Date('2024-03-23'),
    plannedEndDate: new Date('2024-03-24'),
    duration: 8,
    requirements: {
      skills: [
        { name: 'Control de Calidad', level: 'expert', required: true }
      ],
      certifications: ['Inspector NCH'],
      teamSize: { min: 1, max: 2, preferred: 1 }
    },
    assignedMembers: [
      {
        memberId: 'member-003',
        member: sampleTeamMembers[2],
        assignedDate: new Date('2024-03-18'),
        assignedBy: 'supervisor-001',
        role: 'Inspector Principal',
        workload: 100,
        status: 'assigned'
      }
    ],
    assignedSubcontractors: [],
    status: 'assigned',
    priority: 'critical',
    progress: 0,
    location: {
      zone: 'Torre A',
      level: 'Piso 5',
      area: 'Toda la planta'
    },
    workConditions: {
      safety: ['Casco', 'Chaleco', 'Zapatos de seguridad'],
      weather: 'covered'
    },
    notifications: [],
    workflow: {
      createdBy: 'quality-manager-001',
      createdDate: new Date('2024-03-18')
    }
  },
  {
    id: 'assign-003',
    title: 'Instalaciones Eléctricas Piso 3',
    description: 'Instalación de canalización y cableado eléctrico',
    projectId: 'proj-001',
    projectName: 'Torre Las Condes',
    activityName: 'Instalaciones Técnicas',
    plannedStartDate: new Date('2024-03-25'),
    plannedEndDate: new Date('2024-04-05'),
    duration: 80,
    requirements: {
      skills: [
        { name: 'Instalaciones Eléctricas', level: 'advanced', required: true }
      ],
      certifications: ['Instalador SEC'],
      teamSize: { min: 3, max: 6, preferred: 4 }
    },
    assignedMembers: [],
    assignedSubcontractors: [
      {
        subcontractorId: 'sub-002',
        subcontractor: sampleSubcontractors[1],
        assignedDate: new Date('2024-03-18'),
        assignedBy: 'supervisor-001',
        serviceType: 'Instalación Eléctrica',
        scope: 'Canalización y cableado completo piso 3',
        estimatedCost: 12500000,
        status: 'assigned'
      }
    ],
    status: 'assigned',
    priority: 'medium',
    progress: 0,
    location: {
      zone: 'Torre A',
      level: 'Piso 3',
      area: 'Todos los departamentos'
    },
    workConditions: {
      safety: ['Casco', 'Chaleco', 'Zapatos de seguridad'],
      weather: 'indoor'
    },
    notifications: [],
    workflow: {
      createdBy: 'technical-manager-001',
      createdDate: new Date('2024-03-18')
    }
  }
]

// Sample performance data
const samplePerformance: TeamPerformance[] = [
  {
    teamId: 'team-001',
    period: {
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-29')
    },
    productivity: {
      plannedHours: 1600,
      actualHours: 1520,
      efficiency: 95,
      completedTasks: 25,
      delayedTasks: 3,
      averageTaskDuration: 32
    },
    quality: {
      inspectionsPassed: 22,
      inspectionsFailed: 3,
      reworkRequired: 2,
      qualityScore: 88,
      clientSatisfaction: 4.2
    },
    safety: {
      incidentCount: 0,
      nearMissCount: 1,
      safetyTrainingHours: 40,
      safetyScore: 96,
      daysWithoutIncident: 28
    },
    cost: {
      budgetedAmount: 45000000,
      actualAmount: 43200000,
      variance: -4,
      costPerHour: 28421,
      overtime: {
        hours: 80,
        cost: 1600000
      }
    },
    teamwork: {
      communicationScore: 85,
      collaborationScore: 88,
      conflictCount: 1,
      teamSatisfaction: 4.1
    }
  }
]

// Default story
export const Default: Story = {
  args: {
    variant: 'default',
    layout: 'dashboard',
    mode: 'view',
    teamMembers: sampleTeamMembers,
    subcontractors: sampleSubcontractors,
    assignments: sampleAssignments,
    performance: samplePerformance,
    showTeamMembers: true,
    showSubcontractors: true,
    showAssignments: true,
    showPerformance: true,
    showWorkload: true,
    showAvailability: true,
    enableAssignment: true,
    enableReassignment: true,
    enableBulkOperations: false,
    enableAutoAssignment: false,
    currentUser: {
      id: 'user-001',
      name: 'Supervisor Principal',
      role: 'JEFE_TERRENO',
      permissions: ['view', 'assign', 'edit', 'approve']
    },
    currentProject: {
      id: 'proj-001',
      name: 'Torre Las Condes',
      code: 'TLC-001'
    },
    enableRealTimeUpdates: false,
    onlineUsers: ['member-001', 'member-003'],
    pendingNotifications: [],
  },
}

// Assignment workflow mode
export const AssignmentWorkflow: Story = {
  args: {
    ...Default.args,
    mode: 'assign',
    layout: 'cards',
    variant: 'full',
    enableAssignment: true,
    enableReassignment: true,
    selectedMembers: ['member-002', 'member-004'],
    selectedAssignments: ['assign-002'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Assignment workflow mode showing team member cards with drag-and-drop assignment capabilities and workload optimization.',
      },
    },
  },
}

// Workload optimization view
export const WorkloadOptimization: Story = {
  args: {
    ...Default.args,
    layout: 'list',
    showWorkload: true,
    showAvailability: true,
    memberFilters: {
      performance: { min: 80, max: 100 }
    },
    teamMembers: sampleTeamMembers.map(member => ({
      ...member,
      currentAssignments: member.currentAssignments.map(assignment => ({
        ...assignment,
        workload: Math.random() > 0.5 ? 
          Math.floor(Math.random() * 40) + 60 : // High workload
          Math.floor(Math.random() * 50) + 20   // Normal workload
      }))
    })),
  },
  parameters: {
    docs: {
      description: {
        story: 'Workload optimization view highlighting team member capacity, current assignments, and availability for efficient resource allocation.',
      },
    },
  },
}

// Subcontractor management
export const SubcontractorManagement: Story = {
  args: {
    ...Default.args,
    layout: 'cards',
    showTeamMembers: false,
    showSubcontractors: true,
    showAssignments: false,
    subcontractorFilters: {
      specialties: ['Hormigón Armado', 'Instalaciones Eléctricas'],
      rating: { min: 4.0, max: 5.0 },
      compliance: true
    },
    currentUser: {
      id: 'user-002',
      name: 'Gerente Técnico',
      role: 'OFICINA_TECNICA',
      permissions: ['view', 'assign', 'approve', 'contract']
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Subcontractor management interface with rating systems, compliance tracking, capacity management, and performance metrics.',
      },
    },
  },
}

// Performance dashboard
export const PerformanceDashboard: Story = {
  args: {
    ...Default.args,
    layout: 'dashboard',
    variant: 'full',
    showPerformance: true,
    performance: [
      ...samplePerformance,
      {
        teamId: 'team-002',
        period: {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-03-15')
        },
        productivity: {
          plannedHours: 800,
          actualHours: 780,
          efficiency: 97,
          completedTasks: 15,
          delayedTasks: 1,
          averageTaskDuration: 28
        },
        quality: {
          inspectionsPassed: 14,
          inspectionsFailed: 1,
          reworkRequired: 0,
          qualityScore: 93
        },
        safety: {
          incidentCount: 0,
          nearMissCount: 0,
          safetyTrainingHours: 20,
          safetyScore: 100,
          daysWithoutIncident: 45
        },
        cost: {
          budgetedAmount: 22000000,
          actualAmount: 21500000,
          variance: -2.3,
          costPerHour: 27564,
          overtime: { hours: 24, cost: 480000 }
        },
        teamwork: {
          communicationScore: 92,
          collaborationScore: 89,
          conflictCount: 0,
          teamSatisfaction: 4.4
        }
      }
    ],
    currentUser: {
      id: 'user-003',
      name: 'Gerente de Proyecto',
      role: 'GERENCIA',
      permissions: ['view', 'assign', 'approve', 'manage', 'reports']
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance dashboard with comprehensive team metrics including productivity, quality, safety, cost, and teamwork indicators.',
      },
    },
  },
}

// Mobile field management
export const MobileFieldManagement: Story = {
  args: {
    ...Default.args,
    variant: 'mobile',
    layout: 'list',
    compactView: true,
    teamMembers: sampleTeamMembers.slice(0, 3),
    assignments: sampleAssignments.slice(0, 2),
    enableSwipeActions: true,
    enableRealTimeUpdates: true,
    onlineUsers: ['member-001', 'member-002'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized field management interface with swipe actions, real-time updates, and touch-friendly controls for site managers.',
      },
    },
  },
}

// Bulk operations mode
export const BulkOperations: Story = {
  args: {
    ...Default.args,
    enableBulkOperations: true,
    selectedMembers: ['member-002', 'member-004'],
    selectedSubcontractors: ['sub-002'],
    selectedAssignments: ['assign-002', 'assign-003'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk operations mode allowing multiple team members and assignments to be managed simultaneously with batch actions.',
      },
    },
  },
}

// Real-time collaboration
export const RealTimeCollaboration: Story = {
  args: {
    ...Default.args,
    enableRealTimeUpdates: true,
    isSyncing: true,
    onlineUsers: ['member-001', 'member-002', 'member-003'],
    pendingNotifications: [
      {
        id: 'notif-001',
        type: 'assignment',
        message: 'Nueva asignación: Inspección Calidad Piso 4',
        timestamp: new Date(),
        priority: 'high'
      },
      {
        id: 'notif-002',
        type: 'update',
        message: 'Carlos Rodriguez completó vaciado losa',
        timestamp: new Date(Date.now() - 300000),
        priority: 'medium'
      }
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-time collaboration features with live user indicators, instant notifications, and synchronization status for distributed teams.',
      },
    },
  },
}

// Auto-assignment system
export const AutoAssignmentSystem: Story = {
  args: {
    ...Default.args,
    enableAutoAssignment: true,
    autoAssignmentRules: [
      {
        id: 'rule-001',
        name: 'Asignación por Especialidad',
        conditions: { skill: 'Hormigón Armado', availability: 'available' },
        actions: { assign: 'best_performance' },
        enabled: true
      },
      {
        id: 'rule-002',
        name: 'Balanceo de Carga',
        conditions: { workload: '<70%' },
        actions: { distribute: 'evenly' },
        enabled: true
      }
    ],
    variant: 'full',
  },
  parameters: {
    docs: {
      description: {
        story: 'Auto-assignment system with rule-based allocation, skill matching, and workload balancing for optimal team efficiency.',
      },
    },
  },
}

// Loading state
export const LoadingState: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    teamMembers: [],
    subcontractors: [],
    assignments: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton placeholders while team assignment data is being fetched.',
      },
    },
  },
}

// Empty state
export const EmptyState: Story = {
  args: {
    ...Default.args,
    teamMembers: [],
    subcontractors: [],
    assignments: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no team members or assignments are available, guiding users to set up their first team.',
      },
    },
  },
}

// Assignment in progress
export const AssignmentInProgress: Story = {
  args: {
    ...Default.args,
    isAssigning: true,
    mode: 'assign',
  },
  parameters: {
    docs: {
      description: {
        story: 'Assignment operation in progress with loading indicators and disabled state during team assignment processing.',
      },
    },
  },
}