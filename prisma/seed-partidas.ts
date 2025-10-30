import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  console.log('🚀 Starting partidas seed...')

  let created = 0
  let skipped = 0

  for (const partida of partidas) {
    try {
      await prisma.partida.create({
        data: {
          id: `partida-${partida.sequence}`,
          ...partida,
        },
      })
      created++
      console.log(`✅ Created: ${partida.name}`)
    } catch (error: any) {
      if (error.code === 'P2002') {
        skipped++
        console.log(`⏭️  Skipped (exists): ${partida.name}`)
      } else {
        console.error(`❌ Error creating ${partida.name}:`, error.message)
        throw error
      }
    }
  }

  console.log('\n📊 Seed Summary:')
  console.log(`   Created: ${created} partidas`)
  console.log(`   Skipped: ${skipped} partidas`)
  console.log(`   Total: ${partidas.length} partidas`)
  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
