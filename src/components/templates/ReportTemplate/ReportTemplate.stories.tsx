import type { Meta, StoryObj } from '@storybook/react'
import { ReportTemplate } from './ReportTemplate'
import type { ReportTemplateProps, ReportData, ReportSection } from './ReportTemplate'

const meta: Meta<typeof ReportTemplate> = {
  title: 'Templates/ReportTemplate',
  component: ReportTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Plantilla para reportes y análisis con gráficos, KPIs, tablas y funcionalidad de exportación.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: { type: 'radio' },
      options: ['dashboard', 'detailed', 'comparison', 'fullscreen'],
      description: 'Diseño del reporte'
    },
    role: {
      control: { type: 'select' },
      options: ['gerencia', 'jefe_terreno', 'bodega', 'oficina_tecnica', 'control_calidad'],
      description: 'Rol del usuario para permisos'
    }
  }
}

export default meta
type Story = StoryObj<typeof ReportTemplate>

// Datos de ejemplo para reporte ejecutivo
const executiveReport: ReportData = {
  id: 'exec-2024-q1',
  title: 'Reporte Ejecutivo Q1 2024',
  description: 'Resumen ejecutivo del rendimiento de proyectos y finanzas del primer trimestre',
  type: 'financial',
  period: {
    start: '2024-01-01',
    end: '2024-03-31',
    type: 'quarterly'
  },
  project: {
    id: 'all',
    name: 'Todos los Proyectos',
    code: 'ALL'
  },
  data: {},
  metadata: {
    generatedAt: new Date().toISOString(),
    generatedBy: 'María González - Gerencia General',
    version: '1.0',
    currency: 'CLP',
    format: 'executive'
  }
}

const progressReport: ReportData = {
  id: 'prog-edificio-2024',
  title: 'Reporte de Avance - Edificio Las Condes',
  description: 'Estado de avance de construcción, cronograma y recursos',
  type: 'progress',
  period: {
    start: '2024-01-01',
    end: '2024-01-31',
    type: 'monthly'
  },
  project: {
    id: 'proj-001',
    name: 'Edificio Residencial Las Condes',
    code: 'ELC-2024'
  },
  data: {},
  metadata: {
    generatedAt: new Date().toISOString(),
    generatedBy: 'Carlos Mendoza - Jefe de Terreno',
    version: '2.1',
    currency: 'CLP',
    format: 'detailed'
  }
}

// Secciones para reporte ejecutivo
const executiveSections: ReportSection[] = [
  {
    id: 'kpis-principales',
    title: 'Indicadores Clave',
    subtitle: 'Métricas principales del trimestre',
    type: 'kpis',
    layout: 'grid-4',
    content: {
      kpis: [
        {
          id: 'ingresos',
          title: 'Ingresos Totales',
          value: 2845000000,
          type: 'currency',
          status: 'good',
          trend: {
            direction: 'up',
            percentage: 12.5,
            period: 'vs Q4 2023'
          },
          target: 2500000000,
          description: 'Ingresos por construcción y ventas de unidades'
        },
        {
          id: 'margen',
          title: 'Margen de Utilidad',
          value: 18.7,
          type: 'percentage',
          status: 'good',
          trend: {
            direction: 'up',
            percentage: 2.3,
            period: 'vs Q4 2023'
          },
          target: 15,
          description: 'Margen neto después de todos los costos'
        },
        {
          id: 'proyectos-activos',
          title: 'Proyectos Activos',
          value: 12,
          type: 'number',
          status: 'info',
          trend: {
            direction: 'up',
            percentage: 20,
            period: 'vs Q4 2023'
          },
          description: 'Proyectos en ejecución simultánea'
        },
        {
          id: 'eficiencia',
          title: 'Eficiencia Operacional',
          value: 94.2,
          type: 'percentage',
          status: 'good',
          trend: {
            direction: 'up',
            percentage: 3.1,
            period: 'vs Q4 2023'
          },
          target: 90,
          description: 'Cumplimiento de cronogramas y presupuestos'
        }
      ]
    }
  },
  {
    id: 'ventas-financiero',
    title: 'Análisis Financiero',
    subtitle: 'Desglose de ingresos y gastos',
    type: 'charts',
    layout: 'grid-2',
    content: {
      charts: [
        {
          id: 'ingresos-mensuales',
          title: 'Ingresos Mensuales (Millones CLP)',
          type: 'bar',
          size: 'lg',
          data: [
            { mes: 'Enero', ingresos: 850, meta: 800 },
            { mes: 'Febrero', ingresos: 920, meta: 850 },
            { mes: 'Marzo', ingresos: 1075, meta: 900 }
          ],
          config: {
            xAxis: 'mes',
            yAxis: 'ingresos',
            colors: ['#3B82F6', '#10B981'],
            showLegend: true,
            showValues: true
          }
        },
        {
          id: 'distribucion-costos',
          title: 'Distribución de Costos',
          type: 'pie',
          size: 'lg',
          data: [
            { categoria: 'Materiales', valor: 45, color: '#EF4444' },
            { categoria: 'Mano de Obra', valor: 30, color: '#F59E0B' },
            { categoria: 'Maquinaria', valor: 15, color: '#3B82F6' },
            { categoria: 'Otros', valor: 10, color: '#6B7280' }
          ],
          config: {
            showLegend: true,
            showValues: true
          }
        }
      ]
    }
  },
  {
    id: 'proyectos-activos-tabla',
    title: 'Estado de Proyectos Activos',
    subtitle: 'Resumen de avance y presupuesto',
    type: 'table',
    layout: 'single',
    content: {
      tables: [
        {
          id: 'proyectos-resumen',
          title: 'Proyectos en Ejecución',
          columns: [
            { key: 'nombre', label: 'Proyecto', type: 'text', sortable: true, width: '25%' },
            { key: 'avance', label: 'Avance', type: 'percentage', sortable: true, width: '15%' },
            { key: 'presupuesto', label: 'Presupuesto', type: 'currency', sortable: true, width: '20%' },
            { key: 'gastado', label: 'Ejecutado', type: 'currency', sortable: true, width: '20%' },
            { key: 'fecha_termino', label: 'Término', type: 'date', sortable: true, width: '20%' }
          ],
          data: [
            {
              nombre: 'Edificio Las Condes',
              avance: 65,
              presupuesto: 2500000000,
              gastado: 1625000000,
              fecha_termino: '2024-08-30'
            },
            {
              nombre: 'Centro Comercial Plaza Norte',
              avance: 25,
              presupuesto: 4200000000,
              gastado: 1050000000,
              fecha_termino: '2024-12-15'
            },
            {
              nombre: 'Hospital Regional Valparaíso',
              avance: 40,
              presupuesto: 3100000000,
              gastado: 1240000000,
              fecha_termino: '2024-06-30'
            }
          ],
          summary: {
            totals: {
              presupuesto: 9800000000,
              gastado: 3915000000
            },
            averages: {
              avance: 43.3
            }
          }
        }
      ]
    }
  }
]

// Secciones para reporte de avance
const progressSections: ReportSection[] = [
  {
    id: 'metricas-avance',
    title: 'Métricas de Avance',
    subtitle: 'Indicadores de progreso del proyecto',
    type: 'kpis',
    layout: 'grid-3',
    content: {
      kpis: [
        {
          id: 'avance-fisico',
          title: 'Avance Físico',
          value: 65.2,
          type: 'percentage',
          status: 'good',
          trend: {
            direction: 'up',
            percentage: 8.5,
            period: 'último mes'
          },
          target: 70,
          description: 'Porcentaje de obra ejecutada'
        },
        {
          id: 'avance-financiero',
          title: 'Avance Financiero',
          value: 62.8,
          type: 'percentage',
          status: 'warning',
          trend: {
            direction: 'up',
            percentage: 6.2,
            period: 'último mes'
          },
          target: 65,
          description: 'Porcentaje del presupuesto ejecutado'
        },
        {
          id: 'cronograma',
          title: 'Cumplimiento Cronograma',
          value: 94.5,
          type: 'percentage',
          status: 'good',
          trend: {
            direction: 'stable',
            percentage: 0.5,
            period: 'último mes'
          },
          target: 95,
          description: 'Actividades completadas a tiempo'
        }
      ]
    }
  },
  {
    id: 'avance-etapas',
    title: 'Avance por Etapas',
    subtitle: 'Progreso de las principales fases de construcción',
    type: 'charts',
    layout: 'single',
    content: {
      charts: [
        {
          id: 'gantt-etapas',
          title: 'Cronograma de Etapas Principales',
          type: 'bar',
          size: 'xl',
          data: [
            { etapa: 'Excavación', planificado: 100, ejecutado: 100, inicio: '2024-01-01', fin: '2024-01-15' },
            { etapa: 'Cimientos', planificado: 100, ejecutado: 100, inicio: '2024-01-16', fin: '2024-02-10' },
            { etapa: 'Estructura', planificado: 80, ejecutado: 75, inicio: '2024-02-11', fin: '2024-04-30' },
            { etapa: 'Albañilería', planificado: 40, ejecutado: 35, inicio: '2024-03-01', fin: '2024-06-15' },
            { etapa: 'Instalaciones', planificado: 20, ejecutado: 15, inicio: '2024-04-01', fin: '2024-07-15' },
            { etapa: 'Terminaciones', planificado: 5, ejecutado: 0, inicio: '2024-06-01', fin: '2024-08-30' }
          ],
          config: {
            xAxis: 'etapa',
            colors: ['#3B82F6', '#10B981'],
            showLegend: true,
            showValues: true
          }
        }
      ]
    }
  },
  {
    id: 'recursos-materiales',
    title: 'Consumo de Recursos',
    subtitle: 'Uso de materiales y mano de obra',
    type: 'mixed',
    layout: 'grid-2',
    content: {
      mixed: [
        {
          id: 'materiales-principales',
          title: 'Consumo de Materiales Principales',
          type: 'donut',
          size: 'md',
          data: [
            { material: 'Hormigón', consumido: 1250, planificado: 1500, unidad: 'm³' },
            { material: 'Acero', consumido: 85, planificado: 120, unidad: 'ton' },
            { material: 'Ladrillo', consumido: 180000, planificado: 250000, unidad: 'unid' },
            { material: 'Cemento', consumido: 750, planificado: 900, unidad: 'sacos' }
          ],
          config: {
            showLegend: true,
            colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6']
          }
        } as any,
        {
          id: 'horas-trabajadas',
          title: 'Horas de Trabajo por Especialidad',
          value: '4,250 hrs',
          type: 'text',
          status: 'info',
          trend: {
            direction: 'up',
            percentage: 12,
            period: 'último mes'
          },
          description: 'Total de horas trabajadas en el proyecto'
        }
      ]
    }
  }
]

// Story Wrapper para manejo de estado
const ReportWrapper = ({ children, ...props }: any) => {
  const handleExport = (config: any) => {
    console.log('Exportando reporte:', config)
    // Simular exportación
    setTimeout(() => {
      console.log('Reporte exportado exitosamente')
    }, 2000)
  }

  const handleRefresh = () => {
    console.log('Actualizando reporte...')
  }

  const handleSectionToggle = (sectionId: string, visible: boolean) => {
    console.log(`Sección ${sectionId}:`, visible ? 'visible' : 'oculta')
  }

  return (
    <ReportTemplate
      {...props}
      onExport={handleExport}
      onRefresh={handleRefresh}
      onSectionToggle={handleSectionToggle}
    />
  )
}

// Historias principales
export const ExecutiveReport: Story = {
  render: (args) => (
    <ReportWrapper
      {...args}
      report={executiveReport}
      sections={executiveSections}
      layout="dashboard"
      role="gerencia"
      enableExport={true}
      exportOptions={[
        { format: 'pdf', fileName: 'reporte-ejecutivo-q1-2024.pdf', includeCharts: true, template: 'executive' },
        { format: 'excel', fileName: 'datos-ejecutivos-q1-2024.xlsx', includeRawData: true },
        { format: 'print', includeCharts: true }
      ]}
      permissions={{
        canExport: true,
        canModify: true,
        canShare: true
      }}
      companyName="Constructora ABC Ltda."
    />
  )
}

export const ProjectProgressReport: Story = {
  render: (args) => (
    <ReportWrapper
      {...args}
      report={progressReport}
      sections={progressSections}
      layout="detailed"
      role="jefe_terreno"
      enableExport={true}
      exportOptions={[
        { format: 'pdf', fileName: 'avance-edificio-las-condes.pdf', includeCharts: true, template: 'detailed' },
        { format: 'excel', fileName: 'datos-avance-enero-2024.xlsx' }
      ]}
      permissions={{
        canExport: true,
        canModify: false,
        canShare: true
      }}
    />
  )
}

export const QualityControlReport: Story = {
  render: (args) => (
    <ReportWrapper
      {...args}
      report={{
        ...progressReport,
        title: 'Reporte de Control de Calidad',
        description: 'Inspecciones, pruebas y cumplimiento normativo',
        type: 'quality'
      }}
      sections={[
        {
          id: 'metricas-calidad',
          title: 'Métricas de Calidad',
          type: 'kpis',
          layout: 'grid-4',
          content: {
            kpis: [
              {
                id: 'pruebas-hormigon',
                title: 'Pruebas de Hormigón',
                value: 45,
                type: 'number',
                status: 'good',
                description: 'Pruebas realizadas este mes'
              },
              {
                id: 'cumplimiento-norma',
                title: 'Cumplimiento Normativo',
                value: 98.5,
                type: 'percentage',
                status: 'good',
                target: 95
              },
              {
                id: 'no-conformidades',
                title: 'No Conformidades',
                value: 3,
                type: 'number',
                status: 'warning',
                description: 'Detectadas y en proceso de corrección'
              },
              {
                id: 'inspecciones',
                title: 'Inspecciones Realizadas',
                value: 28,
                type: 'number',
                status: 'info',
                description: 'Inspecciones programadas y adicionales'
              }
            ]
          }
        },
        {
          id: 'resultados-pruebas',
          title: 'Resultados de Pruebas',
          type: 'table',
          layout: 'single',
          content: {
            tables: [
              {
                id: 'pruebas-materiales',
                title: 'Pruebas de Materiales - Enero 2024',
                columns: [
                  { key: 'fecha', label: 'Fecha', type: 'date', width: '15%' },
                  { key: 'material', label: 'Material', type: 'text', width: '20%' },
                  { key: 'prueba', label: 'Tipo de Prueba', type: 'text', width: '25%' },
                  { key: 'resultado', label: 'Resultado', type: 'number', width: '15%' },
                  { key: 'norma', label: 'Norma', type: 'text', width: '15%' },
                  { key: 'estado', label: 'Estado', type: 'text', width: '10%' }
                ],
                data: [
                  {
                    fecha: '2024-01-15',
                    material: 'Hormigón H25',
                    prueba: 'Resistencia a compresión',
                    resultado: 28.5,
                    norma: '≥25 MPa',
                    estado: 'Aprobado'
                  },
                  {
                    fecha: '2024-01-18',
                    material: 'Acero A63-42H',
                    prueba: 'Resistencia a tracción',
                    resultado: 520,
                    norma: '≥420 MPa',
                    estado: 'Aprobado'
                  },
                  {
                    fecha: '2024-01-22',
                    material: 'Ladrillo Fiscal',
                    prueba: 'Absorción de agua',
                    resultado: 12.5,
                    norma: '≤15%',
                    estado: 'Aprobado'
                  }
                ]
              }
            ]
          }
        }
      ]}
      layout="detailed"
      role="control_calidad"
    />
  )
}

export const FinancialSummary: Story = {
  render: (args) => (
    <ReportWrapper
      {...args}
      report={{
        ...executiveReport,
        title: 'Resumen Financiero Mensual',
        description: 'Estado financiero detallado de todos los proyectos',
        type: 'financial'
      }}
      sections={[
        {
          id: 'metricas-financieras',
          title: 'Indicadores Financieros',
          type: 'kpis',
          layout: 'grid-4',
          content: {
            kpis: [
              {
                id: 'facturacion',
                title: 'Facturación Mensual',
                value: 1075000000,
                type: 'currency',
                status: 'good',
                trend: { direction: 'up', percentage: 15.2, period: 'vs mes anterior' }
              },
              {
                id: 'costos',
                title: 'Costos Operacionales',
                value: 850000000,
                type: 'currency',
                status: 'info',
                trend: { direction: 'up', percentage: 8.3, period: 'vs mes anterior' }
              },
              {
                id: 'utilidad',
                title: 'Utilidad Bruta',
                value: 225000000,
                type: 'currency',
                status: 'good',
                trend: { direction: 'up', percentage: 45.2, period: 'vs mes anterior' }
              },
              {
                id: 'flujo-caja',
                title: 'Flujo de Caja',
                value: 180000000,
                type: 'currency',
                status: 'good',
                trend: { direction: 'up', percentage: 12.8, period: 'vs mes anterior' }
              }
            ]
          }
        }
      ]}
      layout="dashboard"
      role="oficina_tecnica"
      watermark="CONFIDENCIAL"
    />
  )
}

export const PrintOptimized: Story = {
  render: (args) => (
    <ReportWrapper
      {...args}
      report={executiveReport}
      sections={executiveSections}
      layout="detailed"
      role="gerencia"
      exportMode="print"
      size="sm"
      companyLogo="/logo-constructora.png"
      watermark="DOCUMENTO OFICIAL"
    />
  ),
  parameters: {
    backgrounds: { default: 'white' }
  }
}

export const MobileReport: Story = {
  render: (args) => (
    <div className="max-w-sm mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <ReportWrapper
        {...args}
        report={{
          ...progressReport,
          title: 'Avance Semanal',
          description: 'Resumen ejecutivo móvil'
        }}
        sections={progressSections.slice(0, 1)}
        layout="detailed"
        role="jefe_terreno"
        size="sm"
        showNavigation={false}
        exportOptions={[
          { format: 'pdf', includeCharts: true }
        ]}
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const LoadingReport: Story = {
  args: {
    report: executiveReport,
    sections: [],
    layout: 'dashboard',
    role: 'gerencia',
    isLoading: true
  }
}

export const ErrorReport: Story = {
  args: {
    report: executiveReport,
    sections: [],
    layout: 'dashboard',
    role: 'gerencia',
    error: 'No se pudieron cargar los datos del reporte. Error de conexión con la base de datos.'
  }
}