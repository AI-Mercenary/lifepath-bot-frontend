import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Sparkles, Target, TrendingUp, Lightbulb, Loader2, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/context/AppContext";
import { generateChatResponse, detectIntent } from "@/lib/gemini";
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

const Chat = () => {
  const navigate = useNavigate();
  const { user, goals, reflections, chatHistory, addChatMessage } = useApp();
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: "user" | "bot"; timestamp: Date }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);

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

  const quickActions = [
    { label: "Reflect on Today", icon: Sparkles, prompt: "Help me reflect on my day" },
    { label: "Set a Goal", icon: Target, prompt: "I want to set a new SMART goal" },
    { label: "Weekly Summary", icon: TrendingUp, prompt: "Show me my weekly summary" },
    { label: "Get Motivation", icon: Lightbulb, prompt: "I need some motivation" },
  ];

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
      // Detect intent for better context
      const intent = detectIntent(messageText);

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
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-foreground">LifePathBot</h1>
                <p className="text-xs text-muted-foreground">Always here to help</p>
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
                            className={`max-w-[80%] rounded-2xl p-4 ${
                              message.sender === "user"
                                ? "bg-gradient-hero text-primary-foreground"
                                : "bg-card shadow-card"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p
                              className={`text-xs mt-2 ${
                                message.sender === "user" ? "opacity-80" : "text-muted-foreground"
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === "user"
                    ? "bg-gradient-hero text-primary-foreground shadow-soft"
                    : "bg-card shadow-card border border-border/50"
                }`}
              >
                <p className="leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender === "user" ? "opacity-80" : "text-muted-foreground"
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
                  <span className="text-sm text-muted-foreground">LifePathBot is thinking...</span>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="border-2 border-primary/30 hover:border-primary hover:bg-primary/10 text-xs"
                onClick={() => handleSend(action.prompt)}
                disabled={loading}
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type your message..."
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
