import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ShieldCheck, ChevronRight, Mail } from "lucide-react";

const VerifyEmailPage = () => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { signUp, setActive } = useSignUp();
    const navigate = useNavigate();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signUp) return;
        setLoading(true);
        setError("");
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                navigate("/");
            } else {
                setError("Verification failed. Please try again.");
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background grid-overlay flex items-center justify-center p-4 relative overflow-hidden">
            {/* Glow orb */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Brand */}
                <div className="flex items-center justify-center mb-8">
                    <img src="/logo/Logo.png" alt="EchooMotive Logo" className="w-36 h-12 object-contain drop-shadow-[0_0_24px_hsl(356_100%_63%/0.5)]" />
                </div>

                {/* Email icon */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6"
                >
                    <Mail className="w-7 h-7 text-primary" />
                </motion.div>

                <div className="text-center mb-7">
                    <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        We sent a 6-digit verification code to your email address.
                    </p>
                </div>

                <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1.5 uppercase tracking-wider">
                                Verification Code
                            </label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    id="verify-code"
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    placeholder="000000"
                                    required
                                    maxLength={6}
                                    className="w-full h-12 pl-9 pr-3 rounded-lg bg-surface border border-border text-xl text-foreground text-center tracking-[0.4em] placeholder:text-muted-foreground/40 placeholder:tracking-normal placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 font-mono-data"
                                />
                            </div>
                            {/* Visual code dots */}
                            <div className="flex items-center justify-center gap-2 mt-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i < code.length ? "bg-primary" : "bg-border"}`}
                                    />
                                ))}
                            </div>
                        </div>

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

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={loading || code.length < 6}
                            className="relative w-full h-11 rounded-lg bg-primary text-white text-sm font-semibold overflow-hidden group disabled:opacity-50 transition-all shadow-[0_4px_20px_hsl(356_100%_63%/0.3)]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <motion.span
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                        />
                                        Verifying…
                                    </>
                                ) : (
                                    <>Verify & Sign In <ChevronRight className="w-4 h-4" /></>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-border/50 text-center">
                        <p className="text-xs text-muted-foreground">
                            Didn't receive a code?{" "}
                            <button
                                onClick={() => navigate("/signup")}
                                className="text-primary hover:underline font-semibold"
                            >
                                Try again
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmailPage;
