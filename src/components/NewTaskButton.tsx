import { useAdminMode } from "@/components/admin-mode-provider";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function NewTaskButton({ parentId }: { parentId?: Id<"tasks"> }) {
  const { mode } = useAdminMode();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const createTask = useMutation(api.tasks.createTask);

  const handleCreateTask = async () => {
    if (newTaskTitle.trim()) {
      await createTask({
        title: newTaskTitle,
        parentId: parentId,
        description: undefined,
      });
      setIsDialogOpen(false);
      setNewTaskTitle("");
    }
  };

  if (mode === "OFF") return null;
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">New Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="task-title" className="text-right">
              Title
            </label>
            <Input
              id="task-title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="col-span-3"
              placeholder="Enter task title"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateTask}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewTaskButton;
