import  { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Star, Trash2, X, Check, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Doc } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Flashcard = Doc<"flashcards">;

// Define a ref type for FlashcardDisplay to expose internal methods
export interface FlashcardDisplayRef {
  toggleAnswer: () => void;
  markCorrect: () => Promise<void>;
  markIncorrect: () => Promise<void>;
}

interface FlashcardDisplayProps {
  card: Flashcard;
  showAnswer?: boolean; // For PracticeStage, now primarily for initial state
  isPracticeMode?: boolean; // New prop to control visibility of practice buttons
  onMarkCorrect?: () => void; // Callback for when a card is marked correct
  onMarkIncorrect?: () => void; // Callback for when a card is marked incorrect
}

const FlashcardDisplay = forwardRef<FlashcardDisplayRef, FlashcardDisplayProps>((
  {
    card,
    showAnswer: initialShowAnswer = false, // Renamed to initialShowAnswer to prevent conflict with internal state
    isPracticeMode = false,
    onMarkCorrect,
    onMarkIncorrect,
  }, ref) => {
  const [internalShowAnswer, setInternalShowAnswer] = useState(initialShowAnswer);

  // Update internalShowAnswer when initialShowAnswer prop changes (e.g., when a new card is loaded)
  useEffect(() => {
    setInternalShowAnswer(initialShowAnswer);
  }, [initialShowAnswer, card._id]); // Added card._id to dependencies for new card load

  // Expose toggleAnswer method via ref
  useImperativeHandle(ref, () => ({
    toggleAnswer: () => setInternalShowAnswer((prev) => !prev),
    markCorrect: handleMarkCorrectInternal,
    markIncorrect: handleMarkIncorrectInternal,
  }));

  const updateFlashcard = useMutation(api.flashcards.updateFlashcard);
  const deleteFlashcard = useMutation(api.flashcards.deleteFlashcard);

  const handleToggleStar = async () => {
    await updateFlashcard({
      flashcardId: card._id,
      isStarred: !card.isStarred,
      front: card.front,
      back: card.back,
      cardType: card.cardType,
      source: card.source,
      lastReviewed: card.lastReviewed,
      nextReview: card.nextReview,
      easeFactor: card.easeFactor,
      interval: card.interval,
      repetitions: card.repetitions,
      correctCount: card.correctCount,
      incorrectCount: card.incorrectCount,
      subject: card.subject,
      week: card.week,
      difficulty: card.difficulty,
    });
  };

  const handleDeleteCard = async () => {
    await deleteFlashcard({ flashcardId: card._id });
  };

  const handleMarkCorrectInternal = async () => {
    const newCorrectCount = (card.correctCount || 0) + 1;
    await updateFlashcard({
      flashcardId: card._id,
      correctCount: newCorrectCount,
      lastReviewed: Date.now(),
      nextReview: Date.now() + 24 * 60 * 60 * 1000, // 1 day later (example SR logic)
      front: card.front,
      back: card.back,
      cardType: card.cardType,
      source: card.source,
      easeFactor: card.easeFactor,
      interval: card.interval,
      repetitions: card.repetitions,
      incorrectCount: card.incorrectCount,
      isStarred: card.isStarred,
      subject: card.subject,
      week: card.week,
      difficulty: card.difficulty,
    });
    // Call the provided callback if it exists
    onMarkCorrect?.();
  };

  const handleMarkIncorrectInternal = async () => {
    const newIncorrectCount = (card.incorrectCount || 0) + 1;
    await updateFlashcard({
      flashcardId: card._id,
      incorrectCount: newIncorrectCount,
      lastReviewed: Date.now(),
      nextReview: Date.now() + 5 * 60 * 1000, // 5 minutes later (example SR logic)
      front: card.front,
      back: card.back,
      cardType: card.cardType,
      source: card.source,
      easeFactor: card.easeFactor,
      interval: card.interval,
      repetitions: card.repetitions,
      correctCount: card.correctCount,
      isStarred: card.isStarred,
      subject: card.subject,
      week: card.week,
      difficulty: card.difficulty,
    });
    // Call the provided callback if it exists
    onMarkIncorrect?.();
  };

  return (
    <div
      className="bg-[#1C2541] rounded-xl p-6 border border-[#2563EB]/20 hover:border-[#2563EB]/40 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Badge
            variant="outline"
            className={`text-xs mb-2 ${
              card.difficulty === "easy"
                ? "border-green-500 text-green-400"
                : card.difficulty === "hard"
                  ? "border-red-500 text-red-400"
                  : "border-yellow-500 text-yellow-400"
            }`}
          >
            {card.difficulty}
          </Badge>
          {card.subject && (
            <Badge
              variant="secondary"
              className="text-xs ml-2 bg-[#0A0E27] text-[#93A5CF]"
            >
              {card.subject}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStar();
            }}
            className={`p-1 ${card.isStarred ? "text-yellow-500" : "text-gray-400"}`}
          >
            <Star
              size={16}
              fill={card.isStarred ? "currentColor" : "none"}
            />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCard();
            }}
            className="p-1 text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-3 text-center mb-6">
        <div className="mb-4">
          <p className="text-sm text-[#93A5CF] mb-1 font-bold">Question</p>
          <p className="text-lg font-medium ">
            {card.front}
          </p>
        </div>

        {internalShowAnswer && (
          <>
            <hr className="border-[#2563EB]/30 my-4" />
            <div>
              <p className="text-sm text-[#93A5CF] mb-1 font-bold">Answer</p>
              <p className="text-lg font-medium">
                {card.back}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Action buttons always visible in PracticeStage */}
      {isPracticeMode && (
        <div className="flex justify-center gap-4 mt-8">
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleMarkIncorrectInternal();
            }}
          >
            <X size={28} />
          </Button>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setInternalShowAnswer((prev) => !prev);
            }}
          >
            <RefreshCcw size={28} />
          </Button>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white rounded-full w-16 h-16 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleMarkCorrectInternal();
            }}
          >
            <Check size={28} />
          </Button>
        </div>
      )}
    </div>
  );
});

export default FlashcardDisplay; 