import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, User, GraduationCap, Target, Clock } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
    goals: "",
    wakeTime: "",
    sleepTime: "",
    notifications: "email",
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      localStorage.setItem("userProfile", JSON.stringify(formData));
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
      case 1: return formData.name.trim() !== "";
      case 2: return formData.branch.trim() !== "" && formData.year !== "";
      case 3: return formData.goals.trim() !== "";
      case 4: return formData.wakeTime !== "" && formData.sleepTime !== "";
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 shadow-soft animate-slide-up">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex-1 mx-1">
              <div className={`h-2 rounded-full transition-all duration-300 ${
                num <= step ? "bg-gradient-hero" : "bg-muted"
              }`} />
            </div>
          ))}
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Let's get to know you!</h2>
              <p className="text-muted-foreground mt-2">Tell us a bit about yourself</p>
            </div>
            <div>
              <Label htmlFor="name">What's your name?</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {/* Step 2: Academic Info */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-secondary/10 rounded-full mb-3">
                <GraduationCap className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold">Your academic journey</h2>
              <p className="text-muted-foreground mt-2">Help us personalize your experience</p>
            </div>
            <div>
              <Label htmlFor="branch">Branch/Degree</Label>
              <Input
                id="branch"
                placeholder="e.g., Computer Science, Business"
                value={formData.branch}
                onChange={(e) => updateFormData("branch", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="year">Year of Study</Label>
              <Select value={formData.year} onValueChange={(value) => updateFormData("year", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your year" />
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
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
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

        {/* Step 4: Routine */}
        {step === 4 && (
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
            <div>
              <Label htmlFor="notifications">Notification Preference</Label>
              <Select value={formData.notifications} onValueChange={(value) => updateFormData("notifications", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="app">In-App Only</SelectItem>
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
