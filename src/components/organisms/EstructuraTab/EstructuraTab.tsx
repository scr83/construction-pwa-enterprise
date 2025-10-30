'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { BulkCreateUnitsModal } from '@/components/organisms/BulkCreateUnitsModal'
import { CreateBuildingModal } from '@/components/organisms/CreateBuildingModal'
import { CreateFloorModal } from '@/components/organisms/CreateFloorModal'

interface Building {
  id: string
  name: string
  floors: Floor[]
}

interface Floor {
  id: string
  name: string // e.g., "Piso 1", "Planta Baja"
  units: Unit[]
}

interface Unit {
  id: string
  name: string // This serves as both code and name in current schema
  unitType?: string
}

export function EstructuraTab({ project, onUpdate }: { project: any; onUpdate: () => void }) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [showBuildingModal, setShowBuildingModal] = useState(false)
  const [showFloorModal, setShowFloorModal] = useState(false)
  const [showBulkUnitsModal, setShowBulkUnitsModal] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (project?.buildings) {
      setBuildings(project.buildings)
    }
  }, [project])

  const handleAddFloor = (building: Building) => {
    setSelectedBuilding(building)
    setShowFloorModal(true)
  }

  const handleBulkCreateUnits = (building: Building, floor: Floor) => {
    setSelectedBuilding(building)
    setSelectedFloor(floor)
    setShowBulkUnitsModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Building Button */}
      <div className="flex items-center justify-between">
        <Typography variant="h5" className="font-bold">
          Estructura del Proyecto
        </Typography>
        <Button 
          variant="primary"
          onClick={() => setShowBuildingModal(true)}
          leftIcon={<Icon name="plus" size="sm" />}
        >
          Agregar Edificio
        </Button>
      </div>

      {/* Buildings List */}
      {buildings.length === 0 ? (
        <div className="bg-secondary-50 rounded-lg p-8 text-center">
          <Icon name="building" size="lg" className="mx-auto mb-3 text-secondary-400" />
          <Typography variant="body-large" color="muted" className="mb-2">
            No hay edificios creados
          </Typography>
          <Typography variant="body-small" color="muted">
            Comienza agregando un edificio al proyecto
          </Typography>
        </div>
      ) : (
        buildings.map(building => (
          <BuildingCard 
            key={building.id}
            building={building}
            onAddFloor={() => handleAddFloor(building)}
            onBulkCreateUnits={(floor) => handleBulkCreateUnits(building, floor)}
          />
        ))
      )}

      {/* Modals */}
      {showBuildingModal && (
        <CreateBuildingModal
          projectId={project.id}
          onClose={() => setShowBuildingModal(false)}
          onSuccess={() => {
            setShowBuildingModal(false)
            onUpdate()
          }}
        />
      )}

      {showFloorModal && selectedBuilding && (
        <CreateFloorModal
          buildingId={selectedBuilding.id}
          onClose={() => setShowFloorModal(false)}
          onSuccess={() => {
            setShowFloorModal(false)
            onUpdate()
          }}
        />
      )}

      {showBulkUnitsModal && selectedFloor && selectedBuilding && (
        <BulkCreateUnitsModal
          floorId={selectedFloor.id}
          buildingName={selectedBuilding.name}
          floorNumber={selectedFloor.name}
          onClose={() => setShowBulkUnitsModal(false)}
          onSuccess={() => {
            setShowBulkUnitsModal(false)
            onUpdate()
          }}
        />
      )}
    </div>
  )
}

function BuildingCard({ 
  building, 
  onAddFloor, 
  onBulkCreateUnits 
}: { 
  building: Building
  onAddFloor: () => void
  onBulkCreateUnits: (floor: Floor) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const totalUnits = building.floors.reduce((sum, floor) => sum + floor.units.length, 0)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon name="building" size="md" className="text-primary-600" />
          <div>
            <Typography variant="h6" className="font-bold">
              {building.name}
            </Typography>
            <Typography variant="body-small" color="muted">
              {building.floors.length} pisos • {totalUnits} unidades
            </Typography>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddFloor}
            leftIcon={<Icon name="plus" size="sm" />}
          >
            Agregar Piso
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            leftIcon={<Icon name={isExpanded ? "chevron-up" : "chevron-down"} size="sm" />}
          >
            {isExpanded ? 'Contraer' : 'Expandir'}
          </Button>
        </div>
      </div>


      {isExpanded && (
        <div className="space-y-4 mt-4 border-t border-secondary-200 pt-4">
          {building.floors.length === 0 ? (
            <div className="text-center py-8 bg-secondary-50 rounded-lg">
              <Typography variant="body-default" color="muted">
                No hay pisos en este edificio
              </Typography>
            </div>
          ) : (
            building.floors.map(floor => (
              <FloorCard
                key={floor.id}
                floor={floor}
                buildingName={building.name}
                onBulkCreateUnits={() => onBulkCreateUnits(floor)}
              />
            ))
          )}
        </div>
      )}
    </Card>
  )
}

function FloorCard({ 
  floor, 
  buildingName, 
  onBulkCreateUnits 
}: { 
  floor: Floor
  buildingName: string
  onBulkCreateUnits: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white border border-secondary-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon name="layers" size="sm" className="text-blue-600" />
          <div>
            <Typography variant="body-large" className="font-semibold">
              {floor.name}
            </Typography>
            <Typography variant="body-small" color="muted">
              {floor.units.length} unidades
            </Typography>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkCreateUnits}
            leftIcon={<Icon name="copy" size="xs" />}
          >
            Generar Unidades
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            leftIcon={<Icon name={isExpanded ? "chevron-up" : "chevron-down"} size="xs" />}
          >
            {isExpanded ? 'Ocultar' : 'Ver'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-secondary-100">
          {floor.units.length === 0 ? (
            <div className="text-center py-4 bg-secondary-50 rounded">
              <Typography variant="body-small" color="muted">
                No hay unidades en este piso
              </Typography>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {floor.units.map(unit => (
                <div
                  key={unit.id}
                  className="px-2 py-1 bg-green-50 border border-green-200 rounded text-center"
                >
                  <Typography variant="body-small" className="font-mono text-green-800">
                    {unit.name}
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}