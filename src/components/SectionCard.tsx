import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  index?: number;
  action?: ReactNode;
}

export function SectionCard({ title, subtitle, children, className = "", index = 0, action }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative overflow-hidden bg-gradient-to-br from-card/80 to-background/90 border border-border/60 rounded-xl backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] group ${className}`}
    >
      {/* High-tech corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />

      {/* Subtle top scanline */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/70 transition-colors duration-500" />

      {/* Header Panel */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-surface/30 backdrop-blur-md z-10 relative">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(356_100%_63%/0.8)]" />
            <h3 className="text-sm font-bold tracking-widest uppercase text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 ml-3.5 border-l border-primary/20 pl-2">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="shrink-0 flex items-center gap-1 group/action cursor-pointer">
            {action}
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover/action:text-primary transition-colors group-hover/action:translate-x-0.5" />
          </div>
        )}
      </div>

      {/* Content Space */}
      <div className="p-6 relative z-10 w-full">
        {/* Faint overlay grid to create monitor texture */}
        <div className="absolute inset-0 grid-overlay opacity-[0.03] pointer-events-none mix-blend-overlay" />
        {children}
      </div>
    </motion.div>
  );
}
