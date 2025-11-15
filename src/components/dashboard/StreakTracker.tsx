import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Flame, TrendingUp, Calendar } from "lucide-react";

const StreakTracker = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastVisit, setLastVisit] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedLastVisit = localStorage.getItem("lastVisitDate");
    const savedStreak = parseInt(localStorage.getItem("currentStreak") || "0");
    const savedLongest = parseInt(localStorage.getItem("longestStreak") || "0");

    if (!savedLastVisit) {
      setCurrentStreak(1);
      setLongestStreak(1);
      localStorage.setItem("lastVisitDate", today);
      localStorage.setItem("currentStreak", "1");
      localStorage.setItem("longestStreak", "1");
    } else {
      const lastVisitDate = new Date(savedLastVisit);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        setCurrentStreak(savedStreak);
        setLongestStreak(savedLongest);
      } else if (daysDiff === 1) {
        const newStreak = savedStreak + 1;
        const newLongest = Math.max(newStreak, savedLongest);
        setCurrentStreak(newStreak);
        setLongestStreak(newLongest);
        localStorage.setItem("lastVisitDate", today);
        localStorage.setItem("currentStreak", newStreak.toString());
        localStorage.setItem("longestStreak", newLongest.toString());
      } else {
        setCurrentStreak(1);
        setLongestStreak(savedLongest);
        localStorage.setItem("lastVisitDate", today);
        localStorage.setItem("currentStreak", "1");
      }
    }

    setLastVisit(savedLastVisit);
  }, []);

  const getStreakMessage = () => {
    if (currentStreak >= 30) return "Incredible dedication! 🔥";
    if (currentStreak >= 14) return "You're on fire! 🚀";
    if (currentStreak >= 7) return "Great momentum! 💪";
    if (currentStreak >= 3) return "Keep it up! ⭐";
    return "Start your journey! 🌟";
  };

  return (
    <Card className="p-6 shadow-glow bg-gradient-hero text-primary-foreground overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5" />
              <p className="text-sm opacity-90 font-medium">Current Streak</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">{currentStreak}</span>
              <span className="text-lg opacity-80 font-medium">days</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-bounce-in shadow-soft">
            <Flame className="w-9 h-9 drop-shadow-lg" />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 opacity-90">
              <TrendingUp className="w-4 h-4" />
              <span>Longest streak:</span>
            </div>
            <span className="font-semibold">{longestStreak} days</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 opacity-90">
              <Calendar className="w-4 h-4" />
              <span>Status:</span>
            </div>
            <span className="font-medium">{getStreakMessage()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StreakTracker;
