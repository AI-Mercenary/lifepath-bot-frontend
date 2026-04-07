import React, { useState, useEffect } from 'react';
import { getSuggestions, updateSuggestionStatus } from "@/api/suggestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserCheck, ShieldAlert, Lightbulb, Upload, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { bulkCreateSuggestions } from "@/api/suggestions";
import { getAllChatHistory } from "@/api/chat";
import { getAllUsers } from "@/api/users";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("suggestions");

    // Data State
    const [pendingContent, setPendingContent] = useState<any[]>([]);
    const [pendingSuggestions, setPendingSuggestions] = useState<any[]>([]);
    const [allChats, setAllChats] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);

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

        const fetchAllUsers = async () => {
             try {
                 const users = await getAllUsers();
                 setAllUsers(users);
             } catch (error) {
                 console.error("Failed to fetch users", error);
             }
        };

        fetchPending();
        fetchAllChats();
        fetchAllUsers();
    }, []);

    // const handleApproveUser = (id: number) => { ... }
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const results: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                const formattedData = results
                    .map((row: any) => {
                        // Loose matching: find columns that sound right, or use fallbacks
                        const keys = Object.keys(row);
                        const nameKey = keys.find(k => k.toLowerCase().includes('name') || k.toLowerCase().includes('author')) || keys[0];
                        const catKey = keys.find(k => k.toLowerCase().includes('type of guidance') || k.toLowerCase().includes('domain') || k.toLowerCase().includes('category')) || keys[1];
                        const descKey = keys.find(k => k.toLowerCase().includes('detailed') || k.toLowerCase().includes('suggestion') || k.toLowerCase().includes('guidance')) || keys[2];
                        const branchKey = keys.find(k => k.toLowerCase().includes('branch') || k.toLowerCase().includes('dept') || k.toLowerCase().includes('student_id')) || '';
                        const yearKey = keys.find(k => k.toLowerCase().includes('year')) || '';
                        
                        // Only add if we have some sort of description/suggestion text
                        if (!row[descKey]) return null;

                        return {
                            authorName: row[nameKey] || "Anonymous",
                            branch: row[branchKey] || "General",
                            year: row[yearKey] || "1",
                            category: row[catKey]?.substring(0, 50) || "General",
                            title: String(row[descKey]).substring(0, 40) + '...' || "Suggestion Session",
                            description: String(row[descKey]),
                            tags: ["Bulk"]
                        };
                    }).filter(Boolean);

                if (formattedData.length > 0) {
                    await bulkCreateSuggestions(formattedData);
                    toast.success(`Successfully uploaded ${formattedData.length} suggestions!`);
                    // Reload pending
                    const raw = await getSuggestions(undefined, 'pending');
                    setPendingSuggestions(raw.map((item: any) => ({
                        id: item._id, title: item.title, category: item.category, author: item.authorName, date: new Date(item.createdAt).toLocaleDateString()
                    })));
                } else {
                    toast.warning("No valid suggestions found in file.");
                }
            } catch (error) {
                console.error("Bulk upload error", error);
                toast.error("Failed to parse file.");
            }
        };
        reader.readAsBinaryString(file);
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
                <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                }}>
                    Admin Logout
                </Button>
            </div>

            <Tabs defaultValue="suggestions" className="space-y-6" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="content">Content Moderation</TabsTrigger>
                    <TabsTrigger value="chats">User Chat Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                User Management
                            </CardTitle>
                            <CardDescription>View all {allUsers.length} registered accounts and profiles on LifePathBot.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4 max-h-[600px] overflow-auto pr-4">
                                {allUsers.length === 0 ? <p className="text-muted-foreground text-center py-8">No users found.</p> : 
                                  allUsers.map((u: any) => (
                                     <div key={u._id} className="p-4 border rounded-lg bg-card/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                         <div>
                                             <div className="flex gap-2 items-center mb-1">
                                                <h4 className="font-semibold">{u.name}</h4>
                                                <Badge variant={u.role === 'admin' ? 'destructive' : u.role === 'verified' ? 'default' : 'secondary'}>{u.role.toUpperCase()}</Badge>
                                             </div>
                                             <p className="text-sm text-muted-foreground">{u.email}</p>
                                             {(u.dept || u.student_id) && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {u.student_id ? `ID: ${u.student_id}` : ''} {u.dept ? `| Dept: ${u.dept}` : ''}
                                                </p>
                                             )}
                                         </div>
                                         <div className="text-sm text-right">
                                             <div className="text-muted-foreground mb-1">Joined</div>
                                             <div className="font-medium">{new Date(u.createdAt).toLocaleDateString()}</div>
                                         </div>
                                     </div>
                                  ))
                                }
                             </div>
                        </CardContent>
                    </Card>
                </TabsContent>

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
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                                        onChange={handleFileUpload} 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Button variant="outline" className="gap-2 pointer-events-none">
                                        <Upload className="h-4 w-4" />
                                        Upload File
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
