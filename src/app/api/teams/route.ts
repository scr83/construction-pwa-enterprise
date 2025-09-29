import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for creating a new team
const createTeamSchema = z.object({
  name: z.string().min(1, 'Nombre del equipo es requerido'),
  type: z.enum(['estructuras', 'instalaciones', 'terminaciones', 'calidad']),
  projectId: z.string().min(1, 'ID del proyecto es requerido'),
  supervisorId: z.string().min(1, 'ID del supervisor es requerido'),
  specialties: z.array(z.string()).optional().default([]),
  productivityTarget: z.number().min(0).max(200).optional().default(100)
})

// Schema for updating team
const updateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(['estructuras', 'instalaciones', 'terminaciones', 'calidad']).optional(),
  status: z.enum(['active', 'inactive', 'on_break']).optional(),
  specialties: z.array(z.string()).optional(),
  productivityTarget: z.number().min(0).max(200).optional()
})

// GET /api/teams - List all teams for user's projects
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    // Build where clause based on user role and filters
    const whereClause: any = {}
    
    // If specific project is requested
    if (projectId) {
      whereClause.projectId = projectId
    } else {
      // Get user's assigned projects
      const userProjects = await prisma.projectAssignment.findMany({
        where: { userId: session.user.id },
        select: { projectId: true }
      })
      
      if (userProjects.length > 0) {
        whereClause.projectId = {
          in: userProjects.map(p => p.projectId)
        }
      } else {
        // If user has no projects assigned, return empty array
        return NextResponse.json({ teams: [] })
      }
    }

    // Add status filter if provided
    if (status) {
      whereClause.status = status
    }

    const teams = await prisma.team.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        supervisor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        metrics: {
          orderBy: { week: 'desc' },
          take: 1
        },
        productivity: {
          where: {
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
          },
          orderBy: { date: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate current productivity metrics for each team
    const teamsWithMetrics = teams.map(team => {
      const recentProductivity = team.productivity
      const latestMetrics = team.metrics[0]
      
      const avgProductivity = recentProductivity.length > 0 
        ? recentProductivity.reduce((sum, p) => sum + (p.productivityScore?.toNumber() || 0), 0) / recentProductivity.length
        : latestMetrics?.avgProductivity?.toNumber() || 0

      const avgQuality = recentProductivity.length > 0
        ? recentProductivity.reduce((sum, p) => sum + (p.qualityScore?.toNumber() || 0), 0) / recentProductivity.length
        : latestMetrics?.avgQualityScore?.toNumber() || 0

      const totalTasks = recentProductivity.reduce((sum, p) => sum + p.tasksCompleted, 0)
      const safetyIncidents = recentProductivity.reduce((sum, p) => sum + p.safetyIncidents, 0)

      return {
        ...team,
        currentMetrics: {
          productivity: Math.round(avgProductivity),
          qualityScore: Math.round(avgQuality),
          tasksCompleted: totalTasks,
          safetyIncidents,
          attendanceRate: latestMetrics?.attendanceRate?.toNumber() || 0
        }
      }
    })

    return NextResponse.json({ teams: teamsWithMetrics })

  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/teams - Create new team
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check if user has permission to create teams (SITE_MANAGER or higher)
    const userRoleHierarchy = {
      'WORKER': 1,
      'QUALITY_INSPECTOR': 2,
      'QUALITY_CONTROL': 2,
      'SUPERVISOR': 3,
      'SITE_MANAGER': 4,
      'EXECUTIVE': 5,
      'ADMIN': 6
    }

    if ((userRoleHierarchy[session.user.role as keyof typeof userRoleHierarchy] || 0) < 4) {
      return NextResponse.json({ error: 'Sin permisos para crear equipos' }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = createTeamSchema.parse(body)

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { 
        id: validatedData.projectId
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    // Check access permissions
    const hasAccess = ['EXECUTIVE', 'ADMIN'].includes(session.user.role) ||
      await prisma.projectAssignment.findFirst({
        where: {
          userId: session.user.id,
          projectId: validatedData.projectId
        }
      })

    if (!hasAccess) {
      return NextResponse.json({ error: 'Sin acceso al proyecto' }, { status: 403 })
    }

    // Verify supervisor exists
    const supervisor = await prisma.user.findFirst({
      where: { 
        id: validatedData.supervisorId,
        isActive: true
      }
    })

    if (!supervisor) {
      return NextResponse.json({ error: 'Supervisor no encontrado' }, { status: 404 })
    }

    // Create team
    const team = await prisma.team.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        projectId: validatedData.projectId,
        supervisorId: validatedData.supervisorId,
        specialties: validatedData.specialties,
        productivityTarget: validatedData.productivityTarget
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        supervisor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Equipo creado exitosamente',
      team 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating team:', error)
    
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