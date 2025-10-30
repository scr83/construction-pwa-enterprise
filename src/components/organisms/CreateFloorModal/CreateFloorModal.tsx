'use client'

import { useState } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'

export function CreateFloorModal({
  buildingId,
  onClose,
  onSuccess
}: {
  buildingId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [floorNumber, setFloorNumber] = useState(1)
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/floors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildingId,
          floorNumber,
          name: name || undefined
        })
      })

      if (!response.ok) throw new Error('Error creating floor')
      
      onSuccess()
    } catch (error) {
      console.error('Error creating floor:', error)
      alert('Error al crear piso')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="border-b border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <Typography variant="h5" className="font-bold">
              Crear Nuevo Piso
            </Typography>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="x" size="sm" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <FormField
            label="Número de Piso"
            type="number"
            value={floorNumber.toString()}
            onChange={(val) => setFloorNumber(parseInt(val) || 1)}
            placeholder="1"
            min={1}
            required
          />
          
          <FormField
            label="Nombre del Piso (opcional)"
            value={name}
            onChange={setName}
            placeholder="Ej: Planta Baja, Primer Piso, Mezanine"
          />

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Typography variant="body-small" className="text-blue-800">
              <strong>Ejemplo:</strong> Piso 1 se mostrará como "Piso 1"
              {name && ` - ${name}`}
            </Typography>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-secondary-200 p-6 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || floorNumber < 1}
          >
            {isSubmitting ? 'Creando...' : 'Crear Piso'}
          </Button>
        </div>
      </div>
    </div>
  )
}