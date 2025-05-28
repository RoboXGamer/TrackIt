import TaskRouter from "./TaskRouter";
import { Task } from "../types/Task";

interface TaskListProps {
  tasks: Task[] | undefined;
  level: number;
}

function TaskList({ tasks, level }: TaskListProps) {
  return (
    <div className="w-full space-y-2">
      {tasks?.map((task) => (
        <TaskRouter key={task._id} task={task} level={level} />
      ))}
    </div>
  );
}

export default TaskList;
