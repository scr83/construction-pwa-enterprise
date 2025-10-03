import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateAverageProgress } from '@/lib/calculations/progress'

/**
 * GET /api/projects/[id]/progress
 * 
 * Returns progress calculation for a project based on construction activities
 * Progress calculated from 14 workflow states across all units
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const projectId = params.id

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        projectAssignments: {
          where: { userId: session.user.id }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    // Check access (admins and executives see all, others need assignment)
    const userRole = session.user.role
    const hasAccess = 
      userRole === 'ADMIN' ||
      userRole === 'EXECUTIVE' ||
      project.projectAssignments.length > 0

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Sin acceso a este proyecto' },
        { status: 403 }
      )
    }

    // Get all construction activities for this project
    const activities = await prisma.constructionActivity.findMany({
      where: { projectId },
      select: {
        id: true,
        kitMaterialInicial: true,
        kitMaterialAjustado: true,
        faenaContratada: true,
        subcontratoAsignado: true,
        kitInicialCotizado: true,
        solpedInicialEmitida: true,
        kitComprado: true,
        kitDisponibleBodega: true,
        kitEntregadoTerreno: true,
        faenaEjecutada: true,
        fechaEjecucion: true,
        entregadoCalidad: true,
        tratoPagado: true,
        pagoCursado: true,
      }
    })

    // Calculate progress
    const progress = calculateAverageProgress(activities)

    // Count completed activities (faenaEjecutada AND entregadoCalidad)
    const completedActivities = activities.filter(
      a => a.faenaEjecutada && a.entregadoCalidad
    ).length

    return NextResponse.json({
      projectId,
      totalActivities: activities.length,
      completedActivities,
      progress: {
        planning: progress.planning,
        materials: progress.materials,
        physical: progress.physical,
        payment: progress.payment,
        overall: progress.overall,
      }
    })

  } catch (error) {
    console.error('Error calculating project progress:', error)
    return NextResponse.json(
      { error: 'Error al calcular progreso del proyecto' },
      { status: 500 }
    )
  }
}
