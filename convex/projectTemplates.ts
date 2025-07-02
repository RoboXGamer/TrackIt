import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const createProjectTemplate = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    tasks: v.array(
      v.object({
        templateTaskId: v.string(),
        parentTemplateTaskId: v.optional(v.string()),
        title: v.string(),
        description: v.optional(v.string()),
        order: v.number(),
        status: v.optional(
          v.union(
            v.literal("not_started"),
            v.literal("in_progress"),
            v.literal("completed"),
          ),
        ),
      }),
    ),
  },
  handler: async (ctx, { title, description, tasks }) => {
    const templateId = await ctx.db.insert("projectTemplates", {
      title,
      description,
      tasks,
    });
    return templateId;
  },
});

export const listProjectTemplates = query({
  handler: async (ctx) => {
    return await ctx.db.query("projectTemplates").collect();
  },
});

// Example: Add some predefined templates (can be removed later if admin UI is built)
export const addExampleTemplates = mutation({
  handler: async (ctx) => {
    // Check if templates already exist to prevent duplicates
    const existingTemplates = await ctx.db.query("projectTemplates").collect();
    if (existingTemplates.length > 0) {
      console.log("Example templates already exist.");
      return;
    }

    await ctx.db.insert("projectTemplates", {
      title: "Personal Growth Plan",
      description: "A template for personal development goals.",
      tasks: [
        { templateTaskId: "t1", title: "Define long-term goals", description: "", order: 1, status: "not_started" },
        { templateTaskId: "t2", parentTemplateTaskId: "t1", title: "Set quarterly objectives", description: "", order: 1, status: "not_started" },
        { templateTaskId: "t3", parentTemplateTaskId: "t2", title: "Identify key skills", description: "", order: 1, status: "not_started" },
        { templateTaskId: "t4", title: "Learn new skill", description: "Choose a skill and start learning.", order: 2, status: "not_started" },
        { templateTaskId: "t5", parentTemplateTaskId: "t4", title: "Complete online course", description: "", order: 1, status: "not_started" },
        { templateTaskId: "t6", parentTemplateTaskId: "t4", title: "Practice daily", description: "", order: 2, status: "not_started" },
      ],
    });

    await ctx.db.insert("projectTemplates", {
      title: "Website Development",
      description: "Standard steps for launching a new website.",
      tasks: [
        { templateTaskId: "w1", title: "Project Planning", description: "", order: 1, status: "not_started" },
        { templateTaskId: "w2", parentTemplateTaskId: "w1", title: "Define scope and requirements", description: "", order: 1, status: "not_started" },
        { templateTaskId: "w3", parentTemplateTaskId: "w1", title: "Create wireframes", description: "", order: 2, status: "not_started" },
        { templateTaskId: "w4", title: "Design Phase", description: "", order: 2, status: "not_started" },
        { templateTaskId: "w5", parentTemplateTaskId: "w4", title: "Develop UI/UX designs", description: "", order: 1, status: "not_started" },
        { templateTaskId: "w6", parentTemplateTaskId: "w4", title: "Select tech stack", description: "", order: 2, status: "not_started" },
        { templateTaskId: "w7", title: "Development Phase", description: "", order: 3, status: "not_started" },
        { templateTaskId: "w8", parentTemplateTaskId: "w7", title: "Build frontend", description: "", order: 1, status: "not_started" },
        { templateTaskId: "w9", parentTemplateTaskId: "w7", title: "Build backend APIs", description: "", order: 2, status: "not_started" },
        { templateTaskId: "w10", parentTemplateTaskId: "w7", title: "Implement database", description: "", order: 3, status: "not_started" },
        { templateTaskId: "w11", title: "Testing & Deployment", description: "", order: 4, status: "not_started" },
        { templateTaskId: "w12", parentTemplateTaskId: "w11", title: "Conduct user acceptance testing (UAT)", description: "", order: 1, status: "not_started" },
        { templateTaskId: "w13", parentTemplateTaskId: "w11", title: "Deploy to production", description: "", order: 2, status: "not_started" },
      ],
    });
  },
}); 