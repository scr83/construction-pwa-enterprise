import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Value mapping functions
function mapTipoToProjectType(tipo: string): 'residential' | 'commercial' | 'industrial' | 'infrastructure' {
  const mapping = {
    'residencial': 'residential' as const,
    'comercial': 'commercial' as const,
    'industrial': 'industrial' as const,
    'infraestructura': 'infrastructure' as const
  }
  return mapping[tipo] || 'commercial'
}

// Schema for creating a new project (Spanish fields)
const createProjectSchema = z.object({
  nombre: z.string().min(1, 'Nombre del proyecto es requerido'),
  descripcion: z.string().optional(),
  tipo: z.enum(['residencial', 'comercial', 'industrial', 'infraestructura']).optional().default('comercial'),
  fechaInicio: z.string().optional(),
  fechaTermino: z.string().optional()
})

// GET /api/projects - Get all projects
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Get projects based on user access
    const dbProjects = await prisma.project.findMany({
      where: {
        OR: [
          // User has project assignment
          {
            projectAssignments: {
              some: { userId: session.user.id }
            }
          },
          // Executives and admins can see all active projects
          ...((['EXECUTIVE', 'ADMIN'].includes(session.user.role)) ? [
            { status: { in: ['PLANNING', 'ACTIVE'] } }
          ] : [])
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        projectType: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Transform to exact format expected by ProjectManagement component
    const projects = dbProjects.map(project => ({
      id: project.id,
      nombre: project.name, // Changed from titulo to nombre
      codigo: `${project.projectType.toUpperCase()}-${project.id.slice(-3)}`,
      descripcion: project.description || '',
      tipo: project.projectType === 'residential' ? 'residencial' : 
            project.projectType === 'commercial' ? 'comercial' : 
            project.projectType === 'industrial' ? 'industrial' : 'comercial',
      estado: project.status === 'PLANNING' ? 'planificacion' : 
              project.status === 'ACTIVE' ? 'estructura' : 'planificacion',
      prioridad: 'media' as const,
      
      // Ubicacion matching exact interface
      ubicacion: {
        direccion: 'Av. Las Condes',
        numero: '1234',
        comuna: 'Las Condes',
        region: 'Metropolitana',
        codigoPostal: '7550000',
        coordenadas: { lat: -33.4084, lng: -70.5420 },
        superficieTerreno: Math.floor(Math.random() * 2000) + 1000,
        superficieConstruida: Math.floor(Math.random() * 5000) + 2000
      },
      
      // Fechas with correct field names
      fechas: {
        inicio: project.startDate?.toISOString() || new Date().toISOString(),
        terminoProgramado: project.endDate?.toISOString() || new Date().toISOString(), // Changed from finPrevisto
        creacion: project.createdAt.toISOString(),
        ultimaModificacion: new Date().toISOString()
      },
      
      // Financiero with exact structure expected
      financiero: {
        presupuestoTotal: Math.floor(Math.random() * 500000000) + 1000000000, // Changed from presupuesto.total
        presupuestoEjecutado: Math.floor(Math.random() * 300000000) + 200000000,
        moneda: 'CLP' as const,
        varianzaPresupuestaria: Math.round((Math.random() * 10 - 5) * 10) / 10,
        flujoEfectivo: Math.floor(Math.random() * 100000000) + 50000000,
        gastosAutorizados: Math.floor(Math.random() * 400000000) + 300000000
      },
      
      // Avance
      avance: {
        fisico: Math.floor(Math.random() * 40) + 40,
        financiero: Math.floor(Math.random() * 30) + 50,
        cronograma: Math.floor(Math.random() * 20) + 75,
        partidasCompletadas: Math.floor(Math.random() * 15) + 5,
        partidasTotales: Math.floor(Math.random() * 10) + 20
      },
      
      // Equipo with exact structure
      equipo: {
        jefeProyecto: session.user.name || 'Sin asignar',
        jefeTerreno: 'Carlos Mendoza',
        residenteObra: 'Miguel Torres',
        ingenieroConstruccion: 'Ana Rodríguez',
        arquitecto: 'Ricardo Valenzuela',
        totalTrabajadores: Math.floor(Math.random() * 30) + 15,
        subcontratistas: ['Hormigones del Sur S.A.', 'Instalaciones Técnicas Ltda.']
      },
      
      // Calidad with all required fields
      calidad: {
        inspeccionesRealizadas: Math.floor(Math.random() * 10) + 5,
        inspeccionesPendientes: Math.floor(Math.random() * 3),
        noConformidades: Math.floor(Math.random() * 2),
        observacionesAbiertas: Math.floor(Math.random() * 5) + 2, // Missing field added
        cumplimientoNormativa: Math.floor(Math.random() * 10) + 90,
        certificacionesObtenidas: ['ISO 9001', 'OHSAS 18001']
      },
      
      // Unidades (optional but helps prevent errors)
      unidades: {
        total: Math.floor(Math.random() * 50) + 20,
        completadas: Math.floor(Math.random() * 20) + 5,
        enProceso: Math.floor(Math.random() * 15) + 10,
        vendidas: Math.floor(Math.random() * 30) + 10,
        disponibles: Math.floor(Math.random() * 10) + 5,
        tipos: [
          { tipo: '1D+1B', cantidad: 20, superficiePromedio: 45, precioPromedio: 65000 },
          { tipo: '2D+2B', cantidad: 25, superficiePromedio: 68, precioPromedio: 85000 }
        ]
      },
      
      // Required arrays and strings
      etiquetas: ['Construcción', 'Residencial', project.projectType],
      cliente: 'Cliente S.A.',
      contrato: `CON-2024-${project.id.slice(-3)}`,
      
      // Permisos array
      permisos: [
        {
          tipo: 'Permiso de Edificación',
          numero: `PE-2024-${project.id.slice(-3)}`,
          fechaObtencion: project.createdAt.toISOString().split('T')[0],
          fechaVencimiento: new Date(project.createdAt.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estado: 'vigente' as const
        }
      ],
      
      // Metadata object
      metadata: {
        creadoPor: session.user.email || 'sistema@constructora.cl',
        modificadoPor: session.user.email || 'sistema@constructora.cl',
        version: '1.0',
        archivos: Math.floor(Math.random() * 20) + 10,
        fotos: Math.floor(Math.random() * 50) + 25,
        documentos: Math.floor(Math.random() * 15) + 8
      }
    }))

    return NextResponse.json({ projects })

  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check if user has permission to create projects (EXECUTIVE or ADMIN)
    if (!['EXECUTIVE', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos para crear proyectos' }, { status: 403 })
    }

    const body = await req.json()
    if (process.env.NODE_ENV === 'development') {
      console.log('API - Raw request body:', body)
    }
    
    const validatedData = createProjectSchema.parse(body)
    if (process.env.NODE_ENV === 'development') {
      console.log('API - Validated data:', validatedData)
    }

    // Create project with Spanish-to-English field mapping
    const project = await prisma.project.create({
      data: {
        name: validatedData.nombre,
        description: validatedData.descripcion,
        projectType: mapTipoToProjectType(validatedData.tipo),
        status: 'PLANNING',
        startDate: validatedData.fechaInicio ? new Date(validatedData.fechaInicio) : new Date(),
        endDate: validatedData.fechaTermino ? new Date(validatedData.fechaTermino) : null
      },
      select: {
        id: true,
        name: true,
        description: true,
        projectType: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true
      }
    })

    // Automatically assign the creator to the project
    await prisma.projectAssignment.create({
      data: {
        userId: session.user.id,
        projectId: project.id,
        role: 'PROJECT_MANAGER'
      }
    })

    return NextResponse.json({ 
      message: 'Proyecto creado exitosamente',
      project 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating project:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}