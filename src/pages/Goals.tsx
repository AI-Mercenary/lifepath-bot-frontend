import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, GraduationCap, Briefcase, Heart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Goal {
  id: number;
  title: string;
  category: "academic" | "career" | "personal";
  progress: number;
  deadline: string;
  description: string;
}

const Goals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Maintain GPA above 3.5",
      category: "academic",
      progress: 65,
      deadline: "2025-12-15",
      description: "Complete all assignments on time and study consistently",
    },
    {
      id: 2,
      title: "Secure summer internship",
      category: "career",
      progress: 40,
      deadline: "2025-03-30",
      description: "Apply to 20+ companies and practice interview skills",
    },
    {
      id: 3,
      title: "Exercise 4 times per week",
      category: "personal",
      progress: 75,
      deadline: "2025-12-31",
      description: "Build a consistent fitness routine for better health",
    },
  ]);

  const categoryIcons = {
    academic: GraduationCap,
    career: Briefcase,
    personal: Heart,
  };

  const categoryColors = {
    academic: "text-primary",
    career: "text-secondary",
    personal: "text-accent-foreground",
  };

  const filterGoals = (category?: string) => {
    if (!category) return goals;
    return goals.filter((g) => g.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">My Goals</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button className="bg-gradient-hero text-primary-foreground hover:shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All Goals</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
          </TabsList>

          {["all", "academic", "career", "personal"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {filterGoals(category === "all" ? undefined : category).map((goal) => {
                const Icon = categoryIcons[goal.category];
                return (
                  <Card key={goal.id} className="p-6 shadow-card hover:shadow-soft transition-all animate-fade-in">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl bg-${goal.category === 'academic' ? 'primary' : goal.category === 'career' ? 'secondary' : 'accent'}/10 flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${categoryColors[goal.category]}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">{goal.progress}%</span>
                      </div>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </Card>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Goals;
