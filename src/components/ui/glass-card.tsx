// CAMINHO: components/ui/glass-card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-glass-border bg-glass-bg",
        "shadow-glass backdrop-blur-lg",
        "transition-all duration-300 hover:shadow-xl", // Efeito de elevação sutil no hover
        className
      )}
      {...props}
    >
      {/* O elemento que cria o efeito de brilho */}
      <div className="glass-shine" />
      {/* O conteúdo do card é renderizado sobre o brilho */}
      <div className="relative z-10">
        {props.children}
      </div>
    </div>
  )
);
GlassCard.displayName = "GlassCard";

export { GlassCard };