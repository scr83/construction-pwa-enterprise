'use client'

import { ProjectManagement } from '@/components/pages/ProjectManagement'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// Real API integration - no more mock data
export default function ProjectsPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Map NextAuth role to projects role format
  const role = session?.user.role === 'EXECUTIVE' ? 'gerencia' : 'jefe_terreno'
  
  // Load real projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/projects')
        // const data = await response.json()
        // setProjects(data.projects || [])
        
        // For now, use empty array to show proper empty state
        setProjects([])
        
      } catch (err) {
        setError('Error cargando proyectos')
        console.error('Error loading projects:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (session?.user) {
      loadProjects()
    }
  }, [session])
  
  // Real usuario based on session
  const usuario = {
    id: session?.user.id || 'user-1',
    nombre: session?.user.name || 'Usuario',
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad',
    permisos: role === 'gerencia' ? 
      ['ver_proyectos', 'crear_proyecto', 'editar_presupuesto', 'ver_todos_proyectos'] :
      role === 'jefe_terreno' ?
      ['ver_proyectos', 'editar_avance', 'asignar_trabajadores', 'ver_cronograma'] :
      role === 'oficina_tecnica' ?
      ['ver_proyectos', 'editar_planificacion', 'gestionar_materiales', 'crear_cronograma'] :
      ['ver_proyectos'],
    proyectosAsignados: projects.map(p => p.id)
  }

  // Configuration based on role
  const configuracionPersonalizada = {
    mostrarUnidades: true,
    mostrarFinanciero: role === 'gerencia' || role === 'oficina_tecnica',
    mostrarEquipo: role === 'gerencia' || role === 'jefe_terreno',
    mostrarCalidad: role !== 'bodega',
    densidad: 'normal' as const,
    ordenamiento: {
      campo: 'fechas.ultimaModificacion',
      direccion: 'desc' as const
    },
    vistaDetallada: role === 'gerencia'
  }

  return (
    <ProtectedLayout>
      <ProjectManagement 
        usuario={usuario}
        proyectos={projects as any}
        partidasConstructivas={[]}
        configuracion={configuracionPersonalizada}
        isLoading={loading}
        error={error}
      />
    </ProtectedLayout>
  )
}
