# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **enterprise-grade Construction Management Progressive Web Application (PWA)** for Chilean/Latin American construction companies. The application follows a mobile-first approach with Spanish language interface and construction industry-specific terminology.

**Production URL:** https://construction-pwa-enterprise-c7b1tjrfu.vercel.app/

## Development Commands

### Core Development
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

### Database Management
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database with sample data
npm run db:seed

# Reset database (dev only)
npm run db:reset
```

### Testing
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

### Storybook
```bash
# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook
```

## Architecture

### Core Technology Stack
- **Framework:** Next.js 14.2.0 with App Router
- **Language:** TypeScript 5.3.0 (strict mode)
- **Database:** Prisma ORM with PostgreSQL (production) / SQLite (development)
- **Authentication:** NextAuth.js with role-based access control
- **Styling:** Tailwind CSS 3.4.0 with mobile-first approach
- **State Management:** Zustand for client state
- **UI Components:** Radix UI with custom design system
- **PWA:** next-pwa for offline capabilities

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── projects/          # Project management
│   ├── tasks/             # Task management
│   ├── materials/         # Material tracking
│   ├── quality/           # Quality control
│   ├── team/              # Team management
│   └── admin/             # Admin functions
├── components/            # Component library (Atomic Design)
│   ├── atoms/             # Basic UI elements
│   ├── molecules/         # Component combinations
│   ├── organisms/         # Complex UI sections
│   ├── templates/         # Page layouts
│   └── pages/             # Page-specific components
├── lib/                   # Utility libraries
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

### Component Architecture (Atomic Design)

The project follows **Atomic Design Methodology**:

- **Atoms:** Basic UI elements (Button, Input, Typography, Badge, etc.)
- **Molecules:** Component combinations (FormField, StatusCard, MetricDisplay)
- **Organisms:** Complex sections (NavigationBar, DashboardGrid, TaskRegistrationForm)
- **Templates:** Page layouts (DashboardTemplate, FormTemplate, MobileTemplate)
- **Pages:** Complete pages with business logic

### Database Schema

Key database models for construction management:
- **Projects:** Construction projects with hierarchical structure
- **Buildings/Floors/Units:** Physical construction hierarchy
- **Activities:** Construction tasks and work packages (partidas)
- **Users:** Role-based authentication (GERENCIA, JEFE_TERRENO, BODEGA, etc.)
- **Materials:** Inventory and material tracking
- **Quality:** Inspection and quality control records
- **Productivity:** Work completion and progress tracking

### Authentication & Roles

Role-based access control with construction industry roles:
- **GERENCIA:** Executive oversight and reporting
- **JEFE_TERRENO:** Site management and work coordination
- **BODEGA:** Material and inventory management
- **OFICINA_TECNICA:** Planning and contractor management
- **CONTROL_CALIDAD:** Quality inspection and approval

## Development Guidelines

### Path Aliases
Use TypeScript path aliases for imports:
```typescript
import { Button } from '@/components/atoms/Button'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'
```

### Styling Conventions
- **Mobile-first:** Always design for mobile screens first
- **Touch targets:** Minimum 44px with 8px spacing
- **Responsive classes:** Use `sm:`, `md:`, `lg:` breakpoints
- **Color coding:** Green (success), yellow (warning), red (error)
- **Spanish terminology:** Use construction industry terms

### Construction Industry Terminology
Key Spanish terms used throughout the application:
- **partidas:** Construction activities/work packages
- **faenaEjecutada:** Work completed
- **entregadoACalidad:** Submitted to quality control
- **jefeTerreno:** Site supervisor
- **bodega:** Warehouse/storage
- **subcontratista:** Subcontractor

### Mobile-First Patterns
```typescript
// Responsive design pattern
<div className="space-y-4 p-4 md:space-y-6 md:p-6">
  <div className="hidden md:block">Desktop Content</div>
  <div className="block md:hidden">Mobile Content</div>
</div>

// Mobile template with actions
<MobileTemplate
  title="Page Title"
  actions={[{
    id: 'action',
    label: 'Button Label',
    variant: 'primary' as const,
    onClick: handleAction
  }]}
>
  <Content />
</MobileTemplate>
```

### Data Fetching Patterns
```typescript
// Using React Query for data fetching
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: () => fetchProjects()
})
```

## Environment Setup

### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# File storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="your-blob-token"
```

### Database Setup
1. Run `npm run db:generate` to generate Prisma client
2. Run `npm run db:push` to push schema to database
3. Run `npm run db:seed` to populate with sample data

## Testing Strategy

### Unit Testing
- **Framework:** Jest with React Testing Library
- **Location:** `__tests__` directories alongside components
- **Focus:** Component behavior and user interactions

### E2E Testing
- **Framework:** Playwright
- **Location:** `tests/` directory
- **Focus:** Critical construction workflows

### Component Testing
- **Framework:** Storybook
- **Location:** `.stories.tsx` files
- **Focus:** Component visual documentation

## Common Issues & Solutions

### Mobile Button Placement
If buttons are not accessible on mobile:
1. Check for absolute/fixed positioning without constraints
2. Ensure responsive breakpoints are applied
3. Verify touch targets are 44px minimum
4. Use MobileTemplate with actions prop for mobile-specific buttons

### Database Connection Issues
1. Verify DATABASE_URL environment variable
2. Run `npm run db:generate` after schema changes
3. Check Prisma client initialization in `lib/prisma.ts`

### Authentication Issues
1. Verify NEXTAUTH_SECRET is set
2. Check role assignments in database
3. Ensure middleware.ts is properly configured

## Production Deployment

The application is deployed on Vercel with:
- **Database:** Vercel Postgres
- **File Storage:** Vercel Blob
- **Environment:** Production environment variables
- **PWA:** Service worker for offline capabilities

### Deployment Commands
```bash
# Deploy to Vercel
vercel deploy

# Deploy to production
vercel --prod
```

## Performance Considerations

- **Bundle Size:** Tree-shaking enabled for all dependencies
- **Images:** Next.js Image component with optimization
- **Caching:** Service worker caching for offline functionality
- **Database:** Query optimization with Prisma
- **Mobile Performance:** Optimized for construction site conditions

## Documentation

Comprehensive documentation is available in the `DOCUMENTATION/` directory:
- Architecture decisions and technical rationale
- Implementation status and milestones
- Deployment guides and troubleshooting
- Project handoff instructions for future development

## Quality Assurance

Before committing changes:
1. Run `npm run lint` to check code quality
2. Run `npm run type-check` to verify TypeScript
3. Test on mobile devices or browser mobile simulation
4. Verify construction industry terminology is accurate
5. Ensure responsive design works across screen sizes