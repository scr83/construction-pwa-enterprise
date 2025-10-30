import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for creating custom partida
const createPartidaSchema = z.object({
  name: z.string().min(1, 'Nombre de partida es requerido'),
  category: z.string().min(1, 'Categoría es requerida'),
  unit: z.string().optional(),
  description: z.string().optional(),
  budgetWeight: z.number().min(0).optional(),
})

// GET /api/partidas - List all partidas (standard + custom)
export async function GET(req: NextRequest) {
  try {
    const partidas = await prisma.partida.findMany({
      where: { isActive: true },
      orderBy: { sequence: 'asc' }
    })

    return NextResponse.json({ partidas })

  } catch (error) {
    console.error('Error fetching partidas:', error)
    return NextResponse.json(
      { error: 'Error al obtener partidas' },
      { status: 500 }
    )
  }
}

// POST /api/partidas - Create custom partida (Admin/Executive only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Only EXECUTIVE or ADMIN can create custom partidas
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !['EXECUTIVE', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'No tiene permisos para crear partidas personalizadas' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createPartidaSchema.parse(body)

    // Get the highest sequence number and add 1 for custom partida
    const lastPartida = await prisma.partida.findFirst({
      orderBy: { sequence: 'desc' }
    })
    
    const nextSequence = (lastPartida?.sequence || 40) + 1

    // Create custom partida
    const partida = await prisma.partida.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        sequence: nextSequence,
        unit: validatedData.unit,
        description: validatedData.description,
        budgetWeight: validatedData.budgetWeight,
      }
    })

    return NextResponse.json({ 
      message: 'Partida personalizada creada exitosamente',
      partida 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating custom partida:', error)
    
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
      { error: 'Error al crear partida personalizada' },
      { status: 500 }
    )
  }
}