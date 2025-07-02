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
import { useQuery } from "convex/react";
import { useProject } from "@/components/providers/ProjectProvider";

const SetupStage = () => {
  const navigate = useNavigate();
  const createFlashcard = useMutation(api.flashcards.createFlashcard);
  // TODO: Implement actual AI card generation using Convex mutation
  const generateCards = useMutation(api.flashcards.createFlashcard); // Placeholder for AI generation
  const [file, setFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { selectedProjectId } = useProject();
  const topLevelTasks = useQuery(
    api.tasks.listTopLevelTasksByProject,
    selectedProjectId ? { projectId: selectedProjectId } : "skip",
  );

  const [manualCard, setManualCard] = useState({
    front: "",
    back: "",
    subject: "",
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
    if (!selectedProjectId) {
      console.error("No project selected. Cannot generate flashcards.");
      return;
    }

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
        projectId: selectedProjectId,
      });
      setIsGenerating(false);
      navigate("/dashboard/flashcards/organize");
    }, 2000);
  };

  const handleAddManualCard = async () => {
    if (!selectedProjectId) {
      console.error("No project selected. Cannot create flashcard.");
      return;
    }
    if (manualCard.front.trim() && manualCard.back.trim()) {
      await createFlashcard({
        front: manualCard.front,
        back: manualCard.back,
        subject: manualCard.subject || undefined,
        difficulty: manualCard.difficulty,
        source: "manual",
        projectId: selectedProjectId,
      });
      setManualCard({
        front: "",
        back: "",
        subject: "",
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
          className="bg-[#1C2541] p-8 rounded-2xl border border-[#2563EB]/20 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <Wand2 className="text-[#2563EB]" size={24} />
            <h3 className="text-2xl font-semibold">AI Generation</h3>
          </div>

          <div className="flex flex-col gap-6 flex-grow">
            {/* File Upload */}
            <div className="flex-grow mb-6">
              <label className="block text-sm font-medium text-[#93A5CF] mb-2">
                Upload PDF, Image, or Document
              </label>
              <div className="relative flex-grow h-full">
                <input
                  type="file"
                  accept="image/*,application/pdf,.txt,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full h-full p-6 border-2 border-dashed border-[#2563EB]/30 rounded-xl hover:border-[#2563EB]/50 cursor-pointer transition-colors"
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
            <div className="flex-shrink-0">
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
              disabled={
                (!file && !videoURL) || isGenerating || !selectedProjectId
              }
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
                <Select
                  value={manualCard.subject}
                  onValueChange={(value: string) =>
                    setManualCard({ ...manualCard, subject: value })
                  }
                >
                  <SelectTrigger className="w-full bg-[#0A0E27] border-[#2563EB]/30">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C2541]">
                    {topLevelTasks?.map((task) => (
                      <SelectItem key={task._id} value={task.title}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C2541]">
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAddManualCard}
              disabled={
                !manualCard.front.trim() ||
                !manualCard.back.trim() ||
                !selectedProjectId
              }
              className="w-full bg-[#2563EB] hover:bg-[#1E3A8A] h-12"
            >
              <Plus className="mr-2" size={16} />
              Add Flashcard
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          variant="secondary"
          onClick={handleContinueToOrganize}
          className="w-full max-w-xs h-12 text-lg"
        >
          Continue to Organize
        </Button>
      </div>
    </FlashcardPageLayout>
  );
};

export default SetupStage;
