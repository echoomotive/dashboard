import { motion } from "framer-motion";
import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: ReactNode;
  index?: number;
  live?: boolean;
}

export function StatCard({ title, value, change, changeType = "neutral", icon, index = 0, live }: StatCardProps) {
  const isUp = changeType === "up";
  const isDown = changeType === "down";
  const changeColor = isUp ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : isDown ? "text-primary bg-primary/10 border-primary/20" : "text-muted-foreground bg-surface border-border";
  const ChangeIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  // Generate a random sparkline for the tech feel
  const sparkPoints = Array.from({ length: 15 }, () => 10 + Math.random() * 20);
  const sparkPath = sparkPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * (100 / 14)} ${30 - p}`).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative overflow-hidden group rounded-xl border border-border/80 bg-gradient-to-br from-card/90 to-background/50 backdrop-blur-xl p-5 card-hover shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
    >
      {/* Dynamic hover radial gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,_hsl(356_100%_63%/0.1),_transparent_70%)]" />

      {/* Top glowing edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

      {live && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary live-pulse shadow-[0_0_8px_hsl(356_100%_63%)]" />
      )}

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-surface/80 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors border border-border/50 shadow-inner group-hover:shadow-[inset_0_0_12px_hsl(356_100%_63%/0.2)] group-hover:border-primary/30">
          {icon}
        </div>

        {/* Fake sparkline chart */}
        <div className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity flex items-end justify-end">
          <svg viewBox="0 0 100 30" className="w-full h-full stroke-primary/70 fill-none" preserveAspectRatio="none">
            <motion.path
              d={sparkPath}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground ticker tracking-tight">{value}</p>
      </div>

      {change && (
        <div className="mt-4 pt-3 border-t border-border/40 relative z-10 flex items-center justify-between">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${changeColor}`}>
            <ChangeIcon className="w-3 h-3" />
            <p className="text-[10px] uppercase font-bold tracking-wider">{change}</p>
          </div>
          {live && <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Streaming</span>}
        </div>
      )}
    </motion.div>
  );
}
