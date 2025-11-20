import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ArrowLeft, Plus, BookOpen, Edit, Trash2, Calendar, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";

const moods = [
  { emoji: "😊", label: "Great", value: 4 },
  { emoji: "🙂", label: "Good", value: 3 },
  { emoji: "😐", label: "Okay", value: 2 },
  { emoji: "😔", label: "Low", value: 1 },
  { emoji: "😰", label: "Stressed", value: 0 },
];

const Reflections = () => {
  const navigate = useNavigate();
  const { reflections, addReflection, updateReflection, deleteReflection } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    accomplishments: "",
    challenges: "",
    mood: 2,
    productivity: 5,
    notes: "",
  });

  const handleAddReflection = () => {
    if (!formData.accomplishments.trim()) {
      toast.error("Please enter at least your accomplishments");
      return;
    }

    addReflection({
      date: formData.date,
      accomplishments: formData.accomplishments,
      challenges: formData.challenges,
      mood: formData.mood,
      productivity: formData.productivity,
      notes: formData.notes,
    });

    toast.success("Reflection saved! 📝");
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEditReflection = (reflection: typeof reflections[0]) => {
    setFormData({
      date: reflection.date,
      accomplishments: reflection.accomplishments,
      challenges: reflection.challenges,
      mood: reflection.mood,
      productivity: reflection.productivity,
      notes: reflection.notes,
    });
    setEditingId(reflection.id);
    setIsDialogOpen(true);
  };

  const handleUpdateReflection = () => {
    if (!editingId || !formData.accomplishments.trim()) {
      toast.error("Please enter at least your accomplishments");
      return;
    }

    updateReflection(editingId, {
      date: formData.date,
      accomplishments: formData.accomplishments,
      challenges: formData.challenges,
      mood: formData.mood,
      productivity: formData.productivity,
      notes: formData.notes,
    });

    toast.success("Reflection updated! ✨");
    setIsDialogOpen(false);
    setEditingId(null);
    resetForm();
  };

  const handleDeleteReflection = () => {
    if (deletingId) {
      deleteReflection(deletingId);
      toast.success("Reflection deleted");
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), "yyyy-MM-dd"),
      accomplishments: "",
      challenges: "",
      mood: 2,
      productivity: 5,
      notes: "",
    });
  };

  const sortedReflections = [...reflections].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Daily Reflections</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingId(null);
                  resetForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-hero text-primary-foreground hover:shadow-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  New Reflection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Reflection" : "Daily Reflection"}</DialogTitle>
                  <DialogDescription>
                    Reflect on your day, track your mood, and note your accomplishments
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-5 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accomplishments">Accomplishments *</Label>
                    <Textarea
                      id="accomplishments"
                      value={formData.accomplishments}
                      onChange={(e) => setFormData({ ...formData, accomplishments: e.target.value })}
                      placeholder="What did you accomplish today? What went well?"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="challenges">Challenges</Label>
                    <Textarea
                      id="challenges"
                      value={formData.challenges}
                      onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                      placeholder="What challenges did you face? What could be improved?"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>How are you feeling? (Mood)</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {moods.map((mood) => (
                        <button
                          key={mood.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, mood: mood.value })}
                          className={`p-3 rounded-xl transition-all ${
                            formData.mood === mood.value
                              ? "bg-primary/20 ring-2 ring-primary scale-105"
                              : "bg-muted/50 hover:bg-muted"
                          }`}
                        >
                          <div className="text-2xl mb-1">{mood.emoji}</div>
                          <div className="text-xs">{mood.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Productivity Level: {formData.productivity}/10</Label>
                    <Slider
                      value={[formData.productivity]}
                      onValueChange={(value) => setFormData({ ...formData, productivity: value[0] })}
                      min={0}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional thoughts, insights, or plans for tomorrow..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={editingId ? handleUpdateReflection : handleAddReflection}
                      className="bg-gradient-hero text-primary-foreground"
                    >
                      {editingId ? "Update Reflection" : "Save Reflection"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6">
        {sortedReflections.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No reflections yet</h3>
            <p className="text-muted-foreground mb-4">
              Start reflecting on your day to track your progress and well-being
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-hero text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Reflection
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedReflections.map((reflection) => {
              const mood = moods.find((m) => m.value === reflection.mood) || moods[2];
              return (
                <Card key={reflection.id} className="p-6 shadow-card hover:shadow-soft transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{mood.emoji}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">
                            {format(new Date(reflection.date), "MMMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span>Mood: {mood.label}</span>
                          <span>•</span>
                          <span>Productivity: {reflection.productivity}/10</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditReflection(reflection)}
                        title="Edit reflection"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(reflection.id)}
                        title="Delete reflection"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                        Accomplishments
                      </h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">{reflection.accomplishments}</p>
                    </div>

                    {reflection.challenges && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Challenges</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{reflection.challenges}</p>
                      </div>
                    )}

                    {reflection.notes && (
                      <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        <h4 className="font-medium text-sm text-foreground mb-1">Notes</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reflection.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reflection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reflection? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReflection}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Reflections;

