import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bulkCreateUnitsSchema = z.object({
  floorId: z.string(),
  prefix: z.string(),
  startFloor: z.number(),
  endFloor: z.number(),
  pattern: z.array(z.object({
    position: z.number(),
    name: z.string(),
    unitType: z.string(),
  }))
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = bulkCreateUnitsSchema.parse(body)

    const floor = await prisma.floor.findUnique({
      where: { id: validatedData.floorId },
      include: { building: true }
    })

    if (!floor) {
      return NextResponse.json({ error: 'Piso no encontrado' }, { status: 404 })
    }

    // Generate all units
    const unitsToCreate = []
    for (let floorNum = validatedData.startFloor; floorNum <= validatedData.endFloor; floorNum++) {
      for (const patternUnit of validatedData.pattern) {
        const unitCode = `${validatedData.prefix}${floorNum}${patternUnit.name}`
        unitsToCreate.push({
          floorId: validatedData.floorId,
          name: unitCode, // Store unit code in name field for now
          unitType: patternUnit.unitType
        })
      }
    }

    // Bulk create in database
    const result = await prisma.unit.createMany({
      data: unitsToCreate,
      skipDuplicates: true
    })

    return NextResponse.json({ 
      message: `${result.count} unidades creadas exitosamente`,
      count: result.count
    }, { status: 201 })

  } catch (error) {
    console.error('Error bulk creating units:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}