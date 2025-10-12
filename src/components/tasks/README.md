# Tasks Components

This directory contains a modular, well-structured set of React components for managing tasks in the Next.js application.

## Structure

```
src/components/tasks/
├── types/
│   └── index.ts          # TypeScript interfaces and types
├── hooks/
│   └── index.ts          # Custom React hooks
├── utils/
│   └── index.ts          # Utility functions and constants
├── TaskDashboard.tsx     # Main dashboard component
├── TaskTable.tsx         # Table component for displaying tasks
├── FilterBar.tsx         # Filtering component
├── Pagination.tsx        # Pagination component
├── index.ts              # Main exports
└── *.module.scss         # Component styles
```

## Features

### ✅ TypeScript Support
- Fully typed components with proper interfaces
- No `any` types used
- Strict type checking enabled

### ✅ Next.js Best Practices
- Client-side components properly marked with `'use client'`
- Optimized imports and exports
- Proper component structure

### ✅ Performance Optimizations
- React.memo and useCallback for preventing unnecessary re-renders
- useMemo for expensive calculations
- Lazy loading for images

### ✅ Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

### ✅ Error Handling
- Loading states
- Error boundaries
- Retry mechanisms

### ✅ Responsive Design
- Mobile-first approach
- Flexible layouts
- Touch-friendly interactions

## Usage

```tsx
import { TaskDashboard } from '@/components/tasks';

// Basic usage
<TaskDashboard />

// With custom className
<TaskDashboard className="my-custom-class" />
```

## Components

### TaskDashboard
Main container component that orchestrates all task-related functionality.

**Props:**
- `className?: string` - Optional CSS class

### TaskTable
Displays tasks in a table format with sorting and action capabilities.

**Props:**
- `tasks: Task[]` - Array of tasks to display
- `onOperationClick: (taskId: string, operation: string) => void` - Callback for operation clicks
- `className?: string` - Optional CSS class

### FilterBar
Provides filtering capabilities for tasks.

**Props:**
- `filters: FilterOptions` - Current filter values
- `onFilterChange: (filters: FilterOptions) => void` - Callback for filter changes
- `className?: string` - Optional CSS class

### Pagination
Handles pagination for large task lists.

**Props:**
- `pagination: PaginationInfo` - Pagination information
- `onPageChange: (page: number) => void` - Callback for page changes
- `className?: string` - Optional CSS class

## Hooks

### useTasks
Manages task data fetching and state.

```tsx
const { tasks, loading, error, refetch } = useTasks();
```

### useTaskFilters
Handles filtering logic and state.

```tsx
const { filters, filteredTasks, updateFilters, resetFilters } = useTaskFilters(tasks, initialFilters);
```

### useTaskPagination
Manages pagination logic and state.

```tsx
const { currentPage, totalPages, paginatedTasks, goToPage } = useTaskPagination(filteredTasks);
```

## Types

All types are exported from `./types/index.ts`:

- `Task` - Main task interface
- `TaskStatus` - Task status union type
- `FilterOptions` - Filter configuration
- `PaginationInfo` - Pagination data
- Component prop interfaces

## Styling

Components use CSS Modules with SCSS for styling. All styles are scoped to prevent conflicts.

## Error Handling

The components include comprehensive error handling:
- Loading states with user feedback
- Error states with retry options
- Graceful degradation for missing data

## Performance

- Memoized calculations and callbacks
- Optimized re-rendering
- Lazy loading for images
- Efficient filtering and pagination

