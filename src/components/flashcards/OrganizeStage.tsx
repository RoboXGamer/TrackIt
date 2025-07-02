import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import FlashcardPageLayout from "./FlashcardPageLayout";
import OrganizeCard from "./OrganizeCard";
import { useProject } from "@/components/providers/ProjectProvider";

type Flashcard = Doc<"flashcards">;

const OrganizeStage = () => {
  const navigate = useNavigate();
  const { selectedProjectId } = useProject();
  const cards = useQuery(api.flashcards.getFlashcards, selectedProjectId ? { projectId: selectedProjectId } : "skip");
  const updateFlashcard = useMutation(api.flashcards.updateFlashcard);
  const deleteCard = useMutation(api.flashcards.deleteFlashcard);
  const [viewMode, setViewMode] = useState<"subject" | "all">("all");
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

  const toggleStar = async (cardId: Id<"flashcards">) => {
    const card = cards?.find((c) => c._id === cardId);
    if (!card || !selectedProjectId) return;

    await updateFlashcard({
      flashcardId: card._id,
      isStarred: !card.isStarred,
      front: card.front,
      back: card.back,
      cardType: card.cardType,
      source: card.source,
      lastReviewed: card.lastReviewed,
      nextReview: card.nextReview,
      subject: card.subject,
      difficulty: card.difficulty,
      projectId: selectedProjectId,
    });
  };

  const handleDeleteCard = async (cardId: Doc<"flashcards">["_id"]) => {
    await deleteCard({ flashcardId: cardId });
  };

  const grouped = groupedCards();

  if (cards === undefined) {
    return (
      <div className="text-center py-12">
        <p className="text-[#93A5CF]">Loading cards...</p>
      </div>
    );
  }

  if (!selectedProjectId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#93A5CF]">Please select a project to view flashcards.</p>
      </div>
    );
  }

  return (
    <FlashcardPageLayout
      title="Organize Your Cards"
      description="Review and organize your flashcards before practice"
      maxWidthClass="max-w-6xl"
      headerChildren={
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            onClick={() => setViewMode("all")}
            className={
              viewMode === "all" ? "bg-[#2563EB]" : "border-[#2563EB]/30"
            }
          >
            <Shuffle className="mr-2" size={16} />
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupCards.map((card, cardIndex) => (
                  <OrganizeCard
                    key={card._id}
                    card={card}
                    groupIndex={groupIndex}
                    cardIndex={cardIndex}
                    toggleStar={toggleStar}
                    handleDeleteCard={handleDeleteCard}
                    handleCardSelect={handleCardSelect}
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
            onClick={() => navigate("/dashboard/flashcards")}
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
