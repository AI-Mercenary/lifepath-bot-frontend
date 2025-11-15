import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";

const StreakTracker = () => {
  const currentStreak = 7;
  const longestStreak = 14;

  return (
    <Card className="p-6 shadow-card bg-gradient-hero text-primary-foreground">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">Current Streak</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold">{currentStreak}</span>
            <span className="text-lg opacity-80">days</span>
          </div>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce-in">
          <Flame className="w-8 h-8" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-sm opacity-90">
          Longest streak: <span className="font-semibold">{longestStreak} days</span> 🎉
        </p>
      </div>
    </Card>
  );
};

export default StreakTracker;
