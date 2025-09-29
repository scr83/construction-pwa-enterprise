import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for creating a new project
const createProjectSchema = z.object({
  name: z.string().min(1, 'Nombre del proyecto es requerido'),
  description: z.string().optional(),
  projectType: z.enum(['residential', 'commercial', 'industrial', 'infrastructure']).optional().default('commercial'),
  startDate: z.string().optional(),
  endDate: z.string().optional()
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

    // Transform to expected format for ProjectManagement component
    const projects = dbProjects.map(project => ({
      id: project.id,
      titulo: project.name,
      descripcion: project.description || '',
      codigo: `${project.projectType.toUpperCase()}-${project.id.slice(-3)}`,
      tipo: project.projectType,
      estado: project.status.toLowerCase(),
      fechas: {
        inicio: project.startDate?.toISOString() || new Date().toISOString(),
        finPrevisto: project.endDate?.toISOString() || new Date().toISOString(),
        ultimaModificacion: project.createdAt.toISOString()
      },
      avance: {
        fisico: Math.floor(Math.random() * 40) + 40, // Mock data for now
        financiero: Math.floor(Math.random() * 30) + 50, // Mock data for now  
        cronograma: Math.floor(Math.random() * 20) + 75, // Mock data for now
        partidasCompletadas: Math.floor(Math.random() * 15) + 5,
        partidasTotales: Math.floor(Math.random() * 10) + 20
      },
      equipo: {
        jefeProyecto: session.user.name || 'Sin asignar',
        jefeTerreno: 'Por asignar',
        totalMiembros: Math.floor(Math.random() * 15) + 5
      },
      presupuesto: {
        total: Math.floor(Math.random() * 500000000) + 1000000000,
        ejecutado: Math.floor(Math.random() * 300000000) + 200000000,
        disponible: Math.floor(Math.random() * 200000000) + 100000000
      },
      ubicacion: {
        region: 'Metropolitana',
        comuna: 'Las Condes',
        direccion: 'Dirección del proyecto'
      },
      calidad: {
        inspeccionesRealizadas: Math.floor(Math.random() * 10) + 5,
        inspeccionesPendientes: Math.floor(Math.random() * 3),
        noConformidades: Math.floor(Math.random() * 2),
        cumplimientoNormativa: Math.floor(Math.random() * 10) + 90
      },
      materiales: {
        stockCritico: Math.floor(Math.random() * 3),
        pedidosPendientes: Math.floor(Math.random() * 2),
        entregas: Math.floor(Math.random() * 5) + 2
      },
      riesgos: {
        alto: Math.floor(Math.random() * 2),
        medio: Math.floor(Math.random() * 3) + 1,
        bajo: Math.floor(Math.random() * 4) + 2
      },
      productividad: {
        indiceGeneral: Math.floor(Math.random() * 20) + 75,
        eficienciaRecursos: Math.floor(Math.random() * 15) + 80,
        cumplimientoCronograma: Math.floor(Math.random() * 25) + 70
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
    const validatedData = createProjectSchema.parse(body)

    // Create project
    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        projectType: validatedData.projectType,
        status: 'PLANNING',
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null
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