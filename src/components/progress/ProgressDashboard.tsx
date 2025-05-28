import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatTime } from "@/lib/utils";

/**
 * ProgressDashboard Component
 *
 * TODO: This component is currently unused but designed for future implementation
 * of an overall progress dashboard. It provides basic metrics for top-level tasks.
 *
 * Features to implement:
 * - Visual progress charts/graphs
 * - Time tracking analytics
 * - Task completion trends
 * - Productivity insights
 */
function ProgressDashboard() {
  const topLevelTasks = useQuery(api.tasks.listTasks, { parentId: undefined });

  // Simple calculation for Phase 1 (only top-level tasks)
  const totalTasks = topLevelTasks?.length || 0;
  const completedTasks =
    topLevelTasks?.filter((task) => task.status === "completed").length || 0;
  const totalTimeSpent =
    topLevelTasks?.reduce((sum, task) => sum + (task.timeSpent || 0), 0) || 0;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Overall Progress</h2>
      <p>Total Tasks: {totalTasks}</p>
      <p>Completed Tasks: {completedTasks}</p>
      <p>Total Time Spent: {formatTime(totalTimeSpent)}</p>
      {/* Add more visualizations or metrics here later */}
    </div>
  );
}

export default ProgressDashboard;
