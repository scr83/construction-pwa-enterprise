import type { Meta, StoryObj } from '@storybook/react'
import { Dashboard } from './Dashboard'
import type { DashboardProps, ProjectMetrics, NotificacionObra, AccionRapida } from './Dashboard'

const meta: Meta<typeof Dashboard> = {
  title: 'Pages/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Dashboard principal con KPIs por rol, gestión de proyectos y funcionalidades PWA para construcción.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    'usuario.rol': {
      control: { type: 'select' },
      options: ['gerencia', 'jefe_terreno', 'bodega', 'oficina_tecnica', 'control_calidad'],
      description: 'Rol del usuario que determina los KPIs y funcionalidades'
    },
    esMobile: {
      control: { type: 'boolean' },
      description: 'Activa la vista móvil optimizada'
    },
    modoOffline: {
      control: { type: 'boolean' },
      description: 'Simula modo offline con sincronización'
    }
  }
}

export default meta
type Story = StoryObj<typeof Dashboard>

// Datos de ejemplo realistas para construcción chilena
const proyectosEjemplo: ProjectMetrics[] = [
  {
    id: 'proj-001',
    nombre: 'Edificio Residencial Las Condes',
    codigo: 'ELC-2024-001',
    avanceFisico: 65.2,
    avanceFinanciero: 62.8,
    presupuestoTotal: 2500000000,
    presupuestoEjecutado: 1570000000,
    fechaInicio: '2024-01-15',
    fechaTermino: '2024-08-30',
    estado: 'estructura',
    ubicacion: {
      direccion: 'Av. Apoquindo 4501',
      comuna: 'Las Condes',
      region: 'Metropolitana',
      coordenadas: { lat: -33.4084, lng: -70.5420 }
    },
    equipo: {
      jefeTerreno: 'Carlos Mendoza',
      maestroAlbanil: 'Juan Pérez',
      totalTrabajadores: 45
    },
    calidad: {
      inspeccionesRealizadas: 28,
      inspeccionesPendientes: 5,
      noConformidades: 2,
      cumplimientoNormativa: 94.5
    },
    materiales: {
      stockCritico: 8,
      pedidosPendientes: 12,
      entregas: 15
    }
  },
  {
    id: 'proj-002',
    nombre: 'Centro Comercial Plaza Norte',
    codigo: 'PCN-2024-002',
    avanceFisico: 25.8,
    avanceFinanciero: 28.2,
    presupuestoTotal: 4200000000,
    presupuestoEjecutado: 1184000000,
    fechaInicio: '2024-01-10',
    fechaTermino: '2024-12-15',
    estado: 'fundaciones',
    ubicacion: {
      direccion: 'Av. Américo Vespucio 1501',
      comuna: 'Huechuraba',
      region: 'Metropolitana',
      coordenadas: { lat: -33.3617, lng: -70.6394 }
    },
    equipo: {
      jefeTerreno: 'María González',
      maestroAlbanil: 'Roberto Silva',
      totalTrabajadores: 68
    },
    calidad: {
      inspeccionesRealizadas: 15,
      inspeccionesPendientes: 8,
      noConformidades: 1,
      cumplimientoNormativa: 96.2
    },
    materiales: {
      stockCritico: 15,
      pedidosPendientes: 20,
      entregas: 8
    }
  },
  {
    id: 'proj-003',
    nombre: 'Hospital Regional Valparaíso',
    codigo: 'HRV-2024-003',
    avanceFisico: 40.5,
    avanceFinanciero: 38.9,
    presupuestoTotal: 3100000000,
    presupuestoEjecutado: 1205900000,
    fechaInicio: '2024-01-05',
    fechaTermino: '2024-06-30',
    estado: 'albanileria',
    ubicacion: {
      direccion: 'Av. Argentina 2085',
      comuna: 'Valparaíso',
      region: 'Valparaíso',
      coordenadas: { lat: -33.0458, lng: -71.6197 }
    },
    equipo: {
      jefeTerreno: 'Ana Rodríguez',
      maestroAlbanil: 'Luis Herrera',
      totalTrabajadores: 52
    },
    calidad: {
      inspeccionesRealizadas: 35,
      inspeccionesPendientes: 12,
      noConformidades: 3,
      cumplimientoNormativa: 92.8
    },
    materiales: {
      stockCritico: 5,
      pedidosPendientes: 8,
      entregas: 18
    }
  },
  {
    id: 'proj-004',
    nombre: 'Conjunto Habitacional El Bosque',
    codigo: 'CHB-2024-004',
    avanceFisico: 15.2,
    avanceFinanciero: 18.7,
    presupuestoTotal: 1600000000,
    presupuestoEjecutado: 299200000,
    fechaInicio: '2023-11-20',
    fechaTermino: '2024-10-31',
    estado: 'excavacion',
    ubicacion: {
      direccion: 'Av. José Miguel Carrera 8950',
      comuna: 'El Bosque',
      region: 'Metropolitana',
      coordenadas: { lat: -33.5617, lng: -70.6792 }
    },
    equipo: {
      jefeTerreno: 'Pedro Morales',
      maestroAlbanil: 'Miguel Torres',
      totalTrabajadores: 28
    },
    calidad: {
      inspeccionesRealizadas: 8,
      inspeccionesPendientes: 3,
      noConformidades: 0,
      cumplimientoNormativa: 98.1
    },
    materiales: {
      stockCritico: 12,
      pedidosPendientes: 25,
      entregas: 3
    }
  }
]

const notificacionesEjemplo: NotificacionObra[] = [
  {
    id: 'notif-001',
    tipo: 'urgente',
    titulo: 'Inspección Urgente Requerida',
    mensaje: 'Se detectó una fisura en la losa del piso 8. Requiere inspección inmediata del ingeniero estructural.',
    proyecto: 'proj-001',
    responsable: 'Carlos Mendoza',
    fechaCreacion: new Date().toISOString(),
    fechaVencimiento: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas
    leida: false,
    acciones: [
      { etiqueta: 'Programar Inspección', accion: () => console.log('Programar'), tipo: 'primary' },
      { etiqueta: 'Contactar Ingeniero', accion: () => console.log('Contactar'), tipo: 'secondary' }
    ]
  },
  {
    id: 'notif-002',
    tipo: 'importante',
    titulo: 'Stock Crítico de Cemento',
    mensaje: 'El inventario de cemento Portland está por debajo del mínimo. Stock actual: 45 sacos.',
    proyecto: 'proj-002',
    responsable: 'María González',
    fechaCreacion: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hora atrás
    leida: false,
    acciones: [
      { etiqueta: 'Hacer Pedido', accion: () => console.log('Pedido'), tipo: 'primary' },
      { etiqueta: 'Ver Proveedores', accion: () => console.log('Proveedores'), tipo: 'secondary' }
    ]
  },
  {
    id: 'notif-003',
    tipo: 'informativa',
    titulo: 'Entrega de Materiales Programada',
    mensaje: 'Llegada de 500 sacos de cemento y 200 kg de fierro programada para mañana 08:00.',
    proyecto: 'proj-003',
    fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    leida: false
  },
  {
    id: 'notif-004',
    tipo: 'sistema',
    titulo: 'Actualización Completada',
    mensaje: 'Los datos de avance de obra se han sincronizado correctamente con el servidor.',
    fechaCreacion: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
    leida: true
  }
]

// Usuarios de ejemplo para diferentes roles
const usuarioGerencia = {
  id: 'user-gerencia',
  nombre: 'Patricia Sánchez',
  rol: 'gerencia' as const,
  avatar: '/avatars/patricia.jpg',
  empresa: 'Constructora ABC Ltda.',
  proyectosAsignados: ['proj-001', 'proj-002', 'proj-003', 'proj-004'],
  permisos: ['ver_todos_proyectos', 'aprobar_presupuestos', 'generar_reportes', 'administrar_usuarios']
}

const usuarioJefeTerreno = {
  id: 'user-terreno',
  nombre: 'Carlos Mendoza',
  rol: 'jefe_terreno' as const,
  avatar: '/avatars/carlos.jpg',
  empresa: 'Constructora ABC Ltda.',
  proyectosAsignados: ['proj-001', 'proj-003'],
  permisos: ['gestionar_obra', 'asignar_tareas', 'controlar_calidad', 'coordinar_equipos']
}

const usuarioBodega = {
  id: 'user-bodega',
  nombre: 'Elena Morales',
  rol: 'bodega' as const,
  avatar: '/avatars/elena.jpg',
  empresa: 'Constructora ABC Ltda.',
  proyectosAsignados: ['proj-001', 'proj-002', 'proj-003', 'proj-004'],
  permisos: ['gestionar_inventario', 'crear_pedidos', 'controlar_entregas', 'generar_reportes_stock']
}

const usuarioOficinaTecnica = {
  id: 'user-oficina',
  nombre: 'Ricardo Valenzuela',
  rol: 'oficina_tecnica' as const,
  avatar: '/avatars/ricardo.jpg',
  empresa: 'Constructora ABC Ltda.',
  proyectosAsignados: ['proj-001', 'proj-002'],
  permisos: ['revisar_planos', 'gestionar_cronogramas', 'tramitar_permisos', 'coordinar_profesionales']
}

const usuarioControlCalidad = {
  id: 'user-calidad',
  nombre: 'Sofía Ramírez',
  rol: 'control_calidad' as const,
  avatar: '/avatars/sofia.jpg',
  empresa: 'Constructora ABC Ltda.',
  proyectosAsignados: ['proj-001', 'proj-002', 'proj-003'],
  permisos: ['realizar_inspecciones', 'certificar_calidad', 'generar_reportes_calidad', 'gestionar_no_conformidades']
}

// Story Wrapper para manejo de estado
const DashboardWrapper = ({ children, ...props }: any) => {
  const handleActualizar = async () => {
    console.log('Actualizando dashboard...')
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Dashboard actualizado')
  }

  const handleProyectoSelect = (proyectoId: string) => {
    console.log('Proyecto seleccionado:', proyectoId)
  }

  const handleAccionRapida = (accionId: string) => {
    console.log('Acción rápida ejecutada:', accionId)
  }

  const handleNotificacionAction = (notificacionId: string, accion: string) => {
    console.log('Acción en notificación:', notificacionId, accion)
  }

  const handleNavegacion = (ruta: string) => {
    console.log('Navegando a:', ruta)
  }

  const handleCapturaFoto = (archivo: File) => {
    console.log('Foto capturada:', archivo.name)
  }

  const handleCapturaUbicacion = (coordenadas: GeolocationCoordinates) => {
    console.log('Ubicación capturada:', coordenadas.latitude, coordenadas.longitude)
  }

  return (
    <Dashboard
      {...props}
      proyectos={proyectosEjemplo}
      notificaciones={notificacionesEjemplo}
      ultimaActualizacion={new Date().toISOString()}
      onActualizar={handleActualizar}
      onProyectoSelect={handleProyectoSelect}
      onAccionRapida={handleAccionRapida}
      onNotificacionAction={handleNotificacionAction}
      onNavegacion={handleNavegacion}
      onCapturaFoto={handleCapturaFoto}
      onCapturaUbicacion={handleCapturaUbicacion}
    />
  )
}

// Historias principales por rol
export const DashboardGerencia: Story = {
  render: (args) => (
    <DashboardWrapper
      {...args}
      usuario={usuarioGerencia}
      configuracion={{
        actualizacionAutomatica: true,
        intervaloActualizacion: 60,
        notificacionesPush: true,
        modoOffline: false,
        sincronizacionAutomatica: true,
        alertasTempranas: true
      }}
    />
  )
}

export const DashboardJefeTerreno: Story = {
  render: (args) => (
    <DashboardWrapper
      {...args}
      usuario={usuarioJefeTerreno}
      configuracion={{
        actualizacionAutomatica: true,
        intervaloActualizacion: 30,
        notificacionesPush: true,
        modoOffline: true,
        sincronizacionAutomatica: true,
        alertasTempranas: true
      }}
    />
  )
}

export const DashboardBodega: Story = {
  render: (args) => (
    <DashboardWrapper
      {...args}
      usuario={usuarioBodega}
      configuracion={{
        actualizacionAutomatica: true,
        intervaloActualizacion: 45,
        notificacionesPush: true,
        modoOffline: true,
        sincronizacionAutomatica: true,
        alertasTempranas: true
      }}
    />
  )
}

export const DashboardOficinaTecnica: Story = {
  render: (args) => (
    <DashboardWrapper
      {...args}
      usuario={usuarioOficinaTecnica}
      configuracion={{
        actualizacionAutomatica: true,
        intervaloActualizacion: 120,
        notificacionesPush: false,
        modoOffline: false,
        sincronizacionAutomatica: true,
        alertasTempranas: false
      }}
    />
  )
}

export const DashboardControlCalidad: Story = {
  render: (args) => (
    <DashboardWrapper
      {...args}
      usuario={usuarioControlCalidad}
      configuracion={{
        actualizacionAutomatica: true,
        intervaloActualizacion: 30,
        notificacionesPush: true,
        modoOffline: true,
        sincronizacionAutomatica: true,
        alertasTempranas: true
      }}
    />
  )
}

// Vistas especializadas
export const DashboardMobile: Story = {
  render: (args) => (
    <div className="max-w-sm mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <DashboardWrapper
        {...args}
        usuario={usuarioJefeTerreno}
        esMobile={true}
        configuracion={{
          actualizacionAutomatica: true,
          intervaloActualizacion: 30,
          notificacionesPush: true,
          modoOffline: true,
          sincronizacionAutomatica: true,
          alertasTempranas: true
        }}
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const DashboardOffline: Story = {
  render: (args) => (
    <DashboardWrapper
      {...args}
      usuario={usuarioJefeTerreno}
      modoOffline={true}
      configuracion={{
        actualizacionAutomatica: false,
        intervaloActualizacion: 30,
        notificacionesPush: false,
        modoOffline: true,
        sincronizacionAutomatica: true,
        alertasTempranas: true
      }}
    />
  )
}

export const DashboardConAlertas: Story = {
  render: (args) => (
    <DashboardWrapper
      {...args}
      usuario={usuarioJefeTerreno}
      notificaciones={[
        ...notificacionesEjemplo,
        {
          id: 'alert-001',
          tipo: 'urgente',
          titulo: 'Condiciones Climáticas Adversas',
          mensaje: 'Se pronostica lluvia intensa para las próximas 6 horas. Suspender trabajos al aire libre.',
          fechaCreacion: new Date().toISOString(),
          leida: false,
          acciones: [
            { etiqueta: 'Notificar Equipos', accion: () => console.log('Notificar'), tipo: 'primary' },
            { etiqueta: 'Ver Pronóstico', accion: () => console.log('Pronóstico'), tipo: 'secondary' }
          ]
        },
        {
          id: 'alert-002',
          tipo: 'importante',
          titulo: 'Retraso en Cronograma',
          mensaje: 'El proyecto Las Condes presenta 3 días de retraso en la etapa de estructura.',
          proyecto: 'proj-001',
          fechaCreacion: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          leida: false
        }
      ]}
    />
  )
}

export const DashboardCargando: Story = {
  render: (args) => (
    <Dashboard
      {...args}
      usuario={usuarioJefeTerreno}
      proyectos={[]}
      notificaciones={[]}
      accionesRapidas={[]}
      isLoading={true}
    />
  )
}

export const DashboardError: Story = {
  render: (args) => (
    <Dashboard
      {...args}
      usuario={usuarioJefeTerreno}
      proyectos={[]}
      notificaciones={[]}
      accionesRapidas={[]}
      error="No se pudo conectar con el servidor. Verifique su conexión a internet e intente nuevamente."
    />
  )
}

export const DashboardSinProyectos: Story = {
  render: (args) => (
    <DashboardWrapper
      {...args}
      usuario={{
        ...usuarioJefeTerreno,
        proyectosAsignados: []
      }}
      proyectos={[]}
      notificaciones={[]}
    />
  )
}

// Demo completo con todas las funcionalidades
export const DashboardCompleto: Story = {
  render: (args) => (
    <DashboardWrapper
      {...args}
      usuario={usuarioJefeTerreno}
      accionesRapidas={[
        {
          id: 'nueva-tarea',
          etiqueta: 'Nueva Tarea',
          icono: '📝',
          descripcion: 'Registrar nueva actividad de obra',
          disponible: true,
          onClick: () => console.log('Nueva tarea'),
          roles: ['jefe_terreno']
        },
        {
          id: 'tomar-foto',
          etiqueta: 'Tomar Foto',
          icono: '📷',
          descripcion: 'Capturar imagen para inspección',
          disponible: true,
          requiereCamara: true,
          onClick: () => console.log('Captura foto'),
          roles: ['jefe_terreno']
        },
        {
          id: 'ubicacion-gps',
          etiqueta: 'Ubicación GPS',
          icono: '📍',
          descripcion: 'Marcar coordenadas actuales',
          disponible: true,
          requiereUbicacion: true,
          onClick: () => console.log('Captura GPS'),
          roles: ['jefe_terreno']
        },
        {
          id: 'revisar-materiales',
          etiqueta: 'Revisar Stock',
          icono: '📦',
          descripcion: 'Ver estado de inventario',
          disponible: true,
          onClick: () => console.log('Stock'),
          roles: ['jefe_terreno', 'bodega']
        }
      ]}
    />
  )
}