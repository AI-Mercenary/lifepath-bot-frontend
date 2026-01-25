import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Calendar, TrendingUp, ArrowRight, Smile, Frown, Meh } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { format } from "date-fns";

const GoalReflection = () => {
    const navigate = useNavigate();
    const { reflections, goals } = useApp();

    // Mock data if no reflections exist
    const displayReflections = reflections.length > 0 ? reflections : [
        { id: "1", date: new Date().toISOString(), mood: 4, accomplishments: "Finished the React project", challenges: "Debugging context", learnings: "Better state management" },
        { id: "2", date: new Date(Date.now() - 86400000).toISOString(), mood: 3, accomplishments: "Read 20 pages", challenges: "Time management", learnings: "Focus techniques" },
    ];

    const averageMood = displayReflections.reduce((acc, curr) => acc + curr.mood, 0) / displayReflections.length;

    const getMoodIcon = (mood: number) => {
        if (mood >= 4) return <Smile className="w-6 h-6 text-green-500" />;
        if (mood === 3) return <Meh className="w-6 h-6 text-yellow-500" />;
        return <Frown className="w-6 h-6 text-red-500" />;
    };

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Goal Reflection</h1>
                    <p className="text-muted-foreground">Track your journey, analyze your mood, and grow daily.</p>
                </div>
                <Button onClick={() => navigate("/chat")} className="bg-gradient-hero text-primary-foreground">
                    <Brain className="mr-2 h-4 w-4" />
                    Start Guided Reflection
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            {averageMood.toFixed(1)} / 5
                            {getMoodIcon(Math.round(averageMood))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Based on last {displayReflections.length} reflections
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reflection Streak</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3 Days</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Keep it up! Consistency is key.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{goals.filter(g => g.isCompleted).length} / {goals.length}</div>
                        <Progress value={(goals.filter(g => g.isCompleted).length / (goals.length || 1)) * 100} className="mt-2" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Reflections</CardTitle>
                        <CardDescription>Your daily insights and learnings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {displayReflections.map((reflection) => (
                            <div key={reflection.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                                <div className="mt-1 bg-background p-2 rounded-full shadow-sm">
                                    {getMoodIcon(reflection.mood)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium leading-none">
                                            {format(new Date(reflection.date), "EEEE, MMMM do")}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {reflection.accomplishments}
                                    </p>
                                    {reflection.learnings && (
                                        <p className="text-xs text-primary/80 mt-1">
                                            💡 Learned: {reflection.learnings}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Reflection Prompts</CardTitle>
                        <CardDescription>Ideas to help you get started.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {[
                            "What was the most challenging part of your day?",
                            "What is one thing you learned today?",
                            "How did you progress towards your main goal?",
                            "What are you grateful for today?"
                        ].map((prompt, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 cursor-pointer transition-all group" onClick={() => navigate("/chat")}>
                                <span className="text-sm font-medium group-hover:text-primary transition-colors">{prompt}</span>
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GoalReflection;
