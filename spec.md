# SK Web Solutions

## Current State
The site requires clients to log in via Internet Identity to access the portal tab. The navbar shows a Login button and conditionally shows Admin/Portal tabs. There is no anonymous visitor tracking.

## Requested Changes (Diff)

### Add
- Anonymous page visit tracking on every page load
- Visitors KPI card in admin Activity tab showing total visits and recent visits table
- Hidden admin login link in footer

### Modify
- Remove Login button from public navbar
- Remove Portal tab from public nav (clients see landing, marketplace, services, quote, contact freely)
- Admin tab only shows when logged in as admin (unchanged)
- Log visit on page load and page changes

### Remove
- Login button in BusinessHeader
- Login-required gate on the portal page

## Implementation Plan
1. Modify BusinessHeader: remove Login button and Portal tab
2. Add useEffect to log anonymous visit on activePage change
3. Add Visitors KPI + recent visits table in admin Activity tab
4. Add small Admin Login link in BusinessFooter
