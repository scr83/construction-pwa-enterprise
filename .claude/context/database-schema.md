# DATABASE SCHEMA - READ ONLY

**Last Updated:** October 2, 2025  
**Schema Location:** `prisma/schema.prisma`  
**Database:** PostgreSQL

---

## 🚨 CRITICAL RULES

**NEVER modify `prisma/schema.prisma` without explicit human approval!**

❌ **DO NOT:**
- Add new models
- Add/remove fields from existing models
- Change field types
- Modify relationships
- Change table names
- Alter indexes

✅ **DO:**
- Use existing models in your code
- Query with Prisma Client
- Follow established relationships
- Reference this doc for structure

**If task requires schema changes → STOP and ask human first!**

---

## 📊 PROJECT HIERARCHY

The core structure of construction projects:

```
Project (Master project)
└── Building (Building A, Phase 1, Tower North)
    └── Floor (Floor 1, Section A, Wing East)
        └── Unit (Unit 101, EA-1, Suite A, Office 201)
            └── WorkRecord (tracks work on specific activity)
```

**Key Insight:** This hierarchy is flexible to support:
- Residential: Project → Building → Floor → Unit (apartment/house)
- Commercial: Project → Building → Floor → Unit (office/retail)
- Industrial: Project → Building → Section → Unit (warehouse bay)

---

## 🗂️ CORE MODELS

### **Project**
```prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  projectType String   // 'residential', 'commercial', 'industrial', 'infrastructure'
  status      String   @default("PLANNING") // 'PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'
  startDate   DateTime
  endDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  buildings              Building[]
  projectAssignments     ProjectAssignment[]
  constructionActivities ConstructionActivity[]
  teams                  Team[]
  tasks                  Task[]
}
```

**Usage:** Top-level project container  
**Status values:** PLANNING, ACTIVE, COMPLETED, CANCELLED  
**Project types:** residential, commercial, industrial, infrastructure

---

### **Building**
```prisma
model Building {
  id        String   @id @default(cuid())
  projectId String
  name      String   // 'Building A', 'Phase 1', 'Tower North'
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  floors  Floor[]
}
```

**Usage:** Groups floors within a project  
**Naming:** Flexible - "Building A", "Phase 1", "Torre Norte"

---

### **Floor**
```prisma
model Floor {
  id         String   @id @default(cuid())
  buildingId String
  name       String   // 'Floor 1', 'Section A', 'Wing East', 'PB' (planta baja)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  building Building @relation(fields: [buildingId], references: [id], onDelete: Cascade)
  units    Unit[]
}
```

**Usage:** Groups units within a building  
**Naming:** Flexible - "Piso 1", "PB", "Section A"

---

### **Unit**
```prisma
model Unit {
  id        String   @id @default(cuid())
  floorId   String
  name      String   // 'Unit 101', 'EA-1', 'Suite A', 'Bodega 5'
  unitType  String?  // 'apartment', 'house', 'office', 'retail', 'warehouse'
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  floor       Floor        @relation(fields: [floorId], references: [id], onDelete: Cascade)
  workRecords WorkRecord[]
}
```

**Usage:** Individual trackable unit (apartment, house, office, etc.)  
**Naming:** Completely flexible - "EA-1", "Depto 101", "Oficina A"  
**Unit types:** apartment, house, office, retail, warehouse

---

### **ConstructionActivity (Partida)**
```prisma
model ConstructionActivity {
  id          String   @id @default(cuid())
  projectId   String
  name        String   // Spanish partida name
  description String?
  sequence    Int      // Order in construction process
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project     Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  workRecords WorkRecord[]
}
```

**Usage:** Construction activities/tasks (partidas)  
**Examples:** "Trazado y niveles", "Hormigón radier", "Revestimiento exterior"  
**Sequence:** Determines construction order (1, 2, 3, ...)

---

### **WorkRecord**
```prisma
model WorkRecord {
  id                     String   @id @default(cuid())
  unitId                 String
  constructionActivityId String
  userId                 String   // Worker who recorded
  status                 String   @default("ASSIGNED")
  executionDate          DateTime?
  quantity               Decimal?
  notes                  String?
  latitude               Decimal? // GPS
  longitude              Decimal? // GPS
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
  
  unit                   Unit                 @relation(fields: [unitId], references: [id], onDelete: Cascade)
  constructionActivity   ConstructionActivity @relation(fields: [constructionActivityId], references: [id], onDelete: Cascade)
  user                   User                 @relation(fields: [userId], references: [id])
  materialRecords        MaterialRecord[]
  qualityRecords         QualityRecord[]
  paymentRecords         PaymentRecord[]
  photos                 Photo[]
}
```

**Usage:** Tracks work completion on specific activity in specific unit  
**Status values:** ASSIGNED, MATERIALS_PLANNED, MATERIALS_PURCHASED, MATERIALS_AVAILABLE, MATERIALS_DELIVERED, EXECUTED, QUALITY_SUBMITTED, QUALITY_RECEIVED, QUALITY_APPROVED, COMPLETED, PAID  
**GPS:** latitude/longitude capture location of work

---

### **MaterialRecord**
```prisma
model MaterialRecord {
  id           String   @id @default(cuid())
  workRecordId String
  materialName String
  quantity     Decimal
  unit         String   // 'm2', 'm3', 'kg', 'units'
  status       String   @default("PLANNED")
  cost         Decimal?
  supplier     String?
  deliveryDate DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  workRecord WorkRecord @relation(fields: [workRecordId], references: [id], onDelete: Cascade)
}
```

**Usage:** Material tracking for bodega (warehouse) workflows  
**Status values:** PLANNED, REQUESTED, PURCHASED, IN_WAREHOUSE, DELIVERED, INSTALLED  
**Units:** m2, m3, kg, units, etc.

---

### **QualityRecord**
```prisma
model QualityRecord {
  id             String   @id @default(cuid())
  workRecordId   String
  userId         String   // Quality inspector
  status         String   @default("PENDING")
  inspectionDate DateTime?
  notes          String?
  checklist      String?  // JSON string
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  workRecord WorkRecord @relation(fields: [workRecordId], references: [id], onDelete: Cascade)
  user       User       @relation(fields: [userId], references: [id])
  photos     Photo[]
}
```

**Usage:** Quality control inspections  
**Status values:** PENDING, IN_PROGRESS, APPROVED, REJECTED, CORRECTIVE_ACTION_REQUIRED  
**Checklist:** Flexible JSON structure for inspection items

---

### **PaymentRecord**
```prisma
model PaymentRecord {
  id           String   @id @default(cuid())
  workRecordId String
  userId       String   // Who authorized
  amount       Decimal
  paymentDate  DateTime?
  status       String   @default("PENDING")
  notes        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  workRecord WorkRecord @relation(fields: [workRecordId], references: [id], onDelete: Cascade)
  user       User       @relation(fields: [userId], references: [id])
}
```

**Usage:** Payment tracking (tratos)  
**Status values:** PENDING, APPROVED, PAID, CANCELLED

---

### **Photo**
```prisma
model Photo {
  id              String   @id @default(cuid())
  workRecordId    String?
  qualityRecordId String?
  filename        String
  url             String
  description     String?
  latitude        Decimal? // GPS
  longitude       Decimal? // GPS
  createdAt       DateTime @default(now())
  
  workRecord    WorkRecord?    @relation(fields: [workRecordId], references: [id], onDelete: Cascade)
  qualityRecord QualityRecord? @relation(fields: [qualityRecordId], references: [id], onDelete: Cascade)
}
```

**Usage:** Photo documentation with GPS metadata  
**Can attach to:** WorkRecord or QualityRecord

---

## 👥 CHILEAN CONSTRUCTION TEAM MODELS

### **Team**
```prisma
model Team {
  id                 String   @id @default(cuid())
  name               String
  type               String   // 'estructuras', 'instalaciones', 'terminaciones', 'calidad'
  projectId          String
  supervisorId       String
  status             String   @default("active") // 'active', 'inactive', 'on_break'
  specialties        String[] // Array of specialties
  productivityTarget Decimal  @default(100.00)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  project      Project             @relation(fields: [projectId], references: [id])
  supervisor   User                @relation("TeamSupervisor", fields: [supervisorId], references: [id])
  members      TeamMember[]
  productivity DailyProductivity[]
  metrics      TeamMetrics[]
}
```

**Usage:** Chilean construction teams  
**Team types:** estructuras, instalaciones, terminaciones, calidad  
**Status:** active, inactive, on_break

---

### **TeamMember**
```prisma
model TeamMember {
  id                String   @id @default(cuid())
  teamId            String
  userId            String
  role              String   // Chilean construction roles (see below)
  hourlyRate        Decimal?
  joinedDate        DateTime @default(now())
  status            String   @default("active")
  performanceRating Decimal  @default(0.00)
  
  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user User @relation("TeamMemberUser", fields: [userId], references: [id])
  
  @@unique([teamId, userId])
}
```

**Usage:** Team member assignment with Chilean roles  
**Roles:** maestro_mayor, maestro_albañil, oficial_primera, ayudante, jornal  
**Status:** active, inactive

**Chilean Construction Role Hierarchy:**
1. **maestro_mayor** - Master foreman (highest skilled)
2. **maestro_albañil** - Master mason
3. **oficial_primera** - First officer (skilled worker)
4. **ayudante** - Helper/assistant
5. **jornal** - Day laborer (entry level)

---

### **DailyProductivity**
```prisma
model DailyProductivity {
  id                String   @id @default(cuid())
  teamId            String
  date              DateTime
  hoursWorked       Decimal
  tasksCompleted    Int      @default(0)
  unitsCompleted    Int      @default(0)
  productivityScore Decimal?
  qualityScore      Decimal?
  safetyIncidents   Int      @default(0)
  notes             String?
  recordedBy        String
  createdAt         DateTime @default(now())
  
  team     Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
  recorder User @relation("ProductivityRecorder", fields: [recordedBy], references: [id])
  
  @@unique([teamId, date])
}
```

**Usage:** Daily team productivity tracking

---

## 📋 TASK MANAGEMENT

### **Task**
```prisma
model Task {
  id             String       @id @default(cuid())
  title          String
  description    String?
  assigneeId     String
  createdById    String
  projectId      String
  status         TaskStatus   @default(PENDING)
  priority       TaskPriority @default(MEDIUM)
  category       TaskCategory @default(GENERAL)
  dueDate        DateTime?
  startDate      DateTime?
  completedAt    DateTime?
  estimatedHours Int?
  actualHours    Int?
  building       String?
  unit           String?
  partida        String?      // Construction activity name
  materials      String[]     // Required materials
  prerequisites  String[]
  notes          String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  
  assignee  User    @relation("TaskAssignee", fields: [assigneeId], references: [id])
  createdBy User    @relation("TaskCreatedBy", fields: [createdById], references: [id])
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
  DELAYED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskCategory {
  GENERAL
  STRUCTURE       // estructura
  MATERIALS       // materiales
  QUALITY         // calidad
  INSTALLATIONS   // instalaciones
  FINISHES        // acabados
  TECHNICAL_OFFICE // oficina_tecnica
}
```

**Usage:** Task management system  
**Categories:** Aligned with Chilean construction phases  
**Status:** PENDING, IN_PROGRESS, COMPLETED, CANCELLED, DELAYED  
**Priority:** LOW, MEDIUM, HIGH, URGENT

---

## 🔐 AUTHENTICATION MODELS

### **User**
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // For credentials auth
  role          String    @default("SITE_MANAGER")
  company       String?
  phone         String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations (many)
  accounts               Account[]
  sessions               Session[]
  projectAssignments     ProjectAssignment[]
  workRecords            WorkRecord[]
  qualityRecords         QualityRecord[]
  paymentRecords         PaymentRecord[]
  supervisedTeams        Team[]
  teamMemberships        TeamMember[]
  productivityRecords    DailyProductivity[]
  assignedTasks          Task[]
  createdTasks           Task[]
}
```

**Usage:** User accounts and authentication  
**Roles:** EXECUTIVE, SITE_MANAGER, WAREHOUSE, TECHNICAL_OFFICE, QUALITY_CONTROL, ADMIN  
**DO NOT modify auth models without approval!**

### **Account, Session, VerificationToken**
NextAuth.js authentication models - **DO NOT modify!**

---

## 📊 QUERY PATTERNS

### **Get Project Hierarchy**
```typescript
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    buildings: {
      include: {
        floors: {
          include: {
            units: true
          }
        }
      }
    }
  }
});
```

### **Get Work Records with Relations**
```typescript
const workRecords = await prisma.workRecord.findMany({
  where: { unitId },
  include: {
    constructionActivity: true,
    user: true,
    materialRecords: true,
    qualityRecords: true,
    paymentRecords: true,
    photos: true
  }
});
```

### **Get Team with Members**
```typescript
const team = await prisma.team.findUnique({
  where: { id: teamId },
  include: {
    supervisor: true,
    members: {
      include: {
        user: true
      }
    },
    productivity: true
  }
});
```

---

## ✅ SAFE TO DO

- Query existing models
- Create/update/delete records
- Use Prisma Client methods
- Follow existing relationships
- Reference enums (TaskStatus, TaskPriority, TaskCategory)

## ⚠️ ESCALATE TO HUMAN

- Need new model
- Need new field on existing model
- Need to change field type
- Need to modify relationships
- Need to add indexes
- Anything that modifies `schema.prisma`

---

## 🚨 REMEMBER

**If your task requires schema changes:**
1. STOP
2. Document what's needed and why
3. Ask human for approval
4. Wait for decision before proceeding

**This protects data integrity and prevents breaking changes!**
