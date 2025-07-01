/**
 * Task-related constants to avoid magic numbers and hard-coded values
 */

// Hierarchy and nesting
export const TASK_HIERARCHY = {
  MAX_NESTING_LEVEL: 5,
  TOP_LEVEL: 0,
  LEVEL_PADDING_MULTIPLIER: 1,
  TOP_LEVEL_PADDING_MULTIPLIER: 1.5,
} as const;

// Task completion
export const TASK_COMPLETION = {
  COMPLETE_PERCENTAGE: 100,
  INCOMPLETE_PERCENTAGE: 0,
} as const;

// UI Constants
export const TASK_UI = {
  INTERACTIVE_ELEMENTS_SELECTOR:
    'button, [role="button"], input, select, textarea, a',
  TRANSITION_DURATION: "duration-200",
} as const;

// Task labels and text
export const TASK_LABELS = {
  ADD_SUBJECT: "Add New Subject",
  ADD_TOPIC: "Add New Topic",
  CREATE_TASK: "Create Task",
  EDIT_TASK: "Edit Task",
  DELETE_TASK: "Delete Task",
  COMPLETE_TASK: "Complete this task",
  TASK_COMPLETED: "Task completed",
} as const;

// Error messages
export const TASK_ERRORS = {
  TITLE_REQUIRED: "Title is required",
  UPDATE_FAILED: "Failed to update task",
  DELETE_FAILED: "Failed to delete task",
  CREATE_FAILED: "Failed to create task",
  COMPLETE_FAILED: "Failed to complete task",
} as const;
