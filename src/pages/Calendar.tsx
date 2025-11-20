import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/context/AppContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

const Calendar = () => {
  const navigate = useNavigate();
  const { goals, tasks, reflections } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of month to calculate offset
  const firstDayOfMonth = monthStart.getDay();
  const daysBeforeMonth = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  const getDayEvents = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    
    const dayGoals = goals.filter((g) => {
      const deadline = format(new Date(g.deadline), "yyyy-MM-dd");
      return deadline === dayStr;
    });

    const dayTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = format(new Date(t.dueDate), "yyyy-MM-dd");
      return dueDate === dayStr;
    });

    const dayReflections = reflections.filter((r) => {
      const reflectionDate = format(new Date(r.date), "yyyy-MM-dd");
      return reflectionDate === dayStr;
    });

    return { goals: dayGoals, tasks: dayTasks, reflections: dayReflections };
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                <CalendarIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        <Card className="p-6 shadow-card">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold text-foreground">{format(currentDate, "MMMM yyyy")}</h2>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells before month start */}
            {daysBeforeMonth.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {daysInMonth.map((day) => {
              const events = getDayEvents(day);
              const isToday = isSameDay(day, new Date());
              const hasEvents = events.goals.length > 0 || events.tasks.length > 0 || events.reflections.length > 0;

              return (
                <div
                  key={day.toISOString()}
                  className={`aspect-square p-2 border rounded-lg transition-all ${
                    isToday
                      ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                      : hasEvents
                      ? "bg-muted/30 border-border hover:bg-muted/50"
                      : "border-border/50 hover:bg-muted/20"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                      {format(day, "d")}
                    </div>
                    <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                      {events.goals.length > 0 && (
                        <Badge variant="outline" className="text-xs px-1 py-0 bg-primary/10 border-primary/30 text-primary">
                          {events.goals.length} Goal{events.goals.length > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {events.tasks.length > 0 && (
                        <Badge variant="outline" className="text-xs px-1 py-0 bg-secondary/10 border-secondary/30 text-secondary">
                          {events.tasks.length} Task{events.tasks.length > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {events.reflections.length > 0 && (
                        <Badge variant="outline" className="text-xs px-1 py-0 bg-accent/10 border-accent/30 text-accent-foreground">
                          ✓ Reflection
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="font-semibold mb-3 text-foreground">Legend</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary/10 border border-primary/30 rounded" />
                <span className="text-sm text-muted-foreground">Goal deadlines</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-secondary/10 border border-secondary/30 rounded" />
                <span className="text-sm text-muted-foreground">Task due dates</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-accent/10 border border-accent/30 rounded" />
                <span className="text-sm text-muted-foreground">Reflections logged</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary border-2 border-primary rounded" />
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="font-semibold mb-3 text-foreground">Upcoming This Month</h3>
            <div className="space-y-2">
              {goals
                .filter((g) => {
                  const deadline = new Date(g.deadline);
                  return deadline >= monthStart && deadline <= monthEnd;
                })
                .slice(0, 5)
                .map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center space-x-3">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{goal.title}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {format(new Date(goal.deadline), "MMM dd")}
                    </Badge>
                  </div>
                ))}
              {goals.filter((g) => {
                const deadline = new Date(g.deadline);
                return deadline >= monthStart && deadline <= monthEnd;
              }).length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming goals this month</p>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Calendar;

