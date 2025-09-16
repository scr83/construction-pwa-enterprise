import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for updating team
const updateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(['estructuras', 'instalaciones', 'terminaciones', 'calidad']).optional(),
  status: z.enum(['active', 'inactive', 'on_break']).optional(),
  specialties: z.array(z.string()).optional(),
  productivityTarget: z.number().min(0).max(200).optional()
})

// GET /api/teams/[id] - Get specific team details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const teamId = params.id

    const team = await prisma.team.findFirst({
      where: { 
        id: teamId,
        project: {
          projectAssignments: {
            some: { userId: session.user.id }
          }
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true
          }
        },
        supervisor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                company: true
              }
            }
          },
          orderBy: { joinedDate: 'asc' }
        },
        metrics: {
          orderBy: { week: 'desc' },
          take: 8 // Last 8 weeks
        },
        productivity: {
          orderBy: { date: 'desc' },
          take: 30 // Last 30 days
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Calculate detailed metrics
    const recentProductivity = team.productivity.slice(0, 7) // Last 7 days
    const allProductivity = team.productivity

    const currentMetrics = {
      weeklyProductivity: recentProductivity.length > 0 
        ? Math.round(recentProductivity.reduce((sum, p) => sum + (p.productivityScore?.toNumber() || 0), 0) / recentProductivity.length)
        : 0,
      weeklyQuality: recentProductivity.length > 0
        ? Math.round(recentProductivity.reduce((sum, p) => sum + (p.qualityScore?.toNumber() || 0), 0) / recentProductivity.length)
        : 0,
      weeklyTasks: recentProductivity.reduce((sum, p) => sum + p.tasksCompleted, 0),
      weeklySafetyIncidents: recentProductivity.reduce((sum, p) => sum + p.safetyIncidents, 0),
      totalHours: recentProductivity.reduce((sum, p) => sum + p.hoursWorked.toNumber(), 0),
      avgDailyHours: recentProductivity.length > 0
        ? Math.round((recentProductivity.reduce((sum, p) => sum + p.hoursWorked.toNumber(), 0) / recentProductivity.length) * 10) / 10
        : 0
    }

    // Calculate trends (comparing last 7 days vs previous 7 days)
    const previousWeekProductivity = allProductivity.slice(7, 14)
    const trends = {
      productivityTrend: previousWeekProductivity.length > 0 
        ? currentMetrics.weeklyProductivity - Math.round(previousWeekProductivity.reduce((sum, p) => sum + (p.productivityScore?.toNumber() || 0), 0) / previousWeekProductivity.length)
        : 0,
      qualityTrend: previousWeekProductivity.length > 0
        ? currentMetrics.weeklyQuality - Math.round(previousWeekProductivity.reduce((sum, p) => sum + (p.qualityScore?.toNumber() || 0), 0) / previousWeekProductivity.length)
        : 0,
      tasksTrend: previousWeekProductivity.length > 0
        ? currentMetrics.weeklyTasks - previousWeekProductivity.reduce((sum, p) => sum + p.tasksCompleted, 0)
        : 0
    }

    return NextResponse.json({ 
      team: {
        ...team,
        currentMetrics,
        trends
      }
    })

  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/teams/[id] - Update team information
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check permissions
    const userRoleHierarchy = {
      'WORKER': 1,
      'QUALITY_INSPECTOR': 2,
      'QUALITY_CONTROL': 2,
      'SUPERVISOR': 3,
      'SITE_MANAGER': 4,
      'EXECUTIVE': 5,
      'ADMIN': 6
    }

    if ((userRoleHierarchy[session.user.role as keyof typeof userRoleHierarchy] || 0) < 3) {
      return NextResponse.json({ error: 'Sin permisos para modificar equipos' }, { status: 403 })
    }

    const teamId = params.id
    const body = await req.json()
    const validatedData = updateTeamSchema.parse(body)

    // Verify team exists and user has access
    const existingTeam = await prisma.team.findFirst({
      where: { 
        id: teamId,
        project: {
          projectAssignments: {
            some: { userId: session.user.id }
          }
        }
      }
    })

    if (!existingTeam) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Update team
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        ...validatedData,
        updatedAt: new Date()
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
      message: 'Equipo actualizado exitosamente',
      team: updatedTeam 
    })

  } catch (error) {
    console.error('Error updating team:', error)
    
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

// DELETE /api/teams/[id] - Deactivate team (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check permissions (only SITE_MANAGER and above can delete teams)
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
      return NextResponse.json({ error: 'Sin permisos para eliminar equipos' }, { status: 403 })
    }

    const teamId = params.id

    // Verify team exists and user has access
    const existingTeam = await prisma.team.findFirst({
      where: { 
        id: teamId,
        project: {
          projectAssignments: {
            some: { userId: session.user.id }
          }
        }
      }
    })

    if (!existingTeam) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Soft delete by setting status to inactive
    await prisma.team.update({
      where: { id: teamId },
      data: { 
        status: 'inactive',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: 'Equipo desactivado exitosamente' 
    })

  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}