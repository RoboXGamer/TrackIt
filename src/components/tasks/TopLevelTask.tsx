import { Task } from "../types/Task";
import {
  TaskProgressCircle,
  TaskTimeDisplay,
  SubTaskContainer,
} from "@/components";
import {
  TaskActionButtons,
  useTaskExpansion,
  calculateTaskPadding,
} from "@/components/tasks";
import { href, useNavigate } from "react-router";

interface TopLevelTaskProps {
  task: Task;
  level: number;
}

/**
 * REFACTORED TopLevelTask component
 * - Uses custom hooks for shared logic
 * - Uses utility functions for calculations
 * - Uses reusable components for action buttons
 * - Cleaner, more maintainable code
 */
function TopLevelTask({ task, level }: TopLevelTaskProps) {
  const navigate = useNavigate();
  const { isExpanded, handleClick } = useTaskExpansion();
  const paddingLeft = calculateTaskPadding(level, true);

  const handlePlayTask = (task: Task) => {
    navigate(href("/tasks/:id", { id: task._id }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg border-2">
      <div
        className="w-full px-4 py-3 hover:bg-gray-800/30 transition-all duration-200 cursor-pointer relative bg-slate-900"
        style={{ marginLeft: `${paddingLeft}rem` }}
        onClick={(e) => handleClick(e)}
      >
        <div className="flex items-center">
          <div className="flex items-center gap-4 flex-1 pr-24">
            <TaskProgressCircle
              taskId={task._id}
              completionPercentage={task.completionPercentage ?? 0}
              size="lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{task.title}</h3>
              <TaskTimeDisplay
                timeSpent={task.timeSpent}
                className="text-sm text-gray-400"
              />
            </div>
          </div>

          <div className="absolute right-4">
            <TaskActionButtons
              task={task}
              level={level}
              showDelete={false}
              onPlay={handlePlayTask}
            />
          </div>
        </div>
      </div>

      <SubTaskContainer
        parentTask={task}
        level={level}
        isExpanded={isExpanded}
      />
    </div>
  );
}

export default TopLevelTask;
