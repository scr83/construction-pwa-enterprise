import type { Meta, StoryObj } from '@storybook/react'
import { Reports } from './Reports'
import type { ReportsProps, ReporteDefinition, ReporteGenerado } from './Reports'

const meta: Meta<typeof Reports> = {
  title: 'Pages/Reports',
  component: Reports,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Centro de reportes con generación automática, analytics y dashboards ejecutivos para construcción.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    'usuario.rol': {
      control: { type: 'select' },
      options: ['gerencia', 'jefe_terreno', 'bodega', 'oficina_tecnica', 'control_calidad'],
      description: 'Rol del usuario que determina permisos y reportes disponibles'
    },
    mode: {
      control: { type: 'radio' },
      options: ['dashboard', 'builder', 'viewer', 'analytics'],
      description: 'Modo de visualización'
    },
    esMobile: {
      control: { type: 'boolean' },
      description: 'Vista móvil optimizada'
    }
  }
}

export default meta
type Story = StoryObj<typeof Reports>

// Definiciones de reportes de ejemplo
const reportesDefinidos: ReporteDefinition[] = [
  {
    id: 'rpt-def-001',
    nombre: 'Reporte Ejecutivo Mensual',
    descripcion: 'Resumen ejecutivo con KPIs principales, avance de proyectos y análisis financiero',
    tipo: 'ejecutivo',
    categoria: 'gerencial',
    periodicidad: 'mensual',
    formatoSalida: 'pdf',
    fuentesDatos: [
      { id: 'proyectos', nombre: 'Base de Proyectos', tipo: 'proyectos' },
      { id: 'financiero', nombre: 'Datos Financieros', tipo: 'financiero' }
    ],
    secciones: [
      {
        id: 'kpis',
        titulo: 'Indicadores Ejecutivos',
        tipo: 'kpi',
        configuracion: { incluir: ['ingresos', 'margen', 'eficiencia'] },
        orden: 1,
        visible: true
      },
      {
        id: 'proyectos-activos',
        titulo: 'Estado de Proyectos',
        tipo: 'grafico',
        configuracion: { tipo: 'bar', agrupacion: 'estado' },
        orden: 2,
        visible: true
      },
      {
        id: 'analisis-financiero',
        titulo: 'Análisis Financiero',
        tipo: 'tabla',
        configuracion: { columnas: ['proyecto', 'presupuesto', 'ejecutado', 'varianza'] },
        orden: 3,
        visible: true
      }
    ],
    destinatarios: [
      { rol: 'gerencia', notificaciones: true },
      { rol: 'oficina_tecnica', notificaciones: false }
    ],
    envioAutomatico: true,
    cronExpresion: '0 0 1 * *', // Primer día de cada mes
    proximoEnvio: '2024-02-01T00:00:00Z',
    metadata: {
      creadoPor: 'patricia.sanchez@constructora.cl',
      fechaCreacion: '2023-12-15',
      ultimaModificacion: '2024-01-10',
      version: '2.1',
      activo: true,
      plantilla: true
    }
  },
  {
    id: 'rpt-def-002',
    nombre: 'Reporte de Avance Semanal',
    descripcion: 'Seguimiento semanal de avance físico y programático de todos los proyectos',
    tipo: 'avance',
    categoria: 'operacional',
    periodicidad: 'semanal',
    formatoSalida: 'excel',
    fuentesDatos: [
      { id: 'proyectos', nombre: 'Base de Proyectos', tipo: 'proyectos' },
      { id: 'inspecciones', nombre: 'Control de Calidad', tipo: 'inspecciones' }
    ],
    secciones: [
      {
        id: 'resumen-avance',
        titulo: 'Resumen de Avance',
        tipo: 'kpi',
        configuracion: { incluir: ['avance_fisico', 'avance_cronograma'] },
        orden: 1,
        visible: true
      },
      {
        id: 'detalle-proyectos',
        titulo: 'Detalle por Proyecto',
        tipo: 'tabla',
        configuracion: { incluir_fotos: true },
        orden: 2,
        visible: true
      }
    ],
    destinatarios: [
      { rol: 'jefe_terreno', notificaciones: true },
      { rol: 'oficina_tecnica', notificaciones: true }
    ],
    envioAutomatico: true,
    cronExpresion: '0 0 * * 1', // Cada lunes
    proximoEnvio: '2024-01-29T00:00:00Z',
    metadata: {
      creadoPor: 'carlos.mendoza@constructora.cl',
      fechaCreacion: '2024-01-05',
      ultimaModificacion: '2024-01-20',
      version: '1.3',
      activo: true,
      plantilla: false
    }
  },
  {
    id: 'rpt-def-003',
    nombre: 'Reporte de Control de Calidad',
    descripcion: 'Análisis de inspecciones, no conformidades y cumplimiento normativo',
    tipo: 'calidad',
    categoria: 'tecnico',
    periodicidad: 'quincenal',
    formatoSalida: 'pdf',
    fuentesDatos: [
      { id: 'inspecciones', nombre: 'Inspecciones de Calidad', tipo: 'inspecciones' }
    ],
    secciones: [
      {
        id: 'metricas-calidad',
        titulo: 'Métricas de Calidad',
        tipo: 'kpi',
        configuracion: { incluir: ['cumplimiento', 'no_conformidades', 'inspecciones'] },
        orden: 1,
        visible: true
      },
      {
        id: 'tendencias',
        titulo: 'Tendencias de Calidad',
        tipo: 'grafico',
        configuracion: { tipo: 'line', periodo: '6_meses' },
        orden: 2,
        visible: true
      }
    ],
    destinatarios: [
      { rol: 'control_calidad', notificaciones: true },
      { rol: 'gerencia', notificaciones: false }
    ],
    envioAutomatico: true,
    cronExpresion: '0 0 1,15 * *', // Día 1 y 15 de cada mes
    metadata: {
      creadoPor: 'sofia.ramirez@constructora.cl',
      fechaCreacion: '2024-01-08',
      ultimaModificacion: '2024-01-22',
      version: '1.1',
      activo: true,
      plantilla: true
    }
  },
  {
    id: 'rpt-def-004',
    nombre: 'Análisis de Inventario',
    descripcion: 'Estado de inventario, rotación de materiales y planificación de compras',
    tipo: 'materiales',
    categoria: 'operacional',
    periodicidad: 'semanal',
    formatoSalida: 'excel',
    fuentesDatos: [
      { id: 'materiales', nombre: 'Inventario de Materiales', tipo: 'materiales' }
    ],
    secciones: [
      {
        id: 'stock-critico',
        titulo: 'Materiales en Stock Crítico',
        tipo: 'tabla',
        configuracion: { alerta_automatica: true },
        orden: 1,
        visible: true
      }
    ],
    destinatarios: [
      { rol: 'bodega', notificaciones: true }
    ],
    envioAutomatico: true,
    cronExpresion: '0 8 * * 3', // Cada miércoles a las 8:00
    metadata: {
      creadoPor: 'elena.morales@constructora.cl',
      fechaCreacion: '2024-01-12',
      ultimaModificacion: '2024-01-22',
      version: '1.0',
      activo: true,
      plantilla: false
    }
  }
]

// Reportes generados de ejemplo
const reportesGenerados: ReporteGenerado[] = [
  {
    id: 'rpt-gen-001',
    reporteDefinicionId: 'rpt-def-001',
    nombre: 'Reporte Ejecutivo - Enero 2024',
    descripcion: 'Resumen ejecutivo del rendimiento en enero 2024',
    periodoInicio: '2024-01-01',
    periodoFin: '2024-01-31',
    fechaGeneracion: '2024-02-01T08:00:00Z',
    datos: {
      kpis: [
        {
          id: 'ingresos-enero',
          titulo: 'Ingresos del Mes',
          valor: 1240000000,
          tipo: 'moneda',
          tendencia: { direccion: 'subiendo', porcentaje: 15.2, periodo: 'vs diciembre' },
          estado: 'bueno',
          meta: 1100000000
        },
        {
          id: 'margen-utilidad',
          titulo: 'Margen de Utilidad',
          valor: 19.5,
          tipo: 'porcentaje',
          tendencia: { direccion: 'subiendo', porcentaje: 2.1, periodo: 'vs diciembre' },
          estado: 'bueno',
          meta: 18
        },
        {
          id: 'proyectos-activos',
          titulo: 'Proyectos Activos',
          valor: 8,
          tipo: 'numero',
          estado: 'info'
        },
        {
          id: 'eficiencia-operacional',
          titulo: 'Eficiencia Operacional',
          valor: 92.8,
          tipo: 'porcentaje',
          tendencia: { direccion: 'estable', porcentaje: 0.8, periodo: 'vs diciembre' },
          estado: 'bueno',
          meta: 90
        }
      ],
      graficos: [
        {
          id: 'ingresos-trimestrales',
          titulo: 'Evolución de Ingresos Trimestrales',
          tipo: 'line',
          datos: [
            { mes: 'Nov', ingresos: 980, meta: 950 },
            { mes: 'Dec', ingresos: 1080, meta: 1000 },
            { mes: 'Ene', ingresos: 1240, meta: 1100 }
          ],
          configuracion: { showTrend: true, colors: ['#3B82F6', '#10B981'] }
        },
        {
          id: 'distribucion-proyectos',
          titulo: 'Distribución de Proyectos por Estado',
          tipo: 'pie',
          datos: [
            { estado: 'Estructura', proyectos: 3, color: '#3B82F6' },
            { estado: 'Terminaciones', proyectos: 2, color: '#10B981' },
            { estado: 'Planificación', proyectos: 2, color: '#F59E0B' },
            { estado: 'Entrega', proyectos: 1, color: '#8B5CF6' }
          ]
        }
      ],
      tablas: [
        {
          id: 'proyectos-resumen',
          titulo: 'Resumen de Proyectos Enero 2024',
          columnas: [
            { clave: 'nombre', titulo: 'Proyecto', tipo: 'texto' },
            { clave: 'avance', titulo: 'Avance', tipo: 'porcentaje' },
            { clave: 'presupuesto', titulo: 'Presupuesto', tipo: 'moneda' },
            { clave: 'ejecutado', titulo: 'Ejecutado', tipo: 'moneda' },
            { clave: 'varianza', titulo: 'Varianza', tipo: 'porcentaje' }
          ],
          filas: [
            {
              nombre: 'Edificio Las Condes',
              avance: 65.2,
              presupuesto: 2500000000,
              ejecutado: 1630000000,
              varianza: 3.2
            },
            {
              nombre: 'Centro Comercial Plaza Norte',
              avance: 28.5,
              presupuesto: 4200000000,
              ejecutado: 1197000000,
              varianza: -1.8
            },
            {
              nombre: 'Hospital Regional',
              avance: 42.1,
              presupuesto: 3100000000,
              ejecutado: 1305000000,
              varianza: 0.9
            }
          ],
          resumen: {
            totales: { presupuesto: 9800000000, ejecutado: 4132000000 },
            promedios: { avance: 45.3, varianza: 0.8 }
          }
        }
      ],
      textos: [
        {
          id: 'resumen-ejecutivo',
          titulo: 'Resumen Ejecutivo',
          contenido: 'Enero 2024 mostró un rendimiento excepcional con ingresos 15.2% superiores al mes anterior...',
          formato: 'texto'
        }
      ]
    },
    estado: 'completado',
    tamanoArchivo: 2048576, // 2MB
    urlDescarga: '/downloads/reporte-ejecutivo-enero-2024.pdf',
    enviadoA: [
      {
        destinatario: 'patricia.sanchez@constructora.cl',
        fechaEnvio: '2024-02-01T08:30:00Z',
        estado: 'entregado'
      },
      {
        destinatario: 'ricardo.valenzuela@constructora.cl',
        fechaEnvio: '2024-02-01T08:30:00Z',
        estado: 'entregado'
      }
    ],
    metadata: {
      duracionGeneracion: 45000, // 45 segundos
      registrosProcesados: 1250,
      alertasGeneradas: 2,
      version: '2.1'
    }
  },
  {
    id: 'rpt-gen-002',
    reporteDefinicionId: 'rpt-def-002',
    nombre: 'Avance Semanal - Semana 22/01/2024',
    periodoInicio: '2024-01-22',
    periodoFin: '2024-01-28',
    fechaGeneracion: '2024-01-29T07:00:00Z',
    datos: {
      kpis: [
        {
          id: 'avance-fisico-promedio',
          titulo: 'Avance Físico Promedio',
          valor: 48.7,
          tipo: 'porcentaje',
          tendencia: { direccion: 'subiendo', porcentaje: 3.2, periodo: 'vs semana anterior' },
          estado: 'bueno'
        },
        {
          id: 'cumplimiento-cronograma',
          titulo: 'Cumplimiento Cronograma',
          valor: 91.5,
          tipo: 'porcentaje',
          estado: 'bueno',
          meta: 90
        },
        {
          id: 'inspecciones-realizadas',
          titulo: 'Inspecciones Realizadas',
          valor: 15,
          tipo: 'numero',
          estado: 'info'
        }
      ],
      graficos: [
        {
          id: 'avance-semanal-proyectos',
          titulo: 'Avance Semanal por Proyecto',
          tipo: 'bar',
          datos: [
            { proyecto: 'Las Condes', avance_anterior: 62.1, avance_actual: 65.2 },
            { proyecto: 'Plaza Norte', avance_anterior: 25.3, avance_actual: 28.5 },
            { proyecto: 'Hospital', avance_anterior: 39.8, avance_actual: 42.1 }
          ]
        }
      ],
      tablas: [
        {
          id: 'detalle-avance',
          titulo: 'Detalle de Avance por Proyecto',
          columnas: [
            { clave: 'proyecto', titulo: 'Proyecto' },
            { clave: 'avance_fisico', titulo: 'Avance Físico', tipo: 'porcentaje' },
            { clave: 'avance_cronograma', titulo: 'Avance Cronograma', tipo: 'porcentaje' },
            { clave: 'trabajadores', titulo: 'Trabajadores', tipo: 'numero' }
          ],
          filas: [
            { proyecto: 'Edificio Las Condes', avance_fisico: 65.2, avance_cronograma: 94.5, trabajadores: 45 },
            { proyecto: 'Plaza Norte', avance_fisico: 28.5, avance_cronograma: 89.3, trabajadores: 68 },
            { proyecto: 'Hospital Regional', avance_fisico: 42.1, avance_cronograma: 92.8, trabajadores: 52 }
          ]
        }
      ],
      textos: []
    },
    estado: 'enviado',
    tamanoArchivo: 1536000, // 1.5MB
    urlDescarga: '/downloads/avance-semanal-220124.xlsx',
    enviadoA: [
      {
        destinatario: 'carlos.mendoza@constructora.cl',
        fechaEnvio: '2024-01-29T07:15:00Z',
        estado: 'entregado'
      },
      {
        destinatario: 'ana.rodriguez@constructora.cl',
        fechaEnvio: '2024-01-29T07:15:00Z',
        estado: 'entregado'
      }
    ],
    metadata: {
      duracionGeneracion: 28000, // 28 segundos
      registrosProcesados: 890,
      alertasGeneradas: 1,
      version: '1.3'
    }
  },
  {
    id: 'rpt-gen-003',
    reporteDefinicionId: 'rpt-def-003',
    nombre: 'Control de Calidad - Primera Quincena Enero',
    periodoInicio: '2024-01-01',
    periodoFin: '2024-01-15',
    fechaGeneracion: '2024-01-16T09:00:00Z',
    datos: {
      kpis: [
        {
          id: 'cumplimiento-normativo',
          titulo: 'Cumplimiento Normativo',
          valor: 94.2,
          tipo: 'porcentaje',
          estado: 'bueno',
          meta: 95
        },
        {
          id: 'no-conformidades',
          titulo: 'No Conformidades',
          valor: 8,
          tipo: 'numero',
          tendencia: { direccion: 'bajando', porcentaje: -20, periodo: 'vs quincena anterior' },
          estado: 'bueno'
        },
        {
          id: 'inspecciones-realizadas',
          titulo: 'Inspecciones Realizadas',
          valor: 42,
          tipo: 'numero',
          estado: 'bueno'
        }
      ],
      graficos: [
        {
          id: 'tendencia-calidad',
          titulo: 'Tendencia de Cumplimiento Normativo',
          tipo: 'line',
          datos: [
            { quincena: 'Nov-2', cumplimiento: 91.5 },
            { quincena: 'Dic-1', cumplimiento: 93.2 },
            { quincena: 'Dic-2', cumplimiento: 92.8 },
            { quincena: 'Ene-1', cumplimiento: 94.2 }
          ]
        }
      ],
      tablas: [
        {
          id: 'no-conformidades-detalle',
          titulo: 'Detalle de No Conformidades',
          columnas: [
            { clave: 'proyecto', titulo: 'Proyecto' },
            { clave: 'tipo', titulo: 'Tipo' },
            { clave: 'severidad', titulo: 'Severidad' },
            { clave: 'estado', titulo: 'Estado' }
          ],
          filas: [
            { proyecto: 'Las Condes', tipo: 'Estructural', severidad: 'Media', estado: 'Corregida' },
            { proyecto: 'Plaza Norte', tipo: 'Instalaciones', severidad: 'Baja', estado: 'Abierta' },
            { proyecto: 'Hospital', tipo: 'Seguridad', severidad: 'Alta', estado: 'En Proceso' }
          ]
        }
      ],
      textos: []
    },
    estado: 'completado',
    tamanoArchivo: 890000,
    enviadoA: [
      {
        destinatario: 'sofia.ramirez@constructora.cl',
        fechaEnvio: '2024-01-16T09:30:00Z',
        estado: 'entregado'
      }
    ],
    metadata: {
      duracionGeneracion: 18000,
      registrosProcesados: 420,
      alertasGeneradas: 3,
      version: '1.1'
    }
  },
  {
    id: 'rpt-gen-004',
    reporteDefinicionId: 'rpt-def-001',
    nombre: 'Reporte Ejecutivo - Diciembre 2023',
    periodoInicio: '2023-12-01',
    periodoFin: '2023-12-31',
    fechaGeneracion: '2024-01-02T08:00:00Z',
    datos: {
      kpis: [
        {
          id: 'ingresos-diciembre',
          titulo: 'Ingresos del Mes',
          valor: 1080000000,
          tipo: 'moneda',
          estado: 'bueno',
          meta: 1000000000
        }
      ],
      graficos: [],
      tablas: [],
      textos: []
    },
    estado: 'completado',
    tamanoArchivo: 1920000,
    urlDescarga: '/downloads/reporte-ejecutivo-diciembre-2023.pdf',
    enviadoA: [
      {
        destinatario: 'patricia.sanchez@constructora.cl',
        fechaEnvio: '2024-01-02T08:30:00Z',
        estado: 'entregado'
      }
    ],
    metadata: {
      duracionGeneracion: 52000,
      registrosProcesados: 1180,
      alertasGeneradas: 1,
      version: '2.0'
    }
  },
  {
    id: 'rpt-gen-005',
    reporteDefinicionId: 'rpt-def-002',
    nombre: 'Avance Semanal - Generando...',
    periodoInicio: '2024-01-29',
    periodoFin: '2024-02-04',
    fechaGeneracion: new Date().toISOString(),
    datos: { kpis: [], graficos: [], tablas: [], textos: [] },
    estado: 'generando',
    enviadoA: [],
    metadata: {
      duracionGeneracion: 0,
      registrosProcesados: 0,
      alertasGeneradas: 0,
      version: '1.3'
    }
  }
]

// Proyectos de ejemplo
const proyectosEjemplo = [
  { id: 'proj-001', nombre: 'Edificio Residencial Las Condes', codigo: 'ELC-2024' },
  { id: 'proj-002', nombre: 'Centro Comercial Plaza Norte', codigo: 'PCN-2024' },
  { id: 'proj-003', nombre: 'Hospital Regional Valparaíso', codigo: 'HRV-2024' },
  { id: 'proj-004', nombre: 'Conjunto Habitacional El Bosque', codigo: 'CHB-2024' }
]

// Usuarios de ejemplo
const usuarioGerencia = {
  id: 'user-gerencia',
  nombre: 'Patricia Sánchez',
  rol: 'gerencia' as const,
  proyectosAsignados: ['proj-001', 'proj-002', 'proj-003', 'proj-004'],
  permisos: [
    'ver_todos_reportes',
    'crear_reportes',
    'generar_reportes',
    'exportar_reportes',
    'compartir_reportes',
    'configurar_reportes'
  ]
}

const usuarioJefeTerreno = {
  id: 'user-terreno',
  nombre: 'Carlos Mendoza',
  rol: 'jefe_terreno' as const,
  proyectosAsignados: ['proj-001', 'proj-003'],
  permisos: [
    'ver_reportes_proyecto',
    'generar_reportes_avance',
    'exportar_reportes'
  ]
}

const usuarioControlCalidad = {
  id: 'user-calidad',
  nombre: 'Sofía Ramírez',
  rol: 'control_calidad' as const,
  proyectosAsignados: ['proj-001', 'proj-002', 'proj-003'],
  permisos: [
    'ver_reportes_calidad',
    'generar_reportes_calidad',
    'exportar_reportes'
  ]
}

// Configuración de ejemplo
const configuracionEjemplo = {
  logoEmpresa: '/logo-constructora.png',
  nombreEmpresa: 'Constructora ABC Ltda.',
  colorCorporativo: '#2563EB',
  marcaAgua: 'CONFIDENCIAL',
  incluirPortada: true,
  incluirIndice: true,
  incluirFirmaDigital: true,
  comprimirImagenes: true,
  servidorSMTP: {
    host: 'smtp.empresa.com',
    puerto: 587,
    usuario: 'reportes@constructora.cl',
    ssl: true
  },
  retencionReportes: 365,
  almacenamientoNube: true,
  rutaAlmacenamiento: '/reportes/',
  limiteConcurrente: 3,
  timeoutGeneracion: 300000,
  cacheResultados: true
}

// Story Wrapper
const ReportsWrapper = ({ children, ...props }: any) => {
  const handleReporteGenerar = async (definicionId: string, parametros: any) => {
    console.log('Generar reporte:', definicionId, parametros)
    // Simular generación
    await new Promise(resolve => setTimeout(resolve, 3000))
    return `rpt-gen-${Date.now()}`
  }

  const handleReporteDescargar = async (reporteId: string) => {
    console.log('Descargar reporte:', reporteId)
    // Simular descarga
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleReporteEnviar = async (reporteId: string, destinatarios: string[]) => {
    console.log('Enviar reporte:', reporteId, 'a:', destinatarios)
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const handleExportarDatos = async (datos: any, formato: string) => {
    console.log(`Exportar datos en formato ${formato}:`, datos.length, 'registros')
    await new Promise(resolve => setTimeout(resolve, 1500))
  }

  const handleAnalisisPersonalizado = async (configuracion: any) => {
    console.log('Análisis personalizado:', configuracion)
    await new Promise(resolve => setTimeout(resolve, 2500))
    return { resultado: 'análisis completado' }
  }

  return (
    <Reports
      {...props}
      reportesDefinidos={reportesDefinidos}
      reportesGenerados={reportesGenerados}
      proyectos={proyectosEjemplo}
      configuracion={configuracionEjemplo}
      onReporteGenerar={handleReporteGenerar}
      onReporteDescargar={handleReporteDescargar}
      onReporteEnviar={handleReporteEnviar}
      onExportarDatos={handleExportarDatos}
      onAnalisisPersonalizado={handleAnalisisPersonalizado}
    />
  )
}

// Historias principales
export const DashboardReportes: Story = {
  render: (args) => (
    <ReportsWrapper
      {...args}
      usuario={usuarioGerencia}
      mode="dashboard"
    />
  )
}

export const CentroReportes: Story = {
  render: (args) => (
    <ReportsWrapper
      {...args}
      usuario={usuarioGerencia}
      mode="viewer"
    />
  )
}

export const GeneradorReportes: Story = {
  render: (args) => (
    <ReportsWrapper
      {...args}
      usuario={usuarioGerencia}
      mode="builder"
    />
  )
}

export const AnalyticsAvanzados: Story = {
  render: (args) => (
    <ReportsWrapper
      {...args}
      usuario={usuarioGerencia}
      mode="analytics"
    />
  )
}

export const ReportesJefeTerreno: Story = {
  render: (args) => (
    <ReportsWrapper
      {...args}
      usuario={usuarioJefeTerreno}
      mode="dashboard"
      reportesGenerados={reportesGenerados.filter(r => 
        reportesDefinidos.find(d => d.id === r.reporteDefinicionId)?.tipo === 'avance'
      )}
    />
  )
}

export const ReportesControlCalidad: Story = {
  render: (args) => (
    <ReportsWrapper
      {...args}
      usuario={usuarioControlCalidad}
      mode="dashboard"
      reportesGenerados={reportesGenerados.filter(r => 
        reportesDefinidos.find(d => d.id === r.reporteDefinicionId)?.tipo === 'calidad'
      )}
    />
  )
}

export const VistaMobile: Story = {
  render: (args) => (
    <div className="max-w-sm mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <ReportsWrapper
        {...args}
        usuario={usuarioGerencia}
        esMobile={true}
        mode="dashboard"
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const ReporteEjecutivoCompleto: Story = {
  render: (args) => (
    <ReportsWrapper
      {...args}
      usuario={usuarioGerencia}
      mode="analytics"
      reportType="executive"
    />
  )
}

export const ReporteAvanceMobile: Story = {
  render: (args) => (
    <div className="max-w-sm mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <ReportsWrapper
        {...args}
        usuario={usuarioJefeTerreno}
        esMobile={true}
        mode="analytics"
        reportType="progress"
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const ReportesConFiltros: Story = {
  render: (args) => (
    <ReportsWrapper
      {...args}
      usuario={usuarioGerencia}
      filtros={{
        fechaInicio: '2024-01-01',
        fechaFin: '2024-01-31',
        tipos: ['ejecutivo', 'avance'],
        estados: ['completado']
      }}
    />
  )
}

export const GeneracionEnProceso: Story = {
  render: (args) => (
    <ReportsWrapper
      {...args}
      usuario={usuarioGerencia}
      reportesGenerados={[
        ...reportesGenerados,
        {
          id: 'rpt-gen-progress',
          reporteDefinicionId: 'rpt-def-001',
          nombre: 'Reporte Ejecutivo - Generando...',
          periodoInicio: '2024-02-01',
          periodoFin: '2024-02-28',
          fechaGeneracion: new Date().toISOString(),
          datos: { kpis: [], graficos: [], tablas: [], textos: [] },
          estado: 'generando',
          enviadoA: [],
          metadata: {
            duracionGeneracion: 45000,
            registrosProcesados: 800,
            alertasGeneradas: 0,
            version: '2.1'
          }
        }
      ]}
    />
  )
}

export const VistaCargando: Story = {
  render: (args) => (
    <Reports
      {...args}
      usuario={usuarioGerencia}
      reportesDefinidos={[]}
      reportesGenerados={[]}
      proyectos={[]}
      configuracion={configuracionEjemplo}
      isLoading={true}
    />
  )
}

export const VistaError: Story = {
  render: (args) => (
    <Reports
      {...args}
      usuario={usuarioGerencia}
      reportesDefinidos={[]}
      reportesGenerados={[]}
      proyectos={[]}
      configuracion={configuracionEjemplo}
      error="No se pudo cargar la información de reportes. Error de conexión con el servidor."
    />
  )
}

export const SinReportes: Story = {
  render: (args) => (
    <ReportsWrapper
      {...args}
      usuario={usuarioJefeTerreno}
      reportesDefinidos={[]}
      reportesGenerados={[]}
    />
  )
}