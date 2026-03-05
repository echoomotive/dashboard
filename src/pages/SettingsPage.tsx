import { SectionCard } from "@/components/SectionCard";
import { motion } from "framer-motion";
import { Eye, EyeOff, Copy, Save, Server, Shield, Activity, Fingerprint } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

const SettingsPage = () => {
  const { user } = useUser();
  const [showKey, setShowKey] = useState(false);
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [saving, setSaving] = useState(false);

  // Masked Hume key
  const humeKey = "GOb1tib5cJsZLxhrR••••••••••••••";
  const emtxKey = "emtx_sk_live_a8f3e2b1c4d5••••••••";

  const fullName = user?.fullName || "Root Administrator";
  const email = user?.primaryEmailAddress?.emailAddress || "root@emotix.ai";

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 font-heading tracking-wide">
            Global Matrix Configurations
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase font-bold">Secure operational profile and external connectivity vectors</p>
        </div>

        <div className="flex items-center gap-3 bg-surface/80 backdrop-blur-xl border border-border/70 rounded-2xl px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-10 -z-10 bg-primary/5 mix-blend-screen opacity-50" />
          <Shield className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_hsl(160_84%_39%)] animate-pulse" />
          <div className="flex flex-col relative z-10">
            <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold mb-0.5">Authorization State</span>
            <span className="text-[11px] font-bold text-white uppercase ticker">Level-5 Clearance (Root)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <SectionCard title="Operative Profile Identity" subtitle="Manage node authentication" index={0}>
          <div className="space-y-5">
            <div key={`${email}-name`} className="bg-black/60 border border-white/5 p-4 rounded-xl shadow-inner relative overflow-hidden group">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-r-md opacity-20 group-focus-within:opacity-100 transition-opacity" />
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2 px-2 flex items-center gap-2">
                <Fingerprint className="w-3 h-3 text-primary" /> Display Handle
              </label>
              <input key={fullName} defaultValue={fullName} className="w-full h-10 px-3 rounded-lg bg-surface/50 border border-border/50 text-[13px] font-bold tracking-wide text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 shadow-inner" />
            </div>

            <div key={`${email}-email`} className="bg-black/60 border border-white/5 p-4 rounded-xl shadow-inner relative overflow-hidden group">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-blue-400 rounded-r-md opacity-20 group-focus-within:opacity-100 transition-opacity" />
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2 px-2 flex items-center gap-2">
                <Server className="w-3 h-3 text-blue-400" /> Secure Transport Protocol (Email)
              </label>
              <input key={email} defaultValue={email} className="w-full h-10 px-3 rounded-lg bg-surface/50 border border-border/50 text-[11px] font-mono-data text-white/80 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 shadow-inner" />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white text-[11px] uppercase tracking-widest font-bold hover:shadow-[0_0_24px_hsl(356_100%_63%/0.4)] transition-all flex items-center gap-3 w-full justify-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10 flex items-center gap-2">
                {saving ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full shadow-[0_0_8px_white]" />
                    Writing Identity Graph...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 drop-shadow-[0_0_4px_white]" />
                    Overwrite Configuration
                  </>
                )}
              </div>
            </motion.button>
          </div>
        </SectionCard>

        <SectionCard title="Encrypted Connection Strings" subtitle="Hume & Internal API Bridges" index={1}>
          <div className="space-y-6">

            {/* Hume Engine API Key */}
            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl shadow-inner">
              <label className="text-[9px] font-bold uppercase tracking-widest text-amber-500 block mb-2 px-1 flex items-center gap-2">
                <Activity className="w-3 h-3 drop-shadow-[0_0_8px_hsl(45_100%_60%)]" /> External: Hume Neural Engine API Key
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-10 pl-4 pr-2 rounded-lg bg-black/60 border border-amber-500/30 text-[11px] text-white/80 flex items-center font-mono-data shadow-inner overflow-hidden">
                  <motion.span
                    key={showLiveKey ? "shown" : "hidden"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate w-full block"
                  >
                    {showLiveKey ? "GOb1tib5cJsZLxhrRXDiAar8H4t1IMP1vbLtuXkfYxC5tuxe" : humeKey}
                  </motion.span>
                </div>
                <button onClick={() => setShowLiveKey(!showLiveKey)} className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/40 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors group">
                  {showLiveKey ? <EyeOff className="w-4 h-4 text-muted-foreground group-hover:text-amber-500" /> : <Eye className="w-4 h-4 text-muted-foreground group-hover:text-amber-500" />}
                </button>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/40 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors group">
                  <Copy className="w-4 h-4 text-muted-foreground group-hover:text-amber-500" />
                </button>
              </div>
            </div>

            {/* EchooMotive API Key */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl shadow-inner">
              <label className="text-[9px] font-bold uppercase tracking-widest text-primary block mb-2 px-1 flex items-center gap-2">
                <Server className="w-3 h-3 drop-shadow-[0_0_8px_hsl(356_100%_63%)]" /> Internal: EchooMotive Transport Protocol Key
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-10 pl-4 pr-2 rounded-lg bg-black/60 border border-primary/30 text-[11px] text-white/80 flex items-center font-mono-data shadow-inner overflow-hidden">
                  <motion.span
                    key={showKey ? "shown" : "hidden"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {showKey ? "emtx_sk_live_a8f3e2b1c4d5e6f7g8h9i0j" : emtxKey}
                  </motion.span>
                </div>
                <button onClick={() => setShowKey(!showKey)} className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/40 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-colors group">
                  {showKey ? <EyeOff className="w-4 h-4 text-muted-foreground group-hover:text-primary" /> : <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary" />}
                </button>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/40 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-colors group">
                  <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </button>
              </div>
            </div>

          </div>
        </SectionCard>
      </div>

      <SectionCard title="Telemetry Event Triggers" subtitle="Automated alerts and actions" index={2}>
        <div className="bg-surface/20 border border-border/30 rounded-xl p-4 shadow-inner space-y-2 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/30 via-emerald-500/30 to-blue-400/30 opacity-50" />

          {[
            { label: "Critical Strain Override Protocol", desc: "Automated WebSocket disconnect when user stress vectors exceed 85% confidence baseline.", on: true, hazard: true },
            { label: "Daily Compulsory Data Dump", desc: "Forced compilation and encrypted transfer of node activity to root storage cluster.", on: false, hazard: false },
            { label: "Real-time Node Saturation Alerts", desc: "Trigger visual/audio alarms on primary dashboard if global neural load passes 80% capacity.", on: true, hazard: false },
          ].map((pref, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-white/5 rounded-lg bg-black/40 group hover:bg-black/60 transition-colors gap-4">
              <div className="flex-1">
                <p className={`text-[12px] font-bold uppercase tracking-wide flex items-center gap-2 ${pref.hazard ? 'text-primary' : 'text-white/90 group-hover:text-white transition-colors'}`}>
                  {pref.hazard && <ShieldAlert className="w-3.5 h-3.5 drop-shadow-[0_0_8px_hsl(356_100%_63%)]" />}
                  {pref.label}
                </p>
                <p className={`text-[10px] mt-1 pr-6 ${pref.hazard ? 'text-primary/70' : 'text-muted-foreground font-medium'}`}>{pref.desc}</p>
              </div>

              <div className="shrink-0 pl-1 border-white/10">
                <ToggleSwitch defaultOn={pref.on} danger={pref.hazard} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

function ToggleSwitch({ defaultOn, danger }: { defaultOn: boolean, danger?: boolean }) {
  const [on, setOn] = useState(defaultOn);

  const activeBg = danger ? "bg-primary shadow-[0_0_12px_hsl(356_100%_63%/0.5)]" : "bg-emerald-500 shadow-[0_0_12px_hsl(160_84%_39%/0.5)]";

  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-12 h-6 rounded-full transition-all relative border ${on ? activeBg + " border-transparent" : "bg-black/60 border-white/20"}`}
    >
      <motion.div
        className={`w-4 h-4 rounded-full absolute top-1 ${on ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "bg-white/40"}`}
        animate={{ left: on ? 28 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export default SettingsPage;
