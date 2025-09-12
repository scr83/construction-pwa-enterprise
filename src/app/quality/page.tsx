'use client'

import { QualityControl } from '@/components/pages/QualityControl'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

// Mock data for demonstration
const mockUsuario = {
  id: 'user-1',
  nombre: 'Juan Pérez',
  rol: 'control_calidad' as const,
  certificaciones: ['ISO9001', 'Control Calidad'],
  permisos: ['inspecciones', 'reportes_calidad'],
  proyectosAsignados: ['proj-1'],
  firmaDigital: 'signature-base64'
}

const mockConfiguracion = {
  fotosObligatorias: true,
  gpsObligatorio: true,
  firmaDigitalObligatoria: true,
  sincronizacionOffline: true,
  alertasVencimiento: true,
  diasAlertaVencimiento: 7,
  requiereAprobacionSupervisor: false,
  calidadFoto: 'alta' as const,
  marcaDeAgua: true,
  compressionAutomatica: true,
  formatoReportePorDefecto: 'pdf' as const,
  incluirFotosEnReporte: true,
  logoEmpresa: '/logo.png'
}

export default function QualityPage() {
  console.log('🔍 QUALITY PAGE LOADING:', {
    component: 'QualityPage',
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server-side'
  })

  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'control_calidad'
  
  console.log('🔍 QUALITY PAGE SESSION & ROLE:', {
    role: role,
    searchParamsRole: searchParams.get('role')
  })
  
  // Personalizar usuario según rol
  const usuario = {
    ...mockUsuario,
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad',
    permisos: role === 'gerencia' ?
      ['ver_inspecciones', 'aprobar_inspecciones', 'exportar_reportes'] :
      role === 'jefe_terreno' ?
      ['ver_inspecciones', 'crear_inspecciones', 'subir_fotos'] :
      role === 'control_calidad' ?
      ['ver_inspecciones', 'crear_inspecciones', 'editar_inspecciones', 'aprobar_inspecciones', 'gestionar_templates'] :
      ['ver_inspecciones']
  }

  console.log('🔍 QUALITY PAGE DATA PREPARED:', {
    usuario: usuario ? 'Present' : 'Missing',
    usuarioType: typeof usuario,
    usuarioKeys: usuario ? Object.keys(usuario) : 'No usuario',
    mockConfiguracion: mockConfiguracion ? 'Present' : 'Missing'
  })

  // Configuración personalizada por rol  
  const configuracionPersonalizada = {
    ...mockConfiguracion,
    requiereAprobacionSupervisor: role !== 'gerencia' && role !== 'control_calidad',
    fotosObligatorias: role === 'control_calidad' || role === 'jefe_terreno',
    firmaDigitalObligatoria: role === 'control_calidad'
  }

  // Mock inspecciones específicas por rol
  const inspeccionesPorRole = role === 'control_calidad' ? [
    {
      id: 'insp-1',
      codigo: 'INSP-QC-001',
      nombre: 'Inspección Estructural - Piso 5',
      proyectoId: 'proj-1',
      proyectoNombre: 'Edificio Las Condes',
      estado: 'pendiente',
      fechaProgramada: new Date().toISOString(),
      inspector: { id: usuario.id, nombre: usuario.nombre, certificaciones: usuario.certificaciones, firma: '' },
      checklistItems: [],
      itemsAprobados: 0,
      itemsRechazados: 0,
      itemsPendientes: 8
    }
  ] : role === 'jefe_terreno' ? [
    {
      id: 'insp-2', 
      codigo: 'INSP-TER-002',
      nombre: 'Verificación Avance Diario',
      proyectoId: 'proj-1',
      proyectoNombre: 'Edificio Las Condes',
      estado: 'en_proceso',
      fechaProgramada: new Date().toISOString(),
      inspector: { id: usuario.id, nombre: usuario.nombre, certificaciones: [], firma: '' },
      checklistItems: [],
      itemsAprobados: 3,
      itemsRechazados: 1,
      itemsPendientes: 4
    }
  ] : []

  console.log('🔍 QUALITY PAGE ABOUT TO RENDER QualityControl:', {
    usuario: usuario,
    inspeccionesPorRole: inspeccionesPorRole?.length || 0,
    component: 'QualityControl'
  })

  try {
    return (
      <ProtectedLayout>
        <QualityControl 
          usuario={usuario}
          inspecciones={inspeccionesPorRole as any}
          templatesChecklist={[]}
          configuracion={configuracionPersonalizada}
        />
      </ProtectedLayout>
    )
  } catch (error) {
    console.error('💥 QUALITY PAGE RENDER ERROR:', {
      error: error.message,
      stack: error.stack,
      component: 'QualityPage',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server-side'
    })
    throw error
  }
}
