import { useState } from "react";
import { useMutation } from "convex/react";
import { useAdminMode } from "@/components/providers/AdminModeProvider";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface TaskProgressCircleProps {
  taskId: Id<"tasks">;
  completionPercentage: number;
  size?: "sm" | "md" | "lg";
}

function TaskProgressCircle({
  taskId,
  completionPercentage,
  size = "md",
}: TaskProgressCircleProps) {
  const { mode } = useAdminMode();
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState([completionPercentage]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = useMutation(api.tasks.updateTaskProgress);

  const handleProgressUpdate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await updateProgress({
        taskId,
        completionPercentage: progress[0],
      });
      setIsOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update progress",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setProgress([completionPercentage]);
    setError(null);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      width: 38,
      height: 38,
      radius: 16,
      strokeWidth: 3,
      textSize: "text-xs",
    },
    md: {
      width: 48,
      height: 48,
      radius: 20,
      strokeWidth: 4,
      textSize: "text-sm",
    },
    lg: {
      width: 64,
      height: 64,
      radius: 28,
      strokeWidth: 5,
      textSize: "text-base",
    },
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference * (1 - completionPercentage / 100);

  const progressCircle = (
    <div
      className={`relative`}
      style={{ width: config.width, height: config.height }}
    >
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          stroke="#404040"
          strokeWidth={config.strokeWidth}
          fill="none"
        />
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          stroke="#3B82F6"
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
        />
      </svg>
      <div
        className={`absolute inset-0 flex items-center justify-center ${config.textSize} font-medium`}
      >
        {completionPercentage.toFixed(0)}%
      </div>
    </div>
  );

  // If admin mode is off, just show the progress circle without click functionality
  if (mode === "OFF") {
    return progressCircle;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <button className="hover:scale-105 transition-transform cursor-pointer">
          {progressCircle}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Completion: {progress[0]}%
            </label>
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={5}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="relative" style={{ width: 80, height: 80 }}>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#404040"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#3B82F6"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress[0] / 100)}`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-medium">
                {progress[0]}%
              </div>
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleProgressUpdate} disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Progress
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TaskProgressCircle;
