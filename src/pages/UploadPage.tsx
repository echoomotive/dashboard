import { SectionCard } from "@/components/SectionCard";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, FileAudio, CheckCircle2, Clock, X, Brain, Zap, AlertCircle, Activity, TrendingUp } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { submitHumeJob, waitForHumeResult, mapHumeEmotionToApp, HumeEmotionScore } from "@/lib/hume";

interface FileItem {
  id: string;
  name: string;
  size: string;
  status: "queued" | "processing" | "done" | "error";
  progress: number;
  emotion?: string;
  confidence?: number;
  sentiment?: number;
  topEmotions?: HumeEmotionScore[];
  progressMsg?: string;
}

const EMOTION_TEXT: Record<string, string> = {
  Calm: "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]",
  Stress: "text-primary drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]",
  Joy: "text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]",
  Anger: "text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.5)]",
  Sadness: "text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.5)]",
  Neutral: "text-neutral-400 drop-shadow-[0_0_12px_rgba(163,163,163,0.5)]",
};

const UploadPage = () => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const updateFile = (id: string, patch: Partial<FileItem>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));
  };

  const processWithHume = async (itemId: string, file: File) => {
    updateFile(itemId, { status: "processing", progress: 10, progressMsg: "Uploading to EchooMotive AI…" });
    try {
      const jobId = await submitHumeJob(file, file.name);
      updateFile(itemId, { progress: 30, progressMsg: "Analyzing prosody…" });

      const result = await waitForHumeResult(
        jobId,
        (msg) => updateFile(itemId, { progressMsg: msg }),
        30,
        2000
      );

      if (result.status === "completed" && result.topEmotion) {
        const appEmotion = mapHumeEmotionToApp(result.topEmotion.name);
        updateFile(itemId, {
          status: "done",
          progress: 100,
          emotion: appEmotion,
          confidence: Math.round(result.topEmotion.score * 100),
          sentiment: result.sentimentScore,
          topEmotions: result.topEmotions?.slice(0, 8),
          progressMsg: undefined,
        });

        // Auto select if it's the only done file
        setFiles(current => {
          if (current.filter(f => f.status === "done").length === 1 && current.find(f => f.id === itemId)?.status === "done") {
            setSelectedFileId(itemId);
          }
          return current;
        });
      } else {
        updateFile(itemId, { status: "error", progress: 0, progressMsg: result.status === "no_speech" ? "No speech detected" : "Analysis failed" });
      }
    } catch (err: any) {
      updateFile(itemId, { status: "error", progress: 0, progressMsg: err.message });
    }
  };

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const newItems: FileItem[] = Array.from(newFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      status: "queued",
      progress: 0,
    }));

    setFiles((prev) => [...newItems, ...prev]);
    if (!selectedFileId && newItems.length > 0) setSelectedFileId(newItems[0].id);

    // Process each with Hume
    Array.from(newFiles).forEach((file, i) => {
      const item = newItems[i];
      // Stagger start times slightly
      setTimeout(() => processWithHume(item.id, file), i * 400);
    });
  };

  const removeFile = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (selectedFileId === id) setSelectedFileId(next[0]?.id || null);
      return next;
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, []);
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => addFiles(e.target.files);

  const doneCount = files.filter(f => f.status === "done").length;
  const processingCount = files.filter(f => f.status === "processing").length;
  const errorCount = files.filter(f => f.status === "error").length;
  const selectedFile = files.find(f => f.id === selectedFileId);

  const emotionColor: Record<string, string> = {
    Calm: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    Stress: "text-primary border-primary/30 bg-primary/10",
    Joy: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    Anger: "text-orange-500 border-orange-500/30 bg-orange-500/10",
    Sadness: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    Neutral: "text-neutral-400 border-muted bg-surface",
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return { label: "Positive", color: "text-emerald-400" };
    if (score >= 40) return { label: "Neutral", color: "text-muted-foreground" };
    return { label: "Negative", color: "text-primary" };
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Batch Processing Matrix</h1>
          <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-bold">Upload audio files for AI-powered EchooMotive AI emotional analysis</p>
        </div>

        {/* Hume Neural Engine Status */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-2 bg-surface/80 backdrop-blur-xl border border-border/70 rounded-2xl px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_hsl(160_84%_39%)] animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Hume Neural Bridge: Active</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Upload & Queue */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" multiple accept="audio/*" />

          {/* Drop zone */}
          <SectionCard title="Data Ingestion" subtitle="Secure Audio Transmission" index={0}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group overflow-hidden bg-surface/20 ${dragOver
                ? "border-primary bg-primary/5 shadow-[0_0_40px_hsl(356_100%_63%/0.15)]"
                : "border-border/60 hover:border-primary/50 hover:bg-surface/60"
                }`}
            >
              {/* Animated background on drag */}
              <AnimatePresence>
                {dragOver && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent mix-blend-screen" />
                )}
              </AnimatePresence>

              <div className="relative z-10">
                <motion.div animate={dragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className={`p-4 rounded-full mx-auto w-fit mb-4 transition-colors ${dragOver ? "bg-primary/20 shadow-[0_0_24px_hsl(356_100%_63%/0.3)] text-primary" : "bg-surface text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 shadow-inner"}`}>
                    <UploadIcon className="w-8 h-8" />
                  </div>
                </motion.div>
                <p className="text-[14px] text-foreground font-bold tracking-wide uppercase">Initialize File Transfer</p>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold">WAV, MP3, FLAC, OGG, WebM</p>

                <motion.button whileTap={{ scale: 0.97 }} className="mt-5 px-8 py-2.5 rounded-md bg-gradient-to-r from-primary to-primary/80 text-white text-[11px] font-bold uppercase tracking-widest hover:shadow-[0_0_24px_hsl(356_100%_63%/0.4)] transition-all overflow-hidden relative group/btn">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]">Select Files</span>
                </motion.button>
              </div>
            </motion.div>
          </SectionCard>

          {/* Upload Queue */}
          <SectionCard
            title="Processing Timeline"
            subtitle={`${files.length} Node${files.length !== 1 ? "s" : ""} Online`}
            index={1}
            action={
              processingCount > 0 ? (
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-2 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20 shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {processingCount} Syncing
                </span>
              ) : doneCount > 0 && files.length === doneCount ? (
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shadow-inner">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Matrix Stable
                </span>
              ) : undefined
            }
            className="flex-1 flex flex-col"
          >
            <div className="space-y-3 flex-1 px-1 -mx-1 overflow-y-auto max-h-[400px] fancy-scrollbar pr-3">
              <AnimatePresence initial={false}>
                {files.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed border-border/50 rounded-xl bg-surface/10">
                    <Clock className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Awaiting audio packets</p>
                  </motion.div>
                ) : (
                  files.map((f) => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, x: -12, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => setSelectedFileId(f.id)}
                      className={`rounded-xl border border-border/40 overflow-hidden cursor-pointer transition-colors ${selectedFileId === f.id ? "bg-primary/10 border-primary/40 shadow-[0_0_24px_hsl(356_100%_63%/0.1)]" : "bg-card hover:bg-surface/50"}`}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <div className={`p-2 rounded-lg shrink-0 ${f.status === "done" ? "bg-emerald-500/10" : f.status === "error" ? "bg-destructive/10" : "bg-surface"}`}>
                          <FileAudio className={`w-4 h-4 ${f.status === "done" ? "text-emerald-400" : f.status === "error" ? "text-destructive" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate font-medium">{f.name}</p>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                            {f.size} <span className="opacity-50">|</span> {f.progressMsg ?? (f.status === "queued" ? "Awaiting Pipeline" : f.status === "done" ? "Analysis Ready" : "Terminal Error")}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {f.status === "done" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </motion.div>
                          )}
                          {f.status === "queued" && <Clock className="w-4 h-4 text-muted-foreground animate-pulse" />}
                          {f.status === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
                          {f.status === "processing" && (
                            <motion.div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                          )}
                          <button onClick={(e) => removeFile(f.id, e)} className="p-1.5 rounded hover:bg-surface/80 text-muted-foreground hover:text-white transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {f.status === "processing" && (
                        <div className="h-0.5 bg-surface relative overflow-hidden">
                          <motion.div className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_8px_hsl(356_100%_63%)]" animate={{ width: `${f.progress}%` }} transition={{ duration: 0.5 }} />
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Quick Stats Footer */}
            {(doneCount > 0 || errorCount > 0) && (
              <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-2 text-center">
                <div className="bg-emerald-500/10 border border-emerald-500/20 py-2 rounded shadow-inner">
                  <span className="block text-emerald-400 text-lg font-bold ticker">{doneCount}</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-500/70">Processed</span>
                </div>
                <div className="bg-destructive/10 border border-destructive/20 py-2 rounded shadow-inner">
                  <span className="block text-destructive text-lg font-bold ticker">{errorCount}</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-destructive/70">Failed</span>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column: Active File Telemetry insights (Like Live) */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Target File Intelligence" subtitle={selectedFile ? selectedFile.name : "Select a node to extract data"} index={2} className="h-full">
            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center p-20 text-muted-foreground/50 border border-dashed border-border/30 rounded-xl bg-surface/5">
                  <Brain className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-[12px] uppercase font-bold tracking-widest text-white/30">Target System Offline</p>
                  <p className="text-[10px] uppercase tracking-widest mt-2 opacity-50">Please initiate transfer sequence to populate dash</p>
                </motion.div>
              ) : selectedFile.status === "processing" || selectedFile.status === "queued" ? (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center p-20 border border-border/30 rounded-xl bg-surface/20 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none mix-blend-screen" />
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-pulse" />

                  <motion.div className="w-16 h-16 border-4 border-surface border-t-primary rounded-full mb-6 relative z-10" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  <p className="text-[12px] font-bold uppercase tracking-widest text-white relative z-10">{selectedFile.progressMsg || "Aligning Neural Matrix..."}</p>
                  {selectedFile.status === "processing" && (
                    <div className="w-64 h-1 mt-6 bg-surface rounded-full overflow-hidden shadow-inner relative z-10">
                      <motion.div className="h-full bg-primary shadow-[0_0_12px_hsl(356_100%_63%)]" animate={{ width: `${selectedFile.progress}%` }} />
                    </div>
                  )}
                </motion.div>
              ) : selectedFile.status === "error" ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center p-20 border border-destructive/20 rounded-xl bg-destructive/10 shadow-inner">
                  <AlertCircle className="w-16 h-16 mb-4 text-destructive drop-shadow-[0_0_12px_hsl(356_100%_63%/0.5)]" />
                  <p className="text-[12px] uppercase font-bold tracking-widest text-white">Extraction Failure</p>
                  <p className="text-[10px] uppercase tracking-widest mt-2 text-destructive">{selectedFile.progressMsg}</p>
                </motion.div>
              ) : selectedFile.status === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                  {/* Summary Block */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Primary Vector", value: selectedFile.emotion || "Unknown", color: "text-white" },
                      { label: "Predictive Conf", value: `${selectedFile.confidence}%`, color: "text-blue-400" },
                      { label: "Tone Polarity", value: `${selectedFile.sentiment}/100`, color: getSentimentLabel(selectedFile.sentiment || 0).color },
                      { label: "System Health", value: "Verified", color: "text-emerald-400" },
                    ].map((item, i) => (
                      <div key={i} className="bg-surface/40 border border-border/50 rounded-lg p-4 flex flex-col justify-center text-center shadow-inner">
                        <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${item.color}`}>{item.label}</span>
                        <span className={`text-xl font-bold uppercase ticker ${item.label === 'Primary Vector' && selectedFile.emotion ? EMOTION_TEXT[selectedFile.emotion] : "text-foreground"}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Neural Connectome Map (Detailed Top Emotions) */}
                  <div className="bg-surface/20 border border-border/30 rounded-xl p-6 shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 grid-overlay opacity-[0.03] pointer-events-none mix-blend-overlay" />
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-2 mb-5 border-b border-white/5 pb-3">
                      <Activity className="w-4 h-4 text-primary drop-shadow-[0_0_8px_hsl(356_100%_63%)]" />
                      Top Identified Emotional Resonances
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {selectedFile.topEmotions?.map((e, i) => (
                        <motion.div
                          key={e.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-4"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-28 truncate shrink-0 group-hover:text-white transition-colors">{e.name}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden relative shadow-inner">
                            <motion.div
                              className="absolute inset-y-0 left-0 rounded-full bg-primary"
                              style={{ boxShadow: `0 0 10px hsl(356 100% 63% / 0.5)` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.round(e.score * 100)}%` }}
                              transition={{ delay: 0.2 + i * 0.05, duration: 0.8 }}
                            />
                          </div>
                          <span className="text-[11px] text-white ticker w-10 text-right font-bold drop-shadow-sm">
                            {Math.round(e.score * 100)}%
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Final Output Insights */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-inner flex flex-col sm:flex-row gap-6">
                    <div className="p-4 bg-primary/10 rounded-lg shrink-0 flex items-center justify-center border border-primary/20">
                      <Brain className="w-8 h-8 text-primary drop-shadow-[0_0_12px_hsl(356_100%_63%)]" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[12px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        EchooMotive AI Synthesis
                      </h4>
                      <p className="text-[11px] text-white/70 leading-relaxed font-bold tracking-wide">
                        Based on the neural mapping of <span className="text-white">'{selectedFile.name}'</span>, the primary emotional vector is structured around <span className="text-primary">{selectedFile.emotion?.toUpperCase()}</span> with a network confidence rating of <span className="text-white">{selectedFile.confidence}%</span>.
                        <br /><br />
                        <span className="text-emerald-400 block border-l-2 border-emerald-400 pl-3">
                          {selectedFile.sentiment && selectedFile.sentiment > 60
                            ? "Actionable Output: Interlocutor presents stable emotional elasticity. Optimal data retention predicted."
                            : "Actionable Output: Sub-optimal prosodic variance detected. Recommend pacing adjustments in future interactions."}
                        </span>
                      </p>
                    </div>
                  </div>

                </motion.div>
              ) : null}
            </AnimatePresence>
          </SectionCard>
        </div>

      </div>
    </div>
  );
};

export default UploadPage;
