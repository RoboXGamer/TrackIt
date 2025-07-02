import { Task } from "../types/Task";
import {
  TaskProgressCircle,
  TaskTimeDisplay,
  SubTaskContainer,
} from "@/components";
import {
  TaskActionButtons,
  useTaskExpansion,
} from "@/components/tasks";
import { href, useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { useProject } from "@/components/providers/ProjectProvider";

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
  const { selectedProjectId } = useProject();

  const handlePlayTask = (task: Task) => {
    navigate(href("/tasks/:id", { id: task._id }));
  };

  return (
    <Card className="py-0 gap-0">
      <CardContent
        className="hover:bg-slate-800/30 transition-all duration-200 cursor-pointer py-6"
        onClick={(e) => handleClick(e)}
      >
        <div className="flex items-center">
          <div className="flex items-center gap-4 flex-1">
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

          <TaskActionButtons
            task={task}
            level={level}
            showDelete={false}
            onPlay={handlePlayTask}
          />
        </div>
      </CardContent>
      <SubTaskContainer
        parentTask={task}
        level={level}
        isExpanded={isExpanded}
        projectId={selectedProjectId}
      />
    </Card>
  );
}

export default TopLevelTask;
