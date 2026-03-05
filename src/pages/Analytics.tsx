import { SectionCard } from "@/components/SectionCard";
import { StatCard } from "@/components/StatCard";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BarChart3, Calendar, Activity, Zap, ShieldAlert } from "lucide-react";

// Dense dark tech data
const weeklyData = [65, 72, 58, 80, 74, 90, 85];
const monthlyData = [52, 58, 65, 60, 72, 68, 75, 80, 78, 85, 82, 88];

const heatmapData = Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, () => Math.random())
);
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Analytics = () => (
  <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3 font-heading tracking-wide">
          Intelligence Analytics
        </h1>
        <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase font-bold">Aggregated dimensional variance over time</p>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex items-center gap-3 bg-surface/80 backdrop-blur-xl border border-border/70 rounded-2xl px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <Zap className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_hsl(45_100%_60%)]" />
        <div className="flex flex-col">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Data Aggregation</span>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest ticker">Syncing block 842.x</span>
        </div>
      </motion.div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Weekly Variance" value="78.4" change="+5.2 Δ from last cycle" changeType="up" icon={<TrendingUp className="w-4 h-4 text-emerald-400" />} index={0} />
      <StatCard title="Peak Saturation" value="Tuesday" change="Highest structural load" changeType="down" icon={<ShieldAlert className="w-4 h-4 text-primary" />} index={1} />
      <StatCard title="Node Handshakes" value="4.2k" change="+12% growth vector" changeType="up" icon={<BarChart3 className="w-4 h-4 text-blue-400" />} index={2} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly bars */}
      <SectionCard title="Micro-Trend (7 Day)" subtitle="Prosodic output velocity" index={0}>
        <div className="p-6 bg-surface/20 border border-border/30 rounded-xl shadow-inner flex items-end gap-3 h-52 relative overflow-hidden group">
          <div className="absolute inset-0 grid-overlay opacity-[0.05] mix-blend-screen pointer-events-none" />

          {weeklyData.map((v, i) => (
            <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-2 relative z-10">
              <motion.div
                className="w-full rounded-t bg-gradient-to-t from-emerald-900/40 to-emerald-400/80 shadow-inner group-hover:opacity-60 transition-opacity"
                whileHover={{ opacity: 1, filter: "brightness(1.5)" }}
                style={{ boxShadow: '0 -4px 16px -2px hsl(160 84% 39% / 0.4)' }}
                initial={{ height: 0 }}
                animate={{ height: `${v}%` }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
              />
              <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest">{days[i]}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Monthly bars */}
      <SectionCard title="Macro-Trend (12 Month)" subtitle="Annual resonance shift" index={1}>
        <div className="p-6 bg-surface/20 border border-border/30 rounded-xl shadow-inner flex items-end gap-2 h-52 relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />

          {monthlyData.map((v, i) => (
            <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-2 relative z-10">
              <motion.div
                className="w-full rounded bg-gradient-to-t from-primary/20 to-primary/80 group-hover:opacity-50 transition-opacity"
                whileHover={{ opacity: 1, filter: "saturate(2)" }}
                initial={{ height: 0 }}
                animate={{ height: `${v}%` }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: "easeOut" }}
              />
              <span className="text-[8px] text-white/40 font-bold uppercase tracking-tighter" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{months[i]}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>

    {/* Heatmap */}
    <SectionCard title="Density Heatmap" subtitle="Acoustic ping frequency across standard matrix (24hr window)" index={2}>
      <div className="p-6 bg-surface/20 border border-border/30 rounded-xl shadow-inner space-y-2 relative overflow-x-auto">
        <div className="flex gap-1 ml-10 mb-2 opacity-50">
          {Array.from({ length: 24 }).map((_, i) => <span key={i} className="flex-1 text-[8px] text-center font-mono-data">{i.toString().padStart(2, '0')}</span>)}
        </div>

        {heatmapData.map((row, di) => (
          <div key={di} className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold w-6 text-right">{days[di].charAt(0)}</span>
            <div className="flex gap-1 flex-1">
              {row.map((v, hi) => {
                // Determine intensity thresholds for distinct tech style colors
                let colorClass = "bg-white/5 border-white/5";
                let shadow = "none";
                if (v > 0.8) { colorClass = "bg-primary border-primary"; shadow = "0 0 12px hsl(356_100%_63%/0.6)"; }
                else if (v > 0.6) { colorClass = "bg-primary/60 border-primary/40"; shadow = "0 0 8px hsl(356_100%_63%/0.3)"; }
                else if (v > 0.4) { colorClass = "bg-amber-500/50 border-amber-500/30"; }
                else if (v > 0.2) { colorClass = "bg-emerald-500/30 border-emerald-500/20"; }

                return (
                  <motion.div
                    key={hi}
                    className={`h-4 flex-1 rounded-sm border hover:border-white transition-colors cursor-crosshair ${colorClass}`}
                    style={{ boxShadow: shadow }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + (di * 24 + hi) * 0.003 }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  </div>
);

export default Analytics;
