import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { z } from 'zod'

// Validation schema
const createUserSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  role: z.enum([
    'ADMIN',
    'EXECUTIVE', 
    'SITE_MANAGER',
    'WAREHOUSE',
    'TECHNICAL_OFFICE',
    'QUALITY_CONTROL',
    'SUPERVISOR',
    'QUALITY_INSPECTOR',
    'WORKER'
  ]),
  projectIds: z.array(z.string()).optional(),
})

/**
 * POST /api/users/create
 * 
 * Admin-only endpoint to create new users
 * Generates temporary password and assigns to projects
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only admins can create users
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Solo administradores pueden crear usuarios' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createUserSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuario con este email ya existe' },
        { status: 400 }
      )
    }

    // Generate temporary password (8 random chars)
    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await hash(tempPassword, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        role: validatedData.role,
        password: hashedPassword,
        isActive: true,
      }
    })

    // Assign to projects if specified
    if (validatedData.projectIds && validatedData.projectIds.length > 0) {
      await prisma.projectAssignment.createMany({
        data: validatedData.projectIds.map(projectId => ({
          userId: user.id,
          projectId,
          role: validatedData.role,
        }))
      })
    }

    // Return user info and temporary password
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      tempPassword,
      message: 'Usuario creado exitosamente. Enviar contraseña temporal al usuario.',
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    )
  }
}
