import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createFloorSchema = z.object({
  buildingId: z.string(),
  floorNumber: z.number(),
  name: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createFloorSchema.parse(body)

    const floor = await prisma.floor.create({
      data: {
        buildingId: validatedData.buildingId,
        name: validatedData.name || `Piso ${validatedData.floorNumber}`
      }
    })

    return NextResponse.json({ 
      message: 'Piso creado exitosamente',
      floor 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating floor:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}