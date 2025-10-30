'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Loading } from '@/components/atoms/Loading'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { EstructuraTab } from '@/components/organisms/EstructuraTab'

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'resumen' | 'estructura' | 'partidas' | 'equipos'>('resumen')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjectDetails()
  }, [projectId])

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/projects/${projectId}`)
      if (!response.ok) throw new Error('Error loading project')
      const data = await response.json()
      setProject(data.project)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" />
          <Typography variant="body-large" color="muted" className="ml-3">
            Cargando proyecto...
          </Typography>
        </div>
      </ProtectedLayout>
    )
  }

  if (!project) {
    return (
      <ProtectedLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Typography variant="h4" className="mb-4">
            Proyecto no encontrado
          </Typography>
          <Button onClick={() => router.push('/proyectos')}>
            Volver a Proyectos
          </Button>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-secondary-50 p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/proyectos')}
                leftIcon={<Icon name="arrow-left" size="sm" />}
              >
                Proyectos
              </Button>
              <div>
                <Typography variant="h3" className="font-bold">
                  {project.name}
                </Typography>
                <Typography variant="body-default" color="muted">
                  {project.code || project.id} • {project.location}
                </Typography>
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <Icon name="settings" size="sm" className="mr-2" />
              Editar Proyecto
            </Button>
          </div>

          {/* Project Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Typography variant="label-small" color="muted" className="mb-1">
                Edificios
              </Typography>
              <Typography variant="h5" className="font-bold text-primary-700">
                {project._count?.buildings || 0}
              </Typography>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <Typography variant="label-small" color="muted" className="mb-1">
                Pisos
              </Typography>
              <Typography variant="h5" className="font-bold text-blue-700">
                {project.stats?.totalFloors || 0}
              </Typography>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <Typography variant="label-small" color="muted" className="mb-1">
                Unidades
              </Typography>
              <Typography variant="h5" className="font-bold text-green-700">
                {project.stats?.totalUnits || 0}
              </Typography>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg">
              <Typography variant="label-small" color="muted" className="mb-1">
                Progreso
              </Typography>
              <Typography variant="h5" className="font-bold text-orange-700">
                {project.stats?.completionPercentage || 0}%
              </Typography>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 mb-6">
          <div className="flex border-b border-secondary-200">
            <button
              onClick={() => setActiveTab('resumen')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'resumen'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="layout-dashboard" size="sm" />
                <span>Resumen</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('estructura')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'estructura'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="building" size="sm" />
                <span>Estructura</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('partidas')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'partidas'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="clipboard-list" size="sm" />
                <span>Partidas</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('equipos')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'equipos'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="users" size="sm" />
                <span>Equipos</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'resumen' && <ResumenTab project={project} />}
            {activeTab === 'estructura' && <EstructuraTab project={project} onUpdate={fetchProjectDetails} />}
            {activeTab === 'partidas' && <PartidasTab project={project} />}
            {activeTab === 'equipos' && <EquiposTab project={project} />}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}

// Tab Components

function ResumenTab({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <Typography variant="h5" className="font-bold">
        Información General
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Typography variant="label-default" color="muted" className="mb-2">
            Descripción
          </Typography>
          <Typography variant="body-default">
            {project.description || 'Sin descripción'}
          </Typography>
        </div>
        
        <div>
          <Typography variant="label-default" color="muted" className="mb-2">
            Ubicación
          </Typography>
          <Typography variant="body-default">
            {project.location || 'Sin ubicación'}
          </Typography>
        </div>
        
        <div>
          <Typography variant="label-default" color="muted" className="mb-2">
            Tipo de Proyecto
          </Typography>
          <Typography variant="body-default" className="capitalize">
            {project.projectType || 'No especificado'}
          </Typography>
        </div>
        
        <div>
          <Typography variant="label-default" color="muted" className="mb-2">
            Estado
          </Typography>
          <Typography variant="body-default" className="capitalize">
            {project.status || 'No especificado'}
          </Typography>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-8">
        <Typography variant="h6" className="font-bold mb-4">
          Actividad Reciente
        </Typography>
        <div className="bg-secondary-50 rounded-lg p-6 text-center">
          <Typography variant="body-default" color="muted">
            No hay actividad reciente
          </Typography>
        </div>
      </div>
    </div>
  )
}

function PartidasTab({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h5" className="font-bold">
          Partidas Asignadas
        </Typography>
        <Button variant="primary">
          <Icon name="plus" size="sm" className="mr-2" />
          Asignar Partida
        </Button>
      </div>
      
      <div className="bg-secondary-50 rounded-lg p-8 text-center">
        <Icon name="clipboard-list" size="lg" className="mx-auto mb-3 text-secondary-400" />
        <Typography variant="body-large" color="muted">
          No hay partidas asignadas todavía
        </Typography>
        <Typography variant="body-small" color="muted" className="mt-2">
          Primero crea la estructura del proyecto (Edificios → Pisos → Unidades)
        </Typography>
      </div>
    </div>
  )
}

function EquiposTab({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h5" className="font-bold">
          Equipos Asignados
        </Typography>
        <Button variant="outline">
          <Icon name="user-plus" size="sm" className="mr-2" />
          Asignar Equipo
        </Button>
      </div>
      
      <div className="bg-secondary-50 rounded-lg p-8 text-center">
        <Icon name="users" size="lg" className="mx-auto mb-3 text-secondary-400" />
        <Typography variant="body-large" color="muted">
          No hay equipos asignados todavía
        </Typography>
      </div>
    </div>
  )
}