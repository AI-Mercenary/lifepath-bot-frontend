import * as React from "react";
import Button, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Keeping the original variants array for consumers that rely on the class generation (e.g. variants for Links),
// but we won't strictly use all these classes *inside* the button since we delegate to MUI.
// However, standard Tailwind classes like 'rounded-md' might clash with MUI's 'rounded' style if not careful.
// We will try to pass them through.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const WrappedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    
    // Mapping logic
    let muiVariant: MuiButtonProps["variant"] = "contained";
    let muiColor: MuiButtonProps["color"] = "primary";
    
    if (variant === "default") { muiVariant = "contained"; muiColor = "primary"; }
    else if (variant === "destructive") { muiVariant = "contained"; muiColor = "error"; }
    else if (variant === "outline") { muiVariant = "outlined"; }
    else if (variant === "secondary") { muiVariant = "contained"; muiColor = "secondary"; }
    else if (variant === "ghost") { muiVariant = "text"; }
    else if (variant === "link") { muiVariant = "text"; } 

    let muiSize: MuiButtonProps["size"] = "medium";
    if (size === "sm") muiSize = "small";
    if (size === "lg") muiSize = "large";

    // If asChild is true, Shadcn expects to use Slot.
    // MUI Button implements 'component' prop but behaves differently.
    // To support generic 'asChild' behavior without breaking existing code that might pass a Link as child,
    // we can fallback to the original behavior IF asChild is true? 
    // Or we can try to use MUI's "component" prop if possible.
    // Simplifying: If asChild, we render a Slot (standard Shadcn behavior) BUT we lose MUI styling unless we apply MUI classes.
    // This is the tricky part of "revamping".
    
    // Given usage in Welcome.tsx: <Button ... onClick={() => navigate(...)}>Get Started</Button>
    // It does not use 'asChild'.
    
    if (asChild) {
      // Fallback to original Slot implementation for complex composition cases, or try to style it.
      // For now, let's just return the Slot with original classes to avoid breakage, 
      // conceding that 'asChild' components might not be fully MUI-fied yet.
      const { Slot } = require("@radix-ui/react-slot");
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <Button
        ref={ref}
        variant={muiVariant}
        color={muiColor}
        size={muiSize}
        className={cn(className)}
        {...props}
      />
    );
  }
);
WrappedButton.displayName = "Button";

export { WrappedButton as Button, buttonVariants };
