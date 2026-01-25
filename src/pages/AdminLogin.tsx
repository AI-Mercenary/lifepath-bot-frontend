import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useApp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const success = await login(email, password);
        
        if (success) {
             // The login function in AppContext handles the routing/toast for success if needed, 
             // but here we might want to ensure they are actually an admin.
             // Since login() returns true, we can check the user role or just navigate.
             // However, login updates state asynchronously. 
             // Ideally we navigate after check.
             
             // For static admin, we know it redirects or we should redirect.
             navigate("/admin");
        } 
        
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-primary/20 shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
                    <CardDescription>
                        Secure access for LifePath administrators
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-background/50"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                "Verifying Access..."
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" /> Login to Dashboard
                                </span>
                            )}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground mt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="hover:text-primary underline underline-offset-4"
                            >
                                Return to Student Login
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;
