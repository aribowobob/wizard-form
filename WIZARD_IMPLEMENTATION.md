# Wizard Form Implementation

## Overview

A 2-step role-based wizard form for employee data entry with draft persistence.

## Features Implemented

### 1. Role-Based Access

- **Admin Role**: Access to Step 1 (Basic Info) + Step 2 (Details)
- **Ops Role**: Access to Step 2 (Details) only
- Access via query parameters:
  - Admin: `/wizard?role=admin` (default)
  - Ops: `/wizard?role=ops`

### 2. Step 1 - Basic Info (Admin Only)

Fields:

- **Full Name**: Text input with validation
- **Email**: Email input with inline validation
- **Department**: Combobox with autocomplete (empty options for now)
- **Employee ID**: Text input with validation
- **Next Button**: Enabled when form is valid, saves to localStorage on click

### 3. Step 2 - Details & Submit

Fields:

- **Photo**: File input with base64 preview
- **Employment Type**: Select dropdown (Full Time, Part Time, Contract, Intern)
- **Office Location**: Combobox with autocomplete (empty options for now)
- **Notes**: Textarea for additional notes
- **Submit Button**: Submits form and redirects to list page
- **Back Button**: Shows for Admin role only

### 4. Draft Persistence

- Auto-saves every 2 seconds of inactivity (debounced)
- Separate localStorage keys per role:
  - `draft_admin`: For admin role
  - `draft_ops`: For ops role
- Draft restored automatically on page reload
- "Clear Draft" button shown when draft exists for current role

### 5. Form Validation

- Uses React Hook Form with Zod schema validation
- Inline validation for all fields
- Email format validation
- Required field validation

### 6. Submit Flow

On submit, the wizard:

1. POST to `/basicInfo` endpoint (http://localhost:4001/employees)
2. POST to `/details` endpoint (http://localhost:4002/employeeDetails)
3. Clears relevant localStorage draft
4. Invalidates React Query cache for basicInfo and details
5. Navigates to employee list page (/)
6. Triggers data refetch

## Technical Stack

- **Form Management**: React Hook Form
- **Validation**: Zod
- **UI Components**: shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **Framework**: Next.js 16 (App Router)

## File Structure

```
components/
  ui/
    combobox.tsx          # Reusable combobox component
    form.tsx              # Form components from shadcn
    input.tsx             # Input component
    select.tsx            # Select component
    textarea.tsx          # Textarea component
    button.tsx            # Button component
  wizard/
    Step1.tsx             # Basic Info form component
    Step2.tsx             # Details form component

lib/
  hooks/
    useDraftPersistence.ts  # Draft auto-save & restore logic
    useSubmitWizard.ts      # Submit mutation hook
    useQueryDepartments.ts  # Fetch departments
    useQueryLocations.ts    # Fetch locations
  fetchers/
    postBasicInfo.ts        # POST basic info
    postDetails.ts          # POST details

app/
  wizard/
    page.tsx              # Main wizard page orchestrator
```

## Usage

### Development

1. Start the dev server and mock API:

   ```bash
   yarn dev:all
   ```

2. Access the wizard:
   - Admin: http://localhost:3000/wizard or http://localhost:3000/wizard?role=admin
   - Ops: http://localhost:3000/wizard?role=ops

### Testing Draft Persistence

1. Fill out the form fields
2. Wait 2 seconds for auto-save
3. Refresh the page
4. Form data should be restored
5. Click "Clear Draft" to remove saved data

### Testing Role-Based Access

1. Visit `/wizard?role=admin` - should see Step 1
2. Fill Step 1 and click Next
3. Should see Step 2 with Back button
4. Visit `/wizard?role=ops` - should see Step 2 only (no Back button)

## API Endpoints

- **Basic Info**: POST http://localhost:4001/employees
- **Details**: POST http://localhost:4002/employeeDetails
- **Departments**: GET http://localhost:4001/departments
- **Locations**: GET http://localhost:4002/locations

## Notes

- Departments and Locations comboboxes show empty lists by default (as requested)
- Photo is stored as base64 string
- Form validation is handled by Zod schemas
- Draft persistence is localized in custom hooks
- Submit flow uses React Query mutations for proper cache invalidation
