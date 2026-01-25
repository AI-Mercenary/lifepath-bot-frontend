import React from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, User, BadgeCheck, Settings } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const RoleSwitcher = () => {
    const { user, updateUser } = useApp();

    if (!user) return null;

    const handleRoleChange = (role: "student" | "admin" | "verified") => {
        updateUser({ role });
        toast.success(`Switched to ${role} role`);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-background shadow-lg border-primary/20 hover:border-primary">
                        <Settings className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Dev Tools: Switch Role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleRoleChange("student")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Student</span>
                        {user.role === "student" && <span className="ml-auto text-xs text-muted-foreground">(Current)</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange("verified")}>
                        <BadgeCheck className="mr-2 h-4 w-4" />
                        <span>Verified User</span>
                        {user.role === "verified" && <span className="ml-auto text-xs text-muted-foreground">(Current)</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange("admin")}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                        {user.role === "admin" && <span className="ml-auto text-xs text-muted-foreground">(Current)</span>}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
