import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, Calendar, Flame, Star, RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import FlashcardPageLayout from "./FlashcardPageLayout";

type FlashcardDoc = Doc<"flashcards">;

const ReviewTimerStage = () => {
  const navigate = useNavigate();
  const userMetadata = useQuery(api.flashcards.getMyUserMetadata); // Fetch user metadata
  const allFlashcards = useQuery(api.flashcards.getFlashcards);

  // Local state for UI display, updated from Convex data
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [canReview, setCanReview] = useState(false);

  // Derive values from userMetadata and allFlashcards
  const streak = userMetadata?.streak || 0;
  const points = userMetadata?.totalXp || 0;
  const level = userMetadata?.currentLevel || 0;
  const totalCards = allFlashcards?.length || 0;

  // Calculate nextReviewTime from allFlashcards
  const nextReviewTime = allFlashcards
    ? Math.min(...allFlashcards.map((card) => card.nextReview || Infinity))
    : Infinity;

  // For simplicity, let's assume studySession data is updated elsewhere (e.g., PracticeStage)
  // If not, you might need a separate query or aggregation for recent reviews
  const studySession = {
    total: 0, // Placeholder, actual value would come from a review aggregation
    correct: 0, // Placeholder
    incorrect: 0, // Placeholder
  };

  useEffect(() => {
    const updateTimer = () => {
      if (!nextReviewTime || nextReviewTime === Infinity) {
        setCanReview(true);
        setTimeLeft("Ready to review!");
        return;
      }

      const now = Date.now();
      const timeDiff = nextReviewTime - now;

      if (timeDiff <= 0) {
        setCanReview(true);
        setTimeLeft("Ready to review!");
      } else {
        setCanReview(false);
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextReviewTime]);

  const handleStartNewSession = () => {
    navigate("/dashboard/flashcards/practice");
  };

  const getMotivationalMessage = () => {
    if (streak === 0) return "Start your learning streak today! 🚀";
    if (streak < 3) return "Keep going! You're building a great habit! 💪";
    if (streak < 7) return "Amazing! You're on fire! 🔥";
    if (streak < 15)
      return "Incredible dedication! You're a learning machine! ⚡";
    return "You're absolutely crushing it! Learning legend! 🏆";
  };

  const getStreakBadge = () => {
    if (streak >= 30)
      return { emoji: "🏆", title: "Master", color: "text-yellow-500" };
    if (streak >= 15)
      return { emoji: "💎", title: "Diamond", color: "text-blue-400" };
    if (streak >= 7)
      return { emoji: "🔥", title: "Fire", color: "text-orange-500" };
    if (streak >= 3)
      return { emoji: "⭐", title: "Rising Star", color: "text-yellow-400" };
    return { emoji: "🌱", title: "Beginner", color: "text-green-400" };
  };

  const badge = getStreakBadge();

  if (userMetadata === undefined || allFlashcards === undefined) {
    return (
      <div className="text-center py-12">
        <p className="text-[#93A5CF]">Loading review data...</p>
      </div>
    );
  }

  return (
    <FlashcardPageLayout
      title={canReview ? "Ready to Review!" : "Review Timer"}
      description={getMotivationalMessage()}
      headerChildren={(
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="inline-block mb-6"
        >
          <Clock size={80} className="text-[#2563EB] mx-auto" />
        </motion.div>
      )}
    >
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1C2541] p-6 rounded-2xl text-center border border-[#2563EB]/20"
        >
          <Flame className="text-orange-500 mx-auto mb-3" size={32} />
          <div className="text-2xl font-bold text-orange-500">{streak}</div>
          <div className="text-sm text-[#93A5CF]">Day Streak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1C2541] p-6 rounded-2xl text-center border border-[#2563EB]/20"
        >
          <Star className="text-yellow-500 mx-auto mb-3" size={32} />
          <div className="text-2xl font-bold text-yellow-500">{points}</div>
          <div className="text-sm text-[#93A5CF]">Total XP</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1C2541] p-6 rounded-2xl text-center border border-[#2563EB]/20"
        >
          <div className="text-3xl mb-2">{badge.emoji}</div>
          <div className={`text-2xl font-bold ${badge.color}`}>
            Level {level}
          </div>
          <div className="text-sm text-[#93A5CF]">{badge.title}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1C2541] p-6 rounded-2xl text-center border border-[#2563EB]/20"
        >
          <Calendar className="text-[#2563EB] mx-auto mb-3" size={32} />
          <div className="text-2xl font-bold text-[#2563EB]">
            {totalCards}
          </div>
          <div className="text-sm text-[#93A5CF]">Total Cards</div>
        </motion.div>
      </div>

      {/* Timer Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-[#1C2541] rounded-2xl p-12 text-center mb-8 border border-[#2563EB]/20"
      >
        {canReview ? (
          <div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-6xl font-mono font-bold text-green-400 mb-4"
            >
              ✅ READY
            </motion.div>
            <p className="text-xl text-[#93A5CF] mb-6">
              Your cards are ready for review! Time to boost your learning.
            </p>
          </div>
        ) : (
          <div>
            <div className="text-6xl font-mono font-bold text-[#2563EB] mb-4">
              {timeLeft}
            </div>
            <p className="text-xl text-[#93A5CF] mb-6">
              Until your next review session
            </p>
            <p className="text-sm text-[#93A5CF]">
              Spaced repetition helps you remember better. Come back when the
              timer is up!
            </p>
          </div>
        )}
      </motion.div>

      {/* Last Session Summary */}
      {studySession.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1C2541] rounded-2xl p-8 mb-8 border border-[#2563EB]/20"
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            Last Session Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {studySession.correct}
              </div>
              <div className="text-sm text-[#93A5CF]">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {studySession.incorrect}
              </div>
              <div className="text-sm text-[#93A5CF]">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2563EB]">
                {Math.round((studySession.correct / studySession.total) * 100)}%
              </div>
              <div className="text-sm text-[#93A5CF]">Accuracy</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="text-center mt-8">
        <Button
          onClick={handleStartNewSession}
          disabled={!canReview}
          className="bg-[#2563EB] hover:bg-[#1E3A8A] h-12 px-8 text-lg"
        >
          <RotateCcw className="mr-2" size={20} />
          Start New Review Session
        </Button>
      </div>
    </FlashcardPageLayout>
  );
};

export default ReviewTimerStage;
