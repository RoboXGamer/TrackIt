import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createProject = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const projectId = await ctx.db.insert("projects", {
      userId,
      title,
    });

    return projectId;
  },
});

export const getProjects = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
  },
  handler: async (ctx, { projectId, title }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Ensure the project belongs to the user
    const existingProject = await ctx.db.get(projectId);
    if (!existingProject || existingProject.userId !== userId) {
      throw new Error("Unauthorized or project not found");
    }

    await ctx.db.patch(projectId, { title });
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Ensure the project belongs to the user
    const existingProject = await ctx.db.get(projectId);
    if (!existingProject || existingProject.userId !== userId) {
      throw new Error("Unauthorized or project not found");
    }

    // Delete all tasks associated with this project first
    const tasksToDelete = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("projectId"), projectId))
      .collect();

    for (const task of tasksToDelete) {
      await ctx.db.delete(task._id);
    }

    await ctx.db.delete(projectId);
  },
});

export const createProjectFromTemplate = mutation({
  args: {
    templateId: v.id("projectTemplates"),
    newProjectTitle: v.string(),
  },
  handler: async (ctx, { templateId, newProjectTitle }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const template = await ctx.db.get(templateId);
    if (!template) {
      throw new Error("Project template not found");
    }

    const newProjectId = await ctx.db.insert("projects", {
      userId,
      title: newProjectTitle,
    });

    const templateTaskToNewTaskIdMap = new Map<string, Id<"tasks">>();
    const tasksWithParents: { templateTaskId: string; newParentTaskId: Id<"tasks"> }[] = [];

    // First pass: Create all tasks and map templateTaskIds to new task IDs
    for (const templateTask of template.tasks) {
      const newTaskId = await ctx.db.insert("tasks", {
        userId,
        projectId: newProjectId,
        title: templateTask.title,
        description: templateTask.description,
        status: templateTask.status || "not_started",
        // parentId is set in the second pass
        order: templateTask.order,
        timeSpent: 0,
        completionPercentage: 0,
      });
      templateTaskToNewTaskIdMap.set(templateTask.templateTaskId, newTaskId);
    }

    // Second pass: Update tasks to set parent IDs based on the map
    for (const templateTask of template.tasks) {
      if (templateTask.parentTemplateTaskId) {
        const newParentId = templateTaskToNewTaskIdMap.get(templateTask.parentTemplateTaskId);
        const currentNewTaskId = templateTaskToNewTaskIdMap.get(templateTask.templateTaskId);

        if (newParentId && currentNewTaskId) {
          await ctx.db.patch(currentNewTaskId, { parentId: newParentId });
        } else {
          console.warn(
            "Could not find parent ID or current task ID for template task:",
            templateTask,
          );
        }
      }
    }

    return newProjectId;
  },
}); 