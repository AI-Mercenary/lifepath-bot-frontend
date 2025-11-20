import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Quote, Lightbulb, BookOpen, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "career",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "perseverance",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams",
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    category: "goals",
  },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
    category: "self-improvement",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "perseverance",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "belief",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "action",
  },
];

const tips = [
  {
    title: "Break Down Large Goals",
    content: "Divide big goals into smaller, manageable tasks. This makes progress feel achievable and keeps you motivated.",
    icon: "🎯",
  },
  {
    title: "Practice Time Blocking",
    content: "Allocate specific time blocks for different activities. This helps maintain focus and prevents overwhelm.",
    icon: "⏰",
  },
  {
    title: "Celebrate Small Wins",
    content: "Acknowledge and celebrate every small achievement. This builds momentum and positive reinforcement.",
    icon: "🎉",
  },
  {
    title: "Maintain a Growth Mindset",
    content: "View challenges as opportunities to learn and grow. Every setback is a lesson in disguise.",
    icon: "🌱",
  },
  {
    title: "Stay Consistent",
    content: "Consistency beats intensity. Small daily actions compound into significant results over time.",
    icon: "📈",
  },
  {
    title: "Take Care of Yourself",
    content: "Your well-being is the foundation of success. Prioritize sleep, nutrition, and mental health.",
    icon: "💚",
  },
];

const stories = [
  {
    title: "From Struggling to Thriving",
    content:
      "A student who was failing multiple classes decided to break down their study schedule into 25-minute focused sessions. Within a semester, they improved their GPA from 2.1 to 3.4. The key? Consistency and breaking tasks into manageable chunks.",
    lesson: "Small, consistent efforts lead to big changes.",
  },
  {
    title: "The Power of Reflection",
    content:
      "A graduate student started journaling their daily accomplishments and challenges. This simple habit helped them identify patterns, improve time management, and reduce stress by 40% in just two months.",
    lesson: "Self-awareness is the first step to improvement.",
  },
  {
    title: "Goal Setting Success",
    content:
      "A computer science student set a SMART goal to complete 50 coding challenges in 3 months. By tracking progress daily and adjusting strategies, they not only achieved the goal but also landed their dream internship.",
    lesson: "Clear goals + consistent tracking = success.",
  },
];

const Motivation = () => {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [activeTab, setActiveTab] = useState<"quotes" | "tips" | "stories">("quotes");

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Motivation Board</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Featured Quote */}
        <Card className="p-8 bg-gradient-warm border-0 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <Quote className="w-8 h-8 text-white/80" />
              <Button
                variant="ghost"
                size="icon"
                onClick={getRandomQuote}
                className="text-white/80 hover:text-white hover:bg-white/20"
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-2xl font-medium text-white mb-4 leading-relaxed">{currentQuote.text}</p>
            <p className="text-white/80 font-medium">— {currentQuote.author}</p>
            <Badge className="mt-4 bg-white/20 text-white border-white/30">{currentQuote.category}</Badge>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-border/50">
          <Button
            variant={activeTab === "quotes" ? "default" : "ghost"}
            onClick={() => setActiveTab("quotes")}
            className={activeTab === "quotes" ? "bg-primary text-primary-foreground" : ""}
          >
            <Quote className="w-4 h-4 mr-2" />
            Quotes
          </Button>
          <Button
            variant={activeTab === "tips" ? "default" : "ghost"}
            onClick={() => setActiveTab("tips")}
            className={activeTab === "tips" ? "bg-primary text-primary-foreground" : ""}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Tips
          </Button>
          <Button
            variant={activeTab === "stories" ? "default" : "ghost"}
            onClick={() => setActiveTab("stories")}
            className={activeTab === "stories" ? "bg-primary text-primary-foreground" : ""}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Success Stories
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "quotes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotes.map((quote, index) => (
              <Card key={index} className="p-6 shadow-card hover:shadow-soft transition-all">
                <Quote className="w-6 h-6 text-primary mb-3" />
                <p className="text-foreground mb-3 leading-relaxed">{quote.text}</p>
                <p className="text-sm text-muted-foreground">— {quote.author}</p>
                <Badge variant="outline" className="mt-3">{quote.category}</Badge>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "tips" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <Card key={index} className="p-6 shadow-card hover:shadow-soft transition-all">
                <div className="flex items-start space-x-3 mb-3">
                  <span className="text-3xl">{tip.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-2">{tip.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{tip.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "stories" && (
          <div className="space-y-4">
            {stories.map((story, index) => (
              <Card key={index} className="p-6 shadow-card hover:shadow-soft transition-all">
                <div className="flex items-start space-x-3 mb-3">
                  <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-2">{story.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">{story.content}</p>
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-primary">💡 Lesson: {story.lesson}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Motivation;

