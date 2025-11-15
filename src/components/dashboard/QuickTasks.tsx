import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, CheckCircle2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

const QuickTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("dailyTasks");
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("tasksDate");

    if (savedTasks && savedDate === today) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const initialTasks = [
        { id: Date.now(), text: "Check in with LifePathBot", completed: false, createdAt: today },
      ];
      setTasks(initialTasks);
      localStorage.setItem("dailyTasks", JSON.stringify(initialTasks));
      localStorage.setItem("tasksDate", today);
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem("dailyTasks", JSON.stringify(updatedTasks));
  };

  const toggleTask = (id: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
    
    const task = updatedTasks.find(t => t.id === id);
    if (task?.completed) {
      toast.success("Task completed! 🎉");
    }
  };

  const addTask = () => {
    if (!newTaskText.trim()) {
      toast.error("Please enter a task");
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date().toDateString(),
    };

    saveTasks([...tasks, newTask]);
    setNewTaskText("");
    setIsAdding(false);
    toast.success("Task added successfully");
  };

  const deleteTask = (id: number) => {
    saveTasks(tasks.filter(task => task.id !== id));
    toast.success("Task removed");
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <Card className="p-6 shadow-card border-border/50">
      <div className="flex items-center justify-between mb-5">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground">Today's Tasks</h3>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-muted-foreground">
              {completedCount}/{tasks.length} completed
            </p>
            {completionPercentage > 0 && (
              <div className="flex-1 max-w-[100px] h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-hero transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            )}
          </div>
        </div>
        {!isAdding && (
          <Button 
            size="sm" 
            variant="outline" 
            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/50 animate-slide-up">
          <div className="flex gap-2">
            <Input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Enter task description..."
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              autoFocus
              className="flex-1"
            />
            <Button size="sm" onClick={addTask} className="bg-primary hover:bg-primary-dark">
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => {
              setIsAdding(false);
              setNewTaskText("");
            }}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No tasks yet. Add one to get started!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-all duration-200 group border border-transparent hover:border-border/50"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-0.5"
              />
              <span className={`flex-1 leading-relaxed transition-all ${
                task.completed 
                  ? "line-through text-muted-foreground" 
                  : "text-foreground"
              }`}>
                {task.text}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {task.completed && <CheckCircle2 className="w-4 h-4 text-primary" />}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default QuickTasks;
