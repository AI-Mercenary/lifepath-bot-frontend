import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const moods = [
  { emoji: "😊", label: "Great", color: "bg-green-100 dark:bg-green-900/30" },
  { emoji: "🙂", label: "Good", color: "bg-blue-100 dark:bg-blue-900/30" },
  { emoji: "😐", label: "Okay", color: "bg-yellow-100 dark:bg-yellow-900/30" },
  { emoji: "😔", label: "Low", color: "bg-orange-100 dark:bg-orange-900/30" },
  { emoji: "😰", label: "Stressed", color: "bg-red-100 dark:bg-red-900/30" },
];

const MoodWidget = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const handleMoodSelect = (index: number) => {
    setSelectedMood(index);
    const mood = moods[index];
    toast.success(`Mood logged: ${mood.label}`);
  };

  return (
    <Card className="p-6 shadow-card">
      <h3 className="font-semibold text-lg mb-4">How are you feeling today?</h3>
      <div className="grid grid-cols-5 gap-2">
        {moods.map((mood, index) => (
          <button
            key={index}
            onClick={() => handleMoodSelect(index)}
            className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
              selectedMood === index
                ? `${mood.color} ring-2 ring-primary`
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
          </button>
        ))}
      </div>
      {selectedMood !== null && (
        <p className="text-sm text-muted-foreground mt-3 text-center animate-fade-in">
          You're feeling {moods[selectedMood].label.toLowerCase()} today
        </p>
      )}
    </Card>
  );
};

export default MoodWidget;
