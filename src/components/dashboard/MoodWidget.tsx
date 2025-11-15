import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Smile } from "lucide-react";

const moods = [
  { emoji: "😊", label: "Great", color: "bg-primary/10", hoverColor: "hover:bg-primary/20" },
  { emoji: "🙂", label: "Good", color: "bg-accent/20", hoverColor: "hover:bg-accent/30" },
  { emoji: "😐", label: "Okay", color: "bg-muted", hoverColor: "hover:bg-muted/80" },
  { emoji: "😔", label: "Low", color: "bg-secondary/20", hoverColor: "hover:bg-secondary/30" },
  { emoji: "😰", label: "Stressed", color: "bg-destructive/10", hoverColor: "hover:bg-destructive/20" },
];

interface MoodEntry {
  mood: number;
  note?: string;
  timestamp: string;
}

const MoodWidget = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedMoods = localStorage.getItem("moodHistory");
    
    if (savedMoods) {
      const moodHistory: MoodEntry[] = JSON.parse(savedMoods);
      const todayEntry = moodHistory.find(
        entry => new Date(entry.timestamp).toDateString() === today
      );
      if (todayEntry) {
        setSelectedMood(todayEntry.mood);
        setNote(todayEntry.note || "");
        setTodaysMood(todayEntry);
      }
    }
  }, []);

  const handleMoodSelect = (index: number) => {
    setSelectedMood(index);
    setShowNote(true);
  };

  const saveMood = () => {
    if (selectedMood === null) return;

    const today = new Date().toDateString();
    const savedMoods = localStorage.getItem("moodHistory");
    let moodHistory: MoodEntry[] = savedMoods ? JSON.parse(savedMoods) : [];

    moodHistory = moodHistory.filter(
      entry => new Date(entry.timestamp).toDateString() !== today
    );

    const newEntry: MoodEntry = {
      mood: selectedMood,
      note: note.trim(),
      timestamp: new Date().toISOString(),
    };

    moodHistory.push(newEntry);
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
    setTodaysMood(newEntry);
    setShowNote(false);

    const mood = moods[selectedMood];
    toast.success(`Mood logged: ${mood.label} 🎯`);
  };

  return (
    <Card className="p-6 shadow-card border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Smile className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg text-foreground">How are you feeling?</h3>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {moods.map((mood, index) => (
          <button
            key={index}
            onClick={() => handleMoodSelect(index)}
            className={`p-3 rounded-xl transition-all duration-300 transform ${
              selectedMood === index
                ? `${mood.color} ring-2 ring-primary scale-105`
                : `bg-muted/50 ${mood.hoverColor}`
            } hover:scale-110`}
            title={mood.label}
          >
            <span className="text-2xl">{mood.emoji}</span>
          </button>
        ))}
      </div>

      {selectedMood !== null && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-sm text-muted-foreground text-center">
            You're feeling <span className="font-medium text-foreground">{moods[selectedMood].label.toLowerCase()}</span> today
          </p>

          {showNote && !todaysMood && (
            <div className="space-y-2 animate-slide-up">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about how you're feeling... (optional)"
                className="min-h-[60px] resize-none text-sm"
              />
              <Button 
                onClick={saveMood} 
                size="sm" 
                className="w-full bg-primary hover:bg-primary-dark"
              >
                Save Mood
              </Button>
            </div>
          )}

          {todaysMood && todaysMood.note && (
            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground italic">"{todaysMood.note}"</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default MoodWidget;
