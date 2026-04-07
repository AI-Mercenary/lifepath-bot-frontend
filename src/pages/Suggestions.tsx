import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ThumbsUp, MessageSquare, Lightbulb, Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { getSuggestions, createSuggestion } from "@/api/suggestions";

interface Suggestion {
    id: string;
    title: string;
    description: string;
    category: "Hackathons" | "Placements" | "Academics" | "Courses" | "Internships" | "Projects" | string;
    author: string;
    branch?: string;
    year?: string;
    date: string;
    votes: number;
    status: "approved" | "pending" | "rejected";
}

const MOCK_SUGGESTIONS: Suggestion[] = [
    {
        id: "1",
        title: "24/7 Library Access During Exams",
        description: "Extend library hours to 24/7 during the final exam weeks to support late-night studying.",
        category: "facilities",
        author: "Student Council",
        date: "2024-11-01",
        votes: 125,
        status: "approved"
    },
    {
        id: "2",
        title: "More Plant-Based Options in Cafeteria",
        description: "Introduce a dedicated station for vegan and vegetarian meals in the main cafeteria.",
        category: "campus",
        author: "Green Club",
        date: "2024-11-10",
        votes: 89,
        status: "approved"
    },
    {
        id: "3",
        title: "Annual Tech Symposium",
        description: "Host a university-wide tech symposium inviting industry leaders and alumni.",
        category: "events",
        author: "Tech Society",
        date: "2024-11-15",
        votes: 210,
        status: "implemented"
    }
];

const CATEGORIES = ["All", "Hackathons", "Placements", "Academics", "Internships", "Courses", "Projects"];

const Suggestions = () => {
    const navigate = useNavigate();
    const { user } = useApp();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("All");
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newSuggestion, setNewSuggestion] = useState({ title: "", description: "", category: "Academics", tags: "" });
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const formatCategory = (cat: string, title?: string, desc?: string) => {
        const textToSearch = ((cat || "") + " " + (title || "") + " " + (desc || "")).toLowerCase();
        
        if (textToSearch.includes("hackathon")) return "Hackathons";
        if (textToSearch.includes("internship")) return "Internships";
        if (textToSearch.includes("placement") || textToSearch.includes("career")) return "Placements";
        if (textToSearch.includes("course") || textToSearch.includes("certif")) return "Courses";
        if (textToSearch.includes("project")) return "Projects";

        if (!cat) return "Academics";
        const formatted = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
        const validCategories = ["Hackathons", "Placements", "Academics", "Internships", "Courses", "Projects"];
        if (validCategories.includes(formatted)) return formatted;
        
        return "Academics";
    };

    const fetchSuggestions = async () => {
        try {
            const data = await getSuggestions();
            const mapped = data.map((item: any) => ({
                id: item._id,
                title: item.title,
                description: item.description,
                category: formatCategory(item.category, item.title, item.description),
                author: item.authorName || "Anonymous",
                branch: item.branch || "General",
                year: item.year || "1",
                date: new Date(item.createdAt).toLocaleDateString(),
                votes: item.upvotes || 0,
                status: item.status
            }));
            setSuggestions(mapped);
        } catch (error) {
            console.error("Failed to load suggestions:", error);
            toast.error("Failed to load suggestions");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSuggestions();
    }, []);

    const handleSubmit = async () => {
        if (!newSuggestion.title || !newSuggestion.description) return toast.error("Please fill in title and description");
        if (!user) return toast.error("You must be logged in");

        try {
            await createSuggestion({
                firebaseUid: user.id,
                title: newSuggestion.title,
                description: newSuggestion.description,
                category: newSuggestion.category,
                tags: newSuggestion.tags.split(",").map(t => t.trim()).filter(Boolean)
            });
            toast.success("Suggestion submitted for review!");
            setNewSuggestion({ title: "", description: "", category: "Academics", tags: "" });
            setIsDialogOpen(false);
            fetchSuggestions();
        } catch (error) {
            toast.error("Failed to post suggestion");
        }
    };

    const handleVote = (id: string) => {
        setSuggestions(suggestions.map(s =>
            s.id === id ? { ...s, votes: s.votes + 1 } : s
        ));
        toast.success("Vote recorded!");
    };

    const filteredSuggestions = suggestions.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "All" || s.category === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="container mx-auto p-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Community Hub</h1>
                    <p className="text-muted-foreground">
                        Explore, vote, and submit new suggestions based on different topics.
                    </p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-hero text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                        <Plus className="mr-2 h-4 w-4" />
                        Submit Suggestion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Suggest an Idea</DialogTitle>
                      <DialogDescription>Share your suggestion for the community</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="space-y-1">
                            <Label>Suggestion Title</Label>
                            <Input placeholder="What is your idea?" value={newSuggestion.title} onChange={e => setNewSuggestion({...newSuggestion, title: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <Label>Topic</Label>
                            <Select value={newSuggestion.category} onValueChange={(val) => setNewSuggestion({...newSuggestion, category: val})}>
                               <SelectTrigger><SelectValue/></SelectTrigger>
                               <SelectContent>
                                   {CATEGORIES.filter(c => c !== "All").map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                               </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Details</Label>
                            <Textarea rows={4} placeholder="Provide context..." value={newSuggestion.description} onChange={e => setNewSuggestion({...newSuggestion, description: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <Label>Tags (Comma separated)</Label>
                            <Input placeholder="e.g. WiFi, Campus" value={newSuggestion.tags} onChange={e => setNewSuggestion({...newSuggestion, tags: e.target.value})} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} className="bg-gradient-hero text-white">Submit</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search suggestions..."
                        className="pl-10 bg-card/50 backdrop-blur-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat}
                            variant={filter === cat ? "default" : "outline"}
                            onClick={() => setFilter(cat)}
                            className="capitalize whitespace-nowrap"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 max-w-4xl w-full">
                {filteredSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="group hover:shadow-md transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start mb-1">
                                <Badge variant="secondary" className="capitalize bg-secondary/50">
                                    {suggestion.category}
                                </Badge>
                                {suggestion.status === "implemented" && (
                                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                        Implemented
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {suggestion.title}
                            </CardTitle>
                            <div className="mt-2">
                                <CardDescription className={`text-sm ${expandedIds.has(suggestion.id) ? '' : 'line-clamp-2'}`}>
                                    {suggestion.description}
                                </CardDescription>
                                {suggestion.description && suggestion.description.length > 120 && (
                                    <button 
                                        onClick={() => toggleExpand(suggestion.id)}
                                        className="text-primary text-xs font-semibold mt-1 hover:underline focus:outline-none"
                                    >
                                        {expandedIds.has(suggestion.id) ? "Show Less" : "Read More..."}
                                    </button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/30 text-sm text-muted-foreground">
                                <div className="flex flex-col">
                                    <span className="font-bold text-foreground text-sm">{suggestion.author}</span>
                                    <span className="text-[11px] text-muted-foreground uppercase tracking-tight">
                                        {suggestion.branch}, Year {suggestion.year}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleVote(suggestion.id)}
                                        className="flex items-center gap-1.5 hover:text-primary transition-colors bg-secondary/30 px-3 py-1.5 rounded-full"
                                    >
                                        <ThumbsUp className="h-4 w-4" />
                                        <span className="font-medium">{suggestion.votes}</span>
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Suggestions;
