import { useState } from "react";
import { motion } from "motion/react";
import { Upload, Plus, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import FlashcardPageLayout from "./FlashcardPageLayout";

const SetupStage = () => {
  const navigate = useNavigate();
  const createFlashcard = useMutation(api.flashcards.createFlashcard);
  // TODO: Implement actual AI card generation using Convex mutation
  const generateCards = useMutation(api.flashcards.createFlashcard); // Placeholder for AI generation
  const [file, setFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [manualCard, setManualCard] = useState({
    front: "",
    back: "",
    subject: "",
    week: "",
    difficulty: "medium" as const,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleGenerateFromContent = async () => {
    if (!file && !videoURL) return;

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(async () => {
      // This should ideally call a Convex action for AI generation
      // For now, we'll just navigate to the next stage
      // generateCardsFromContent({ file, videoURL });
      await generateCards({
        front: "AI Generated Front",
        back: "AI Generated Back",
        difficulty: "medium",
        source: "ai_generated",
      });
      setIsGenerating(false);
      navigate("/dashboard/flashcards/organize");
    }, 2000);
  };

  const handleAddManualCard = async () => {
    if (manualCard.front.trim() && manualCard.back.trim()) {
      await createFlashcard({
        front: manualCard.front,
        back: manualCard.back,
        subject: manualCard.subject || undefined,
        week: manualCard.week || undefined,
        difficulty: manualCard.difficulty,
        source: "manual",
      });
      setManualCard({
        front: "",
        back: "",
        subject: "",
        week: "",
        difficulty: "medium",
      });
    }
  };

  const handleContinueToOrganize = () => {
    navigate("/dashboard/flashcards/organize");
  };

  return (
    <FlashcardPageLayout
      title="Create Your Flashcards"
      description="Upload content for AI generation or create cards manually"
      maxWidthClass="max-w-4xl"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Generation Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1C2541] p-8 rounded-2xl border border-[#2563EB]/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <Wand2 className="text-[#2563EB]" size={24} />
            <h3 className="text-2xl font-semibold">AI Generation</h3>
          </div>

          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-[#93A5CF] mb-2">
                Upload PDF, Image, or Document
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,application/pdf,.txt,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full p-6 border-2 border-dashed border-[#2563EB]/30 rounded-xl hover:border-[#2563EB]/50 cursor-pointer transition-colors"
                >
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-[#2563EB]" size={32} />
                    <p className="text-sm text-[#93A5CF]">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-[#93A5CF] mb-2">
                Or paste a video URL
              </label>
              <Input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={videoURL}
                onChange={(e) => setVideoURL(e.target.value)}
                className="bg-[#0A0E27] border-[#2563EB]/30"
              />
            </div>

            <Button
              onClick={handleGenerateFromContent}
              disabled={(!file && !videoURL) || isGenerating}
              className="w-full bg-[#2563EB] hover:bg-[#1E3A8A] h-12"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <Wand2 size={16} />
                  </motion.div>
                  Generating Cards...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2" size={16} />
                  Generate Flashcards
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Manual Creation Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1C2541] p-8 rounded-2xl border border-[#2563EB]/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <Plus className="text-[#2563EB]" size={24} />
            <h3 className="text-2xl font-semibold">Manual Creation</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#93A5CF] mb-2">
                Question
              </label>
              <Textarea
                placeholder="Enter your question..."
                value={manualCard.front}
                onChange={(e) =>
                  setManualCard({ ...manualCard, front: e.target.value })
                }
                className="bg-[#0A0E27] border-[#2563EB]/30 min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#93A5CF] mb-2">
                Answer
              </label>
              <Textarea
                placeholder="Enter the answer..."
                value={manualCard.back}
                onChange={(e) =>
                  setManualCard({ ...manualCard, back: e.target.value })
                }
                className="bg-[#0A0E27] border-[#2563EB]/30 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#93A5CF] mb-2">
                  Subject
                </label>
                <Input
                  placeholder="Math, Science..."
                  value={manualCard.subject}
                  onChange={(e) =>
                    setManualCard({ ...manualCard, subject: e.target.value })
                  }
                  className="bg-[#0A0E27] border-[#2563EB]/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#93A5CF] mb-2">
                  Difficulty
                </label>
                <Select
                  value={manualCard.difficulty}
                  onValueChange={(value: any) =>
                    setManualCard({ ...manualCard, difficulty: value })
                  }
                >
                  <SelectTrigger className="w-full bg-[#0A0E27] border-[#2563EB]/30">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C2541]">
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#93A5CF] mb-2">
                  Week
                </label>
                <Input
                  placeholder="Week 1, Week 2..."
                  value={manualCard.week}
                  onChange={(e) =>
                    setManualCard({ ...manualCard, week: e.target.value })
                  }
                  className="bg-[#0A0E27] border-[#2563EB]/30"
                />
              </div>

              {/* Add other fields as necessary */}
            </div>

            <Button
              onClick={handleAddManualCard}
              className="w-full bg-[#2563EB] hover:bg-[#1E3A8A] h-12"
            >
              <Plus className="mr-2" size={16} />
              Add Flashcard
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-12"
      >
        <Button
          onClick={handleContinueToOrganize}
          className="bg-[#2563EB] hover:bg-[#1E3A8A] h-12 px-8 text-lg"
        >
          Continue to Organize Cards →
        </Button>
      </motion.div>
    </FlashcardPageLayout>
  );
};

export default SetupStage;
