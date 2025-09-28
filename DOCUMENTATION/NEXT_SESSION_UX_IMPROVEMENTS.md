# 🔧 DASHBOARD UX IMPROVEMENTS - QUICK FIXES
**Date:** September 28, 2025  
**Status:** Ready for Implementation  
**Priority:** Minor UX Polish

---

## 🎯 CURRENT ISSUE: Notification Positioning

**Observation**: Notifications are appearing in right panel instead of main dashboard area, potentially making KPIs less prominent.

**Current Behavior**:
- Smart notifications (Stock Crítico, No Conformidades, Productividad) showing in right sidebar
- Main dashboard area has space for KPI cards
- User reported notifications may be in "wrong place"

---

## 🔧 POTENTIAL SOLUTIONS

### Option 1: Move Notifications to Main Dashboard
**Approach**: Display notifications as prominent cards in main KPI grid
**Pros**: More visible, integrated with main content flow
**Cons**: Might clutter KPI display

### Option 2: Add KPI Cards to Main Area
**Approach**: Keep notifications in sidebar, add actual KPI metric cards to main dashboard
**Pros**: Clean separation of alerts vs metrics
**Cons**: Requires component layout adjustment

### Option 3: Hybrid Layout
**Approach**: Top-priority alerts in main area, secondary notifications in sidebar
**Pros**: Best of both worlds
**Cons**: More complex logic needed

---

## 📍 FILES TO INVESTIGATE

### Main Dashboard Component
```
/src/components/pages/Dashboard/Dashboard.tsx
- Lines 650-800: Main content rendering logic
- Look for notification vs KPI card rendering decisions
```

### Dashboard Page Layout
```
/src/app/dashboard/page.tsx
- Role-based KPI generation (kpisPersonalizados)
- Check if KPIs are being passed to dashboard component correctly
```

### Template Components
```
/src/components/templates/DashboardTemplate.tsx
/src/components/templates/MobileTemplate.tsx
- Main layout structure and widget positioning
```

---

## 🎯 NEXT SESSION ACTIONS

1. **Inspect Current Layout**: Determine where KPI cards should be displaying
2. **Component Analysis**: Check if notifications are overriding KPI display
3. **Quick Fix**: Adjust layout to show both KPIs and notifications appropriately
4. **User Testing**: Verify improved layout with admin role

---

**Session Goal**: Ensure dashboard prominently displays both real-time KPIs AND smart notifications in user-friendly layout.

**Time Estimate**: 15-30 minutes for layout adjustment.
