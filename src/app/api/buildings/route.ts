import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createBuildingSchema = z.object({
  projectId: z.string(),
  name: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createBuildingSchema.parse(body)

    const building = await prisma.building.create({
      data: validatedData
    })

    return NextResponse.json({ 
      message: 'Edificio creado exitosamente',
      building 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating building:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}