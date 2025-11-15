import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Flame, Target, Smile, Menu, User, TrendingUp } from "lucide-react";
import MoodWidget from "@/components/dashboard/MoodWidget";
import StreakTracker from "@/components/dashboard/StreakTracker";
import QuickTasks from "@/components/dashboard/QuickTasks";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      const data = JSON.parse(profile);
      setUserName(data.name || "Student");
    }
  }, []);

  const motivationalQuotes = [
    "Progress, not perfection. You're doing great!",
    "Every small step counts toward your big goals.",
    "Consistency is your superpower. Keep showing up!",
    "Your future self will thank you for today's effort.",
  ];

  const todayQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                <Flame className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">LifePathBot</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/goals")}
                className="hover:bg-muted/50"
                title="My Goals"
              >
                <Target className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
                className="hover:bg-muted/50"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            Welcome back, {userName}! 👋
          </h2>
          <p className="text-lg text-muted-foreground">Let's make today count.</p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Motivational Quote */}
            <Card className="p-6 bg-gradient-warm border-0 shadow-soft animate-slide-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-start space-x-3 text-white">
                <Smile className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-lg leading-relaxed">{todayQuote}</p>
                </div>
              </div>
            </Card>

            {/* Chat with Bot CTA */}
            <Card className="p-8 shadow-card hover:shadow-glow border-border/50 transition-all duration-300 cursor-pointer group relative overflow-hidden" onClick={() => navigate("/chat")}>
              <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 flex items-center text-foreground">
                    <MessageCircle className="w-6 h-6 mr-3 text-primary" />
                    Chat with LifePathBot
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ready to reflect on your day? I'm here to help you stay on track!
                  </p>
                </div>
                <div className="ml-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-soft">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Tasks */}
            <QuickTasks />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Streak Tracker */}
            <StreakTracker />

            {/* Mood Widget */}
            <MoodWidget />

            {/* Weekly Progress */}
            <Card className="p-6 shadow-card border-border/50">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-lg text-foreground">Weekly Progress</h3>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium">Goals Completed</span>
                    <span className="font-semibold text-foreground">3/5</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-hero w-3/5 transition-all duration-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium">Study Hours</span>
                    <span className="font-semibold text-foreground">18/20h</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-warm w-[90%] transition-all duration-500 rounded-full" />
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-5 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary font-medium"
                onClick={() => navigate("/analytics")}
              >
                View Detailed Analytics
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
