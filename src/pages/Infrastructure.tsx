import { SectionCard } from "@/components/SectionCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Cpu, HardDrive, Wifi, Thermometer, Database, CheckCircle2, ShieldAlert, Server } from "lucide-react";

function useTicker(initial: number, min: number, max: number, speed = 1500) {
  const [val, setVal] = useState(initial);
  useEffect(() => {
    const iv = setInterval(() => {
      setVal((v) => {
        const delta = (Math.random() - 0.5) * 6;
        return Math.max(min, Math.min(max, Math.round(v + delta)));
      });
    }, speed);
    return () => clearInterval(iv);
  }, [min, max, speed]);
  return val;
}

const Infrastructure = () => {
  const gpuUtil = useTicker(62, 30, 95);
  const memUsage = useTicker(48, 25, 80);
  const netBandwidth = useTicker(340, 200, 500);
  const temp = useTicker(67, 55, 85, 2000);

  const sparkline = (label: string, value: number, unit: string, max: number, icon: React.ReactNode, idx: number, colorVar: string) => (
    <div key={label} className="bg-surface/20 border border-border/40 rounded-xl p-5 shadow-inner relative overflow-hidden group hover:border-white/20 transition-colors">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorVar} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`} />

      <div className="flex items-center gap-4 relative z-10">
        <div className={`p-4 rounded-lg bg-black/40 border border-white/5 drop-shadow-[0_0_8px_currentColor]`}>{icon}</div>
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-white ticker drop-shadow-md">{value}</p>
            <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">{unit}</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-black/60 overflow-hidden relative border border-white/5">
            <motion.div
              className={`absolute inset-y-0 left-0 bg-current drop-shadow-[0_0_8px_currentColor]`}
              animate={{ width: `${(value / max) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex items-center justify-between mb-8 mt-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 font-heading tracking-wide">
            Hardware Telemetry
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase font-bold">Live physical & neural node health overview</p>
        </div>

        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg shadow-[0_0_16px_hsl(160_84%_39%/0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse drop-shadow-[0_0_6px_currentColor]" />
          Matrix Online
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sparkline("GPU Compute", gpuUtil, "%", 100, <Cpu className="w-6 h-6 text-primary" />, 0, "from-primary to-transparent")}
        {sparkline("VRAM Allocation", memUsage, "%", 100, <HardDrive className="w-6 h-6 text-blue-400" />, 1, "from-blue-400 to-transparent")}
        {sparkline("Network Pipeline", netBandwidth, "MB/s", 500, <Wifi className="w-6 h-6 text-emerald-400" />, 2, "from-emerald-400 to-transparent")}
        {sparkline("Core Thermals", temp, "°C", 100, <Thermometer className="w-6 h-6 text-amber-500" />, 3, "from-amber-500 to-transparent")}
      </div>

      <SectionCard title="Microservice Neural Hooks" subtitle="Active connectivity across 5 primary subsystems" index={4} className="mt-8">
        <div className="bg-surface/20 border border-border/30 rounded-xl p-6 shadow-inner relative overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none mix-blend-screen" />

          <div className="space-y-3 relative z-10 w-full pl-2 pr-4 py-2">
            {[
              { name: "Acoustic Ingestion Gateway", status: "Nominal", latency: "12ms", icon: Server },
              { name: "Hume Biometric Engine", status: "Active Sync", latency: "45ms", icon: Database },
              { name: "WebSocket Poller", status: "Nominal", latency: "3ms", icon: Wifi },
              { name: "Report Aggregation Queue", status: "Degraded", latency: "320ms", icon: ShieldAlert },
              { name: "Blob Storage Layer", status: "Nominal", latency: "8ms", icon: HardDrive },
            ].map((s, i) => {
              const Icon = s.icon;
              const isDegraded = s.status === "Degraded";

              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 border border-white/5 rounded-lg group hover:bg-black/60 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded border focus:outline-none ${isDegraded ? 'border-amber-500/30 bg-amber-500/10 text-amber-500' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'}`}>
                      <Icon className={`w-4 h-4 ${isDegraded ? 'animate-pulse' : ''}`} />
                    </div>
                    <span className="text-[12px] uppercase font-bold tracking-widest text-white/90 group-hover:text-white transition-colors">{s.name}</span>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end">
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Ping Vector</span>
                      <span className="text-[11px] font-mono-data text-white ticker">{s.latency}</span>
                    </div>

                    <div className="flex flex-col items-start sm:items-end w-28">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground mb-1">State</span>
                      <span className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${isDegraded ? "text-amber-500" : "text-emerald-400"}`}>
                        {isDegraded ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        {s.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            }
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default Infrastructure;
