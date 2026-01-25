import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ThumbsUp, MessageSquare, Lightbulb, Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

interface Suggestion {
    id: string;
    title: string;
    description: string;
    category: "campus" | "academic" | "events" | "facilities";
    author: string;
    date: string;
    votes: number;
    status: "approved" | "pending" | "implemented";
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

const Suggestions = () => {
    const navigate = useNavigate();
    const { user } = useApp();
    const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");

    const handleVote = (id: string) => {
        setSuggestions(suggestions.map(s =>
            s.id === id ? { ...s, votes: s.votes + 1 } : s
        ));
        toast.success("Vote recorded!");
    };

    const filteredSuggestions = suggestions.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" || s.category === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="container mx-auto p-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Campus Suggestions</h1>
                    <p className="text-muted-foreground">
                        Voice your ideas and vote on improvements for our community.
                    </p>
                </div>
                {(user?.role === "verified" || user?.role === "admin") && (
                    <Button onClick={() => navigate("/verified-upload")} className="bg-gradient-hero text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                        <Plus className="mr-2 h-4 w-4" />
                        Submit Suggestion
                    </Button>
                )}
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
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {["all", "campus", "academic", "events", "facilities"].map((cat) => (
                        <Button
                            key={cat}
                            variant={filter === cat ? "default" : "outline"}
                            onClick={() => setFilter(cat)}
                            className="capitalize"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="capitalize bg-secondary/50">
                                    {suggestion.category}
                                </Badge>
                                {suggestion.status === "implemented" && (
                                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                        Implemented
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                {suggestion.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-3 mt-2">
                                {suggestion.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">{suggestion.author}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleVote(suggestion.id)}
                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                    >
                                        <ThumbsUp className="h-4 w-4" />
                                        <span>{suggestion.votes}</span>
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
