import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🏗️ Seeding construction management database...')

  // Create sample projects
  const project1 = await prisma.project.upsert({
    where: { id: 'proj-1' },
    update: {},
    create: {
      id: 'proj-1',
      name: 'Edificio Las Condes',
      description: 'Proyecto residencial de 120 departamentos',
      projectType: 'residential',
      status: 'ACTIVE',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-15'),
    },
  })

  const project2 = await prisma.project.upsert({
    where: { id: 'proj-2' },
    update: {},
    create: {
      id: 'proj-2',
      name: 'Torre Empresarial',
      description: 'Edificio comercial de oficinas',
      projectType: 'commercial',
      status: 'ACTIVE',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2025-06-30'),
    },
  })

  console.log('✅ Created projects')

  // Get all existing users to assign to projects
  const users = await prisma.user.findMany()
  
  if (users.length === 0) {
    console.log('❌ No users found. Please login first to create user records.')
    return
  }

  // Assign all users to both projects
  for (const user of users) {
    await prisma.projectAssignment.upsert({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: project1.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        projectId: project1.id,
        role: user.role === 'EXECUTIVE' ? 'PROJECT_MANAGER' : 'SITE_SUPERVISOR'
      }
    })

    await prisma.projectAssignment.upsert({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: project2.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        projectId: project2.id,
        role: user.role === 'EXECUTIVE' ? 'PROJECT_MANAGER' : 'SITE_SUPERVISOR'
      }
    })
  }

  console.log(`✅ Assigned ${users.length} users to projects`)

  // Create sample teams for first user
  const firstUser = users[0]
  
  const team1 = await prisma.team.upsert({
    where: { id: 'team-1' },
    update: {},
    create: {
      id: 'team-1',
      name: 'Cuadrilla Estructuras A',
      type: 'estructuras',
      projectId: project1.id,
      supervisorId: firstUser.id,
      status: 'active',
      specialties: ['Hormigón Armado', 'Enfierradura', 'Moldajes'],
      productivityTarget: 85,
    },
  })

  const team2 = await prisma.team.upsert({
    where: { id: 'team-2' },
    update: {},
    create: {
      id: 'team-2',
      name: 'Cuadrilla Instalaciones B',
      type: 'instalaciones',
      projectId: project1.id,
      supervisorId: firstUser.id,
      status: 'active',
      specialties: ['Instalaciones Eléctricas', 'Instalaciones Sanitarias'],
      productivityTarget: 90,
    },
  })

  const team3 = await prisma.team.upsert({
    where: { id: 'team-3' },
    update: {},
    create: {
      id: 'team-3',
      name: 'Cuadrilla Terminaciones C',
      type: 'terminaciones',
      projectId: project2.id,
      supervisorId: firstUser.id,
      status: 'active',
      specialties: ['Revestimientos', 'Pintura', 'Pavimentos'],
      productivityTarget: 80,
    },
  })

  console.log('✅ Created sample teams')

  // Create team members for each team
  if (users.length > 1) {
    // Add other users as team members
    const roles = ['maestro_mayor', 'maestro_albanil', 'oficial_primera', 'oficial_segunda', 'ayudante']
    
    for (let i = 1; i < Math.min(users.length, 4); i++) {
      const user = users[i]
      const role = roles[i - 1] || 'ayudante'
      
      await prisma.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: team1.id,
            userId: user.id
          }
        },
        update: {},
        create: {
          teamId: team1.id,
          userId: user.id,
          role: role,
          hourlyRate: 15000 + (i * 2000), // Chilean pesos
          status: 'active',
          performanceRating: 85 + (i * 5),
        }
      })
    }
  }

  console.log('✅ Created team members')

  // Create realistic productivity data for last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const teams = [team1, team2, team3]
  
  for (const team of teams) {
    for (let day = 0; day < 30; day++) {
      const date = new Date(thirtyDaysAgo)
      date.setDate(date.getDate() + day)
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      // Generate realistic productivity data
      const baseProductivity = team.type === 'estructuras' ? 75 : 
                              team.type === 'instalaciones' ? 85 : 80
      
      const dailyVariation = (Math.random() - 0.5) * 20 // ±10%
      const productivity = Math.max(40, Math.min(120, baseProductivity + dailyVariation))
      
      const qualityScore = Math.max(70, Math.min(100, 85 + (Math.random() - 0.5) * 20))
      const tasksCompleted = Math.floor(Math.random() * 8) + 3 // 3-10 tasks
      const hoursWorked = 8 + (Math.random() - 0.5) * 2 // 7-9 hours
      const safetyIncidents = Math.random() < 0.05 ? 1 : 0 // 5% chance of incident
      
      await prisma.dailyProductivity.upsert({
        where: {
          teamId_date: {
            teamId: team.id,
            date: date
          }
        },
        update: {},
        create: {
          teamId: team.id,
          date: date,
          hoursWorked: hoursWorked,
          tasksCompleted: tasksCompleted,
          unitsCompleted: Math.floor(tasksCompleted / 2),
          productivityScore: productivity,
          qualityScore: qualityScore,
          safetyIncidents: safetyIncidents,
          notes: day % 5 === 0 ? 'Entrega de materiales retrasada' : null,
          recordedBy: firstUser.id,
        }
      })
    }
  }

  console.log('✅ Created 30 days of realistic productivity data')

  // Create weekly team metrics
  const weeksAgo = [0, 7, 14, 21, 28]
  
  for (const team of teams) {
    for (const daysBack of weeksAgo) {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - daysBack)
      weekStart.setHours(0, 0, 0, 0)
      
      // Get productivity data for this week
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      const weekProductivity = await prisma.dailyProductivity.findMany({
        where: {
          teamId: team.id,
          date: {
            gte: weekStart,
            lte: weekEnd
          }
        }
      })
      
      if (weekProductivity.length > 0) {
        const avgProductivity = weekProductivity.reduce((sum, p) => 
          sum + (p.productivityScore?.toNumber() || 0), 0) / weekProductivity.length
        const avgQuality = weekProductivity.reduce((sum, p) => 
          sum + (p.qualityScore?.toNumber() || 0), 0) / weekProductivity.length
        const totalTasks = weekProductivity.reduce((sum, p) => sum + p.tasksCompleted, 0)
        
        await prisma.teamMetrics.upsert({
          where: {
            teamId_week: {
              teamId: team.id,
              week: weekStart
            }
          },
          update: {},
          create: {
            teamId: team.id,
            week: weekStart,
            avgProductivity: avgProductivity,
            avgQualityScore: avgQuality,
            attendanceRate: 95,
            safetyScore: weekProductivity.some(p => p.safetyIncidents > 0) ? 85 : 100,
            tasksCompleted: totalTasks,
            costEfficiency: 92,
          }
        })
      }
    }
  }

  console.log('✅ Created weekly team metrics')

  // Summary
  const projectCount = await prisma.project.count()
  const teamCount = await prisma.team.count()
  const productivityRecords = await prisma.dailyProductivity.count()
  const assignments = await prisma.projectAssignment.count()

  console.log('\n🎉 Database seeded successfully!')
  console.log('=====================================')
  console.log(`📊 Projects: ${projectCount}`)
  console.log(`👥 Teams: ${teamCount}`)
  console.log(`📈 Productivity Records: ${productivityRecords}`)
  console.log(`🔗 Project Assignments: ${assignments}`)
  console.log(`👤 Users: ${users.length}`)
  console.log('\n✅ Dashboard should now show real productivity data!')
  console.log('✅ "Crear Equipo" functionality ready for demos!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
