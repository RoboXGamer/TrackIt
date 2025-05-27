import { Id } from "../../../convex/_generated/dataModel";

export interface Task {
  _id: Id<"tasks">;
  _creationTime: number;
  completionPercentage?: number | undefined;
  timeSpent?: number | undefined;
  description?: string | undefined;
  parentId?: Id<"tasks"> | undefined;
  userId: Id<"users">;
  title: string;
  status: string;
  order: number;
}
