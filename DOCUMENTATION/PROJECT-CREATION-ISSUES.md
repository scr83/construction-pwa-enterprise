# PROJECT CREATION FEATURE - KNOWN ISSUES & IMPROVEMENTS

**Created:** October 4, 2025  
**Status:** Feature deployed but needs UX improvements

---

## WORKING CORRECTLY

✅ **Core Functionality:**
- Multi-step project creation form (4 steps)
- Creates Project → Building → Floor → Unit hierarchy
- Auto-creates 40 project-level construction activities
- Architecture verified by QA: Activities per project, NOT per unit
- Admin-only access enforcement
- Spanish UI throughout
- Mobile responsive design

✅ **Database:**
- All relationships correct
- 40 partidas properly linked to projects
- Transactions work correctly
- No data corruption

---

## CRITICAL ISSUES

### 1. Missing "Crear Proyecto" Menu Icon
**What's wrong:** Navigation dropdown shows "Crear Proyecto" text with no icon, breaking visual consistency

**Location:** `/src/components/organisms/NavigationBar.tsx`

**Fix needed:**
```typescript
// In userMenuItems array, add icon
{
  label: 'Crear Proyecto',
  href: '/admin/projects/new',
  icon: 'plus-circle' // or 'folder-plus'
}
```

---

### 2. Manual Unit Input is Tedious
**What's wrong:** Users must click "Agregar Unidad" and manually name each unit. For 100-unit building, this is unusable.

**Location:** `/src/app/admin/projects/new/page.tsx` - Step 3

**Fix needed:** Add bulk unit creation:
```
For each floor, show:
┌─────────────────────────────────────┐
│ Piso 1                              │
│ Número de unidades: [___10___]      │
│ Patrón de nombres:                  │
│ ( ) Secuencial (1, 2, 3...)         │
│ (•) Con prefijo: [_EA-_] (EA-1, EA-2)│
│ ( ) Personalizados (entrada manual) │
└─────────────────────────────────────┘
```

Auto-generate unit objects based on selection.

---

### 3. No Project Details Page
**What's wrong:** Clicking "Ver" on project cards goes nowhere or shows error. Users can't see:
- Project hierarchy (buildings/floors/units)
- 40 construction activities linked to project
- Team assignments
- Project progress

**Fix needed:** Create `/src/app/projects/[id]/page.tsx`

**Should display:**
- Project info (name, type, dates, description)
- Hierarchy tree view (buildings → floors → units)
- List of 40 construction activities with status
- Assigned team members
- Overall progress calculation
- Edit/delete options for admins

---

### 4. Mystery User "Carlos Mendoza"
**What's wrong:** Projects show "Carlos Mendoza" assigned, but form never asked for team assignment.

**Root cause:** API auto-assigns admin user as PROJECT_MANAGER:
```typescript
// In /src/app/api/projects/create/route.ts
await tx.projectAssignment.create({
  data: {
    userId: adminUser.id, // <- This assigns whoever creates it
    projectId: project.id,
    role: 'PROJECT_MANAGER'
  }
})
```

But UI shows "Carlos Mendoza" which means:
- Either seed data created that user
- Or there's a join returning wrong user name
- Or ProjectAssignment has wrong userId

**Fix needed:**
1. Check database: `SELECT * FROM User WHERE name LIKE '%Carlos%'`
2. Add team assignment to Step 1 of form (optional)
3. Or fix the display to show actual admin user's name

---

### 5. Dashboard Shows Confusing Metrics
**What's wrong:** Dashboard displays:
- "80% Productividad General" 
- "3 de 3 Equipos Activos"
- "84% Calidad Promedio"

But user just created projects with no work done. These numbers are misleading.

**Root cause:** Dashboard fetches from:
- `Teams` table (has seed/mock data)
- `Tasks` table (has seed/mock data)
- NOT from actual project construction activities

**What dashboard SHOULD show for new projects:**
- "3 Proyectos Activos" ✅ (this is correct)
- "0% Progreso General" (no work completed yet)
- "0 Unidades Completadas" 
- "120 Actividades Totales" (40 per project × 3 projects)

**Fix needed:** Complete Step 8 (was skipped yesterday)
- Remove mock data logic from `/src/app/dashboard/page.tsx`
- Fetch real projects with their construction activities
- Calculate actual progress from workflow boolean fields
- Show real metrics based on database state

---

## MEDIUM PRIORITY IMPROVEMENTS

### 6. No Validation on Building/Floor Limits
Users can add 1000+ buildings or floors, which would create database performance issues.

**Fix:** Add validation:
- Max 50 buildings per project
- Max 100 floors per building  
- Max 500 units per floor

### 7. No Project List Page
The `/projects` route exists in nav but shows old mock data. Need real project list with:
- Search/filter
- Status indicators
- Progress bars
- Action buttons (Edit, View, Delete)

### 8. No Edit Capability
Once created, projects cannot be edited. Need:
- Edit project details
- Add/remove buildings
- Add/remove units
- Reassign team members

### 9. Step 4 Review Doesn't Show Unit Names
Review step shows:
- "1 edificio, 1 piso, 10 unidades"

But doesn't show WHICH units (EA-1, EA-2...). Users can't verify before submitting.

### 10. No Cancel/Back During Creation
If user makes mistake on Step 3, they can't go back to Step 2 without losing all data. Need:
- Back buttons on each step
- Save draft functionality
- Cancel with confirmation dialog

---

## LOW PRIORITY / POLISH

- Success message could show project ID or direct link
- Loading spinner during submission is generic
- No progress indicator showing "Creating 120 activities..."
- Mobile keyboard covers form inputs on small screens
- No autosave if user navigates away mid-creation

---

## NEXT SESSION PRIORITIES

**Recommended order:**

1. **Bulk unit creation** (biggest UX pain point)
2. **Project details page** (blocks usability)  
3. **Fix dashboard metrics** (Complete Step 8)
4. **Add menu icon** (quick visual fix)
5. **Investigate Carlos Mendoza** (data integrity)

---

## TECHNICAL NOTES

**Dashboard Metric Sources:**
```typescript
// Current dashboard logic (needs fixing)
const teamKPIs = useMemo(() => ({
  overallProductivity: calculateKPIs.getOverallProductivity(teams), // <- From Teams table
  teamUtilization: calculateKPIs.getTeamUtilization(teams),
  qualityScore: calculateKPIs.getQualityScore(teams),
  // ... etc
}), [teams])
```

**Should be:**
```typescript
const projectKPIs = useMemo(() => ({
  totalProjects: projects.length,
  completedUnits: projects.reduce((sum, p) => sum + p.unitsCompleted, 0),
  overallProgress: calculateProgressFromActivities(projects),
  // Based on ConstructionActivity workflow booleans
}), [projects])
```

**Construction Activity Progress Calculation:**
Each of the 40 activities has 14 workflow boolean fields:
- `kitMaterialInicial` through `pagoCursado`
- Progress = (completed checkboxes / 14) × 100% per activity
- Project progress = average of all 40 activities

This is already implemented in `/src/lib/calculations/progress.ts` but not used in dashboard.

---

**End of issues document. Ready for next development session.**
