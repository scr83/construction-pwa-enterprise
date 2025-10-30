'use client'

import { useState } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'

export function CreateBuildingModal({
  projectId,
  onClose,
  onSuccess
}: {
  projectId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/buildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name
        })
      })

      if (!response.ok) throw new Error('Error creating building')
      
      onSuccess()
    } catch (error) {
      console.error('Error creating building:', error)
      alert('Error al crear edificio')
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
              Crear Nuevo Edificio
            </Typography>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="x" size="sm" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <FormField
            label="Nombre del Edificio"
            value={name}
            onChange={setName}
            placeholder="Ej: Edificio A, Torre Norte, Fase 1"
            required
            helpText="Este nombre aparecerá en la lista de edificios del proyecto"
          />
        </div>

        {/* Footer */}
        <div className="border-t border-secondary-200 p-6 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? 'Creando...' : 'Crear Edificio'}
          </Button>
        </div>
      </div>
    </div>
  )
}