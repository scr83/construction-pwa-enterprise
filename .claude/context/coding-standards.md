# CODING STANDARDS & CONVENTIONS

**Last Updated:** October 2, 2025  
**Purpose:** Maintain consistent code quality and patterns across the app

---

## 🚨 CRITICAL RULES

**These are NON-NEGOTIABLE:**

❌ **NEVER:**
- Use `any` type in TypeScript
- Modify `prisma/schema.prisma` without approval
- Break existing component interfaces
- Skip error handling
- Ignore TypeScript errors
- Create components without proper structure

✅ **ALWAYS:**
- Use strict TypeScript types
- Follow atomic design patterns
- Handle errors gracefully
- Include loading states
- Mobile-first design (44px+ touch targets)
- Spanish for construction UI text

---

## 📁 FILE STRUCTURE CONVENTIONS

### **Component Structure**

```
src/components/[layer]/ComponentName/
├── ComponentName.tsx         # Main component (required)
├── ComponentName.stories.tsx # Storybook (for complex components)
├── ComponentName.test.tsx    # Tests (optional for MVP)
└── index.ts                  # Barrel export (required)
```

### **Index.ts Pattern**

```typescript
// src/components/atoms/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

**Simple re-export, no logic in index files**

---

## 💻 TYPESCRIPT STANDARDS

### **Strict Mode - NO EXCEPTIONS**

```typescript
// tsconfig.json settings (already configured)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### **Type Definition Patterns**

✅ **GOOD:**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({
  variant,
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children
}: ButtonProps) {
  // ...
}
```

❌ **BAD:**
```typescript
function Button(props: any) { // NO 'any'!
  const { variant, size, onClick } = props;
  // ...
}
```

### **Avoid 'any' - Use Proper Types**

❌ **BAD:**
```typescript
const data: any = await fetchData();
const result: any = processData(data);
```

✅ **GOOD:**
```typescript
interface ApiResponse {
  projects: Project[];
  total: number;
}

const data: ApiResponse = await fetchData();
const result: ProcessedData = processData(data);
```

**If truly unknown:** Use `unknown` and type guard

```typescript
const data: unknown = await fetchData();

if (isApiResponse(data)) {
  // TypeScript now knows data is ApiResponse
  const projects = data.projects;
}
```

---

## ⚛️ REACT COMPONENT PATTERNS

### **Functional Components Only**

✅ **GOOD:**
```typescript
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  const [state, setState] = useState(initialValue);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

❌ **BAD:**
```typescript
export class MyComponent extends React.Component {
  // Don't use class components
}
```

### **Props Interface Naming**

```typescript
// Component: Button
interface ButtonProps { /* ... */ }

// Component: FormField
interface FormFieldProps { /* ... */ }

// Pattern: {ComponentName}Props
```

### **Default Props Pattern**

```typescript
interface CardProps {
  title: string;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({
  title,
  variant = 'default',
  padding = 'md'
}: CardProps) {
  // Use destructuring with defaults
}
```

---

## 🎨 COMPONENT COMPOSITION

### **Atomic Design Hierarchy**

```
Atoms (basic elements)
  └─> Molecules (simple combinations)
      └─> Organisms (complex features)
          └─> Templates (page layouts)
              └─> Pages (complete pages)
```

### **Composition Over Recreation**

✅ **GOOD (Compose from existing):**
```typescript
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

export function IconButton({ icon, children, ...props }: IconButtonProps) {
  return (
    <Button {...props}>
      <Icon name={icon} size="sm" />
      {children}
    </Button>
  );
}
```

❌ **BAD (Recreate from scratch):**
```typescript
export function IconButton() {
  return (
    <button className="px-4 py-2 rounded ...">
      {/* Rebuilding button styling */}
    </button>
  );
}
```

---

## 🎯 NAMING CONVENTIONS

### **Components**

```
PascalCase for components:
- Button
- FormField
- WorkCompletionForm
- DashboardTemplate
```

### **Functions & Variables**

```typescript
// camelCase for functions and variables
const userName = 'Fernando';
const totalProjects = calculateTotal();

function fetchProjectData() {
  // ...
}

const handleSubmit = async () => {
  // ...
};
```

### **Constants**

```typescript
// SCREAMING_SNAKE_CASE for true constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const API_BASE_URL = '/api';
const DEFAULT_TIMEOUT = 30000;

// camelCase for configuration objects
const validationRules = {
  minLength: 8,
  maxLength: 100
};
```

### **Types & Interfaces**

```typescript
// PascalCase, descriptive names
interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
}

type ButtonVariant = 'primary' | 'secondary' | 'outline';
```

### **Database Field Names (Prisma)**

```typescript
// snake_case in database
model WorkRecord {
  execution_date DateTime?
  construction_activity_id String
}

// Map to camelCase in TypeScript
@@map("work_records")
```

---

## 📦 IMPORT ORGANIZATION

### **Import Order**

```typescript
// 1. External libraries
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Internal utilities/libs
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

// 3. Components (atoms → molecules → organisms)
import { Button, Input, Icon } from '@/components/atoms';
import { FormField, SearchBar } from '@/components/molecules';
import { NavigationBar } from '@/components/organisms';

// 4. Types
import type { Project, Building } from '@prisma/client';
import type { ButtonProps } from '@/components/atoms/Button';

// 5. Styles (if any)
import styles from './Component.module.css';
```

### **Barrel Exports Usage**

✅ **GOOD:**
```typescript
import { Button, Input, Icon } from '@/components/atoms';
```

❌ **BAD:**
```typescript
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { Icon } from '@/components/atoms/Icon/Icon';
```

---

## 🎨 TAILWIND CSS CONVENTIONS

### **Class Organization**

```typescript
// Order: Layout → Sizing → Spacing → Typography → Colors → Effects
<div className="
  flex flex-col         // Layout
  w-full h-screen       // Sizing
  p-4 gap-4            // Spacing
  text-lg font-semibold // Typography
  bg-white text-gray-900 // Colors
  rounded-lg shadow-md   // Effects
">
```

### **Mobile-First Responsive**

```typescript
<div className="
  text-base           // Mobile (default)
  md:text-lg         // Tablet (769px+)
  lg:text-xl         // Desktop (1025px+)
">
```

### **Touch Target Minimum (44px)**

```typescript
// ❌ BAD
<button className="h-8 w-8">X</button>

// ✅ GOOD
<button className="min-h-[44px] min-w-[44px]">X</button>
```

### **NO Dynamic Class Names**

```typescript
// ❌ BAD (Tailwind won't compile this)
const color = 'blue';
<div className={`text-${color}-600`}>

// ✅ GOOD (Use object mapping)
const colorClasses = {
  blue: 'text-blue-600',
  red: 'text-red-600',
  green: 'text-green-600'
};
<div className={colorClasses[color]}>
```

---

## 🔧 ERROR HANDLING PATTERNS

### **API Route Error Handling**

```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = schema.parse(body);
    
    const result = await prisma.model.create({ data: validated });
    
    return NextResponse.json(
      { success: true, data: result },
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

### **Component Error Handling**

```typescript
export function MyComponent() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
}
```

---

## 📱 MOBILE-FIRST DESIGN RULES

### **Touch Targets**

```
Minimum: 44px × 44px
Preferred: 48px × 48px
Spacing between: 8px minimum
```

### **Responsive Breakpoints**

```typescript
// Tailwind breakpoints (already configured)
sm: 640px   // Small devices (rarely used)
md: 768px   // Tablets
lg: 1024px  // Desktops
xl: 1280px  // Large desktops
2xl: 1536px // Extra large

// OUR USAGE:
// Default (< 768px): Mobile
// md (768px+): Tablet
// lg (1024px+): Desktop
```

### **Mobile Optimization Checklist**

- [ ] Touch targets ≥ 44px
- [ ] Spacing between buttons ≥ 8px
- [ ] Font size ≥ 16px (body text)
- [ ] Buttons at bottom 40% of screen (thumb reach)
- [ ] Form inputs have large touch areas
- [ ] No hover-only interactions
- [ ] Works offline for critical features

---

## 🔄 STATE MANAGEMENT

### **useState for Component State**

```typescript
const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
const [data, setData] = useState<Data | null>(null);
```

### **Zustand for Global State (when needed)**

```typescript
// src/stores/projectStore.ts
import { create } from 'zustand';

interface ProjectStore {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
}));

// Usage
const { currentProject, setCurrentProject } = useProjectStore();
```

**Note:** Currently light usage of Zustand - prefer component state when possible

---

## 📝 FORM HANDLING

### **react-hook-form + Zod Pattern**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  quantity: z.number().min(0, 'Cantidad debe ser positiva'),
});

type FormData = z.infer<typeof formSchema>;

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      await saveData(data);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Nombre"
        {...register('name')}
        error={errors.name?.message}
      />
      
      <Button type="submit" loading={isSubmitting}>
        Guardar
      </Button>
    </form>
  );
}
```

---

## 🚀 PERFORMANCE PATTERNS

### **Image Optimization**

```typescript
import Image from 'next/image';

// ✅ GOOD
<Image
  src="/project.jpg"
  alt="Project photo"
  width={800}
  height={600}
  priority={isAboveFold}
/>

// ❌ BAD
<img src="/project.jpg" alt="Project photo" />
```

### **Code Splitting**

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/organisms/HeavyChart'),
  { loading: () => <Loading />, ssr: false }
);
```

### **Memoization (when needed)**

```typescript
import { useMemo, useCallback } from 'react';

// Expensive calculation
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// Callback that doesn't change
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

**Note:** Don't over-optimize - only use when profiling shows benefit

---

## ✅ CODE QUALITY CHECKLIST

**Before committing code, verify:**

- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] No `any` types used
- [ ] Error handling implemented
- [ ] Loading states included
- [ ] Mobile responsive (44px+ touch targets)
- [ ] Spanish UI text for construction terms
- [ ] Follows atomic design if component
- [ ] Composes from existing components
- [ ] No database schema changes (or approved)
- [ ] API follows existing patterns
- [ ] Console.logs removed (except intentional)

---

## 🚨 COMMON MISTAKES TO AVOID

❌ **Using 'any':**
```typescript
const data: any = await fetch(); // NO!
```

❌ **Breaking existing interfaces:**
```typescript
// Changing ButtonProps breaks all existing Button usage
interface ButtonProps {
  onClick: () => void; // Changed from optional to required
}
```

❌ **Not handling errors:**
```typescript
const data = await fetchData(); // What if it fails?
return <Component data={data} />;
```

❌ **Ignoring mobile:**
```typescript
<button className="h-6 w-6">X</button> // Too small for touch!
```

❌ **English construction UI:**
```tsx
<Button>Submit Work</Button> // Should be "Registrar Faena"
```

❌ **Dynamic Tailwind classes:**
```typescript
className={`text-${color}-600`} // Won't compile!
```

---

## 💡 HELPFUL PATTERNS

### **Optional Chaining**

```typescript
const name = user?.profile?.name ?? 'Unknown';
```

### **Nullish Coalescing**

```typescript
const port = config.port ?? 3000; // Only if null/undefined, not if 0 or ''
```

### **Array Methods**

```typescript
// Filter + Map pattern
const activeProjectNames = projects
  .filter(p => p.status === 'ACTIVE')
  .map(p => p.name);

// Find
const project = projects.find(p => p.id === projectId);

// Some/Every
const hasDelayed = tasks.some(t => t.status === 'DELAYED');
const allCompleted = tasks.every(t => t.status === 'COMPLETED');
```

---

## 📚 REMEMBER

**Good code is:**
- ✅ Type-safe (no `any`)
- ✅ Consistent (follows patterns)
- ✅ Composable (reuses existing)
- ✅ Maintainable (clear, simple)
- ✅ Mobile-first (44px targets)
- ✅ Error-handled (graceful failures)
- ✅ Construction-accurate (Spanish UI)

**Follow these standards = Ship quality code faster!** 🚀
