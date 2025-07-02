import { useState } from "react";
import { useMutation } from "convex/react";
import { useAdminMode } from "@/components/providers/AdminModeProvider";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { TASK_ERRORS, getTaskLabel } from "@/components/tasks";

interface CreateTaskButtonProps {
  parentId?: Id<"tasks">;
  projectId: Id<"projects">;
}

function CreateTaskButton({ parentId, projectId }: CreateTaskButtonProps) {
  const { mode } = useAdminMode();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useMutation(api.tasks.createTask);
  const taskLabels = getTaskLabel(!!parentId);

  if (mode === "OFF") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError(TASK_ERRORS.TITLE_REQUIRED);
      return;
    }

    if (!projectId) {
      setError("Project ID is required to create a task.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        parentId,
        projectId,
      });

      // Reset form and close dialog
      setTitle("");
      setDescription("");
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : TASK_ERRORS.CREATE_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when closing
      setTitle("");
      setDescription("");
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center text-orange-400 border-orange-400/30 hover:bg-orange-400/10 bg-transparent gap-2 py-2"
        >
          <Plus className="w-4 h-4" />
          {taskLabels.button}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{taskLabels.dialog}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
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
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim() || !projectId}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskButton;
