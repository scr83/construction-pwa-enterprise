import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/tasks/[id]/start - Mark task as in progress
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

    // Check if task is already completed or in progress
    if (existingTask.status === 'COMPLETED') {
      return NextResponse.json({ error: 'La tarea ya está completada' }, { status: 400 })
    }
    if (existingTask.status === 'IN_PROGRESS') {
      return NextResponse.json({ error: 'La tarea ya está en progreso' }, { status: 400 })
    }

    // Check permissions - assignee or project managers can start
    const hasProjectAccess = existingTask.project.projectAssignments.length > 0
    const isAssignee = existingTask.assigneeId === session.user.id
    const isExecutive = ['EXECUTIVE', 'ADMIN', 'SITE_MANAGER'].includes(session.user.role)

    if (!isAssignee && !isExecutive && !hasProjectAccess) {
      return NextResponse.json({ error: 'Sin permisos para iniciar esta tarea' }, { status: 403 })
    }

    // Update task to IN_PROGRESS
    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        status: 'IN_PROGRESS',
        startDate: existingTask.startDate || new Date()
      },
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
      message: 'Tarea iniciada exitosamente',
      task 
    })

  } catch (error) {
    console.error('Error starting task:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}