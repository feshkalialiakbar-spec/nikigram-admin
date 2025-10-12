# Skeleton Loading Components

A comprehensive set of skeleton loading components for better user experience during data loading states.

## Components

### 1. Base Skeleton Component

A flexible skeleton component that can be customized for different use cases.

```tsx
import { Skeleton } from '@/components/ui';

// Basic usage
<Skeleton width="100%" height="20px" />

// Circular skeleton
<Skeleton width={50} height={50} variant="circular" />

// Custom styling
<Skeleton 
  width="200px" 
  height="40px" 
  borderRadius="20px"
  animation="wave"
/>
```

**Props:**
- `width?: string | number` - Width of the skeleton
- `height?: string | number` - Height of the skeleton
- `borderRadius?: string | number` - Border radius
- `className?: string` - Additional CSS classes
- `variant?: 'text' | 'rectangular' | 'circular'` - Skeleton shape
- `animation?: 'pulse' | 'wave' | 'none'` - Animation type

### 2. Sidebar Skeleton

Pre-built skeleton for sidebar navigation components.

```tsx
import { SidebarSkeleton } from '@/components/ui';

<SidebarSkeleton className="my-sidebar-skeleton" />
```

**Features:**
- Logo area skeleton
- Navigation items with icons
- User profile section
- Responsive design
- RTL support

### 3. Task Table Skeleton

Complete skeleton for task table with filters and pagination.

```tsx
import { TaskTableSkeleton } from '@/components/ui';

<TaskTableSkeleton rows={8} className="my-table-skeleton" />
```

**Props:**
- `rows?: number` - Number of skeleton rows (default: 5)
- `className?: string` - Additional CSS classes

**Features:**
- Filter bar skeleton
- Table header skeleton
- Multiple table rows
- Avatar group skeletons
- Pagination skeleton
- Responsive grid layout

## Custom Hook

### useSkeletonLoading

A hook to manage skeleton loading with minimum display time to prevent flickering.

```tsx
import { useSkeletonLoading } from '@/components/tasks';

const MyComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const showSkeleton = useSkeletonLoading({ 
    isLoading, 
    minDisplayTime: 500 
  });

  return (
    <div>
      {showSkeleton ? (
        <Skeleton width="100%" height="200px" />
      ) : (
        <div>Actual content</div>
      )}
    </div>
  );
};
```

**Options:**
- `isLoading: boolean` - Current loading state
- `minDisplayTime?: number` - Minimum time to show skeleton (default: 500ms)

## Integration Examples

### With Task Dashboard

```tsx
import { TaskDashboard, TaskTableSkeleton } from '@/components/tasks';

const TaskPage = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      {loading ? (
        <TaskTableSkeleton rows={8} />
      ) : (
        <TaskDashboard />
      )}
    </div>
  );
};
```

### With Sidebar

```tsx
import { SidebarMenu, SidebarSkeleton } from '@/components/hub/SideBar';

const Layout = () => {
  const [sidebarLoading, setSidebarLoading] = useState(true);

  return (
    <SidebarMenu 
      isOpen={true}
      loading={sidebarLoading}
      onClose={() => {}}
    />
  );
};
```

## Styling

### CSS Variables

The skeleton components use CSS variables for theming:

```css
:root {
  --skeleton-bg: #f0f0f0;
  --skeleton-highlight: #e0e0e0;
}

[data-theme="dark"] {
  --skeleton-bg: #2a2a2a;
  --skeleton-highlight: #3a3a3a;
}
```

### Custom Animations

You can customize animations by overriding CSS:

```css
.my-skeleton {
  animation: my-custom-animation 2s infinite;
}

@keyframes my-custom-animation {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
```

## Accessibility

- All skeleton components include `aria-hidden="true"` to hide from screen readers
- Proper semantic structure maintained
- Reduced motion support for users with motion sensitivity
- High contrast support

## Performance

- Optimized animations using CSS transforms
- Minimal JavaScript overhead
- Efficient re-rendering with React.memo
- Lazy loading support

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ with polyfills
- Mobile browsers
- RTL language support

## Best Practices

1. **Minimum Display Time**: Use `useSkeletonLoading` to prevent flickering
2. **Consistent Sizing**: Match skeleton dimensions to actual content
3. **Progressive Loading**: Show skeletons for different sections independently
4. **Error States**: Always provide fallback for loading failures
5. **Accessibility**: Ensure skeletons don't interfere with screen readers

## Examples

See `SkeletonDemo` component for interactive examples of all skeleton components.

