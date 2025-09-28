import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for creating a new task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Título de la tarea es requerido'),
  description: z.string().optional(),
  assigneeId: z.string().min(1, 'ID del asignado es requerido'),
  projectId: z.string().min(1, 'ID del proyecto es requerido'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
  category: z.enum(['GENERAL', 'STRUCTURE', 'MATERIALS', 'QUALITY', 'INSTALLATIONS', 'FINISHES', 'TECHNICAL_OFFICE']).optional().default('GENERAL'),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  estimatedHours: z.number().min(0).optional(),
  building: z.string().optional(),
  unit: z.string().optional(),
  partida: z.string().optional(),
  materials: z.array(z.string()).optional().default([]),
  prerequisites: z.array(z.string()).optional().default([]),
  notes: z.string().optional()
})

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

// GET /api/tasks - List all tasks with optional filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const assigneeId = searchParams.get('assigneeId')
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const building = searchParams.get('building')
    const unit = searchParams.get('unit')
    const dueDateFrom = searchParams.get('dueDateFrom')
    const dueDateTo = searchParams.get('dueDateTo')
    const search = searchParams.get('search')

    // Build where clause based on user role and filters
    const whereClause: any = {}
    
    // Filter by assignee if specified
    if (assigneeId) {
      whereClause.assigneeId = assigneeId
    }

    // If specific project is requested
    if (projectId) {
      whereClause.projectId = projectId
    } else {
      // Get user's assigned projects
      const userProjects = await prisma.projectAssignment.findMany({
        where: { userId: session.user.id },
        select: { projectId: true }
      })
      
      if (userProjects.length > 0) {
        whereClause.projectId = {
          in: userProjects.map(p => p.projectId)
        }
      } else {
        // If user has no projects assigned, only show tasks assigned to them
        whereClause.assigneeId = session.user.id
      }
    }

    // Add other filters
    if (status) {
      whereClause.status = status
    }
    if (priority) {
      whereClause.priority = priority
    }
    if (category) {
      whereClause.category = category
    }
    if (building) {
      whereClause.building = { contains: building, mode: 'insensitive' }
    }
    if (unit) {
      whereClause.unit = { contains: unit, mode: 'insensitive' }
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { partida: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Date range filter
    if (dueDateFrom || dueDateTo) {
      whereClause.dueDate = {}
      if (dueDateFrom) {
        whereClause.dueDate.gte = new Date(dueDateFrom)
      }
      if (dueDateTo) {
        whereClause.dueDate.lte = new Date(dueDateTo)
      }
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
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
      },
      orderBy: [
        { status: 'asc' }, // PENDING first, then COMPLETED last
        { priority: 'desc' }, // URGENT first
        { dueDate: 'asc' }, // Earliest due date first
        { createdAt: 'desc' } // Most recent first
      ]
    })

    return NextResponse.json({ tasks })

  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create new task
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createTaskSchema.parse(body)

    // Verify project exists and user has access
    const project = await prisma.project.findFirst({
      where: { 
        id: validatedData.projectId,
        OR: [
          {
            projectAssignments: {
              some: { userId: session.user.id }
            }
          },
          // Allow executives to create tasks in any project
          {
            AND: [
              { status: { in: ['PLANNING', 'ACTIVE'] } },
              { 
                projectAssignments: {
                  some: { 
                    user: { 
                      role: { in: ['EXECUTIVE', 'ADMIN'] }
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado o sin acceso' }, { status: 404 })
    }

    // Verify assignee exists and has access to the project
    const assignee = await prisma.user.findFirst({
      where: { 
        id: validatedData.assigneeId,
        isActive: true,
        OR: [
          {
            projectAssignments: {
              some: { projectId: validatedData.projectId }
            }
          },
          // Allow assigning to executives
          { role: { in: ['EXECUTIVE', 'ADMIN'] } }
        ]
      }
    })

    if (!assignee) {
      return NextResponse.json({ error: 'Usuario asignado no encontrado o sin acceso al proyecto' }, { status: 404 })
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        assigneeId: validatedData.assigneeId,
        createdById: session.user.id,
        projectId: validatedData.projectId,
        priority: validatedData.priority,
        category: validatedData.category,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        estimatedHours: validatedData.estimatedHours,
        building: validatedData.building,
        unit: validatedData.unit,
        partida: validatedData.partida,
        materials: validatedData.materials,
        prerequisites: validatedData.prerequisites,
        notes: validatedData.notes
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
      message: 'Tarea creada exitosamente',
      task 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating task:', error)
    
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