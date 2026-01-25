import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Trophy, ExternalLink, Filter } from "lucide-react";
import { format } from "date-fns";

interface Hackathon {
    id: string;
    title: string;
    description: string;
    date: string;
    registrationDeadline: string;
    link: string;
    category: "hackathon" | "competition" | "workshop";
    prize: string;
    location: string;
    tags: string[];
    organizer: string;
}

const MOCK_HACKATHONS: Hackathon[] = [
    {
        id: "1",
        title: "Global AI Hackathon 2024",
        description: "Join thousands of developers worldwide in this 48-hour coding challenge. Build innovative solutions using Generative AI.",
        date: "2024-12-15",
        registrationDeadline: "2024-12-10",
        link: "https://example.com/hackathon",
        category: "hackathon",
        prize: "$50,000 Pool",
        location: "Online",
        tags: ["AI", "GenAI", "Global"],
        organizer: "Tech Giants Alliance"
    },
    {
        id: "2",
        title: "University Coding Cup",
        description: "Inter-university competitive programming contest. Test your algorithms and data structures skills.",
        date: "2024-11-20",
        registrationDeadline: "2024-11-15",
        link: "https://example.com/cup",
        category: "competition",
        prize: "Internship Opportunities",
        location: "Hybrid",
        tags: ["Algorithms", "Competitive Programming"],
        organizer: "CS Department"
    },
    {
        id: "3",
        title: "Web3 Workshop & Build",
        description: "Learn the basics of Web3 and build your first dApp in this hands-on workshop.",
        date: "2024-11-25",
        registrationDeadline: "2024-11-24",
        link: "https://example.com/web3",
        category: "workshop",
        prize: "Certificates",
        location: "Campus Hall A",
        tags: ["Web3", "Blockchain", "Beginner"],
        organizer: "Blockchain Club"
    }
];

const Competitions = () => {
    const [competitions, setCompetitions] = useState<Hackathon[]>(MOCK_HACKATHONS);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");

    const filteredCompetitions = competitions.filter(comp => {
        const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comp.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" || comp.category === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="container mx-auto p-6 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Competitions & Events</h1>
                <p className="text-muted-foreground">
                    Discover verified hackathons, competitions, and workshops curated for you.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search events..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "hackathon" ? "default" : "outline"}
                        onClick={() => setFilter("hackathon")}
                    >
                        Hackathons
                    </Button>
                    <Button
                        variant={filter === "competition" ? "default" : "outline"}
                        onClick={() => setFilter("competition")}
                    >
                        Competitions
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompetitions.map((comp) => (
                    <Card key={comp.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={
                                    comp.category === "hackathon" ? "default" :
                                        comp.category === "competition" ? "secondary" : "outline"
                                } className="capitalize">
                                    {comp.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {format(new Date(comp.date), "MMM dd")}
                                </Badge>
                            </div>
                            <CardTitle className="line-clamp-1">{comp.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{comp.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{comp.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    <span>{comp.prize}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Reg. Deadline: {format(new Date(comp.registrationDeadline), "MMM dd")}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {comp.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs bg-secondary/50">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0 mt-auto">
                            <Button className="w-full" onClick={() => window.open(comp.link, "_blank")}>
                                View Details <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-2">
                                Organized by {comp.organizer}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredCompetitions.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Competitions;
