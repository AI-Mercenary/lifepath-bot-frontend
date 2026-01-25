import React, { useState, useEffect } from 'react';
import { getSuggestions, updateSuggestionStatus } from "@/api/suggestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserCheck, ShieldAlert, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("suggestions");

    // Data State
    // const [pendingUsers, setPendingUsers] = useState([]); // Removed as per request
    const [pendingContent, setPendingContent] = useState([]);
    const [pendingSuggestions, setPendingSuggestions] = useState<any[]>([]);

    useEffect(() => {
        // Fetch pending suggestions on mount
        const fetchPending = async () => {
            try {
                const data = await getSuggestions(undefined, 'pending');
                // The API returns list of suggestions.
                // Map to match UI if needed, or adjust UI to match API.
                // API: { _id, title, description, category, authorName, ... }
                // UI expects: { id, title, category, author, ... }
                
                const mapped = data.map((item: any) => ({
                    id: item._id,
                    title: item.title,
                    category: item.category,
                    author: item.authorName,
                    date: new Date(item.createdAt).toLocaleDateString()
                }));
                setPendingSuggestions(mapped);
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
            }
        };
        fetchPending();
    }, []);

    // const handleApproveUser = (id: number) => { ... }
    // const handleRejectUser = (id: number) => { ... }

    const handleApproveContent = (id: number) => {
        setPendingContent(pendingContent.filter(c => c.id !== id));
        toast.success("Content approved for publication");
    };

    const handleRejectContent = (id: number) => {
        setPendingContent(pendingContent.filter(c => c.id !== id));
        toast.info("Content rejected");
    };

    const handleApproveSuggestion = async (id: string) => {
        try {
            await updateSuggestionStatus(id, 'approved');
            setPendingSuggestions(pendingSuggestions.filter(s => s.id !== id));
            toast.success("Suggestion approved");
        } catch (error) {
            toast.error("Failed to approve suggestion");
        }
    };

    const handleRejectSuggestion = async (id: string) => {
        try {
            await updateSuggestionStatus(id, 'rejected');
            setPendingSuggestions(pendingSuggestions.filter(s => s.id !== id));
            toast.info("Suggestion rejected");
        } catch (error) {
            toast.error("Failed to reject suggestion");
        }
    };

    return (
        <div className="container mx-auto p-6 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage user verifications, content moderation, and suggestions.</p>
            </div>

            <Tabs defaultValue="suggestions" className="space-y-6" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="content">Content Moderation</TabsTrigger>
                </TabsList>



                <TabsContent value="content" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5" />
                                Pending Content
                            </CardTitle>
                            <CardDescription>Review hackathons, competitions, and workshops.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingContent.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No pending content.</p>
                            ) : (
                                <div className="space-y-4">
                                    {pendingContent.map((content) => (
                                        <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                                            <div>
                                                <p className="font-medium">{content.title}</p>
                                                <div className="flex gap-2 mt-1">
                                                    <Badge>{content.type}</Badge>
                                                    <span className="text-sm text-muted-foreground">by {content.author}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => handleRejectContent(content.id)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleApproveContent(content.id)}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suggestions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5" />
                                Pending Suggestions
                            </CardTitle>
                            <CardDescription>Review and approve student suggestions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingSuggestions.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No pending suggestions.</p>
                            ) : (
                                <div className="space-y-4">
                                    {pendingSuggestions.map((suggestion) => (
                                        <div key={suggestion.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                                            <div>
                                                <p className="font-medium">{suggestion.title}</p>
                                                <div className="flex gap-2 mt-1">
                                                    <Badge variant="secondary">{suggestion.category}</Badge>
                                                    <span className="text-sm text-muted-foreground">by {suggestion.author}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => handleRejectSuggestion(suggestion.id)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleApproveSuggestion(suggestion.id)}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;
