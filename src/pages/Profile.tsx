import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Bell, Shield, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    branch: "",
    year: "",
    email: "student@example.com",
  });

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      const data = JSON.parse(saved);
      setProfile({ ...profile, ...data });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Profile & Settings</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Info */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.name || "Student"}</h2>
              <p className="text-muted-foreground">
                {profile.branch} • Year {profile.year}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} readOnly className="mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={profile.name} readOnly className="mt-2" />
              </div>
              <div>
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" value={profile.branch} readOnly className="mt-2" />
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Check-ins</p>
                <p className="text-sm text-muted-foreground">Remind me to reflect daily</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Goal Reminders</p>
                <p className="text-sm text-muted-foreground">Notify about upcoming deadlines</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Summary</p>
                <p className="text-sm text-muted-foreground">Get weekly progress reports</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Privacy & Data */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Privacy & Data</h3>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-2">
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
            <p className="text-sm text-muted-foreground">
              Your data is stored locally and never shared without your permission.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
