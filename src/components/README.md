# Components Directory Structure

This directory contains all the React components for the TrackIt application, organized by feature and responsibility.

## Directory Structure

```
src/components/
├── auth/                 # Authentication-related components
├── tasks/                # Task management components
├── progress/             # Progress tracking and visualization
├── timer/                # Timer and time tracking components
├── admin/                # Admin mode and settings
├── providers/            # React context providers
├── types/                # TypeScript type definitions
├── ui/                   # shadcn/ui components (DO NOT MODIFY)
└── index.ts              # Main component exports
```

## Component Categories

### Authentication (`/auth`)
- **SignInForm**: User authentication form with email/password and anonymous login
- **SignOutButton**: Sign out functionality for authenticated users

### Task Management (`/tasks`)
- **TaskList**: Renders a list of tasks at any level
- **TaskRouter**: Routes between TopLevelTask and SubTask based on hierarchy level
- **TopLevelTask**: Displays top-level tasks with navigation to detail view
- **SubTask**: Displays nested subtasks with progress bars
- **SubTaskContainer**: Container for managing subtask hierarchy and nesting
- **TaskActions**: Edit and delete task functionality (admin mode only)
- **TaskCompleteButton**: Mark tasks as complete (subtasks only)
- **TaskTimeDisplay**: Formatted display of time spent on tasks
- **CreateTaskButton**: Create new tasks and subtasks (admin mode only)

### Progress Tracking (`/progress`)
- **TaskProgressCircle**: Circular progress indicator with admin editing capabilities
- **ProgressDashboard**: Overall progress metrics (unused, planned for future)

### Timer (`/timer`)
- **PomodoroTimer**: Full-featured pomodoro timer with settings and session tracking
- **TaskPlayButton**: Simple play button for starting task timers

### Admin (`/admin`)
- **AdminModeToggle**: Toggle between admin and user modes

### Providers (`/providers`)
- **AdminModeProvider**: Context provider for admin mode state management

### Types (`/types`)
- **Task**: TypeScript interface for task objects

## Import Patterns

### Recommended Import Methods

```typescript
// Method 1: Direct imports (most explicit)
import TaskList from '@/components/tasks/TaskList';
import { AdminModeProvider } from '@/components/providers/AdminModeProvider';

// Method 2: Category-level imports
import { TaskList, CreateTaskButton } from '@/components/tasks';
import { SignInForm, SignOutButton } from '@/components/auth';

// Method 3: Main index imports (for commonly used components)
import { TaskList, TaskProgressCircle, AdminModeToggle } from '@/components';
```

## Component Naming Conventions

- **PascalCase** for all component files and function names
- **Descriptive prefixes** for related components (e.g., `Task*`, `Admin*`)
- **Action-based naming** for interactive components (e.g., `CreateTaskButton`, `TaskCompleteButton`)
- **Clear responsibility** indicated in names (e.g., `TaskRouter` vs generic `TaskItem`)

## Architecture Principles

### Separation of Concerns
- **Authentication**: Isolated in `/auth` directory
- **Business Logic**: Task management in `/tasks` directory  
- **UI State**: Admin mode and theme providers in `/providers`
- **Visualization**: Progress and timer components separated

### Component Responsibilities
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Components compose smaller components
- **Props Interface**: Clear, typed interfaces for all components
- **Context Usage**: Minimal, focused context providers

### File Organization
- **Feature-based**: Components grouped by domain/feature
- **Flat within categories**: No deep nesting within feature directories
- **Index files**: Clean exports for each category
- **Type co-location**: Types near the components that use them

## Best Practices

### When Adding New Components

1. **Determine the category** (auth, tasks, progress, timer, admin)
2. **Use descriptive naming** that indicates purpose and scope
3. **Add to appropriate index.ts** file for clean imports
4. **Follow existing patterns** for props interfaces and exports
5. **Update this README** if adding new categories

### Component Guidelines

- **Keep components focused** on a single responsibility
- **Use TypeScript interfaces** for all props
- **Export as default** from component files
- **Use named exports** in index files
- **Document complex components** with JSDoc comments

## Dependencies

- **UI Components**: All UI primitives come from `/ui` (shadcn/ui)
- **State Management**: React hooks and context providers
- **Data Fetching**: Convex React hooks
- **Routing**: React Router for navigation
- **Icons**: Lucide React icon library

## Future Improvements

- **Component Testing**: Add unit tests for each component
- **Storybook**: Component documentation and testing
- **Performance**: Lazy loading for large components
- **Accessibility**: Enhanced ARIA support
- **Internationalization**: Multi-language support structure
