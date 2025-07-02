import { useAdminMode } from "@/components/providers/AdminModeProvider";
import { Task } from "../types/Task";
import { TaskEditDialog, TaskDeleteDialog } from "@/components/tasks";

interface TaskActionsProps {
  task: Task;
  showDelete: boolean;
}

/**
 * REFACTORED TaskActions component
 * - Split into focused, single-responsibility components
 * - Much smaller and easier to maintain
 * - Better separation of concerns
 * - Reusable dialog components
 */
function TaskActions({ task, showDelete }: TaskActionsProps) {
  const { mode } = useAdminMode();

  if (mode === "OFF") return null;

  return (
    <div className="flex gap-1">
      <TaskEditDialog task={task} />

      {showDelete && <TaskDeleteDialog task={task} />}
    </div>
  );
}

export default TaskActions;
