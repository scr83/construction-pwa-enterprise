'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'
import { Card } from '@/components/atoms/Card'
import { SearchBar } from '@/components/molecules/SearchBar'
import { StatusCard } from '@/components/molecules/StatusCard'
import { useSearchParams } from 'next/navigation'

// Tipos para gestión de materiales de construcción
export type MaterialStatus = 'disponible' | 'en_transito' | 'solicitado' | 'agotado' | 'reservado'
export type MaterialCategory = 'hormigon_acero' | 'instalaciones' | 'acabados' | 'herramientas' | 'equipos' | 'otros'
export type MaterialUnit = 'kg' | 'ton' | 'm3' | 'm2' | 'm' | 'un' | 'gl' | 'saco' | 'caja' | 'rollo'

export interface MaterialComponent {
  name: string
  quantity: number
  unit: MaterialUnit
  delivered: boolean
  notes?: string
}

export interface MaterialKit {
  id: string
  name: string
  category: MaterialCategory
  building: string
  unit: string
  status: MaterialStatus
  requestedBy: string
  deliveryDate: string
  requestDate: string
  components: MaterialComponent[]
  estimatedCost?: number
  actualCost?: number
  supplier?: string
  priority: 'baja' | 'media' | 'alta' | 'urgente'
  notes?: string
  photos?: string[]
  approvedBy?: string
  receivedBy?: string
  createdAt: string
  updatedAt: string
}

export interface MaterialsManagementProps {
  usuario: {
    id: string
    nombre: string
    rol: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
    permisos: string[]
    proyectosAsignados: string[]
  }
  materiales: MaterialKit[]
  onMaterialRequest?: (material: Partial<MaterialKit>) => void
  onMaterialUpdate?: (id: string, updates: Partial<MaterialKit>) => void
  onMaterialDelivery?: (id: string) => void
}

// Componente de tarjeta de material
const MaterialCard: React.FC<{
  material: MaterialKit
  onClick: () => void
  userRole: string
}> = ({ material, onClick, userRole }) => {
  const getStatusColor = (status: MaterialStatus) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800'
      case 'en_transito': return 'bg-blue-100 text-blue-800'
      case 'solicitado': return 'bg-yellow-100 text-yellow-800'
      case 'agotado': return 'bg-red-100 text-red-800'
      case 'reservado': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: MaterialStatus) => {
    switch (status) {
      case 'disponible': return 'Disponible en Bodega'
      case 'en_transito': return 'En Tránsito'
      case 'solicitado': return 'Solicitado'
      case 'agotado': return 'Agotado'
      case 'reservado': return 'Reservado'
      default: return status
    }
  }

  const getCategoryLabel = (category: MaterialCategory) => {
    switch (category) {
      case 'hormigon_acero': return 'Hormigón y Acero'
      case 'instalaciones': return 'Instalaciones'
      case 'acabados': return 'Acabados'
      case 'herramientas': return 'Herramientas'
      case 'equipos': return 'Equipos'
      case 'otros': return 'Otros'
      default: return category
    }
  }

  const completedComponents = material.components.filter(c => c.delivered).length
  const totalComponents = material.components.length
  const completionPercentage = totalComponents > 0 ? Math.round((completedComponents / totalComponents) * 100) : 0

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Typography variant="body-default" className="font-semibold mb-1">
            {material.name}
          </Typography>
          <Typography variant="body-small" color="muted">
            {getCategoryLabel(material.category)} • {material.building} - {material.unit}
          </Typography>
        </div>
        <Badge className={getStatusColor(material.status)} size="sm">
          {getStatusLabel(material.status)}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon name="user" size="xs" className="text-gray-400" />
          <Typography variant="body-small" color="muted">
            Solicitado por: {material.requestedBy}
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Icon name="calendar" size="xs" className="text-gray-400" />
          <Typography variant="body-small" color="muted">
            Entrega: {new Date(material.deliveryDate).toLocaleDateString('es-CL')}
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Icon name="package" size="xs" className="text-gray-400" />
          <Typography variant="body-small" color="muted">
            Componentes: {completedComponents}/{totalComponents} ({completionPercentage}%)
          </Typography>
        </div>

        {material.supplier && (
          <div className="flex items-center gap-2">
            <Icon name="truck" size="xs" className="text-gray-400" />
            <Typography variant="body-small" color="muted">
              Proveedor: {material.supplier}
            </Typography>
          </div>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <Typography variant="caption" color="muted">
            Progreso de entrega
          </Typography>
          <Typography variant="caption" color="muted">
            {completionPercentage}%
          </Typography>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {material.estimatedCost && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Icon name="dollar-sign" size="xs" className="text-gray-400" />
            <Typography variant="caption" color="muted">
              Costo estimado: ${material.estimatedCost.toLocaleString('es-CL')}
            </Typography>
          </div>
          
          {material.photos && material.photos.length > 0 && (
            <div className="flex items-center gap-1">
              <Icon name="camera" size="xs" className="text-gray-400" />
              <Typography variant="caption" color="muted">
                {material.photos.length} fotos
              </Typography>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export function MaterialsManagement({
  usuario,
  materiales,
  onMaterialRequest,
  onMaterialUpdate,
  onMaterialDelivery
}: MaterialsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<MaterialStatus | 'todos'>('todos')
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'todas'>('todas')
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialKit | null>(null)
  
  
  const searchParams = useSearchParams()
  const currentRole = searchParams.get('role') || usuario?.rol || 'jefe_terreno'

  // Estadísticas de materiales - with defensive coding
  const materialStats = useMemo(() => {
    if (!materiales || !Array.isArray(materiales)) {
      return { total: 0, disponibles: 0, enTransito: 0, solicitados: 0, agotados: 0, valorTotal: 0 }
    }
    
    const total = materiales.length
    const disponibles = materiales.filter(m => m?.status === 'disponible').length
    const enTransito = materiales.filter(m => m?.status === 'en_transito').length
    const solicitados = materiales.filter(m => m?.status === 'solicitado').length
    const agotados = materiales.filter(m => m?.status === 'agotado').length
    
    // Calcular valor total
    const valorTotal = materiales.reduce((sum, m) => sum + (m?.actualCost || m?.estimatedCost || 0), 0)

    return { total, disponibles, enTransito, solicitados, agotados, valorTotal }
  }, [materiales])

  // Filtros de materiales - with defensive coding
  const filteredMaterials = useMemo(() => {
    if (!materiales || !Array.isArray(materiales)) {
      return []
    }
    
    return materiales.filter(material => {
      if (!material) return false
      
      const matchesSearch = (material.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (material.building || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (material.requestedBy || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (material.supplier || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = selectedStatus === 'todos' || material.status === selectedStatus
      const matchesCategory = selectedCategory === 'todas' || material.category === selectedCategory

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [materiales, searchTerm, selectedStatus, selectedCategory])

  // Permisos basados en rol - Add defensive checks
  const canRequestMaterials = (usuario?.permisos && Array.isArray(usuario.permisos) && usuario.permisos.includes('solicitar_materiales')) || 
                             ['gerencia', 'jefe_terreno', 'bodega', 'oficina_tecnica'].includes(currentRole)
  
  const canManageMaterials = (usuario?.permisos && Array.isArray(usuario.permisos) && usuario.permisos.includes('gestionar_materiales')) || 
                           ['gerencia', 'bodega'].includes(currentRole)

  const canApproveMaterials = (usuario?.permisos && Array.isArray(usuario.permisos) && usuario.permisos.includes('aprobar_materiales')) || 
                            ['gerencia', 'oficina_tecnica'].includes(currentRole)

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography variant="h3" className="font-bold text-gray-900">
            Gestión de Materiales
          </Typography>
          <Typography variant="body-default" color="muted">
            Administra inventario, kits y entregas de materiales de construcción
          </Typography>
        </div>

        <div className="flex gap-2">
          {canRequestMaterials && (
            <Button
              variant="outline"
              leftIcon={<Icon name="plus" size="sm" />}
              onClick={() => onMaterialRequest?.({ 
                requestedBy: usuario.nombre,
                status: 'solicitado',
                priority: 'media'
              })}
            >
              Solicitar Kit
            </Button>
          )}
          
          {canManageMaterials && (
            <Button
              variant="primary"
              leftIcon={<Icon name="plus" size="sm" />}
              onClick={() => onMaterialRequest?.({})}
            >
              Nuevo Material
            </Button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatusCard
          title="Total Kits"
          value={materialStats.total.toString()}
          variant="default"
          icon="package"
        />
        <StatusCard
          title="Disponibles"
          value={materialStats.disponibles.toString()}
          variant="success"
          icon="package-check"
        />
        <StatusCard
          title="En Tránsito"
          value={materialStats.enTransito.toString()}
          variant="info"
          icon="truck"
        />
        <StatusCard
          title="Solicitados"
          value={materialStats.solicitados.toString()}
          variant="warning"
          icon="search"
        />
        <StatusCard
          title="Valor Total"
          value={`$${(materialStats.valorTotal / 1000000).toFixed(1)}M`}
          variant="default"
          icon="dollar-sign"
        />
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Buscar por material, edificio, solicitante o proveedor..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as MaterialStatus | 'todos')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="en_transito">En Tránsito</option>
            <option value="solicitado">Solicitado</option>
            <option value="reservado">Reservado</option>
            <option value="agotado">Agotado</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as MaterialCategory | 'todas')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todas">Todas las categorías</option>
            <option value="hormigon_acero">Hormigón y Acero</option>
            <option value="instalaciones">Instalaciones</option>
            <option value="acabados">Acabados</option>
            <option value="herramientas">Herramientas</option>
            <option value="equipos">Equipos</option>
            <option value="otros">Otros</option>
          </select>
        </div>
      </div>

      {/* Lista de materiales */}
      <div className="space-y-4">
        {filteredMaterials.length === 0 ? (
          <Card className="p-8 text-center">
            <Icon name="package" size="lg" className="text-gray-400 mx-auto mb-4" />
            <Typography variant="body-default" color="muted">
              {searchTerm || selectedStatus !== 'todos' || selectedCategory !== 'todas'
                ? 'No se encontraron materiales con los filtros aplicados'
                : 'No hay materiales registrados'}
            </Typography>
            {canRequestMaterials && (
              <Button
                variant="outline"
                className="mt-4"
                leftIcon={<Icon name="plus" size="sm" />}
                onClick={() => onMaterialRequest?.({})}
              >
                Solicitar primer material
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                userRole={currentRole}
                onClick={() => setSelectedMaterial(material)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle de material */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Typography variant="h4" className="font-bold mb-1">
                    {selectedMaterial.name}
                  </Typography>
                  <Typography variant="body-default" color="muted">
                    {selectedMaterial.building} - {selectedMaterial.unit}
                  </Typography>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMaterial(null)}
                >
                  <Icon name="x" size="sm" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Typography variant="label-default" className="mb-1">
                      Estado
                    </Typography>
                    <Badge className={getStatusColor(selectedMaterial.status)} size="sm">
                      {getStatusLabel(selectedMaterial.status)}
                    </Badge>
                  </div>
                  <div>
                    <Typography variant="label-default" className="mb-1">
                      Solicitado por
                    </Typography>
                    <Typography variant="body-default">
                      {selectedMaterial.requestedBy}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="label-default" className="mb-1">
                      Fecha de entrega
                    </Typography>
                    <Typography variant="body-default">
                      {new Date(selectedMaterial.deliveryDate).toLocaleDateString('es-CL')}
                    </Typography>
                  </div>
                </div>

                {/* Componentes del kit */}
                <div>
                  <Typography variant="label-default" className="mb-3">
                    Componentes del Kit
                  </Typography>
                  <div className="space-y-2">
                    {selectedMaterial.components.map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon 
                            name={component.delivered ? "check-circle" : "circle"} 
                            size="sm" 
                            className={component.delivered ? "text-green-600" : "text-gray-400"}
                          />
                          <div>
                            <Typography variant="body-default" className={component.delivered ? "line-through text-gray-500" : ""}>
                              {component.name}
                            </Typography>
                            {component.notes && (
                              <Typography variant="body-small" color="muted">
                                {component.notes}
                              </Typography>
                            )}
                          </div>
                        </div>
                        <Typography variant="body-default" className="font-semibold">
                          {component.quantity} {component.unit}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Costos */}
                {(selectedMaterial.estimatedCost || selectedMaterial.actualCost) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedMaterial.estimatedCost && (
                      <div>
                        <Typography variant="label-default" className="mb-1">
                          Costo Estimado
                        </Typography>
                        <Typography variant="body-default">
                          ${selectedMaterial.estimatedCost.toLocaleString('es-CL')} CLP
                        </Typography>
                      </div>
                    )}
                    {selectedMaterial.actualCost && (
                      <div>
                        <Typography variant="label-default" className="mb-1">
                          Costo Real
                        </Typography>
                        <Typography variant="body-default">
                          ${selectedMaterial.actualCost.toLocaleString('es-CL')} CLP
                        </Typography>
                      </div>
                    )}
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t">
                  {canManageMaterials && (
                    <Button variant="primary" size="sm">
                      Editar Material
                    </Button>
                  )}
                  {selectedMaterial.status === 'en_transito' && canManageMaterials && (
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => onMaterialDelivery?.(selectedMaterial.id)}
                    >
                      Marcar como Entregado
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Ver Fotos
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedMaterial(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )

  function getStatusColor(status: MaterialStatus) {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800'
      case 'en_transito': return 'bg-blue-100 text-blue-800'
      case 'solicitado': return 'bg-yellow-100 text-yellow-800'
      case 'agotado': return 'bg-red-100 text-red-800'
      case 'reservado': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  function getStatusLabel(status: MaterialStatus) {
    switch (status) {
      case 'disponible': return 'Disponible en Bodega'
      case 'en_transito': return 'En Tránsito'
      case 'solicitado': return 'Solicitado'
      case 'agotado': return 'Agotado'
      case 'reservado': return 'Reservado'
      default: return status
    }
  }
}