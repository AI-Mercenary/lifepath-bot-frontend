import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, User, GraduationCap, Target, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const { user, updateUser } = useApp();
  const [formData, setFormData] = useState({
    goals: "",
    wakeTime: user?.preferences?.wakeTime || "07:00",
    sleepTime: user?.preferences?.sleepTime || "23:00",
    notifications: user?.preferences?.notifications || "app",
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save preferences
      if (user) {
        updateUser({
          preferences: {
            ...user.preferences,
            wakeTime: formData.wakeTime,
            sleepTime: formData.sleepTime,
            notifications: formData.notifications,
          },
        });
      }
      toast.success("Onboarding complete! Welcome to LifePathBot 🎉");
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return true; // Welcome step
      case 2:
        return formData.goals.trim() !== "";
      case 3:
        return formData.wakeTime !== "" && formData.sleepTime !== "";
      case 4:
        return true; // Preferences step
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 shadow-soft animate-slide-up">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex-1 mx-1">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  num <= step ? "bg-gradient-hero" : "bg-muted"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Welcome to LifePathBot!</h2>
              <p className="text-muted-foreground mt-2">
                Let's personalize your experience, {user?.name || "Student"}
              </p>
            </div>
            <p className="text-center text-muted-foreground">
              We'll ask you a few quick questions to set up your profile and preferences.
            </p>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-accent/10 rounded-full mb-3">
                <Target className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="text-3xl font-bold">What are your goals?</h2>
              <p className="text-muted-foreground mt-2">Share what you want to achieve</p>
            </div>
            <div>
              <Label htmlFor="goals">Broad Goals</Label>
              <textarea
                id="goals"
                placeholder="e.g., Graduate with honors, land an internship, stay healthy..."
                value={formData.goals}
                onChange={(e) => updateFormData("goals", e.target.value)}
                className="mt-2 w-full min-h-[120px] p-3 rounded-lg border border-input bg-background"
              />
            </div>
          </div>
        )}

        {/* Step 3: Routine */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Your daily routine</h2>
              <p className="text-muted-foreground mt-2">Help us time our check-ins perfectly</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wakeTime">Wake Time</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={formData.wakeTime}
                  onChange={(e) => updateFormData("wakeTime", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="sleepTime">Sleep Time</Label>
                <Input
                  id="sleepTime"
                  type="time"
                  value={formData.sleepTime}
                  onChange={(e) => updateFormData("sleepTime", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preferences */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-secondary/10 rounded-full mb-3">
                <GraduationCap className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold">Notification Preferences</h2>
              <p className="text-muted-foreground mt-2">How would you like to receive updates?</p>
            </div>
            <div>
              <Label htmlFor="notifications">Notification Method</Label>
              <Select
                value={formData.notifications}
                onValueChange={(value) => updateFormData("notifications", value)}
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
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="border-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all"
          >
            {step === 4 ? "Complete" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
