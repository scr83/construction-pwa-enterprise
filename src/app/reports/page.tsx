'use client'

import { Reports } from '@/components/pages/Reports'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { useSearchParams } from 'next/navigation'

// Mock data for demonstration
const mockUsuario = {
  id: 'user-1',
  nombre: 'Juan Pérez',
  rol: 'gerencia' as const,
  permisos: ['ver_reportes', 'crear_reportes', 'exportar_reportes'],
  proyectosAsignados: ['proj-1', 'proj-2']
}

const mockConfiguracion = {
  logoEmpresa: '/logo.png',
  nombreEmpresa: 'ConstructorPro',
  colorCorporativo: '#3b82f6',
  marcaAgua: 'CONFIDENCIAL',
  incluirPortada: true,
  incluirIndice: true,
  incluirFirmaDigital: true,
  comprimirImagenes: true,
  servidorSMTP: {
    host: 'smtp.empresa.com',
    puerto: 587,
    usuario: 'reportes@empresa.com',
    ssl: true
  },
  retencionReportes: 365,
  almacenamientoNube: true,
  rutaAlmacenamiento: '/reportes/',
  limiteConcurrente: 5,
  timeoutGeneracion: 300000,
  cacheResultados: true
}

const mockProyectos = [
  {
    id: 'proj-1',
    nombre: 'Edificio Las Condes',
    codigo: 'RES-001'
  }
]

export default function ReportsPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'gerencia'
  
  // Personalizar usuario según rol
  const usuario = {
    ...mockUsuario,
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad',
    permisos: role === 'gerencia' ?
      ['ver_reportes', 'crear_reportes', 'exportar_reportes', 'compartir_reportes', 'reportes_financieros'] :
      role === 'oficina_tecnica' ?
      ['ver_reportes', 'crear_reportes', 'exportar_reportes', 'reportes_tecnicos'] :
      role === 'jefe_terreno' ?
      ['ver_reportes', 'reportes_avance', 'exportar_reportes'] :
      role === 'control_calidad' ?
      ['ver_reportes', 'reportes_calidad', 'exportar_reportes'] :
      ['ver_reportes']
  }

  // Reportes predefinidos según rol
  const reportesDefinidosPorRole = role === 'gerencia' ? [
    {
      id: 'rep-gerencia-1',
      nombre: 'Dashboard Ejecutivo',
      descripcion: 'KPIs financieros y operacionales',
      tipo: 'ejecutivo',
      categoria: 'gerencial',
      periodicidad: 'semanal',
      formatoSalida: 'pdf',
      metadata: { activo: true, plantilla: false }
    }
  ] : role === 'oficina_tecnica' ? [
    {
      id: 'rep-tecnica-1', 
      nombre: 'Informe Técnico Semanal',
      descripcion: 'Avance técnico y planificación',
      tipo: 'avance',
      categoria: 'tecnico',
      periodicidad: 'semanal',
      formatoSalida: 'excel',
      metadata: { activo: true, plantilla: false }
    }
  ] : role === 'jefe_terreno' ? [
    {
      id: 'rep-terreno-1',
      nombre: 'Reporte Diario de Obra',
      descripcion: 'Avance físico y equipos',
      tipo: 'avance',
      categoria: 'operacional', 
      periodicidad: 'diario',
      formatoSalida: 'pdf',
      metadata: { activo: true, plantilla: false }
    }
  ] : role === 'control_calidad' ? [
    {
      id: 'rep-calidad-1',
      nombre: 'Informe de Calidad',
      descripcion: 'Inspecciones y conformidades',
      tipo: 'calidad',
      categoria: 'tecnico',
      periodicidad: 'semanal', 
      formatoSalida: 'pdf',
      metadata: { activo: true, plantilla: false }
    }
  ] : []

  // Reportes generados recientes por rol
  const reportesGeneradosPorRole = role === 'gerencia' ? [
    {
      id: 'gen-1',
      reporteDefinicionId: 'rep-gerencia-1',
      nombre: 'Dashboard Ejecutivo - Semana 36',
      fechaGeneracion: new Date().toISOString(),
      estado: 'completado',
      datos: {
        kpis: [
          { id: '1', titulo: 'ROI', valor: 15.2, tipo: 'porcentaje', estado: 'bueno' },
          { id: '2', titulo: 'EBITDA', valor: 18.5, tipo: 'porcentaje', estado: 'excelente' }
        ],
        graficos: [],
        tablas: [],
        textos: []
      },
      enviadoA: [],
      metadata: { duracionGeneracion: 2000, registrosProcesados: 1500, alertasGeneradas: 0, version: '1.0' }
    }
  ] : []

  return (
    <ProtectedLayout>
      <Reports 
        usuario={usuario}
        reportesDefinidos={reportesDefinidosPorRole as any}
        reportesGenerados={reportesGeneradosPorRole as any}
        proyectos={mockProyectos}
        configuracion={mockConfiguracion}
      />
    </ProtectedLayout>
  )
}
