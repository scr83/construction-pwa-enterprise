import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Get all tasks with counts by status
    const taskStats = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    // Get tasks created in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentTasks = await prisma.task.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        status: true,
        createdAt: true,
        completedAt: true,
        estimatedHours: true,
        actualHours: true
      }
    })

    // Get tasks completed today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const completedToday = await prisma.task.count({
      where: {
        status: 'COMPLETED',
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Get overdue tasks
    const overdueTasks = await prisma.task.count({
      where: {
        status: {
          in: ['PENDING', 'IN_PROGRESS', 'DELAYED']
        },
        dueDate: {
          lt: new Date()
        }
      }
    })

    // Calculate task completion rate
    const totalTasks = taskStats.reduce((sum, stat) => sum + stat._count.status, 0)
    const completedTasks = taskStats.find(stat => stat.status === 'COMPLETED')?._count.status || 0
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Calculate average completion time for completed tasks
    const completedTasksWithTime = recentTasks.filter(task => 
      task.status === 'COMPLETED' && task.completedAt && task.createdAt
    )
    
    const avgCompletionTime = completedTasksWithTime.length > 0 
      ? completedTasksWithTime.reduce((sum, task) => {
          const timeDiff = new Date(task.completedAt!).getTime() - new Date(task.createdAt).getTime()
          return sum + (timeDiff / (1000 * 60 * 60 * 24)) // Convert to days
        }, 0) / completedTasksWithTime.length
      : 0

    // Calculate hour efficiency (actual vs estimated)
    const tasksWithHours = recentTasks.filter(task => 
      task.estimatedHours && task.actualHours && task.status === 'COMPLETED'
    )
    
    const hourEfficiency = tasksWithHours.length > 0
      ? tasksWithHours.reduce((sum, task) => {
          const efficiency = (task.estimatedHours! / task.actualHours!) * 100
          return sum + Math.min(efficiency, 200) // Cap at 200% to avoid outliers
        }, 0) / tasksWithHours.length
      : 100

    // Build status breakdown
    const statusBreakdown = {
      PENDING: 0,
      IN_PROGRESS: 0, 
      COMPLETED: 0,
      DELAYED: 0,
      CANCELLED: 0
    }

    taskStats.forEach(stat => {
      statusBreakdown[stat.status as keyof typeof statusBreakdown] = stat._count.status
    })

    // Calculate weekly trend
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    
    const tasksLastWeek = await prisma.task.count({
      where: {
        status: 'COMPLETED',
        completedAt: {
          gte: lastWeek,
          lt: today
        }
      }
    })

    const weeklyTrend = tasksLastWeek > 0 ? ((completedToday - tasksLastWeek) / tasksLastWeek) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalTasks,
          completedTasks,
          completionRate: Math.round(completionRate),
          completedToday,
          overdueTasks,
          avgCompletionTime: Math.round(avgCompletionTime * 10) / 10, // Round to 1 decimal
          hourEfficiency: Math.round(hourEfficiency),
          weeklyTrend: Math.round(weeklyTrend),
          statusBreakdown
        }
      }
    })

  } catch (error) {
    console.error('Error fetching task metrics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}