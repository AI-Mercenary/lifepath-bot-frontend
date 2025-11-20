import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Target, Smile, Calendar, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/context/AppContext";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Analytics = () => {
  const navigate = useNavigate();
  const { goals, reflections, tasks } = useApp();

  // Calculate weekly summary
  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weekReflections = reflections.filter(
      (r) => new Date(r.date) >= weekStart && new Date(r.date) <= weekEnd
    );

    const moodData = weekDays.map((day) => {
      const reflection = weekReflections.find(
        (r) => format(new Date(r.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      );
      return {
        date: format(day, "EEE"),
        mood: reflection?.mood ?? null,
        productivity: reflection?.productivity ?? null,
      };
    });

    const goalProgress = goals.map((g) => ({
      name: g.title.length > 20 ? g.title.substring(0, 20) + "..." : g.title,
      progress: g.progress,
      category: g.category,
    }));

    const categoryDistribution = goals.reduce(
      (acc, goal) => {
        acc[goal.category] = (acc[goal.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const avgMood =
      weekReflections.length > 0
        ? weekReflections.reduce((sum, r) => sum + r.mood, 0) / weekReflections.length
        : 0;

    const avgProductivity =
      weekReflections.length > 0
        ? weekReflections.reduce((sum, r) => sum + r.productivity, 0) / weekReflections.length
        : 0;

    const completedGoals = goals.filter((g) => g.isCompleted || g.progress === 100).length;
    const totalGoals = goals.length;
    const goalCompletionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return {
      moodData,
      goalProgress,
      categoryDistribution,
      taskCompletionRate,
      avgMood,
      avgProductivity,
      goalCompletionRate,
      weekReflections: weekReflections.length,
    };
  }, [goals, reflections, tasks]);

  const COLORS = {
    academic: "#14b8a6",
    career: "#f97316",
    personal: "#eab308",
  };

  const categoryData = Object.entries(weeklyData.categoryDistribution).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

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
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Analytics & Weekly Summary</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Goal Completion</p>
                <p className="text-3xl font-bold text-foreground">{weeklyData.goalCompletionRate.toFixed(0)}%</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Task Completion</p>
                <p className="text-3xl font-bold text-foreground">{weeklyData.taskCompletionRate.toFixed(0)}%</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Mood</p>
                <p className="text-3xl font-bold text-foreground">
                  {weeklyData.avgMood > 0 ? weeklyData.avgMood.toFixed(1) : "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Smile className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Productivity</p>
                <p className="text-3xl font-bold text-foreground">
                  {weeklyData.avgProductivity > 0 ? weeklyData.avgProductivity.toFixed(1) : "N/A"}/10
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood & Productivity Trend */}
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Weekly Mood & Productivity Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData.moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Mood (0-4)"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Productivity (0-10)"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Goal Progress */}
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Goal Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData.goalProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Goals by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || "#8884d8"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Weekly Summary Text */}
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Weekly Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">This Week's Highlights</p>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      You logged <strong>{weeklyData.weekReflections}</strong> reflection{weeklyData.weekReflections !== 1 ? "s" : ""} this week
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>{goals.filter((g) => g.isCompleted || g.progress === 100).length}</strong> goal{goals.filter((g) => g.isCompleted || g.progress === 100).length !== 1 ? "s" : ""} completed
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>{tasks.filter((t) => t.completed).length}</strong> task{tasks.filter((t) => t.completed).length !== 1 ? "s" : ""} completed
                    </span>
                  </li>
                </ul>
              </div>
              {weeklyData.avgMood > 0 && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Average Mood This Week</p>
                  <p className="text-2xl font-bold text-foreground">
                    {weeklyData.avgMood >= 3 ? "😊 Great!" : weeklyData.avgMood >= 2 ? "🙂 Good" : "Keep going! 💪"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;

