import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Flame,
  Target,
  Smile,
  User,
  TrendingUp,
  BookOpen,
  Calendar,
  Sparkles,
  Menu,
  GraduationCap,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import MoodWidget from "@/components/dashboard/MoodWidget";
import StreakTracker from "@/components/dashboard/StreakTracker";
import QuickTasks from "@/components/dashboard/QuickTasks";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, goals, reflections, examMode } = useApp();
  const userName = user?.name || "Student";

  const motivationalQuotes = [
    "Progress, not perfection. You're doing great!",
    "Every small step counts toward your big goals.",
    "Consistency is your superpower. Keep showing up!",
    "Your future self will thank you for today's effort.",
  ];

  const todayQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  const activeGoals = goals.filter((g) => !g.isCompleted && g.progress < 100);
  const completedGoals = goals.filter((g) => g.isCompleted || g.progress === 100);
  const recentReflections = reflections.slice(0, 3);

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
              {examMode && (
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Exam Mode
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
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

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chat with Bot */}
              <Card
                className="p-6 shadow-card hover:shadow-glow border-border/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => navigate("/chat")}
              >
                <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-foreground">Chat with LifePathBot</h3>
                  <p className="text-sm text-muted-foreground">Reflect on your day and get guidance</p>
                </div>
              </Card>

              {/* Goals */}
              <Card
                className="p-6 shadow-card hover:shadow-glow border-border/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => navigate("/goals")}
              >
                <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-foreground">My Goals</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeGoals.length} active, {completedGoals.length} completed
                  </p>
                </div>
              </Card>

              {/* Reflections */}
              <Card
                className="p-6 shadow-card hover:shadow-glow border-border/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => navigate("/reflections")}
              >
                <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-foreground">Daily Reflections</h3>
                  <p className="text-sm text-muted-foreground">{reflections.length} reflections logged</p>
                </div>
              </Card>

              {/* Analytics */}
              <Card
                className="p-6 shadow-card hover:shadow-glow border-border/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => navigate("/analytics")}
              >
                <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-foreground">Analytics</h3>
                  <p className="text-sm text-muted-foreground">View your weekly summary and progress</p>
                </div>
              </Card>
            </div>

            {/* Quick Tasks */}
            <QuickTasks />

            {/* Additional Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 justify-start border-2 hover:border-primary hover:bg-primary/10"
                onClick={() => navigate("/calendar")}
              >
                <Calendar className="w-5 h-5 mr-3 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Calendar</div>
                  <div className="text-xs text-muted-foreground">View goals & tasks</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 justify-start border-2 hover:border-primary hover:bg-primary/10"
                onClick={() => navigate("/motivation")}
              >
                <Sparkles className="w-5 h-5 mr-3 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Motivation</div>
                  <div className="text-xs text-muted-foreground">Get inspired</div>
                </div>
              </Button>
            </div>
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
                    <span className="font-semibold text-foreground">
                      {completedGoals.length}/{goals.length}
                    </span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-hero transition-all duration-500 rounded-full"
                      style={{
                        width: `${goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium">Reflections This Week</span>
                    <span className="font-semibold text-foreground">{recentReflections.length}</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-warm transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min((recentReflections.length / 7) * 100, 100)}%` }}
                    />
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
