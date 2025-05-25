import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Find the maximum order for the given parentId (or null for top-level)
    const existingTasks = await ctx.db
      .query("tasks")
      .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .take(1);

    const newOrder = existingTasks.length > 0 ? existingTasks[0].order + 1 : 0;

    await ctx.db.insert("tasks", {
      userId: userId,
      title: args.title,
      description: args.description,
      parentId: args.parentId,
      order: newOrder,
      status: "not_started",
      timeSpent: 0,
      completionPercentage: 0,
    });
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    updates: v.object({
      status: v.optional(
        v.union(
          v.literal("not_started"),
          v.literal("in_progress"),
          v.literal("completed"),
        ),
      ),
      title: v.optional(v.string()),
      description: v.optional(v.optional(v.string())), // Needs double optional because schema is optional string
      timeSpent: v.optional(v.optional(v.number())),   // Needs double optional
      completionPercentage: v.optional(v.optional(v.number())), // Needs double optional
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found or does not belong to user");
    }

    await ctx.db.patch(args.taskId, args.updates);
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found or does not belong to user");
    }

    // Recursively delete subtasks
    const subtasks = await ctx.db
      .query("tasks")
      .withIndex("by_parent", (q) => q.eq("parentId", args.taskId))
      .collect();
    for (const subtask of subtasks) {
 await ctx.db.delete(subtask._id);
    }

    // Delete the task itself
    await ctx.db.delete(args.taskId);
  },
});

export const getTask = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler(ctx, args) {
    const task = ctx.db.get(args.taskId);
    return task;
  },
});

export const listTasks = query({
  args: {
    parentId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("tasks")
      .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("asc")
      .collect();
  },
});
