import React, { useState, useEffect, createContext, useContext } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Settings, RotateCcw, SkipForward } from "lucide-react";

// Pomodoro Settings Context
interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
}

interface PomodoroContextType {
  settings: PomodoroSettings;
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
}

const defaultSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};

const PomodoroContext = createContext<PomodoroContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
});

const usePomodoroSettings = () => useContext(PomodoroContext);

// Settings Component
const PomodoroSettingsDialog: React.FC = () => {
  const { settings, updateSettings } = usePomodoroSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Work Duration: {localSettings.workDuration} minutes
            </label>
            <Slider
              value={[localSettings.workDuration]}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, workDuration: value[0] })
              }
              max={60}
              min={5}
              step={5}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Short Break: {localSettings.shortBreakDuration} minutes
            </label>
            <Slider
              value={[localSettings.shortBreakDuration]}
              onValueChange={(value) =>
                setLocalSettings({
                  ...localSettings,
                  shortBreakDuration: value[0],
                })
              }
              max={15}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Long Break: {localSettings.longBreakDuration} minutes
            </label>
            <Slider
              value={[localSettings.longBreakDuration]}
              onValueChange={(value) =>
                setLocalSettings({
                  ...localSettings,
                  longBreakDuration: value[0],
                })
              }
              max={30}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Sessions until long break: {localSettings.sessionsUntilLongBreak}
            </label>
            <Slider
              value={[localSettings.sessionsUntilLongBreak]}
              onValueChange={(value) =>
                setLocalSettings({
                  ...localSettings,
                  sessionsUntilLongBreak: value[0],
                })
              }
              max={8}
              min={2}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Semi-Circle Progress Component - starts filled and empties as time progresses
const SegmentedCircularProgress: React.FC<{
  currentSession: number;
  totalSessions: number;
  currentProgress: number; // 0-100 for current session (represents remaining time)
  size: number;
  strokeWidth: number;
  className?: string;
}> = ({
  currentSession,
  totalSessions,
  currentProgress,
  size,
  strokeWidth,
  className = "",
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const svgHeight = center + strokeWidth * 2; // Height for semi-circle

  // Semi-circle from 9 o'clock (left) to 3 o'clock (right) - 180 degrees
  const startAngle = 180; // 9 o'clock
  const totalArc = 180;

  // Calculate gaps and segment sizes
  const gapAngle = 15; // degrees between segments
  const totalGaps = totalSessions - 1; // gaps between segments
  const totalGapAngle = totalGaps * gapAngle;
  const availableArc = totalArc - totalGapAngle;
  const segmentAngle = availableArc / totalSessions;

  // Convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  // Create arc path
  const createArcPath = (startDeg: number, endDeg: number): string => {
    const startRad = toRadians(startDeg);
    const endRad = toRadians(endDeg);

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    const sweepFlag = endDeg > startDeg ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
  };

  const segments = [];

  for (let i = 0; i < totalSessions; i++) {
    // Calculate angles for this segment (going from left to right)
    const segmentStart = startAngle - i * (segmentAngle + gapAngle);
    const segmentEnd = segmentStart - segmentAngle;

    // Determine fill percentage
    let fillPercent = 0;
    if (i < currentSession - 1) {
      // Completed sessions - empty
      fillPercent = 0;
    } else if (i === currentSession - 1) {
      // Current session - based on remaining time
      fillPercent = currentProgress;
    } else {
      // Future sessions - fully filled
      fillPercent = 100;
    }

    // Background path (full segment)
    const backgroundPath = createArcPath(segmentStart, segmentEnd);

    // Progress path (filled portion)
    let progressPath = "";
    if (fillPercent > 0) {
      const fillEnd = segmentStart - (segmentAngle * (100 - fillPercent)) / 100;
      progressPath = createArcPath(segmentStart, fillEnd);
    }

    segments.push(
      <g key={i}>
        {/* Background segment */}
        <path
          d={backgroundPath}
          stroke="#4B5563"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          opacity={0.4}
        />
        {/* Progress segment */}
        {fillPercent > 0 && (
          <path
            d={progressPath}
            stroke="#F97316"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        )}
      </g>,
    );
  }

  return (
    <div
      className={`relative ${className} rotate-180 translate-y-4/5 pointer-events-none`}
    >
      <svg
        width={size}
        height={svgHeight}
        viewBox={`0 0 ${size} ${svgHeight}`}
        className="overflow-visible"
      >
        {segments}
      </svg>
    </div>
  );
};

// Main Timer Component
const PomodoroTimerComponent: React.FC<{ taskId: Id<"tasks"> }> = ({
  taskId,
}) => {
  const { settings } = usePomodoroSettings();
  const [timeRemaining, setTimeRemaining] = useState(
    settings.workDuration * 60,
  );
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  const updateTask = useMutation(api.tasks.updateTask);
  const getTask = useQuery(api.tasks.getTask, { taskId });

  // Calculate progress percentage (for countdown: 100% = full time remaining, 0% = no time remaining)
  const totalTime = isBreak
    ? (currentSession % settings.sessionsUntilLongBreak === 0
        ? settings.longBreakDuration
        : settings.shortBreakDuration) * 60
    : settings.workDuration * 60;
  const progress = (timeRemaining / totalTime) * 100; // Remaining time percentage

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          if (!isBreak) {
            setTotalTimeSpent((prev) => prev + 1);
            // Update task time spent every 10 seconds to reduce API calls
            if ((totalTime - newTime) % 10 === 0) {
              const timeSpent = getTask?.timeSpent || 0;
              updateTask({ taskId, timeSpent: timeSpent + 10000 });
            }
          }
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      // Timer finished
      setIsActive(false);
      if (!isBreak) {
        // Work session finished, start break
        const isLongBreak =
          currentSession % settings.sessionsUntilLongBreak === 0;
        const breakDuration = isLongBreak
          ? settings.longBreakDuration
          : settings.shortBreakDuration;
        setTimeRemaining(breakDuration * 60);
        setIsBreak(true);
      } else {
        // Break finished, start next work session
        setTimeRemaining(settings.workDuration * 60);
        setIsBreak(false);
        setCurrentSession((prev) => {
          // Reset to 1 if we've completed all sessions in the cycle
          const nextSession = prev + 1;
          return nextSession > settings.sessionsUntilLongBreak
            ? 1
            : nextSession;
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isActive,
    timeRemaining,
    isBreak,
    currentSession,
    settings,
    taskId,
    updateTask,
    getTask?.timeSpent,
    totalTime,
  ]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(settings.workDuration * 60);
    setCurrentSession(1);
    setIsBreak(false);
    setTotalTimeSpent(0);
  };

  const skipSession = () => {
    setIsActive(false);
    if (!isBreak) {
      // Skip work session, go to break
      const isLongBreak =
        currentSession % settings.sessionsUntilLongBreak === 0;
      const breakDuration = isLongBreak
        ? settings.longBreakDuration
        : settings.shortBreakDuration;
      setTimeRemaining(breakDuration * 60);
      setIsBreak(true);
    } else {
      // Skip break, go to next work session
      setTimeRemaining(settings.workDuration * 60);
      setIsBreak(false);
      setCurrentSession((prev) => {
        // Reset to 1 if we've completed all sessions in the cycle
        const nextSession = prev + 1;
        return nextSession > settings.sessionsUntilLongBreak ? 1 : nextSession;
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const formatSessionTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <section
      className="flex flex-col bg-slate-900 rounded-2xl p-4 max-w-sm aspect-square"
      style={
        {
          "--timer-stroke": "12px",
          "--session-indicator-size": "40px",
          "--control-button-lg": "64px",
          "--control-button-md": "48px",
          "--control-button-sm": "40px",
        } as React.CSSProperties
      }
      aria-label="Pomodoro Timer"
      role="timer"
    >
      {/* Header */}
      <header className="flex justify-between items-center">
        <div
          className="text-white/70 text-lg font-medium bg-white/10 rounded-full flex items-center justify-center"
          style={{
            width: "var(--session-indicator-size)",
            height: "var(--session-indicator-size)",
          }}
          aria-label={`Session ${currentSession} of ${settings.sessionsUntilLongBreak}`}
        >
          {currentSession}
        </div>
        <PomodoroSettingsDialog />
      </header>

      {/* Mode indicator */}
      <div
        className="text-white/70 text-sm font-medium text-center"
        aria-live="polite"
        aria-label="Timer status"
      >
        {!isActive && timeRemaining < totalTime
          ? "paused"
          : isBreak
            ? "break mode"
            : "focus mode"}
      </div>

      {/* Circular timer container - flex-1 to take remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative">
          <SegmentedCircularProgress
            currentSession={currentSession}
            totalSessions={settings.sessionsUntilLongBreak}
            currentProgress={progress}
            size={320}
            strokeWidth={12}
          />

          {/* Timer display overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pt-12"
            aria-live="polite"
            aria-atomic="true"
          >
            <time
              className="text-white text-4xl font-light mb-2"
              dateTime={`PT${timeRemaining}S`}
              aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
            >
              {formatTime(timeRemaining)}
            </time>
            <div
              className="text-white/50 text-sm"
              aria-label={`Session time: ${formatSessionTime(totalTimeSpent)}`}
            >
              {formatSessionTime(totalTimeSpent)}
            </div>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <nav
        className="pomodoro-timer__controls flex justify-center items-center gap-4"
        aria-label="Timer controls"
      >
        {isActive ? (
          /* Single pause button when active */
          <Button
            onClick={toggleTimer}
            size="icon"
            className="pomodoro-timer__control-button pomodoro-timer__control-button--primary rounded-full bg-white text-slate-900 hover:bg-white/90 focus:ring-2 focus:ring-white/50"
            style={{
              width: "var(--control-button-lg)",
              height: "var(--control-button-lg)",
            }}
            aria-label="Pause timer"
          >
            <Pause className="h-6 w-6" aria-hidden="true" />
          </Button>
        ) : (
          /* Three buttons when paused */
          <>
            <Button
              onClick={resetTimer}
              size="icon"
              className="pomodoro-timer__control-button pomodoro-timer__control-button--secondary rounded-full bg-white text-slate-900 hover:bg-white/90 focus:ring-2 focus:ring-white/50"
              style={{
                width: "var(--control-button-md)",
                height: "var(--control-button-md)",
              }}
              aria-label="Reset timer"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              onClick={toggleTimer}
              size="icon"
              className="pomodoro-timer__control-button pomodoro-timer__control-button--primary rounded-full bg-white text-slate-900 hover:bg-white/90 focus:ring-2 focus:ring-white/50"
              style={{
                width: "var(--control-button-lg)",
                height: "var(--control-button-lg)",
              }}
              aria-label="Start timer"
            >
              <Play className="h-8 w-8 ml-0.5" aria-hidden="true" />
            </Button>
            <Button
              onClick={skipSession}
              size="icon"
              className="pomodoro-timer__control-button pomodoro-timer__control-button--secondary rounded-full bg-white text-slate-900 hover:bg-white/90 focus:ring-2 focus:ring-white/50"
              style={{
                width: "var(--control-button-md)",
                height: "var(--control-button-md)",
              }}
              aria-label="Skip to next session"
            >
              <SkipForward className="h-5 w-5" aria-hidden="true" />
            </Button>
          </>
        )}
      </nav>
    </section>
  );
};

// Provider Component
const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const saved = localStorage.getItem("pomodoro-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem("pomodoro-settings", JSON.stringify(updatedSettings));
  };

  return (
    <PomodoroContext.Provider value={{ settings, updateSettings }}>
      {children}
    </PomodoroContext.Provider>
  );
};

// Main exported component
const PomodoroTimer: React.FC<{ taskId: Id<"tasks"> }> = ({ taskId }) => {
  return (
    <PomodoroProvider>
      <PomodoroTimerComponent taskId={taskId} />
    </PomodoroProvider>
  );
};

export default PomodoroTimer;
