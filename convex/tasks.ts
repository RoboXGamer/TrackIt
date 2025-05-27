import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getTask = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) return null;

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

export const isLeafTask = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    // Verify the task exists and belongs to the user
    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) return false;

    // Check if task has any children
    const children = await ctx.db
      .query("tasks")
      .withIndex("by_parent", (q) => q.eq("parentId", args.taskId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    return children === null;
  },
});

// Helper function to get the next order value for a new task
async function getNextOrderValue(ctx: any, parentId: string | undefined, userId: string) {
  const siblings = await ctx.db
    .query("tasks")
    .withIndex("by_parent", (q: any) => q.eq("parentId", parentId))
    .filter((q: any) => q.eq(q.field("userId"), userId))
    .collect();

  if (siblings.length === 0) return 1;

  const maxOrder = Math.max(...siblings.map((task: any) => task.order));
  return maxOrder + 1;
}

// Helper function to recursively delete all subtasks
async function deleteTaskAndSubtasks(ctx: any, taskId: string, userId: string) {
  // Get all direct children
  const children = await ctx.db
    .query("tasks")
    .withIndex("by_parent", (q: any) => q.eq("parentId", taskId))
    .filter((q: any) => q.eq(q.field("userId"), userId))
    .collect();

  // Recursively delete all children
  for (const child of children) {
    await deleteTaskAndSubtasks(ctx, child._id, userId);
  }

  // Delete the task itself
  await ctx.db.delete(taskId);
}

// Helper function to check if a task has any children
async function hasChildren(ctx: any, taskId: string, userId: string): Promise<boolean> {
  const children = await ctx.db
    .query("tasks")
    .withIndex("by_parent", (q: any) => q.eq("parentId", taskId))
    .filter((q: any) => q.eq(q.field("userId"), userId))
    .first();

  return children !== null;
}

// Helper function to calculate parent progress based on children
async function updateParentProgress(ctx: any, parentId: string, userId: string) {
  // Get all children of the parent
  const children = await ctx.db
    .query("tasks")
    .withIndex("by_parent", (q: any) => q.eq("parentId", parentId))
    .filter((q: any) => q.eq(q.field("userId"), userId))
    .collect();

  if (children.length === 0) return;

  // Calculate average completion percentage
  const totalCompletion = children.reduce((sum: number, child: any) => {
    return sum + (child.completionPercentage || 0);
  }, 0);

  const averageCompletion = totalCompletion / children.length;

  // Update parent task
  await ctx.db.patch(parentId, {
    completionPercentage: Math.round(averageCompletion * 100) / 100, // Round to 2 decimal places
    status: averageCompletion === 0 ? "not_started" :
            averageCompletion === 100 ? "completed" : "in_progress"
  });

  // Get the parent task to check if it has a parent (for recursive updates)
  const parentTask = await ctx.db.get(parentId);
  if (parentTask && parentTask.parentId) {
    await updateParentProgress(ctx, parentTask.parentId, userId);
  }
}

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // If parentId is provided, verify the parent task exists and belongs to the user
    if (args.parentId) {
      const parentTask = await ctx.db.get(args.parentId);
      if (!parentTask || parentTask.userId !== userId) {
        throw new Error("Parent task not found or access denied");
      }
    }

    // Get the next order value
    const order = await getNextOrderValue(ctx, args.parentId, userId);

    // Create the new task
    const taskId = await ctx.db.insert("tasks", {
      userId,
      title: args.title.trim(),
      description: args.description?.trim(),
      status: "not_started",
      parentId: args.parentId,
      order,
      timeSpent: 0,
      completionPercentage: 0,
    });

    return taskId;
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed")
    )),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Verify the task exists and belongs to the user
    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found or access denied");
    }

    // Prepare update object with only provided fields
    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title.trim();
    if (args.description !== undefined) updates.description = args.description?.trim();
    if (args.status !== undefined) {
      updates.status = args.status;
      // If marking as completed, set completion to 100%
      if (args.status === "completed") {
        updates.completionPercentage = 100;
      }
    }

    await ctx.db.patch(args.taskId, updates);
    return args.taskId;
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Verify the task exists and belongs to the user
    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found or access denied");
    }

    // Delete the task and all its subtasks
    await deleteTaskAndSubtasks(ctx, args.taskId, userId);
    return args.taskId;
  },
});

export const updateTaskProgress = mutation({
  args: {
    taskId: v.id("tasks"),
    completionPercentage: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Validate completion percentage
    if (args.completionPercentage < 0 || args.completionPercentage > 100) {
      throw new Error("Completion percentage must be between 0 and 100");
    }

    // Verify the task exists and belongs to the user
    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found or access denied");
    }

    // Update the task progress
    const updates: any = {
      completionPercentage: args.completionPercentage,
    };

    // Update status based on completion percentage
    if (args.completionPercentage === 0) {
      updates.status = "not_started";
    } else if (args.completionPercentage === 100) {
      updates.status = "completed";
    } else {
      updates.status = "in_progress";
    }

    await ctx.db.patch(args.taskId, updates);
    return args.taskId;
  },
});

export const addTimeToTask = mutation({
  args: {
    taskId: v.id("tasks"),
    duration: v.number(), // Duration in milliseconds
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Validate duration
    if (args.duration < 0) {
      throw new Error("Duration must be positive");
    }

    // Verify the task exists and belongs to the user
    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found or access denied");
    }

    // Add the duration to existing time spent
    const newTimeSpent = (task.timeSpent || 0) + args.duration;

    await ctx.db.patch(args.taskId, {
      timeSpent: newTimeSpent,
    });

    return args.taskId;
  },
});

export const completeTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Verify the task exists and belongs to the user
    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found or access denied");
    }

    // Check if this task has children - only allow completion of leaf nodes
    const taskHasChildren = await hasChildren(ctx, args.taskId, userId);
    if (taskHasChildren) {
      throw new Error("Cannot complete a task that has subtasks. Complete all subtasks first.");
    }

    // Complete the task
    await ctx.db.patch(args.taskId, {
      completionPercentage: 100,
      status: "completed"
    });

    // Update parent progress if this task has a parent
    if (task.parentId) {
      await updateParentProgress(ctx, task.parentId, userId);
    }

    return args.taskId;
  },
});
