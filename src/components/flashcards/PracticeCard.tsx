import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Doc } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "motion/react";

type Flashcard = Doc<"flashcards">;

export interface PracticeCardRef {
  toggleAnswer: () => void;
}

interface PracticeCardProps {
  card: Flashcard;
  initialShowAnswer?: boolean;
}

const PracticeCard = forwardRef<PracticeCardRef, PracticeCardProps>(
  ({ card, initialShowAnswer = false }, ref) => {
    const [internalShowAnswer, setInternalShowAnswer] =
      useState(initialShowAnswer);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
      setInternalShowAnswer(initialShowAnswer);
    }, [initialShowAnswer, card._id]);

    useImperativeHandle(ref, () => ({
      toggleAnswer: () => {
        setInternalShowAnswer((prev) => !prev);
        setIsFlipped((prev) => !prev);
      },
    }));

    const updateFlashcard = useMutation(api.flashcards.updateFlashcard);

    return (
      <div
        className="bg-[#1C2541] rounded-xl p-0 border border-[#2563EB]/20 hover:border-[#2563EB]/40 cursor-pointer group w-full h-full"
        onClick={() => {
          setInternalShowAnswer((prev) => !prev);
          setIsFlipped((prev) => !prev);
        }}
        style={{ perspective: "1000px" }}
      >
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            className="absolute w-full h-full rounded-xl bg-[#1C2541] p-6"
            style={{ backfaceVisibility: "hidden" }}
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
            </div>

            <div className="space-y-3 text-center mb-6">
              <div className="mb-4">
                <p className="text-sm text-[#93A5CF] mb-1 font-bold">
                  Question
                </p>
                <p className="text-lg font-medium ">{card.front}</p>
              </div>
            </div>
          </div>

          <div
            className="absolute w-full h-full rounded-xl bg-[#1C2541] p-6"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
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
            </div>

            <div className="space-y-3 text-center mb-6">
              <div>
                <p className="text-sm text-[#93A5CF] mb-1 font-bold">Answer</p>
                <p className="text-lg font-medium">{card.back}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  },
);

export default PracticeCard;
