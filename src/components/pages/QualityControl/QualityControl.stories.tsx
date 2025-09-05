import type { Meta, StoryObj } from '@storybook/react'
import { QualityControl } from './QualityControl'
import type { QualityControlProps, InspeccionCalidad, TemplateChecklist } from './QualityControl'

const meta: Meta<typeof QualityControl> = {
  title: 'Pages/QualityControl',
  component: QualityControl,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Control de calidad con checklists digitales, captura de fotos y workflows de aprobación optimizado para móvil.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    'usuario.rol': {
      control: { type: 'select' },
      options: ['gerencia', 'jefe_terreno', 'bodega', 'oficina_tecnica', 'control_calidad'],
      description: 'Rol del usuario que determina permisos y funcionalidades'
    },
    mode: {
      control: { type: 'radio' },
      options: ['dashboard', 'inspection', 'checklist', 'photos'],
      description: 'Modo de visualización'
    },
    esMobile: {
      control: { type: 'boolean' },
      description: 'Vista móvil optimizada para inspecciones de campo'
    },
    modoOffline: {
      control: { type: 'boolean' },
      description: 'Simula funcionamiento offline'
    }
  }
}

export default meta
type Story = StoryObj<typeof QualityControl>

// Templates de checklist de ejemplo
const templatesChecklist: TemplateChecklist[] = [
  {
    id: 'template-estructural',
    nombre: 'Inspección Estructural - Hormigón Armado',
    descripcion: 'Checklist para inspección de elementos estructurales de hormigón armado',
    tipoInspeccion: 'estructural',
    especialidad: 'Estructura',
    version: '2.1',
    vigente: true,
    items: [
      {
        id: 'est-001',
        codigo: 'EST-001',
        descripcion: 'Verificar dimensiones de columnas según planos',
        categoria: 'Estructura',
        subcategoria: 'Columnas',
        obligatorio: true,
        tipoVerificacion: 'medicion',
        criterioAprobacion: 'Dimensiones dentro de tolerancia ±5mm',
        normativaReferencia: 'NCh430 Of.2008',
        requiereFoto: true,
        requiereDocumento: false,
        unidadMedida: 'mm',
        rangoAceptable: { min: 295, max: 305 }
      },
      {
        id: 'est-002',
        codigo: 'EST-002',
        descripcion: 'Verificar armadura de refuerzo según especificaciones',
        categoria: 'Estructura',
        subcategoria: 'Armaduras',
        obligatorio: true,
        tipoVerificacion: 'visual',
        criterioAprobacion: 'Armadura instalada conforme a planos, sin oxidación',
        normativaReferencia: 'NCh204 Of.2006',
        requiereFoto: true,
        requiereDocumento: true
      },
      {
        id: 'est-003',
        codigo: 'EST-003',
        descripcion: 'Verificar calidad del hormigón fresco',
        categoria: 'Estructura',
        subcategoria: 'Hormigón',
        obligatorio: true,
        tipoVerificacion: 'prueba',
        criterioAprobacion: 'Slump entre 8-12 cm, temperatura <32°C',
        normativaReferencia: 'NCh1019 Of.2009',
        requiereFoto: false,
        requiereDocumento: true,
        unidadMedida: 'cm',
        rangoAceptable: { min: 8, max: 12 }
      }
    ],
    metadata: {
      creadoPor: 'sofia.ramirez@constructora.cl',
      fechaCreacion: '2023-11-15',
      aprobadoPor: 'patricia.sanchez@constructora.cl',
      fechaAprobacion: '2023-11-20'
    }
  },
  {
    id: 'template-instalaciones',
    nombre: 'Inspección de Instalaciones Eléctricas',
    descripcion: 'Checklist para verificación de instalaciones eléctricas',
    tipoInspeccion: 'instalaciones',
    especialidad: 'Electricidad',
    version: '1.8',
    vigente: true,
    items: [
      {
        id: 'ele-001',
        codigo: 'ELE-001',
        descripcion: 'Verificar conexiones en tablero principal',
        categoria: 'Instalaciones',
        subcategoria: 'Electricidad',
        obligatorio: true,
        tipoVerificacion: 'visual',
        criterioAprobacion: 'Conexiones firmes, cables identificados, sin recalentamiento',
        normativaReferencia: 'NCh4/2003',
        requiereFoto: true,
        requiereDocumento: false
      },
      {
        id: 'ele-002',
        codigo: 'ELE-002',
        descripcion: 'Medir resistencia de puesta a tierra',
        categoria: 'Instalaciones',
        subcategoria: 'Electricidad',
        obligatorio: true,
        tipoVerificacion: 'medicion',
        criterioAprobacion: 'Resistencia ≤ 25 Ohms',
        normativaReferencia: 'NCh4/2003',
        requiereFoto: false,
        requiereDocumento: true,
        unidadMedida: 'Ω',
        rangoAceptable: { min: 0, max: 25 }
      }
    ],
    metadata: {
      creadoPor: 'carlos.mendoza@constructora.cl',
      fechaCreacion: '2023-10-20',
      aprobadoPor: 'patricia.sanchez@constructora.cl',
      fechaAprobacion: '2023-10-25'
    }
  }
]

// Inspecciones de ejemplo
const inspeccionesEjemplo: InspeccionCalidad[] = [
  {
    id: 'insp-001',
    codigo: 'INS-2024-001',
    nombre: 'Inspección Estructural Torre A - Piso 8',
    descripcion: 'Inspección de columnas y vigas del piso 8 de la Torre A',
    proyectoId: 'proj-001',
    proyectoNombre: 'Edificio Residencial Las Condes',
    tipoInspeccion: 'estructural',
    especialidad: 'Estructura',
    partidaConstructiva: 'Estructura Piso 8',
    ubicacionFisica: 'Torre A - Piso 8 - Sector Norte',
    nivel: '8',
    sector: 'Norte',
    fechaProgramada: new Date().toISOString(),
    fechaRealizada: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duracionEstimada: 120,
    duracionReal: 135,
    inspector: {
      id: 'user-calidad',
      nombre: 'Sofía Ramírez',
      certificaciones: ['Inspector Nivel II', 'NCh430'],
      firma: 'data:image/png;base64,signature'
    },
    supervisorAprobacion: {
      id: 'user-supervisor',
      nombre: 'Ing. Pedro Castillo',
      fechaAprobacion: new Date().toISOString(),
      firma: 'data:image/png;base64,supervisor-signature'
    },
    estado: 'completada',
    avance: 100,
    checklistItems: [
      {
        id: 'item-001',
        codigo: 'EST-001',
        descripcion: 'Verificar dimensiones de columnas según planos',
        categoria: 'Estructura',
        subcategoria: 'Columnas',
        obligatorio: true,
        tipoVerificacion: 'medicion',
        criterioAprobacion: 'Dimensiones dentro de tolerancia ±5mm',
        normativaReferencia: 'NCh430 Of.2008',
        estado: 'aprobado',
        resultado: 'Dimensiones verificadas: 300mm x 300mm (dentro de tolerancia)',
        valor: 300,
        unidadMedida: 'mm',
        rangoAceptable: { min: 295, max: 305 },
        requiereFoto: true,
        fotos: [
          {
            id: 'foto-001',
            url: '/images/inspeccion/columna-p8-001.jpg',
            timestamp: new Date().toISOString(),
            coordenadas: { lat: -33.4084, lng: -70.5420 },
            observaciones: 'Columna C-8.1 vista norte'
          }
        ],
        requiereDocumento: false,
        documentos: [],
        inspector: 'Sofía Ramírez',
        fechaInspeccion: new Date().toISOString(),
        observaciones: ['Columna en excelente estado', 'Sin fisuras visibles'],
        noConformidades: [],
        metadata: {
          version: '1.0',
          fechaCreacion: '2024-01-22',
          ultimaModificacion: new Date().toISOString(),
          modificadoPor: 'sofia.ramirez@constructora.cl'
        }
      },
      {
        id: 'item-002',
        codigo: 'EST-002',
        descripcion: 'Verificar armadura de refuerzo según especificaciones',
        categoria: 'Estructura',
        subcategoria: 'Armaduras',
        obligatorio: true,
        tipoVerificacion: 'visual',
        criterioAprobacion: 'Armadura instalada conforme a planos, sin oxidación',
        normativaReferencia: 'NCh204 Of.2006',
        estado: 'rechazado',
        resultado: 'Armadura presenta oxidación superficial en sector este',
        requiereFoto: true,
        fotos: [
          {
            id: 'foto-002',
            url: '/images/inspeccion/armadura-oxidacion-001.jpg',
            timestamp: new Date().toISOString(),
            coordenadas: { lat: -33.4084, lng: -70.5420 },
            observaciones: 'Oxidación en armadura sector este'
          }
        ],
        requiereDocumento: true,
        documentos: [],
        inspector: 'Sofía Ramírez',
        fechaInspeccion: new Date().toISOString(),
        observaciones: ['Oxidación superficial detectada', 'Requiere tratamiento'],
        noConformidades: [
          {
            id: 'nc-001',
            descripcion: 'Oxidación superficial en armadura de refuerzo sector este',
            severidad: 'media',
            fechaDeteccion: new Date().toISOString(),
            responsableCorreccion: 'Carlos Mendoza',
            estadoCorreccion: 'abierta'
          }
        ],
        metadata: {
          version: '1.0',
          fechaCreacion: '2024-01-22',
          ultimaModificacion: new Date().toISOString(),
          modificadoPor: 'sofia.ramirez@constructora.cl'
        }
      }
    ],
    itemsAprobados: 1,
    itemsRechazados: 1,
    itemsPendientes: 0,
    resultadoGeneral: 'aprobado_con_observaciones',
    puntajeCalidad: 85,
    cumplimientoNormativa: 85,
    condicionesAmbientales: {
      temperatura: 22,
      humedad: 65,
      viento: 'Calmo',
      visibilidad: 'Buena'
    },
    equiposUtilizados: ['Flexómetro', 'Cámara Digital', 'Tablet'],
    coordenadas: { lat: -33.4084, lng: -70.5420 },
    altitud: 650,
    orientacion: 'Norte',
    proximaInspeccion: '2024-02-15',
    requiereSeguimiento: true,
    diasParaSeguimiento: 14,
    metadata: {
      version: '1.2',
      fechaCreacion: '2024-01-22',
      ultimaModificacion: new Date().toISOString(),
      creadoPor: 'sofia.ramirez@constructora.cl',
      sincronizado: true
    }
  },
  {
    id: 'insp-002',
    codigo: 'INS-2024-002',
    nombre: 'Inspección Instalaciones Eléctricas - Piso 5',
    descripcion: 'Verificación de instalaciones eléctricas piso 5',
    proyectoId: 'proj-001',
    proyectoNombre: 'Edificio Residencial Las Condes',
    tipoInspeccion: 'instalaciones',
    especialidad: 'Electricidad',
    partidaConstructiva: 'Instalaciones Eléctricas Piso 5',
    ubicacionFisica: 'Torre A - Piso 5 - Tablero Principal',
    nivel: '5',
    fechaProgramada: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duracionEstimada: 90,
    inspector: {
      id: 'user-electricista',
      nombre: 'Miguel Torres',
      certificaciones: ['Electricista Clase A', 'SEC'],
      firma: 'data:image/png;base64,electricista-signature'
    },
    estado: 'programada',
    avance: 0,
    checklistItems: templatesChecklist[1].items.map(item => ({
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      estado: 'pendiente' as const,
      fotos: [],
      documentos: [],
      inspector: '',
      observaciones: [],
      noConformidades: [],
      metadata: {
        version: '1.0',
        fechaCreacion: new Date().toISOString(),
        ultimaModificacion: new Date().toISOString(),
        modificadoPor: 'sistema'
      }
    })),
    itemsAprobados: 0,
    itemsRechazados: 0,
    itemsPendientes: 2,
    resultadoGeneral: 'aprobado',
    puntajeCalidad: 0,
    cumplimientoNormativa: 0,
    equiposUtilizados: ['Multímetro', 'Telurómetro'],
    coordenadas: { lat: -33.4084, lng: -70.5420 },
    requiereSeguimiento: false,
    metadata: {
      version: '1.0',
      fechaCreacion: '2024-01-20',
      ultimaModificacion: '2024-01-20',
      creadoPor: 'miguel.torres@constructora.cl',
      sincronizado: true
    }
  },
  {
    id: 'insp-003',
    codigo: 'INS-2024-003',
    nombre: 'Inspección de Seguridad - Andamios',
    descripcion: 'Verificación de condiciones de seguridad en andamios',
    proyectoId: 'proj-002',
    proyectoNombre: 'Centro Comercial Plaza Norte',
    tipoInspeccion: 'seguridad',
    especialidad: 'Prevención de Riesgos',
    ubicacionFisica: 'Fachada Norte - Andamio Nivel 3',
    nivel: '3',
    fechaProgramada: new Date().toISOString(),
    duracionEstimada: 60,
    inspector: {
      id: 'user-prevencion',
      nombre: 'Ana Rodríguez',
      certificaciones: ['Experto en Prevención', 'ACHS'],
      firma: 'data:image/png;base64,prevencion-signature'
    },
    estado: 'en_proceso',
    avance: 30,
    checklistItems: [
      {
        id: 'seg-001',
        codigo: 'SEG-001',
        descripcion: 'Verificar estabilidad y anclaje de andamio',
        categoria: 'Seguridad',
        subcategoria: 'Andamios',
        obligatorio: true,
        tipoVerificacion: 'visual',
        criterioAprobacion: 'Andamio estable, anclajes seguros, sin deformaciones',
        normativaReferencia: 'DS 594',
        estado: 'aprobado',
        resultado: 'Andamio estable y correctamente anclado',
        requiereFoto: true,
        fotos: [
          {
            id: 'foto-seg-001',
            url: '/images/inspeccion/andamio-anclaje-001.jpg',
            timestamp: new Date().toISOString(),
            coordenadas: { lat: -33.3617, lng: -70.6394 }
          }
        ],
        requiereDocumento: false,
        documentos: [],
        inspector: 'Ana Rodríguez',
        fechaInspeccion: new Date().toISOString(),
        observaciones: ['Andamio en buen estado'],
        noConformidades: [],
        metadata: {
          version: '1.0',
          fechaCreacion: '2024-01-22',
          ultimaModificacion: new Date().toISOString(),
          modificadoPor: 'ana.rodriguez@constructora.cl'
        }
      }
    ],
    itemsAprobados: 1,
    itemsRechazados: 0,
    itemsPendientes: 2,
    resultadoGeneral: 'aprobado',
    puntajeCalidad: 95,
    cumplimientoNormativa: 95,
    equiposUtilizados: ['Cámara Digital', 'Nivel'],
    coordenadas: { lat: -33.3617, lng: -70.6394 },
    requiereSeguimiento: false,
    metadata: {
      version: '1.0',
      fechaCreacion: '2024-01-22',
      ultimaModificacion: new Date().toISOString(),
      creadoPor: 'ana.rodriguez@constructora.cl',
      sincronizado: false
    }
  }
]

// Usuarios de ejemplo
const usuarioControlCalidad = {
  id: 'user-calidad',
  nombre: 'Sofía Ramírez',
  rol: 'control_calidad' as const,
  certificaciones: ['Inspector Nivel II', 'NCh430', 'NACE Level 2'],
  proyectosAsignados: ['proj-001', 'proj-002', 'proj-003'],
  permisos: [
    'crear_inspeccion',
    'realizar_inspeccion',
    'aprobar_inspeccion',
    'crear_no_conformidad',
    'generar_reportes',
    'ver_todas_inspecciones'
  ],
  firmaDigital: 'data:image/png;base64,signature-sofia'
}

const usuarioJefeTerreno = {
  id: 'user-terreno',
  nombre: 'Carlos Mendoza',
  rol: 'jefe_terreno' as const,
  certificaciones: ['Constructor Civil', 'Jefe de Obra'],
  proyectosAsignados: ['proj-001', 'proj-003'],
  permisos: [
    'crear_inspeccion',
    'realizar_inspeccion',
    'ver_inspecciones_proyecto',
    'corregir_no_conformidades'
  ],
  firmaDigital: 'data:image/png;base64,signature-carlos'
}

const configuracionEjemplo = {
  fotosObligatorias: true,
  gpsObligatorio: true,
  firmaDigitalObligatoria: true,
  sincronizacionOffline: true,
  alertasVencimiento: true,
  diasAlertaVencimiento: 7,
  requiereAprobacionSupervisor: true,
  calidadFoto: 'alta' as const,
  marcaDeAgua: true,
  compressionAutomatica: true,
  formatoReportePorDefecto: 'pdf' as const,
  incluirFotosEnReporte: true,
  logoEmpresa: '/logo-empresa.png'
}

// Story Wrapper
const QualityControlWrapper = ({ children, ...props }: any) => {
  const handleInspeccionCrear = async (inspeccion: any) => {
    console.log('Crear inspección:', inspeccion)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleInspeccionActualizar = async (id: string, inspeccion: any) => {
    console.log('Actualizar inspección:', id, inspeccion)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const handleInspeccionIniciar = async (id: string) => {
    console.log('Iniciar inspección:', id)
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  const handleInspeccionCompletar = async (id: string) => {
    console.log('Completar inspección:', id)
    await new Promise(resolve => setTimeout(resolve, 800))
  }

  const handleChecklistItemActualizar = async (inspeccionId: string, itemId: string, datos: any) => {
    console.log('Actualizar item:', inspeccionId, itemId, datos)
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  const handleFotoSubir = async (inspeccionId: string, itemId: string, foto: File) => {
    console.log('Subir foto:', inspeccionId, itemId, foto.name)
    // Simular subida
    await new Promise(resolve => setTimeout(resolve, 1500))
    return `/images/inspecciones/${inspeccionId}/${itemId}/${foto.name}`
  }

  const handleNoConformidadCrear = async (inspeccionId: string, itemId: string, noConformidad: any) => {
    console.log('Crear no conformidad:', inspeccionId, itemId, noConformidad)
    await new Promise(resolve => setTimeout(resolve, 600))
  }

  const handleGenerarReporte = async (inspeccionId: string, formato: string) => {
    console.log(`Generar reporte ${formato} para inspección:`, inspeccionId)
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const handleExportarDatos = async (inspecciones: any[], formato: string) => {
    console.log(`Exportar ${inspecciones.length} inspecciones en formato ${formato}`)
    await new Promise(resolve => setTimeout(resolve, 1500))
  }

  const handleCapturaFoto = (callback: (file: File) => void) => {
    // Simular captura de foto
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, 640, 480)
      ctx.fillStyle = '#333'
      ctx.font = '24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Foto de Inspección', 320, 240)
      ctx.fillText(new Date().toLocaleString('es-CL'), 320, 280)
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `inspeccion-${Date.now()}.jpg`, { type: 'image/jpeg' })
        callback(file)
      }
    }, 'image/jpeg', 0.8)
  }

  const handleCapturaUbicacion = (callback: (coords: GeolocationCoordinates) => void) => {
    // Simular captura de ubicación
    const mockCoords: GeolocationCoordinates = {
      latitude: -33.4084 + (Math.random() - 0.5) * 0.01,
      longitude: -70.5420 + (Math.random() - 0.5) * 0.01,
      accuracy: 5,
      altitude: 650,
      altitudeAccuracy: 10,
      heading: null,
      speed: null
    }
    setTimeout(() => callback(mockCoords), 1000)
  }

  const handleFirmaDigital = (callback: (firma: string) => void) => {
    // Simular firma digital
    setTimeout(() => {
      callback('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==')
    }, 500)
  }

  return (
    <QualityControl
      {...props}
      inspecciones={inspeccionesEjemplo}
      templatesChecklist={templatesChecklist}
      configuracion={configuracionEjemplo}
      onInspeccionCrear={handleInspeccionCrear}
      onInspeccionActualizar={handleInspeccionActualizar}
      onInspeccionIniciar={handleInspeccionIniciar}
      onInspeccionCompletar={handleInspeccionCompletar}
      onChecklistItemActualizar={handleChecklistItemActualizar}
      onFotoSubir={handleFotoSubir}
      onNoConformidadCrear={handleNoConformidadCrear}
      onGenerarReporte={handleGenerarReporte}
      onExportarDatos={handleExportarDatos}
      onCapturaFoto={handleCapturaFoto}
      onCapturaUbicacion={handleCapturaUbicacion}
      onFirmaDigital={handleFirmaDigital}
    />
  )
}

// Historias principales
export const DashboardCalidad: Story = {
  render: (args) => (
    <QualityControlWrapper
      {...args}
      usuario={usuarioControlCalidad}
      mode="dashboard"
    />
  )
}

export const InspeccionEstructural: Story = {
  render: (args) => (
    <QualityControlWrapper
      {...args}
      usuario={usuarioControlCalidad}
      mode="inspection"
      inspectionType="structural"
    />
  )
}

export const ChecklistEnProceso: Story = {
  render: (args) => (
    <QualityControlWrapper
      {...args}
      usuario={usuarioControlCalidad}
      mode="checklist"
    />
  )
}

export const GaleriaFotos: Story = {
  render: (args) => (
    <QualityControlWrapper
      {...args}
      usuario={usuarioControlCalidad}
      mode="photos"
    />
  )
}

export const VistaMobile: Story = {
  render: (args) => (
    <div className="max-w-sm mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <QualityControlWrapper
        {...args}
        usuario={usuarioControlCalidad}
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

export const InspeccionMobile: Story = {
  render: (args) => (
    <div className="max-w-sm mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <QualityControlWrapper
        {...args}
        usuario={usuarioControlCalidad}
        esMobile={true}
        mode="checklist"
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const ModoOffline: Story = {
  render: (args) => (
    <QualityControlWrapper
      {...args}
      usuario={usuarioControlCalidad}
      modoOffline={true}
      esMobile={true}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const JefeTerreno: Story = {
  render: (args) => (
    <QualityControlWrapper
      {...args}
      usuario={usuarioJefeTerreno}
      mode="dashboard"
    />
  )
}

export const InspeccionConNoConformidades: Story = {
  render: (args) => (
    <QualityControlWrapper
      {...args}
      usuario={usuarioControlCalidad}
      inspecciones={inspeccionesEjemplo.map(insp => ({
        ...insp,
        checklistItems: insp.checklistItems.map(item => ({
          ...item,
          noConformidades: item.noConformidades.length > 0 ? item.noConformidades : [
            {
              id: 'nc-demo',
              descripcion: 'Ejemplo de no conformidad para demostración',
              severidad: 'media' as const,
              fechaDeteccion: new Date().toISOString(),
              responsableCorreccion: 'Carlos Mendoza',
              estadoCorreccion: 'abierta' as const
            }
          ]
        }))
      }))}
    />
  )
}

export const InspeccionesPendientes: Story = {
  render: (args) => (
    <QualityControlWrapper
      {...args}
      usuario={usuarioControlCalidad}
      inspecciones={inspeccionesEjemplo.map(insp => ({
        ...insp,
        estado: 'programada' as const,
        fechaProgramada: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }))}
    />
  )
}

export const VistaCargando: Story = {
  render: (args) => (
    <QualityControl
      {...args}
      usuario={usuarioControlCalidad}
      inspecciones={[]}
      templatesChecklist={[]}
      configuracion={configuracionEjemplo}
      isLoading={true}
    />
  )
}

export const VistaError: Story = {
  render: (args) => (
    <QualityControl
      {...args}
      usuario={usuarioControlCalidad}
      inspecciones={[]}
      templatesChecklist={[]}
      configuracion={configuracionEjemplo}
      error="No se pudo cargar la información de inspecciones. Verifique su conexión."
    />
  )
}

export const SinInspecciones: Story = {
  render: (args) => (
    <QualityControlWrapper
      {...args}
      usuario={usuarioControlCalidad}
      inspecciones={[]}
    />
  )
}