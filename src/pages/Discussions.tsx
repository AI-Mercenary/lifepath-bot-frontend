import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { format } from "date-fns";

// API
import { getQuestions, createQuestion, answerQuestion } from "@/api/questions";

// MUI Icons
import ForumIcon from '@mui/icons-material/Forum';
import StarIcon from '@mui/icons-material/Star';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const categories = [
  { id: "all", name: "All", icon: ForumIcon, color: "bg-muted" },
  { id: "hackathons", name: "Hackathons", icon: StarIcon, color: "bg-primary/10" },
  { id: "academics", name: "Academics", icon: SchoolIcon, color: "bg-primary/10" },
  { id: "courses", name: "Courses", icon: MenuBookIcon, color: "bg-secondary/10" },
  { id: "internships", name: "Internships", icon: WorkIcon, color: "bg-accent/10" },
  { id: "careers", name: "Careers", icon: TrendingUpIcon, color: "bg-primary/10" },
  { id: "projects", name: "Projects", icon: AutoAwesomeIcon, color: "bg-secondary/10" },
  { id: "tips", name: "Tips & Tricks", icon: EmojiObjectsIcon, color: "bg-accent/10" },
  { id: "general", name: "General", icon: ForumIcon, color: "bg-muted" },
];

const Discussions = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [questions, setQuestions] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // New Question Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: "", body: "", category: "general", tags: "" });

  // View/Answer Dialog
  const [viewQuestion, setViewQuestion] = useState<any>(null);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
        try {
            const data = await getQuestions(selectedCategory !== "all" ? selectedCategory : undefined, searchQuery);
            setQuestions(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load community questions");
        }
    };
    // Implement simple debounce for search if needed. For now direct call.
    fetchQuestions();
  }, [selectedCategory, refreshTrigger, searchQuery]);

  const handlePostQuestion = async () => {
    if (!newQuestion.title || !newQuestion.body) return toast.error("Please fill in title and details");
    if (!user) return toast.error("You must be logged in");

    try {
        await createQuestion({
            firebaseUid: user.id,
            authorName: user.name,
            title: newQuestion.title,
            body: newQuestion.body,
            category: newQuestion.category,
            tags: newQuestion.tags.split(",").map(t => t.trim()).filter(Boolean)
        });
        toast.success("Question posted!");
        setNewQuestion({ title: "", body: "", category: "general", tags: "" });
        setIsDialogOpen(false);
        setRefreshTrigger(p => p + 1);
    } catch (error) {
        toast.error("Failed to post question");
    }
  };

  const handlePostAnswer = async () => {
    if (!answerText.trim()) return;
    if (!user) return toast.error("You must be logged in");

    try {
        await answerQuestion(viewQuestion._id, {
            firebaseUid: user.id,
            authorName: user.name,
            text: answerText
        });
        toast.success("Answer added!");
        setAnswerText("");
        setRefreshTrigger(p => p + 1);
        
        // Optimistically update the viewed question
        setViewQuestion((prev: any) => ({
             ...prev, 
             answers: [...prev.answers, { authorName: user.name, text: answerText, createdAt: new Date() }]
        }));
    } catch (error) {
        toast.error("Failed to submit answer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowBackIcon fontSize="small" className="text-muted-foreground" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                <ForumIcon className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Student Hub</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left column Content */}
        <div className="md:col-span-3 space-y-6">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h2 className="text-2xl font-bold mb-1">Q&A Board</h2>
                  <p className="text-sm text-muted-foreground">Ask peers, share knowledge, reach your goals.</p>
               </div>
               <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                 <DialogTrigger asChild>
                   <Button className="bg-gradient-hero text-white">
                     <AddCircleIcon fontSize="small" className="mr-2" /> Ask Question
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Post to the Hub</DialogTitle>
                      <DialogDescription>Get help or guidance from the student community</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="space-y-1">
                            <Label>Question Title</Label>
                            <Input placeholder="What do you need help with?" value={newQuestion.title} onChange={e => setNewQuestion({...newQuestion, title: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <Label>Topic</Label>
                            <Select value={newQuestion.category} onValueChange={(val) => setNewQuestion({...newQuestion, category: val})}>
                               <SelectTrigger><SelectValue/></SelectTrigger>
                               <SelectContent>
                                   {categories.slice(1).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                               </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Details</Label>
                            <Textarea rows={5} placeholder="Provide context..." value={newQuestion.body} onChange={e => setNewQuestion({...newQuestion, body: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <Label>Tags (Comma separated)</Label>
                            <Input placeholder="e.g. Web Dev, Placements" value={newQuestion.tags} onChange={e => setNewQuestion({...newQuestion, tags: e.target.value})} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePostQuestion} className="bg-gradient-hero text-white">Submit Post</Button>
                    </DialogFooter>
                 </DialogContent>
               </Dialog>
            </div>

            {/* Questions Feed */}
            <div className="space-y-4">
                {questions.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground">No questions found. Be the first to ask!</Card>
                ) : questions.map(q => (
                    <Card key={q._id} className="hover:shadow-md transition cursor-pointer border-border/60" onClick={() => setViewQuestion(q)}>
                        <CardHeader className="pb-3 flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-lg text-primary">{q.title}</CardTitle>
                                <div className="text-xs text-muted-foreground mt-1 mb-2">
                                   Posted by <span className="font-medium text-foreground">{q.authorName}</span> • {new Date(q.createdAt).toLocaleDateString()}
                                </div>
                                <CardDescription className="line-clamp-2 text-sm">{q.body}</CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                                <Badge variant="secondary" className="capitalize shrink-0">{q.category}</Badge>
                                <div className="flex items-center gap-1 text-muted-foreground bg-muted/30 px-2 py-1 rounded-md mt-2 text-xs">
                                     <ChatBubbleOutlineIcon fontSize="inherit" />
                                     <span className="font-medium">{q.answers?.length || 0}</span> answers
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>

        {/* Right Column Filtering */}
        <div className="space-y-6">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-2.5 text-muted-foreground" fontSize="small"  />
                <Input placeholder="Search..." className="pl-10 bg-card" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            <Card className="bg-card">
               <CardHeader className="py-4">
                   <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Topics</CardTitle>
               </CardHeader>
               <CardContent className="flex flex-col gap-1 pb-4">
                   {categories.map(cat => (
                       <Button key={cat.id} variant={selectedCategory === cat.id ? "default" : "ghost"} className="justify-start font-medium h-9" onClick={() => setSelectedCategory(cat.id)}>
                           <cat.icon fontSize="small" className={`mr-3 ${selectedCategory === cat.id ? "text-white" : "text-muted-foreground"}`} />
                           {cat.name}
                       </Button>
                   ))}
               </CardContent>
            </Card>

            <Card className="bg-gradient-hero border-transparent text-white overflow-hidden relative">
               <div className="absolute -right-4 -top-4 opacity-10"><AutoAwesomeIcon sx={{ fontSize: 100 }} /></div>
               <CardContent className="p-5">
                   <h3 className="font-bold text-lg mb-2">Guidance Spotlight</h3>
                   <p className="text-sm text-white/80 mb-4">Did you know LifePathBot can analyze your goals alongside peer answers?</p>
                   <Button variant="secondary" className="w-full" onClick={() => navigate('/chat')}>Ask AI Guide</Button>
               </CardContent>
            </Card>
        </div>
      </div>

      {/* Answer Modal */}
      <Dialog open={!!viewQuestion} onOpenChange={(open) => !open && setViewQuestion(null)}>
         <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
             <div className="p-6 border-b bg-muted/20 shrink-0">
                 <div className="flex items-start justify-between">
                    <div>
                       <Badge variant="outline" className="mb-3 uppercase text-xs tracking-wider border-primary text-primary">{viewQuestion?.category}</Badge>
                       <h2 className="text-2xl font-bold">{viewQuestion?.title}</h2>
                       <div className="text-xs text-muted-foreground mt-2">
                           Posted by <span className="font-semibold text-foreground">{viewQuestion?.authorName}</span> • {viewQuestion && new Date(viewQuestion.createdAt).toLocaleString()}
                       </div>
                    </div>
                 </div>
                 <p className="text-base leading-relaxed mt-4 whitespace-pre-wrap">{viewQuestion?.body}</p>
                 {viewQuestion?.tags?.length > 0 && (
                     <div className="flex gap-2 mt-4">
                         {viewQuestion.tags.map((t: string, i: number) => <Badge key={i} variant="secondary" className="bg-secondary/50 text-xs font-normal">{t}</Badge>)}
                     </div>
                 )}
             </div>

             <div className="flex-1 overflow-y-auto p-6 bg-background space-y-6">
                 <h3 className="font-bold text-lg flex items-center gap-2">
                    <ChatBubbleOutlineIcon fontSize="small"/> 
                    {viewQuestion?.answers?.length || 0} Community Answers
                 </h3>
                 
                 {viewQuestion?.answers?.length === 0 ? (
                     <p className="text-muted-foreground text-sm italic py-4">No answers yet. Can you help?</p>
                 ) : (
                     <div className="space-y-4">
                         {viewQuestion?.answers?.map((ans: any, i: number) => (
                             <Card key={i} className="shadow-sm border-border/40">
                                 <CardContent className="p-4">
                                     <div className="flex justify-between items-center mb-3">
                                         <div className="flex items-center gap-2">
                                             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                 {ans.authorName?.charAt(0).toUpperCase()}
                                             </div>
                                             <span className="font-medium text-sm text-foreground">{ans.authorName}</span>
                                         </div>
                                         <span className="text-xs text-muted-foreground">{new Date(ans.createdAt).toLocaleDateString()}</span>
                                     </div>
                                     <p className="text-sm leading-relaxed text-foreground/90">{ans.text}</p>
                                 </CardContent>
                             </Card>
                         ))}
                     </div>
                 )}
             </div>

             <div className="p-4 border-t bg-card shrink-0 flex gap-3">
                 <Input className="flex-1" placeholder="Type your answer or perspective..." value={answerText} onChange={e => setAnswerText(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handlePostAnswer()} />
                 <Button className="bg-gradient-hero px-6" onClick={handlePostAnswer}><SendIcon fontSize="small" className="mr-2"/> Reply</Button>
             </div>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default Discussions;
