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

  flashcards: defineTable({
    userId: v.id("users"),
    cardType: v.optional(v.string()),
    front: v.string(),
    back: v.string(),
    source: v.optional(v.string()),
    lastReviewed: v.optional(v.number()),
    nextReview: v.optional(v.number()),
    easeFactor: v.optional(v.number()),
    interval: v.optional(v.number()),
    repetitions: v.optional(v.number()),
    correctCount: v.number(),
    incorrectCount: v.number(),
    isStarred: v.boolean(),
    subject: v.optional(v.string()),
    week: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
  })
    .index("by_userId", ["userId"])
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
});
