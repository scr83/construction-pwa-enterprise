import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@constructorpro.com' },
    update: {},
    create: {
      email: 'admin@constructorpro.com',
      name: 'Admin Prueba',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })
  
  console.log('✅ Admin user created')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
