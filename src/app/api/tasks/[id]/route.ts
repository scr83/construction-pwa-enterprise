import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for updating task
const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DELAYED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category: z.enum(['GENERAL', 'STRUCTURE', 'MATERIALS', 'QUALITY', 'INSTALLATIONS', 'FINISHES', 'TECHNICAL_OFFICE']).optional(),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  completedAt: z.string().optional(),
  estimatedHours: z.number().min(0).optional(),
  actualHours: z.number().min(0).optional(),
  building: z.string().optional(),
  unit: z.string().optional(),
  partida: z.string().optional(),
  materials: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  notes: z.string().optional()
})

// GET /api/tasks/[id] - Get specific task
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
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

    if (!task) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 })
    }

    // Check if user has access to this task
    const hasAccess = await prisma.projectAssignment.findFirst({
      where: {
        userId: session.user.id,
        projectId: task.projectId
      }
    })

    // Allow if user is assigned to the project, or is the assignee, or is an executive
    if (!hasAccess && 
        task.assigneeId !== session.user.id && 
        !['EXECUTIVE', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin acceso a esta tarea' }, { status: 403 })
    }

    return NextResponse.json({ task })

  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/tasks/[id] - Update task
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check if task exists and user has access
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

    // Check permissions
    const hasProjectAccess = existingTask.project.projectAssignments.length > 0
    const isAssignee = existingTask.assigneeId === session.user.id
    const isCreator = existingTask.createdById === session.user.id
    const isExecutive = ['EXECUTIVE', 'ADMIN', 'SITE_MANAGER'].includes(session.user.role)

    if (!hasProjectAccess && !isAssignee && !isCreator && !isExecutive) {
      return NextResponse.json({ error: 'Sin permisos para editar esta tarea' }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = updateTaskSchema.parse(body)

    // If changing assignee, verify they have access to the project
    if (validatedData.assigneeId && validatedData.assigneeId !== existingTask.assigneeId) {
      const newAssignee = await prisma.user.findFirst({
        where: { 
          id: validatedData.assigneeId,
          isActive: true,
          OR: [
            {
              projectAssignments: {
                some: { projectId: existingTask.projectId }
              }
            },
            { role: { in: ['EXECUTIVE', 'ADMIN'] } }
          ]
        }
      })

      if (!newAssignee) {
        return NextResponse.json({ error: 'Nuevo asignado no encontrado o sin acceso al proyecto' }, { status: 404 })
      }
    }

    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // Convert date strings to Date objects
    if (validatedData.dueDate) {
      updateData.dueDate = new Date(validatedData.dueDate)
    }
    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate)
    }
    if (validatedData.completedAt) {
      updateData.completedAt = new Date(validatedData.completedAt)
    }

    // Auto-set completedAt when status changes to COMPLETED
    if (validatedData.status === 'COMPLETED' && !validatedData.completedAt) {
      updateData.completedAt = new Date()
    }

    // Clear completedAt when status changes away from COMPLETED
    if (validatedData.status && validatedData.status !== 'COMPLETED') {
      updateData.completedAt = null
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
      message: 'Tarea actualizada exitosamente',
      task 
    })

  } catch (error) {
    console.error('Error updating task:', error)
    
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

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check if task exists and user has access
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

    // Check permissions - only creator, project managers, or executives can delete
    const hasProjectAccess = existingTask.project.projectAssignments.length > 0
    const isCreator = existingTask.createdById === session.user.id
    const isExecutive = ['EXECUTIVE', 'ADMIN', 'SITE_MANAGER'].includes(session.user.role)

    if (!isCreator && !isExecutive && !hasProjectAccess) {
      return NextResponse.json({ error: 'Sin permisos para eliminar esta tarea' }, { status: 403 })
    }

    // Delete task
    await prisma.task.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: 'Tarea eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}