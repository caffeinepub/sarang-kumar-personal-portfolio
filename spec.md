# SK Web Solutions – Admin Dashboard Redesign

## Current State
The admin dashboard (`src/frontend/src/pages/AdminDashboard.tsx`) is a tab-based layout with 6 tabs: Overview, Listings, Packages, Inquiries, Activity, Users. The Overview tab shows 4 plain KPI stat cards and a single activity events count. There are no charts, no visual graphs, and no data visualizations. The Activity tab has a raw log table. The design is functional but not visually insightful or easy to scan at a glance.

## Requested Changes (Diff)

### Add
- **Visual KPI cards** in Overview: Total Visitors, Total Inquiries, Quote Submissions, Active Listings — with trend indicators and icons
- **Bar chart** (monthly inquiries) using shadcn/recharts Chart component already in the UI library
- **Line chart** (visitor trends over time) using shadcn/recharts Chart component
- **Donut/pie chart** — service type breakdown (Web Dev, Interior Design, E-commerce, etc.) from inquiry data
- **Recent Inquiries mini-panel** in Overview (last 5, with status badges and reply buttons)
- **Activity feed timeline** in Overview — last 10 events in a vertical timeline with icons per event type (login, visit, search, inquiry)
- **Top Search Terms bar** in Overview showing search terms with visual progress bars
- **Summary stats row** at top of each tab for context (e.g., Inquiries tab shows "X new this week")

### Modify
- **Overview tab** — completely rebuild into a rich dashboard layout:
  - Row 1: 4 KPI stat cards with icons and color accents
  - Row 2: Bar chart (inquiries by month) + Donut chart (service breakdown)
  - Row 3: Line chart (visitor trends) spanning full width
  - Row 4: Recent inquiries (last 5) + Activity feed (last 10) side by side
  - Row 5: Top search terms with progress bars
- **Activity tab** — add visual timeline on left alongside the raw table, event type color-coded icons
- **Inquiries tab** — add a summary banner at the top (total, new, in-progress, completed counts)

### Remove
- Nothing removed — all existing functionality (CRUD for listings, inquiry status updates, reply buttons) stays intact

## Implementation Plan
1. Rebuild the Overview tab in `AdminDashboard.tsx` with the rich multi-section layout described above
2. Use the existing `chart.tsx` shadcn component (which wraps recharts) for bar, line, and donut charts
3. Derive chart data from existing query results: inquiries → monthly bar chart, activity log → visitor line, inquiry service types → donut
4. Add a `RecentInquiriesPanel` inline component rendering last 5 inquiries with status and reply buttons
5. Add `ActivityTimeline` inline component with color-coded event icons and timestamps
6. Add `TopSearchTermsPanel` with progress bars based on max count
7. Add summary banner to Inquiries tab showing new/in-progress/completed counts
8. Add visual timeline view to Activity tab
9. Validate: typecheck, lint, build
