import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface MagicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "whatsapp" | "ghost";
  size?: "sm" | "md" | "lg";
}

const MagicButton = forwardRef<HTMLButtonElement, MagicButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const sizes = {
      sm: "px-5 py-2.5 text-sm",
      md: "px-7 py-3.5 text-[0.95rem]",
      lg: "px-9 py-4.5 text-base md:px-10 md:py-5 md:text-lg",
    };

    const variants = {
      primary:
        "bg-gradient-magic text-primary-foreground shadow-glow-primary hover:scale-[1.02] hover:shadow-[0_20px_60px_-24px_hsl(var(--primary)/0.6)]",
      whatsapp:
        "bg-whatsapp text-white shadow-[0_16px_40px_-20px_hsl(var(--whatsapp)/0.48)] hover:scale-[1.02] hover:shadow-[0_22px_48px_-20px_hsl(var(--whatsapp)/0.58)]",
      ghost:
        "glass text-foreground hover:scale-[1.015] hover:bg-white/[0.075] hover:border-white/15",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "interactive-surface relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/10 font-semibold tracking-[0.01em] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/14 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </button>
    );
  }
);

MagicButton.displayName = "MagicButton";
export default MagicButton;
