import { Task } from "./types/Task";
import TopLevelTask from "./TopLevelTask";
import SubTask from "./SubTask";

interface TaskItemProps {
  task: Task;
  level: number;
}

function TaskItem({ task, level }: TaskItemProps) {
  // Render different components based on task level
  if (level === 0) {
    return <TopLevelTask task={task} level={level} />;
  }

  return <SubTask task={task} level={level} />;
}

export default TaskItem;