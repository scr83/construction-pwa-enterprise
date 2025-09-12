'use client'

import { TeamManagement } from '@/components/pages/TeamManagement'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

// Mock data para demostración - Equipos de construcción auténticos
const mockUsuario = {
  id: 'user-1',
  nombre: 'Juan Pérez',
  rol: 'jefe_terreno' as const,
  permisos: ['gestionar_equipos', 'asignar_tareas', 'ver_rendimiento'],
  proyectosAsignados: ['proj-1']
}

const mockEquipos = [
  {
    id: 'team-1',
    name: 'Equipo Estructuras A',
    department: 'terreno' as const,
    supervisor: 'Juan Pérez',
    supervisorId: 'user-1',
    currentProject: 'Edificio Las Condes - Unidades 101-110',
    currentLocation: 'Sector Norte - Pisos 1-5',
    status: 'activo' as const,
    productivity: 95,
    workSchedule: {
      startTime: '07:30',
      endTime: '17:00',
      workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    assignments: ['Hormigonado muros', 'Instalación moldajes', 'Armado fierros'],
    equipment: ['Vibrador hormigón', 'Soldadora', 'Herramientas menores'],
    safetyRecord: {
      daysWithoutIncidents: 45,
      lastIncidentDate: '2025-07-25',
      safetyRating: 98
    },
    performance: {
      tasksCompleted: 28,
      tasksOnTime: 26,
      qualityScore: 94,
      attendance: 96
    },
    members: [
      {
        id: 'member-1',
        nombre: 'Pedro González',
        rut: '12.345.678-9',
        cargo: 'Maestro Albañil',
        especialidad: 'albañil' as const,
        telefono: '+56 9 8765 4321',
        email: 'pedro.gonzalez@constructorpro.cl',
        fechaIngreso: '2023-03-15',
        contratistaEmpresa: 'Constructora Pérez Ltda.',
        certificaciones: ['Trabajos en Altura', 'Uso de Grúas', 'Primeros Auxilios'],
        estado: 'activo' as const,
        avatar: ''
      },
      {
        id: 'member-2',
        nombre: 'Luis Martínez',
        rut: '11.222.333-4',
        cargo: 'Fierrero',
        especialidad: 'fierrero' as const,
        telefono: '+56 9 7654 3210',
        fechaIngreso: '2023-05-20',
        contratistaEmpresa: 'Constructora Pérez Ltda.',
        certificaciones: ['Soldadura Básica', 'Seguridad Industrial'],
        estado: 'activo' as const,
        avatar: ''
      },
      {
        id: 'member-3',
        nombre: 'José Torres',
        rut: '10.111.222-3',
        cargo: 'Ayudante',
        especialidad: 'ayudante' as const,
        telefono: '+56 9 6543 2109',
        fechaIngreso: '2024-01-10',
        certificaciones: ['Inducción General'],
        estado: 'activo' as const,
        avatar: ''
      }
    ],
    notes: 'Equipo especializado en estructuras de hormigón armado',
    createdAt: '2023-03-01T08:00:00Z',
    updatedAt: '2025-09-12T15:30:00Z'
  },
  {
    id: 'team-2',
    name: 'Equipo Instalaciones B',
    department: 'instalaciones' as const,
    supervisor: 'María González',
    supervisorId: 'user-2',
    currentProject: 'Edificio Las Condes - Instalaciones',
    currentLocation: 'Múltiples sectores',
    status: 'activo' as const,
    productivity: 88,
    workSchedule: {
      startTime: '08:00',
      endTime: '17:30',
      workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    },
    assignments: ['Instalaciones eléctricas', 'Instalaciones sanitarias', 'Instalaciones de gas'],
    equipment: ['Herramientas eléctricas', 'Detector de voltaje', 'Taladros'],
    safetyRecord: {
      daysWithoutIncidents: 32,
      lastIncidentDate: '2025-08-08',
      safetyRating: 92
    },
    performance: {
      tasksCompleted: 22,
      tasksOnTime: 19,
      qualityScore: 90,
      attendance: 94
    },
    members: [
      {
        id: 'member-4',
        nombre: 'Ana Silva',
        rut: '09.888.777-6',
        cargo: 'Electricista Clase A',
        especialidad: 'electricista' as const,
        telefono: '+56 9 5432 1098',
        email: 'ana.silva@constructorpro.cl',
        fechaIngreso: '2022-11-10',
        contratistaEmpresa: 'Eléctrica Silva S.A.',
        certificaciones: ['SEC Clase A', 'Instalaciones BT', 'Instalaciones MT'],
        estado: 'activo' as const,
        avatar: ''
      },
      {
        id: 'member-5',
        nombre: 'Roberto Kim',
        rut: '08.777.666-5',
        cargo: 'Gasfiter',
        especialidad: 'gasfiter' as const,
        telefono: '+56 9 4321 0987',
        fechaIngreso: '2023-07-05',
        contratistaEmpresa: 'Instalaciones Kim Ltda.',
        certificaciones: ['Instalaciones de Gas', 'Soldadura Cañerías'],
        estado: 'activo' as const,
        avatar: ''
      },
      {
        id: 'member-6',
        nombre: 'Felipe Soto',
        rut: '07.666.555-4',
        cargo: 'Ayudante Instalaciones',
        especialidad: 'ayudante' as const,
        telefono: '+56 9 3210 9876',
        fechaIngreso: '2024-02-15',
        certificaciones: ['Trabajos en Altura', 'Uso de Escalas'],
        estado: 'activo' as const,
        avatar: ''
      }
    ],
    notes: 'Especialistas en instalaciones domiciliarias completas',
    createdAt: '2022-10-15T08:00:00Z',
    updatedAt: '2025-09-11T14:20:00Z'
  },
  {
    id: 'team-3',
    name: 'Equipo Control Calidad',
    department: 'calidad' as const,
    supervisor: 'Carlos Morales',
    supervisorId: 'user-3',
    currentProject: 'Inspecciones Generales',
    currentLocation: 'Todo el proyecto',
    status: 'activo' as const,
    productivity: 92,
    workSchedule: {
      startTime: '07:00',
      endTime: '16:30',
      workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    assignments: ['Inspecciones estructurales', 'Control hormigones', 'Verificación planos'],
    equipment: ['Esclerómetro', 'Nivel láser', 'Cámara fotográfica', 'Tablet inspecciones'],
    safetyRecord: {
      daysWithoutIncidents: 67,
      safetyRating: 100
    },
    performance: {
      tasksCompleted: 35,
      tasksOnTime: 34,
      qualityScore: 98,
      attendance: 98
    },
    members: [
      {
        id: 'member-7',
        nombre: 'Patricia López',
        rut: '06.555.444-3',
        cargo: 'Inspectora de Calidad Senior',
        especialidad: 'jefe_equipo' as const,
        telefono: '+56 9 2109 8765',
        email: 'patricia.lopez@constructorpro.cl',
        fechaIngreso: '2021-05-01',
        certificaciones: ['Inspector INN', 'Ensayos Hormigón', 'Certificación ISO'],
        estado: 'activo' as const,
        avatar: ''
      },
      {
        id: 'member-8',
        nombre: 'Miguel Herrera',
        rut: '05.444.333-2',
        cargo: 'Inspector Junior',
        especialidad: 'operador' as const,
        telefono: '+56 9 1098 7654',
        fechaIngreso: '2023-09-12',
        certificaciones: ['Control de Calidad Básico', 'Mediciones Topográficas'],
        estado: 'activo' as const,
        avatar: ''
      }
    ],
    notes: 'Equipo responsable del control de calidad y cumplimiento normativo',
    createdAt: '2021-04-15T08:00:00Z',
    updatedAt: '2025-09-13T11:45:00Z'
  },
  {
    id: 'team-4',
    name: 'Equipo Terminaciones',
    department: 'terreno' as const,
    supervisor: 'Diego Ruiz',
    supervisorId: 'user-4',
    currentProject: 'Edificio Las Condes - Acabados',
    currentLocation: 'Sector Sur - Pisos superiores',
    status: 'en_descanso' as const,
    productivity: 85,
    workSchedule: {
      startTime: '08:30',
      endTime: '17:30',
      workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    },
    assignments: ['Pintura', 'Cerámicas', 'Carpintería'],
    equipment: ['Herramientas pintura', 'Cortadora cerámica', 'Herramientas carpintería'],
    safetyRecord: {
      daysWithoutIncidents: 23,
      lastIncidentDate: '2025-08-18',
      safetyRating: 87
    },
    performance: {
      tasksCompleted: 18,
      tasksOnTime: 15,
      qualityScore: 89,
      attendance: 91
    },
    members: [
      {
        id: 'member-9',
        nombre: 'Raúl Mendoza',
        rut: '04.333.222-1',
        cargo: 'Maestro Pintor',
        especialidad: 'albañil' as const,
        telefono: '+56 9 0987 6543',
        fechaIngreso: '2022-08-20',
        contratistaEmpresa: 'Pinturas Mendoza',
        certificaciones: ['Aplicación Pinturas', 'Trabajos en Altura'],
        estado: 'licencia' as const,
        avatar: ''
      },
      {
        id: 'member-10',
        nombre: 'Sandra Vega',
        rut: '03.222.111-0',
        cargo: 'Ceramista',
        especialidad: 'albañil' as const,
        telefono: '+56 9 9876 5432',
        fechaIngreso: '2023-04-10',
        certificaciones: ['Instalación Cerámicas', 'Uso Cortadoras'],
        estado: 'activo' as const,
        avatar: ''
      }
    ],
    notes: 'Especialistas en terminaciones y acabados finos',
    createdAt: '2022-07-01T08:00:00Z',
    updatedAt: '2025-09-10T16:15:00Z'
  }
]

export default function TeamPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  
  // Get role from URL params with fallback
  const role = searchParams.get('role') || 
               (session?.user.role === 'EXECUTIVE' ? 'gerencia' : 'jefe_terreno')
  
  // Personalizar datos según rol del usuario autenticado
  const usuario = {
    ...mockUsuario,
    id: session?.user?.id || 'user-1',
    nombre: session?.user?.name || 'Usuario',
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad',
    permisos: mockUsuario.permisos || ['ver_equipos'],
    proyectosAsignados: mockUsuario.proyectosAsignados || []
  }

  // Filtrar equipos según rol (demostración)
  const equiposPersonalizados = role === 'gerencia' ? mockEquipos :
                               role === 'control_calidad' ? mockEquipos.filter(e => e.department === 'calidad') :
                               role === 'oficina_tecnica' ? mockEquipos.filter(e => 
                                 ['calidad', 'terreno'].includes(e.department)) :
                               role === 'bodega' ? mockEquipos.filter(e => e.department === 'terreno') :
                               mockEquipos // jefe_terreno ve todos

  const handleTeamCreate = (teamData: any) => {
    console.log('Crear nuevo equipo:', teamData)
    // En producción, aquí se llamaría al API
    alert('Funcionalidad de crear equipo será implementada con backend')
  }

  const handleTeamUpdate = (id: string, updates: any) => {
    console.log('Actualizar equipo:', id, updates)
    // En producción, aquí se llamaría al API
    alert('Funcionalidad de editar equipo será implementada con backend')
  }

  const handleMemberAdd = (teamId: string, memberData: any) => {
    console.log('Agregar miembro al equipo:', teamId, memberData)
    // En producción, aquí se llamaría al API
    alert('Funcionalidad de agregar miembro será implementada con backend')
  }

  const handleMemberUpdate = (teamId: string, memberId: string, updates: any) => {
    console.log('Actualizar miembro:', teamId, memberId, updates)
    // En producción, aquí se llamaría al API
    alert('Funcionalidad de editar miembro será implementada con backend')
  }

  return (
    <ProtectedLayout>
      <ErrorBoundary>
        <TeamManagement 
          usuario={usuario}
          equipos={equiposPersonalizados}
          onTeamCreate={handleTeamCreate}
          onTeamUpdate={handleTeamUpdate}
          onMemberAdd={handleMemberAdd}
          onMemberUpdate={handleMemberUpdate}
        />
      </ErrorBoundary>
    </ProtectedLayout>
  )
}