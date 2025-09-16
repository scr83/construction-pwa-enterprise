import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for recording daily productivity
const productivitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe estar en formato YYYY-MM-DD'),
  hoursWorked: z.number().min(0).max(24, 'Horas trabajadas debe estar entre 0 y 24'),
  tasksCompleted: z.number().int().min(0, 'Tareas completadas debe ser un número positivo'),
  unitsCompleted: z.number().int().min(0, 'Unidades completadas debe ser un número positivo'),
  productivityScore: z.number().min(0).max(100).optional(),
  qualityScore: z.number().min(0).max(100).optional(),
  safetyIncidents: z.number().int().min(0, 'Incidentes de seguridad debe ser un número positivo').optional().default(0),
  notes: z.string().optional()
})

// GET /api/teams/[id]/productivity - Get team productivity data
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const teamId = params.id
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '30')

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
      select: { 
        id: true, 
        name: true, 
        productivityTarget: true,
        members: {
          select: { id: true }
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Build date filter
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate)
    }

    // Get productivity records
    const productivityRecords = await prisma.dailyProductivity.findMany({
      where: {
        teamId,
        ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
      },
      include: {
        recorder: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: limit
    })

    // Calculate summary metrics
    const totalRecords = productivityRecords.length
    const totalHours = productivityRecords.reduce((sum, record) => sum + record.hoursWorked.toNumber(), 0)
    const totalTasks = productivityRecords.reduce((sum, record) => sum + record.tasksCompleted, 0)
    const totalUnits = productivityRecords.reduce((sum, record) => sum + record.unitsCompleted, 0)
    const totalSafetyIncidents = productivityRecords.reduce((sum, record) => sum + record.safetyIncidents, 0)

    const avgProductivity = totalRecords > 0 
      ? Math.round(productivityRecords.reduce((sum, record) => sum + (record.productivityScore?.toNumber() || 0), 0) / totalRecords)
      : 0

    const avgQuality = totalRecords > 0
      ? Math.round(productivityRecords.reduce((sum, record) => sum + (record.qualityScore?.toNumber() || 0), 0) / totalRecords)
      : 0

    // Calculate productivity vs target
    const targetComparison = team.productivityTarget.toNumber() > 0
      ? Math.round((avgProductivity / team.productivityTarget.toNumber()) * 100)
      : 0

    // Calculate weekly trends (last 7 days vs previous 7 days)
    const last7Days = productivityRecords.filter(record => {
      const recordDate = new Date(record.date)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return recordDate >= sevenDaysAgo
    })

    const previous7Days = productivityRecords.filter(record => {
      const recordDate = new Date(record.date)
      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return recordDate >= fourteenDaysAgo && recordDate < sevenDaysAgo
    })

    const last7DaysAvg = last7Days.length > 0
      ? Math.round(last7Days.reduce((sum, record) => sum + (record.productivityScore?.toNumber() || 0), 0) / last7Days.length)
      : 0

    const previous7DaysAvg = previous7Days.length > 0
      ? Math.round(previous7Days.reduce((sum, record) => sum + (record.productivityScore?.toNumber() || 0), 0) / previous7Days.length)
      : 0

    const weeklyTrend = last7DaysAvg - previous7DaysAvg

    const summary = {
      teamId,
      teamName: team.name,
      teamSize: team.members.length,
      recordsCount: totalRecords,
      targetProductivity: team.productivityTarget.toNumber(),
      metrics: {
        totalHours,
        totalTasks,
        totalUnits,
        totalSafetyIncidents,
        avgProductivity,
        avgQuality,
        targetComparison,
        weeklyTrend,
        avgHoursPerDay: totalRecords > 0 ? Math.round((totalHours / totalRecords) * 10) / 10 : 0,
        tasksPerDay: totalRecords > 0 ? Math.round((totalTasks / totalRecords) * 10) / 10 : 0,
        unitsPerDay: totalRecords > 0 ? Math.round((totalUnits / totalRecords) * 10) / 10 : 0
      }
    }

    return NextResponse.json({ 
      summary,
      records: productivityRecords 
    })

  } catch (error) {
    console.error('Error fetching productivity data:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/teams/[id]/productivity - Record daily productivity
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check permissions (SUPERVISOR and above can record productivity)
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
      return NextResponse.json({ error: 'Sin permisos para registrar productividad' }, { status: 403 })
    }

    const teamId = params.id
    const body = await req.json()
    const validatedData = productivitySchema.parse(body)

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
      select: { 
        id: true, 
        name: true,
        productivityTarget: true
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    const recordDate = new Date(validatedData.date + 'T00:00:00.000Z')

    // Check if productivity record already exists for this date
    const existingRecord = await prisma.dailyProductivity.findUnique({
      where: {
        teamId_date: {
          teamId,
          date: recordDate
        }
      }
    })

    if (existingRecord) {
      return NextResponse.json({ error: 'Ya existe un registro de productividad para esta fecha' }, { status: 400 })
    }

    // Calculate productivity score if not provided
    let productivityScore = validatedData.productivityScore
    if (!productivityScore && team.productivityTarget.toNumber() > 0) {
      // Simple productivity calculation based on hours worked vs standard 8-hour day
      const standardHours = 8
      const efficiency = Math.min(validatedData.hoursWorked / standardHours, 1.5) // Cap at 150%
      productivityScore = Math.round(efficiency * team.productivityTarget.toNumber())
    }

    // Create productivity record
    const productivityRecord = await prisma.dailyProductivity.create({
      data: {
        teamId,
        date: recordDate,
        hoursWorked: validatedData.hoursWorked,
        tasksCompleted: validatedData.tasksCompleted,
        unitsCompleted: validatedData.unitsCompleted,
        productivityScore,
        qualityScore: validatedData.qualityScore,
        safetyIncidents: validatedData.safetyIncidents,
        notes: validatedData.notes,
        recordedBy: session.user.id
      },
      include: {
        recorder: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    // Update weekly metrics if it's the end of the week
    const dayOfWeek = recordDate.getDay()
    if (dayOfWeek === 0) { // Sunday - end of week
      await updateWeeklyMetrics(teamId, recordDate)
    }

    return NextResponse.json({ 
      message: 'Productividad registrada exitosamente',
      record: productivityRecord 
    }, { status: 201 })

  } catch (error) {
    console.error('Error recording productivity:', error)
    
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

// Helper function to update weekly metrics
async function updateWeeklyMetrics(teamId: string, endDate: Date) {
  try {
    // Calculate start of week (Monday)
    const startOfWeek = new Date(endDate)
    startOfWeek.setDate(endDate.getDate() - 6)
    startOfWeek.setHours(0, 0, 0, 0)

    // Get all productivity records for the week
    const weeklyRecords = await prisma.dailyProductivity.findMany({
      where: {
        teamId,
        date: {
          gte: startOfWeek,
          lte: endDate
        }
      }
    })

    if (weeklyRecords.length === 0) return

    // Calculate weekly averages
    const avgProductivity = weeklyRecords.reduce((sum, record) => sum + (record.productivityScore?.toNumber() || 0), 0) / weeklyRecords.length
    const avgQualityScore = weeklyRecords.reduce((sum, record) => sum + (record.qualityScore?.toNumber() || 0), 0) / weeklyRecords.length
    const totalTasks = weeklyRecords.reduce((sum, record) => sum + record.tasksCompleted, 0)
    const totalSafetyIncidents = weeklyRecords.reduce((sum, record) => sum + record.safetyIncidents, 0)
    
    // Simple attendance rate calculation (assuming 7 days = 100%)
    const attendanceRate = (weeklyRecords.length / 7) * 100
    
    // Simple safety score (100 - incidents)
    const safetyScore = Math.max(0, 100 - (totalSafetyIncidents * 10))

    // Create or update weekly metrics
    await prisma.teamMetrics.upsert({
      where: {
        teamId_week: {
          teamId,
          week: startOfWeek
        }
      },
      update: {
        avgProductivity,
        avgQualityScore,
        attendanceRate,
        safetyScore,
        tasksCompleted: totalTasks,
        updatedAt: new Date()
      },
      create: {
        teamId,
        week: startOfWeek,
        avgProductivity,
        avgQualityScore,
        attendanceRate,
        safetyScore,
        tasksCompleted: totalTasks
      }
    })
  } catch (error) {
    console.error('Error updating weekly metrics:', error)
  }
}