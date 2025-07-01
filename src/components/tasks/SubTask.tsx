import { useState } from "react";
import { Task } from "../types/Task";
import {
  SubTaskContainer,
  TaskActions,
  TaskCompleteButton,
} from "@/components/tasks";
import {
  calculateTaskPadding,
  isInteractiveElement,
  canTaskExpand,
} from "@/components/tasks";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface SubTaskProps {
  task: Task;
  level: number;
}

function SubTask({ task, level }: SubTaskProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubTaskClick = (e: React.MouseEvent) => {
    // Don't allow expansion at maximum nesting level
    if (!canTaskExpand(level)) return;

    // Prevent expansion when clicking on interactive elements
    const target = e.target as HTMLElement;
    if (!isInteractiveElement(target)) {
      setIsExpanded(!isExpanded);
    }
  };

  // Determine if this subtask can be expanded (not at max level)
  const canExpand = canTaskExpand(level);
  const paddingLeft = calculateTaskPadding(level);

  return (
    <>
      <div
        className={`relative w-full ${
          canExpand ? "cursor-pointer hover:bg-gray-800/30" : ""
        } transition-all duration-200`}
        style={{ paddingLeft: `${paddingLeft}rem` }}
        onClick={canExpand ? handleSubTaskClick : undefined}
      >
        <div
          className={`flex py-3 px-4 rounded-lg transition-all duration-200 hover:bg-blue-500/5 flex-col`}
        >
          <div className="flex items-center space-x-3">
            {level !== 1 ? (
              <>
                <TaskCompleteButton task={task} level={level} />
              </>
            ) : null}

            <span
              className={cn(
                "font-medium transition-all",
                task.completionPercentage === 100 && level !== 1
                  ? "text-gray-400 line-through"
                  : "text-gray-200",
                level === 1 ? "text-md font-bold" : "text-sm",
              )}
            >
              {task.title}
            </span>
            <div className="flex items-end gap-2">
              <TaskActions task={task} showDelete={true} />
            </div>
          </div>
          {/* Progress Bar */}
          {level === 1 && (
            <div className="flex items-center gap-3 w-full">
              <Progress
                value={task.completionPercentage ?? 0}
                className="h-2 flex-1"
              />
              <span className="text-xs text-gray-400 text-right">
                {(task.completionPercentage ?? 0).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content - Nested Subtasks (only if can expand) */}
      {canExpand && (
        <SubTaskContainer
          parentTask={task}
          level={level}
          isExpanded={isExpanded}
        />
      )}
    </>
  );
}

export default SubTask;
