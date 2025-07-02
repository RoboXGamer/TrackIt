import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Task } from "../../types/Task";
import { TaskFormDialog } from "./TaskFormDialog";
import { useTaskForm } from "../hooks/useTaskForm";
import { TASK_LABELS, TASK_ERRORS } from "../constants/taskConstants";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";

interface TaskEditDialogProps {
  task: Task;
}

/**
 * Extracted edit functionality from TaskActions
 * Handles task editing in a focused, single-responsibility component
 */
export function TaskEditDialog({ task }: TaskEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateTask = useMutation(api.tasks.updateTask);
  
  const {
    title,
    setTitle,
    description,
    setDescription,
    isLoading,
    error,
    resetForm,
    executeWithLoading,
  } = useTaskForm(task.title, task.description || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await executeWithLoading(async () => {
      await updateTask({
        taskId: task._id,
        title: title.trim(),
        description: description.trim() || undefined,
      });
    });

    if (success) {
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 p-1">
          <Edit className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      
      <TaskFormDialog
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        title={title}
        onTitleChange={setTitle}
        description={description}
        onDescriptionChange={setDescription}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        dialogTitle={TASK_LABELS.EDIT_TASK}
        submitButtonText="Save Changes"
      />
    </Dialog>
  );
}
