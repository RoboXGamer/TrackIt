import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Calendar, Shuffle, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import FlashcardPageLayout from "./FlashcardPageLayout";
import FlashcardDisplay from "./FlashcardDisplay";

type Flashcard = Doc<"flashcards">;

const OrganizeStage = () => {
  const navigate = useNavigate();
  const cards = useQuery(api.flashcards.getFlashcards);
  const updateFlashcard = useMutation(api.flashcards.updateFlashcard);
  const deleteFlashcard = useMutation(api.flashcards.deleteFlashcard);
  const [viewMode, setViewMode] = useState<"subject" | "week" | "all">("all");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const groupedCards = (): Record<string, Flashcard[]> => {
    if (!cards) return {};

    if (viewMode === "subject") {
      return cards.reduce(
        (acc, card) => {
          const subject = card.subject || "Uncategorized";
          if (!acc[subject]) acc[subject] = [];
          acc[subject].push(card);
          return acc;
        },
        {} as Record<string, Flashcard[]>,
      );
    } else if (viewMode === "week") {
      return cards.reduce(
        (acc, card) => {
          const week = card.week || "No Week";
          if (!acc[week]) acc[week] = [];
          acc[week].push(card);
          return acc;
        },
        {} as Record<string, Flashcard[]>,
      );
    }
    return { "All Cards": cards };
  };

  const handleStartPractice = () => {
    if (!cards || cards.length === 0) return;
    navigate("/dashboard/flashcards/practice");
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId],
    );
  };

  const handleToggleStar = async (card: Flashcard) => {
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

  const handleDeleteCard = async (cardId: Doc<"flashcards">["_id"]) => {
    await deleteFlashcard({ flashcardId: cardId });
  };

  const grouped = groupedCards();

  if (cards === undefined) {
    return (
      <div className="text-center py-12">
        <p className="text-[#93A5CF]">Loading cards...</p>
      </div>
    );
  }

  return (
    <FlashcardPageLayout
      title="Organize Your Cards"
      description="Review and organize your flashcards before practice"
      maxWidthClass="max-w-6xl"
      headerChildren={
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            onClick={() => setViewMode("all")}
            className={
              viewMode === "all" ? "bg-[#2563EB]" : "border-[#2563EB]/30"
            }
          >
            <BookOpen className="mr-2" size={16} />
            All Cards
          </Button>
          <Button
            variant={viewMode === "subject" ? "default" : "outline"}
            onClick={() => setViewMode("subject")}
            className={
              viewMode === "subject" ? "bg-[#2563EB]" : "border-[#2563EB]/30"
            }
          >
            <BookOpen className="mr-2" size={16} />
            By Subject
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            onClick={() => setViewMode("week")}
            className={
              viewMode === "week" ? "bg-[#2563EB]" : "border-[#2563EB]/30"
            }
          >
            <Calendar className="mr-2" size={16} />
            By Week
          </Button>
        </div>
      }
    >
      {/* Cards Display */}
      <div className="space-y-8">
        {cards &&
          Object.entries(grouped).map(([groupName, groupCards], groupIndex) => (
            <motion.div
              key={groupName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  {viewMode === "subject" && <BookOpen size={24} />}
                  {viewMode === "week" && <Calendar size={24} />}
                  {viewMode === "all" && <Shuffle size={24} />}
                  {groupName}
                  <Badge
                    variant="secondary"
                    className="bg-[#1C2541] text-[#93A5CF]"
                  >
                    {groupCards.length}
                  </Badge>
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupCards.map((card) => (
                  <FlashcardDisplay
                    key={card._id}
                    card={card}
                    showAnswer={true}
                    isPracticeMode={false}
                  />
                ))}
              </div>
            </motion.div>
          ))}
      </div>

      {cards && cards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 flex justify-center gap-4"
        >
          <Button
            onClick={handleStartPractice}
            className="bg-[#2563EB] hover:bg-[#1E3A8A] h-12 px-8 text-lg"
          >
            Start Practice Session →
          </Button>
          <Button
            onClick={() => navigate("/dashboard/flashcards/review")}
            variant="outline"
            className="border-[#2563EB]/30 text-gray-950 h-12 px-8 text-lg"
          >
            Set Review Timer
          </Button>
          <Button
            onClick={() => navigate("/dashboard/flashcards")}
            variant="secondary"
            className="bg-[#0A0E27] text-[#93A5CF] h-12 px-8 text-lg flex items-center gap-2"
          >
            <BookOpen size={20} /> Add More Cards
          </Button>
        </motion.div>
      )}

      {(cards === undefined || cards.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen size={64} className="mx-auto text-[#93A5CF] mb-4" />
          <h3 className="text-xl font-semibold mb-2">No cards yet</h3>
          <p className="text-[#93A5CF] mb-6">
            Go back to create some flashcards first
          </p>
          <Button
            onClick={() => navigate("/dashboard/flashcards/setup")}
            className="bg-[#2563EB] hover:bg-[#1E3A8A] h-12 px-8 text-lg flex items-center gap-2"
          >
            <BookOpen size={20} /> Add More Cards
          </Button>
        </motion.div>
      )}
    </FlashcardPageLayout>
  );
};

export default OrganizeStage;
