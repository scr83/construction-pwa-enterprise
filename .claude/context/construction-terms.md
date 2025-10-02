# CHILEAN CONSTRUCTION TERMINOLOGY

**Last Updated:** October 2, 2025  
**Language:** Spanish (Chilean construction industry)  
**Purpose:** Ensure accurate terminology in UI and code

---

## 🚨 CRITICAL RULE

**ALL user-facing construction terminology MUST be in Spanish**

❌ **DON'T use English:**
- "Work Completed" → ❌
- "Quality Control" → ❌
- "Materials Manager" → ❌

✅ **DO use Spanish:**
- "Faena Ejecutada" → ✅
- "Control de Calidad" → ✅
- "Jefe de Bodega" → ✅

---

## 👷 CONSTRUCTION TEAM ROLES (Database values & UI labels)

### **Team Hierarchy (Top to Bottom)**

**1. maestro_mayor**
- **UI Label:** "Maestro Mayor"
- **English equivalent:** Master foreman / Construction superintendent
- **Responsibility:** Overall team leadership, quality oversight
- **Typical pay:** Highest hourly rate
- **Experience:** 10+ years

**2. maestro_albañil**
- **UI Label:** "Maestro Albañil"
- **English equivalent:** Master mason / Master bricklayer
- **Responsibility:** Masonry work leadership, training others
- **Experience:** 7+ years

**3. oficial_primera**
- **UI Label:** "Oficial de Primera"
- **English equivalent:** First officer / Skilled tradesperson
- **Responsibility:** Execute specialized tasks independently
- **Experience:** 3-7 years

**4. ayudante**
- **UI Label:** "Ayudante"
- **English equivalent:** Helper / Assistant
- **Responsibility:** Assist skilled workers, basic tasks
- **Experience:** 1-3 years

**5. jornal**
- **UI Label:** "Jornal"
- **English equivalent:** Day laborer / Entry-level worker
- **Responsibility:** Basic labor tasks, material handling
- **Experience:** 0-1 years

---

## 🏗️ TEAM TYPES (Database values & UI labels)

### **Specialization Areas**

**estructuras**
- **UI Label:** "Estructuras"
- **English:** Structural work team
- **Work:** Foundation, concrete, steel, load-bearing structures
- **Activities:** Trazado, excavación, enfierradura, hormigón

**instalaciones**
- **UI Label:** "Instalaciones"
- **English:** Installations/MEP team
- **Work:** Electrical, plumbing, gas, HVAC
- **Activities:** Electricidad, gasfitería, gas, ventilación

**terminaciones**
- **UI Label:** "Terminaciones"
- **English:** Finishes team
- **Work:** Interior finishes, painting, flooring, trim
- **Activities:** Pintura, pavimentos, revestimientos, artefactos

**calidad**
- **UI Label:** "Calidad" or "Control de Calidad"
- **English:** Quality control team
- **Work:** Inspections, approvals, quality verification
- **Activities:** Inspecciones, recepciones, verificación

---

## 📋 CONSTRUCTION ACTIVITIES (Partidas)

### **Typical Residential Construction Sequence**

**Foundation & Site Work:**
1. **Trazado y Niveles** - Site layout and leveling
2. **Instalaciones Bajo Radier** - Underground utilities
3. **Hormigón Emplantillado** - Foundation slab formwork
4. **Colocación de Moldajes** - Formwork placement
5. **Rellenos Bajo Radier** - Fill under slab
6. **Enfierradura** - Rebar installation
7. **Hormigón Radier** - Concrete slab pour

**Structure:**
8. **Levante de Estructuras** - Structure raising
9. **Sobrelosa** - Upper slab
10. **Revestimiento Exterior** - Exterior cladding (smart panel, vinyl siding)

**Roofing:**
11. **Cubierta** - Roof structure
12. **Hojalatería** - Sheet metal/flashing

**MEP (Mechanical, Electrical, Plumbing):**
13. **Instalación de Gas** - Gas installation
14. **Instalación Eléctrica** - Electrical installation
15. **Instalación de Gasfitería** - Plumbing installation

**Finishes:**
16. **Aislación** - Insulation
17. **Revestimientos Interiores** - Interior finishes
18. **Pavimentos** - Flooring
19. **Artefactos y Griferías** - Fixtures and faucets
20. **Terminaciones** - Final finishes
21. **Revisión y Entrega** - Final inspection and delivery

---

## 🏢 CONSTRUCTION DEPARTMENTS

### **Main Departments (Database & UI)**

**Gerencia**
- **UI Label:** "Gerencia"
- **English:** Management / Executive
- **Role:** Strategic oversight, financial decisions
- **Users:** Project directors, company executives

**Jefe de Terreno**
- **UI Label:** "Jefe de Terreno"
- **English:** Site manager / Construction manager
- **Role:** Day-to-day site operations, team coordination
- **Users:** Construction managers, site supervisors

**Bodega**
- **UI Label:** "Bodega" or "Jefe de Bodega"
- **English:** Warehouse / Materials management
- **Role:** Material tracking, inventory, procurement
- **Users:** Warehouse managers, logistics coordinators

**Oficina Técnica**
- **UI Label:** "Oficina Técnica"
- **English:** Technical office / Engineering
- **Role:** Planning, technical specifications, contracts
- **Users:** Engineers, project planners, quantity surveyors

**Control de Calidad**
- **UI Label:** "Control de Calidad"
- **English:** Quality control / QA
- **Role:** Inspections, approvals, quality standards
- **Users:** Quality inspectors, compliance officers

---

## 📊 WORK STATUS TERMINOLOGY

### **Work Record Status (Spanish UI labels)**

**ASSIGNED** → "Asignada"
- Work has been assigned but not started

**MATERIALS_PLANNED** → "Materiales Planificados"
- Material requirements defined

**MATERIALS_PURCHASED** → "Materiales Comprados"
- Materials ordered from supplier

**MATERIALS_AVAILABLE** → "Materiales Disponibles"
- Materials in warehouse, ready for delivery

**MATERIALS_DELIVERED** → "Materiales Entregados"
- Materials delivered to site

**EXECUTED** → "Faena Ejecutada"
- Work has been completed
- **CRITICAL:** This is the key status for field workers

**QUALITY_SUBMITTED** → "Entregado a Calidad"
- Submitted for quality inspection

**QUALITY_RECEIVED** → "Recibido por Calidad"
- Quality team has received it

**QUALITY_APPROVED** → "Aprobado por Calidad"
- Quality inspection passed

**COMPLETED** → "Completada"
- Fully completed and approved

**PAID** → "Pagada" or "Trato Pagado"
- Payment processed

---

## 💰 PAYMENT TERMINOLOGY

**Trato** (plural: **Tratos**)
- **UI Label:** "Trato" or "Contrato"
- **English:** Work contract / Payment agreement
- **Usage:** "Trato pagado" = Payment completed

**Pago Cursado**
- **UI Label:** "Pago Cursado"
- **English:** Payment processed
- **Usage:** Payment has been sent/approved

**Subcontratista**
- **UI Label:** "Subcontratista"
- **English:** Subcontractor
- **Usage:** External contractors hired for specific work

---

## 📦 MATERIAL TERMINOLOGY

**Kit de Materiales**
- **UI Label:** "Kit de Materiales"
- **English:** Material package / Bill of materials
- **Usage:** Set of materials for specific activity

**Kit Inicial Cotizado**
- **UI Label:** "Kit Inicial Cotizado"
- **English:** Initial quoted material package
- **Stage:** Planning/quotation

**Kit Ajustado**
- **UI Label:** "Kit Ajustado" or "Kit de Material Ajustado"
- **English:** Adjusted material package
- **Stage:** After initial assessment, quantities adjusted

**Solped** (Solicitud de Pedido)
- **UI Label:** "Solped Emitida"
- **English:** Purchase requisition
- **Usage:** Formal request to purchase materials

**Entrega a Terreno**
- **UI Label:** "Entregado a Terreno"
- **English:** Delivered to site
- **Usage:** Materials delivered from warehouse to construction site

---

## 📏 MEASUREMENT UNITS

**Common Chilean Construction Units:**

- **m²** - Square meters (área)
- **m³** - Cubic meters (volumen)
- **ml** or **m** - Linear meters (largo)
- **kg** - Kilograms (peso)
- **ton** - Tons (peso grande)
- **u** or **un** - Units (unidades)
- **gl** or **gln** - Gallons (líquidos)
- **lt** - Liters (líquidos)
- **saco** - Bag/sack (cemento, etc.)

---

## 🏗️ COMMON CONSTRUCTION TERMS

### **Structural Elements**

- **Radier** - Ground-level concrete slab
- **Sobrelosa** - Upper floor slab
- **Enfierradura** - Rebar / Reinforcement steel
- **Moldaje** - Formwork
- **Hormigón** - Concrete
- **Emplantillado** - Subbase / Foundation preparation

### **Finishes**

- **Revestimiento** - Cladding / Covering
- **Pavimento** - Flooring / Pavement
- **Terminación** - Finish / Final touches
- **Pintura** - Paint
- **Cielo** - Ceiling
- **Tabique** - Partition wall

### **MEP**

- **Gasfitería** - Plumbing (Chilean term)
- **Cañería** - Piping
- **Artefactos** - Fixtures (sinks, toilets, etc.)
- **Griferías** - Faucets / Taps
- **Enchufes** - Electrical outlets
- **Luminarias** - Light fixtures

### **Site Terms**

- **Faena** - Work / Job / Task
- **Cuadrilla** - Work crew / Team
- **Jornada** - Work shift / Day's work
- **Avance** - Progress
- **Atraso** - Delay
- **Obra** - Construction site / Project

---

## 📝 UI TEXT PATTERNS

### **Button Labels (Spanish)**

❌ "Submit Work" → ✅ "Registrar Faena"
❌ "Complete Task" → ✅ "Completar Tarea"
❌ "Assign Team" → ✅ "Asignar Equipo"
❌ "Upload Photo" → ✅ "Subir Foto"
❌ "Save Changes" → ✅ "Guardar Cambios"
❌ "Cancel" → ✅ "Cancelar"
❌ "Delete" → ✅ "Eliminar"
❌ "Edit" → ✅ "Editar"
❌ "View" → ✅ "Ver"

### **Form Labels (Spanish)**

❌ "Quantity Executed" → ✅ "Cantidad Ejecutada"
❌ "Completion Date" → ✅ "Fecha de Ejecución"
❌ "Work Notes" → ✅ "Notas de Faena"
❌ "Worker Name" → ✅ "Nombre del Trabajador"
❌ "Team Supervisor" → ✅ "Supervisor de Equipo"
❌ "Building" → ✅ "Edificio"
❌ "Floor" → ✅ "Piso"
❌ "Unit" → ✅ "Unidad"

### **Status Messages (Spanish)**

❌ "Work completed successfully" → ✅ "Faena registrada exitosamente"
❌ "Error saving data" → ✅ "Error al guardar los datos"
❌ "Loading..." → ✅ "Cargando..."
❌ "No results found" → ✅ "No se encontraron resultados"
❌ "Please fill all required fields" → ✅ "Por favor complete todos los campos requeridos"

---

## 🎯 CONSTRUCTION TASK CATEGORIES (Enums)

**TaskCategory enum values & UI labels:**

- **GENERAL** → "General"
- **STRUCTURE** → "Estructura"
- **MATERIALS** → "Materiales"
- **QUALITY** → "Calidad"
- **INSTALLATIONS** → "Instalaciones"
- **FINISHES** → "Acabados" or "Terminaciones"
- **TECHNICAL_OFFICE** → "Oficina Técnica"

---

## 🚨 CRITICAL REMINDERS

### **Always Use Spanish For:**
- All user-facing text (buttons, labels, messages)
- Construction activity names (partidas)
- Team role names
- Status labels
- Form field labels
- Error messages
- Success messages
- Navigation items

### **Can Use English For:**
- Code variables and functions
- Component names
- Database field names (snake_case)
- Comments in code
- Technical documentation

### **Example: Good vs Bad**

❌ **BAD (English UI):**
```tsx
<Button>Submit Work</Button>
<FormField label="Quantity" />
<StatusBadge status="Work Completed" />
```

✅ **GOOD (Spanish UI, English code):**
```tsx
<Button>Registrar Faena</Button>
<FormField label="Cantidad Ejecutada" />
<StatusBadge status="Faena Ejecutada" />
```

---

## 📚 QUICK REFERENCE DICTIONARY

**English → Spanish (Construction)**

| English | Spanish (Chilean) | Context |
|---------|------------------|---------|
| Work | Faena | Completed work |
| Task | Tarea | Assigned task |
| Team | Equipo / Cuadrilla | Work team |
| Foreman | Maestro Mayor | Team leader |
| Helper | Ayudante | Assistant |
| Quality | Calidad | Quality control |
| Inspection | Inspección | Quality check |
| Approved | Aprobado | Passed inspection |
| Rejected | Rechazado | Failed inspection |
| Materials | Materiales | Construction materials |
| Warehouse | Bodega | Material storage |
| Delivery | Entrega | Material delivery |
| Payment | Pago | Payment processing |
| Contract | Trato / Contrato | Work agreement |
| Progress | Avance | Construction progress |
| Delay | Atraso | Schedule delay |
| Site | Terreno / Obra | Construction site |
| Building | Edificio | Building structure |
| Floor | Piso | Building level |
| Unit | Unidad | Apartment/house/office |

---

## ✅ VALIDATION CHECKLIST

**Before shipping any feature, verify:**

- [ ] All buttons have Spanish labels
- [ ] All form fields have Spanish labels
- [ ] All status messages in Spanish
- [ ] All error messages in Spanish
- [ ] Team roles display in Spanish
- [ ] Construction activities in Spanish
- [ ] Status indicators in Spanish
- [ ] Navigation items in Spanish
- [ ] No English construction terms in UI
- [ ] Proper Chilean construction terminology used

**Remember: Spanish UI = Professional Chilean construction company!** 🏗️🇨🇱
