import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { X, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import FlashcardPageLayout from "./FlashcardPageLayout";
import PracticeCard, { PracticeCardRef } from "./PracticeCard";

type Flashcard = Doc<"flashcards">;

const PracticeStage = () => {
  const navigate = useNavigate();
  const fetchedCards = useQuery(api.flashcards.getFlashcards);
  const updateUserMetadata = useMutation(api.flashcards.updateUserMetadata);
  const userMetadata = useQuery(api.flashcards.getMyUserMetadata);
  const setFlashcardNextReviewTime = useMutation(
    api.flashcards.setFlashcardNextReviewTime,
  );

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [sessionComplete, setSessionComplete] = useState(false);
  const flashcardDisplayRef = useRef<PracticeCardRef>(null);

  // Derived state for study session based on fetchedCards
  const studySession = {
    total: fetchedCards ? fetchedCards.length : 0,
    correct: 0, // No longer tracked directly from flashcard document
    incorrect: 0, // No longer tracked directly from flashcard document
  };

  useEffect(() => {
    if (fetchedCards) {
      if (cards.length === 0 || fetchedCards.length !== cards.length) {
        setCards(fetchedCards);
        setCurrentCardIndex(0);
        // Removed setStudySession as it is now a derived state
        setSessionComplete(false);
      } else {
        setCards(fetchedCards);
      }
    }
  }, [fetchedCards, cards.length]);

  const currentCard = cards[currentCardIndex];
  const progress =
    cards.length > 0 ? (currentCardIndex / cards.length) * 100 : 0;

  useEffect(() => {
    if (sessionComplete) {
      const today = new Date().setHours(0, 0, 0, 0);
      const lastStudyDate = userMetadata?.lastStudyDate || 0;
      const currentStreak = userMetadata?.streak || 0;

      let newStreak = currentStreak;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      if (lastStudyDate === yesterday.getTime()) {
        newStreak = currentStreak + 1;
      } else if (lastStudyDate < today) {
        newStreak = 1;
      }

      updateUserMetadata({
        lastStudyDate: today,
        streak: newStreak,
        totalXp: userMetadata?.totalXp || 0,
        currentLevel: userMetadata?.currentLevel || 0,
      });

      // No longer need to update individual flashcard review times here
      console.log("Session complete, streak and XP update initiated.");
    }
  }, [sessionComplete, userMetadata, updateUserMetadata, cards]);

  const nextCard = () => {
    if (currentCardIndex + 1 < cards.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // This was the last card in the session
      setSessionComplete(true);
    }
  };

  const handleReview = async (difficulty: "easy" | "medium" | "hard") => {
    if (!currentCard) return;

    await setFlashcardNextReviewTime({
      flashcardId: currentCard._id,
      difficulty,
    });
    nextCard();
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      // Swiping behavior remains but now categorizes as hard
      handleReview(info.offset.x > 0 ? "easy" : "hard");
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#93A5CF]">
          No cards available for practice. Please create some cards in the setup
          stage.
        </p>
        <Button
          onClick={() => navigate("/dashboard/flashcards")}
          className="mt-4 flex items-center gap-2"
        >
          <ChevronLeft size={20} /> Add More Cards
        </Button>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="bg-[#1C2541] rounded-2xl p-8 border border-[#2563EB]/20"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            {/* Star icon is part of FlashcardDisplay now */}
          </motion.div>

          <h2 className="text-3xl font-bold mb-4">Session Complete! 🎉</h2>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0A0E27] p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-400">
                {/* studySession.correct */ "N/A"}
              </div>
              <div className="text-sm text-[#93A5CF]">Correct</div>
            </div>
            <div className="bg-[#0A0E27] p-4 rounded-xl">
              <div className="text-2xl font-bold text-red-400">
                {/* studySession.incorrect */ "N/A"}
              </div>
              <div className="text-sm text-[#93A5CF]">Incorrect</div>
            </div>
            <div className="bg-[#0A0E27] p-4 rounded-xl">
              <div className="text-2xl font-bold text-[#2563EB]">
                {
                  /* Math.round((studySession.correct / studySession.total) * 100) */ "N/A"
                }
                %
              </div>
              <div className="text-sm text-[#93A5CF]">Accuracy</div>
            </div>
          </div>

          <p className="text-[#93A5CF] mb-8">
            Great job! Come back tomorrow to review your cards again.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/dashboard/flashcards/organize")}
              variant="outline"
              className="border-[#2563EB]/30 text-gray-950"
            >
              Review Cards
            </Button>
            <Button
              onClick={() => navigate("/dashboard/flashcards")}
              className="flex items-center gap-2"
            >
              Add More Cards
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <FlashcardPageLayout
      title="Practice Session"
      description="Swipe left/right to categorize. Use buttons below."
      maxWidthClass="max-w-4xl"
      paddingYClass="py-8"
      headerChildren={
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/dashboard/flashcards/organize")}
              variant="ghost"
              size="sm"
              className="text-[#93A5CF]"
            >
              <ChevronLeft size={20} />
              Back to Organize
            </Button>
          </div>

          <div className="text-center">
            <div className="text-sm text-[#93A5CF] mb-1">
              Card {currentCardIndex + 1} of {cards.length}
            </div>
            <Progress value={progress} className="w-32 h-2" />
          </div>

          <div className="flex gap-4 text-sm">
            {/* No longer showing correct/incorrect counts here */}
          </div>
        </div>
      }
    >
      <div className="relative w-full max-w-xl mx-auto h-full">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentCard._id}
            initial={{
              x:
                swipeDirection === "left"
                  ? 300
                  : swipeDirection === "right"
                    ? -300
                    : 0,
              opacity: 0,
              rotate:
                swipeDirection === "left"
                  ? 10
                  : swipeDirection === "right"
                    ? -10
                    : 0,
            }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{
              x:
                swipeDirection === "left"
                  ? -300
                  : swipeDirection === "right"
                    ? 300
                    : 0,
              opacity: 0,
              rotate:
                swipeDirection === "left"
                  ? -10
                  : swipeDirection === "right"
                    ? 10
                    : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            onDragEnd={handleDragEnd}
            dragConstraints={{ left: 0, right: 0 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            {currentCard && (
              <PracticeCard
                key={currentCard._id}
                card={currentCard}
                ref={flashcardDisplayRef}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4 mt-8 px-6">
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white rounded-md flex-1 py-4 text-xl font-bold"
          onClick={() => handleReview("easy")}
        >
          Easy
        </Button>
        <Button
          size="lg"
          className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md flex-1 py-4 text-xl font-bold"
          onClick={() => handleReview("medium")}
        >
          Medium
        </Button>
        <Button
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white rounded-md flex-1 py-4 text-xl font-bold"
          onClick={() => handleReview("hard")}
        >
          Hard
        </Button>
      </div>
    </FlashcardPageLayout>
  );
};

export default PracticeStage;
