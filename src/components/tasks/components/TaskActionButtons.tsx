import { Task } from "../../types/Task";
import {
  TaskActions,
  TaskCompleteButton,
  TaskPlayButton,
} from "@/components/tasks";

interface TaskActionButtonsProps {
  task: Task;
  level: number;
  showDelete?: boolean;
  onPlay?: (task: Task) => void;
  className?: string;
}

/**
 * Reusable component for task action buttons
 * Consolidates the action button layout used in TopLevelTask and SubTask
 */
export function TaskActionButtons({
  task,
  level,
  showDelete = true,
  onPlay,
  className = "",
}: TaskActionButtonsProps) {
  return (
    <div className={`grid grid-flow-col place-items-center gap-2 ${className}`}>
      <TaskActions task={task} showDelete={showDelete} />
      <TaskCompleteButton task={task} level={level} />
      <TaskPlayButton task={task} onPlay={onPlay} />
    </div>
  );
}
