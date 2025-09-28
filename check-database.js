// Quick database check script
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('🔍 CHECKING DATABASE CONTENT...\n')
  
  try {
    // Check users
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    })
    console.log('👤 USERS:', users.length)
    users.forEach(user => console.log(`  - ${user.name} (${user.role}) - ${user.email}`))
    
    // Check projects
    const projects = await prisma.project.findMany({
      select: { id: true, name: true, status: true }
    })
    console.log('\n🏗️ PROJECTS:', projects.length)
    projects.forEach(proj => console.log(`  - ${proj.name} (${proj.status})`))
    
    // Check project assignments
    const assignments = await prisma.projectAssignment.findMany({
      include: { user: { select: { name: true }}, project: { select: { name: true }}}
    })
    console.log('\n🔗 PROJECT ASSIGNMENTS:', assignments.length)
    assignments.forEach(assign => console.log(`  - ${assign.user.name} → ${assign.project.name}`))
    
    // Check teams
    const teams = await prisma.team.findMany({
      include: { 
        project: { select: { name: true }},
        supervisor: { select: { name: true }},
        members: true
      }
    })
    console.log('\n👥 TEAMS:', teams.length)
    teams.forEach(team => console.log(`  - ${team.name} (${team.type}) in ${team.project.name} - ${team.members.length} members`))
    
    // Check productivity data
    const productivity = await prisma.dailyProductivity.findMany({
      include: { team: { select: { name: true }}}
    })
    console.log('\n📈 PRODUCTIVITY RECORDS:', productivity.length)
    if (productivity.length > 0) {
      console.log(`  - Latest: ${productivity[productivity.length-1].team.name} - ${productivity[productivity.length-1].date.toDateString()}`)
      console.log(`  - Productivity: ${productivity[productivity.length-1].productivityScore}%, Quality: ${productivity[productivity.length-1].qualityScore}%`)
    }
    
    // Summary for dashboard
    console.log('\n📊 DASHBOARD DATA SUMMARY:')
    console.log(`  - Users who can login: ${users.length}`)
    console.log(`  - Projects with data: ${projects.length}`)
    console.log(`  - Teams for KPI calculation: ${teams.length}`)
    console.log(`  - Productivity records for trends: ${productivity.length}`)
    
    // Diagnosis
    console.log('\n🔧 DIAGNOSIS:')
    if (users.length === 0) {
      console.log('  ❌ NO USERS - You need to sign up/login first')
    } else if (projects.length === 0) {
      console.log('  ❌ NO PROJECTS - Run: npm run seed')
    } else if (assignments.length === 0) {
      console.log('  ❌ NO PROJECT ASSIGNMENTS - Users not assigned to projects')
    } else if (teams.length === 0) {
      console.log('  ❌ NO TEAMS - No team data for dashboard KPIs')
    } else if (productivity.length === 0) {
      console.log('  ❌ NO PRODUCTIVITY DATA - Teams exist but no metrics')
    } else {
      console.log('  ✅ DATABASE READY - Dashboard should show KPIs!')
    }
    
  } catch (error) {
    console.error('❌ DATABASE ERROR:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
