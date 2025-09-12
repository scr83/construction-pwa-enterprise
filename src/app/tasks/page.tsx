'use client'

import { TaskManagement } from '@/components/pages/TaskManagement'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

// Mock data para demostración - Tareas de construcción auténticas
const mockUsuario = {
  id: 'user-1',
  nombre: 'Juan Pérez',
  rol: 'jefe_terreno' as const,
  permisos: ['ver_tareas', 'crear_tareas', 'editar_tareas'],
  proyectosAsignados: ['proj-1']
}

const mockTareas = [
  {
    id: 'task-1',
    title: 'Instalación de Moldajes - EA-101',
    partida: 'Levante de Estructuras',
    building: 'Edificio A',
    unit: 'EA-101',
    assignedTo: 'Juan Pérez (Jefe de Terreno)',
    priority: 'alta' as const,
    status: 'en_progreso' as const,
    category: 'estructura' as const,
    dueDate: '2025-09-15',
    startDate: '2025-09-12',
    description: 'Instalación de moldajes de madera para hormigonado de muros perimetrales. Verificar nivelación y aplomado antes del hormigonado.',
    estimatedHours: 16,
    actualHours: 12,
    materials: ['Madera pino 2x4', 'Clavos 3 pulgadas', 'Alambre negro N°16', 'Aceite desmoldante'],
    prerequisites: ['Fierros instalados', 'Instalaciones embebidas'],
    createdBy: 'María González',
    createdAt: '2025-09-10T08:00:00Z',
    updatedAt: '2025-09-12T14:30:00Z'
  },
  {
    id: 'task-2',
    title: 'Entrega de Kit de Materiales - EA-102',
    partida: 'Kit de Materiales',
    building: 'Edificio A',
    unit: 'EA-102',
    assignedTo: 'María González (Bodega)',
    priority: 'media' as const,
    status: 'programado' as const,
    category: 'materiales' as const,
    dueDate: '2025-09-16',
    startDate: '2025-09-16',
    description: 'Preparar y entregar kit de materiales para inicio de obra gruesa. Coordinar con jefe de terreno para recepción.',
    estimatedHours: 4,
    materials: ['Cemento 42.5kg x20 sacos', 'Fierro 8mm x50 metros', 'Gravilla x2 m³', 'Arena x1.5 m³'],
    prerequisites: ['Autorización de inicio', 'Espacio de almacenaje despejado'],
    createdBy: 'Juan Pérez',
    createdAt: '2025-09-11T10:15:00Z',
    updatedAt: '2025-09-11T10:15:00Z'
  },
  {
    id: 'task-3',
    title: 'Inspección de Calidad - Radier EA-103',
    partida: 'Control de Calidad',
    building: 'Edificio A',
    unit: 'EA-103',
    assignedTo: 'Carlos Morales (Control Calidad)',
    priority: 'alta' as const,
    status: 'retrasado' as const,
    category: 'calidad' as const,
    dueDate: '2025-09-13',
    startDate: '2025-09-13',
    description: 'Inspección de calidad post-hormigonado de radier. Verificar resistencia, nivelación y acabado superficial.',
    estimatedHours: 3,
    actualHours: 1.5,
    materials: ['Esclerómetro', 'Nivel láser', 'Formularios de inspección'],
    prerequisites: ['Radier curado 24hrs mínimo', 'Limpieza de superficie'],
    notes: 'Pendiente por lluvia del día anterior',
    createdBy: 'Patricia López',
    createdAt: '2025-09-12T07:00:00Z',
    updatedAt: '2025-09-13T16:45:00Z'
  },
  {
    id: 'task-4',
    title: 'Instalación Eléctrica - EA-104',
    partida: 'Instalaciones Eléctricas',
    building: 'Edificio A', 
    unit: 'EA-104',
    assignedTo: 'Roberto Kim (Instalaciones)',
    priority: 'media' as const,
    status: 'programado' as const,
    category: 'instalaciones' as const,
    dueDate: '2025-09-18',
    startDate: '2025-09-17',
    description: 'Instalación de canalizaciones eléctricas y cajas de registro. Coordinar con estructuras para perforaciones.',
    estimatedHours: 12,
    materials: ['Conduit PVC 20mm', 'Cajas octogonales', 'Alambre THHN 12 AWG', 'Tacos y tornillos'],
    prerequisites: ['Muros hormigonados', 'Planos de instalaciones actualizados'],
    createdBy: 'Ana Silva',
    createdAt: '2025-09-11T14:20:00Z',
    updatedAt: '2025-09-11T14:20:00Z'
  },
  {
    id: 'task-5',
    title: 'Pintura Interior - EA-105',
    partida: 'Terminaciones',
    building: 'Edificio A',
    unit: 'EA-105',
    assignedTo: 'Felipe Soto (Terminaciones)',
    priority: 'baja' as const,
    status: 'completado' as const,
    category: 'acabados' as const,
    dueDate: '2025-09-10',
    startDate: '2025-09-08',
    description: 'Aplicación de pintura interior en muros y cielos. Dos manos de pintura látex color blanco hueso.',
    estimatedHours: 8,
    actualHours: 9,
    materials: ['Pintura látex blanca x4 galones', 'Rodillos', 'Brochas', 'Lijas grano 120'],
    prerequisites: ['Pasta muro aplicada', 'Superficies lijadas'],
    photos: ['foto-1.jpg', 'foto-2.jpg', 'foto-3.jpg'],
    createdBy: 'Miguel Herrera',
    createdAt: '2025-09-07T09:00:00Z',
    updatedAt: '2025-09-10T17:30:00Z'
  },
  {
    id: 'task-6',
    title: 'Revisión Técnica Estructural',
    partida: 'Oficina Técnica',
    building: 'Edificio A',
    unit: 'General',
    assignedTo: 'Patricia López (Oficina Técnica)',
    priority: 'urgente' as const,
    status: 'en_progreso' as const,
    category: 'calidad' as const,
    dueDate: '2025-09-14',
    startDate: '2025-09-13',
    description: 'Revisión técnica de cálculos estructurales para modificación en vano de ventana. Requiere aprobación antes de ejecutar.',
    estimatedHours: 6,
    actualHours: 3,
    materials: ['Planos estructurales', 'Software de cálculo', 'Normativa NCh'],
    prerequisites: ['Solicitud de modificación aprobada', 'Planos de arquitectura actualizados'],
    createdBy: 'Carlos Morales',
    createdAt: '2025-09-13T08:30:00Z',
    updatedAt: '2025-09-13T15:45:00Z'
  }
]

export default function TasksPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  
  // Get role from URL params with fallback
  const role = searchParams.get('role') || 
               (session?.user.role === 'EXECUTIVE' ? 'gerencia' : 'jefe_terreno')
  
  // Personalizar datos según rol del usuario autenticado
  const usuario = {
    ...mockUsuario,
    id: session?.user.id || 'user-1',
    nombre: session?.user.name || 'Usuario',
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
  }

  // Filtrar tareas según rol (demostración)
  const tareasPersonalizadas = role === 'gerencia' ? mockTareas : 
                              role === 'bodega' ? mockTareas.filter(t => t.category === 'materiales') :
                              role === 'control_calidad' ? mockTareas.filter(t => t.category === 'calidad') :
                              role === 'oficina_tecnica' ? mockTareas.filter(t => t.assignedTo.includes('Oficina Técnica') || t.category === 'calidad') :
                              mockTareas // jefe_terreno ve todas

  const handleTaskCreate = (taskData: any) => {
    console.log('Crear nueva tarea:', taskData)
    // En producción, aquí se llamaría al API
    alert('Funcionalidad de crear tarea será implementada con backend')
  }

  const handleTaskUpdate = (id: string, updates: any) => {
    console.log('Actualizar tarea:', id, updates)
    // En producción, aquí se llamaría al API
    alert('Funcionalidad de editar tarea será implementada con backend')
  }

  const handleTaskDelete = (id: string) => {
    console.log('Eliminar tarea:', id)
    // En producción, aquí se llamaría al API
    alert('Funcionalidad de eliminar tarea será implementada con backend')
  }

  return (
    <ProtectedLayout>
      <TaskManagement 
        usuario={usuario}
        tareas={tareasPersonalizadas}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </ProtectedLayout>
  )
}