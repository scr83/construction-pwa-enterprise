'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'

interface ProjectData {
  name: string
  description: string
  projectType: 'residential' | 'commercial' | 'industrial' | 'infrastructure'
  startDate: string
  endDate: string
}

interface Building {
  name: string
  floors: Floor[]
}

interface Floor {
  name: string
  units: Unit[]
}

interface Unit {
  name: string
  unitType: string
}

const projectTypeOptions = [
  { value: 'residential', label: 'Residencial' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'infrastructure', label: 'Infraestructura' },
]

const unitTypeOptions = [
  { value: 'apartment', label: 'Departamento' },
  { value: 'house', label: 'Casa' },
  { value: 'office', label: 'Oficina' },
  { value: 'retail', label: 'Local Comercial' },
  { value: 'warehouse', label: 'Bodega' },
]

export default function NewProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form data
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    projectType: 'residential',
    startDate: '',
    endDate: '',
  })

  const [numBuildings, setNumBuildings] = useState(1)
  const [buildings, setBuildings] = useState<Building[]>([
    {
      name: 'Edificio A',
      floors: [{ name: 'Piso 1', units: [{ name: 'Unidad 1', unitType: 'apartment' }] }]
    }
  ])

  useEffect(() => {
    // Check if user is admin
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [status, session, router])

  // Auto-generate today's date for startDate default
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setProjectData(prev => ({ ...prev, startDate: today }))
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  const handleBuildingCountChange = (count: number) => {
    setNumBuildings(count)
    
    // Adjust buildings array
    const newBuildings = [...buildings]
    
    if (count > buildings.length) {
      // Add new buildings
      for (let i = buildings.length; i < count; i++) {
        const buildingLetter = String.fromCharCode(65 + i) // A, B, C, etc.
        newBuildings.push({
          name: `Edificio ${buildingLetter}`,
          floors: [{ name: 'Piso 1', units: [{ name: 'Unidad 1', unitType: 'apartment' }] }]
        })
      }
    } else {
      // Remove excess buildings
      newBuildings.splice(count)
    }
    
    setBuildings(newBuildings)
  }

  const updateBuilding = (buildingIndex: number, updates: Partial<Building>) => {
    const newBuildings = [...buildings]
    newBuildings[buildingIndex] = { ...newBuildings[buildingIndex], ...updates }
    setBuildings(newBuildings)
  }

  const updateFloor = (buildingIndex: number, floorIndex: number, updates: Partial<Floor>) => {
    const newBuildings = [...buildings]
    newBuildings[buildingIndex].floors[floorIndex] = {
      ...newBuildings[buildingIndex].floors[floorIndex],
      ...updates
    }
    setBuildings(newBuildings)
  }

  const addFloor = (buildingIndex: number) => {
    const newBuildings = [...buildings]
    const floorNumber = newBuildings[buildingIndex].floors.length + 1
    newBuildings[buildingIndex].floors.push({
      name: `Piso ${floorNumber}`,
      units: [{ name: 'Unidad 1', unitType: 'apartment' }]
    })
    setBuildings(newBuildings)
  }

  const removeFloor = (buildingIndex: number, floorIndex: number) => {
    const newBuildings = [...buildings]
    newBuildings[buildingIndex].floors.splice(floorIndex, 1)
    setBuildings(newBuildings)
  }

  const updateUnit = (buildingIndex: number, floorIndex: number, unitIndex: number, updates: Partial<Unit>) => {
    const newBuildings = [...buildings]
    newBuildings[buildingIndex].floors[floorIndex].units[unitIndex] = {
      ...newBuildings[buildingIndex].floors[floorIndex].units[unitIndex],
      ...updates
    }
    setBuildings(newBuildings)
  }

  const addUnit = (buildingIndex: number, floorIndex: number) => {
    const newBuildings = [...buildings]
    const unitNumber = newBuildings[buildingIndex].floors[floorIndex].units.length + 1
    newBuildings[buildingIndex].floors[floorIndex].units.push({
      name: `Unidad ${unitNumber}`,
      unitType: 'apartment'
    })
    setBuildings(newBuildings)
  }

  const removeUnit = (buildingIndex: number, floorIndex: number, unitIndex: number) => {
    const newBuildings = [...buildings]
    newBuildings[buildingIndex].floors[floorIndex].units.splice(unitIndex, 1)
    setBuildings(newBuildings)
  }

  const getTotalCounts = () => {
    const totalBuildings = buildings.length
    const totalFloors = buildings.reduce((sum, building) => sum + building.floors.length, 0)
    const totalUnits = buildings.reduce((sum, building) => 
      sum + building.floors.reduce((floorSum, floor) => floorSum + floor.units.length, 0), 0)
    
    return { totalBuildings, totalFloors, totalUnits }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const payload = {
        project: projectData,
        buildings: buildings
      }

      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el proyecto')
      }

      setSuccessMessage(`Proyecto "${data.project.name}" creado exitosamente con ${data.stats.constructionActivities} partidas de construcción a nivel del proyecto`)
      
      // Redirect to projects page after 2 seconds
      setTimeout(() => {
        router.push('/projects')
      }, 2000)

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      return projectData.name.trim() && projectData.startDate
    }
    if (currentStep === 2) {
      return buildings.every(building => building.name.trim())
    }
    if (currentStep === 3) {
      return buildings.every(building => 
        building.floors.every(floor => 
          floor.name.trim() && floor.units.every(unit => unit.name.trim())
        )
      )
    }
    return true
  }

  // Success screen
  if (successMessage) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <Icon name="check-circle" size="lg" className="text-green-600 mx-auto mb-4" />
          <Typography variant="h2" className="text-green-800 mb-4">
            ¡Proyecto Creado Exitosamente!
          </Typography>
          <Typography variant="body-default" className="text-green-700 mb-6">
            {successMessage}
          </Typography>
          <Typography variant="body-small" className="text-green-600">
            Redirigiendo a la lista de proyectos...
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h1" className="mb-2">
          Crear Nuevo Proyecto
        </Typography>
        <Typography variant="body-default" color="muted">
          Complete la información del proyecto en {currentStep === 4 ? '4' : '4'} pasos
        </Typography>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step < currentStep ? (
                  <Icon name="check" size="sm" />
                ) : (
                  step
                )}
              </div>
              {step < 4 && (
                <div className={`w-12 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Detalles</span>
          <span>Edificios</span>
          <span>Unidades</span>
          <span>Revisar</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Step 1: Project Details */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <Typography variant="h3" className="mb-4">
            Información del Proyecto
          </Typography>

          <FormField
            name="name"
            label="Nombre del Proyecto"
            type="text"
            required
            value={projectData.name}
            onChange={(value) => setProjectData(prev => ({ ...prev, name: value }))}
            placeholder="Ej: Condominio Las Flores"
            helperText="Nombre identificatorio único del proyecto"
          />

          <FormField
            name="description"
            label="Descripción"
            type="text"
            value={projectData.description}
            onChange={(value) => setProjectData(prev => ({ ...prev, description: value }))}
            placeholder="Descripción del proyecto..."
            helperText="Descripción opcional del proyecto"
          />

          <FormField
            name="projectType"
            label="Tipo de Proyecto"
            type="select"
            required
            options={projectTypeOptions}
            value={projectData.projectType}
            onChange={(value) => setProjectData(prev => ({ ...prev, projectType: value as any }))}
            helperText="Seleccione el tipo de proyecto"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="startDate"
              label="Fecha de Inicio"
              type="date"
              required
              value={projectData.startDate}
              onChange={(value) => setProjectData(prev => ({ ...prev, startDate: value }))}
              helperText="Fecha de inicio planificada"
            />

            <FormField
              name="endDate"
              label="Fecha de Término"
              type="date"
              value={projectData.endDate}
              onChange={(value) => setProjectData(prev => ({ ...prev, endDate: value }))}
              helperText="Fecha de término estimada (opcional)"
            />
          </div>
        </div>
      )}

      {/* Step 2: Buildings Configuration */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <Typography variant="h3" className="mb-4">
            Configuración de Edificios
          </Typography>

          <FormField
            name="numBuildings"
            label="Número de Edificios"
            type="number"
            required
            value={numBuildings.toString()}
            onChange={(value) => handleBuildingCountChange(parseInt(value) || 1)}
            helperText="Cantidad de edificios del proyecto (1-50)"
            min="1"
            max="50"
          />

          <div className="space-y-4">
            {buildings.map((building, buildingIndex) => (
              <div key={buildingIndex} className="border border-gray-200 rounded-lg p-4">
                <Typography variant="h5" className="mb-3">
                  Edificio {buildingIndex + 1}
                </Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name={`building-${buildingIndex}-name`}
                    label="Nombre del Edificio"
                    type="text"
                    required
                    value={building.name}
                    onChange={(value) => updateBuilding(buildingIndex, { name: value })}
                    placeholder="Ej: Torre A, Edificio Principal"
                  />

                  <FormField
                    name={`building-${buildingIndex}-floors`}
                    label="Número de Pisos"
                    type="number"
                    required
                    value={building.floors.length.toString()}
                    onChange={(value) => {
                      const floorCount = parseInt(value) || 1
                      const newFloors = [...building.floors]
                      
                      if (floorCount > building.floors.length) {
                        for (let i = building.floors.length; i < floorCount; i++) {
                          newFloors.push({
                            name: `Piso ${i + 1}`,
                            units: [{ name: 'Unidad 1', unitType: 'apartment' }]
                          })
                        }
                      } else {
                        newFloors.splice(floorCount)
                      }
                      
                      updateBuilding(buildingIndex, { floors: newFloors })
                    }}
                    min="1"
                    max="100"
                    helperText="Pisos del edificio (1-100)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Units Configuration */}
      {currentStep === 3 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <Typography variant="h3" className="mb-4">
            Configuración de Unidades
          </Typography>

          <div className="space-y-6">
            {buildings.map((building, buildingIndex) => (
              <div key={buildingIndex} className="border border-gray-200 rounded-lg p-4">
                <Typography variant="h5" className="mb-4">
                  {building.name}
                </Typography>
                
                <div className="space-y-4">
                  {building.floors.map((floor, floorIndex) => (
                    <div key={floorIndex} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <Typography variant="h6">
                          {floor.name}
                        </Typography>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addUnit(buildingIndex, floorIndex)}
                          >
                            <Icon name="plus" size="xs" />
                            Agregar Unidad
                          </Button>
                          {building.floors.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFloor(buildingIndex, floorIndex)}
                            >
                              <Icon name="trash" size="xs" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {floor.units.map((unit, unitIndex) => (
                          <div key={unitIndex} className="border border-gray-200 rounded p-3 bg-white">
                            <div className="flex items-center justify-between mb-2">
                              <Typography variant="body-small" className="font-medium">
                                Unidad {unitIndex + 1}
                              </Typography>
                              {floor.units.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeUnit(buildingIndex, floorIndex, unitIndex)}
                                >
                                  <Icon name="x" size="xs" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <FormField
                                name={`unit-${buildingIndex}-${floorIndex}-${unitIndex}-name`}
                                label="Nombre"
                                type="text"
                                required
                                size="sm"
                                value={unit.name}
                                onChange={(value) => updateUnit(buildingIndex, floorIndex, unitIndex, { name: value })}
                                placeholder="Ej: 101, EA-1"
                              />
                              
                              <FormField
                                name={`unit-${buildingIndex}-${floorIndex}-${unitIndex}-type`}
                                label="Tipo"
                                type="select"
                                size="sm"
                                options={unitTypeOptions}
                                value={unit.unitType}
                                onChange={(value) => updateUnit(buildingIndex, floorIndex, unitIndex, { unitType: value })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addFloor(buildingIndex)}
                  >
                    <Icon name="plus" size="xs" />
                    Agregar Piso
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Review & Confirm */}
      {currentStep === 4 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <Typography variant="h3" className="mb-4">
            Revisar y Confirmar
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Summary */}
            <div className="space-y-4">
              <Typography variant="h5">Información del Proyecto</Typography>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div><strong>Nombre:</strong> {projectData.name}</div>
                {projectData.description && (
                  <div><strong>Descripción:</strong> {projectData.description}</div>
                )}
                <div><strong>Tipo:</strong> {projectTypeOptions.find(opt => opt.value === projectData.projectType)?.label}</div>
                <div><strong>Inicio:</strong> {projectData.startDate}</div>
                {projectData.endDate && (
                  <div><strong>Término:</strong> {projectData.endDate}</div>
                )}
              </div>
            </div>

            {/* Structure Summary */}
            <div className="space-y-4">
              <Typography variant="h5">Estructura del Proyecto</Typography>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div><strong>Edificios:</strong> {getTotalCounts().totalBuildings}</div>
                <div><strong>Pisos:</strong> {getTotalCounts().totalFloors}</div>
                <div><strong>Unidades:</strong> {getTotalCounts().totalUnits}</div>
                <div><strong>Actividades de Construcción:</strong> 40 partidas por proyecto</div>
              </div>
            </div>
          </div>

          {/* Building Details */}
          <div className="space-y-4">
            <Typography variant="h5">Detalle de Edificios</Typography>
            {buildings.map((building, buildingIndex) => (
              <div key={buildingIndex} className="border border-gray-200 rounded-lg p-4">
                <Typography variant="h6" className="mb-2">{building.name}</Typography>
                <div className="text-sm text-gray-600 space-y-1">
                  {building.floors.map((floor, floorIndex) => (
                    <div key={floorIndex}>
                      <strong>{floor.name}:</strong> {floor.units.map(unit => unit.name).join(', ')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Icon name="alert-triangle" size="sm" className="text-yellow-600 mt-0.5" />
              <div>
                <Typography variant="body-small" className="font-medium text-yellow-800">
                  Importante
                </Typography>
                <Typography variant="body-small" className="text-yellow-700">
                  Se crearán automáticamente 40 partidas de construcción a nivel del proyecto. 
                  Los registros de trabajo (WorkRecords) vincularán estas actividades a unidades específicas cuando se asigne el trabajo.
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => {
            if (currentStep === 1) {
              router.push('/projects')
            } else {
              setCurrentStep(prev => prev - 1)
            }
          }}
          disabled={loading}
        >
          {currentStep === 1 ? 'Cancelar' : 'Anterior'}
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            if (currentStep === 4) {
              handleSubmit()
            } else {
              setCurrentStep(prev => prev + 1)
            }
          }}
          disabled={!canProceedToNextStep() || loading}
        >
          {loading ? (
            <>
              <Icon name="loader" size="sm" className="animate-spin mr-2" />
              Creando...
            </>
          ) : currentStep === 4 ? (
            'Crear Proyecto'
          ) : (
            'Siguiente'
          )}
        </Button>
      </div>
    </div>
  )
}