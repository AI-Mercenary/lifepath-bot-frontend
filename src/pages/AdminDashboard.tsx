import React, { useState, useEffect } from 'react';
import { getSuggestions, updateSuggestionStatus } from "@/api/suggestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserCheck, ShieldAlert, Lightbulb, Upload, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Papa from 'papaparse';
import { bulkCreateSuggestions } from "@/api/suggestions";
import { getAllChatHistory } from "@/api/chat";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("suggestions");

    // Data State
    const [pendingContent, setPendingContent] = useState<any[]>([]);
    const [pendingSuggestions, setPendingSuggestions] = useState<any[]>([]);
    const [allChats, setAllChats] = useState<any[]>([]);

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

        const fetchAllChats = async () => {
             try {
                 const chats = await getAllChatHistory();
                 setAllChats(chats);
             } catch (error) {
                 console.error("Failed to fetch chats", error);
             }
        };

        fetchPending();
        fetchAllChats();
    }, []);

    // const handleApproveUser = (id: number) => { ... }
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const formattedData = results.data
                        .filter((row: any) => row['Name'] && row['What type of guidance do you want to give right now for the students / your fellow peers'])
                        .map((row: any) => ({
                            authorName: row['Name'],
                            category: row['What type of guidance do you want to give right now for the students / your fellow peers'],
                            title: row['Your detailed suggestion / guidance']?.substring(0, 40) + '...' || "Suggestion Session",
                            description: row['Your detailed suggestion / guidance'],
                            tags: [row['Primary Domain / Specialization you are interested in'], row['Department']].filter(Boolean)
                        }));

                    if (formattedData.length > 0) {
                        await bulkCreateSuggestions(formattedData);
                        toast.success(`Successfully uploaded ${formattedData.length} suggestions!`);
                        // Could refetch here, but bulk uploads go straight to approved, so they won't show in the pending UI.
                    } else {
                        toast.warning("No valid suggestions found in CSV.");
                    }
                } catch (error) {
                    console.error("Bulk upload error", error);
                    toast.error("Failed to upload suggestions");
                }
            }
        });
    };

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
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage user verifications, content moderation, and suggestions.</p>
                </div>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    ← Back to User Dashboard
                </Button>
            </div>

            <Tabs defaultValue="suggestions" className="space-y-6" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="content">Content Moderation</TabsTrigger>
                    <TabsTrigger value="chats">User Chat Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="chats" className="space-y-4">
                    <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2">
                                 <MessageSquare className="h-5 w-5" />
                                 Platform Chat Logs
                             </CardTitle>
                             <CardDescription>Monitor AI interactions across all students</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4 max-h-[600px] overflow-auto pr-4">
                                {allChats.length === 0 ? <p className="text-muted-foreground text-center py-8">No chat history recorded.</p> : 
                                  allChats.map((chat: any) => (
                                     <div key={chat._id} className="p-4 border rounded-lg bg-card/50 flex flex-col gap-2">
                                         <div className="flex justify-between items-center text-sm">
                                             <div className="flex gap-2 items-center">
                                                <Badge variant={chat.role === 'user' ? 'default' : 'secondary'}>{chat.role.toUpperCase()}</Badge>
                                                <span className="font-semibold">{chat.userName}</span>
                                             </div>
                                             <span className="text-muted-foreground">{new Date(chat.createdAt).toLocaleString()}</span>
                                         </div>
                                         <p className="text-sm mt-1 bg-muted/20 p-3 rounded-md border border-border/30">
                                            {chat.text}
                                         </p>
                                         <div className="text-xs text-muted-foreground text-right">
                                             Session: {chat.sessionId} | Agent: {chat.agentType}
                                         </div>
                                     </div>
                                  ))
                                }
                             </div>
                        </CardContent>
                    </Card>
                </TabsContent>

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
                            <div className="mb-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium mb-1">Bulk Upload Suggestions</h4>
                                    <p className="text-sm text-muted-foreground">Upload a Google Forms CSV specifically for automated processing.</p>
                                </div>
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        accept=".csv" 
                                        onChange={handleFileUpload} 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Button variant="outline" className="gap-2 pointer-events-none">
                                        <Upload className="h-4 w-4" />
                                        Upload CSV
                                    </Button>
                                </div>
                            </div>
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
