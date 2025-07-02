import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface ProjectContextType {
  projects: {
    _id: Id<"projects">;
    title: string;
  }[] | undefined;
  selectedProjectId: Id<"projects"> | null;
  setSelectedProjectId: (id: Id<"projects"> | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const projects = useQuery(api.projects.getProjects, {});
  const [selectedProjectId, setSelectedProjectId] = useState<Id<"projects"> | null>(null);

  // Set the first project as selected by default if projects are loaded and no project is selected
  if (projects && projects.length > 0 && selectedProjectId === null) {
    setSelectedProjectId(projects[0]._id);
  }

  return (
    <ProjectContext.Provider value={{ projects, selectedProjectId, setSelectedProjectId }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}; 