import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { formatTime } from '@/lib/utils'; // Assuming you have a formatTime utility

function ProgressDashboard() {
  const topLevelTasks = useQuery(api.tasks.listTasks, { parentId: undefined });

  // Simple calculation for Phase 1 (only top-level tasks)
  const totalTasks = topLevelTasks?.length || 0;
  const completedTasks = topLevelTasks?.filter(task => task.status === 'completed').length || 0;
  const totalTimeSpent = topLevelTasks?.reduce((sum, task) => sum + (task.timeSpent || 0), 0) || 0;

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