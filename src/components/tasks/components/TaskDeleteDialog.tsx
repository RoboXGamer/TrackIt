import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Task } from "../../types/Task";
import { TASK_LABELS, TASK_ERRORS } from "../constants/taskConstants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";

interface TaskDeleteDialogProps {
  task: Task;
}

/**
 * Extracted delete functionality from TaskActions
 * Handles task deletion in a focused, single-responsibility component
 */
export function TaskDeleteDialog({ task }: TaskDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const deleteTask = useMutation(api.tasks.deleteTask);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteTask({ taskId: task._id });
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : TASK_ERRORS.DELETE_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{TASK_LABELS.DELETE_TASK}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete "{task.title}"? This will also
            delete all subtasks. This action cannot be undone.
          </p>
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
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {TASK_LABELS.DELETE_TASK}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
