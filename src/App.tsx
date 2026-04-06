import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { AppProvider, useApp } from "@/context/AppContext";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import Reflections from "./pages/Reflections";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Motivation from "./pages/Motivation";
import Discussions from "./pages/Discussions";
import Suggestions from "./pages/Suggestions";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import VerifiedUpload from "./pages/VerifiedUpload";
import Competitions from "./pages/Competitions";
import GoalReflection from "./pages/GoalReflection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useApp();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If an admin tries to access a student page, send them to admin dashboard
    if (user.role === "admin") {
        return <Navigate to="/admin" replace />;
    }
    // If a student tries to access admin or otherwise protected pages, send them to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/login" element={<Login />} />
    <Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/register" element={<Register />} />
    <Route path="/onboarding" element={<ProtectedRoute allowedRoles={["student", "verified"]}><Onboarding /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["student", "verified"]}><Dashboard /></ProtectedRoute>} />
    <Route path="/chat" element={<ProtectedRoute allowedRoles={["student", "verified"]}><Chat /></ProtectedRoute>} />
    <Route path="/goals" element={<ProtectedRoute allowedRoles={["student", "verified"]}><Goals /></ProtectedRoute>} />
    <Route path="/reflections" element={<ProtectedRoute allowedRoles={["student", "verified"]}><Reflections /></ProtectedRoute>} />
    <Route path="/analytics" element={<ProtectedRoute allowedRoles={["student", "verified"]}><Analytics /></ProtectedRoute>} />
    <Route path="/calendar" element={<ProtectedRoute allowedRoles={["student", "verified"]}><Calendar /></ProtectedRoute>} />
    <Route path="/motivation" element={<ProtectedRoute allowedRoles={["student", "verified"]}><Motivation /></ProtectedRoute>} />
    <Route path="/discussions" element={<ProtectedRoute allowedRoles={["student", "verified"]}><Suggestions /></ProtectedRoute>} />
    <Route path="/competitions" element={<ProtectedRoute allowedRoles={["student", "verified"]}><Competitions /></ProtectedRoute>} />
    <Route path="/goal-reflection" element={<ProtectedRoute allowedRoles={["student", "verified"]}><GoalReflection /></ProtectedRoute>} />

    {/* Admin & Verified Routes */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/verified-upload"
      element={
        <ProtectedRoute allowedRoles={["admin", "verified"]}>
          <VerifiedUpload />
        </ProtectedRoute>
      }
    />

    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

import { RoleSwitcher } from "@/components/RoleSwitcher";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeWrapper>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeWrapper>
      </ThemeProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
