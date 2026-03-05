import { SectionCard } from "@/components/SectionCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Zap, Clock, Activity, BarChart2 } from "lucide-react";

// Dense, dark tech style colors matching index.css EMOTION_TEXT
const pieData = [
  { label: "Calm", pct: 34, color: "bg-emerald-500", textColor: "text-emerald-400", hex: "hsl(160 84% 39%)" },
  { label: "Stress", pct: 28, color: "bg-primary", textColor: "text-primary", hex: "hsl(356 100% 63%)" },
  { label: "Joy", pct: 18, color: "bg-amber-400", textColor: "text-amber-400", hex: "hsl(45 100% 60%)" },
  { label: "Sadness", pct: 12, color: "bg-blue-400", textColor: "text-blue-400", hex: "hsl(217 91% 60%)" },
  { label: "Anger", pct: 8, color: "bg-orange-500", textColor: "text-orange-500", hex: "hsl(24 98% 44%)" },
];

const trendData = [42, 38, 55, 47, 62, 58, 71, 65, 73, 68, 80, 76];
const trendLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const recommendations = [
  {
    icon: AlertTriangle,
    type: "warning" as const,
    title: "Elevated Stress Detected",
    desc: "15% increase in stress-related patterns during afternoon sessions (14:00–16:00).",
    action: "Re-align resource load",
  },
  {
    icon: CheckCircle2,
    type: "success" as const,
    title: "Positive Momentum",
    desc: "Joy and Calm resonances improved by 12% across distributed nodes.",
    action: "Maintain current vector",
  },
  {
    icon: Zap,
    type: "info" as const,
    title: "Peak Engagement Window",
    desc: "Optimal alignment occurs in morning sequences (09:00–11:00).",
    action: "Execute critical tasks AM",
  },
  {
    icon: Clock,
    type: "neutral" as const,
    title: "Session Duration Impact",
    desc: "Connections > 45 minutes trigger 23% prosodic decay.",
    action: "Enforce 30m hard limit",
  },
];

const typeStyles = {
  warning: "border-primary/30 bg-primary/10 text-primary drop-shadow-[0_0_8px_hsl(356_100%_63%/0.5)]",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 drop-shadow-[0_0_8px_hsl(160_84%_39%/0.5)]",
  info: "border-blue-400/30 bg-blue-400/10 text-blue-400 drop-shadow-[0_0_8px_hsl(217_91%_60%/0.5)]",
  neutral: "border-border bg-surface text-muted-foreground",
};

const insights = [
  "SYSTEM NOMINAL: Overall neural health index rating 74/100.",
  "NODE 01: Dr. Sarah Kim maintains highest elasticity (94% confidence).",
  "ANOMALY: Friday PM streams exhibit severe variance — redistribute load.",
  "ACTION REQUIRED: Initiate peer-support protocols to offset 28% strain baseline.",
];

const EmotionInsights = () => {
  const [typedText, setTypedText] = useState("");
  const [currentInsightIdx, setCurrentInsightIdx] = useState(0);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  useEffect(() => {
    setTypedText("");
    let i = 0;
    const fullText = insights[currentInsightIdx];
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => setCurrentInsightIdx(prev => (prev + 1) % insights.length), 3000);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [currentInsightIdx]);

  const maxTrend = Math.max(...trendData);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 font-heading tracking-wide">
            Biometric Intelligence
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase font-bold">Deep Acoustic Neural Mapping & Aggregation</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-3 bg-surface/80 backdrop-blur-xl border border-border/70 rounded-2xl px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Real-time Hook</span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Active Sync / T-0s</span>
          </div>
        </motion.div>
      </div>

      {/* Hero Insight Ticker */}
      <SectionCard title="Live Stream Diagnostics" index={0}>
        <div className="bg-black/60 border border-border/40 p-4 rounded-lg font-mono-data text-[11px] tracking-wider text-primary shadow-inner min-h-[50px] flex items-center">
          <span className="text-emerald-400 mr-2">{">"}</span>
          <span className="animate-pulse mr-1">_</span>
          {typedText}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Emotion Distribution */}
        <SectionCard title="Global Resonance Distribution" subtitle="Normalized across all active nodes" index={1}>
          <div className="p-6 bg-surface/20 border border-border/30 rounded-xl shadow-inner relative overflow-hidden">
            {/* Tech Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none mix-blend-screen" />

            <div className="space-y-4 relative z-10 w-full pl-2 pr-4 py-2">
              {pieData.map((e, i) => (
                <div key={e.label} className="grid grid-cols-[80px_1fr_40px] gap-4 items-center group">
                  <span className={`text-[11px] uppercase tracking-widest font-bold ${e.textColor} drop-shadow-[0_0_8px_currentColor]`}>{e.label}</span>
                  <div className="h-2.5 rounded-sm bg-black/40 overflow-hidden relative shadow-inner">
                    <motion.div
                      className={`absolute inset-y-0 left-0 ${e.color}`}
                      style={{ boxShadow: `0 0 12px ${e.hex}` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${e.pct}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className={`text-[11px] ticker font-bold text-right ${e.textColor}`}>{e.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Sentiment Trend */}
        <SectionCard title="Polarity Metrics" subtitle="Multi-Node historical trending (12 cycles)" index={2}>
          <div className="p-6 bg-surface/20 border border-border/30 rounded-xl shadow-inner h-[280px] flex flex-col justify-end relative overflow-hidden">

            <div className="absolute inset-0 grid-overlay opacity-[0.05] mix-blend-screen pointer-events-none" />

            {/* Trend line underlay */}
            <svg className="absolute inset-x-0 bottom-6 w-full h-[180px] z-0 opacity-20 pointer-events-none" preserveAspectRatio="none">
              <polyline
                points={trendData.map((val, i) => `${(i / (trendData.length - 1)) * 100},${100 - (val / maxTrend) * 100}`).join(' ')}
                fill="none"
                stroke="hsl(160 84% 39%)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="flex items-end justify-between gap-1 h-48 relative z-10 border-b border-white/10 pb-2">
              {trendData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 relative group" onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>

                  {hoveredBar === i && (
                    <div className="absolute -top-8 bg-black/80 text-emerald-400 text-[10px] font-bold ticker px-2 py-1 rounded border border-emerald-500/30 whitespace-nowrap shadow-[0_0_12px_hsl(160_84%_39%/0.4)]">
                      Δ {val}/100
                    </div>
                  )}

                  <div className="w-full bg-black/50 rounded-t-sm h-full flex flex-col justify-end overflow-hidden relative border border-white/5 border-b-0">
                    <motion.div
                      className={`w-full bg-gradient-to-t from-emerald-900/40 to-emerald-500/80 rounded-t-sm ${hoveredBar === i ? "shadow-[0_0_16px_hsl(160_84%_39%)] opacity-100" : "opacity-60"}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / maxTrend) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-3 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
              {trendLabels.map(l => <span key={l} className="flex-1 text-center">{l}</span>)}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* AI Recommendations */}
      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-8 mb-4 border-l-2 border-primary pl-3 flex items-center gap-2">
        <Brain className="w-4 h-4 text-primary" /> Auto-Generated Imperatives
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((rec, i) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className={`relative overflow-hidden p-5 rounded-xl border ${typeStyles[rec.type]} backdrop-blur-md shadow-inner group flex flex-col h-full`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent mix-blend-screen opacity-50" />

              <div className="flex items-center gap-3 mb-3 relative z-10 border-b border-current/20 pb-3">
                <Icon className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest">{rec.title}</h3>
              </div>

              <p className="text-[11px] font-medium leading-relaxed opacity-90 relative z-10 flex-1">{rec.desc}</p>

              <div className="mt-4 inline-block bg-black/20 px-3 py-1.5 rounded relative z-10 w-fit">
                <span className="text-[9px] font-bold uppercase tracking-widest">{rec.action}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionInsights;
