import type { Meta, StoryObj } from '@storybook/react'
import { ProjectManagement } from './ProjectManagement'
import type { ProjectManagementProps, Proyecto, PartidaConstructiva } from './ProjectManagement'

const meta: Meta<typeof ProjectManagement> = {
  title: 'Pages/ProjectManagement',
  component: ProjectManagement,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Gestión completa de proyectos con CRUD, workflow, equipos y materiales integrados.'
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
      options: ['list', 'detail', 'create', 'kanban'],
      description: 'Modo de visualización'
    },
    esMobile: {
      control: { type: 'boolean' },
      description: 'Vista móvil optimizada'
    }
  }
}

export default meta
type Story = StoryObj<typeof ProjectManagement>

// Datos de ejemplo realistas para construcción chilena
const proyectosEjemplo: Proyecto[] = [
  {
    id: 'proj-001',
    nombre: 'Edificio Residencial Las Condes',
    codigo: 'ELC-2024-001',
    descripcion: 'Edificio residencial de 15 pisos con 120 departamentos, áreas comunes y estacionamientos subterráneos.',
    tipo: 'residencial',
    estado: 'estructura',
    prioridad: 'alta',
    ubicacion: {
      direccion: 'Av. Apoquindo',
      numero: '4501',
      comuna: 'Las Condes',
      region: 'Metropolitana',
      codigoPostal: '7550000',
      coordenadas: { lat: -33.4084, lng: -70.5420 },
      superficieTerreno: 2500,
      superficieConstruida: 18000
    },
    fechas: {
      inicio: '2024-01-15',
      terminoProgramado: '2024-08-30',
      creacion: '2023-12-01',
      ultimaModificacion: new Date().toISOString()
    },
    financiero: {
      presupuestoTotal: 2500000000,
      presupuestoEjecutado: 1570000000,
      moneda: 'CLP',
      varianzaPresupuestaria: 5.2,
      flujoEfectivo: 180000000,
      gastosAutorizados: 1650000000
    },
    avance: {
      fisico: 65.2,
      financiero: 62.8,
      cronograma: 94.5,
      partidasCompletadas: 28,
      partidasTotales: 45
    },
    equipo: {
      jefeProyecto: 'Patricia Sánchez',
      jefeTerreno: 'Carlos Mendoza',
      residenteObra: 'Miguel Torres',
      ingenieroConstruccion: 'Ana Rodríguez',
      arquitecto: 'Ricardo Valenzuela',
      totalTrabajadores: 45,
      subcontratistas: ['Hormigones del Sur S.A.', 'Instalaciones Técnicas Ltda.']
    },
    calidad: {
      inspeccionesRealizadas: 28,
      inspeccionesPendientes: 5,
      noConformidades: 2,
      observacionesAbiertas: 8,
      cumplimientoNormativa: 94.5,
      certificacionesObtenidas: ['ISO 9001', 'OHSAS 18001']
    },
    unidades: {
      total: 120,
      completadas: 48,
      enProceso: 52,
      vendidas: 95,
      disponibles: 25,
      tipos: [
        { tipo: '1D+1B', cantidad: 40, superficiePromedio: 45, precioPromedio: 65000 },
        { tipo: '2D+2B', cantidad: 60, superficiePromedio: 68, precioPromedio: 85000 },
        { tipo: '3D+2B', cantidad: 20, superficiePromedio: 95, precioPromedio: 120000 }
      ]
    },
    etiquetas: ['Hormigón Armado', 'Eficiencia Energética', 'Smart Building'],
    cliente: 'Inmobiliaria Principal S.A.',
    contrato: 'CON-2023-045',
    permisos: [
      {
        tipo: 'Permiso de Edificación',
        numero: 'PE-2023-1205',
        fechaObtencion: '2023-11-15',
        fechaVencimiento: '2025-11-15',
        estado: 'vigente'
      },
      {
        tipo: 'Permiso de Excavación',
        numero: 'PEX-2024-0012',
        fechaObtencion: '2024-01-08',
        estado: 'vigente'
      }
    ],
    metadata: {
      creadoPor: 'patricia.sanchez@constructora.cl',
      modificadoPor: 'carlos.mendoza@constructora.cl',
      version: '2.1',
      archivos: 45,
      fotos: 128,
      documentos: 32
    }
  },
  {
    id: 'proj-002',
    nombre: 'Centro Comercial Plaza Norte',
    codigo: 'PCN-2024-002',
    descripcion: 'Centro comercial de 3 niveles con 180 locales comerciales, food court, cines y estacionamiento.',
    tipo: 'comercial',
    estado: 'fundaciones',
    prioridad: 'media',
    ubicacion: {
      direccion: 'Av. Américo Vespucio',
      numero: '1501',
      comuna: 'Huechuraba',
      region: 'Metropolitana',
      coordenadas: { lat: -33.3617, lng: -70.6394 },
      superficieTerreno: 8000,
      superficieConstruida: 45000
    },
    fechas: {
      inicio: '2024-01-10',
      terminoProgramado: '2024-12-15',
      creacion: '2023-11-20',
      ultimaModificacion: new Date().toISOString()
    },
    financiero: {
      presupuestoTotal: 4200000000,
      presupuestoEjecutado: 1184000000,
      moneda: 'CLP',
      varianzaPresupuestaria: -2.1,
      flujoEfectivo: 320000000,
      gastosAutorizados: 1400000000
    },
    avance: {
      fisico: 25.8,
      financiero: 28.2,
      cronograma: 89.3,
      partidasCompletadas: 12,
      partidasTotales: 52
    },
    equipo: {
      jefeProyecto: 'Roberto Silva',
      jefeTerreno: 'María González',
      ingenieroConstruccion: 'Luis Herrera',
      arquitecto: 'Sofía Ramírez',
      totalTrabajadores: 68,
      subcontratistas: ['Estructuras Metálicas S.A.', 'Vidrios y Cristales Ltda.', 'Climatización Norte']
    },
    calidad: {
      inspeccionesRealizadas: 15,
      inspeccionesPendientes: 8,
      noConformidades: 1,
      observacionesAbiertas: 4,
      cumplimientoNormativa: 96.2,
      certificacionesObtenidas: ['LEED Gold']
    },
    etiquetas: ['Construcción Sustentable', 'Acero', 'Gran Formato'],
    cliente: 'Mall Desarrollo SpA',
    contrato: 'CON-2023-078',
    permisos: [
      {
        tipo: 'Permiso de Edificación',
        numero: 'PE-2023-2890',
        fechaObtencion: '2023-12-05',
        fechaVencimiento: '2025-12-05',
        estado: 'vigente'
      }
    ],
    metadata: {
      creadoPor: 'roberto.silva@constructora.cl',
      modificadoPor: 'maria.gonzalez@constructora.cl',
      version: '1.8',
      archivos: 78,
      fotos: 89,
      documentos: 56
    }
  },
  {
    id: 'proj-003',
    nombre: 'Hospital Regional Valparaíso',
    codigo: 'HRV-2024-003',
    descripcion: 'Ampliación del hospital con nuevas salas de emergencia, quirófanos, UCI y helipuerto.',
    tipo: 'institucional',
    estado: 'albanileria',
    prioridad: 'critica',
    ubicacion: {
      direccion: 'Av. Argentina',
      numero: '2085',
      comuna: 'Valparaíso',
      region: 'Valparaíso',
      coordenadas: { lat: -33.0458, lng: -71.6197 },
      superficieTerreno: 4200,
      superficieConstruida: 12500
    },
    fechas: {
      inicio: '2024-01-05',
      terminoProgramado: '2024-06-30',
      creacion: '2023-10-15',
      ultimaModificacion: new Date().toISOString()
    },
    financiero: {
      presupuestoTotal: 3100000000,
      presupuestoEjecutado: 1205900000,
      moneda: 'CLP',
      varianzaPresupuestaria: 1.8,
      flujoEfectivo: 145000000,
      gastosAutorizados: 1350000000
    },
    avance: {
      fisico: 40.5,
      financiero: 38.9,
      cronograma: 92.8,
      partidasCompletadas: 22,
      partidasTotales: 38
    },
    equipo: {
      jefeProyecto: 'Dr. Andrés Morales',
      jefeTerreno: 'Ana Rodríguez',
      residenteObra: 'Luis Herrera',
      ingenieroConstruccion: 'Pedro Castillo',
      arquitecto: 'Elena Morales',
      totalTrabajadores: 52,
      subcontratistas: ['Instalaciones Médicas S.A.', 'Construcción Hospitalaria Ltda.']
    },
    calidad: {
      inspeccionesRealizadas: 35,
      inspeccionesPendientes: 12,
      noConformidades: 3,
      observacionesAbiertas: 15,
      cumplimientoNormativa: 92.8,
      certificacionesObtenidas: ['Normativa Hospitalaria', 'Certificación Sísmica']
    },
    etiquetas: ['Salud', 'Normativa Estricta', 'Instalaciones Especiales'],
    cliente: 'Servicio de Salud Valparaíso San Antonio',
    contrato: 'CON-GOB-2023-012',
    permisos: [
      {
        tipo: 'Permiso de Edificación',
        numero: 'PE-VAL-2023-456',
        fechaObtencion: '2023-12-20',
        fechaVencimiento: '2025-12-20',
        estado: 'vigente'
      },
      {
        tipo: 'Permiso Sanitario',
        numero: 'PS-2023-789',
        fechaObtencion: '2024-01-03',
        fechaVencimiento: '2024-12-31',
        estado: 'vigente'
      }
    ],
    metadata: {
      creadoPor: 'andres.morales@constructora.cl',
      modificadoPor: 'ana.rodriguez@constructora.cl',
      version: '3.2',
      archivos: 156,
      fotos: 245,
      documentos: 89
    }
  },
  {
    id: 'proj-004',
    nombre: 'Conjunto Habitacional El Bosque',
    codigo: 'CHB-2024-004',
    descripcion: 'Proyecto habitacional social de 80 casas de 2 y 3 dormitorios con áreas verdes y equipamiento.',
    tipo: 'residencial',
    estado: 'excavacion',
    prioridad: 'media',
    ubicacion: {
      direccion: 'Av. José Miguel Carrera',
      numero: '8950',
      comuna: 'El Bosque',
      region: 'Metropolitana',
      coordenadas: { lat: -33.5617, lng: -70.6792 },
      superficieTerreno: 12000,
      superficieConstruida: 6400
    },
    fechas: {
      inicio: '2023-11-20',
      terminoProgramado: '2024-10-31',
      creacion: '2023-08-15',
      ultimaModificacion: new Date().toISOString()
    },
    financiero: {
      presupuestoTotal: 1600000000,
      presupuestoEjecutado: 299200000,
      moneda: 'UF',
      varianzaPresupuestaria: -1.2,
      flujoEfectivo: 85000000,
      gastosAutorizados: 350000000
    },
    avance: {
      fisico: 15.2,
      financiero: 18.7,
      cronograma: 78.5,
      partidasCompletadas: 8,
      partidasTotales: 32
    },
    equipo: {
      jefeProyecto: 'Carmen Soto',
      jefeTerreno: 'Pedro Morales',
      residenteObra: 'Miguel Torres',
      arquitecto: 'Laura Vega',
      totalTrabajadores: 28,
      subcontratistas: ['Prefabricados Sur', 'Paisajismo Verde Ltda.']
    },
    calidad: {
      inspeccionesRealizadas: 8,
      inspeccionesPendientes: 3,
      noConformidades: 0,
      observacionesAbiertas: 2,
      cumplimientoNormativa: 98.1,
      certificacionesObtenidas: ['Vivienda Social Sustentable']
    },
    unidades: {
      total: 80,
      completadas: 0,
      enProceso: 12,
      vendidas: 80,
      disponibles: 0,
      tipos: [
        { tipo: '2D+1B', cantidad: 50, superficiePromedio: 52, precioPromedio: 45000 },
        { tipo: '3D+2B', cantidad: 30, superficiePromedio: 68, precioPromedio: 55000 }
      ]
    },
    etiquetas: ['Vivienda Social', 'Sustentable', 'Albañilería'],
    cliente: 'SERVIU Metropolitano',
    contrato: 'CON-SERVIU-2023-089',
    permisos: [
      {
        tipo: 'Permiso de Edificación',
        numero: 'PE-EB-2023-123',
        fechaObtencion: '2023-10-30',
        fechaVencimiento: '2025-10-30',
        estado: 'vigente'
      }
    ],
    metadata: {
      creadoPor: 'carmen.soto@constructora.cl',
      modificadoPor: 'pedro.morales@constructora.cl',
      version: '1.4',
      archivos: 34,
      fotos: 67,
      documentos: 28
    }
  },
  {
    id: 'proj-005',
    nombre: 'Planta Industrial Antofagasta',
    codigo: 'PIA-2024-005',
    descripcion: 'Planta de procesamiento industrial con oficinas administrativas y sistemas de tratamiento.',
    tipo: 'industrial',
    estado: 'completado',
    prioridad: 'baja',
    ubicacion: {
      direccion: 'Ruta 5 Norte Km 1350',
      comuna: 'Antofagasta',
      region: 'Antofagasta',
      coordenadas: { lat: -23.6509, lng: -70.3975 },
      superficieTerreno: 25000,
      superficieConstruida: 8500
    },
    fechas: {
      inicio: '2023-03-01',
      terminoProgramado: '2023-12-31',
      terminoReal: '2024-01-15',
      creacion: '2022-11-10',
      ultimaModificacion: new Date().toISOString()
    },
    financiero: {
      presupuestoTotal: 1800000000,
      presupuestoEjecutado: 1834000000,
      moneda: 'USD',
      varianzaPresupuestaria: 1.9,
      flujoEfectivo: 0,
      gastosAutorizados: 1834000000
    },
    avance: {
      fisico: 100,
      financiero: 102,
      cronograma: 98.5,
      partidasCompletadas: 24,
      partidasTotales: 24
    },
    equipo: {
      jefeProyecto: 'Ingeniero Industrial José Pérez',
      jefeTerreno: 'Roberto Silva',
      residenteObra: 'Carlos Mendoza',
      ingenieroConstruccion: 'María Elena Castro',
      totalTrabajadores: 0,
      subcontratistas: ['Construcciones Mineras S.A.', 'Instalaciones Industriales Norte']
    },
    calidad: {
      inspeccionesRealizadas: 42,
      inspeccionesPendientes: 0,
      noConformidades: 0,
      observacionesAbiertas: 0,
      cumplimientoNormativa: 100,
      certificacionesObtenidas: ['ISO 14001', 'Certificación Ambiental', 'Normativa Minera']
    },
    etiquetas: ['Industrial', 'Minería', 'Completado'],
    cliente: 'Minera del Norte S.A.',
    contrato: 'CON-MIN-2022-156',
    permisos: [
      {
        tipo: 'Permiso Industrial',
        numero: 'PI-ANT-2022-789',
        fechaObtencion: '2022-12-15',
        fechaVencimiento: '2027-12-15',
        estado: 'vigente'
      }
    ],
    metadata: {
      creadoPor: 'jose.perez@constructora.cl',
      modificadoPor: 'roberto.silva@constructora.cl',
      version: '4.1',
      archivos: 89,
      fotos: 156,
      documentos: 67
    }
  }
]

const partidasEjemplo: PartidaConstructiva[] = [
  {
    id: 'partida-001',
    codigo: 'EXC-001',
    nombre: 'Excavación General',
    descripcion: 'Excavación masiva para fundaciones y subterráneos',
    proyectoId: 'proj-001',
    nivel: 1,
    estado: 'completada',
    avance: 100,
    fechaInicio: '2024-01-15',
    fechaTermino: '2024-02-10',
    fechaProgramada: '2024-02-08',
    presupuesto: 45000000,
    gastoAcumulado: 43800000,
    unidadMedida: 'm³',
    cantidadProgramada: 1850,
    cantidadEjecutada: 1850,
    responsable: 'Carlos Mendoza',
    cuadrilla: 'Cuadrilla A',
    especialidad: 'Movimiento de Tierras',
    requiereInspeccion: true,
    inspeccionAprobada: true,
    observaciones: ['Completada según especificaciones'],
    noConformidades: 0,
    materialesRequeridos: [
      { materialId: 'mat-001', nombre: 'Combustible', cantidad: 2500, unidad: 'L', asignado: 2500, consumido: 2480 }
    ],
    dependencias: [],
    bloqueadores: [],
    subPartidas: ['partida-002'],
    metadata: {
      creadoPor: 'carlos.mendoza@constructora.cl',
      fechaCreacion: '2023-12-15',
      ultimaModificacion: '2024-02-10'
    }
  }
]

// Usuarios de ejemplo
const usuarioGerencia = {
  id: 'user-gerencia',
  nombre: 'Patricia Sánchez',
  rol: 'gerencia' as const,
  proyectosAsignados: ['proj-001', 'proj-002', 'proj-003', 'proj-004', 'proj-005'],
  permisos: [
    'ver_todos_proyectos',
    'crear_proyecto',
    'editar_proyecto',
    'eliminar_proyecto',
    'exportar_datos',
    'gestionar_equipos',
    'acciones_masivas'
  ]
}

const usuarioJefeTerreno = {
  id: 'user-terreno',
  nombre: 'Carlos Mendoza',
  rol: 'jefe_terreno' as const,
  proyectosAsignados: ['proj-001', 'proj-003'],
  permisos: [
    'editar_proyecto',
    'crear_partida',
    'editar_partida',
    'gestionar_equipos',
    'exportar_datos'
  ]
}

const usuarioOficinaTecnica = {
  id: 'user-oficina',
  nombre: 'Ricardo Valenzuela',
  rol: 'oficina_tecnica' as const,
  proyectosAsignados: ['proj-001', 'proj-002'],
  permisos: [
    'ver_todos_proyectos',
    'crear_proyecto',
    'editar_proyecto',
    'crear_partida',
    'exportar_datos'
  ]
}

const configuracionEjemplo = {
  mostrarUnidades: true,
  mostrarFinanciero: true,
  mostrarEquipo: true,
  mostrarCalidad: true,
  densidad: 'normal' as const,
  ordenamiento: {
    campo: 'fechas.ultimaModificacion',
    direccion: 'desc' as const
  }
}

// Story Wrapper
const ProjectManagementWrapper = ({ children, ...props }: any) => {
  const handleProyectoCrear = async (proyecto: any) => {
    console.log('Crear proyecto:', proyecto)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleProyectoActualizar = async (id: string, proyecto: any) => {
    console.log('Actualizar proyecto:', id, proyecto)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleProyectoEliminar = async (id: string) => {
    console.log('Eliminar proyecto:', id)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const handleProyectoSelect = (proyecto: any) => {
    console.log('Proyecto seleccionado:', proyecto.nombre)
  }

  const handleCambiarEstado = async (proyectoId: string, nuevoEstado: any) => {
    console.log('Cambiar estado:', proyectoId, nuevoEstado)
    await new Promise(resolve => setTimeout(resolve, 800))
  }

  const handleExportar = (proyectos: any[], formato: string) => {
    console.log(`Exportar ${proyectos.length} proyectos en formato ${formato}`)
  }

  return (
    <ProjectManagement
      {...props}
      proyectos={proyectosEjemplo}
      partidasConstructivas={partidasEjemplo}
      configuracion={configuracionEjemplo}
      onProyectoCrear={handleProyectoCrear}
      onProyectoActualizar={handleProyectoActualizar}
      onProyectoEliminar={handleProyectoEliminar}
      onProyectoSelect={handleProyectoSelect}
      onCambiarEstado={handleCambiarEstado}
      onExportar={handleExportar}
    />
  )
}

// Historias principales por rol
export const GestionGerencia: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioGerencia}
      mode="list"
    />
  )
}

export const GestionJefeTerreno: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioJefeTerreno}
      mode="list"
    />
  )
}

export const GestionOficinaTecnica: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioOficinaTecnica}
      mode="list"
    />
  )
}

export const DetalleProyecto: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioGerencia}
      mode="detail"
    />
  )
}

export const CrearProyecto: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioGerencia}
      mode="create"
    />
  )
}

export const VistaMobile: Story = {
  render: (args) => (
    <div className="max-w-sm mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <ProjectManagementWrapper
        {...args}
        usuario={usuarioJefeTerreno}
        esMobile={true}
        mode="list"
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const ProyectosConProblemas: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioJefeTerreno}
      filtros={{
        soloConProblemas: true
      }}
    />
  )
}

export const ProyectosResidenciales: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioOficinaTecnica}
      filtros={{
        tipo: ['residencial']
      }}
    />
  )
}

export const ProyectosRegionMetropolitana: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioGerencia}
      filtros={{
        region: ['Metropolitana']
      }}
    />
  )
}

export const ProyectosPrioridadAlta: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioGerencia}
      filtros={{
        prioridad: ['alta', 'critica']
      }}
    />
  )
}

export const WorkflowCompleto: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioGerencia}
      proyectos={proyectosEjemplo.map((p, index) => ({
        ...p,
        estado: ['planificacion', 'excavacion', 'fundaciones', 'estructura', 'albanileria'][index % 5] as any
      }))}
    />
  )
}

export const VistaCargando: Story = {
  render: (args) => (
    <ProjectManagement
      {...args}
      usuario={usuarioJefeTerreno}
      proyectos={[]}
      partidasConstructivas={[]}
      configuracion={configuracionEjemplo}
      isLoading={true}
    />
  )
}

export const VistaError: Story = {
  render: (args) => (
    <ProjectManagement
      {...args}
      usuario={usuarioJefeTerreno}
      proyectos={[]}
      partidasConstructivas={[]}
      configuracion={configuracionEjemplo}
      error="No se pudo cargar la información de proyectos. Verifique su conexión."
    />
  )
}

export const SinProyectos: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioJefeTerreno}
      proyectos={[]}
    />
  )
}

export const VistaCompleta: Story = {
  render: (args) => (
    <ProjectManagementWrapper
      {...args}
      usuario={usuarioGerencia}
      proyectos={proyectosEjemplo}
      filtros={{
        texto: '',
        estado: undefined,
        tipo: undefined,
        prioridad: undefined,
        soloAsignados: false,
        soloConProblemas: false
      }}
    />
  )
}