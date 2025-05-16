import TaskItem from "./TaskItem";

function TaskList({ tasks, level }: { tasks: any; level: number }) {
  return (
    <>
      <ul>
        {tasks?.map((task: any) => <TaskItem key={task._id} task={task} level={level} />)}
      </ul>
    </>
  );
}

export default TaskList;
