import { formatTime } from "@/lib/utils";

interface TaskTimeDisplayProps {
  timeSpent?: number;
  className?: string;
}

function TaskTimeDisplay({ timeSpent = 0, className = "" }: TaskTimeDisplayProps) {
  return (
    <div className={`text-sm ${className}`}>
      {formatTime(timeSpent)}
    </div>
  );
}

export default TaskTimeDisplay;
