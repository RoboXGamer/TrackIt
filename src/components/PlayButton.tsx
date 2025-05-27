import { Task } from "./types/Task";

interface PlayButtonProps {
  task: Task;
  onPlay?: (task: Task) => void;
  className?: string;
}

function PlayButton({ task, onPlay, className = "" }: PlayButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (onPlay) {
      onPlay(task);
    } else {
      console.log("Play button clicked for task:", task.title);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors text-white ${className}`}
      title="Start/Resume task"
    >
      <svg 
        fill="currentColor" 
        focusable="false" 
        viewBox="0 0 24 24" 
        className="w-4 h-4"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}

export default PlayButton;
