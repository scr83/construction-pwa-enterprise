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
  
  // Map NextAuth role to projects role format with fallback
  const role = session?.user?.role === 'EXECUTIVE' ? 'gerencia' : 'jefe_terreno'
  
  // Load real projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load projects from API
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects || [])
        } else {
          throw new Error('Failed to load projects')
        }
        
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

  // Handle project creation
  const handleProjectCreate = async (projectData: any) => {
    try {
      console.log('🔍 PROJECT CREATE - Raw form data:', JSON.stringify(projectData, null, 2))
      
      // Direct pass-through - API now accepts Spanish field names
      const payload = {
        nombre: projectData.nombre,
        descripcion: projectData.descripcion,
        tipo: projectData.tipo,
        fechaInicio: projectData.fecha_inicio,
        fechaTermino: projectData.fecha_termino
      }
      
      console.log('🔍 PROJECT CREATE - Payload to API:', JSON.stringify(payload, null, 2))
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        // Reload projects list
        const projectsResponse = await fetch('/api/projects')
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.projects || [])
        }
        alert('Proyecto creado exitosamente')
      } else {
        const error = await response.json()
        console.error('🔍 PROJECT CREATE - API Error:', JSON.stringify(error, null, 2))
        alert(`Error al crear proyecto: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error al crear proyecto')
    }
  }

  // Handle project update  
  const handleProjectUpdate = async (projectId: string, projectData: any) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      })

      if (response.ok) {
        // Reload projects list
        const projectsResponse = await fetch('/api/projects')
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.projects || [])
        }
        alert('Proyecto actualizado exitosamente')
      } else {
        const error = await response.json()
        alert(`Error al actualizar proyecto: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Error al actualizar proyecto')
    }
  }
  
  // Real usuario based on session with proper null checks
  const usuario = {
    id: session?.user?.id || 'user-1',
    nombre: session?.user?.name || 'Usuario',
    rol: (role || 'jefe_terreno') as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad',
    permisos: (role === 'gerencia') ? 
      ['ver_proyectos', 'crear_proyecto', 'editar_presupuesto', 'ver_todos_proyectos'] :
      (role === 'jefe_terreno') ?
      ['ver_proyectos', 'crear_proyecto', 'editar_avance', 'asignar_trabajadores', 'ver_cronograma'] :
      (role === 'oficina_tecnica') ?
      ['ver_proyectos', 'crear_proyecto', 'editar_planificacion', 'gestionar_materiales', 'crear_cronograma'] :
      ['ver_proyectos'],
    proyectosAsignados: (projects || []).map(p => p?.id).filter(Boolean)
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

  // Don't render until session is loaded and user exists
  if (!session || !session.user || loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </ProtectedLayout>
    )
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
        onProyectoCrear={handleProjectCreate}
        onProyectoActualizar={handleProjectUpdate}
      />
    </ProtectedLayout>
  )
}
