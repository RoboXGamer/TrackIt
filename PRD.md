# Project Tracker - Technical PRD

## Data Model & Database Architecture

### Database Schema

#### Tasks Table
```typescript
tasks: defineTable({
  // Core Fields
  userId: v.id("users"),          // Link to auth user
  title: v.string(),              // Task name
  description: v.optional(v.string()), // Optional details
  status: v.string(),             // "not_started", "in_progress", "completed"
  
  // Hierarchy & Ordering
  parentId: v.optional(v.id("tasks")), // For nested tasks
  order: v.number(),              // Position within siblings
  
  // Progress Tracking
  timeSpent: v.optional(v.number()),        // Milliseconds spent
  completionPercentage: v.optional(v.number()), // 0-100
  lastWorkedOn: v.optional(v.number()),     // Timestamp
  isExpanded: v.optional(v.boolean()),      // UI state
})
```

**Indexes:**
- `by_user`: `["userId"]` - Fetch all tasks for a user
- `by_parent`: `["parentId"]` - Fetch child tasks
- `by_parent_and_order`: `["parentId", "order"]` - Ordered child tasks

#### Pomodoro Sessions Table
```typescript
pomodoroSessions: defineTable({
  userId: v.id("users"),          // Link to auth user
  startTime: v.number(),          // Session start timestamp
  duration: v.number(),           // Session length (ms)
  taskId: v.optional(v.id("tasks")), // Associated task
  completed: v.boolean(),         // Session completion status
})
```

**Indexes:**
- `by_user`: `["userId"]` - Fetch user's sessions

### Authentication

Uses Convex Auth with:
- Username/password authentication
- User data stored in `users` table (part of `authTables`)
- User ID referenced in all tables for data ownership

## API Layer

### Task Management

#### Queries
- `tasks.list`: Fetch tasks by parent ID
  ```typescript
  args: {
    parentId: v.optional(v.id("tasks"))
  }
  ```
- `tasks.get`: Get single task by ID
  ```typescript
  args: {
    taskId: v.id("tasks")
  }
  ```

#### Mutations
- `tasks.create`: Create new task
  ```typescript
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("tasks")),
    type: v.string()
  }
  ```
- `tasks.updateProgress`: Update completion
  ```typescript
  args: {
    taskId: v.id("tasks"),
    completionPercentage: v.number()
  }
  ```
- `tasks.addTime`: Log time spent
  ```typescript
  args: {
    taskId: v.id("tasks"),
    duration: v.number()
  }
  ```

### Pomodoro Session Management

#### Mutations
- `pomodoroSessions.start`: Begin session
  ```typescript
  args: {
    taskId: v.optional(v.id("tasks"))
  }
  ```
- `pomodoroSessions.complete`: End session
  ```typescript
  args: {}
  ```

## Real-time Features

### Task Updates
- Live progress updates across clients
- Automatic parent task progress calculation
- Real-time time tracking

### Focus Timer
- Synchronized pomodoro sessions
- Automatic time logging
- Session completion tracking

## Data Relationships

### Task Hierarchy
- Tasks can have parent-child relationships
- Unlimited nesting depth
- Progress rolls up to parent tasks

### Time Tracking
- Individual task time tracking
- Pomodoro sessions linked to tasks
- Aggregated time calculations

## Security Model

### Access Control
- All queries/mutations verify user authentication
- Tasks accessible only to creating user
- Sessions tied to specific users

### Data Validation
- Schema-enforced data types
- Required vs optional fields
- Status value constraints

## Performance Considerations

### Indexes
- Optimized for common queries
- Support for hierarchical data
- Efficient ordering operations

### Limits
- Documents < 1MB
- Arrays < 8192 elements
- Query results < 8MB
- Transaction time < 1 second

## Future Extensibility

### Planned Features
- Task templates
- Recurring tasks
- Team sharing
- Advanced analytics

### Schema Evolution
- Optional fields for backward compatibility
- Extensible status types
- Flexible metadata support
