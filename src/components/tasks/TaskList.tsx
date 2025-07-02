import TaskRouter from "./TaskRouter";
import { Task } from "../types/Task";
import { Id } from "../../../convex/_generated/dataModel";
import { useProject } from "@/components/providers/ProjectProvider";

interface TaskListProps {
  tasks: Task[] | undefined;
  level: number;
}

function TaskList({ tasks, level }: TaskListProps) {
  const { selectedProjectId } = useProject();

  if (!tasks) return null;
  return (
    <div className="grid gap-2">
      {tasks?.map((task) => (
        <TaskRouter key={task._id} task={task} level={level} projectId={selectedProjectId} />
      ))}
    </div>
  );
}

export default TaskList;
