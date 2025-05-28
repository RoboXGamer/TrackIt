import { Task } from "../types/Task";
import { TopLevelTask, SubTask } from "@/components/tasks";

interface TaskRouterProps {
  task: Task;
  level: number;
}

function TaskRouter({ task, level }: TaskRouterProps) {
  // Render different components based on task level
  if (level === 0) {
    return <TopLevelTask task={task} level={level} />;
  }

  return <SubTask task={task} level={level} />;
}

export default TaskRouter;
