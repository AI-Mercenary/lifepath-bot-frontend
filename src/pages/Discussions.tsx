import { useState, useEffect } from "react";
import {
  MessageSquare,
  TrendingUp,
  Plus,
  Search,
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
  BookOpen,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Award,
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
import { format } from "date-fns";

// Imports for API
import { getSuggestions, createSuggestion, Suggestion } from "@/api/suggestions";

interface Discussion extends Suggestion {
   // Mapping mongo _id to id for frontend compatibility if needed
   id: string; 
   content: string; // Mapping description to content
   author: string; // Mapping authorName to author
   likes: number; // Mapping upvotes to likes
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

const categoryBackendMap: Record<string, string> = {
  "hackathons": "Hackathons",
  "academics": "Academics",
  "courses": "Courses",
  "internships": "Internships",
  "careers": "Careers",
  "projects": "Projects",
  "tips": "Tips & Tricks",
  "general": "General"
};

const Discussions = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // For re-fetching
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "general",
    tags: "",
  });

  useEffect(() => {
    const fetchDiscussions = async () => {
        try {
            const data = await getSuggestions(selectedCategory !== "all" ? selectedCategory : undefined);
            const mappedData = data.map((item: any) => ({
                id: item._id,
                title: item.title,
                content: item.description,
                category: item.category,
                author: item.authorName,
                createdAt: item.createdAt,
                likes: item.upvotes,
                replies: 0, // Placeholder
                tags: item.tags,
                isPinned: false
            }));
            setDiscussions(mappedData);
        } catch (error) {
            console.error("Failed to load discussions", error);
            toast.error("Failed to load discussions");
        }
    };
    
    fetchDiscussions();
    
    fetchDiscussions();
  }, [selectedCategory, refreshTrigger]);

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title || !newDiscussion.content) {
      toast.error("Please fill in title and content");
      return;
    }

    if (!user) {
        toast.error("You must be logged in to post");
        return;
    }

    try {
        const backendCategory = categoryBackendMap[newDiscussion.category] || "General";
        await createSuggestion({
            firebaseUid: user.id, // Assuming user.id is firebase uid from AppContext
            title: newDiscussion.title,
            description: newDiscussion.content,
            category: backendCategory,
            tags: newDiscussion.tags.split(",").map((t) => t.trim()).filter(Boolean)
        });

        toast.success("Suggestion created successfully!");
        setNewDiscussion({ title: "", content: "", category: "general", tags: "" });
        setIsDialogOpen(false);
        // Refresh list without reload
        setRefreshTrigger(prev => prev + 1);
    } catch (error) {
        console.error("Failed to create suggestion", error);
        toast.error("Failed to post suggestion");
    }
  };

  const handleLike = (id: string) => {
    const updated = discussions.map((d) => (d.id === id ? { ...d, likes: d.likes + 1 } : d));
    setDiscussions(updated);
    localStorage.setItem("discussions", JSON.stringify(updated));
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesCategory = selectedCategory === "all" || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
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
              <h1 className="text-2xl font-bold text-foreground">Student Forums</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Discussions</h2>
            <p className="text-muted-foreground">
              Connect with fellow students, ask questions, and share knowledge.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/suggestions")} className="border-primary/20 hover:border-primary hover:bg-primary/5">
              <Lightbulb className="mr-2 h-4 w-4 text-primary" />
              View Suggestions
            </Button>
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
        </div>

        <div className="space-y-6">
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

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
        </div>
      </div>
    </div>
  );
};

export default Discussions;
