import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Task } from "./types/Task";
import TaskList from "./TaskList";
import NewTaskButton from "./NewTaskButton";
import { useAdminMode } from "./admin-mode-provider";

interface SubTaskContainerProps {
  parentTask: Task;
  level: number;
  isExpanded: boolean;
}

function SubTaskContainer({
  parentTask,
  level,
  isExpanded,
}: SubTaskContainerProps) {
  const subtasks = useQuery(api.tasks.listTasks, {
    parentId: parentTask._id,
  });
  const { mode } = useAdminMode();

  if (!isExpanded) {
    return null;
  }

  return (
    <div className="relative w-full">
      {level === 0 ? null : (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-700"
          style={{ left: `${level + 1}rem` }}
        />
      )}

      <TaskList tasks={subtasks} level={level + 1} />

      {/* Only show NewTaskButton if we're not at the maximum nesting level (5) */}
      {level < 4 && mode === "ON" && (
        <div
          style={{ marginLeft: `${(level + 1) * 2}rem` }}
          className="py-2 px-4 relative"
        >
          <NewTaskButton parentId={parentTask._id} />
        </div>
      )}
    </div>
  );
}

export default SubTaskContainer;
