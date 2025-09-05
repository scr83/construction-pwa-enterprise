'use client'

import { ProjectManagement } from '@/components/pages/ProjectManagement'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { useSession } from 'next-auth/react'

// Mock data for demonstration
const mockUsuario = {
  id: 'user-1',
  nombre: 'Juan Pérez',
  rol: 'jefe_terreno' as const,
  permisos: ['ver_proyectos', 'crear_proyecto'],
  proyectosAsignados: ['proj-1']
}

const mockProyectos = [
  {
    id: 'proj-1',
    nombre: 'Edificio Las Condes',
    codigo: 'RES-001',
    descripcion: 'Edificio residencial de 20 pisos',
    tipo: 'residencial' as const,
    estado: 'estructura' as const,
    prioridad: 'alta' as const,
    ubicacion: {
      direccion: 'Av. Las Condes 1234',
      comuna: 'Las Condes',
      region: 'Metropolitana'
    },
    fechas: {
      inicio: '2024-01-15',
      terminoProgramado: '2024-12-15',
      creacion: '2023-12-01',
      ultimaModificacion: new Date().toISOString()
    },
    financiero: {
      presupuestoTotal: 2500000000,
      presupuestoEjecutado: 1700000000,
      moneda: 'CLP' as const,
      varianzaPresupuestaria: 5,
      flujoEfectivo: 300000000,
      gastosAutorizados: 1800000000
    },
    avance: {
      fisico: 75,
      financiero: 68,
      cronograma: 72,
      partidasCompletadas: 15,
      partidasTotales: 25
    },
    equipo: {
      jefeProyecto: 'Juan Pérez',
      jefeTerreno: 'Carlos Silva',
      totalTrabajadores: 25,
      subcontratistas: ['SubconA', 'SubconB']
    },
    calidad: {
      inspeccionesRealizadas: 12,
      inspeccionesPendientes: 3,
      noConformidades: 1,
      observacionesAbiertas: 2,
      cumplimientoNormativa: 95,
      certificacionesObtenidas: ['ISO9001']
    },
    etiquetas: ['residencial', 'alto-valor'],
    permisos: {
      puedeEditar: true,
      puedeEliminar: false,
      puedeVerFinanciero: true,
      puedeAsignarTareas: true
    },
    metadata: {
      creadoPor: 'admin',
      modificadoPor: 'user-1',
      version: '1.0',
      archivos: 45,
      fotos: 120,
      documentos: 23
    }
  }
]

const mockConfiguracion = {
  mostrarUnidades: true,
  mostrarFinanciero: true,
  mostrarEquipo: true,
  mostrarCalidad: true,
  densidad: 'normal' as const,
  ordenamiento: {
    campo: 'fechas.ultimaModificacion',
    direccion: 'desc' as const
  }
}

export default function ProjectsPage() {
  const { data: session } = useSession()
  
  // Map NextAuth role to projects role format
  const role = session?.user.role === 'EXECUTIVE' ? 'gerencia' : 'jefe_terreno'
  
  // Personalizar usuario según rol del usuario autenticado
  const usuario = {
    ...mockUsuario,
    id: session?.user.id || 'user-1',
    nombre: session?.user.name || 'Usuario',
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad',
    permisos: role === 'gerencia' ? 
      ['ver_proyectos', 'crear_proyecto', 'editar_presupuesto', 'ver_todos_proyectos'] :
      role === 'jefe_terreno' ?
      ['ver_proyectos', 'editar_avance', 'asignar_trabajadores', 'ver_cronograma'] :
      role === 'oficina_tecnica' ?
      ['ver_proyectos', 'editar_planificacion', 'gestionar_materiales', 'crear_cronograma'] :
      ['ver_proyectos']
  }

  // Configuración personalizada por rol
  const configuracionPersonalizada = {
    ...mockConfiguracion,
    mostrarFinanciero: role === 'gerencia' || role === 'oficina_tecnica',
    mostrarEquipo: role === 'gerencia' || role === 'jefe_terreno',
    mostrarCalidad: role !== 'bodega',
    mostrarUnidades: role === 'oficina_tecnica' || role === 'jefe_terreno',
    vistaDetallada: role === 'gerencia'
  }

  return (
    <ProtectedLayout>
      <ProjectManagement 
        usuario={usuario}
        proyectos={mockProyectos as any}
        partidasConstructivas={[]}
        configuracion={configuracionPersonalizada}
      />
    </ProtectedLayout>
  )
}
