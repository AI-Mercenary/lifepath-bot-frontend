import { useState, useEffect } from "react";
import {
  MessageSquare,
  TrendingUp,
  Plus,
  Search,
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
  Calendar,
  Briefcase,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Sparkles,
  Award,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  likes: number;
  replies: number;
  tags: string[];
  isPinned?: boolean;
}

interface HackathonUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  registrationDeadline: string;
  link?: string;
  category: string;
  prize?: string;
  location: string;
  tags: string[];
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  createdAt: string;
  upvotes: number;
  status: "pending" | "approved" | "implemented";
  tags: string[];
}

const categories = [
  { id: "all", name: "All", icon: MessageSquare, color: "bg-muted" },
  { id: "hackathons", name: "Hackathons", icon: Award, color: "bg-primary/10" },
  { id: "academics", name: "Academics", icon: GraduationCap, color: "bg-primary/10" },
  { id: "courses", name: "Courses", icon: BookOpen, color: "bg-secondary/10" },
  { id: "internships", name: "Internships", icon: Briefcase, color: "bg-accent/10" },
  { id: "careers", name: "Careers", icon: TrendingUp, color: "bg-primary/10" },
  { id: "projects", name: "Projects", icon: Sparkles, color: "bg-secondary/10" },
  { id: "tips", name: "Tips & Tricks", icon: Lightbulb, color: "bg-accent/10" },
  { id: "general", name: "General", icon: MessageSquare, color: "bg-muted" },
];

const Discussions = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<"discussions" | "hackathons" | "suggestions">("discussions");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [hackathons, setHackathons] = useState<HackathonUpdate[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHackathonDialogOpen, setIsHackathonDialogOpen] = useState(false);
  const [isSuggestionDialogOpen, setIsSuggestionDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "general",
    tags: "",
  });
  const [newHackathon, setNewHackathon] = useState({
    title: "",
    description: "",
    date: "",
    registrationDeadline: "",
    link: "",
    category: "hackathons",
    prize: "",
    location: "Online",
    tags: "",
  });
  const [newSuggestion, setNewSuggestion] = useState({
    title: "",
    description: "",
    category: "general",
    tags: "",
  });

  useEffect(() => {
    // Load discussions
    const savedDiscussions = localStorage.getItem("discussions");
    if (savedDiscussions) {
      setDiscussions(JSON.parse(savedDiscussions));
    } else {
      const sample: Discussion[] = [
        {
          id: "1",
          title: "Best Hackathons for Beginners in 2024",
          content: "Looking for recommendations on beginner-friendly hackathons. What are your experiences?",
          category: "hackathons",
          author: "TechEnthusiast",
          createdAt: new Date().toISOString(),
          likes: 15,
          replies: 8,
          tags: ["beginners", "2024", "recommendations"],
          isPinned: true,
        },
        {
          id: "2",
          title: "How to prepare for Software Engineering interviews?",
          content: "What resources and strategies helped you crack your dream job interviews?",
          category: "careers",
          author: "CodeSeeker",
          createdAt: new Date().toISOString(),
          likes: 42,
          replies: 23,
          tags: ["interviews", "preparation", "swe"],
        },
        {
          id: "3",
          title: "Free Online Courses for Machine Learning",
          content: "Share your favorite free ML courses and resources. Let's build a comprehensive list!",
          category: "courses",
          author: "MLStudent",
          createdAt: new Date().toISOString(),
          likes: 28,
          replies: 15,
          tags: ["machine-learning", "courses", "free"],
        },
      ];
      setDiscussions(sample);
      localStorage.setItem("discussions", JSON.stringify(sample));
    }

    // Load hackathons
    const savedHackathons = localStorage.getItem("hackathons");
    if (savedHackathons) {
      setHackathons(JSON.parse(savedHackathons));
    } else {
      const sample: HackathonUpdate[] = [
        {
          id: "1",
          title: "Global Hackathon 2024",
          description: "Join thousands of developers worldwide in this 48-hour coding challenge. Build innovative solutions for real-world problems.",
          date: "2024-12-15",
          registrationDeadline: "2024-12-10",
          link: "https://example.com/hackathon",
          category: "hackathons",
          prize: "$50,000",
          location: "Online",
          tags: ["global", "48-hours", "innovation"],
        },
        {
          id: "2",
          title: "AI Innovation Challenge",
          description: "Showcase your AI/ML skills. Build projects using cutting-edge AI technologies.",
          date: "2024-11-20",
          registrationDeadline: "2024-11-15",
          category: "hackathons",
          prize: "$25,000",
          location: "Hybrid",
          tags: ["ai", "ml", "innovation"],
        },
      ];
      setHackathons(sample);
      localStorage.setItem("hackathons", JSON.stringify(sample));
    }

    // Load suggestions
    const savedSuggestions = localStorage.getItem("suggestions");
    if (savedSuggestions) {
      setSuggestions(JSON.parse(savedSuggestions));
    }
  }, []);

  const handleCreateDiscussion = () => {
    if (!newDiscussion.title || !newDiscussion.content) {
      toast.error("Please fill in title and content");
      return;
    }

    const discussion: Discussion = {
      id: Date.now().toString(),
      title: newDiscussion.title,
      content: newDiscussion.content,
      category: newDiscussion.category,
      author: user?.name || "Anonymous",
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: 0,
      tags: newDiscussion.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const updated = [discussion, ...discussions];
    setDiscussions(updated);
    localStorage.setItem("discussions", JSON.stringify(updated));
    toast.success("Discussion created!");
    setNewDiscussion({ title: "", content: "", category: "general", tags: "" });
    setIsDialogOpen(false);
  };

  const handleCreateHackathon = () => {
    if (!newHackathon.title || !newHackathon.description || !newHackathon.date) {
      toast.error("Please fill in required fields");
      return;
    }

    const hackathon: HackathonUpdate = {
      id: Date.now().toString(),
      ...newHackathon,
      tags: newHackathon.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const updated = [hackathon, ...hackathons];
    setHackathons(updated);
    localStorage.setItem("hackathons", JSON.stringify(updated));
    toast.success("Hackathon update posted!");
    setNewHackathon({
      title: "",
      description: "",
      date: "",
      registrationDeadline: "",
      link: "",
      category: "hackathons",
      prize: "",
      location: "Online",
      tags: "",
    });
    setIsHackathonDialogOpen(false);
  };

  const handleCreateSuggestion = () => {
    if (!newSuggestion.title || !newSuggestion.description) {
      toast.error("Please fill in title and description");
      return;
    }

    const suggestion: Suggestion = {
      id: Date.now().toString(),
      ...newSuggestion,
      author: user?.name || "Anonymous",
      createdAt: new Date().toISOString(),
      upvotes: 0,
      status: "pending",
      tags: newSuggestion.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const updated = [suggestion, ...suggestions];
    setSuggestions(updated);
    localStorage.setItem("suggestions", JSON.stringify(updated));
    toast.success("Suggestion submitted! Thank you for your feedback.");
    setNewSuggestion({ title: "", description: "", category: "general", tags: "" });
    setIsSuggestionDialogOpen(false);
  };

  const handleLike = (id: string) => {
    const updated = discussions.map((d) => (d.id === id ? { ...d, likes: d.likes + 1 } : d));
    setDiscussions(updated);
    localStorage.setItem("discussions", JSON.stringify(updated));
  };

  const handleUpvote = (id: string) => {
    const updated = suggestions.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s));
    setSuggestions(updated);
    localStorage.setItem("suggestions", JSON.stringify(updated));
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesCategory = selectedCategory === "all" || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredSuggestions = suggestions.filter((s) => {
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Community Hub</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Discussions & Updates</h2>
          <p className="text-muted-foreground">
            Connect with fellow students, discover hackathons, share suggestions, and stay updated
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="whitespace-nowrap"
                >
                  <cat.icon className="h-4 w-4 mr-2" />
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* Search and Create */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-hero text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    New Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Start a New Discussion</DialogTitle>
                    <DialogDescription>
                      Share your thoughts, ask questions, or start a conversation
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter a descriptive title..."
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newDiscussion.category}
                        onValueChange={(value) => setNewDiscussion({ ...newDiscussion, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Share your thoughts, questions, or experiences..."
                        rows={6}
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        placeholder="e.g., javascript, web-dev, learning"
                        value={newDiscussion.tags}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, tags: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateDiscussion} className="bg-gradient-hero text-primary-foreground">
                      Post Discussion
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Discussions List */}
            <div className="space-y-4">
              {sortedDiscussions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No discussions found. Start a new one!</p>
                  </CardContent>
                </Card>
              ) : (
                sortedDiscussions.map((discussion) => {
                  const category = categories.find((c) => c.id === discussion.category);
                  return (
                    <Card key={discussion.id} className="hover:shadow-soft transition-all">
                      {discussion.isPinned && (
                        <div className="px-6 pt-4">
                          <Badge variant="outline" className="text-xs">
                            📌 Pinned
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{discussion.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{discussion.content}</CardDescription>
                          </div>
                          <Badge variant="secondary" className="capitalize flex-shrink-0">
                            {category?.name || discussion.category}
                          </Badge>
                        </div>
                        {discussion.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {discussion.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-foreground">{discussion.author}</span>
                            <span>{format(new Date(discussion.createdAt), "MMM dd, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleLike(discussion.id)}
                              className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>{discussion.likes}</span>
                            </button>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{discussion.replies}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Hackathons Tab */}
          <TabsContent value="hackathons" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hackathons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isHackathonDialogOpen} onOpenChange={setIsHackathonDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-hero text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Share Hackathon
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Share a Hackathon Update</DialogTitle>
                    <DialogDescription>Help fellow students discover exciting hackathons</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="hack-title">Hackathon Name *</Label>
                      <Input
                        id="hack-title"
                        placeholder="e.g., Global Hackathon 2024"
                        value={newHackathon.title}
                        onChange={(e) => setNewHackathon({ ...newHackathon, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hack-desc">Description *</Label>
                      <Textarea
                        id="hack-desc"
                        placeholder="Describe the hackathon..."
                        rows={4}
                        value={newHackathon.description}
                        onChange={(e) => setNewHackathon({ ...newHackathon, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hack-date">Event Date *</Label>
                        <Input
                          id="hack-date"
                          type="date"
                          value={newHackathon.date}
                          onChange={(e) => setNewHackathon({ ...newHackathon, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hack-deadline">Registration Deadline</Label>
                        <Input
                          id="hack-deadline"
                          type="date"
                          value={newHackathon.registrationDeadline}
                          onChange={(e) =>
                            setNewHackathon({ ...newHackathon, registrationDeadline: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hack-location">Location</Label>
                        <Input
                          id="hack-location"
                          placeholder="Online, Hybrid, or City"
                          value={newHackathon.location}
                          onChange={(e) => setNewHackathon({ ...newHackathon, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hack-prize">Prize Pool</Label>
                        <Input
                          id="hack-prize"
                          placeholder="e.g., $50,000"
                          value={newHackathon.prize}
                          onChange={(e) => setNewHackathon({ ...newHackathon, prize: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hack-link">Registration Link</Label>
                      <Input
                        id="hack-link"
                        type="url"
                        placeholder="https://..."
                        value={newHackathon.link}
                        onChange={(e) => setNewHackathon({ ...newHackathon, link: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hack-tags">Tags (comma-separated)</Label>
                      <Input
                        id="hack-tags"
                        placeholder="ai, web-dev, beginner-friendly"
                        value={newHackathon.tags}
                        onChange={(e) => setNewHackathon({ ...newHackathon, tags: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsHackathonDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateHackathon} className="bg-gradient-hero text-primary-foreground">
                      Share Hackathon
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHackathons.length === 0 ? (
                <Card className="col-span-2">
                  <CardContent className="py-12 text-center">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hackathons found. Share one!</p>
                  </CardContent>
                </Card>
              ) : (
                filteredHackathons.map((hackathon) => (
                  <Card key={hackathon.id} className="hover:shadow-soft transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                        <Badge variant="outline" className="flex-shrink-0">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(hackathon.date), "MMM dd")}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-3">{hackathon.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{hackathon.location}</span>
                        </div>
                        {hackathon.prize && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Prize:</span>
                            <span className="font-medium text-primary">{hackathon.prize}</span>
                          </div>
                        )}
                        {hackathon.registrationDeadline && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Deadline:</span>
                            <span className="font-medium">
                              {format(new Date(hackathon.registrationDeadline), "MMM dd, yyyy")}
                            </span>
                          </div>
                        )}
                        {hackathon.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {hackathon.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {hackathon.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => window.open(hackathon.link, "_blank")}
                          >
                            Register <ExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suggestions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isSuggestionDialogOpen} onOpenChange={setIsSuggestionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-hero text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Suggestion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Submit a Suggestion</DialogTitle>
                    <DialogDescription>
                      Share your ideas to improve LifePathBot or help fellow students
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="sug-title">Title *</Label>
                      <Input
                        id="sug-title"
                        placeholder="Brief title for your suggestion..."
                        value={newSuggestion.title}
                        onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sug-category">Category</Label>
                      <Select
                        value={newSuggestion.category}
                        onValueChange={(value) => setNewSuggestion({ ...newSuggestion, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sug-desc">Description *</Label>
                      <Textarea
                        id="sug-desc"
                        placeholder="Describe your suggestion in detail..."
                        rows={6}
                        value={newSuggestion.description}
                        onChange={(e) => setNewSuggestion({ ...newSuggestion, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sug-tags">Tags (comma-separated)</Label>
                      <Input
                        id="sug-tags"
                        placeholder="feature, improvement, ui"
                        value={newSuggestion.tags}
                        onChange={(e) => setNewSuggestion({ ...newSuggestion, tags: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSuggestionDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateSuggestion} className="bg-gradient-hero text-primary-foreground">
                      Submit Suggestion
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {filteredSuggestions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No suggestions yet. Be the first to share your ideas!</p>
                  </CardContent>
                </Card>
              ) : (
                filteredSuggestions.map((suggestion) => {
                  const category = categories.find((c) => c.id === suggestion.category);
                  return (
                    <Card key={suggestion.id} className="hover:shadow-soft transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{suggestion.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{suggestion.description}</CardDescription>
                          </div>
                          <Badge
                            variant={
                              suggestion.status === "implemented"
                                ? "default"
                                : suggestion.status === "approved"
                                ? "secondary"
                                : "outline"
                            }
                            className="capitalize flex-shrink-0"
                          >
                            {suggestion.status}
                          </Badge>
                        </div>
                        {suggestion.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {suggestion.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-foreground">{suggestion.author}</span>
                            <span>{format(new Date(suggestion.createdAt), "MMM dd, yyyy")}</span>
                            <Badge variant="outline" className="text-xs">
                              {category?.name || suggestion.category}
                            </Badge>
                          </div>
                          <button
                            onClick={() => handleUpvote(suggestion.id)}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{suggestion.upvotes}</span>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Discussions;
