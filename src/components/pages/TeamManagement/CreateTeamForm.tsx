'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/atoms/Button'
import { type CreateTeamData } from '@/lib/api/teams'

// Chilean construction specialties
const CONSTRUCTION_SPECIALTIES = [
  'Hormigón Armado',
  'Albañilería',
  'Estructura Metálica',
  'Instalaciones Eléctricas',
  'Instalaciones Sanitarias',
  'Instalaciones de Gas',
  'Techumbres',
  'Aislación Térmica',
  'Revestimientos',
  'Pavimentos',
  'Carpintería',
  'Pintura',
  'Jardinería',
  'Control de Calidad'
]

interface CreateTeamFormProps {
  onSubmit: (teamData: CreateTeamData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function CreateTeamForm({ onSubmit, onCancel, loading = false }: CreateTeamFormProps) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<CreateTeamData>({
    name: '',
    type: 'estructuras',
    projectId: '',
    supervisorId: session?.user?.id || '',
    specialties: [],
    productivityTarget: 85
  })
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])
  const [supervisors, setSupervisors] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load available projects and supervisors
  useEffect(() => {
    const loadFormData = async () => {
      try {
        // For now, use mock data - in production this would come from APIs
        // Mock projects
        const mockProjects = [
          { id: 'proj-1', name: 'Edificio Las Condes' },
          { id: 'proj-2', name: 'Condominio La Dehesa' },
          { id: 'proj-3', name: 'Torre Empresarial' }
        ]
        
        // Mock supervisors
        const mockSupervisors = [
          { id: 'user-1', name: 'Carlos Silva', email: 'carlos@constructorpro.cl' },
          { id: 'user-2', name: 'María González', email: 'maria@constructorpro.cl' },
          { id: 'user-3', name: 'Pedro Morales', email: 'pedro@constructorpro.cl' }
        ]

        setProjects(mockProjects)
        setSupervisors(mockSupervisors)
        
        // Set default project if available
        if (mockProjects.length > 0) {
          setFormData(prev => ({ ...prev, projectId: mockProjects[0].id }))
        }
        
        setLoadingData(false)
      } catch (error) {
        console.error('Error loading form data:', error)
        setError('Error cargando datos del formulario')
        setLoadingData(false)
      }
    }

    loadFormData()
  }, [])

  const handleInputChange = (field: keyof CreateTeamData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter(s => s !== specialty)
      : [...selectedSpecialties, specialty]
    
    setSelectedSpecialties(newSpecialties)
    handleInputChange('specialties', newSpecialties)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('El nombre del equipo es requerido')
      return
    }
    
    if (!formData.projectId) {
      setError('Debe seleccionar un proyecto')
      return
    }
    
    if (!formData.supervisorId) {
      setError('Debe seleccionar un supervisor')
      return
    }

    setError(null)
    
    try {
      await onSubmit({
        ...formData,
        specialties: selectedSpecialties
      })
    } catch (error) {
      setError('Error creando el equipo')
    }
  }

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Equipo</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-xl"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Equipo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="ej. Cuadrilla Estructuras A"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            />
          </div>

          {/* Team Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Equipo *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value as any)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            >
              <option value="estructuras">🏗️ Estructuras</option>
              <option value="instalaciones">⚡ Instalaciones</option>
              <option value="terminaciones">🎨 Terminaciones</option>
              <option value="calidad">🛡️ Control de Calidad</option>
            </select>
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proyecto *
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => handleInputChange('projectId', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            >
              <option value="">Seleccionar proyecto...</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Supervisor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supervisor *
            </label>
            <select
              value={formData.supervisorId}
              onChange={(e) => handleInputChange('supervisorId', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            >
              <option value="">Seleccionar supervisor...</option>
              {supervisors.map(supervisor => (
                <option key={supervisor.id} value={supervisor.id}>
                  {supervisor.name} ({supervisor.email})
                </option>
              ))}
            </select>
          </div>

          {/* Productivity Target */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta de Productividad (%)
            </label>
            <input
              type="number"
              min="50"
              max="200"
              value={formData.productivityTarget}
              onChange={(e) => handleInputChange('productivityTarget', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Meta típica: 85% - 100%. Para equipos de alto rendimiento: 100%+
            </p>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidades del Equipo
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {CONSTRUCTION_SPECIALTIES.map(specialty => (
                <label key={specialty} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSpecialties.includes(specialty)}
                    onChange={() => handleSpecialtyToggle(specialty)}
                    className="mr-2 rounded"
                    disabled={loading}
                  />
                  <span className="text-sm">{specialty}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Selecciona las especialidades principales de este equipo
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.projectId || !formData.supervisorId}
              className="flex-1"
            >
              {loading ? '🔄 Creando...' : '👥 Crear Equipo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}