import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Task } from "../types/Task";
import { TaskList, CreateTaskButton, useAdminMode } from "@/components";
import {
  calculateTaskPadding,
  canTaskExpand,
  TASK_HIERARCHY,
} from "@/components/tasks";
import { Id } from "../../../convex/_generated/dataModel";

interface SubTaskContainerProps {
  parentTask: Task;
  level: number;
  isExpanded: boolean;
  projectId: Id<"projects"> | null;
}

function SubTaskContainer({
  parentTask,
  level,
  isExpanded,
  projectId,
}: SubTaskContainerProps) {
  const subtasks = useQuery(api.tasks.listTasks, {
    parentId: parentTask._id,
    projectId: projectId || undefined,
  });
  const { mode } = useAdminMode();

  const nextLevel = level + 1;
  const canShowCreateButton = canTaskExpand(level);
  const hierarchyLinePosition = calculateTaskPadding(nextLevel);
  const createButtonMargin = calculateTaskPadding(nextLevel);
  if (!isExpanded || (subtasks?.length === 0 && !canShowCreateButton)) {
    return null;
  }

  return (
    <div className="relative">
      {level !== TASK_HIERARCHY.TOP_LEVEL && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-border"
          style={{ left: `${hierarchyLinePosition}rem` }}
        />
      )}

      <TaskList tasks={subtasks} level={nextLevel} projectId={projectId} />

      {/* Only show CreateTaskButton if we're not at the maximum nesting level */}
      {canShowCreateButton && mode === "ON" && (
        <div
          style={{ marginLeft: `${createButtonMargin}rem` }}
          className="py-2 px-4 relative"
        >
          <CreateTaskButton parentId={parentTask._id} projectId={projectId} />
        </div>
      )}
    </div>
  );
}

export default SubTaskContainer;
