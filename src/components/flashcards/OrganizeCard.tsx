import { motion } from "motion/react";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Doc, Id } from "../../../convex/_generated/dataModel";

interface OrganizeCardProps {
  card: Doc<"flashcards">;
  groupIndex: number;
  cardIndex: number;
  toggleStar: (cardId: Id<"flashcards">) => Promise<void>;
  handleDeleteCard: (cardId: Id<"flashcards">) => Promise<void>;
  handleCardSelect: (cardId: string) => void;
}

const OrganizeCard: React.FC<OrganizeCardProps> = ({
  card,
  groupIndex,
  cardIndex,
  toggleStar,
  handleDeleteCard,
  handleCardSelect,
}) => {
  return (
    <motion.div
      key={card._id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: groupIndex * 0.1 + cardIndex * 0.05 }}
      className="bg-[#1C2541] rounded-xl p-6 border border-[#2563EB]/20 hover:border-[#2563EB]/40 transition-all cursor-pointer group relative"
      onClick={() => handleCardSelect(card._id)}
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

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              toggleStar(card._id);
            }}
            className={`p-1 rounded-full bg-[#1C2541] hover:bg-[#2563EB]/20 ${card.isStarred ? "text-yellow-500" : "text-gray-400"}`}
          >
            <Star size={16} fill={card.isStarred ? "currentColor" : "none"} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCard(card._id);
            }}
            className="p-1 rounded-full bg-[#1C2541] hover:bg-red-400/20 text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-[#93A5CF] mb-1">Question:</p>
          <p className="font-medium line-clamp-2">{card.front}</p>
        </div>

        <div>
          <p className="text-sm text-[#93A5CF] mb-1">Answer:</p>
          <p className="text-sm text-[#B8C5D6] line-clamp-2">{card.back}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default OrganizeCard; 