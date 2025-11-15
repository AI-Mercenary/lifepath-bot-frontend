import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2 } from "lucide-react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const QuickTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Complete data structures assignment", completed: false },
    { id: 2, text: "Review lecture notes", completed: true },
    { id: 3, text: "30 minutes of exercise", completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Today's Tasks</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{tasks.length} completed
          </p>
        </div>
        <Button size="sm" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10">
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-all"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="mt-1"
            />
            <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.text}
            </span>
            {task.completed && <CheckCircle2 className="w-5 h-5 text-primary" />}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default QuickTasks;
