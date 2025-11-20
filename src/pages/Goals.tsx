import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, GraduationCap, Briefcase, Heart, Calendar, Edit, Trash2, CheckCircle2, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { format } from "date-fns";

const Goals = () => {
  const navigate = useNavigate();
  const { goals, addGoal, updateGoal, deleteGoal, addTask, tasks, updateTask } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "academic" as "academic" | "career" | "personal",
    deadline: "",
    progress: 0,
  });

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

  const categoryBgColors = {
    academic: "bg-primary/10",
    career: "bg-secondary/10",
    personal: "bg-accent/10",
  };

  const filteredGoals = selectedCategory === "all" 
    ? goals 
    : goals.filter((g) => g.category === selectedCategory);

  const handleAddGoal = () => {
    if (!formData.title.trim() || !formData.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    addGoal({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      deadline: formData.deadline,
      progress: 0,
    });

    toast.success("Goal added successfully! 🎯");
    setIsDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      category: "academic",
      deadline: "",
      progress: 0,
    });
  };

  const handleEditGoal = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        deadline: goal.deadline,
        progress: goal.progress,
      });
      setEditingGoal(goalId);
      setIsDialogOpen(true);
    }
  };

  const handleUpdateGoal = () => {
    if (!editingGoal || !formData.title.trim() || !formData.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateGoal(editingGoal, {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      deadline: formData.deadline,
      progress: formData.progress,
    });

    toast.success("Goal updated! ✨");
    setIsDialogOpen(false);
    setEditingGoal(null);
    setFormData({
      title: "",
      description: "",
      category: "academic",
      deadline: "",
      progress: 0,
    });
  };

  const handleDeleteGoal = () => {
    if (deletingGoal) {
      deleteGoal(deletingGoal);
      toast.success("Goal deleted");
      setDeletingGoal(null);
    }
  };

  const handleProgressUpdate = (goalId: string, newProgress: number) => {
    updateGoal(goalId, { progress: Math.max(0, Math.min(100, newProgress)) });
  };

  const handleCompleteGoal = (goalId: string) => {
    updateGoal(goalId, { progress: 100, isCompleted: true });
    toast.success("Goal completed! 🎉");
  };

  const goalTasks = (goalId: string) => tasks.filter((t) => t.goalId === goalId);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">My Goals</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingGoal(null);
                setFormData({
                  title: "",
                  description: "",
                  category: "academic",
                  deadline: "",
                  progress: 0,
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-hero text-primary-foreground hover:shadow-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingGoal ? "Edit Goal" : "Create New SMART Goal"}</DialogTitle>
                  <DialogDescription>
                    {editingGoal
                      ? "Update your goal details"
                      : "Set a Specific, Measurable, Achievable, Relevant, and Time-bound goal"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Maintain GPA above 3.5"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your goal in detail..."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: "academic" | "career" | "personal") =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline *</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  {editingGoal && (
                    <div className="space-y-2">
                      <Label htmlFor="progress">Progress: {formData.progress}%</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="progress"
                          type="range"
                          min="0"
                          max="100"
                          value={formData.progress}
                          onChange={(e) =>
                            setFormData({ ...formData, progress: parseInt(e.target.value) })
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-medium w-12">{formData.progress}%</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
                      className="bg-gradient-hero text-primary-foreground"
                    >
                      {editingGoal ? "Update Goal" : "Create Goal"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All Goals</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4">
            {filteredGoals.length === 0 ? (
              <Card className="p-12 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedCategory === "all"
                    ? "Create your first goal to get started!"
                    : `No ${selectedCategory} goals yet. Create one!`}
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-hero text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </Card>
            ) : (
              filteredGoals.map((goal) => {
                const Icon = categoryIcons[goal.category];
                const goalTasksList = goalTasks(goal.id);
                const completedTasks = goalTasksList.filter((t) => t.completed).length;
                const totalTasks = goalTasksList.length;

                return (
                  <Card
                    key={goal.id}
                    className="p-6 shadow-card hover:shadow-soft transition-all animate-fade-in border-border/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div
                          className={`w-12 h-12 rounded-xl ${categoryBgColors[goal.category]} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className={`w-6 h-6 ${categoryColors[goal.category]}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg mb-1 text-foreground">{goal.title}</h3>
                              {goal.description && (
                                <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                              )}
                            </div>
                            {goal.isCompleted && (
                              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {format(new Date(goal.deadline), "MMM dd, yyyy")}</span>
                            </div>
                            {totalTasks > 0 && (
                              <div className="flex items-center space-x-1">
                                <Target className="w-4 h-4" />
                                <span>
                                  Tasks: {completedTasks}/{totalTasks}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold text-foreground">{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!goal.isCompleted && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCompleteGoal(goal.id)}
                            title="Mark as complete"
                          >
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditGoal(goal.id)}
                          title="Edit goal"
                        >
                          <Edit className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingGoal(goal.id)}
                          title="Delete goal"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={!!deletingGoal} onOpenChange={() => setDeletingGoal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone and will also delete all associated tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGoal} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Goals;
