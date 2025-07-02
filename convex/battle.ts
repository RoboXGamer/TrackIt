import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const setBattleConfig = mutation({
  args: {
    testType: v.union(v.literal("full-length"), v.literal("subject-wise")),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Called setBattleConfig without authentication");
    }

    // Create or update the battle configuration
    const configId = await ctx.db.insert("battle_configurations", {
      userId,
      testType: args.testType,
      duration: args.duration,
    });

    // Initialize or update the battle state
    const existingBattleState = await ctx.db
      .query("battle_states")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existingBattleState) {
      await ctx.db.patch(existingBattleState._id, {
        battleConfigId: configId,
        timeLeft: args.duration * 60, // Convert minutes to seconds
        totalDuration: args.duration * 60,
        isActive: false,
        isPaused: false,
        phase: "idle",
      });
    } else {
      await ctx.db.insert("battle_states", {
        userId,
        battleConfigId: configId,
        timeLeft: args.duration * 60,
        totalDuration: args.duration * 60,
        isActive: false,
        isPaused: false,
        phase: "idle",
      });
    }
    return configId;
  },
});

export const getBattleState = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null; // Or throw an error, depending on desired behavior for unauthenticated users
    }

    const battleState = await ctx.db
      .query("battle_states")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!battleState) {
      return null;
    }

    const battleConfig = await ctx.db.get(battleState.battleConfigId);

    return { ...battleState, config: battleConfig };
  },
});

export const startBattle = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Called startBattle without authentication");
    }

    const existingBattleState = await ctx.db
      .query("battle_states")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existingBattleState) {
      await ctx.db.patch(existingBattleState._id, {
        isActive: true,
        isPaused: false,
        phase: "active",
      });
    }
  },
});

export const endBattle = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Called endBattle without authentication");
    }

    const existingBattleState = await ctx.db
      .query("battle_states")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existingBattleState) {
      await ctx.db.patch(existingBattleState._id, {
        isActive: false,
        isPaused: false,
        phase: "completed",
      });
    }
  },
});

export const updateTimeLeft = mutation({
  args: {
    time: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Called updateTimeLeft without authentication");
    }

    const existingBattleState = await ctx.db
      .query("battle_states")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existingBattleState) {
      await ctx.db.patch(existingBattleState._id, {
        timeLeft: args.time,
      });
    }
  },
});

export const pauseBattle = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Called pauseBattle without authentication");
    }

    const existingBattleState = await ctx.db
      .query("battle_states")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existingBattleState) {
      await ctx.db.patch(existingBattleState._id, {
        isPaused: true,
      });
    }
  },
});

export const resumeBattle = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Called resumeBattle without authentication");
    }

    const existingBattleState = await ctx.db
      .query("battle_states")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existingBattleState) {
      await ctx.db.patch(existingBattleState._id, {
        isPaused: false,
      });
    }
  },
});
