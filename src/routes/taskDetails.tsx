import { useQuery } from "convex/react";
import { Route } from "./+types/taskDetails";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import PomodoroTimer from "@/components/PomodoroTimer";

export default function taskDetails({ params }: Route.ComponentProps) {
  const { id } = params;
  const taskId = id as Id<"tasks">;
  const task = useQuery(api.tasks.getTask, { taskId });
  const { title, completionPercentage, status, timeSpent } = task || {};
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <div>
          <p>Completion: {completionPercentage}%</p>
          <p>Status: {status}</p>
          <p>Time Spent: {(timeSpent || 0) / 1000} seconds</p>
          <PomodoroTimer taskId={taskId} />
        </div>
      </div>
    </>
  );
}
