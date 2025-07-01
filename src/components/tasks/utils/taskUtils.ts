import {
  TASK_HIERARCHY,
  TASK_COMPLETION,
  TASK_LABELS,
} from "../constants/taskConstants";

/**
 * Utility functions for task-related operations
 */

/**
 * Calculate padding for task based on hierarchy level
 */
export function calculateTaskPadding(
  level: number,
  isTopLevel = false,
): number {
  const multiplier = isTopLevel
    ? TASK_HIERARCHY.TOP_LEVEL_PADDING_MULTIPLIER
    : TASK_HIERARCHY.LEVEL_PADDING_MULTIPLIER;
  return level * multiplier;
}

/**
 * Check if a task can be expanded based on current level
 */
export function canTaskExpand(level: number): boolean {
  return level < TASK_HIERARCHY.MAX_NESTING_LEVEL;
}

/**
 * Check if a task is completed
 */
export function isTaskCompleted(completionPercentage?: number): boolean {
  return (completionPercentage ?? 0) >= TASK_COMPLETION.COMPLETE_PERCENTAGE;
}

/**
 * Check if a task is at the top level
 */
export function isTopLevelTask(level: number): boolean {
  return level === TASK_HIERARCHY.TOP_LEVEL;
}

/**
 * Get task label based on whether it has a parent
 */
export function getTaskLabel(hasParent: boolean): {
  button: string;
  dialog: string;
} {
  return hasParent
    ? { button: TASK_LABELS.ADD_TOPIC, dialog: TASK_LABELS.ADD_TOPIC }
    : { button: TASK_LABELS.ADD_SUBJECT, dialog: TASK_LABELS.ADD_SUBJECT };
}

/**
 * Generate CSS classes for task expansion state
 */
export function getTaskExpansionClasses(canExpand: boolean): string {
  return canExpand
    ? "cursor-pointer hover:bg-gray-800/30 transition-all duration-200"
    : "transition-all duration-200";
}

/**
 * Check if an element is interactive (for click handling)
 */
export function isInteractiveElement(target: HTMLElement): boolean {
  return !!target.closest(
    'button, [role="button"], input, select, textarea, a',
  );
}
