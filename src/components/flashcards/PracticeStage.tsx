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
import FlashcardDisplay, { FlashcardDisplayRef } from "./FlashcardDisplay";

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
  const flashcardDisplayRef = useRef<FlashcardDisplayRef>(null);

  // Derived state for study session based on fetchedCards
  const studySession = {
    total: fetchedCards ? fetchedCards.length : 0,
    correct: fetchedCards ? fetchedCards.reduce((sum, card) => sum + (card.correctCount || 0), 0) : 0,
    incorrect: fetchedCards ? fetchedCards.reduce((sum, card) => sum + (card.incorrectCount || 0), 0) : 0,
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
  const progress = cards.length > 0 ? (studySession.total / cards.length) * 100 : 0;

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

      // Use Promise.all to wait for all mutations to complete
      Promise.all(cards.map(async (card) => {
        const newNextReviewTime = Date.now() + 24 * 60 * 60 * 1000; // 1 day from now
        return setFlashcardNextReviewTime({
          flashcardId: card._id,
          nextReview: newNextReviewTime,
        });
      })).then(() => {
        console.log("All flashcard review times updated.");
      }).catch(error => {
        console.error("Error updating flashcard review times:", error);
      });

      console.log("Session complete, streak and XP update initiated.");
    }
  }, [
    sessionComplete,
    userMetadata,
    updateUserMetadata,
    setFlashcardNextReviewTime,
    cards,
  ]);

  const nextCard = () => {
    if (currentCardIndex + 1 < cards.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // This was the last card in the session
      setSessionComplete(true);
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentCard) return;
    setSwipeDirection(direction);

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (direction === "right") {
      await flashcardDisplayRef.current?.markCorrect();
    } else {
      await flashcardDisplayRef.current?.markIncorrect();
    }

    if (currentCardIndex + 1 < cards.length) {
      nextCard();
    } else {
      // This was the last card in the session
      setSessionComplete(true);
    }
    setSwipeDirection(null);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      handleSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        handleSwipe("left");
        break;
      case "ArrowRight":
        handleSwipe("right");
        break;
      case " ":
        event.preventDefault();
        flashcardDisplayRef.current?.toggleAnswer();
        break;
    }
  }, [handleSwipe]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#93A5CF]">No cards available for practice. Please create some cards in the setup stage.</p>
        <Button onClick={() => navigate("/dashboard/flashcards/setup")}
          className="mt-4 flex items-center gap-2">
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
                {studySession.correct}
              </div>
              <div className="text-sm text-[#93A5CF]">Correct</div>
            </div>
            <div className="bg-[#0A0E27] p-4 rounded-xl">
              <div className="text-2xl font-bold text-red-400">
                {studySession.incorrect}
              </div>
              <div className="text-sm text-[#93A5CF]">Incorrect</div>
            </div>
            <div className="bg-[#0A0E27] p-4 rounded-xl">
              <div className="text-2xl font-bold text-[#2563EB]">
                {Math.round((studySession.correct / studySession.total) * 100)}%
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
              onClick={() => navigate("/dashboard/flashcards/review")}
              className="bg-[#2563EB] hover:bg-[#1E3A8A]"
            >
              Set Review Timer
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-[#93A5CF]">Loading cards...</p>
      </div>
    );
  }

  return (
    <FlashcardPageLayout
      title="Practice Session"
      description="Swipe left for incorrect, right for correct. Tap to reveal answer."
      maxWidthClass="max-w-4xl"
      paddingYClass="py-8"
      headerChildren={(
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
            <div className="text-green-400">✓ {studySession.correct}</div>
            <div className="text-red-400">✗ {studySession.incorrect}</div>
          </div>
        </div>
      )}
    >
      <div className="relative w-full max-w-lg mx-auto h-[400px]">
        <AnimatePresence initial={false}>
          {currentCard && (
            <motion.div
              key={currentCard._id}
              initial={{
                opacity: 0,
                x: swipeDirection === "left" ? 300 : swipeDirection === "right" ? -300 : 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                },
              }}
              exit={{
                opacity: 0,
                x: swipeDirection === "left" ? -300 : 300,
                scale: 0.8,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                },
              }}
              drag="x"
              onDragEnd={handleDragEnd}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              className="absolute w-full h-full"
            >
              <FlashcardDisplay
                ref={flashcardDisplayRef}
                card={currentCard}
                isPracticeMode={true}
                onMarkCorrect={nextCard}
                onMarkIncorrect={nextCard}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center text-sm text-[#93A5CF] mt-4">
        <p className="mb-1">
          Swipe left (<X size={14} className="inline-block align-middle" />) if you didn't know it • Space to show answer • Swipe right (<Check size={14} className="inline-block align-middle" />) if you got it right
        </p>
        <p>Keyboard: ← → for swipe, Space for answer</p>
      </div>

      <div className="flex justify-between items-center mt-8 px-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/flashcards")}
          className="text-[#93A5CF] border-[#2563EB]/30 flex items-center gap-2"
        >
          <ChevronLeft size={20} /> Exit
        </Button>

        <Progress value={progress} className="w-1/2 h-2 rounded-full" />

      </div>
    </FlashcardPageLayout>
  );
};

export default PracticeStage;
