import { PrismaClient, TaskStatus, TaskPriority, TaskCategory } from '@prisma/client'

const prisma = new PrismaClient()

// Import partidas data
const partidas = [
  { name: 'Trazado y niveles', category: 'Fundaciones', sequence: 1, budgetWeight: 2.5 },
  { name: 'Instalaciones bajo radier', category: 'Fundaciones', sequence: 2, budgetWeight: 3.0 },
  { name: 'Hormigon emplantillado', category: 'Fundaciones', sequence: 3, budgetWeight: 2.8 },
  { name: 'Colocacion de moldajes', category: 'Fundaciones', sequence: 4, budgetWeight: 3.2 },
  { name: 'Rellenos bajo radier', category: 'Fundaciones', sequence: 5, budgetWeight: 2.0 },
  { name: 'Enfierradura', category: 'Estructura', sequence: 6, budgetWeight: 4.5 },
  { name: 'Hormigon radier', category: 'Fundaciones', sequence: 7, budgetWeight: 3.5 },
  { name: 'Levante de estructuras', category: 'Estructura', sequence: 8, budgetWeight: 5.0 },
  { name: 'Sobrelosa', category: 'Estructura', sequence: 9, budgetWeight: 3.8 },
  { name: 'Revestimiento exterior smart panel', category: 'Revestimientos', sequence: 10, budgetWeight: 4.2 },
  { name: 'Revestimiento exterior vinyl siding', category: 'Revestimientos', sequence: 11, budgetWeight: 3.5 },
  { name: 'Cubierta y hojalateria', category: 'Terminaciones', sequence: 12, budgetWeight: 4.8 },
  { name: 'Caseta de caldera', category: 'Instalaciones', sequence: 13, budgetWeight: 1.5 },
  { name: 'Pintura revestimiento exterior', category: 'Terminaciones', sequence: 14, budgetWeight: 2.2 },
  { name: 'Canales y bajadas de aguas lluvias', category: 'Instalaciones', sequence: 15, budgetWeight: 1.8 },
  { name: 'Instalaciones gasfitteria dentro tabique', category: 'Instalaciones', sequence: 16, budgetWeight: 3.0 },
  { name: 'Instalaciones electricas dentro tabique', category: 'Instalaciones', sequence: 17, budgetWeight: 3.2 },
  { name: 'Instalaciones gas sobre tabique', category: 'Instalaciones', sequence: 18, budgetWeight: 2.5 },
  { name: 'Aislacion', category: 'Aislacion', sequence: 19, budgetWeight: 2.8 },
  { name: 'Revestimiento interior (inc ref. y jonas)', category: 'Revestimientos', sequence: 20, budgetWeight: 4.5 },
  { name: 'Nivelacion de piso', category: 'Terminaciones', sequence: 21, budgetWeight: 2.0 },
  { name: 'Instalacion de puertas exteriores', category: 'Terminaciones', sequence: 22, budgetWeight: 2.3 },
  { name: 'Instalacion de puertas interiores', category: 'Terminaciones', sequence: 23, budgetWeight: 2.0 },
  { name: 'Pintura interior y sello', category: 'Terminaciones', sequence: 24, budgetWeight: 3.5 },
  { name: 'Escalera de madera', category: 'Terminaciones', sequence: 25, budgetWeight: 2.8 },
  { name: 'Pavimento ceramico', category: 'Pavimentos', sequence: 26, budgetWeight: 3.2 },
  { name: 'Pavimento spc', category: 'Pavimentos', sequence: 27, budgetWeight: 2.8 },
  { name: 'Pavimento alfombra', category: 'Pavimentos', sequence: 28, budgetWeight: 2.5 },
  { name: 'Artefactos y griferias', category: 'Instalaciones', sequence: 29, budgetWeight: 2.2 },
  { name: 'Ceramico revestimiento interior', category: 'Revestimientos', sequence: 30, budgetWeight: 2.8 },
  { name: 'Guardapolvos y cubrejuntas', category: 'Terminaciones', sequence: 31, budgetWeight: 1.5 },
  { name: 'Muebles y closets', category: 'Terminaciones', sequence: 32, budgetWeight: 3.0 },
  { name: 'Cableado, artefactado y tablero', category: 'Instalaciones', sequence: 33, budgetWeight: 2.5 },
  { name: 'Instalacion de calderas', category: 'Instalaciones', sequence: 34, budgetWeight: 2.0 },
  { name: 'Acometidas sanitarias', category: 'Instalaciones', sequence: 35, budgetWeight: 2.2 },
  { name: 'Acometida y tierra electrica', category: 'Instalaciones', sequence: 36, budgetWeight: 1.8 },
  { name: 'Cierro hv', category: 'Exteriores', sequence: 37, budgetWeight: 2.0 },
  { name: 'Cierro metalico', category: 'Exteriores', sequence: 38, budgetWeight: 1.8 },
  { name: 'Pastelones y huellas de acceso', category: 'Exteriores', sequence: 39, budgetWeight: 1.5 },
  { name: 'Revision y entrega', category: 'Entrega', sequence: 40, budgetWeight: 1.0 },
]

async function main() {
  console.log('🏗️ Seeding construction management database...')

  // First, seed the 40 standard partidas
  console.log('🚀 Seeding partidas...')
  
  let partidasCreated = 0
  let partidasSkipped = 0

  for (const partida of partidas) {
    try {
      await prisma.partida.create({
        data: {
          id: `partida-${partida.sequence}`,
          ...partida,
        },
      })
      partidasCreated++
      console.log(`✅ Created: ${partida.name}`)
    } catch (error: any) {
      if (error.code === 'P2002') {
        partidasSkipped++
        console.log(`⏭️  Skipped (exists): ${partida.name}`)
      } else {
        console.error(`❌ Error creating ${partida.name}:`, error.message)
        throw error
      }
    }
  }

  console.log(`📊 Partidas Summary: Created ${partidasCreated}, Skipped ${partidasSkipped}`)

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

  // Create sample tasks
  console.log('🎯 Creating sample tasks...')
  
  const sampleTasks = [
    {
      title: 'Instalación de Moldajes - EA-101',
      description: 'Instalación de moldajes de madera para hormigonado de muros perimetrales. Verificar nivelación y aplomado antes del hormigonado.',
      priority: 'HIGH',
      category: 'STRUCTURE',
      building: 'Edificio A',
      unit: 'EA-101',
      partida: 'Levante de Estructuras',
      estimatedHours: 16,
      materials: ['Madera pino 2x4', 'Clavos 3 pulgadas', 'Alambre negro N°16', 'Aceite desmoldante'],
      prerequisites: ['Fierros instalados', 'Instalaciones embebidas'],
      dueDate: new Date('2025-10-15'),
      startDate: new Date('2025-10-12')
    },
    {
      title: 'Entrega de Kit de Materiales - EA-102',
      description: 'Preparar y entregar kit de materiales para inicio de obra gruesa. Coordinar con jefe de terreno para recepción.',
      priority: 'MEDIUM',
      category: 'MATERIALS',
      building: 'Edificio A',
      unit: 'EA-102',
      partida: 'Kit de Materiales',
      estimatedHours: 4,
      materials: ['Cemento 42.5kg x20 sacos', 'Fierro 8mm x50 metros', 'Gravilla x2 m³', 'Arena x1.5 m³'],
      prerequisites: ['Autorización de inicio', 'Espacio de almacenaje despejado'],
      dueDate: new Date('2025-10-16'),
      startDate: new Date('2025-10-16')
    },
    {
      title: 'Inspección de Calidad - Radier EA-103',
      description: 'Inspección de calidad post-hormigonado de radier. Verificar resistencia, nivelación y acabado superficial.',
      priority: 'HIGH',
      category: 'QUALITY',
      building: 'Edificio A',
      unit: 'EA-103',
      partida: 'Control de Calidad',
      estimatedHours: 3,
      materials: ['Esclerómetro', 'Nivel láser', 'Formularios de inspección'],
      prerequisites: ['Radier curado 24hrs mínimo', 'Limpieza de superficie'],
      dueDate: new Date('2025-10-13'),
      startDate: new Date('2025-10-13'),
      status: 'DELAYED',
      notes: 'Pendiente por lluvia del día anterior'
    },
    {
      title: 'Instalación Eléctrica - EA-104',
      description: 'Instalación de canalizaciones eléctricas y cajas de registro. Coordinar con estructuras para perforaciones.',
      priority: 'MEDIUM',
      category: 'INSTALLATIONS',
      building: 'Edificio A',
      unit: 'EA-104',
      partida: 'Instalaciones Eléctricas',
      estimatedHours: 12,
      materials: ['Conduit PVC 20mm', 'Cajas octogonales', 'Alambre THHN 12 AWG', 'Tacos y tornillos'],
      prerequisites: ['Muros hormigonados', 'Planos de instalaciones actualizados'],
      dueDate: new Date('2025-10-18'),
      startDate: new Date('2025-10-17')
    },
    {
      title: 'Pintura Interior - EA-105',
      description: 'Aplicación de pintura interior en muros y cielos. Dos manos de pintura látex color blanco hueso.',
      priority: 'LOW',
      category: 'FINISHES',
      building: 'Edificio A',
      unit: 'EA-105',
      partida: 'Terminaciones',
      estimatedHours: 8,
      actualHours: 9,
      materials: ['Pintura látex blanca x4 galones', 'Rodillos', 'Brochas', 'Lijas grano 120'],
      prerequisites: ['Pasta muro aplicada', 'Superficies lijadas'],
      dueDate: new Date('2025-10-10'),
      startDate: new Date('2025-10-08'),
      status: 'COMPLETED',
      completedAt: new Date('2025-10-10T17:30:00Z')
    },
    {
      title: 'Revisión Técnica Estructural',
      description: 'Revisión técnica de cálculos estructurales para modificación en vano de ventana. Requiere aprobación antes de ejecutar.',
      priority: 'URGENT',
      category: 'TECHNICAL_OFFICE',
      building: 'Edificio A',
      unit: 'General',
      partida: 'Oficina Técnica',
      estimatedHours: 6,
      actualHours: 3,
      materials: ['Planos estructurales', 'Software de cálculo', 'Normativa NCh'],
      prerequisites: ['Solicitud de modificación aprobada', 'Planos de arquitectura actualizados'],
      dueDate: new Date('2025-10-14'),
      startDate: new Date('2025-10-13'),
      status: 'IN_PROGRESS'
    },
    {
      title: 'Preparación del Terreno - Fase 1',
      description: 'Excavación y movimiento de tierra para preparación de fundaciones. Incluye nivelación y compactación.',
      priority: 'HIGH',
      category: 'STRUCTURE',
      building: 'Edificio A',
      unit: 'Fundaciones',
      partida: 'Excavaciones y movimiento tierra',
      estimatedHours: 24,
      materials: ['Combustible maquinaria', 'Topografía', 'Compactador', 'Material de relleno'],
      prerequisites: ['Permiso municipal', 'Trazado aprobado'],
      dueDate: new Date('2025-10-20'),
      startDate: new Date('2025-10-18')
    }
  ]

  // Create tasks for existing users
  for (let i = 0; i < sampleTasks.length; i++) {
    const taskData = sampleTasks[i]
    const assigneeIndex = i % users.length
    const creatorIndex = (i + 1) % users.length
    const projectId = i % 2 === 0 ? project1.id : project2.id

    await prisma.task.upsert({
      where: { id: `task-${i + 1}` },
      update: {},
      create: {
        id: `task-${i + 1}`,
        title: taskData.title,
        description: taskData.description,
        assigneeId: users[assigneeIndex].id,
        createdById: users[creatorIndex].id,
        projectId: projectId,
        status: (taskData.status as TaskStatus) || TaskStatus.PENDING,
        priority: taskData.priority as TaskPriority,
        category: taskData.category as TaskCategory,
        dueDate: taskData.dueDate,
        startDate: taskData.startDate,
        completedAt: taskData.completedAt,
        estimatedHours: taskData.estimatedHours,
        actualHours: taskData.actualHours,
        building: taskData.building,
        unit: taskData.unit,
        partida: taskData.partida,
        materials: taskData.materials,
        prerequisites: taskData.prerequisites,
        notes: taskData.notes
      }
    })
  }

  console.log('✅ Created sample tasks for demonstration')

  // Summary
  const projectCount = await prisma.project.count()
  const teamCount = await prisma.team.count()
  const productivityRecords = await prisma.dailyProductivity.count()
  const assignments = await prisma.projectAssignment.count()
  const partidaCount = await prisma.partida.count()
  const taskCount = await prisma.task.count()

  console.log('\n🎉 Database seeded successfully!')
  console.log('=====================================')
  console.log(`📊 Projects: ${projectCount}`)
  console.log(`🏗️  Partidas: ${partidaCount}`)
  console.log(`📋 Tasks: ${taskCount}`)
  console.log(`👥 Teams: ${teamCount}`)
  console.log(`📈 Productivity Records: ${productivityRecords}`)
  console.log(`🔗 Project Assignments: ${assignments}`)
  console.log(`👤 Users: ${users.length}`)
  console.log('\n✅ Dashboard should now show real productivity data!')
  console.log('✅ "Crear Equipo" functionality ready for demos!')
  console.log('✅ 40 standard Chilean construction partidas available!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
