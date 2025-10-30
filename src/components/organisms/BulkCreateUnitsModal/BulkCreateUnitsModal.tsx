'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'

interface UnitPattern {
  position: number
  name: string
  unitType: string
}

export function BulkCreateUnitsModal({
  floorId,
  buildingName,
  floorNumber,
  onClose,
  onSuccess
}: {
  floorId: string
  buildingName: string
  floorNumber: number | string
  onClose: () => void
  onSuccess: () => void
}) {
  const [prefix, setPrefix] = useState('EA-')
  const [unitPattern, setUnitPattern] = useState<UnitPattern[]>([
    { position: 1, name: '01', unitType: 'Tipo A' }
  ])
  const [previewUnits, setPreviewUnits] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generatePreview = () => {
    const units: string[] = []
    // Extract floor number from floorNumber (could be "Piso 1" or just "1")
    const floorNum = typeof floorNumber === 'string' 
      ? floorNumber.match(/\d+/)?.[0] || '1'
      : floorNumber
    
    unitPattern.forEach(pattern => {
      const unitCode = `${prefix}${floorNum}${pattern.name}`
      units.push(unitCode)
    })
    setPreviewUnits(units)
  }

  useEffect(() => {
    generatePreview()
  }, [prefix, floorNumber, unitPattern])

  const handleAddPatternUnit = () => {
    setUnitPattern([
      ...unitPattern,
      { 
        position: unitPattern.length + 1, 
        name: String(unitPattern.length + 1).padStart(2, '0'),
        unitType: 'Tipo A'
      }
    ])
  }

  const handleRemovePatternUnit = (index: number) => {
    setUnitPattern(unitPattern.filter((_, i) => i !== index))
  }

  const handleUpdatePattern = (index: number, field: keyof UnitPattern, value: string | number) => {
    const updated = [...unitPattern]
    updated[index] = { ...updated[index], [field]: value }
    setUnitPattern(updated)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      // Extract floor number for API
      const floorNum = typeof floorNumber === 'string' 
        ? parseInt(floorNumber.match(/\d+/)?.[0] || '1')
        : floorNumber
      
      const response = await fetch('/api/units/bulk-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floorId,
          prefix,
          startFloor: floorNum,
          endFloor: floorNum,
          pattern: unitPattern
        })
      })

      if (!response.ok) throw new Error('Error creating units')
      
      onSuccess()
    } catch (error) {
      console.error('Error creating units:', error)
      alert('Error al crear unidades')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h5" className="font-bold">
                Generar Unidades en Masa
              </Typography>
              <Typography variant="body-default" color="muted">
                {buildingName} - Piso {floorNumber}
              </Typography>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="x" size="sm" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Naming Pattern Section */}
          <div className="space-y-4">
            <Typography variant="h6" className="font-semibold">
              Patrón de Nomenclatura
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  label="Prefijo"
                  value={prefix}
                  onChange={setPrefix}
                  placeholder="EA-"
                  helpText="Ejemplo: EA-, Apt, Depto"
                />
              </div>
              
              <div>
                <FormField
                  label="Piso"
                  value={floorNumber.toString()}
                  disabled
                  helpText="Solo se crearán unidades en este piso"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Typography variant="body-small" className="text-blue-800">
                <strong>Ejemplo:</strong> Con prefijo "EA-" y patrón "01, 02":
                <br />
                Se generarán unidades como: EA-101, EA-102
              </Typography>
            </div>
          </div>

          {/* Unit Pattern Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Typography variant="h6" className="font-semibold">
                Distribución por Piso
              </Typography>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPatternUnit}
                leftIcon={<Icon name="plus" size="xs" />}
              >
                Agregar Unidad
              </Button>
            </div>

            <div className="space-y-3">
              {unitPattern.map((pattern, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-secondary-50 rounded-lg">
                  <Typography variant="body-default" className="font-medium w-24">
                    Unidad {pattern.position}:
                  </Typography>
                  
                  <div className="flex-1">
                    <FormField
                      label="Sufijo"
                      value={pattern.name}
                      onChange={(val) => handleUpdatePattern(index, 'name', val)}
                      placeholder="01"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <FormField
                      label="Tipo"
                      value={pattern.unitType}
                      onChange={(val) => handleUpdatePattern(index, 'unitType', val)}
                      placeholder="Tipo A, Tipo B, etc."
                    />
                  </div>
                  
                  {unitPattern.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePatternUnit(index)}
                    >
                      <Icon name="trash" size="xs" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Typography variant="h6" className="font-semibold">
                Vista Previa
              </Typography>
              <Button
                variant="outline"
                size="sm"
                onClick={generatePreview}
              >
                Actualizar Vista Previa
              </Button>
            </div>

            {previewUnits.length > 0 && (
              <div className="p-4 bg-secondary-50 rounded-lg">
                <Typography variant="body-default" color="muted" className="mb-3">
                  Se crearán <strong>{previewUnits.length} unidades</strong>:
                </Typography>
                
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {previewUnits.slice(0, 24).map((unit, index) => (
                    <div key={index} className="px-3 py-2 bg-white rounded border border-secondary-200 text-center">
                      <Typography variant="body-small" className="font-mono">
                        {unit}
                      </Typography>
                    </div>
                  ))}
                  {previewUnits.length > 24 && (
                    <div className="px-3 py-2 bg-primary-50 rounded border border-primary-200 text-center">
                      <Typography variant="body-small" className="text-primary-700">
                        +{previewUnits.length - 24} más
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-secondary-200 p-6 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || previewUnits.length === 0}
          >
            {isSubmitting ? 'Creando...' : `Crear ${previewUnits.length} Unidades`}
          </Button>
        </div>
      </div>
    </div>
  )
}