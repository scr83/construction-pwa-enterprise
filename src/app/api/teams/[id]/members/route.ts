import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for adding/updating team member
const teamMemberSchema = z.object({
  userId: z.string().min(1, 'ID del usuario es requerido'),
  role: z.enum([
    'maestro_mayor',
    'maestro_albanil', 
    'maestro_electrico',
    'maestro_gasfiter',
    'oficial_primera',
    'oficial_segunda',
    'ayudante',
    'jornal'
  ]),
  hourlyRate: z.number().min(0).optional(),
  status: z.enum(['active', 'inactive', 'on_leave', 'vacation']).optional().default('active')
})

const updateMemberSchema = z.object({
  role: z.enum([
    'maestro_mayor',
    'maestro_albanil', 
    'maestro_electrico',
    'maestro_gasfiter',
    'oficial_primera',
    'oficial_segunda',
    'ayudante',
    'jornal'
  ]).optional(),
  hourlyRate: z.number().min(0).optional(),
  status: z.enum(['active', 'inactive', 'on_leave', 'vacation']).optional(),
  performanceRating: z.number().min(0).max(100).optional()
})

// GET /api/teams/[id]/members - List team members
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const teamId = params.id

    // Verify team exists and user has access
    const team = await prisma.team.findFirst({
      where: { 
        id: teamId,
        project: {
          projectAssignments: {
            some: { userId: session.user.id }
          }
        }
      },
      select: { id: true, name: true }
    })

    if (!team) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            company: true,
            isActive: true
          }
        }
      },
      orderBy: { joinedDate: 'asc' }
    })

    return NextResponse.json({ 
      team: { id: team.id, name: team.name },
      members 
    })

  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/teams/[id]/members - Add member to team
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check permissions
    const userRoleHierarchy = {
      'WORKER': 1,
      'QUALITY_INSPECTOR': 2,
      'QUALITY_CONTROL': 2,
      'SUPERVISOR': 3,
      'SITE_MANAGER': 4,
      'EXECUTIVE': 5,
      'ADMIN': 6
    }

    if ((userRoleHierarchy[session.user.role as keyof typeof userRoleHierarchy] || 0) < 3) {
      return NextResponse.json({ error: 'Sin permisos para agregar miembros' }, { status: 403 })
    }

    const teamId = params.id
    const body = await req.json()
    const validatedData = teamMemberSchema.parse(body)

    // Verify team exists and user has access
    const team = await prisma.team.findFirst({
      where: { 
        id: teamId,
        project: {
          projectAssignments: {
            some: { userId: session.user.id }
          }
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Verify user exists and is active
    const user = await prisma.user.findFirst({
      where: { 
        id: validatedData.userId,
        isActive: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado o inactivo' }, { status: 404 })
    }

    // Check if user is already a member of this team
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: validatedData.userId
        }
      }
    })

    if (existingMember) {
      return NextResponse.json({ error: 'El usuario ya es miembro de este equipo' }, { status: 400 })
    }

    // Add member to team
    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: validatedData.userId,
        role: validatedData.role,
        hourlyRate: validatedData.hourlyRate || null,
        status: validatedData.status || 'active'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            company: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Miembro agregado exitosamente',
      member: newMember 
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding team member:', error)
    
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
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/teams/[id]/members - Update team member
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check permissions
    const userRoleHierarchy = {
      'WORKER': 1,
      'QUALITY_INSPECTOR': 2,
      'QUALITY_CONTROL': 2,
      'SUPERVISOR': 3,
      'SITE_MANAGER': 4,
      'EXECUTIVE': 5,
      'ADMIN': 6
    }

    if ((userRoleHierarchy[session.user.role as keyof typeof userRoleHierarchy] || 0) < 3) {
      return NextResponse.json({ error: 'Sin permisos para modificar miembros' }, { status: 403 })
    }

    const teamId = params.id
    const body = await req.json()
    const { userId, ...memberUpdateData } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'ID del usuario es requerido' }, { status: 400 })
    }

    const validatedData = updateMemberSchema.parse(memberUpdateData)

    // Verify team exists and user has access
    const team = await prisma.team.findFirst({
      where: { 
        id: teamId,
        project: {
          projectAssignments: {
            some: { userId: session.user.id }
          }
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Check if member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    })

    if (!existingMember) {
      return NextResponse.json({ error: 'Miembro no encontrado en este equipo' }, { status: 404 })
    }

    // Update member
    const updateData = {
      ...validatedData,
      hourlyRate: validatedData.hourlyRate || null
    }
    
    const updatedMember = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            company: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Miembro actualizado exitosamente',
      member: updatedMember 
    })

  } catch (error) {
    console.error('Error updating team member:', error)
    
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
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/teams/[id]/members?userId=xxx - Remove member from team
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check permissions
    const userRoleHierarchy = {
      'WORKER': 1,
      'QUALITY_INSPECTOR': 2,
      'QUALITY_CONTROL': 2,
      'SUPERVISOR': 3,
      'SITE_MANAGER': 4,
      'EXECUTIVE': 5,
      'ADMIN': 6
    }

    if ((userRoleHierarchy[session.user.role as keyof typeof userRoleHierarchy] || 0) < 3) {
      return NextResponse.json({ error: 'Sin permisos para remover miembros' }, { status: 403 })
    }

    const teamId = params.id
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'ID del usuario es requerido' }, { status: 400 })
    }

    // Verify team exists and user has access
    const team = await prisma.team.findFirst({
      where: { 
        id: teamId,
        project: {
          projectAssignments: {
            some: { userId: session.user.id }
          }
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Check if member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    })

    if (!existingMember) {
      return NextResponse.json({ error: 'Miembro no encontrado en este equipo' }, { status: 404 })
    }

    // Remove member from team
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    })

    return NextResponse.json({ 
      message: 'Miembro removido exitosamente' 
    })

  } catch (error) {
    console.error('Error removing team member:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}