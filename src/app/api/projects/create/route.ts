import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for comprehensive project creation
const createProjectSchema = z.object({
  project: z.object({
    name: z.string().min(1, 'Nombre del proyecto es requerido'),
    description: z.string().optional(),
    projectType: z.enum(['residential', 'commercial', 'industrial', 'infrastructure']),
    startDate: z.string(),
    endDate: z.string().optional(),
  }),
  buildings: z.array(z.object({
    name: z.string().min(1, 'Nombre del edificio es requerido'),
    floors: z.array(z.object({
      name: z.string().min(1, 'Nombre del piso es requerido'),
      units: z.array(z.object({
        name: z.string().min(1, 'Nombre de la unidad es requerido'),
        unitType: z.string().optional(),
      }))
    }))
  })).min(1, 'Al menos un edificio es requerido'),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check if user has permission to create projects (ADMIN only)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sin permisos para crear proyectos' }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = createProjectSchema.parse(body)

    // Start a transaction to ensure data consistency (increased timeout for 40 partidas)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the project
      const project = await tx.project.create({
        data: {
          name: validatedData.project.name,
          description: validatedData.project.description || null,
          projectType: validatedData.project.projectType,
          status: 'PLANNING',
          startDate: new Date(validatedData.project.startDate),
          endDate: validatedData.project.endDate ? new Date(validatedData.project.endDate) : null,
        },
      })

      console.log(`✅ Created project: ${project.name}`)

      // 2. Automatically assign the creator to the project
      await tx.projectAssignment.create({
        data: {
          userId: session.user.id,
          projectId: project.id,
          role: 'PROJECT_MANAGER'
        }
      })

      let totalUnitsCreated = 0

      // 3. Create buildings, floors, and units
      for (const buildingData of validatedData.buildings) {
        const building = await tx.building.create({
          data: {
            projectId: project.id,
            name: buildingData.name,
          },
        })

        console.log(`  ✅ Created building: ${building.name}`)

        for (const floorData of buildingData.floors) {
          const floor = await tx.floor.create({
            data: {
              buildingId: building.id,
              name: floorData.name,
            },
          })

          console.log(`    ✅ Created floor: ${floor.name}`)

          for (const unitData of floorData.units) {
            const unit = await tx.unit.create({
              data: {
                floorId: floor.id,
                name: unitData.name,
                unitType: unitData.unitType || null,
              },
            })

            totalUnitsCreated++
            console.log(`      ✅ Created unit: ${unit.name}`)
          }
        }
      }

      // 4. After creating all units, create project-level construction activities
      const allPartidas = await tx.partida.findMany({
        orderBy: { sequence: 'asc' }
      })

      if (allPartidas.length === 0) {
        throw new Error('No hay partidas disponibles en el sistema. Ejecute el seed de partidas primero.')
      }

      const activities = await Promise.all(
        allPartidas.map(partida =>
          tx.constructionActivity.create({
            data: {
              projectId: project.id,
              partidaId: partida.id,
              name: partida.name,
              sequence: partida.sequence,
            }
          })
        )
      )

      console.log(`\n      ✅ Created ${activities.length} project-level construction activities`)

      console.log(`\n📊 Project Creation Summary:`)
      console.log(`   Project: ${project.name}`)
      console.log(`   Buildings: ${validatedData.buildings.length}`)
      console.log(`   Total units: ${totalUnitsCreated}`)
      console.log(`   Project-level construction activities: ${activities.length}`)
      console.log(`   Note: WorkRecords will link activities to units when work is assigned`)

      return {
        project,
        stats: {
          buildings: validatedData.buildings.length,
          floors: validatedData.buildings.reduce((sum, b) => sum + b.floors.length, 0),
          units: totalUnitsCreated,
          constructionActivities: activities.length,
        }
      }
    }, {
      timeout: 15000 // 15 seconds for creating 40 construction activities
    })

    return NextResponse.json({ 
      message: 'Proyecto creado exitosamente',
      project: result.project,
      stats: result.stats
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

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('partidas')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}