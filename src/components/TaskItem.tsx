import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { formatTime } from "@/lib/utils";
import TaskList from "./TaskList";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import NewTaskButton from "@/components/NewTaskButton";

interface Task {
  _id: Id<"tasks">;
  _creationTime: number;
  completionPercentage?: number | undefined;
  timeSpent?: number | undefined;
  description?: string | undefined;
  parentId?: Id<"tasks"> | undefined;
  userId: Id<"users">;
  title: string;
  status: string;
  order: number;
}

function TaskItem({ task, level }: { task: Task; level: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const paddingLeft = level * 1.5;

  const furtherTasks = useQuery(api.tasks.listTasks, {
    parentId: task._id,
  });

  return (
    <>
      <div className="min-w-xl">
        <div
          className="bg-accent text-accent-foreground rounded-lg p-4 flex items-center gap-4"
          style={{ marginLeft: `${paddingLeft}rem` }}
        >
          {/* Progress Circle */}
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#404040"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#3B82F6"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - (task.completionPercentage ?? 0) / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm">
              {task.completionPercentage ?? 0}%
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="font-medium">{task.title}</div>
            <div className="text-sm">{formatTime(task.timeSpent ?? 0)}</div>
            <button
              className=" text-xs mt-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Hide Details ^" : "Show Details v"}
            </button>
          </div>

          {/* Status Icon */}
          <button
            onClick={() => {
              console.log("clicked status icon");
            }}
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            {task.completionPercentage === 100 ? "check" : "play"}
          </button>
        </div>

        {isExpanded && (
          <div style={{ marginLeft: `${(level + 1) * 1.5}rem` }}>
            <TaskList tasks={furtherTasks} level={level + 1} />
            <div
              style={{ marginLeft: `${(level + 1) * 1.5}rem` }}
              className="mt-2"
            >
              <NewTaskButton />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TaskItem;
