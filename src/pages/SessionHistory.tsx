import { SectionCard } from "@/components/SectionCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Check, ChevronDown, RotateCcw, Activity, ShieldAlert, Database } from "lucide-react";
import { useState, useMemo } from "react";

const sessions = [
  { id: "S-1042", user: "Dr. Sarah Kim", emotion: "Calm", confidence: 94, duration: "4:32", date: "2026-03-02", risk: "Low", nodes: "8.4k" },
  { id: "S-1041", user: "Mark Jensen", emotion: "Stress", confidence: 87, duration: "6:15", date: "2026-03-02", risk: "Elevated", nodes: "12.1k" },
  { id: "S-1040", user: "Lisa Chen", emotion: "Joy", confidence: 91, duration: "3:48", date: "2026-03-01", risk: "Low", nodes: "7.2k" },
  { id: "S-1039", user: "Tom Baker", emotion: "Anger", confidence: 78, duration: "5:02", date: "2026-03-01", risk: "High", nodes: "9.5k" },
  { id: "S-1038", user: "Ava Patel", emotion: "Sadness", confidence: 85, duration: "7:20", date: "2026-02-28", risk: "Moderate", nodes: "14.3k" },
  { id: "S-1037", user: "James Lee", emotion: "Calm", confidence: 90, duration: "4:10", date: "2026-02-28", risk: "Low", nodes: "8.0k" },
  { id: "S-1036", user: "Nina Ross", emotion: "Joy", confidence: 88, duration: "3:55", date: "2026-02-27", risk: "Low", nodes: "7.4k" },
  { id: "S-1035", user: "Omar Shah", emotion: "Neutral", confidence: 72, duration: "8:44", date: "2026-02-27", risk: "Minimal", nodes: "16.8k" },
];

const emotionColor: Record<string, string> = {
  Calm: "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] bg-emerald-500/10 border-emerald-500/30",
  Stress: "text-primary drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] bg-primary/10 border-primary/30",
  Joy: "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] bg-amber-400/10 border-amber-400/30",
  Anger: "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] bg-orange-500/10 border-orange-500/30",
  Sadness: "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] bg-blue-400/10 border-blue-400/30",
  Neutral: "text-neutral-400 drop-shadow-[0_0_8px_rgba(163,163,163,0.5)] bg-surface border-border",
};

const emotions = ["All", "Calm", "Stress", "Joy", "Anger", "Sadness", "Neutral"];

const SessionHistory = () => {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState("All");

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch =
        s.user.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase());
      const matchesEmotion = selectedEmotion === "All" || s.emotion === selectedEmotion;
      return matchesSearch && matchesEmotion;
    });
  }, [search, selectedEmotion]);

  const resetFilters = () => {
    setSearch("");
    setSelectedEmotion("All");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 font-heading tracking-wide">
            Telemetry Pipeline History
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase font-bold">Query historical acoustic metadata matrices</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-3 bg-surface/80 backdrop-blur-xl border border-border/70 rounded-2xl px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          <div className="absolute inset-x-0 bottom-0 h-10 -z-10 bg-primary/10 mix-blend-screen opacity-50">
            {/* Tech Grid Background inside widget */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />
          </div>
          <Database className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_hsl(217_91%_60%)] relative z-10" />
          <div className="flex flex-col relative z-10">
            <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-0.5">Database Cluster</span>
            <span className="text-2xl font-bold text-white ticker leading-none">12.8k <span className="text-[10px] text-muted-foreground uppercase tracking-widest align-bottom">Records</span></span>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-20 bg-surface/20 border border-border/30 p-2 rounded-xl">
        <div className="relative flex-1 w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Query session metadata (ID, User)..."
            className="w-full h-12 pl-12 pr-4 rounded-lg bg-black/60 border border-border/50 text-[11px] uppercase tracking-widest font-bold text-white placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        <div className="relative w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 flex-1">
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`h-12 px-6 rounded-lg border text-[11px] uppercase tracking-widest font-bold transition-all flex items-center justify-between gap-3 min-w-[140px] shadow-inner ${filterOpen || selectedEmotion !== "All"
                ? "bg-primary/20 border-primary/50 text-white shadow-[0_0_12px_hsl(356_100%_63%/0.2)]"
                : "bg-black/60 border-border/50 text-muted-foreground hover:text-white hover:bg-black/80"
                }`}
            >
              <div className="flex items-center gap-2">
                <Filter className={`w-3.5 h-3.5 ${selectedEmotion !== "All" ? "text-primary" : ""}`} />
                {selectedEmotion === "All" ? "Filter Matrix" : selectedEmotion}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setFilterOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-48 bg-card border border-border/60 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-40 overflow-hidden backdrop-blur-xl"
                  >
                    <div className="p-1 space-y-0.5 border border-white/5 rounded-xl m-1">
                      {emotions.map((emotion) => (
                        <button
                          key={emotion}
                          onClick={() => {
                            setSelectedEmotion(emotion);
                            setFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-colors ${selectedEmotion === emotion
                            ? "bg-primary/20 text-white"
                            : "text-muted-foreground hover:text-white hover:bg-surface"
                            }`}
                        >
                          {emotion}
                          {selectedEmotion === emotion && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {(search || selectedEmotion !== "All") && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={resetFilters}
              className="text-[10px] uppercase tracking-widest flex items-center gap-2 text-primary hover:text-white transition-colors font-bold px-4 py-2 border border-primary/20 hover:border-primary/50 rounded bg-primary/5 shadow-inner whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" /> Clear Query
            </motion.button>
          )}
        </div>
      </div>

      <SectionCard title="Query Matrix Results" subtitle={`Found ${filtered.length} Indexed Node${filtered.length !== 1 ? 's' : ''}`} index={0} className="relative z-10">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-muted-foreground border-b border-white/10 relative">
                <th className="py-4 pl-4 font-bold">Session Frame ID</th>
                <th className="py-4 font-bold">End-User Vector</th>
                <th className="py-4 font-bold">Extracted Resonance</th>
                <th className="py-4 font-bold">Predictive Match</th>
                <th className="py-4 font-bold">Stress Baseline</th>
                <th className="text-right py-4 font-bold">Duration</th>
                <th className="text-right py-4 pr-4 font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <Database className="w-12 h-12 mb-3 text-muted-foreground" />
                        <span className="text-[11px] uppercase tracking-widest font-bold text-white">Null Return</span>
                        <span className="text-[9px] uppercase tracking-widest mt-1">Matrix query yielded 0 node matches</span>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filtered.map((s, i) => (
                    <motion.tr
                      key={s.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="font-mono-data text-[11px] font-medium text-white/50 group-hover:text-white transition-colors">{s.id}</span>
                        </div>
                      </td>
                      <td className="py-4 text-[12px] text-white/90 font-bold tracking-wide">{s.user}</td>
                      <td className="py-4">
                        <span className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1.5 rounded border shadow-inner ${emotionColor[s.emotion]}`}>
                          {s.emotion}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                            <div className="absolute inset-y-0 left-0 bg-primary/70 rounded-full" style={{ width: `${s.confidence}%` }} />
                          </div>
                          <span className="text-[10px] text-white/70 ticker font-bold">{s.confidence}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5">
                          {s.risk === "High" && <ShieldAlert className="w-3.5 h-3.5 text-primary drop-shadow-[0_0_8px_hsl(356_100%_63%)] animate-pulse" />}
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${s.risk === 'High' ? 'text-primary' : s.risk === 'Elevated' ? 'text-amber-400' : 'text-muted-foreground'}`}>{s.risk}</span>
                        </div>
                      </td>
                      <td className="py-4 text-muted-foreground ticker text-[11px] text-right font-bold">{s.duration}</td>
                      <td className="py-4 text-muted-foreground/60 text-right text-[10px] uppercase font-mono-data tracking-widest pr-4">{s.date}</td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default SessionHistory;
