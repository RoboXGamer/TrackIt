import { useState } from "react";
import { Task } from "./types/Task";
import TaskActions from "./TaskActions";
import ProgressCircle from "./ProgressCircle";
import TaskTimeDisplay from "./TaskTimeDisplay";
import PlayButton from "./PlayButton";
import SubTaskContainer from "./SubTaskContainer";
import { href, useNavigate } from "react-router";

interface TopLevelTaskProps {
  task: Task;
  level: number;
}

function TopLevelTask({ task, level }: TopLevelTaskProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const paddingLeft = level * 1.5;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent expansion when clicking on interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest(
      'button, [role="button"], input, select, textarea, a',
    );

    if (!isInteractiveElement) {
      setIsExpanded(!isExpanded);
    }
  };

  let navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg border border-dark-turquoise inset-shadow-dark-turquoise">
      <div
        className="w-full px-4 py-3 hover:bg-gray-800/30 transition-all duration-200 cursor-pointer relative"
        style={{ marginLeft: `${paddingLeft}rem` }}
        onClick={handleCardClick}
      >
        <div className="flex items-center">
          <div className="flex items-center gap-4 flex-1 pr-24">
            <ProgressCircle
              taskId={task._id}
              completionPercentage={task.completionPercentage ?? 0}
              size="lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{task.title}</h3>
              <TaskTimeDisplay
                timeSpent={task.timeSpent}
                className="text-sm text-gray-400"
              />
            </div>
          </div>
          <div className="absolute right-4 flex items-center gap-2">
            <TaskActions task={task} showDelete={false} />
            <PlayButton
              task={task}
              onPlay={(task) => {
                navigate(
                  href("/tasks/:id", {
                    id: task._id,
                  }),
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content - Subtasks */}
      <SubTaskContainer
        parentTask={task}
        level={level}
        isExpanded={isExpanded}
      />
    </div>
  );
}

export default TopLevelTask;
