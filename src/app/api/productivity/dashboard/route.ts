import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/productivity/dashboard - Get overall productivity KPIs for dashboard
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    // Get user's assigned projects
    let userProjects: { projectId: string }[] = []
    if (projectId) {
      // Verify user has access to specific project
      const projectAccess = await prisma.projectAssignment.findFirst({
        where: { 
          userId: session.user.id,
          projectId 
        }
      })
      if (projectAccess) {
        userProjects = [{ projectId }]
      }
    } else {
      userProjects = await prisma.projectAssignment.findMany({
        where: { userId: session.user.id },
        select: { projectId: true }
      })
    }

    if (userProjects.length === 0) {
      return NextResponse.json({
        kpis: {
          totalTeams: 0,
          activeTeams: 0,
          overallProductivity: 0,
          qualityScore: 0,
          safetyScore: 0,
          dailyEfficiency: 0,
          weeklyTrend: 0,
          daysWithoutIncidents: 0
        },
        recentActivity: [],
        topPerformingTeams: [],
        alerts: []
      })
    }

    const projectIds = userProjects.map(p => p.projectId)

    // Get all teams for user's projects
    const teams = await prisma.team.findMany({
      where: {
        projectId: { in: projectIds }
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        supervisor: {
          select: { id: true, name: true }
        },
        members: {
          select: { id: true, status: true }
        },
        productivity: {
          where: {
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
            }
          },
          orderBy: { date: 'desc' }
        },
        metrics: {
          orderBy: { week: 'desc' },
          take: 4 // Last 4 weeks
        }
      }
    })

    const activeTeams = teams.filter(team => team.status === 'active')
    const totalTeams = teams.length

    // Calculate overall productivity metrics
    let totalProductivity = 0
    let totalQuality = 0
    let totalTasks = 0
    let totalIncidents = 0
    let validTeamsCount = 0

    const today = new Date()
    const lastWeek = new Date()
    lastWeek.setDate(today.getDate() - 7)

    // Recent productivity data (last 7 days)
    const recentProductivityData: any[] = []
    const previousWeekProductivityData: any[] = []

    teams.forEach(team => {
      const recentProductivity = team.productivity.filter(p => new Date(p.date) >= lastWeek)
      const previousWeekProductivity = team.productivity.filter(p => {
        const date = new Date(p.date)
        const twoWeeksAgo = new Date()
        twoWeeksAgo.setDate(today.getDate() - 14)
        return date >= twoWeeksAgo && date < lastWeek
      })

      if (recentProductivity.length > 0) {
        validTeamsCount++
        
        const avgProductivity = recentProductivity.reduce((sum, p) => sum + (p.productivityScore?.toNumber() || 0), 0) / recentProductivity.length
        const avgQuality = recentProductivity.reduce((sum, p) => sum + (p.qualityScore?.toNumber() || 0), 0) / recentProductivity.length
        const teamTasks = recentProductivity.reduce((sum, p) => sum + p.tasksCompleted, 0)
        const teamIncidents = recentProductivity.reduce((sum, p) => sum + p.safetyIncidents, 0)

        totalProductivity += avgProductivity
        totalQuality += avgQuality
        totalTasks += teamTasks
        totalIncidents += teamIncidents

        recentProductivityData.push({
          teamId: team.id,
          teamName: team.name,
          productivity: avgProductivity,
          quality: avgQuality,
          tasks: teamTasks,
          incidents: teamIncidents
        })

        // For trend calculation
        if (previousWeekProductivity.length > 0) {
          const prevAvgProductivity = previousWeekProductivity.reduce((sum, p) => sum + (p.productivityScore?.toNumber() || 0), 0) / previousWeekProductivity.length
          previousWeekProductivityData.push({
            teamId: team.id,
            productivity: prevAvgProductivity
          })
        }
      }
    })

    // Calculate KPIs
    const overallProductivity = validTeamsCount > 0 ? Math.round(totalProductivity / validTeamsCount) : 0
    const qualityScore = validTeamsCount > 0 ? Math.round(totalQuality / validTeamsCount) : 0
    const safetyScore = Math.max(0, 100 - (totalIncidents * 5)) // Simple safety calculation

    // Calculate weekly trend
    const currentWeekAvg = recentProductivityData.length > 0 
      ? recentProductivityData.reduce((sum, t) => sum + t.productivity, 0) / recentProductivityData.length
      : 0
    const previousWeekAvg = previousWeekProductivityData.length > 0
      ? previousWeekProductivityData.reduce((sum, t) => sum + t.productivity, 0) / previousWeekProductivityData.length
      : 0
    const weeklyTrend = Math.round(currentWeekAvg - previousWeekAvg)

    // Calculate daily efficiency (simplified as productivity vs target)
    const targetProductivity = 85 // Standard target
    const dailyEfficiency = Math.round((overallProductivity / targetProductivity) * 100)

    // Calculate days without incidents
    let daysWithoutIncidents = 0
    const sortedProductivity = teams
      .flatMap(team => team.productivity)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    for (const record of sortedProductivity) {
      if (record.safetyIncidents === 0) {
        daysWithoutIncidents++
      } else {
        break
      }
    }

    // Get top performing teams (top 3 by recent productivity)
    const topPerformingTeams = recentProductivityData
      .sort((a, b) => b.productivity - a.productivity)
      .slice(0, 3)
      .map(team => ({
        id: team.teamId,
        name: team.teamName,
        productivity: team.productivity,
        quality: team.quality,
        tasks: team.tasks
      }))

    // Get recent activity (last 10 productivity records)
    const recentActivity = await prisma.dailyProductivity.findMany({
      where: {
        team: {
          projectId: { in: projectIds }
        }
      },
      include: {
        team: {
          select: { id: true, name: true }
        },
        recorder: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Generate alerts for critical issues
    const alerts = []
    
    // Low productivity alert
    const lowProductivityTeams = recentProductivityData.filter(team => team.productivity < 70)
    if (lowProductivityTeams.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Productividad Baja',
        message: `${lowProductivityTeams.length} equipo(s) con productividad bajo 70%`,
        teams: lowProductivityTeams.map(t => t.teamName)
      })
    }

    // Safety incidents alert
    if (totalIncidents > 0) {
      alerts.push({
        type: 'error',
        title: 'Incidentes de Seguridad',
        message: `${totalIncidents} incidente(s) reportado(s) esta semana`,
        severity: 'high'
      })
    }

    // Quality issues alert
    const lowQualityTeams = recentProductivityData.filter(team => team.quality < 80)
    if (lowQualityTeams.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Problemas de Calidad',
        message: `${lowQualityTeams.length} equipo(s) con calidad bajo 80%`,
        teams: lowQualityTeams.map(t => t.teamName)
      })
    }

    const kpis = {
      totalTeams,
      activeTeams: activeTeams.length,
      overallProductivity,
      qualityScore,
      safetyScore,
      dailyEfficiency,
      weeklyTrend,
      daysWithoutIncidents,
      totalTasks,
      totalIncidents,
      // Additional metrics for enhanced dashboard
      teamUtilization: totalTeams > 0 ? Math.round((activeTeams.length / totalTeams) * 100) : 0,
      avgTasksPerTeam: validTeamsCount > 0 ? Math.round(totalTasks / validTeamsCount) : 0
    }

    return NextResponse.json({
      kpis,
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        teamId: activity.teamId,
        teamName: activity.team.name,
        date: activity.date,
        productivity: activity.productivityScore?.toNumber() || 0,
        quality: activity.qualityScore?.toNumber() || 0,
        tasks: activity.tasksCompleted,
        recorder: activity.recorder.name,
        createdAt: activity.createdAt
      })),
      topPerformingTeams,
      alerts,
      teamBreakdown: recentProductivityData
    })

  } catch (error) {
    console.error('Error fetching dashboard productivity:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}