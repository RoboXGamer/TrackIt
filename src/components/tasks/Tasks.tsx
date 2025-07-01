import { useQuery } from "convex/react";
import { CreateTaskButton, TaskList } from ".";
import { api } from "@/../convex/_generated/api";

export default function Tasks() {
  const tasks = useQuery(api.tasks.listTasks, {});
  tasks?.sort((a, b) => a.order - b.order);
  return (
    <div className="w-full max-w-4xl mx-auto">
      <section>
        <h2 className="text-2xl font-bold text-center mb-6">Tasks</h2>
        <div className="w-full space-y-1">
          <TaskList tasks={tasks} level={0} />
          <div className="mt-4 px-4">
            <CreateTaskButton />
          </div>
        </div>
      </section>
    </div>
  );
}
