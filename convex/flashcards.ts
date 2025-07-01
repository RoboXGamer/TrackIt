import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

interface UserMetadata {
  _id: Id<"user_metadata">;
  _creationTime: number;
  userId: Id<"users">;
  lastStudyDate?: number;
  streak?: number;
  totalXp?: number;
  currentLevel?: number;
}

// Placeholder for flashcard CRUD operations 

export const createFlashcard = mutation({
  args: {
    front: v.string(),
    back: v.string(),
    cardType: v.optional(v.string()),
    source: v.optional(v.string()),
    subject: v.optional(v.string()),
    week: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
  },
  handler: async (ctx, args): Promise<void> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("flashcards", {
      userId: userId,
      front: args.front,
      back: args.back,
      cardType: args.cardType,
      source: args.source,
      lastReviewed: undefined,
      nextReview: undefined,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      correctCount: 0,
      incorrectCount: 0,
      isStarred: false,
      subject: args.subject,
      week: args.week,
      difficulty: args.difficulty,
    });
  },
});

export const getFlashcards = query({
  handler: async (ctx): Promise<Doc<"flashcards">[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("flashcards")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getFlashcardById = query({
  args: {
    flashcardId: v.id("flashcards"),
  },
  handler: async (ctx, args): Promise<Doc<"flashcards"> | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const flashcard = await ctx.db.get(args.flashcardId);
    if (!flashcard || flashcard.userId !== userId) {
      return null;
    }
    return flashcard;
  },
});

export const updateFlashcard = mutation({
  args: {
    flashcardId: v.id("flashcards"),
    front: v.string(),
    back: v.string(),
    cardType: v.optional(v.string()),
    source: v.optional(v.string()),
    lastReviewed: v.optional(v.number()),
    nextReview: v.optional(v.number()),
    easeFactor: v.optional(v.number()),
    interval: v.optional(v.number()),
    repetitions: v.optional(v.number()),
    correctCount: v.optional(v.number()),
    incorrectCount: v.optional(v.number()),
    isStarred: v.optional(v.boolean()),
    subject: v.optional(v.string()),
    week: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
  },
  handler: async (ctx, args): Promise<void> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const { flashcardId, ...rest } = args;

    const existingFlashcard = await ctx.db.get(flashcardId);
    if (!existingFlashcard || existingFlashcard.userId !== userId) {
      throw new Error("Not authorized to update this flashcard");
    }

    await ctx.db.patch(flashcardId, {
      ...rest,
    });
  },
});

export const deleteFlashcard = mutation({
  args: {
    flashcardId: v.id("flashcards"),
  },
  handler: async (ctx, args): Promise<void> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const existingFlashcard = await ctx.db.get(args.flashcardId);
    if (!existingFlashcard || existingFlashcard.userId !== userId) {
      throw new Error("Not authorized to delete this flashcard");
    }

    await ctx.db.delete(args.flashcardId);
  },
});

export const getFlashcardProgress = query({
  args: {
    flashcardId: v.id("flashcards"),
  },
  handler: async (ctx, args): Promise<Doc<"flashcard_progress"> | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const progress = await ctx.db.query("flashcard_progress")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("flashcardId"), args.flashcardId))
      .unique();
    return progress;
  },
});

export const updateFlashcardProgress = mutation({
  args: {
    flashcardId: v.id("flashcards"),
    easeFactor: v.number(),
    interval: v.number(),
    repetitions: v.number(),
    nextReview: v.number(),
    lastReviewed: v.number(),
    correctCount: v.number(),
    incorrectCount: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"flashcard_progress">> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingProgress = await ctx.db.query("flashcard_progress")
      .filter((q) => q.eq(q.field("flashcardId"), args.flashcardId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (existingProgress) {
      await ctx.db.patch(existingProgress._id, {
        easeFactor: args.easeFactor,
        interval: args.interval,
        repetitions: args.repetitions,
        nextReview: args.nextReview,
        lastReviewed: args.lastReviewed,
        correctCount: args.correctCount,
        incorrectCount: args.incorrectCount,
      });
      return existingProgress._id;
    } else {
      return await ctx.db.insert("flashcard_progress", {
        userId,
        flashcardId: args.flashcardId,
        easeFactor: args.easeFactor,
        interval: args.interval,
        repetitions: args.repetitions,
        nextReview: args.nextReview,
        lastReviewed: args.lastReviewed,
        correctCount: args.correctCount,
        incorrectCount: args.incorrectCount,
      });
    }
  },
});

export const getUserMetadata = internalQuery({
  handler: async (ctx): Promise<UserMetadata | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const metadata = await ctx.db
      .query("user_metadata")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    return metadata as UserMetadata | null;
  },
});

export const updateUserMetadata = mutation({
  args: {
    lastStudyDate: v.optional(v.number()),
    streak: v.optional(v.number()),
    totalXp: v.optional(v.number()),
    currentLevel: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<void> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingMetadata = await ctx.db
      .query("user_metadata")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (existingMetadata) {
      await ctx.db.patch(existingMetadata._id, args);
    } else {
      await ctx.db.insert("user_metadata", { userId, ...args });
    }
  },
});

export const getMyUserMetadata = query({
  handler: async (ctx): Promise<UserMetadata | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const metadata = await ctx.db
      .query("user_metadata")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    return metadata as UserMetadata | null;
  },
});

export const setFlashcardNextReviewTime = mutation({
  args: {
    flashcardId: v.id("flashcards"),
    nextReview: v.number(),
  },
  handler: async (ctx, args): Promise<void> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingFlashcard = await ctx.db.get(args.flashcardId);
    if (!existingFlashcard || existingFlashcard.userId !== userId) {
      throw new Error("Not authorized to update this flashcard");
    }

    await ctx.db.patch(args.flashcardId, {
      nextReview: args.nextReview,
    });
  },
}); 