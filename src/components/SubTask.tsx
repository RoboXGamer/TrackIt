import { useState } from "react";
import { Task } from "./types/Task";
import TaskActions from "./TaskActions";
import SubTaskContainer from "./SubTaskContainer";
import TaskCompleteButton from "./TaskCompleteButton";
import PlayButton from "./PlayButton";
import { Progress } from "@/components/ui/progress";

interface SubTaskProps {
  task: Task;
  level: number;
}

function SubTask({ task, level }: SubTaskProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubTaskClick = (e: React.MouseEvent) => {
    // Don't allow expansion at level 5 (maximum nesting)
    if (level >= 5) return;

    // Prevent expansion when clicking on interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest('button, [role="button"], input, select, textarea, a');

    if (!isInteractiveElement) {
      setIsExpanded(!isExpanded);
    }
  };

  // Determine if this subtask can be expanded (not at max level)
  const canExpand = level < 5;

  return (
    <>
      <div
        className={`relative w-full ${
          canExpand ? 'cursor-pointer hover:bg-gray-800/30' : ''
        } transition-all duration-200`}
        style={{ paddingLeft: `${level * 1}rem` }}
        onClick={canExpand ? handleSubTaskClick : undefined}
      >
        <div className="py-3 px-4 relative flex gap-4">
          <div className="flex-1">
            {/* Task Title */}
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-white">{task.title}</span>
            </div>
            {/* Progress Bar */}
            <div className="flex items-center gap-3 w-full">
              <Progress
                value={task.completionPercentage ?? 0}
                className="h-2 flex-1"
              />
              <span className="text-xs text-gray-400 text-right">
                {(task.completionPercentage ?? 0).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Fixed position action buttons */}
          <div className="flex items-end gap-2">
            <TaskActions task={task} showDelete={true} />
            <TaskCompleteButton task={task} level={level} />
            <PlayButton task={task} />
          </div>
        </div>
      </div>

      {/* Expanded Content - Nested Subtasks (only if under level 5) */}
      {level < 5 && (
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
