# Outstanding Issues - Project Progress & User Management - October 2, 2025

## Critical Issues Discovered During Testing

### ISSUE 1: Inconsistent Progress Calculation Logic

**Problem:**
Progress percentages are inconsistent across different parts of the application:
- **Projects page:** Shows all new projects at 0%
- **Dashboard:** Shows different percentages for the same projects
- **Dashboard cards (top KPIs):** Appear to pull correct information
- **"Proyectos Activos" card:** Seems hardcoded to fixed values (75%, 45%)

**Questions to investigate:**
1. Where is project progress being calculated?
2. How is progress supposed to be measured? (Tasks completed? Budget spent? Timeline?)
3. Where does the dashboard pull progress data from?
4. Are there multiple progress fields? (fisico, financiero, cronograma - all set to 0 in API)
5. Why do different UI components show different percentages for the same project?

**Root cause hypothesis:**
- Multiple sources of truth for progress calculation
- Dashboard may be using cached/stale data
- "Proyectos Activos" section may have hardcoded mock data
- Unclear business logic for what "progress" actually means

**Files likely involved:**
- `src/app/api/projects/route.ts` (API progress calculation)
- `src/app/dashboard/page.tsx` (Dashboard data fetching)
- `src/app/proyectos/page.tsx` (Projects list display)
- Progress calculation utilities (if they exist)

---

### ISSUE 2: Missing User Management System

**Problem:**
There's no way to create standalone users in the system.

**Current state:**
- ✅ Can create teams (`Crear Equipo` button exists in `/equipo`)
- ✅ Can create projects (`Nuevo Proyecto` button exists in `/proyectos`)
- ❌ Cannot create individual users

**Impact:**
- Project form "Equipo de Trabajo" section expects to pull from active users in project
- Task assignment form shows user dropdown, but unclear where those users come from
- Team creation likely requires pre-existing users

**Required feature:**
Add "Crear Usuario" button in `/equipo` page next to existing "Crear Equipo" button.

**Questions to investigate:**
1. Where does the user list come from in task assignment dropdown?
2. How are users currently added to the system? (Only through authentication?)
3. What user roles exist? (Admin, Jefe de Proyecto, Jefe de Terreno, etc.)
4. Should users be organization-wide or project-specific?
5. What's the relationship between Users, Teams, and Projects?

**Files likely involved:**
- `src/app/equipo/page.tsx` (Teams management page)
- `src/app/api/users/route.ts` (if exists - user API)
- User creation form component (needs to be created)
- Database schema - User model relationships

---

### ISSUE 3: Task Assignment User Dropdown Source

**Problem:**
Task creation form (`/tareas` → "Nueva Tarea") has user dropdown for assignment, but source is unclear.

**Questions:**
1. Where does this dropdown pull users from?
2. Are these users from:
   - All system users?
   - Users assigned to the selected project?
   - Users in active teams?
   - Hardcoded test data?

**Current behavior:**
Task form shows users like:
- Admin Usuario (ADMIN)
- Carlos Morales (QUALITY_CONTROL)
- Juan Pérez (EXECUTIVE)
- María González (SITE_MANAGER)

**Investigation needed:**
- Check `src/app/tareas/page.tsx` or task creation form component
- Check API endpoint that populates user dropdown
- Verify if user list is filtered by project or shows all users

---

### ISSUE 4: Project Dropdown in Task Form Shows Wrong Data

**Problem:**
Task creation form has "Proyecto" dropdown that doesn't display current/active projects correctly.

**Expected behavior:**
- Should show only active projects (estado: 'planificacion', 'ejecucion', etc.)
- Should exclude completed/archived projects
- Should match projects visible on `/proyectos` page

**Current behavior:**
- Dropdown shows incorrect project list
- May show: "Seleccionar proyecto..." with limited/wrong options
- Doesn't reflect newly created projects

**Questions:**
1. What API endpoint populates the project dropdown?
2. What filter/query is being used?
3. Is there caching causing stale data?
4. Does it need to refresh after new project creation?

**Files to check:**
- Task creation form component
- `src/app/api/projects/route.ts` (GET endpoint with filters)
- Project selector component (if reusable)

---

### ISSUE 5: Form Template Inconsistency

**Observation:**
The task creation form (`/tareas` → "Nueva Tarea") works flawlessly with excellent UX.

**Recommendation:**
The project creation form should use the **exact same form template/logic** as the task form.

**What works well in task form:**
- Clean modal overlay presentation
- Proper dropdown rendering (users, projects, priority)
- Spanish construction terminology
- Mobile-responsive
- Good validation states

**Action needed:**
- Identify the form component used in task creation
- Apply the same component/pattern to project creation
- Ensure consistency across all forms (teams, materials, quality, etc.)

**Files involved:**
- Task creation form: `src/app/tareas/page.tsx` or task form component
- Project creation form: `src/app/proyectos/page.tsx`
- Shared form template: `src/components/templates/FormTemplate/FormTemplate.tsx`
- May need to extract common form modal component

---

### ISSUE 6: New Projects Not Appearing in Dashboard "Proyectos Activos"

**Problem:**
Newly created projects don't appear in the dashboard "Proyectos Activos" section immediately.

**What we fixed previously:**
- Added 'planificacion' status to active projects filter in dashboard

**What still doesn't work:**
- New projects with 0% progress don't show up
- May require page refresh or have caching issues
- Dashboard may not be refetching data after project creation

**Expected flow:**
1. User creates project on `/proyectos`
2. Project is created with status 'planificacion' and 0% progress
3. Dashboard should immediately show project in "Proyectos Activos"

**Actual flow:**
1. Project created successfully
2. Shows in `/proyectos` page with 0% progress
3. Dashboard doesn't show the new project (or shows different progress)

**Investigation needed:**
1. Check dashboard data fetching logic
2. Is dashboard data cached? (React Query, SWR, or static generation?)
3. Does dashboard need manual refresh or should auto-update?
4. Are there multiple data sources causing inconsistency?

**Files to check:**
- `src/app/dashboard/page.tsx`
- Dashboard data fetching utilities
- Project API responses and caching headers

---

## Business Logic Questions Needing Clarification

### Progress Calculation Strategy
**Need to define:**
- What does "progress" mean in a construction project?
  - Option 1: Physical completion (% of construction activities completed)
  - Option 2: Financial progress (% of budget spent)
  - Option 3: Schedule adherence (% of timeline elapsed)
  - Option 4: Weighted average of all three (fisico, financiero, cronograma)

**Current implementation:**
- API creates projects with: `fisico: 0, financiero: 0, cronograma: 0`
- But dashboard shows different percentages
- No clear calculation logic visible

**Recommended approach:**
Define single source of truth for progress calculation, possibly:
```typescript
projectProgress = (fisico * 0.4) + (financiero * 0.3) + (cronograma * 0.3)
```
Or allow different views to show different progress types explicitly.

---

### User Management Architecture
**Need to define:**
1. **User creation flow:**
   - Can admins create users directly?
   - Do users self-register and get approved?
   - Are users invited via email?

2. **User-Team-Project relationships:**
   - Can a user belong to multiple teams?
   - Can a user work on multiple projects simultaneously?
   - How are permissions managed? (RBAC via roles?)

3. **User roles and permissions:**
   - ADMIN: Full system access
   - EXECUTIVE: Project manager level
   - SITE_MANAGER: Jefe de terreno
   - QUALITY_CONTROL: Control de calidad
   - Others: Bodega, Oficina Técnica, Workers

**Current state:**
- Authentication exists (NextAuth.js)
- Roles defined in database schema
- But no UI for user management

---

## Recommended Fix Priority

### P0 - Critical (Blocks MVP)
1. **Define and implement progress calculation logic** - Core metric for construction management
2. **Fix dashboard data consistency** - Main landing page showing wrong data
3. **Implement user creation functionality** - Needed for team and task assignment

### P1 - High (Needed for MVP)
4. **Fix task form project dropdown** - Users can't create tasks for correct projects
5. **Standardize form templates** - Use task form pattern across all creation flows
6. **Fix new project dashboard visibility** - New projects should appear immediately

### P2 - Medium (Polish)
7. **Document progress calculation for users** - Help text explaining what progress means
8. **Add real-time dashboard updates** - Auto-refresh when data changes
9. **Improve form state management** - Better persistence and validation

---

## Agent Workflow Recommendation

When fixing these issues, follow this sequence:

1. **@agent-qa: Investigate progress calculation**
   - Find all places where progress is calculated/displayed
   - Map data flow from database → API → UI
   - Identify sources of inconsistency

2. **@agent-builder: Implement single source of truth for progress**
   - Define calculation utility function
   - Update all UI components to use it
   - Add progress update triggers (when tasks complete, etc.)

3. **@agent-qa: Review progress implementation**
   - Verify consistency across all views
   - Check calculation accuracy

4. **@agent-fixer: Fix any issues found**

Then repeat for user management, form standardization, etc.

---

## Technical Debt Identified

1. **Multiple sources of truth for project data**
   - API returns one thing, dashboard shows another
   - No centralized data fetching/caching strategy

2. **Inconsistent form patterns**
   - Task form works great
   - Project form has different implementation
   - Need standardized form component library

3. **Missing CRUD operations**
   - Users: Only read, no create/update/delete UI
   - May be missing for other entities too

4. **Unclear business logic**
   - Progress calculation not documented
   - User assignment workflow unclear
   - Project lifecycle states undefined

---

## Files Needing Investigation

### High Priority
- `src/app/dashboard/page.tsx` - Dashboard data fetching
- `src/app/api/projects/route.ts` - Project API logic
- `src/app/proyectos/page.tsx` - Projects list and creation
- `src/app/tareas/page.tsx` - Tasks (reference for good form)
- `src/app/equipo/page.tsx` - Teams page (needs user creation)

### Medium Priority
- Progress calculation utilities (may not exist yet)
- User management API routes
- Form template components
- Dashboard KPI calculation logic

---

## Documentation Status

**Created:** October 2, 2025  
**Priority:** P0 - Must address before MVP launch  
**Estimated Effort:** 2-3 days of development + testing  
**Dependencies:** Requires business logic clarification from stakeholders

---

## Next Steps for Future Agents

1. **Start with progress calculation investigation** - This affects multiple areas
2. **Don't make assumptions about business logic** - Ask for clarification first
3. **Check the task form implementation** - Use it as reference for form patterns
4. **Test dashboard data flow end-to-end** - Find where inconsistencies originate
5. **Document findings before implementing fixes** - Update this file with discoveries
