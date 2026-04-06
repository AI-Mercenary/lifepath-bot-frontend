import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/context/AppContext";
import { AgentType } from "@/lib/llm";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveChatMessage, getUserSessions, getSessionMessages, askChatbot, deleteChatSession } from "@/api/chat";

// MUI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HistoryIcon from '@mui/icons-material/History';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { uploadMaterial } from "@/api/chat";

const AGENTS: { id: AgentType; name: string; icon: any; description: string }[] = [
    { id: "general" as AgentType, name: "General Mode", icon: AutoAwesomeIcon, description: "Daily companion & suggestions" },
    { id: "study" as AgentType, name: "Study Mode", icon: MenuBookIcon, description: "Upload & chat with study materials" },
];

const Chat = () => {
  const navigate = useNavigate();
  const { user, goals, reflections, chatHistory, addChatMessage } = useApp();
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: "user" | "bot"; timestamp: Date }>>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("general");
  const [currentSessionId, setCurrentSessionId] = useState(`session-${Date.now()}`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSessionsList = async () => {
    if (user?.id) {
        try {
            const res = await getUserSessions(user.id);
            setSessions(res);
        } catch (e) {
            console.error(e);
        }
    }
  };

  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      text: `Hi${user ? ` ${user.name}` : ""}! I'm your LifePathBot. Your AI assistant is ready to help you with your journey.`,
      sender: "bot" as const,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    loadSessionsList();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = () => {
      setCurrentSessionId(`session-${Date.now()}`);
      setMessages([{
        id: "welcome",
        text: "I'm ready for a new conversation. What's on your mind?",
        sender: "bot",
        timestamp: new Date()
      }]);
  };

  const loadPastSession = async (sessionId: string) => {
    setLoading(true);
    try {
        const msgs = await getSessionMessages(sessionId);
        setCurrentSessionId(sessionId);
        setMessages(msgs.map((m: any) => ({
            id: m._id,
            text: m.text,
            sender: m.role,
            timestamp: new Date(m.createdAt)
        })));
    } catch (e) {
        toast.error("Failed to load session context");
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      await deleteChatSession(sessionId);
      if (sessionId === currentSessionId) {
        handleNewChat();
      }
      loadSessionsList();
      toast.success("Chat deleted successfully");
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|ppt|pptx)$/i)) {
      toast.error("Please upload a valid document (.pdf, .doc, .docx, .ppt, .pptx).");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadMaterial(file);
      toast.success(`Document "${res.data.title}" processed successfully!`);
      
      const systemMsg = {
        id: Date.now().toString(),
        text: `Successfully uploaded and parsed: ${res.data.title}. You can now ask questions about this document.`,
        sender: "bot" as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMsg]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload/parse document. Ensure backend is running.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
    setInputValue("");
    setLoading(true);

    // Save user message to backend under currentSessionId
    if (user?.id) {
       saveChatMessage({
           firebaseUid: user.id,
           userName: user.name,
           sessionId: currentSessionId,
           role: 'user',
           text: messageText,
           agentType: selectedAgent
       }).catch(console.error);
    }

    try {
      const context = {
        userProfile: user ? { name: user.name, branch: user.branch, year: user.year, } : undefined,
        recentGoals: goals.slice(0, 3).map((g) => ({ title: g.title, progress: g.progress, })),
        recentReflections: reflections.slice(0, 2).map((r) => ({ mood: r.mood, accomplishments: r.accomplishments, })),
        chatHistory: messages.slice(-5).map((m) => ({ text: m.text, sender: m.sender, })),
        agentType: selectedAgent,
      };

      const botResponse = await askChatbot(messageText, context);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Save bot response to backend
      if (user?.id) {
         await saveChatMessage({
             firebaseUid: user.id,
             userName: 'LifePathBot',
             sessionId: currentSessionId,
             role: 'bot',
             text: botResponse,
             agentType: selectedAgent
         });
         loadSessionsList(); // Refresh the sessions list in sidebar
      }

    } catch (error) {
      console.error("Chat error:", error);
      toast.error("AI connection failed. Please check your internet or try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getQuickActions = (agent: AgentType) => {
    if (agent === "study") {
      return [
        { label: "Define Key Terms", icon: MenuBookIcon, prompt: "What are the key terms defined in this document?" },
        { label: "Summarize Content", icon: AutoAwesomeIcon, prompt: "Give me a detailed summary of this document." },
        { label: "Main Objectives", icon: LightbulbIcon, prompt: "What are the main objectives or findings here?" },
      ];
    }
    return [
      { label: "Student Suggestions", icon: LightbulbIcon, prompt: "Give me some helpful student suggestions." },
      { label: "Reflect on Day", icon: AutoAwesomeIcon, prompt: "Help me reflect on my day" },
      { label: "Set a Goal", icon: TrackChangesIcon, prompt: "I want to set a new SMART goal" },
    ];
  };

  return (
    <div className="h-screen bg-gradient-subtle flex flex-col md:flex-row overflow-hidden">
      {/* Left Sidebar: Chat History */}
      <div className="hidden md:flex md:w-80 flex-col bg-card/80 border-r border-border/50 backdrop-blur-md">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <HistoryIcon className="text-primary w-5 h-5" />
                <h2 className="font-semibold text-lg">Sessions</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={handleNewChat} title="New Chat">
                <AddCircleOutlineIcon fontSize="small" />
            </Button>
        </div>
        <ScrollArea className="flex-1 p-4">
            {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center mt-10">No past conversations.</p>
            ) : (
                <div className="space-y-3">
                   {sessions.map((sess, idx) => (
                       <Card 
                        key={idx} 
                        className={`p-3 border-none shadow-none text-sm transition cursor-pointer group ${currentSessionId === sess._id ? 'bg-primary/10 border-l-4 border-primary' : 'bg-muted/30 hover:bg-muted/60'}`}
                        onClick={() => loadPastSession(sess._id)}
                       >
                           <div className="flex justify-between items-start gap-2">
                             <p className="line-clamp-2 text-foreground font-medium flex-1 text-xs leading-relaxed">{sess.lastMessage}</p>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0" 
                               onClick={(e) => handleDeleteSession(e, sess._id)}
                               title="Delete chat"
                             >
                               <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                             </Button>
                           </div>
                           <div className="flex justify-between items-center mt-2">
                               <Badge variant="outline" className="text-[10px] h-4 uppercase">{sess.agentType}</Badge>
                               <span className="text-[10px] text-muted-foreground">{new Date(sess.createdAt).toLocaleDateString()}</span>
                           </div>
                       </Card>
                   ))}
                </div>
            )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-10 shrink-0">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                  <ArrowBackIcon fontSize="small" />
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center shadow-soft">
                    <SmartToyIcon className="text-white" />
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
                              <agent.icon fontSize="small" />
                              <span>{agent.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="md:hidden" onClick={handleNewChat}>
                      <AddCircleOutlineIcon fontSize="inherit" className="mr-1" /> New
                  </Button>
                  <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Messages */}
          <ScrollArea className="flex-1 bg-background/30 p-4">
            <div className="max-w-3xl mx-auto space-y-4 pb-4">
              <div className="flex justify-center mb-6">
                <Badge variant="outline" className="bg-background/50 backdrop-blur-sm px-3 py-1 text-xs">
                  Session: {currentSessionId.split('-').pop()} • Mode: {AGENTS.find(a => a.id === selectedAgent)?.name}
                </Badge>
              </div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[80%] lg:max-w-3xl rounded-2xl px-5 py-4 ${message.sender === "user"
                      ? "bg-gradient-hero text-primary-foreground shadow-soft"
                      : "bg-card shadow-sm border border-border/50"
                      }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base break-words">{message.text}</p>
                    <p className={`text-[11px] mt-2 ${message.sender === "user" ? "opacity-80 text-right" : "text-muted-foreground text-left"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-card shadow-card border border-border/50 rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                      <AutorenewIcon className="animate-spin text-primary" fontSize="small" />
                      <span className="text-sm text-muted-foreground">Synthesizing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions & Input */}
          <div className="p-4 bg-card/80 backdrop-blur-md border-t border-border/50 shrink-0">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-3">
                {getQuickActions(selectedAgent).map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="border-primary/30 hover:border-primary hover:bg-primary/10 text-xs rounded-full"
                    onClick={() => handleSend(action.prompt)}
                    disabled={loading}
                  >
                    <action.icon fontSize="inherit" className="mr-1.5" />
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Input */}
              <div className="flex space-x-2 items-center">
                {selectedAgent === "study" && (
                  <>
                    <input
                      type="file"
                      id="material-upload"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full h-12 w-12 border-primary/30 text-primary hover:bg-primary/5 shrink-0"
                      disabled={uploading || loading}
                      title="Upload Study Material"
                    >
                      {uploading ? <AutorenewIcon className="animate-spin" /> : <CloudUploadIcon />}
                    </Button>
                  </>
                )}
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={selectedAgent === "study" ? "Ask about your material..." : "Message LifePath AI..."}
                  className="flex-1 h-12 rounded-full px-5 shadow-sm"
                  disabled={loading}
                />
                <Button
                  onClick={() => handleSend()}
                  className="bg-gradient-hero text-primary-foreground hover:shadow-glow h-12 w-12 rounded-full p-0 flex items-center justify-center shrink-0"
                  disabled={loading || !inputValue.trim()}
                >
                  {loading ? <AutorenewIcon className="animate-spin" /> : <SendIcon fontSize="small" className="ml-1" />}
                </Button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Chat;
