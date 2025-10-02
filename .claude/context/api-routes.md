# API ROUTES - EXISTING ENDPOINTS

**Last Updated:** October 2, 2025  
**Base Path:** `src/app/api/`  
**Framework:** Next.js 14 App Router

---

## 🚨 CRITICAL RULES

**BEFORE creating new API route:**
1. Check if similar endpoint exists below
2. Consider if existing endpoint can be extended
3. Only create new if truly unique functionality needed

**NEVER:**
- ❌ Break existing API contracts (response structure, parameters)
- ❌ Modify authentication without approval
- ❌ Change database schema (see database-schema.md)

**ALWAYS:**
- ✅ Follow existing patterns
- ✅ Use proper error handling
- ✅ Validate input with Zod
- ✅ Check authentication/authorization
- ✅ Return consistent response structure

---

## 🔐 AUTHENTICATION ROUTES

### **`/api/auth/[...nextauth]/route.ts`**
**NextAuth.js handler - DO NOT MODIFY**

- Handles: login, logout, session management
- Provider: credentials (email/password)
- Protected by NextAuth.js

### **`/api/auth/register/route.ts`**
**User registration**

**POST** - Register new user
- Body: `{ name, email, password, company?, phone? }`
- Validates: email unique, password strength
- Returns: `{ id, name, email, role }`
- **DO NOT modify without approval**

---

## 📁 PROJECT ROUTES

### **`/api/projects/route.ts`**

**GET** - List all projects (with optional filters)
- Query params: `status`, `type`, `search`
- Returns: `{ projects: Project[] }`
- Includes: project name, type, status, dates

**POST** - Create new project
- Body: `{ name, description?, projectType, startDate, endDate? }`
- Returns: `{ project: Project }`
- Auth required: Yes

---

## ✅ TASK ROUTES

### **`/api/tasks/route.ts`**

**GET** - List tasks (with filters)
- Query params: `projectId`, `assigneeId`, `status`, `priority`, `category`
- Returns: `{ tasks: Task[], total: number }`
- Includes: task details, assignee info

**POST** - Create new task
- Body: `{ title, description?, assigneeId, projectId, status?, priority?, category?, dueDate?, building?, unit?, partida?, materials?, prerequisites?, notes? }`
- Returns: `{ task: Task }`
- Auth required: Yes

### **`/api/tasks/[id]/route.ts`**

**GET** - Get task by ID
- Returns: `{ task: Task }` with full details

**PATCH** - Update task
- Body: Partial task fields
- Returns: `{ task: Task }`
- Auth required: Yes (only assignee or creator)

**DELETE** - Delete task
- Returns: `{ success: true }`
- Auth required: Yes (only creator or admin)

### **`/api/tasks/[id]/start/route.ts`**

**POST** - Start task (set status to IN_PROGRESS)
- Body: None
- Returns: `{ task: Task }`
- Sets: `startDate = now()`, `status = IN_PROGRESS`
- Auth required: Yes (only assignee)

### **`/api/tasks/[id]/complete/route.ts`**

**POST** - Complete task
- Body: `{ actualHours?: number }`
- Returns: `{ task: Task }`
- Sets: `completedAt = now()`, `status = COMPLETED`
- Auth required: Yes (only assignee)

### **`/api/tasks/metrics/route.ts`**

**GET** - Task metrics and statistics
- Query params: `projectId?`, `teamId?`, `period?`
- Returns: `{ total, completed, inProgress, pending, delayed, avgCompletionTime, productivityScore }`
- Used for: Dashboard KPIs

---

## 👥 TEAM ROUTES

### **`/api/teams/route.ts`**

**GET** - List teams
- Query params: `projectId?`, `type?`, `status?`
- Returns: `{ teams: Team[] }`
- Includes: supervisor info, member count

**POST** - Create new team
- Body: `{ name, type, projectId, supervisorId, specialties?, productivityTarget? }`
- Returns: `{ team: Team }`
- Auth required: Yes

### **`/api/teams/[id]/route.ts`**

**GET** - Get team by ID
- Returns: `{ team: Team }` with members, supervisor, productivity

**PATCH** - Update team
- Body: Partial team fields
- Returns: `{ team: Team }`
- Auth required: Yes (only supervisor or admin)

**DELETE** - Delete team
- Returns: `{ success: true }`
- Auth required: Yes (admin only)

### **`/api/teams/[id]/members/route.ts`**

**GET** - Get team members
- Returns: `{ members: TeamMember[] }`

**POST** - Add member to team
- Body: `{ userId, role, hourlyRate? }`
- Returns: `{ member: TeamMember }`
- Auth required: Yes (supervisor or admin)

**DELETE** - Remove member from team
- Body: `{ userId }`
- Returns: `{ success: true }`
- Auth required: Yes (supervisor or admin)

### **`/api/teams/[id]/productivity/route.ts`**

**GET** - Get team productivity history
- Query params: `startDate?`, `endDate?`
- Returns: `{ productivity: DailyProductivity[] }`

**POST** - Record daily productivity
- Body: `{ date, hoursWorked, tasksCompleted?, unitsCompleted?, productivityScore?, qualityScore?, safetyIncidents?, notes? }`
- Returns: `{ productivity: DailyProductivity }`
- Auth required: Yes (supervisor)

---

## 👤 USER ROUTES

### **`/api/users/route.ts`**

**GET** - List users
- Query params: `role?`, `isActive?`, `search?`
- Returns: `{ users: User[] }`
- Excludes: password hash
- Auth required: Yes (admin only)

---

## 📊 PRODUCTIVITY ROUTES

### **`/api/productivity/dashboard/route.ts`**

**GET** - Productivity dashboard metrics
- Query params: `projectId?`, `teamId?`, `period?` (week/month/quarter)
- Returns: `{ metrics: { avgProductivity, avgQuality, attendanceRate, safetyScore, trends } }`
- Used for: Executive dashboard, team performance

---

## 🔄 RESPONSE PATTERNS

### **Success Response**
```typescript
{
  success: true,
  data: { ... }, // Resource(s)
  message?: string
}
```

### **Error Response**
```typescript
{
  success: false,
  error: {
    message: string,
    code?: string,
    details?: any
  }
}
```

### **List Response (with pagination)**
```typescript
{
  success: true,
  data: [...],
  pagination: {
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
```

---

## 🔒 AUTHENTICATION PATTERNS

### **Checking Auth**
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Proceed with authenticated request
}
```

### **Role-Based Access**
```typescript
const session = await getServerSession(authOptions);

if (session.user.role !== 'ADMIN') {
  return NextResponse.json(
    { error: 'Forbidden' },
    { status: 403 }
  );
}
```

---

## ✅ WHEN BUILDING NEW ROUTES

**Follow these patterns:**

### **1. File Location**
```
src/app/api/resource/
  ├── route.ts           // GET (list), POST (create)
  └── [id]/
      ├── route.ts       // GET (single), PATCH (update), DELETE
      └── action/
          └── route.ts   // POST (specific action)
```

### **2. Route Structure Template**
```typescript
// src/app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema
const CreateSchema = z.object({
  field1: z.string(),
  field2: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // 1. Check auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get query params
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');

    // 3. Query database
    const items = await prisma.model.findMany({
      where: { /* filters */ },
    });

    // 4. Return response
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse and validate body
    const body = await request.json();
    const validated = CreateSchema.parse(body);

    // 3. Create resource
    const item = await prisma.model.create({
      data: validated,
    });

    // 4. Return response
    return NextResponse.json(
      { success: true, data: item },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 🚫 GAPS & MISSING ROUTES

**Routes that DON'T exist yet (may need to be built):**

- `/api/projects/[id]` - Get/update/delete single project
- `/api/projects/[id]/buildings` - Building CRUD
- `/api/buildings/[id]/floors` - Floor CRUD
- `/api/floors/[id]/units` - Unit CRUD
- `/api/units/[id]/work-records` - WorkRecord CRUD
- `/api/work-records/[id]` - Update work record
- `/api/work-records/[id]/materials` - Material tracking
- `/api/work-records/[id]/quality` - Quality inspection
- `/api/work-records/[id]/payment` - Payment processing
- `/api/work-records/[id]/photos` - Photo upload
- `/api/construction-activities` - Partidas CRUD
- `/api/materials` - Material management
- `/api/quality` - Quality control dashboard
- `/api/payments` - Payment tracking

**When building these:**
- Follow patterns above
- Check if database model exists (see database-schema.md)
- Use existing validation patterns
- Implement proper RBAC

---

## 📝 BEFORE CREATING NEW ROUTE

**Ask yourself:**

1. **Does similar route exist?** → Check list above
2. **Can I extend existing route?** → Add query params/optional fields
3. **Does data model exist?** → Check database-schema.md
4. **What auth is needed?** → Follow patterns above
5. **What's the response structure?** → Follow patterns above

**If unsure:** Ask in comments "Should I create this route or extend an existing one?"

---

## 🔧 COMMON HELPERS

**Auth Check Helper** (`src/lib/auth.ts`)
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error('Forbidden');
  }
  return session;
}
```

**Prisma Client** (`src/lib/prisma.ts`)
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 🚨 REMEMBER

**API routes are contracts:**
- Don't break existing response structures
- Don't remove required fields
- Don't change field types
- Maintain backward compatibility

**If breaking changes needed:**
- Version the API (`/api/v2/...`)
- Deprecate old version gradually
- Get human approval first

**Use existing routes whenever possible - only create new when truly needed!**
