import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for completing a task
const completeTaskSchema = z.object({
  actualHours: z.number().min(0).optional(),
  notes: z.string().optional(),
  completedAt: z.string().optional()
})

// PUT /api/tasks/[id]/complete - Mark task as completed
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        project: {
          include: {
            projectAssignments: {
              where: { userId: session.user.id }
            }
          }
        }
      }
    })

    if (!existingTask) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 })
    }

    // Check if task is already completed
    if (existingTask.status === 'COMPLETED') {
      return NextResponse.json({ error: 'La tarea ya está completada' }, { status: 400 })
    }

    // Check permissions - assignee or project managers can complete
    const hasProjectAccess = existingTask.project.projectAssignments.length > 0
    const isAssignee = existingTask.assigneeId === session.user.id
    const isExecutive = ['EXECUTIVE', 'ADMIN', 'SITE_MANAGER'].includes(session.user.role)

    if (!isAssignee && !isExecutive && !hasProjectAccess) {
      return NextResponse.json({ error: 'Sin permisos para completar esta tarea' }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = completeTaskSchema.parse(body)

    // Prepare completion data
    const completedAt = validatedData.completedAt ? new Date(validatedData.completedAt) : new Date()
    
    const updateData: any = {
      status: 'COMPLETED',
      completedAt: completedAt
    }

    // Add actual hours if provided
    if (validatedData.actualHours !== undefined) {
      updateData.actualHours = validatedData.actualHours
    }

    // Add notes if provided
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes
    }

    // Update task
    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Tarea completada exitosamente',
      task 
    })

  } catch (error) {
    console.error('Error completing task:', error)
    
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