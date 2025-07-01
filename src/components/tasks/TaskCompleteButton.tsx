import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Task } from "../types/Task";
import { Check, Loader2 } from "lucide-react";
import {
  isTopLevelTask,
  isTaskCompleted,
  TASK_ERRORS,
  TASK_LABELS,
} from "@/components/tasks";

interface TaskCompleteButtonProps {
  task: Task;
  level: number;
  className?: string;
}

function TaskCompleteButton({
  task,
  level,
  className = "",
}: TaskCompleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeTask = useMutation(api.tasks.completeTask);

  // Don't show button for top-level tasks
  if (isTopLevelTask(level)) {
    return null;
  }

  const isCompleted = isTaskCompleted(task.completionPercentage);
  const canClick = !isLoading;

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events

    // Don't allow clicking if task is completed or not a leaf task
    if (!canClick) return;

    setIsLoading(true);
    setError(null);

    try {
      await completeTask({ taskId: task._id });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : TASK_ERRORS.COMPLETE_FAILED,
      );
      console.error("Error completing task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine button styling based on completion status
  const buttonStyles = isCompleted
    ? "bg-green-600 text-white" // Completed: filled green
    : "border border-green-600 bg-transparent text-green-600 hover:bg-green-600/10"; // Incomplete: outline

  // Determine title text
  const getTitle = () => {
    if (error) return error;
    if (isCompleted) return TASK_LABELS.TASK_COMPLETED;
    return TASK_LABELS.COMPLETE_TASK;
  };

  return (
    <button
      onClick={handleComplete}
      disabled={!canClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed ${buttonStyles} ${className}`}
      title={getTitle()}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>{isCompleted ? <Check className="w-4 h-4" /> : null}</>
      )}
    </button>
  );
}

export default TaskCompleteButton;
