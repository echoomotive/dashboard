import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Eye, EyeOff, Mail, Lock, Mic, Activity, Zap, Shield, ChevronRight } from "lucide-react";

const features = [
  { icon: Mic, title: "Voice Intelligence", desc: "Real-time tone, pitch & speech pattern analysis" },
  { icon: Activity, title: "Emotion Detection", desc: "Stress, joy, urgency—detected with 94%+ accuracy" },
  { icon: Zap, title: "Instant Insights", desc: "Actionable recommendations in milliseconds" },
  { icon: Shield, title: "Enterprise Secure", desc: "SOC2 compliant, end-to-end encrypted" },
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFeature, setActiveFeature] = useState(0);
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();

  // Cycle features
  useState(() => {
    const t = setInterval(() => setActiveFeature(p => (p + 1) % features.length), 2800);
    return () => clearInterval(t);
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      } else {
        console.error(JSON.stringify(result, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left – hero panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-primary/20 z-0" />

        <div className="relative z-10 flex flex-col justify-center flex-1">
          {/* Brand */}
          <div className="mb-6">
            <img src="/logo/Logo.png" alt="EchooMotive Logo" className="w-[200px] h-auto object-left object-contain drop-shadow-[0_0_24px_hsl(356_100%_63%/0.8)]" />
          </div>

          {/* Waveform animation */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white leading-snug">
                Understand every voice.<br />
                <span className="text-primary">At scale.</span>
              </h2>
              <p className="text-sm text-white/60 mt-3 max-w-xs leading-relaxed">
                Turn raw audio into actionable emotional intelligence — in real time.
              </p>
            </div>

            {/* Waveform bars */}
            <div className="flex items-end gap-[3px] h-12">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/70"
                  animate={{ height: ["20%", `${30 + Math.sin(i * 0.5) * 50 + Math.random() * 20}%`, "20%"] }}
                  transition={{ duration: 1.2 + (i % 5) * 0.25, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }}
                />
              ))}
            </div>

            {/* Rotating feature cards */}
            <div className="space-y-3">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    animate={{ opacity: activeFeature === i ? 1 : 0.35, x: activeFeature === i ? 0 : -6 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setActiveFeature(i)}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${activeFeature === i ? "bg-primary shadow-[0_0_16px_hsl(356_100%_63%/0.4)]" : "bg-white/10"}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{f.title}</p>
                      <p className="text-[10px] text-white/50">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Version badge */}
        <p className="relative z-10 text-[10px] text-white/30 uppercase tracking-widest">v2.4.0 · EchooMotive AI Powered</p>
      </div>

      {/* Right – form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />

        {/* Glow orb */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_16px_hsl(356_100%_63%/0.4)]">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground uppercase tracking-widest">EchooMotive</p>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">AI Platform</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your command center</p>
          </div>

          {/* Glassmorphism card */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full h-11 pl-9 pr-3 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-11 pl-9 pr-11 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-3 py-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading || !isLoaded}
                className="relative w-full h-11 rounded-lg bg-primary text-white text-sm font-semibold overflow-hidden group disabled:opacity-50 transition-all duration-200 shadow-[0_4px_20px_hsl(356_100%_63%/0.3)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Signing in...
                    </>
                  ) : (
                    <>Sign In <ChevronRight className="w-4 h-4" /></>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </form>

            <div className="mt-5 pt-4 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-semibold">
                  Create account
                </Link>
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {["SOC2", "GDPR", "HIPAA"].map((badge) => (
              <span key={badge} className="text-[10px] text-muted-foreground/50 border border-border/30 rounded px-2 py-0.5 uppercase tracking-widest">
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
