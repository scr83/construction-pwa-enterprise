'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Unit {
  id: string
  name: string
  floorName: string
  buildingName: string
  projectId: string
  completed: boolean
}

export default function WeeklyProgressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [units, setUnits] = useState<Unit[]>([])
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(1)

  useEffect(() => {
    // Check if user is site manager
    if (status === 'authenticated' && session?.user?.role !== 'SITE_MANAGER') {
      router.push('/dashboard')
      return
    }

    if (status === 'authenticated') {
      fetchUnits()
    }
  }, [status, session, router])

  const fetchUnits = async () => {
    try {
      // For now, use mock data since we don't have the full API yet
      // In production, this would fetch from /api/units?userId={session.user.id}
      const mockUnits: Unit[] = [
        { id: 'unit-1', name: 'EA-1', floorName: 'Piso 1', buildingName: 'Edificio A', projectId: 'proj-1', completed: false },
        { id: 'unit-2', name: 'EA-2', floorName: 'Piso 1', buildingName: 'Edificio A', projectId: 'proj-1', completed: false },
        { id: 'unit-3', name: 'EA-3', floorName: 'Piso 1', buildingName: 'Edificio A', projectId: 'proj-1', completed: false },
        { id: 'unit-4', name: 'EA-4', floorName: 'Piso 2', buildingName: 'Edificio A', projectId: 'proj-1', completed: false },
        { id: 'unit-5', name: 'EA-5', floorName: 'Piso 2', buildingName: 'Edificio A', projectId: 'proj-1', completed: false },
      ]
      setUnits(mockUnits)
    } catch (err) {
      setError('Error cargando unidades')
    } finally {
      setLoading(false)
    }
  }

  const toggleUnit = (unitId: string) => {
    const newSelected = new Set(selectedUnits)
    if (newSelected.has(unitId)) {
      newSelected.delete(unitId)
    } else {
      newSelected.add(unitId)
    }
    setSelectedUnits(newSelected)
  }

  const handleSubmit = async () => {
    if (selectedUnits.size === 0) {
      setError('Selecciona al menos una unidad')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/weekly-progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitIds: Array.from(selectedUnits),
          weekNumber: currentWeek,
        }),
      })

      if (!res.ok) {
        throw new Error('Error actualizando progreso')
      }

      setSuccess(true)
      setSelectedUnits(new Set())
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
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

  const groupedUnits = units.reduce((acc, unit) => {
    const key = `${unit.buildingName} - ${unit.floorName}`
    if (!acc[key]) acc[key] = []
    acc[key].push(unit)
    return acc
  }, {} as Record<string, Unit[]>)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Registro Semanal de Avance</h1>
        <p className="text-gray-600">
          Marca las unidades completadas esta semana
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          ✓ Progreso semanal registrado exitosamente
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Semana
            </label>
            <input
              type="number"
              min="1"
              value={currentWeek}
              onChange={(e) => setCurrentWeek(parseInt(e.target.value) || 1)}
              className="px-3 py-2 border border-gray-300 rounded-lg w-24"
            />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Seleccionadas</div>
            <div className="text-2xl font-bold text-blue-600">
              {selectedUnits.size} / {units.length}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedUnits).map(([groupName, groupUnits]) => (
            <div key={groupName}>
              <h3 className="font-semibold text-lg mb-3 text-gray-700">
                {groupName}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {groupUnits.map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => toggleUnit(unit.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedUnits.has(unit.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{unit.name}</div>
                    {selectedUnits.has(unit.id) && (
                      <div className="text-sm mt-1">✓ Completada</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setSelectedUnits(new Set())}
          disabled={submitting || selectedUnits.size === 0}
          className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Limpiar Selección
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || selectedUnits.size === 0}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {submitting ? 'Guardando...' : 'Registrar Avance'}
        </button>
      </div>
    </div>
  )
}
