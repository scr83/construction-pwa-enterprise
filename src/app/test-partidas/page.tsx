'use client'

import React, { useState } from 'react'
import { PartidasDropdown } from '@/components/molecules/PartidasDropdown'
import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/atoms/Card'

interface Partida {
  id: string
  name: string
  category: string
  sequence: number
  unit?: string
  description?: string
  budgetWeight?: number
}

export default function TestPartidasPage() {
  const [selectedPartidaId, setSelectedPartidaId] = useState<string>('')
  const [selectedPartida, setSelectedPartida] = useState<Partida | null>(null)

  const handlePartidasChange = (partidaId: string, partida: Partida) => {
    setSelectedPartidaId(partidaId)
    setSelectedPartida(partida)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <Typography variant="h1" className="mb-2">
            PartidasDropdown Component Demo
          </Typography>
          <Typography variant="body-default" color="muted">
            Test the new PartidasDropdown component that fetches partidas from the API
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Standard Dropdown */}
          <Card className="p-6">
            <Typography variant="h3" className="mb-4">
              Dropdown Estándar
            </Typography>
            <PartidasDropdown
              label="Seleccionar Partida"
              value={selectedPartidaId}
              onValueChange={handlePartidasChange}
              placeholder="Elegir actividad de construcción..."
              required
            />
          </Card>

          {/* Compact Version */}
          <Card className="p-6">
            <Typography variant="h3" className="mb-4">
              Versión Compacta
            </Typography>
            <PartidasDropdown
              size="sm"
              showCategory={false}
              showUnit={false}
              allowSearch={false}
              placeholder="Partida compacta..."
            />
          </Card>

          {/* Without Grouping */}
          <Card className="p-6">
            <Typography variant="h3" className="mb-4">
              Sin Agrupación por Categoría
            </Typography>
            <PartidasDropdown
              label="Partida"
              groupByCategory={false}
              placeholder="Lista simple..."
            />
          </Card>

          {/* With Error State */}
          <Card className="p-6">
            <Typography variant="h3" className="mb-4">
              Estado de Error
            </Typography>
            <PartidasDropdown
              label="Partida con Error"
              error="Este campo es obligatorio"
              placeholder="Partida con error..."
            />
          </Card>
        </div>

        {/* Selection Display */}
        {selectedPartida && (
          <Card className="p-6">
            <Typography variant="h3" className="mb-4">
              Partida Seleccionada
            </Typography>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Typography variant="body-default" className="font-semibold">
                  ID:
                </Typography>
                <Typography variant="body-default">{selectedPartida.id}</Typography>
              </div>
              <div className="flex gap-2">
                <Typography variant="body-default" className="font-semibold">
                  Secuencia:
                </Typography>
                <Typography variant="body-default">{selectedPartida.sequence}</Typography>
              </div>
              <div className="flex gap-2">
                <Typography variant="body-default" className="font-semibold">
                  Nombre:
                </Typography>
                <Typography variant="body-default">{selectedPartida.name}</Typography>
              </div>
              <div className="flex gap-2">
                <Typography variant="body-default" className="font-semibold">
                  Categoría:
                </Typography>
                <Typography variant="body-default">{selectedPartida.category}</Typography>
              </div>
              {selectedPartida.unit && (
                <div className="flex gap-2">
                  <Typography variant="body-default" className="font-semibold">
                    Unidad:
                  </Typography>
                  <Typography variant="body-default">{selectedPartida.unit}</Typography>
                </div>
              )}
              {selectedPartida.description && (
                <div className="flex gap-2">
                  <Typography variant="body-default" className="font-semibold">
                    Descripción:
                  </Typography>
                  <Typography variant="body-default">{selectedPartida.description}</Typography>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <Typography variant="h4" className="mb-3 text-blue-900">
            Instrucciones de Prueba
          </Typography>
          <div className="space-y-2">
            <Typography variant="body-default" className="text-blue-800">
              • El dropdown obtiene automáticamente las 40 partidas estándar desde /api/partidas
            </Typography>
            <Typography variant="body-default" className="text-blue-800">
              • Busca por nombre, categoría o número de secuencia
            </Typography>
            <Typography variant="body-default" className="text-blue-800">
              • Las partidas se agrupan por categoría (Fundaciones, Estructura, etc.)
            </Typography>
            <Typography variant="body-default" className="text-blue-800">
              • Optimizado para móvil con targets táctiles de 44px+
            </Typography>
            <Typography variant="body-default" className="text-blue-800">
              • Selecciona una partida para ver sus detalles abajo
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  )
}