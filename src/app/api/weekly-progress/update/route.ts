import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/weekly-progress/update
 * 
 * Updates weekly progress for construction activities
 * Marks units as completed for a specific week
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { unitIds, weekNumber } = body

    if (!unitIds || !Array.isArray(unitIds) || unitIds.length === 0) {
      return NextResponse.json(
        { error: 'unitIds es requerido y debe ser un array' },
        { status: 400 }
      )
    }

    if (!weekNumber || typeof weekNumber !== 'number') {
      return NextResponse.json(
        { error: 'weekNumber es requerido y debe ser un número' },
        { status: 400 }
      )
    }

    // Get all construction activities for the specified units
    const activities = await prisma.constructionActivity.findMany({
      where: {
        workRecords: {
          some: {
            unitId: {
              in: unitIds
            }
          }
        }
      },
      select: {
        id: true,
      }
    })

    if (activities.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron actividades para las unidades especificadas' },
        { status: 404 }
      )
    }

    // Update construction activities to mark them as completed this week
    const updateResult = await prisma.constructionActivity.updateMany({
      where: {
        id: {
          in: activities.map(a => a.id)
        }
      },
      data: {
        completedThisWeek: true,
        weekNumber: weekNumber,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Progreso semanal actualizado exitosamente',
      updatedCount: updateResult.count,
      unitIds,
      weekNumber,
    })

  } catch (error) {
    console.error('Error updating weekly progress:', error)
    return NextResponse.json(
      { error: 'Error al actualizar progreso semanal' },
      { status: 500 }
    )
  }
}
