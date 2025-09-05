import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema, hashPassword } from '@/lib/auth'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validar datos de entrada
    const validatedData = registerSchema.parse(body)
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Ya existe una cuenta con este email' },
        { status: 400 }
      )
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(validatedData.password)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        company: validatedData.company,
        phone: validatedData.phone,
        emailVerified: new Date(), // Por simplicidad, marcamos como verificado
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { 
        message: 'Cuenta creada exitosamente',
        user: user
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en registro:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Datos inválidos',
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}