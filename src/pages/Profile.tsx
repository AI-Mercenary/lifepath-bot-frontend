import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, User, Bell, Shield, Download, Trash2, Edit, Save, X, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch as SwitchComponent } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout, exportData, examMode, toggleExamMode } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    branch: user?.branch || "",
    year: user?.year || "",
    email: user?.email || "",
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    dailyCheckins: true,
    goalReminders: true,
    weeklySummary: true,
    motivationalPrompts: true,
    method: user?.preferences?.notifications || "app",
  });
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        branch: user.branch,
        year: user.year,
        email: user.email,
      });
      setNotificationPrefs({
        dailyCheckins: true,
        goalReminders: true,
        weeklySummary: true,
        motivationalPrompts: true,
        method: user.preferences?.notifications || "app",
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    if (!profileData.name.trim() || !profileData.branch.trim() || !profileData.year) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateUser({
      name: profileData.name,
      branch: profileData.branch,
      year: profileData.year,
    });

    toast.success("Profile updated successfully! ✨");
    setIsEditing(false);
  };

  const handleSaveNotifications = () => {
    updateUser({
      preferences: {
        ...user?.preferences,
        notifications: notificationPrefs.method,
      },
    });
    toast.success("Notification preferences saved!");
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifepathbot-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully! 📥");
  };

  const handleDeleteAccount = () => {
    // Clear all data
    localStorage.clear();
    logout();
    toast.success("Account deleted. We're sorry to see you go.");
    navigate("/");
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    // In a real app, this would send to backend
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    feedbacks.push({
      text: feedbackText,
      timestamp: new Date().toISOString(),
      user: user?.email || "anonymous",
    });
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    toast.success("Thank you for your feedback! 💙");
    setFeedbackText("");
    setShowFeedbackDialog(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Please log in to view your profile</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Info */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center shadow-soft">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground">
                  {user.branch} • Year {user.year}
                </p>
              </div>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} className="bg-gradient-hero text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profileData.email} readOnly className="mt-2 bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branch">Branch *</Label>
                    <Input
                      id="branch"
                      value={profileData.branch}
                      onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Select
                      value={profileData.year}
                      onValueChange={(value) => setProfileData({ ...profileData, year: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                        <SelectItem value="grad">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="name-display">Name</Label>
                  <Input id="name-display" value={profileData.name} readOnly className="mt-2 bg-muted" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branch-display">Branch</Label>
                    <Input id="branch-display" value={profileData.branch} readOnly className="mt-2 bg-muted" />
                  </div>
                  <div>
                    <Label htmlFor="year-display">Year</Label>
                    <Input id="year-display" value={`Year ${profileData.year}`} readOnly className="mt-2 bg-muted" />
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Exam Mode */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">Exam Mode</h3>
                <p className="text-sm text-muted-foreground">High-focus mode for exam periods</p>
              </div>
            </div>
            <SwitchComponent checked={examMode} onCheckedChange={toggleExamMode} />
          </div>
          {examMode && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-foreground">
                Exam Mode is active. You'll receive fewer notifications and can focus on your studies. Good luck! 📚
              </p>
            </div>
          )}
        </Card>

        {/* Notifications */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg text-foreground">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Daily Check-ins</p>
                <p className="text-sm text-muted-foreground">Remind me to reflect daily</p>
              </div>
              <SwitchComponent
                checked={notificationPrefs.dailyCheckins}
                onCheckedChange={(checked) =>
                  setNotificationPrefs({ ...notificationPrefs, dailyCheckins: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Goal Reminders</p>
                <p className="text-sm text-muted-foreground">Notify about upcoming deadlines</p>
              </div>
              <SwitchComponent
                checked={notificationPrefs.goalReminders}
                onCheckedChange={(checked) =>
                  setNotificationPrefs({ ...notificationPrefs, goalReminders: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Weekly Summary</p>
                <p className="text-sm text-muted-foreground">Get weekly progress reports</p>
              </div>
              <SwitchComponent
                checked={notificationPrefs.weeklySummary}
                onCheckedChange={(checked) =>
                  setNotificationPrefs({ ...notificationPrefs, weeklySummary: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Motivational Prompts</p>
                <p className="text-sm text-muted-foreground">Receive encouraging messages</p>
              </div>
              <SwitchComponent
                checked={notificationPrefs.motivationalPrompts}
                onCheckedChange={(checked) =>
                  setNotificationPrefs({ ...notificationPrefs, motivationalPrompts: checked })
                }
              />
            </div>
            <div className="pt-4 border-t border-border/50">
              <Label htmlFor="notification-method">Notification Method</Label>
              <Select
                value={notificationPrefs.method}
                onValueChange={(value) => setNotificationPrefs({ ...notificationPrefs, method: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">In-App Only</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveNotifications} className="w-full mt-4">
              Save Notification Preferences
            </Button>
          </div>
        </Card>

        {/* Privacy & Data */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg text-foreground">Privacy & Data</h3>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-2" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
            <p className="text-sm text-muted-foreground">
              Download all your data in JSON format for privacy compliance. Your data is stored locally and never
              shared without your permission.
            </p>
          </div>
        </Card>

        {/* Feedback */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-foreground">Feedback & Suggestions</h3>
            <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">Send Feedback</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Your Feedback</DialogTitle>
                  <DialogDescription>
                    We'd love to hear your thoughts, suggestions, or report any issues.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you think..."
                    rows={6}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitFeedback} className="bg-gradient-hero text-primary-foreground">
                      Submit
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-sm text-muted-foreground">
            Help us improve LifePathBot by sharing your feedback, suggestions, or reporting issues.
          </p>
        </Card>

        {/* Account Deletion */}
        <Card className="p-6 shadow-card border-destructive/20">
          <div className="flex items-center space-x-3 mb-4">
            <Trash2 className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-lg text-destructive">Danger Zone</h3>
          </div>
          <div className="space-y-3">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
        </Card>
      </main>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This will permanently delete all your data including goals,
              reflections, tasks, and chat history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
