import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { useProject } from "@/components/providers/ProjectProvider";
import { Id } from "../../../convex/_generated/dataModel";

export const ProjectSelector = () => {
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();

  return (
    <div className="flex gap-4 items-center">
      {projects && projects.length > 0 ? (
        <Select onValueChange={(value) => setSelectedProjectId(value as Id<"projects">)} value={selectedProjectId || undefined}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project._id} value={project._id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div>No projects found.</div>
      )}
      <CreateProjectDialog>
        <Button>{projects && projects.length > 0 ? "Create New Project" : "Create Your First Project"}</Button>
      </CreateProjectDialog>
    </div>
  );
}; 