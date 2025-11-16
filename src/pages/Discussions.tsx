import { useState, useEffect } from "react";
import { MessageSquare, TrendingUp, Plus, Search, Filter, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NavLink } from "@/components/NavLink";

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
}

const categories = [
  { id: "all", name: "All Discussions", icon: MessageSquare },
  { id: "hackathons", name: "Hackathons", icon: TrendingUp },
  { id: "courses", name: "Courses", icon: MessageSquare },
  { id: "careers", name: "Careers", icon: TrendingUp },
  { id: "internships", name: "Internships", icon: MessageSquare },
  { id: "projects", name: "Projects", icon: TrendingUp },
  { id: "tips", name: "Tips & Tricks", icon: MessageSquare },
  { id: "general", name: "General", icon: MessageSquare },
];

const Discussions = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
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
    const saved = localStorage.getItem("discussions");
    if (saved) {
      setDiscussions(JSON.parse(saved));
    } else {
      // Sample data
      const sampleDiscussions: Discussion[] = [
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
      ];
      setDiscussions(sampleDiscussions);
      localStorage.setItem("discussions", JSON.stringify(sampleDiscussions));
    }
  }, []);

  const handleCreateDiscussion = () => {
    if (!newDiscussion.title || !newDiscussion.content) return;

    const discussion: Discussion = {
      id: Date.now().toString(),
      title: newDiscussion.title,
      content: newDiscussion.content,
      category: newDiscussion.category,
      author: localStorage.getItem("userName") || "Anonymous",
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: 0,
      tags: newDiscussion.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    const updated = [discussion, ...discussions];
    setDiscussions(updated);
    localStorage.setItem("discussions", JSON.stringify(updated));

    setNewDiscussion({ title: "", content: "", category: "general", tags: "" });
    setIsDialogOpen(false);
  };

  const handleLike = (id: string) => {
    const updated = discussions.map(d =>
      d.id === id ? { ...d, likes: d.likes + 1 } : d
    );
    setDiscussions(updated);
    localStorage.setItem("discussions", JSON.stringify(updated));
  };

  const filteredDiscussions = discussions.filter(d => {
    const matchesCategory = selectedCategory === "all" || d.category === selectedCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <NavLink to="/dashboard" className="text-xl font-bold text-foreground">
                LifePathBot
              </NavLink>
              <nav className="hidden md:flex gap-6">
                <NavLink to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </NavLink>
                <NavLink to="/goals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Goals
                </NavLink>
                <NavLink to="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  AI Coach
                </NavLink>
                <NavLink to="/discussions" className="text-sm font-medium text-primary">
                  Discussions
                </NavLink>
              </nav>
            </div>
            <NavLink to="/profile">
              <Button variant="outline" size="sm">Profile</Button>
            </NavLink>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Community Discussions</h1>
          <p className="text-muted-foreground">Connect, share experiences, and learn from fellow students</p>
        </div>

        {/* Categories */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
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
        <div className="mb-8 flex flex-col md:flex-row gap-4">
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
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
                <DialogDescription>
                  Share your thoughts, ask questions, or start a conversation with the community.
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
                    <SelectTrigger id="category">
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
                <Button onClick={handleCreateDiscussion}>Post Discussion</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Discussions List */}
        <div className="space-y-4">
          {filteredDiscussions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No discussions found. Start a new one!</p>
              </CardContent>
            </Card>
          ) : (
            filteredDiscussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-card transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{discussion.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{discussion.content}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {discussion.category}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {discussion.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{discussion.author}</span>
                      <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Discussions;
