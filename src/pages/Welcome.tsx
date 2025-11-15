import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, TrendingUp, Heart } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 animate-bounce-in">
            <Sparkles className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Welcome to <span className="text-primary">LifePathBot</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal AI companion for daily reflection, goal alignment, and staying on track—designed for college students like you.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Goal Setting</h3>
            <p className="text-muted-foreground text-sm">
              Set and track SMART goals across academics, career, and personal life.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-all duration-300">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Daily Reflections</h3>
            <p className="text-muted-foreground text-sm">
              Chat with your AI companion to reflect on your day and stay accountable.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-all duration-300">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Wellness Tracking</h3>
            <p className="text-muted-foreground text-sm">
              Monitor your mood, stress levels, and build healthy habits.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
            onClick={() => navigate("/onboarding")}
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6"
            onClick={() => navigate("/dashboard")}
          >
            I Have an Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
