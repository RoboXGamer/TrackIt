import { useState } from "react";
import { useNavigate } from "react-router";
// import { useBattleStore } from "../../../stores/battleStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  testType: "full-length" | "subject-wise" | "";
  duration: string;
}

const WarConfiguration = () => {
  const navigate = useNavigate();
  const setBattleConfig = useMutation(api.battle.setBattleConfig);
  const startBattle = useMutation(api.battle.startBattle);

  const [formData, setFormData] = useState<FormData>({
    testType: "",
    duration: "",
  });

  const onNext = () => {
    navigate("/dashboard/war/battle");
  };
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getDurationOptions = () => {
    if (formData.testType === "full-length") {
      return [
        { value: "60", label: "60 Minutes" },
        { value: "90", label: "90 Minutes" },
        { value: "120", label: "2 Hours" },
        { value: "180", label: "3 Hours" },
      ];
    } else if (formData.testType === "subject-wise") {
      return [
        { value: "25", label: "25 Minutes" },
        { value: "30", label: "30 Minutes" },
        { value: "35", label: "35 Minutes" },
      ];
    }
    return [];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.testType) {
      newErrors.testType = "Please select a test type";
    }

    if (!formData.duration) {
      newErrors.duration = "Please select a duration";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const config = {
      testType: formData.testType as "full-length" | "subject-wise",
      duration: parseInt(formData.duration),
    };

    await setBattleConfig(config);
    await startBattle();
    onNext();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto w-full">
        <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-5xl font-black text-white mb-4">
              🏹 WAR PREPARATION
            </CardTitle>
            <p className="text-xl text-slate-300">
              Configure your battle parameters before entering the arena
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Test Type */}
              <div>
                <label className="block text-slate-200 font-semibold mb-2">
                  ⚔️ Test Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange("testType", "full-length")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.testType === "full-length"
                        ? "border-orange-400 bg-orange-400/20 text-orange-200"
                        : "border-slate-500 bg-slate-700/30 text-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-semibold">Full Length</div>
                    <div className="text-sm opacity-80">
                      Complete exam simulation
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("testType", "subject-wise")
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.testType === "subject-wise"
                        ? "border-orange-400 bg-orange-400/20 text-orange-200"
                        : "border-slate-500 bg-slate-700/30 text-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <div className="text-2xl mb-2">📚</div>
                    <div className="font-semibold">Subject Wise</div>
                    <div className="text-sm opacity-80">
                      Focused topic practice
                    </div>
                  </button>
                </div>
                {errors.testType && (
                  <p className="text-red-400 text-sm mt-1">{errors.testType}</p>
                )}
              </div>

              {/* Duration */}
              {formData.testType && (
                <div>
                  <label className="block text-slate-200 font-semibold mb-2">
                    ⏱️ Duration
                  </label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) =>
                      handleInputChange("duration", value)
                    }
                  >
                    <SelectTrigger className="w-full bg-slate-700/50 border border-slate-500 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:outline-none transition-colors">
                      <SelectValue placeholder="Select duration..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border border-slate-500 rounded-xl text-white">
                      {getDurationOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.duration && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.duration}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="bg-slate-700/50 border-slate-500 text-slate-200 hover:bg-slate-600/50 text-lg h-full"
                >
                  ← Back to Home
                </Button>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-black text-lg py-6"
                >
                  🗡️ START THE WAR
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarConfiguration;
