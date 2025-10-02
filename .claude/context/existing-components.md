# EXISTING COMPONENTS - DO NOT RECREATE

**Last Updated:** October 2, 2025  
**Purpose:** Complete inventory of existing components to prevent duplication

---

## 🔴 CRITICAL RULE

**BEFORE creating ANY component, check this list first!**

If it exists here → Extend or reuse it  
If similar exists → Compose from existing atoms/molecules  
Only create NEW if truly unique functionality needed

---

## ⚙️ ATOMS (src/components/atoms/)

Basic building blocks - single responsibility components

✅ **Avatar** (`src/components/atoms/Avatar/`)
- User avatar with image or initials fallback
- Sizes: sm, md, lg
- Status indicator support

✅ **Badge** (`src/components/atoms/Badge/`)
- Status badges with variants
- Variants: success, warning, error, info, default
- Sizes: sm, md, lg
- Usage: Status indicators, tags, labels

✅ **Button** (`src/components/atoms/Button/`)
- Primary action button
- Variants: primary, secondary, outline, ghost, link
- Sizes: sm, md, lg
- States: default, hover, active, disabled, loading
- Icons: left, right, only
- **DO NOT recreate** - extend this for button needs

✅ **Card** (`src/components/atoms/Card/`)
- Container with shadow and padding
- Variants: default, outlined, elevated
- Usage: Content containers, list items

✅ **Checkbox** (`src/components/atoms/Checkbox/`)
- Form checkbox with label
- States: unchecked, checked, indeterminate
- Error state support

✅ **ErrorBoundary** (`src/components/atoms/ErrorBoundary/`)
- React error boundary wrapper
- Fallback UI for errors
- Usage: Wrap components that might error

✅ **Icon** (`src/components/atoms/Icon/`)
- Lucide-react icon wrapper (0.263.1)
- Consistent sizing: sm (16px), md (20px), lg (24px)
- Color support via className
- **Use this** instead of importing Lucide directly

✅ **Input** (`src/components/atoms/Input/`)
- Text input field
- Types: text, email, password, number, tel, url
- States: default, focus, error, disabled
- Label and error message support
- **DO NOT recreate** - use this for all text inputs

✅ **Loading** (`src/components/atoms/Loading/`)
- Spinner and skeleton loaders
- Variants: spinner, skeleton
- Sizes: sm, md, lg, full (full screen)
- Usage: Async operations, page loads

✅ **ProgressBar** (`src/components/atoms/ProgressBar/`)
- Horizontal progress indicator
- Shows percentage (0-100)
- Colors: blue (default), green, yellow, red
- Usage: Task completion, upload progress

✅ **RadioButton** (`src/components/atoms/RadioButton/`)
- Radio input with label
- Groups managed via parent component
- Error state support

✅ **Typography** (`src/components/atoms/Typography/`)
- Text styling component
- Variants: h1, h2, h3, h4, h5, h6, body, subtitle, caption, overline
- Colors: default, muted, primary, error, success
- **Use this** for consistent text styling

---

## 🔷 MOLECULES (src/components/molecules/)

Simple combinations of atoms

✅ **ChartDisplay** (`src/components/molecules/ChartDisplay/`)
- Recharts wrapper for various chart types
- Types: line, bar, area, pie
- Responsive and themed
- **Use this** for all data visualization

✅ **DatePicker** (`src/components/molecules/DatePicker/`)
- Date selection with calendar UI
- Single date and date range support
- react-day-picker integration
- **Touch target:** Currently 32px (⚠️ needs fix to 44px)

✅ **FilterDropdown** (`src/components/molecules/FilterDropdown/`)
- Multi-select filter dropdown
- Search within options
- Select all / Clear all
- Usage: List filtering, search refinement

✅ **FormField** (`src/components/molecules/FormField/`)
- Input with label, error, and help text
- Wraps Input atom with form context
- react-hook-form integration
- **Use this** for all form inputs instead of raw Input

✅ **MetricDisplay** (`src/components/molecules/MetricDisplay/`)
- Metric card with value, label, and trend
- Shows change indicator (↑ ↓ →)
- Color-coded by direction
- Usage: KPIs, dashboard metrics

✅ **NotificationCard** (`src/components/molecules/NotificationCard/`)
- Notification item display
- Types: info, success, warning, error
- Timestamp, title, message
- Mark as read functionality

✅ **Pagination** (`src/components/molecules/Pagination/`)
- Page navigation controls
- Shows current page, total pages
- First, previous, next, last buttons
- **Touch targets:** 44px+ ✅

✅ **PhotoUploader** (`src/components/molecules/PhotoUploader/`)
- Photo upload with preview
- Multiple photo support
- Drag and drop
- Preview thumbnails
- react-dropzone integration
- **Use this** for all photo uploads

✅ **SearchBar** (`src/components/molecules/SearchBar/`)
- Search input with icon
- Clear button
- Debounced onChange
- Usage: List search, global search

✅ **StatusCard** (`src/components/molecules/StatusCard/`)
- Status indicator card
- Shows status with color coding
- Count/number display
- Usage: Status summaries, workflow steps

✅ **TableView** (`src/components/molecules/TableView/`)
- Data table component
- Sortable columns
- Pagination integration
- @tanstack/react-table
- **Use this** for tabular data

✅ **UserMenu** (`src/components/molecules/UserMenu/`)
- User profile dropdown menu
- Profile, settings, logout options
- Avatar display
- Usage: Navigation bar

---

## 🟢 ORGANISMS (src/components/organisms/)

Complex, feature-rich components

✅ **DashboardGrid** (`src/components/organisms/DashboardGrid/`)
- Grid layout for dashboard cards
- Responsive columns
- Gap spacing
- Usage: Dashboard layouts, card collections

✅ **ForgotPasswordForm** (`src/components/organisms/ForgotPasswordForm/`)
- Password reset form
- Email input with validation
- Submit handling
- **Part of auth flow** - don't modify without approval

✅ **LoginForm** (`src/components/organisms/LoginForm/`)
- User login form
- Email/password inputs
- NextAuth integration
- **Part of auth flow** - don't modify without approval

✅ **MaterialTracker** (`src/components/organisms/MaterialTracker/`)
- Material management interface
- Lists materials by status
- Filter and search
- Usage: Bodega (warehouse) workflows

✅ **NavigationBar** (`src/components/organisms/NavigationBar.tsx`)
- Main app navigation
- Mobile responsive with hamburger menu
- User menu integration
- Active route highlighting
- **DO NOT modify** without approval

✅ **PhotoGallery** (`src/components/organisms/PhotoGallery/`)
- Photo grid with lightbox
- Full-screen preview
- Navigation between photos
- Usage: Work records, quality inspections

✅ **ProjectCard** (`src/components/organisms/ProjectCard/`)
- Project summary card
- Progress, status, dates
- Click to view details
- Usage: Project lists

✅ **QualityChecklist** (`src/components/organisms/QualityChecklist/`)
- Quality inspection form
- Checkbox items
- Pass/fail per item
- Overall status calculation
- Usage: Quality control workflows

✅ **RegisterForm** (`src/components/organisms/RegisterForm/`)
- User registration form
- Name, email, password, company, phone
- Validation with Zod
- **Part of auth flow** - don't modify without approval

✅ **ReportViewer** (`src/components/organisms/ReportViewer/`)
- Report display component
- Sections, charts, tables
- Print/export functionality
- Usage: Reports page

✅ **TaskRegistrationForm** (`src/components/organisms/TaskRegistrationForm/`)
- Task creation/edit form
- Title, description, assignee, due date
- Category, priority, building, unit fields
- Chilean construction categories
- **Good pattern** to follow for similar forms

✅ **TeamAssignment** (`src/components/organisms/TeamAssignment/`)
- Team member assignment interface
- Select team, assign workers
- Role assignment
- Usage: Team management workflows

---

## 📄 TEMPLATES (src/components/templates/)

Page layout templates

✅ **DashboardTemplate** (`src/components/templates/DashboardTemplate/`)
- Dashboard page layout
- Header, sidebar, content area
- Responsive grid areas
- **Use this** for dashboard-style pages

✅ **FormTemplate** (`src/components/templates/FormTemplate/`)
- Form page layout
- Centered form container
- Title, description, actions
- **Use this** for create/edit pages

✅ **ListTemplate** (`src/components/templates/ListTemplate/`)
- List view layout
- Search, filters, content list
- Pagination area
- **Use this** for list/index pages

✅ **MobileTemplate** (`src/components/templates/MobileTemplate/`)
- Mobile-optimized layout
- Bottom navigation
- Sticky header
- **Use this** for mobile-first pages

✅ **ReportTemplate** (`src/components/templates/ReportTemplate/`)
- Report page layout
- Header with export actions
- Content sections
- Print-friendly
- **Use this** for report pages

---

## 📱 PAGES (src/components/pages/)

Complete page components

✅ **Dashboard** (`src/components/pages/Dashboard/`)
- Main dashboard page component
- KPI cards, charts, recent activity
- Uses DashboardTemplate

✅ **MaterialsManagement** (`src/components/pages/MaterialsManagement/`)
- Materials tracking page
- Uses MaterialTracker organism
- List and filter materials

✅ **ProjectManagement** (`src/components/pages/ProjectManagement/`)
- Project list and management
- Create, view, edit projects
- Uses ProjectCard organisms

✅ **QualityControl** (`src/components/pages/QualityControl/`)
- Quality control interface
- Inspections, checklists
- Uses QualityChecklist organism

✅ **Reports** (`src/components/pages/Reports/`)
- Reports dashboard
- Various report types
- Uses ReportViewer organism

✅ **TaskManagement** (`src/components/pages/TaskManagement/`)
- Task list and management
- Create, assign, track tasks
- Uses TaskRegistrationForm

✅ **TeamManagement** (`src/components/pages/TeamManagement/`)
- Team creation and management
- Team member assignment
- Chilean construction roles

---

## 🔄 LAYOUTS (src/components/layouts/)

✅ **ProtectedLayout** (`src/components/layouts/ProtectedLayout.tsx`)
- Auth-protected page wrapper
- Redirects to login if not authenticated
- **Use this** for all protected pages

---

## 🎯 COMPOSITION PATTERNS

**When building new features:**

### Pattern 1: Extend Existing Atom
```typescript
// ❌ DON'T create new button variant from scratch
// ✅ DO extend existing Button atom

import { Button } from '@/components/atoms/Button';

export function IconButton({ icon, ...props }) {
  return <Button icon={icon} variant="ghost" {...props} />;
}
```

### Pattern 2: Compose New Molecule
```typescript
// ❌ DON'T recreate input with label
// ✅ DO use FormField molecule

import { FormField } from '@/components/molecules/FormField';

export function QuantityInput(props) {
  return (
    <FormField
      label="Cantidad Ejecutada"
      type="number"
      {...props}
    />
  );
}
```

### Pattern 3: Build New Organism from Existing
```typescript
// ❌ DON'T rebuild dashboard card from scratch
// ✅ DO compose from existing molecules

import { MetricDisplay } from '@/components/molecules/MetricDisplay';
import { ChartDisplay } from '@/components/molecules/ChartDisplay';
import { Card } from '@/components/atoms/Card';

export function BudgetTracker() {
  return (
    <Card>
      <MetricDisplay label="Presupuesto" value={budget} />
      <ChartDisplay type="line" data={budgetData} />
    </Card>
  );
}
```

---

## ✅ BEFORE CREATING ANYTHING

**Ask yourself:**

1. **Does it exist?** → Check this list
2. **Can I extend existing?** → Use props/composition
3. **Can I compose from atoms/molecules?** → Build from existing
4. **Is it truly unique?** → Only then create new

**When in doubt:** Ask in comments "Does anything like this exist?"

---

## 🚨 CRITICAL REMINDERS

- **DO NOT** recreate Button, Input, Icon, Loading, Typography
- **DO NOT** rebuild forms without using FormField
- **DO NOT** create new layouts without checking templates
- **DO** compose new features from existing components
- **DO** extend existing components via props
- **DO** ask before creating if unsure

This list saves time and ensures consistency! 🚀
