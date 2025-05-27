import { useState } from "react";
import { useMutation } from "convex/react";
import { useAdminMode } from "@/components/admin-mode-provider";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Task } from "./types/Task";

interface TaskActionsProps {
  task: Task;
  showDelete: boolean;
}

function TaskActions({ task, showDelete }: TaskActionsProps) {
  const { mode } = useAdminMode();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || "",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  if (mode === "OFF") return null;

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editTitle.trim()) {
      setError("Title is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateTask({
        taskId: task._id,
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteTask({ taskId: task._id });
      setIsDeleteOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  const resetEditForm = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setError(null);
  };

  return (
    <div className="flex gap-1">
      {/* Edit Dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) resetEditForm();
        }}
      >
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-1">
            <Edit className="w-3 h-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label
                htmlFor="edit-title"
                className="block text-sm font-medium mb-1"
              >
                Title *
              </label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <Input
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                disabled={isLoading}
              />
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
                onClick={() => setIsEditOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !editTitle.trim()}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog - Only show if showDelete is true */}
      {showDelete && (
        <Dialog
          open={isDeleteOpen}
          onOpenChange={(open) => {
            setIsDeleteOpen(open);
            if (!open) setError(null);
          }}
        >
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
              <DialogTitle>Delete Task</DialogTitle>
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
                  onClick={() => setIsDeleteOpen(false)}
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
                  Delete Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default TaskActions;
