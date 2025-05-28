import React, { useState, useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const PomodoroTimer: React.FC<{ taskId: Id<"tasks"> }> = ({ taskId }) => {
  const initialTime = 25 * 60; // 25 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      // Call updateTask periodically to increment timeSpent
      // For simplicity, we'll update every second here.
      // In a real app, consider updating less frequently (e.g., every 30-60 seconds)
      // or only at the end of a Pomodoro session to reduce backend calls.
      // Also, a more robust approach might fetch the current timeSpent before incrementing.
      const timeSpent = getTask?.timeSpent;
      updateTask({ taskId, timeSpent: (timeSpent ?? 0) + 1000 });
    } else if (!isActive && timeRemaining !== initialTime) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const updateTask = useMutation(api.tasks.updateTask);
  const getTask = useQuery(api.tasks.getTask, { taskId });

  const resetTimer = () => {
    setTimeRemaining(initialTime);
    setIsActive(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div>
      <h2>Pomodoro Timer</h2>
      <div>Time Remaining: {formatTime(timeRemaining)}</div>
      <button onClick={startTimer} disabled={isActive}>
        Start
      </button>
      <button onClick={pauseTimer} disabled={!isActive}>
        Pause
      </button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
};

export default PomodoroTimer;
