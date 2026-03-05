import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Eye, EyeOff, Mail, Lock, User, Check, ChevronRight, Mic } from "lucide-react";

const steps = [
  { num: 1, label: "Create account" },
  { num: 2, label: "Verify email" },
  { num: 3, label: "Start analyzing" },
];

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoaded, signUp } = useSignUp();
  const navigate = useNavigate();

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);

  const getStrengthConfig = () => {
    if (!password) return { label: "", color: "bg-border", width: "0%", textColor: "" };
    if (strength <= 1) return { label: "Weak", color: "bg-destructive", width: "25%", textColor: "text-destructive" };
    if (strength <= 2) return { label: "Fair", color: "bg-amber-500", width: "50%", textColor: "text-amber-500" };
    if (strength <= 3) return { label: "Good", color: "bg-blue-400", width: "75%", textColor: "text-blue-400" };
    return { label: "Strong", color: "bg-emerald-500", width: "100%", textColor: "text-emerald-500" };
  };
  const config = getStrengthConfig();

  const strengthChecks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Symbol", ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" "),
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      navigate("/verify-email");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left hero panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-primary/20 z-0" />

        <div className="relative z-10 flex flex-col justify-center flex-1">
          {/* Brand */}
          <div className="mb-6">
            <img src="/logo/Logo.png" alt="EchooMotive Logo" className="w-[200px] h-auto object-left object-contain drop-shadow-[0_0_24px_hsl(356_100%_63%/0.8)]" />
          </div>

          {/* Center content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white leading-snug">
                Start your journey<br />
                <span className="text-primary">into voice AI.</span>
              </h2>
              <p className="text-sm text-white/60 mt-3 max-w-xs leading-relaxed">
                Join thousands of professionals using EchooMotive to transform voice data into emotional intelligence.
              </p>
            </div>

            {/* Onboarding steps */}
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${i === 0 ? "bg-primary shadow-[0_0_16px_hsl(356_100%_63%/0.5)] text-white" : "bg-white/10 text-white/50"}`}>
                    {i === 0 ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${i === 0 ? "text-white" : "text-white/40"}`}>{step.label}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute left-[43px] mt-8 w-px h-4 bg-white/10" style={{ position: "relative", left: "unset", marginTop: 0 }} />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "12K+", label: "Analyses/day" },
                { value: "94%", label: "Accuracy" },
                { value: "1.2s", label: "Avg latency" },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-primary">{stat.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[10px] text-white/30 uppercase tracking-widest">Powered by EchooMotive AI · Core v2.4.0</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />

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

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join the EchooMotive AI platform</p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    className="w-full h-11 pl-9 pr-3 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5 uppercase tracking-wider">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="signup-email"
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
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                    minLength={8}
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

                {/* Strength meter */}
                <AnimatePresence>
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden mr-2">
                          <motion.div
                            animate={{ width: config.width }}
                            transition={{ duration: 0.3 }}
                            className={`h-full rounded-full ${config.color}`}
                          />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${config.textColor}`}>{config.label}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {strengthChecks.map((c) => (
                          <div key={c.label} className={`flex items-center gap-1 text-[9px] ${c.ok ? "text-emerald-500" : "text-muted-foreground/40"}`}>
                            <Check className={`w-2.5 h-2.5 ${c.ok ? "opacity-100" : "opacity-20"}`} />
                            {c.label}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

              {/* Terms */}
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                By creating an account you agree to our{" "}
                <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and{" "}
                <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
              </p>

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
                      Creating account...
                    </>
                  ) : (
                    <>Create Account <ChevronRight className="w-4 h-4" /></>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </form>

            <div className="mt-5 pt-4 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Trust badges */}
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

export default SignupPage;
