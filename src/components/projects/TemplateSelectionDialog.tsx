import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TemplateSelectionDialogProps {
  children: React.ReactNode;
  onProjectCreated: () => void;
}

export function TemplateSelectionDialog({
  children,
  onProjectCreated,
}: TemplateSelectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<Id<"projectTemplates"> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectTemplates = useQuery(api.projectTemplates.listProjectTemplates, {});
  const createProjectFromTemplate = useMutation(api.projects.createProjectFromTemplate);

  const handleCreateProject = async () => {
    if (!selectedTemplateId) {
      setError("Please select a template.");
      return;
    }
    if (!newProjectTitle.trim()) {
      setError("Please enter a title for your new project.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await createProjectFromTemplate({
        templateId: selectedTemplateId,
        newProjectTitle: newProjectTitle.trim(),
      });
      onProjectCreated();
      setIsOpen(false);
      setNewProjectTitle("");
      setSelectedTemplateId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project from template.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setNewProjectTitle("");
      setSelectedTemplateId(null);
      setError(null);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project from Template</DialogTitle>
          <DialogDescription>
            Select a predefined template to quickly set up your new project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="new-project-title"
            placeholder="Enter title for your new project..."
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
            disabled={isLoading}
          />
          <div className="text-sm font-medium">Available Templates:</div>
          <ScrollArea className="h-48 w-full rounded-md border p-4">
            {projectTemplates === undefined && <div className="text-center"><Loader2 className="w-5 h-5 animate-spin" /> Loading templates...</div>}
            {projectTemplates && projectTemplates.length === 0 && <div className="text-center text-gray-500">No templates available.</div>}
            {projectTemplates && projectTemplates.length > 0 && (
              <div className="flex flex-col gap-2">
                {projectTemplates.map((template) => (
                  <Button
                    key={template._id}
                    variant={selectedTemplateId === template._id ? "default" : "outline"}
                    onClick={() => setSelectedTemplateId(template._id)}
                    className="justify-start h-auto p-3 text-left"
                    disabled={isLoading}
                  >
                    <div>
                      <div className="font-semibold">{template.title}</div>
                      {template.description && (
                        <div className="text-xs text-gray-400 mt-1">{template.description}</div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleCreateProject}
            disabled={isLoading || !newProjectTitle.trim() || !selectedTemplateId}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create from Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 