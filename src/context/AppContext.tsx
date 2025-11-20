import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  branch: string;
  year: string;
  preferences: {
    notifications: string;
    wakeTime: string;
    sleepTime: string;
    examMode: boolean;
  };
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: "academic" | "career" | "personal";
  progress: number;
  deadline: string;
  createdAt: string;
  tasks: Task[];
  isCompleted: boolean;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  goalId?: string;
  dueDate?: string;
  createdAt: string;
}

interface Reflection {
  id: string;
  date: string;
  accomplishments: string;
  challenges: string;
  mood: number;
  productivity: number;
  notes: string;
  createdAt: string;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  type: "goal" | "task" | "habit" | "check-in";
  date: string;
  time: string;
  enabled: boolean;
  goalId?: string;
  taskId?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface AppContextType {
  user: User | null;
  goals: Goal[];
  tasks: Task[];
  reflections: Reflection[];
  reminders: Reminder[];
  chatHistory: ChatMessage[];
  isAuthenticated: boolean;
  examMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; branch: string; year: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "tasks" | "isCompleted">) => string;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt">) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addReflection: (reflection: Omit<Reflection, "id" | "createdAt">) => string;
  updateReflection: (id: string, updates: Partial<Reflection>) => void;
  deleteReflection: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, "id">) => string;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  toggleExamMode: () => void;
  exportData: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [examMode, setExamMode] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedGoals = localStorage.getItem("goals");
    const savedTasks = localStorage.getItem("tasks");
    const savedReflections = localStorage.getItem("reflections");
    const savedReminders = localStorage.getItem("reminders");
    const savedChatHistory = localStorage.getItem("chatHistory");
    const savedExamMode = localStorage.getItem("examMode");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedReflections) setReflections(JSON.parse(savedReflections));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    if (savedChatHistory) {
      const history = JSON.parse(savedChatHistory);
      setChatHistory(history.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
    }
    if (savedExamMode) setExamMode(JSON.parse(savedExamMode));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("reflections", JSON.stringify(reflections));
  }, [reflections]);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem("examMode", JSON.stringify(examMode));
  }, [examMode]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userData } = foundUser;
      setUser(userData);
      return true;
    }
    return false;
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    branch: string;
    year: string;
  }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (users.find((u: any) => u.email === data.email)) {
      return false; // Email already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      branch: data.branch,
      year: data.year,
      preferences: {
        notifications: "app",
        wakeTime: "07:00",
        sleepTime: "23:00",
        examMode: false,
      },
    };

    users.push({ ...newUser, password: data.password });
    localStorage.setItem("users", JSON.stringify(users));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setGoals([]);
    setTasks([]);
    setReflections([]);
    setReminders([]);
    setChatHistory([]);
    localStorage.removeItem("user");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
    }
  };

  const addGoal = (goalData: Omit<Goal, "id" | "createdAt" | "tasks" | "isCompleted">): string => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      tasks: [],
      isCompleted: false,
    };
    setGoals([...goals, newGoal]);
    return newGoal.id;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
    setTasks(tasks.filter((t) => t.goalId !== id));
  };

  const addTask = (taskData: Omit<Task, "id" | "createdAt">): string => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    return newTask.id;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const addReflection = (reflectionData: Omit<Reflection, "id" | "createdAt">): string => {
    const newReflection: Reflection = {
      ...reflectionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setReflections([...reflections, newReflection]);
    return newReflection.id;
  };

  const updateReflection = (id: string, updates: Partial<Reflection>) => {
    setReflections(reflections.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteReflection = (id: string) => {
    setReflections(reflections.filter((r) => r.id !== id));
  };

  const addReminder = (reminderData: Omit<Reminder, "id">): string => {
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString(),
    };
    setReminders([...reminders, newReminder]);
    return newReminder.id;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const addChatMessage = (message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setChatHistory([...chatHistory, newMessage]);
  };

  const toggleExamMode = () => {
    setExamMode(!examMode);
    if (user) {
      updateUser({
        preferences: { ...user.preferences, examMode: !examMode },
      });
    }
  };

  const exportData = (): string => {
    return JSON.stringify(
      {
        user,
        goals,
        tasks,
        reflections,
        reminders,
        chatHistory,
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        goals,
        tasks,
        reflections,
        reminders,
        chatHistory,
        isAuthenticated: !!user,
        examMode,
        login,
        register,
        logout,
        updateUser,
        addGoal,
        updateGoal,
        deleteGoal,
        addTask,
        updateTask,
        deleteTask,
        addReflection,
        updateReflection,
        deleteReflection,
        addReminder,
        updateReminder,
        deleteReminder,
        addChatMessage,
        toggleExamMode,
        exportData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

