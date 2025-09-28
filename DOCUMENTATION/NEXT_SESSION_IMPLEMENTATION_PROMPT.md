# 🚀 TASK MANAGEMENT MVP IMPLEMENTATION PROMPT
**For Next Claude Conversation - Copy/Paste This Entire Context**

---

## **PROJECT CONTEXT**

You are a senior software engineer implementing task management functionality for a construction management PWA. The application is currently deployed on Vercel with a PostgreSQL database and has executive KPI dashboards working, but task management features show "backend implementation pending" placeholder messages.

**Current Tech Stack:**
- Next.js 15+ with App Router, TypeScript, React 19
- Prisma ORM with PostgreSQL (Vercel Postgres)
- NextAuth.js authentication with role-based access
- Tailwind CSS, Vercel deployment
- PWA with offline capabilities

**Project Structure:**
```
/src/
├── app/
│   ├── api/ (API routes)
│   ├── dashboard/ (working executive KPIs)
│   ├── tasks/ (shows placeholder messages)
│   └── team/ (shows placeholder messages)
├── components/ (atomic design system)
├── lib/
│   ├── api/ (existing teams API)
│   └── prisma.ts
└── prisma/
    ├── schema.prisma (existing schema)
    └── seed.ts
```

**Current Working Features:**
- Executive dashboard with real-time KPIs (Productividad Organizacional: 61%, etc.)
- User authentication with roles (gerencia, jefe_terreno, bodega, control_calidad)
- Project management (3 projects: Edificio Las Condes, Torre Empresarial)
- Team productivity tracking (4 teams with 63 productivity records)
- Database seeded with realistic construction data

**Current Problem:**
- Task creation UI exists but shows "Funcionalidad de crear tarea será implementada con backend"
- Task completion buttons show "Funcionalidad de editar tarea será implementada con backend"
- Team member addition shows "Funcionalidad de agregar miembro en desarrollo..."
- All task management features are UI mockups without backend functionality

## **IMPLEMENTATION GOAL**

**MVP Objective:** Create functional task management that integrates with existing KPI dashboard.

**Core User Flow:**
1. User clicks "Crear Nueva Tarea" → Opens working form (not placeholder)
2. User creates task with: Title, Assignee (real users), Project, Due Date
3. Task appears in "/tasks" page with real data
4. Assigned user can mark task "Completada"
5. Dashboard KPIs update to include task completion metrics

**Success Criteria:**
- Create 5 real tasks assigned to different users
- Complete 3 tasks successfully
- Task completion rate shows in dashboard KPIs
- No more placeholder messages

## **TECHNICAL REQUIREMENTS**

### **Database Schema (Add to Existing)**
```sql
-- Add this table to existing Prisma schema
model Task {
  id        String   @id @default(cuid())
  title     String
  assigneeId String
  assignee  User     @relation(fields: [assigneeId], references: [id])
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  status    TaskStatus @default(PENDING)
  dueDate   DateTime?
  createdAt DateTime @default(now())
  completedAt DateTime?
  
  @@map("tasks")
}

enum TaskStatus {
  PENDING
  COMPLETED
}

-- Update existing models to add relations:
// Add to User model: tasks Task[]
// Add to Project model: tasks Task[]
```

### **API Endpoints to Create**
```typescript
// POST /api/tasks - Create task
interface CreateTaskRequest {
  title: string
  assigneeId: string
  projectId: string
  dueDate?: string
}

// GET /api/tasks - Get tasks with filters
interface GetTasksRequest {
  projectId?: string
  assigneeId?: string
  status?: 'PENDING' | 'COMPLETED'
}

// PUT /api/tasks/[id]/complete - Mark task complete
interface CompleteTaskRequest {
  completedAt: string
}
```

### **Frontend Integration Points**
```typescript
// Files to modify:
// 1. /src/app/tasks/page.tsx - Remove placeholder, connect to real API
// 2. /src/components/organisms/TaskRegistrationForm.tsx - Connect form submission
// 3. /src/app/dashboard/page.tsx - Add task metrics to KPI calculations

// KPI Integration:
const taskMetrics = {
  totalTasks: tasks.length,
  completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
  taskCompletionRate: (completedTasks / totalTasks) * 100
}

// Add to existing dashboard KPI calculations
```

## **EXISTING DATABASE DATA**

**Current Users (for task assignment):**
- Admin: Administrador ConstructorPro (gerencia role)
- Site Manager: Juan Pérez (jefe_terreno role)  
- Quality Control: Carlos Morales (control_calidad role)

**Current Projects (for task association):**
- Edificio Las Condes
- Torre Empresarial
- Complejo Residencial Norte

**Current Teams:**
- Estructuras team (active, 82% productivity)
- Instalaciones team 
- Terminaciones team
- Cuadrilla Terminaciones C (81% productivity)

## **IMPLEMENTATION ORDER**

**Phase 1: Backend Foundation (Days 1-2)**
1. Update Prisma schema with Task model
2. Create database migration
3. Build POST /api/tasks endpoint
4. Build GET /api/tasks endpoint
5. Build PUT /api/tasks/[id]/complete endpoint

**Phase 2: Frontend Integration (Days 3-4)**
1. Connect task creation form to POST API
2. Connect task list page to GET API
3. Connect "Completar" buttons to complete API
4. Remove all placeholder messages

**Phase 3: Dashboard Integration (Days 5-6)**
1. Add task metrics to KPI calculations
2. Update dashboard to show task completion rates
3. Integrate task data with existing productivity metrics

**Phase 4: Testing & Polish (Day 7)**
1. Test complete user workflow
2. Verify KPI dashboard updates
3. Test task assignment and completion
4. Ensure mobile responsiveness

## **CURRENT FILE LOCATIONS**

**Key files that exist and need modification:**
- `/src/app/tasks/page.tsx` - Task list page (currently shows placeholders)
- `/src/components/organisms/TaskRegistrationForm.tsx` - Task creation form
- `/src/app/dashboard/page.tsx` - Executive dashboard with KPIs
- `/src/lib/api/teams.ts` - Existing API structure (follow this pattern)
- `/prisma/schema.prisma` - Database schema
- `/prisma/seed.ts` - Database seeding

**Database connection string:** Already configured in production (Vercel Postgres)

## **YOUR IMMEDIATE TASK**

Start with Phase 1: Create the database schema update and build the first API endpoint (POST /api/tasks) to enable task creation. 

Ask for confirmation of the Prisma schema changes before implementing, then proceed with building the task creation API endpoint that will replace the "backend implementation pending" placeholder message.

**Context Files Available:**
- Review existing API patterns in `/src/lib/api/teams.ts`
- Follow existing database patterns in `/prisma/schema.prisma`
- Maintain consistency with existing dashboard KPI calculations

**Expected Outcome:** By end of session, users can create real tasks that persist in database and show up in the task list.

---

**Note:** This is a continuation of a construction management PWA project with executive dashboards already working. The task management feature is the missing piece for complete Monday.com feature parity while maintaining construction industry focus.
