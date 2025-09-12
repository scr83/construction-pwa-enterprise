'use client'

import { MaterialsManagement } from '@/components/pages/MaterialsManagement'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

// Mock data para demostración - Materiales de construcción auténticos
const mockUsuario = {
  id: 'user-1',
  nombre: 'María González',
  rol: 'bodega' as const,
  permisos: ['gestionar_materiales', 'solicitar_materiales', 'aprobar_entregas'],
  proyectosAsignados: ['proj-1']
}

const mockMateriales = [
  {
    id: 'mat-1',
    name: 'Kit Radier - EA-101',
    category: 'hormigon_acero' as const,
    building: 'Edificio A',
    unit: 'EA-101',
    status: 'disponible' as const,
    requestedBy: 'Juan Pérez',
    deliveryDate: '2025-09-15',
    requestDate: '2025-09-10',
    priority: 'alta' as const,
    estimatedCost: 1250000,
    actualCost: 1180000,
    supplier: 'CEMEX Chile',
    approvedBy: 'Patricia López',
    components: [
      { name: 'Cemento 42.5kg', quantity: 20, unit: 'saco' as const, delivered: true },
      { name: 'Fierro 8mm', quantity: 50, unit: 'm' as const, delivered: true },
      { name: 'Fierro 12mm', quantity: 30, unit: 'm' as const, delivered: true },
      { name: 'Gravilla', quantity: 2, unit: 'm3' as const, delivered: false, notes: 'Pendiente llegada' },
      { name: 'Arena', quantity: 1.5, unit: 'm3' as const, delivered: true },
      { name: 'Aditivo plastificante', quantity: 2, unit: 'gl' as const, delivered: true }
    ],
    notes: 'Kit completo para hormigonado de radier',
    photos: ['kit-radier-1.jpg', 'kit-radier-2.jpg'],
    createdAt: '2025-09-10T08:00:00Z',
    updatedAt: '2025-09-12T14:30:00Z'
  },
  {
    id: 'mat-2',
    name: 'Kit Instalaciones - EA-102',
    category: 'instalaciones' as const,
    building: 'Edificio A',
    unit: 'EA-102',
    status: 'en_transito' as const,
    requestedBy: 'Roberto Kim',
    deliveryDate: '2025-09-16',
    requestDate: '2025-09-11',
    priority: 'media' as const,
    estimatedCost: 850000,
    supplier: 'Sodimac Constructor',
    components: [
      { name: 'Tubería PVC 20mm', quantity: 25, unit: 'm' as const, delivered: false },
      { name: 'Tubería PVC 32mm', quantity: 15, unit: 'm' as const, delivered: false },
      { name: 'Codos PVC 20mm', quantity: 12, unit: 'un' as const, delivered: false },
      { name: 'Cajas octogonales', quantity: 8, unit: 'un' as const, delivered: false },
      { name: 'Cable THHN 12 AWG', quantity: 50, unit: 'm' as const, delivered: false },
      { name: 'Cable THHN 14 AWG', quantity: 30, unit: 'm' as const, delivered: false }
    ],
    notes: 'Material para instalaciones eléctricas y sanitarias',
    createdAt: '2025-09-11T10:15:00Z',
    updatedAt: '2025-09-11T10:15:00Z'
  },
  {
    id: 'mat-3',
    name: 'Kit Terminaciones - EA-103',
    category: 'acabados' as const,
    building: 'Edificio A',
    unit: 'EA-103',
    status: 'solicitado' as const,
    requestedBy: 'Felipe Soto',
    deliveryDate: '2025-09-20',
    requestDate: '2025-09-12',
    priority: 'baja' as const,
    estimatedCost: 680000,
    supplier: 'Easy Constructor',
    components: [
      { name: 'Cerámica baño 30x30', quantity: 15, unit: 'm2' as const, delivered: false },
      { name: 'Cerámica cocina 20x20', quantity: 8, unit: 'm2' as const, delivered: false },
      { name: 'Adhesivo cerámico', quantity: 4, unit: 'saco' as const, delivered: false },
      { name: 'Fragüe blanco', quantity: 2, unit: 'saco' as const, delivered: false },
      { name: 'Pintura látex blanca', quantity: 4, unit: 'gl' as const, delivered: false },
      { name: 'Rodillos y brochas', quantity: 1, unit: 'caja' as const, delivered: false }
    ],
    notes: 'Materiales para terminaciones interiores',
    createdAt: '2025-09-12T15:45:00Z',
    updatedAt: '2025-09-12T15:45:00Z'
  },
  {
    id: 'mat-4',
    name: 'Kit Herramientas Menor - Equipo A',
    category: 'herramientas' as const,
    building: 'Edificio A',
    unit: 'General',
    status: 'disponible' as const,
    requestedBy: 'Juan Pérez',
    deliveryDate: '2025-09-13',
    requestDate: '2025-09-12',
    priority: 'media' as const,
    estimatedCost: 320000,
    actualCost: 295000,
    supplier: 'Ferretería Los Andes',
    receivedBy: 'Pedro González',
    components: [
      { name: 'Martillo carpintero 16oz', quantity: 2, unit: 'un' as const, delivered: true },
      { name: 'Destornillador cruz grande', quantity: 3, unit: 'un' as const, delivered: true },
      { name: 'Destornillador plano grande', quantity: 3, unit: 'un' as const, delivered: true },
      { name: 'Alicate universal 8"', quantity: 2, unit: 'un' as const, delivered: true },
      { name: 'Nivel aluminio 60cm', quantity: 1, unit: 'un' as const, delivered: true },
      { name: 'Flexómetro 5m', quantity: 2, unit: 'un' as const, delivered: true },
      { name: 'Escuadra 30cm', quantity: 2, unit: 'un' as const, delivered: true }
    ],
    notes: 'Herramientas menores para trabajos de precisión',
    photos: ['herramientas-1.jpg'],
    createdAt: '2025-09-12T11:00:00Z',
    updatedAt: '2025-09-13T09:30:00Z'
  },
  {
    id: 'mat-5',
    name: 'Equipo Seguridad - Mes Septiembre',
    category: 'equipos' as const,
    building: 'Todo el Proyecto',
    unit: 'General',
    status: 'reservado' as const,
    requestedBy: 'Patricia López',
    deliveryDate: '2025-09-18',
    requestDate: '2025-09-13',
    priority: 'alta' as const,
    estimatedCost: 450000,
    supplier: 'SafeWork Chile',
    approvedBy: 'Carlos Morales',
    components: [
      { name: 'Cascos de seguridad', quantity: 10, unit: 'un' as const, delivered: false },
      { name: 'Chalecos reflectantes', quantity: 10, unit: 'un' as const, delivered: false },
      { name: 'Zapatos de seguridad T42', quantity: 3, unit: 'un' as const, delivered: false },
      { name: 'Zapatos de seguridad T43', quantity: 4, unit: 'un' as const, delivered: false },
      { name: 'Zapatos de seguridad T44', quantity: 3, unit: 'un' as const, delivered: false },
      { name: 'Guantes de cuero', quantity: 15, unit: 'un' as const, delivered: false },
      { name: 'Lentes de seguridad', quantity: 12, unit: 'un' as const, delivered: false }
    ],
    notes: 'Renovación mensual de equipos de protección personal',
    createdAt: '2025-09-13T07:30:00Z',
    updatedAt: '2025-09-13T07:30:00Z'
  },
  {
    id: 'mat-6',
    name: 'Material Reparación Urgente',
    category: 'otros' as const,
    building: 'Edificio A',
    unit: 'EA-105',
    status: 'agotado' as const,
    requestedBy: 'Miguel Herrera',
    deliveryDate: '2025-09-14',
    requestDate: '2025-09-13',
    priority: 'urgente' as const,
    estimatedCost: 180000,
    supplier: 'Proveedor Express',
    components: [
      { name: 'Pasta muro interior', quantity: 3, unit: 'saco' as const, delivered: false, notes: 'Sin stock proveedor' },
      { name: 'Lija grano 120', quantity: 10, unit: 'un' as const, delivered: false },
      { name: 'Masking tape 2"', quantity: 4, unit: 'rollo' as const, delivered: false },
      { name: 'Plástico protector', quantity: 20, unit: 'm' as const, delivered: false }
    ],
    notes: 'Reparación urgente filtración en muro',
    createdAt: '2025-09-13T16:00:00Z',
    updatedAt: '2025-09-13T18:15:00Z'
  }
]

export default function MaterialsPage() {
  console.log('🔍 MATERIALS PAGE LOADING:', {
    component: 'MaterialsPage',
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server-side'
  })

  const { data: session } = useSession()
  const searchParams = useSearchParams()
  
  // Get role from URL params with fallback
  const role = searchParams.get('role') || 
               (session?.user.role === 'EXECUTIVE' ? 'gerencia' : 'bodega')
  
  console.log('🔍 MATERIALS PAGE SESSION & ROLE:', {
    session: session ? 'Present' : 'Missing',
    sessionUser: session?.user ? 'Present' : 'Missing',
    role: role,
    searchParamsRole: searchParams.get('role'),
    sessionRole: session?.user?.role
  })
  
  // Personalizar datos según rol del usuario autenticado
  const usuario = {
    ...mockUsuario,
    id: session?.user?.id || 'user-1',
    nombre: session?.user?.name || 'Usuario',
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad',
    permisos: mockUsuario.permisos || ['ver_materiales'],
    proyectosAsignados: mockUsuario.proyectosAsignados || []
  }

  console.log('🔍 MATERIALS PAGE DATA PREPARED:', {
    usuario: usuario ? 'Present' : 'Missing',
    usuarioType: typeof usuario,
    usuarioKeys: usuario ? Object.keys(usuario) : 'No usuario',
    mockMateriales: mockMateriales ? `Array of ${mockMateriales.length}` : 'Missing',
    mockMaterialesType: typeof mockMateriales,
    isArray: Array.isArray(mockMateriales),
    firstMaterial: mockMateriales?.[0] ? Object.keys(mockMateriales[0]) : 'No first material'
  })

  // Filtrar materiales según rol (demostración)
  const materialesPersonalizados = role === 'gerencia' ? mockMateriales :
                                  role === 'jefe_terreno' ? mockMateriales.filter(m => 
                                    ['hormigon_acero', 'herramientas'].includes(m.category)) :
                                  role === 'oficina_tecnica' ? mockMateriales.filter(m => 
                                    m.status === 'solicitado' || m.estimatedCost || 0 > 500000) :
                                  mockMateriales // bodega ve todos

  const handleMaterialRequest = (materialData: any) => {
    console.log('Solicitar nuevo material:', materialData)
    // En producción, aquí se llamaría al API
    alert('Funcionalidad de solicitar material será implementada con backend')
  }

  const handleMaterialUpdate = (id: string, updates: any) => {
    console.log('Actualizar material:', id, updates)
    // En producción, aquí se llamaría al API
    alert('Funcionalidad de editar material será implementada con backend')
  }

  const handleMaterialDelivery = (id: string) => {
    console.log('Marcar material como entregado:', id)
    // En producción, aquí se llamaría al API
    alert('Funcionalidad de entregar material será implementada con backend')
  }

  console.log('🔍 MATERIALS PAGE ABOUT TO RENDER MaterialsManagement:', {
    usuario: usuario,
    materialesPersonalizados: materialesPersonalizados?.length || 0,
    component: 'MaterialsManagement'
  })

  try {
    return (
      <ProtectedLayout>
        <ErrorBoundary>
          <MaterialsManagement 
            usuario={usuario}
            materiales={materialesPersonalizados}
            onMaterialRequest={handleMaterialRequest}
            onMaterialUpdate={handleMaterialUpdate}
            onMaterialDelivery={handleMaterialDelivery}
          />
        </ErrorBoundary>
      </ProtectedLayout>
    )
  } catch (error) {
    console.error('💥 MATERIALS PAGE RENDER ERROR:', {
      error: error.message,
      stack: error.stack,
      component: 'MaterialsPage',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server-side'
    })
    throw error
  }
}