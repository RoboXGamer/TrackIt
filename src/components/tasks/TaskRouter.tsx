import { Task } from "../types/Task";
import { TopLevelTask, SubTask } from "@/components/tasks";
import { Id } from "../../../convex/_generated/dataModel";

interface TaskRouterProps {
  task: Task;
  level: number;
  projectId: Id<"projects"> | null;
}

function TaskRouter({ task, level, projectId }: TaskRouterProps) {
  // Render different components based on task level
  if (level === 0) {
    return <TopLevelTask task={task} level={level} projectId={projectId} />;
  }

  return <SubTask task={task} level={level} projectId={projectId} />;
}

export default TaskRouter;
