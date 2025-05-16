import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  tasks: defineTable({
    // Core Fields
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
    ),

    // Hierarchy & Ordering
    parentId: v.optional(v.id("tasks")),
    order: v.number(),

    // Progress Tracking
    timeSpent: v.optional(v.number()), // Milliseconds spent
    completionPercentage: v.optional(v.number()), // 0-100
  })
    .index("by_user", ["userId"])
    .index("by_parent", ["parentId"])
    .index("by_parent_and_order", ["parentId", "order"]),
});
