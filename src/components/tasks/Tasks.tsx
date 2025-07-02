import { useQuery } from "convex/react";
import { CreateTaskButton, TaskList } from ".";
import { api } from "@/../convex/_generated/api";
import { AdminModeToggle } from "@/components";
import { useProject } from "@/components/providers/ProjectProvider";

export default function Tasks() {
  const { selectedProjectId } = useProject();
  const tasks = useQuery(api.tasks.listTasks, selectedProjectId ? { projectId: selectedProjectId } : "skip");
  tasks?.sort((a, b) => a.order - b.order);

  if (!selectedProjectId) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 flex gap-4 flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-center">Tasks</h2>
          <AdminModeToggle />
        </div>
        <div className="text-center text-gray-500">
          Please select a project to view tasks.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8 flex gap-4 flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-center">Tasks</h2>
        <AdminModeToggle />
      </div>
      <div className="flex flex-col gap-4">
        <TaskList tasks={tasks} level={0} />
        <div className="px-4">
          <CreateTaskButton projectId={selectedProjectId} />
        </div>
      </div>
    </div>
  );
}
