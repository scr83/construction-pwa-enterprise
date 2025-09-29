# API Language Standardization - Spanish MVP

## Issue Analysis

### Root Cause: Language Mismatch in API Layer

**Date**: September 29, 2025  
**Status**: Critical - Blocking project creation functionality  
**Impact**: Users cannot create new projects due to validation failures  

### Problem Description

The construction PWA has a **fundamental language mismatch** between the frontend and backend:

- **Frontend Forms**: Generate Spanish field names (`nombre`, `tipo`, `fecha_inicio`, `fecha_termino`)
- **Backend API**: Expects English field names (`name`, `projectType`, `startDate`, `endDate`) 
- **Mapping Logic**: Attempts to bridge this gap but fails in practice

### Technical Analysis

#### Current API Schema (English)
```typescript
// /src/app/api/projects/route.ts
const createProjectSchema = z.object({
  name: z.string().min(1, 'Nombre del proyecto es requerido'),
  description: z.string().optional(),
  projectType: z.enum(['residential', 'commercial', 'industrial', 'infrastructure']),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})
```

#### Form Field Generation (Spanish)
```typescript
// /src/components/pages/ProjectManagement/ProjectManagement.tsx
const formConfig = {
  fields: [
    { name: 'nombre', label: 'Nombre del Proyecto', type: 'text', required: true },
    { name: 'tipo', label: 'Tipo de Proyecto', type: 'select', required: true },
    { name: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date', required: true },
    { name: 'fecha_termino', label: 'Fecha de Término', type: 'date', required: true }
  ]
}
```

#### Failed Mapping Logic
```typescript
// /src/app/projects/page.tsx
const payload = {
  name: projectData.nombre || projectData.name || projectData.titulo,
  projectType: projectData.tipo === 'residencial' ? 'residential' : /* mappings */,
  startDate: projectData.fecha_inicio || projectData.startDate,
  endDate: projectData.fecha_termino || projectData.endDate
}
```

### Console Error Evidence

```
🔍 PROJECT CREATE - Raw form data: Object
🔍 PROJECT CREATE - Payload to API: Object  
🔍 PROJECT CREATE - API Error: Object
Error al crear proyecto: datos invalidos
```

The objects show as "Object" because console.log isn't properly stringifying the complex form data structure.

### Solution Decision: API Standardization to Spanish

**Decision**: Standardize the entire API layer to Spanish field names for the Chilean MVP.

**Rationale**:
1. **Consistency**: Eliminates language translation layer complexity
2. **Maintainability**: Single language throughout the stack
3. **MVP Focus**: No multi-language requirements in near term
4. **Cultural Fit**: Spanish API for Chilean construction workers

### Implementation Plan

#### 1. API Schema Update
Change `/src/app/api/projects/route.ts` validation schema:

**From (English)**:
```typescript
const createProjectSchema = z.object({
  name: z.string().min(1, 'Nombre del proyecto es requerido'),
  projectType: z.enum(['residential', 'commercial', 'industrial', 'infrastructure']),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})
```

**To (Spanish)**:
```typescript
const createProjectSchema = z.object({
  nombre: z.string().min(1, 'Nombre del proyecto es requerido'),
  tipo: z.enum(['residencial', 'comercial', 'industrial', 'infraestructura']),
  fechaInicio: z.string().optional(),
  fechaTermino: z.string().optional()
})
```

#### 2. Database Mapping
Update Prisma queries to map Spanish API fields to English database fields:

```typescript
const project = await prisma.project.create({
  data: {
    name: validatedData.nombre,           // Spanish → English
    projectType: mapTipoToProjectType(validatedData.tipo),
    startDate: validatedData.fechaInicio ? new Date(validatedData.fechaInicio) : new Date(),
    endDate: validatedData.fechaTermino ? new Date(validatedData.fechaTermino) : null
  }
})
```

#### 3. Remove Mapping Logic
Delete translation logic in `/src/app/projects/page.tsx`:

```typescript
// REMOVE this mapping
const payload = {
  name: projectData.nombre || projectData.name || projectData.titulo,
  // ... all mapping logic
}

// REPLACE with direct pass-through
const payload = projectData
```

#### 4. Value Translation
Maintain project type value mapping:

```typescript
function mapTipoToProjectType(tipo: string): string {
  const mapping = {
    'residencial': 'residential',
    'comercial': 'commercial', 
    'industrial': 'industrial',
    'infraestructura': 'infrastructure'
  }
  return mapping[tipo] || 'commercial'
}
```

### Files to Modify

1. **`/src/app/api/projects/route.ts`**
   - Update validation schema to Spanish fields
   - Add value translation functions
   - Update database mapping

2. **`/src/app/projects/page.tsx`**
   - Remove English-Spanish mapping logic
   - Simplify payload construction
   - Update console logging for better debugging

3. **Any other API endpoints** that follow the same pattern

### Testing Strategy

1. **Unit Tests**: Validate schema accepts Spanish field names
2. **Integration Tests**: End-to-end project creation flow  
3. **Manual Testing**: Test with actual form submissions
4. **Error Handling**: Verify Spanish error messages

### Rollback Plan

If issues arise, the changes are isolated to:
- API validation schemas
- Database mapping logic  
- Form submission handlers

Database schema and form definitions remain unchanged.

### Future Considerations

When multi-language support is eventually needed:
- Implement i18n layer at API boundary
- Add language detection middleware
- Create field mapping utilities
- Maintain Spanish as default for Chilean market

### Success Metrics

- ✅ Project creation form accepts user input
- ✅ API validates Spanish field names successfully  
- ✅ Projects save to database correctly
- ✅ No console errors during form submission
- ✅ User sees success confirmation
- ✅ Created projects appear in project list

---

**Status**: Ready for implementation  
**Priority**: Critical  
**Estimated Time**: 1-2 hours  
**Risk Level**: Low (isolated changes, clear rollback path)