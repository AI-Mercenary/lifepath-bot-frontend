import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Sparkles, Target, TrendingUp, Lightbulb, Loader2, History, Bot, Brain, LineChart, MessageSquare, Trophy, BookOpen, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/context/AppContext";
import { generateChatResponse, detectIntent, AgentType } from "@/lib/gemini";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const AGENTS: { id: AgentType; name: string; icon: any; description: string }[] = [
  { id: "general", name: "LifePath Bot", icon: Sparkles, description: "Your daily companion" },
  { id: "goal_coach", name: "Goal Coach", icon: Target, description: "SMART goal expert" },
  { id: "motivational", name: "Motivator", icon: Lightbulb, description: "Boost your morale" },
  { id: "analytics", name: "Analyst", icon: LineChart, description: "Data & insights" },
  { id: "reflection", name: "Reflector", icon: Brain, description: "Deep self-reflection" },
];

const Chat = () => {
  const navigate = useNavigate();
  const { user, goals, reflections, chatHistory, addChatMessage } = useApp();
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: "user" | "bot"; timestamp: Date }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("general");

  useEffect(() => {
    // Load chat history from context
    if (chatHistory.length > 0) {
      setMessages(chatHistory);
    } else {
      // Initial welcome message
      const welcomeMessage = {
        id: "welcome",
        text: `Hi${user ? ` ${user.name}` : ""}! I'm your LifePathBot. Ready to reflect on your day? Let's check in—what tasks did you complete today?`,
        sender: "bot" as const,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getQuickActions = (agent: AgentType) => {
    switch (agent) {
      case "goal_coach":
        return [
          { label: "Set SMART Goal", icon: Target, prompt: "Help me set a specific SMART goal." },
          { label: "Review Progress", icon: TrendingUp, prompt: "Review my current goal progress." },
          { label: "Break Down Goal", icon: MessageSquare, prompt: "Help me break down my main goal into steps." },
        ];
      case "motivational":
        return [
          { label: "I feel stuck", icon: Lightbulb, prompt: "I'm feeling stuck and unmotivated." },
          { label: "Inspire Me", icon: Sparkles, prompt: "Give me an inspiring quote for students." },
          { label: "Celebrate Win", icon: Trophy, prompt: "I just achieved something small!" },
        ];
      case "analytics":
        return [
          { label: "Weekly Report", icon: LineChart, prompt: "Analyze my performance this week." },
          { label: "Mood Trends", icon: Brain, prompt: "What's my mood trend lately?" },
          { label: "Productivity", icon: Target, prompt: "How productive have I been?" },
        ];
      case "reflection":
        return [
          { label: "Daily Reflection", icon: Brain, prompt: "Guide me through a daily reflection." },
          { label: "Learning Log", icon: BookOpen, prompt: "I want to log what I learned today." },
          { label: "Emotional Check-in", icon: Heart, prompt: "I want to check in with my feelings." },
        ];
      default:
        return [
          { label: "Reflect on Day", icon: Sparkles, prompt: "Help me reflect on my day" },
          { label: "Set a Goal", icon: Target, prompt: "I want to set a new SMART goal" },
          { label: "Weekly Summary", icon: TrendingUp, prompt: "Show me my weekly summary" },
          { label: "Get Motivation", icon: Lightbulb, prompt: "I need some motivation" },
        ];
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    addChatMessage(userMessage);
    setInputValue("");
    setLoading(true);

    try {
      // Build context for Gemini
      const context = {
        userProfile: user
          ? {
            name: user.name,
            branch: user.branch,
            year: user.year,
          }
          : undefined,
        recentGoals: goals.slice(0, 3).map((g) => ({
          title: g.title,
          progress: g.progress,
        })),
        recentReflections: reflections.slice(0, 2).map((r) => ({
          mood: r.mood,
          accomplishments: r.accomplishments,
        })),
        chatHistory: messages.slice(-5).map((m) => ({
          text: m.text,
          sender: m.sender,
        })),
        agentType: selectedAgent,
      };

      const botResponse = await generateChatResponse(messageText, context);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      addChatMessage(botMessage);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble right now. Could you try rephrasing your message?",
        sender: "bot" as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Icons for quick actions need to be imported or defined if not available
  // I used some icons above that might not be imported. Let me fix imports.
  // Trophy, BookOpen, Heart were used in switch but not imported.

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center shadow-soft">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-foreground hidden sm:block">LifePath AI</h1>
                <Select value={selectedAgent} onValueChange={(v: AgentType) => setSelectedAgent(v)}>
                  <SelectTrigger className="h-8 w-[140px] sm:w-[180px] text-xs sm:text-sm border-none bg-transparent focus:ring-0 p-0">
                    <SelectValue placeholder="Select Agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGENTS.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <div className="flex items-center gap-2">
                          <agent.icon className="w-4 h-4" />
                          <span>{agent.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Chat History">
                  <History className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Chat History</DialogTitle>
                  <DialogDescription>Your conversation history with LifePathBot</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4">
                    {chatHistory.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No chat history yet</p>
                    ) : (
                      chatHistory.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-4 ${message.sender === "user"
                              ? "bg-gradient-hero text-primary-foreground"
                              : "bg-card shadow-card"
                              }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p
                              className={`text-xs mt-2 ${message.sender === "user" ? "opacity-80" : "text-muted-foreground"
                                }`}
                            >
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl w-full mx-auto px-4 py-6 space-y-4">
          <div className="flex justify-center mb-6">
            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
              Talking to: {AGENTS.find(a => a.id === selectedAgent)?.name}
            </Badge>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${message.sender === "user"
                  ? "bg-gradient-hero text-primary-foreground shadow-soft"
                  : "bg-card shadow-card border border-border/50"
                  }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p
                  className={`text-xs mt-2 ${message.sender === "user" ? "opacity-80" : "text-muted-foreground"
                    }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-card shadow-card border border-border/50 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">{AGENTS.find(a => a.id === selectedAgent)?.name} is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions & Input */}
      <div className="p-4 bg-card/50 backdrop-blur-sm border-t border-border/50">
        <div className="max-w-4xl w-full mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
            {getQuickActions(selectedAgent).map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="border-2 border-primary/30 hover:border-primary hover:bg-primary/10 text-xs justify-start h-auto py-2"
                onClick={() => handleSend(action.prompt)}
                disabled={loading}
              >
                <action.icon className="w-3 h-3 mr-2 flex-shrink-0" />
                <span className="truncate">{action.label}</span>
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={`Message ${AGENTS.find(a => a.id === selectedAgent)?.name}...`}
              className="flex-1 h-11"
              disabled={loading}
            />
            <Button
              onClick={() => handleSend()}
              className="bg-gradient-hero text-primary-foreground hover:shadow-glow h-11"
              disabled={loading || !inputValue.trim()}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
