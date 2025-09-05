import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@constructorpro.com' },
    update: {},
    create: {
      name: 'Administrador ConstructorPro',
      email: 'admin@constructorpro.com',
      password: adminPassword,
      role: 'ADMIN',
      company: 'ConstructorPro',
      phone: '+56912345678',
      isActive: true,
    }
  })

  console.log('✅ Usuario administrador creado:', adminUser.email)

  // Crear usuario jefe de terreno para pruebas
  const siteManagerPassword = await bcrypt.hash('terreno123', 10)
  
  const siteManagerUser = await prisma.user.upsert({
    where: { email: 'terreno@constructorpro.com' },
    update: {},
    create: {
      name: 'Juan Pérez',
      email: 'terreno@constructorpro.com',
      password: siteManagerPassword,
      role: 'SITE_MANAGER',
      company: 'ConstructorPro',
      phone: '+56987654321',
      isActive: true,
    }
  })

  console.log('✅ Usuario jefe de terreno creado:', siteManagerUser.email)

  // Crear usuario de control de calidad para pruebas
  const qualityPassword = await bcrypt.hash('calidad123', 10)
  
  const qualityUser = await prisma.user.upsert({
    where: { email: 'calidad@constructorpro.com' },
    update: {},
    create: {
      name: 'María González',
      email: 'calidad@constructorpro.com',
      password: qualityPassword,
      role: 'QUALITY_CONTROL',
      company: 'ConstructorPro',
      phone: '+56955555555',
      isActive: true,
    }
  })

  console.log('✅ Usuario control de calidad creado:', qualityUser.email)

  // Crear proyecto de ejemplo
  const exampleProject = await prisma.project.upsert({
    where: { id: 'proj-example-1' },
    update: {},
    create: {
      id: 'proj-example-1',
      name: 'Edificio Las Condes',
      description: 'Edificio residencial de 20 pisos en Las Condes',
      projectType: 'residential',
      status: 'ACTIVE',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-15'),
    }
  })

  console.log('✅ Proyecto de ejemplo creado:', exampleProject.name)

  // Asignar usuarios al proyecto
  try {
    await prisma.projectAssignment.create({
      data: {
        userId: siteManagerUser.id,
        projectId: exampleProject.id,
        role: 'Jefe de Terreno',
      }
    })
  } catch (error) {
    // Usuario ya asignado
  }

  try {
    await prisma.projectAssignment.create({
      data: {
        userId: qualityUser.id,
        projectId: exampleProject.id,
        role: 'Inspector de Calidad',
      }
    })
  } catch (error) {
    // Usuario ya asignado
  }

  console.log('✅ Usuarios asignados al proyecto')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\nCredenciales de prueba:')
  console.log('👤 Admin: admin@constructorpro.com / admin123')
  console.log('👤 Jefe Terreno: terreno@constructorpro.com / terreno123')
  console.log('👤 Control Calidad: calidad@constructorpro.com / calidad123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })