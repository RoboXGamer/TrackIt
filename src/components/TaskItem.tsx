import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { formatTime } from "@/lib/utils";
import TaskList from "./TaskList";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import NewTaskButton from "@/components/NewTaskButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface Task {
  [x: string]: any;

  // Corrected type definition for status
  _id: Id<"tasks">;
  _creationTime: number;
  completionPercentage?: number | undefined;
  timeSpent?: number | undefined;
  description?: string | undefined;
  parentId?: Id<"tasks"> | undefined;
  userId: Id<"users">;
  title: string;
  status: "not_started" | "in_progress" | "completed"; // Use union type for status
  order: number;
}

function TaskItem({ task, level }: { task: Task; level: number }) {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isExpanded, setIsExpanded] = useState(false);

  const paddingLeft = level * 1.5;

  const furtherTasks = useQuery(api.tasks.listTasks, {
    parentId: task._id,
  });
  const deleteTask = useMutation(api.tasks.deleteTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const [editedDescription, setEditedDescription] = useState(
    task.description ?? ""
  );

  const handleSave = () => {
    updateTask({
      taskId: task._id,
      updates: { title: editedTitle, description: editedDescription },
    });
    setIsEditing(false);
  };

  return (
    <>
      <div className="min-w-xl">
        <div
          className={`bg-accent text-accent-foreground rounded-lg p-4 flex items-center gap-4 ${
            isEditing ? "flex-col items-start" : ""
          }`}
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

          {isEditing ? (
            // Editing Mode
            <div className="flex flex-col gap-2 flex-1 w-full">
              <input
                className="text-lg font-medium bg-transparent border-b border-gray-600 focus:outline-none"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Task Title"
              />
              <textarea
                className="text-sm bg-transparent border-b border-gray-600 focus:outline-none"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Description (Optional)"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTitle(task.title);
                    setEditedDescription(task.description ?? "");
                  }}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (

          {/* Status Icon */}
              <button className="text-red-500 hover:text-red-700 transition-colors">
                Delete
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your task
                  and all its subtasks from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteTask({ taskId: task._id })}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Status Icon */}
          <button
            onClick={() => {
              let nextStatus: "not_started" | "in_progress" | "completed";
              let nextCompletionPercentage = task.completionPercentage;

              if (task.status === "not_started") {
                nextStatus = "in_progress";
              } else if (task.status === "in_progress") {
                nextStatus = "completed";
                nextCompletionPercentage = 100; // Set to 100% when completed
              } else { // If completed, loop back to not_started
                nextStatus = "not_started";
                nextCompletionPercentage = task.completionPercentage === 100 ? 0 : task.completionPercentage; // Reset to 0% or keep previous if not 100
              }

              updateTask({
                taskId: task._id,
                updates: {
                  status: nextStatus,
                  completionPercentage: nextCompletionPercentage,
                },
              });
            }}
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors ml-auto" // ml-auto to push it to the right
          >
            {task.status === "completed" ? "✓" : "▶"} {/* Use symbols for icons */}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            Edit
          </button>

          {/* Start Timer Button */}
          <button
            onClick={() => setIsTimerActive(true)}
            className="text-green-500 hover:text-green-700 transition-colors"
          >
            Start Timer
          </button>

          // Content
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

        {/* Pomodoro Timer */}
        {isTimerActive && (
          <PomodoroTimer taskId={task._id} />
        )}

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
          )}
      </div>
    </>
  );
}

export default TaskItem;
