import { SectionCard } from "@/components/SectionCard";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Mail, MoreHorizontal, X, Plus, Check, Activity, ShieldAlert, Cpu } from "lucide-react";
import { useState } from "react";

interface TeamMember {
  name: string;
  email: string;
  role: "Root Admin" | "Data Architect" | "Observer Node";
  avatar: string;
  active: boolean;
  clearance: string;
}

const initialMembers: TeamMember[] = [
  { name: "Dr. Sarah Kim", email: "sarah@emotix.ai", role: "Root Admin", avatar: "SK", active: true, clearance: "L5-Alpha" },
  { name: "Mark Jensen", email: "mark@emotix.ai", role: "Data Architect", avatar: "MJ", active: true, clearance: "L3-Beta" },
  { name: "Lisa Chen", email: "lisa@emotix.ai", role: "Data Architect", avatar: "LC", active: false, clearance: "L3-Beta" },
  { name: "Tom Baker", email: "tom@emotix.ai", role: "Observer Node", avatar: "TB", active: true, clearance: "L1-Gamma" },
  { name: "Ava Patel", email: "ava@emotix.ai", role: "Data Architect", avatar: "AP", active: false, clearance: "L3-Beta" },
  { name: "James Lee", email: "james@emotix.ai", role: "Root Admin", avatar: "JL", active: true, clearance: "L5-Alpha" },
];

const roleColor: Record<string, string> = {
  "Root Admin": "border-primary/50 text-white bg-primary/20 shadow-[0_0_12px_hsl(356_100%_63%/0.4)]",
  "Data Architect": "border-blue-400/50 text-blue-400 bg-blue-400/20",
  "Observer Node": "border-muted-foreground/30 text-muted-foreground bg-surface",
};

const TeamManagement = () => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Data Architect" as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate matrix link
    setTimeout(() => {
      const initials = formData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

      const newMember: TeamMember = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: initials || "U",
        active: false,
        clearance: formData.role === "Root Admin" ? "L5-Alpha" : formData.role === "Data Architect" ? "L3-Beta" : "L1-Gamma",
      };

      setMembers([newMember, ...members]);
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
        setFormData({ name: "", email: "", role: "Data Architect" });
      }, 1500);
    }, 1000);
  };

  const activeCount = members.filter(m => m.active).length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 font-heading tracking-wide">
            Network Authorization Topology
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase font-bold">Manage operational clearances and node access</p>
        </div>

        <div className="flex items-center gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg px-4 py-2 shadow-inner">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 ticker">{activeCount}/{members.length} Nodes Active</span>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 rounded-lg bg-primary text-white text-[11px] uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_16px_hsl(356_100%_63%/0.4)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus className="w-4 h-4 relative z-10 drop-shadow-md" />
            <span className="relative z-10 drop-shadow-md">Provision Slot</span>
          </motion.button>
        </div>
      </div>

      <SectionCard title="Active Clearance Roster" subtitle="Authenticated matrix connections" index={0} className="relative z-10">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-muted-foreground border-b border-white/10">
                <th className="py-4 pl-4 font-bold">Operative Node</th>
                <th className="py-4 font-bold">Contact Vector</th>
                <th className="py-4 font-bold">Topology Role</th>
                <th className="py-4 font-bold">Clearance Level</th>
                <th className="text-right py-4 pr-4 font-bold">Connection State</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout" initial={false}>
                {members.map((m, i) => (
                  <motion.tr
                    key={m.email}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[10px] font-bold shadow-inner ${m.active ? 'bg-primary/20 border-primary/50 text-white drop-shadow-[0_0_8px_hsl(356_100%_63%)]' : 'bg-surface border-border text-muted-foreground'}`}>
                          {m.avatar}
                        </div>
                        <span className="text-[12px] text-white/90 font-bold tracking-wide group-hover:text-white transition-colors">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-mono-data text-[11px] text-muted-foreground group-hover:text-primary transition-colors">{m.email}</span>
                    </td>
                    <td className="py-4">
                      <span className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded border shadow-inner ${roleColor[m.role]}`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 opacity-80">
                        {m.role === 'Root Admin' ? <ShieldAlert className="w-3.5 h-3.5 text-primary" /> : <Shield className="w-3.5 h-3.5 text-blue-400" />}
                        <span className="text-[10px] font-mono-data uppercase tracking-widest text-white">{m.clearance}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${m.active ? "bg-emerald-500 shadow-[0_0_8px_hsl(160_84%_39%)] animate-pulse" : "bg-muted-foreground"}`} />
                        <span className={`text-[10px] uppercase font-bold tracking-widest ${m.active ? 'text-emerald-400' : 'text-muted-foreground'}`}>{m.active ? "Synced" : "Awaiting Handshake"}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Provision Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !loading && setIsModalOpen(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
              className="relative w-full max-w-md bg-black/80 border border-primary/30 rounded-2xl shadow-[0_24px_64px_rgba(244,63,94,0.15)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 to-transparent pointer-events-none" />

              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between relative z-10 bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded border border-primary/50 text-white shadow-[0_0_12px_hsl(356_100%_63%/0.3)]">
                    <Cpu className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-white uppercase tracking-widest">Provision New Slot</h3>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-primary/80 mt-0.5">Authorize internal matrix tunneling</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/20">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 relative z-10">
                <div className="space-y-1.5 border border-white/5 bg-black/40 p-1 rounded-xl">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/50 px-2 pt-2 block">Operative Designation</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full h-10 px-2 bg-transparent text-[13px] text-white font-bold placeholder:text-muted-foreground focus:outline-none focus:text-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5 border border-white/5 bg-black/40 p-1 rounded-xl">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/50 px-2 pt-2 block">Contact Vector (Email)</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="node@emotix.ai"
                    className="w-full h-10 px-2 bg-transparent text-[11px] font-mono-data text-white placeholder:text-muted-foreground focus:outline-none focus:text-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5 border border-white/5 bg-black/40 p-1 rounded-xl">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/50 px-2 pt-2 block">Clearance Level (Role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full h-10 px-2 bg-transparent text-[11px] uppercase tracking-widest font-bold text-white focus:outline-none cursor-pointer [&>option]:bg-background [&>option]:text-white"
                  >
                    <option value="Data Architect">Data Architect [L3-Beta]</option>
                    <option value="Observer Node">Observer Node [L1-Gamma]</option>
                    <option value="Root Admin">Root Admin [L5-Alpha]</option>
                  </select>
                </div>

                <div className="pt-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || success}
                    type="submit"
                    className={`w-full h-12 rounded-lg text-[11px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-inner overflow-hidden relative group/btn ${success
                      ? "bg-emerald-500/20 border border-emerald-500 text-emerald-400 drop-shadow-[0_0_12px_hsl(160_84%_39%)]"
                      : "bg-primary text-white hover:bg-primary/90 shadow-[0_0_24px_hsl(356_100%_63%/0.4)]"
                      }`}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shadow-[0_0_8px_white]" />
                          Establishing Handshake...
                        </>
                      ) : success ? (
                        <>
                          <Check className="w-4 h-4 drop-shadow-md" />
                          Keys Exchanged
                        </>
                      ) : (
                        <>
                          <Activity className="w-4 h-4 drop-shadow-md" />
                          Transmit Handshake
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagement;
