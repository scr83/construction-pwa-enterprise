import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        buildings: {
          include: {
            floors: {
              include: {
                units: {
                  orderBy: { name: 'asc' }
                }
              },
              orderBy: { name: 'asc' }
            }
          },
          orderBy: { name: 'asc' }
        },
        _count: {
          select: {
            buildings: true,
            teams: true,
            constructionActivities: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    // Calculate stats
    const totalFloors = project.buildings.reduce((sum, b) => sum + b.floors.length, 0)
    const totalUnits = project.buildings.reduce((sum, b) => 
      sum + b.floors.reduce((floorSum, f) => floorSum + f.units.length, 0), 0
    )

    return NextResponse.json({
      project: {
        ...project,
        stats: {
          totalFloors,
          totalUnits,
          completionPercentage: 0 // Calculate based on completed units/partidas
        }
      }
    })

  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}