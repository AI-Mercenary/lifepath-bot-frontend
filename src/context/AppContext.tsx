import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";
import { toast } from "sonner";
import { syncUserToBackend } from "@/api/users";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "verified";
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
  toggleExamMode: () => void;
  exportData: () => string;
  loginWithGoogle: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [examMode, setExamMode] = useState(false);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // Map Firebase user to our App User
        const newUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || "User",
          email: fbUser.email || "",
          role: "student", // Default
          branch: "General", // Placeholder, ideally fetch from Firestore
          year: "1", // Placeholder
          preferences: {
            notifications: "app",
            wakeTime: "07:00",
            sleepTime: "23:00",
            examMode: false,
          },
        };
        // In a real app, we would fetch additional user data (branch, year, preferences) from Firestore here.
        // For now, we simple sync what we have.
        setUser((prev) => (prev ? { ...prev, ...newUser } : newUser));
        
        // Sync to backend on auto-login too, to ensure DB is consistent
        syncUserToBackend({
            firebaseUid: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
        }).catch(err => console.error("Auto-sync failed", err));

      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
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
    // Static Admin Check
    if (email === "lifepathbot@admin.in" && password === "qwerty123") {
      const adminUser: User = {
        id: "admin-static",
        name: "Admin",
        email: "lifepathbot@admin.in",
        role: "admin",
        branch: "Administration",
        year: "Staff",
        preferences: {
          notifications: "all",
          wakeTime: "06:00",
          sleepTime: "22:00",
          examMode: false,
        },
      };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      toast.success("Welcome, Admin");
      return true;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state listener will update user
      return true;
    } catch (error) {
      console.error("Login error", error);
      toast.error("Invalid email or password");
      return false;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    branch: string;
    year: string;
  }): Promise<boolean> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Update display name
      if (result.user && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.name });
      }

      // In a real app, save additional fields (branch, year) to Firestore here.
      
      return true;
    } catch (error: any) {
      console.error("Registration error", error);
      if (error.code === 'auth/email-already-in-use') {
         // Handled in component
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
    setUser(null);
    setGoals([]);
    setTasks([]);
    setReflections([]);
    setReminders([]);
    setChatHistory([]);
    localStorage.removeItem("user");
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Domain Check for Google Login
      const email = fbUser.email || "";
      const allowedDomains = ["@gitam.student.edu", "@gitam.in"];
      const isValidDomain = allowedDomains.some((domain) => email.endsWith(domain));

      // Allow admin email if it happens to be a google login (unlikely for static, but good practice)
      const isAdmin = email === "lifepathbot@admin.in";

      if (!isValidDomain && !isAdmin) {
        await signOut(auth); // Sign out immediately
        toast.error("Please use your GITAM email (@gitam.student.edu or @gitam.in)");
        return false;
      }

      // Map Firebase user to our App User
      const newUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || "User",
        email: email,
        role: "student", // Default
        branch: "General", // Default/Placeholder
        year: "1", // Default/Placeholder
        preferences: {
          notifications: "app",
          wakeTime: "07:00",
          sleepTime: "23:00",
          examMode: false,
        },
      };

      // Check if user exists in local storage to preserve extra fields if previously saved?
      // For now, simple overwrite/login.
      // Check if user exists in local storage to preserve extra fields if previously saved?
      // For now, simple overwrite/login.
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      // Sync to Backend
      try {
          await syncUserToBackend({
              firebaseUid: newUser.id,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role
          });
      } catch (err) {
          console.error("Failed to sync user to backend", err);
      }

      return true;
    } catch (error) {
      console.error("Google Sign In Error", error);
      toast.error("Failed to sign in. Please try again.");
      return false;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      
      // Sync name to Firebase Auth if changed
      if (data.name && auth.currentUser) {
          try {
              await updateProfile(auth.currentUser, { displayName: data.name });
          } catch (e) {
              console.error("Failed to update Firebase profile", e);
          }
      }
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
        addChatMessage,
        toggleExamMode,
        exportData,
        loginWithGoogle,
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

