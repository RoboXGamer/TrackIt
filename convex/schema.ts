import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  projects: defineTable({
    userId: v.id("users"),
    title: v.string(),
  }).index("by_user", ["userId"]),
  tasks: defineTable({
    // Core Fields
    userId: v.id("users"),
    projectId: v.id("projects"),
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
    .index("by_parent_and_order", ["parentId", "order"])
    .index("by_project", ["projectId"]),

  flashcards: defineTable({
    userId: v.id("users"),
    projectId: v.id("projects"),
    cardType: v.optional(v.string()),
    front: v.string(),
    back: v.string(),
    source: v.optional(v.string()),
    lastReviewed: v.optional(v.number()),
    nextReview: v.optional(v.number()),
    isStarred: v.boolean(),
    subject: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
  })
    .index("by_userId", ["userId"])
    .index("by_project", ["projectId"])
    .searchIndex("search_front_back", {
      searchField: "front",
      filterFields: ["userId"],
    })
    .searchIndex("search_back_front", {
      searchField: "back",
      filterFields: ["userId"],
    }),

  flashcard_progress: defineTable({
    userId: v.id("users"),
    flashcardId: v.id("flashcards"),
    // Spaced repetition data
    easeFactor: v.number(),
    interval: v.number(),
    repetitions: v.number(),
    nextReview: v.number(),
    lastReviewed: v.number(),
    // Performance metrics
    correctCount: v.number(),
    incorrectCount: v.number(),
  }).index("by_flashcard_and_user", ["flashcardId", "userId"]),

  flashcard_reviews: defineTable({
    userId: v.id("users"),
    flashcardId: v.id("flashcards"),
    timestamp: v.number(),
    outcome: v.union(v.literal("correct"), v.literal("incorrect")),
    easeFactor: v.number(),
    interval: v.number(),
    repetitions: v.number(),
  }).index("by_flashcard_and_user_timestamp", ["flashcardId", "userId", "timestamp"]),

  user_metadata: defineTable({
    userId: v.id("users"),
    lastStudyDate: v.optional(v.number()),
    streak: v.optional(v.number()),
    totalXp: v.optional(v.number()),
    currentLevel: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  battle_configurations: defineTable({
    userId: v.id("users"),
    testType: v.union(v.literal("full-length"), v.literal("subject-wise")),
    duration: v.number(),
  }).index("by_userId", ["userId"]),

  battle_states: defineTable({
    userId: v.id("users"),
    battleConfigId: v.id("battle_configurations"),
    timeLeft: v.number(), // Time left in seconds
    totalDuration: v.number(), // Total duration in seconds
    isActive: v.boolean(),
    isPaused: v.boolean(),
    phase: v.union(v.literal("idle"), v.literal("active"), v.literal("completed")),
  }).index("by_userId", ["userId"]),

  projectTemplates: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    tasks: v.array(
      v.object({
        templateTaskId: v.string(), // Unique ID for this task within the template
        parentTemplateTaskId: v.optional(v.string()), // References another templateTaskId in this array
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
  }).index("by_title", ["title"]),
});
