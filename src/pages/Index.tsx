import { StatCard } from "@/components/StatCard";
import { SectionCard } from "@/components/SectionCard";
import { Activity, Users, Mic, Clock, TrendingUp, Zap, Brain, Radio, ShieldAlert, HeartPulse, Sparkles, Server } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const recentSessions = [
  { id: "S-1042", user: "Dr. Sarah Kim", emotion: "Calm", confidence: 94, sentiment: 0.82, time: "2 min ago", risk: "Low" },
  { id: "S-1041", user: "Mark Jensen", emotion: "Stress", confidence: 87, sentiment: -0.45, time: "8 min ago", risk: "Elevated" },
  { id: "S-1040", user: "Lisa Chen", emotion: "Joy", confidence: 91, sentiment: 0.91, time: "15 min ago", risk: "Minimal" },
  { id: "S-1039", user: "Tom Baker", emotion: "Anger", confidence: 78, sentiment: -0.62, time: "22 min ago", risk: "High" },
  { id: "S-1038", user: "Ava Patel", emotion: "Sadness", confidence: 85, sentiment: -0.3, time: "30 min ago", risk: "Moderate" },
];

const emotionColor: Record<string, string> = {
  Calm: "text-emerald-400",
  Stress: "text-primary",
  Joy: "text-amber-400",
  Anger: "text-orange-500",
  Sadness: "text-blue-400",
  Neutral: "text-neutral-400",
};

const emotionBg: Record<string, string> = {
  Calm: "bg-emerald-500/10 border-emerald-500/30",
  Stress: "bg-primary/10 border-primary/30",
  Joy: "bg-amber-400/10 border-amber-400/30",
  Anger: "bg-orange-500/10 border-orange-500/30",
  Sadness: "bg-blue-400/10 border-blue-400/30",
};

const insightCards = [
  {
    icon: Sparkles,
    color: "from-emerald-900/40 to-emerald-900/10",
    iconColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    borderColor: "border-emerald-500/30",
    title: "Positive Trend Detected",
    desc: "Team emotional elasticity improved 12% across active audio sessions. Baseline structural integrity of vocal chords during 2:00-4:00 PM block shows unprecedented calm resonance, indicating optimal cognitive load balancing.",
  },
  {
    icon: Zap,
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary bg-primary/10 border-primary/30",
    borderColor: "border-primary/30",
    title: "Vocal Fatigue Warning",
    desc: "Highest stress engagement: 2:00–4:00 PM sessions show 15% prosody strain. Elevated micro-tremors detected in the 300Hz-700Hz frequency spectrum during critical phase interactions on node cluster Alpha-7.",
  },
  {
    icon: Server,
    color: "from-blue-900/30 to-blue-900/10",
    iconColor: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    borderColor: "border-blue-500/30",
    title: "Pipeline Status",
    desc: "Nodes operating nominally. Processing queue clears 24% faster this hour due to proactive Hume Engine burst processing mode activation. Sync latency holding below an optimal 45ms ping floor.",
  },
];

const WaveLine = () => (
  <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-primary scale-[-1] opacity-70">
    <motion.path
      d="M 0 10 Q 25 20, 50 10 T 100 10"
      fill="transparent"
      stroke="currentColor"
      strokeWidth="2"
      animate={{
        d: [
          "M 0 10 Q 25 20, 50 10 T 100 10",
          "M 0 10 Q 25 0, 50 10 T 100 10",
          "M 0 10 Q 25 20, 50 10 T 100 10",
        ]
      }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    />
  </svg>
);

const Overview = () => {
  const [sentimentScore, setSentimentScore] = useState(72);
  const [liveCount, setLiveCount] = useState(24);
  const [activeModel, setActiveModel] = useState("v2.4 Core Streaming");
  const [metrics, setMetrics] = useState([62, 48, 85, 12]);

  useEffect(() => {
    const t = setInterval(() => {
      setSentimentScore(s => Math.max(60, Math.min(95, s + (Math.random() - 0.5) * 4)));
      setLiveCount(c => Math.max(20, Math.min(30, c + (Math.random() > 0.5 ? 1 : -1))));
      setMetrics(prev => prev.map(m => Math.max(10, Math.min(100, m + (Math.random() - 0.5) * 10))));

      if (Math.random() > 0.8) {
        setActiveModel(prev => prev === "v2.4 Core Streaming" ? "v1.1 Burst Processing" : "v2.4 Core Streaming");
      }
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header with real-time sentiment score */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 font-heading tracking-wide">
            EchooMotive Core
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2 py-0.5 rounded text-[10px] bg-primary/20 text-primary uppercase tracking-widest border border-primary/50 shadow-[0_0_12px_hsl(356_100%_63%/0.4)]"
            >
              System Online
            </motion.span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-wider uppercase">Live Voice Intelligence Architecture</p>
        </div>

        {/* Dynamic Sentiment Widget */}
        <motion.div
          className="relative group flex items-center gap-4 bg-surface/80 backdrop-blur-xl border border-border/70 rounded-2xl px-6 py-4 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[200px]"
          animate={{ boxShadow: [`0 0 0px hsl(356 100% 63% / 0)`, `0 0 24px hsl(356 100% 63% / 0.2)`, `0 0 0px hsl(356 100% 63% / 0)`] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Background grid line texture inside widget */}
          <div className="absolute inset-x-0 bottom-0 h-10 -z-10 bg-primary/20 mix-blend-screen opacity-50">
            <WaveLine />
          </div>

          <motion.div className="w-3 h-3 rounded-full bg-primary relative z-10" animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />

          <div className="flex flex-col relative z-10 w-full">
            <span className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1">Global Health Index</span>
            <div className="flex items-end gap-1.5 justify-between">
              <span className="text-3xl font-bold ticker text-white leading-none">{Math.round(sentimentScore)}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">/ 100</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active Streams" value={String(liveCount)} change="+3 initializing" changeType="up" icon={<Radio className="w-5 h-5" />} index={0} live />
        <StatCard title="Total Models Run" value="12.8k" change="+142 jobs today" changeType="up" icon={<Brain className="w-5 h-5" />} index={1} />
        <StatCard title="Global Latency" value="1.2s" change="-0.3s ms optimized" changeType="down" icon={<Clock className="w-5 h-5" />} index={2} />
        <StatCard title="Monitored Users" value="18" change="Active risk tracking" changeType="neutral" icon={<Users className="w-5 h-5" />} index={3} />
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ML Output */}
        <SectionCard title="Prosody Risk Distribution" subtitle="Last 24 hours of model aggregations" className="lg:col-span-2" index={0} action={
          <Link to="/emotion-insights" className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest hover:text-primary transition-colors">
            Explore Intelligence
          </Link>
        }>
          <div className="space-y-5">
            {[
              { label: "Calm", pct: 34, color: "bg-emerald-500", textColor: "text-emerald-400", risk: "Low" },
              { label: "Stress", pct: 28, color: "bg-primary", textColor: "text-primary", risk: "Elevated" },
              { label: "Joy", pct: 18, color: "bg-amber-400", textColor: "text-amber-400", risk: "Low" },
              { label: "Sadness", pct: 12, color: "bg-blue-400", textColor: "text-blue-400", risk: "Moderate" },
              { label: "Anger", pct: 8, color: "bg-orange-500", textColor: "text-orange-500", risk: "High" },
            ].map((e, i) => (
              <div key={e.label} className="grid grid-cols-[70px_1fr_45px_70px] items-center gap-4 group">
                <span className={`text-[11px] uppercase tracking-widest font-bold ${e.textColor} drop-shadow-[0_0_8px_currentColor]`}>{e.label}</span>
                <div className="h-1.5 rounded-full bg-black/40 overflow-hidden shadow-inner border border-white/5 relative">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${e.color}`}
                    style={{ boxShadow: `0 0 16px ${e.color}` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${e.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className={`text-[11px] ticker text-right font-bold ${e.textColor} drop-shadow-sm`}>{e.pct}%</span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground text-center bg-black/50 border border-white/10 rounded px-1.5 py-0.5 shadow-inner backdrop-blur-md">{e.risk}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-white/5 flex items-center gap-3">
            <HeartPulse className="w-5 h-5 text-primary drop-shadow-[0_0_8px_hsl(356_100%_63%)]" />
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Overall team variance: <span className="text-white font-bold ml-1">74/100</span></p>
          </div>
        </SectionCard>

        {/* System Diagnostics */}
        <SectionCard title="Active Network Topologies" subtitle="Live processing diagnostics" index={1}>
          <div className="mb-6 p-4 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-between shadow-inner backdrop-blur-md relative overflow-hidden group">
            {/* Diagonal glass glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

            <div className="flex flex-col relative z-10">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Model Routing</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={activeModel}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="text-xs font-mono-data text-white drop-shadow-[0_0_8px_hsl(356_100%_63%/0.8)]"
                >
                  {activeModel}
                </motion.span>
              </AnimatePresence>
            </div>
            <Brain className="w-6 h-6 text-primary opacity-60" />
          </div>

          <div className="space-y-5">
            {[
              { label: "Predictive Confidence", value: metrics[0], color: "bg-primary" },
              { label: "WebSocket Buffer", value: metrics[1], color: "bg-blue-400" },
              { label: "Batch API Load", value: metrics[2], color: "bg-emerald-500" },
              { label: "Packet Drop Rate", value: metrics[3], color: "bg-emerald-900" }, // Safe drop rate representation
            ].map((m, i) => (
              <div key={m.label}>
                <div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground group-hover:text-white transition-colors">{m.label}</span>
                  <span className="text-white ticker">
                    <motion.span animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 1.5 }}>
                      {Math.round(m.value)}
                    </motion.span>
                    %
                  </span>
                </div>
                <div className="h-1 rounded-full bg-black/40 overflow-hidden relative">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${m.color}`}
                    style={{ boxShadow: `0 0 10px ${m.color}` }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* AI Intelligence Recommendations */}
      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-8 mb-4 border-l-2 border-primary pl-3">Neural Sub-System Summaries</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insightCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} p-6 shadow-lg backdrop-blur-md group hover:border-primary/50 transition-colors cursor-default`}
            >
              {/* Mesh/scanline background */}
              <div className="absolute inset-0 grid-overlay opacity-[0.05] pointer-events-none mix-blend-screen" />

              <div className="flex flex-col gap-4 relative z-10">
                <div className={`p-3 rounded-lg w-fit ${card.iconColor} shadow-inner`}>
                  <Icon className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-2">{card.title}</h4>
                  <p className="text-[11px] text-white/60 leading-relaxed font-medium tracking-wide">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Real-time Ticker Feed */}
      <SectionCard title="Telemetry Event Log" subtitle="Live stream parser tracking" index={3} action={
        <Link to="/session-history" className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest hover:text-white transition-all">
          Full Logs
        </Link>
      }>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-muted-foreground border-b border-border/40">
                <th className="text-left py-3 font-bold pl-2">Node / Target</th>
                <th className="text-left py-3 font-bold">Primary Vector</th>
                <th className="text-left py-3 font-bold">Score (Δ)</th>
                <th className="text-right py-3 font-bold pr-2">Execution Time</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {recentSessions.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 pl-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-white font-mono-data text-[10px] tracking-wider">{s.id}</span>
                        </div>
                        <span className="text-white/80 text-[11px] font-semibold tracking-wide sm:text-xs">{s.user}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded border shadow-inner backdrop-blur-md ${emotionBg[s.emotion]} ${emotionColor[s.emotion]}`}>
                        {s.emotion}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold tracking-wider ticker ${s.sentiment > 0 ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-primary drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"}`}>
                          {s.sentiment > 0 ? "+" : ""}{s.sentiment.toFixed(2)}
                        </span>
                        {s.risk === "High" && <ShieldAlert className="w-3.5 h-3.5 text-primary animate-pulse" />}
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-foreground text-right text-[10px] uppercase font-bold tracking-widest pr-2">{s.time}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default Overview;
