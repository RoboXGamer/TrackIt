import TaskItem from "./TaskItem";
import { Task } from "./types/Task";

interface TaskListProps {
  tasks: Task[] | undefined;
  level: number;
}

function TaskList({ tasks, level }: TaskListProps) {
  return (
    <div className="w-full space-y-1">
      {tasks?.map((task) => <TaskItem key={task._id} task={task} level={level} />)}
    </div>
  );
}

export default TaskList;
