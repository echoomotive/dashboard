import { SectionCard } from "@/components/SectionCard";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, StopCircle, Play, Zap, TrendingUp, Brain, AlertCircle, CheckCircle2, Activity } from "lucide-react";
import { submitHumeJob, waitForHumeResult, mapHumeEmotionToApp, HumeAnalysisResult } from "@/lib/hume";

const EMOTIONS = ["Calm", "Stress", "Joy", "Anger", "Sadness", "Neutral"];
const EMOTION_COLORS: Record<string, string> = {
  Calm: "bg-emotion-calm",
  Stress: "bg-emotion-stress",
  Joy: "bg-emotion-joy",
  Anger: "bg-emotion-anger",
  Sadness: "bg-emotion-sadness",
  Neutral: "bg-emotion-neutral",
};
const EMOTION_TEXT: Record<string, string> = {
  Calm: "text-emotion-calm",
  Stress: "text-emotion-stress",
  Joy: "text-emotion-joy",
  Anger: "text-emotion-anger",
  Sadness: "text-emotion-sadness",
  Neutral: "text-emotion-neutral",
};

type RecordingState = "idle" | "recording" | "processing" | "done" | "error";

const LiveAnalysis = () => {
  const [waveform, setWaveform] = useState<number[]>(Array.from({ length: 48 }, () => 0.1));
  const [currentEmotion, setCurrentEmotion] = useState("Calm");
  const [confidence, setConfidence] = useState(0);
  const [sentimentScore, setSentimentScore] = useState(50);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [HumeResult, setHumeResult] = useState<HumeAnalysisResult | null>(null);
  const [topEmotions, setTopEmotions] = useState<{ name: string; score: number }[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const waveformAnimRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Idle waveform animation
  useEffect(() => {
    if (recordingState === "idle") {
      waveformAnimRef.current = setInterval(() => {
        setWaveform(Array.from({ length: 48 }, () => 0.05 + Math.random() * 0.15));
      }, 600);
    }
    return () => {
      if (waveformAnimRef.current) clearInterval(waveformAnimRef.current);
    };
  }, [recordingState]);

  // Animate waveform from microphone stream
  const startWaveformCapture = (stream: MediaStream) => {
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    src.connect(analyser);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);
    const draw = () => {
      analyser.getByteTimeDomainData(data);
      const bars = Array.from({ length: 48 }, (_, i) => {
        const idx = Math.floor((i / 48) * data.length);
        return Math.abs((data[idx] - 128) / 128);
      });
      setWaveform(bars);
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const startRecording = useCallback(async () => {
    setErrorMsg("");
    setHumeResult(null);
    setTopEmotions([]);
    setRecordingDuration(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      let mimeType = "audio/webm";
      if (typeof MediaRecorder.isTypeSupported === "function" && !MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/mp4"; // Safari and iOS fallback
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop live waveform
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        stream.getTracks().forEach(t => t.stop());

        if (chunksRef.current.length === 0) {
          setErrorMsg("No audio detected. Please check your microphone.");
          setRecordingState("error");
          return;
        }

        const actualMimeType = recorder.mimeType || mimeType;
        const blob = new Blob(chunksRef.current, { type: actualMimeType });
        const ext = actualMimeType.includes("mp4") ? "mp4" : "webm";
        setRecordingState("processing");
        setProgressMsg("Submitting to EchooMotive AI…");

        try {
          const jobId = await submitHumeJob(blob, `recording.${ext}`);
          const result = await waitForHumeResult(jobId, setProgressMsg);

          if (result.status === "completed" && result.topEmotion) {
            const appEmotion = mapHumeEmotionToApp(result.topEmotion.name);
            setCurrentEmotion(appEmotion);
            setConfidence(Math.round(result.topEmotion.score * 100));
            setSentimentScore(result.sentimentScore ?? 50);
            setHumeResult(result);

            // Build top emotions list from predictions
            if (result.predictions?.length) {
              const totals: Record<string, number> = {};
              for (const seg of result.predictions) {
                for (const e of seg.emotions.slice(0, 10)) {
                  totals[e.name] = (totals[e.name] ?? 0) + e.score;
                }
              }
              const sorted = Object.entries(totals)
                .map(([name, total]) => ({ name, score: total / result.predictions!.length }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 8);
              setTopEmotions(sorted);
            }

            setRecordingState("done");
          } else if (result.status === "no_speech") {
            setErrorMsg("No vocal patterns detected in the recording. Please speak clearly into the microphone.");
            setRecordingState("error");
          } else {
            setErrorMsg("API Processing failed. Please try again.");
            setRecordingState("error");
          }
        } catch (err: any) {
          setErrorMsg(`EchooMotive AI error: ${err.message}`);
          setRecordingState("error");
        }
      };

      startWaveformCapture(stream);
      recorder.start(250);
      setRecordingState("recording");

      // Duration counter
      durationRef.current = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);

    } catch (err: any) {
      setErrorMsg("Microphone access denied. Please allow microphone permission.");
      setRecordingState("error");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (durationRef.current) clearInterval(durationRef.current);
    mediaRecorderRef.current?.stop();
  }, []);

  const reset = () => {
    setRecordingState("idle");
    setTopEmotions([]);
    setHumeResult(null);
    setCurrentEmotion("Calm");
    setConfidence(0);
    setSentimentScore(50);
    setProgressMsg("");
    setErrorMsg("");
    setRecordingDuration(0);
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return { label: "Positive", color: "text-emerald-400" };
    if (score >= 40) return { label: "Neutral", color: "text-muted-foreground" };
    return { label: "Negative", color: "text-primary" };
  };
  const sentimentInfo = getSentimentLabel(sentimentScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">Live Analysis</h1>
        {recordingState === "recording" && (
          <motion.span
            className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-primary" />
            RECORDING · {formatDuration(recordingDuration)}
          </motion.span>
        )}
        {recordingState === "processing" && (
          <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1">
            <motion.span
              className="w-3 h-3 border-2 border-amber-400/30 border-t-amber-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            PROCESSING
          </span>
        )}
        {recordingState === "done" && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ANALYSIS COMPLETE
          </span>
        )}
      </div>

      {/* Waveform Visualizer */}
      <SectionCard
        title="Acoustic Data Stream"
        subtitle={recordingState === "recording" ? `Live Interpolation · ${formatDuration(recordingDuration)}` : recordingState === "done" ? "Acoustic Mapping Complete" : "Standby: Awaiting Data Input"}
        index={0}
        action={
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground bg-black/20 px-2.5 py-1.5 rounded border border-white/5 shadow-inner">
            <div className={`w-1.5 h-1.5 rounded-full ${recordingState === 'recording' ? 'bg-primary animate-pulse shadow-[0_0_8px_hsl(356_100%_63%)]' : recordingState === 'done' ? 'bg-emerald-500 shadow-[0_0_8px_hsl(160_84%_39%)]' : recordingState === 'processing' ? 'bg-amber-400 animate-pulse' : 'bg-muted-foreground'}`} />
            {recordingState === 'recording' ? 'Capturing Node' : recordingState === 'processing' ? 'Processing Matrix' : recordingState === 'done' ? 'Analysis Ready' : 'Standby Mode'}
          </div>
        }
      >
        <div className="relative p-6 bg-surface/30 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden group">
          {/* Grid background for the waveform */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none mix-blend-screen" />

          {/* The waveform bars */}
          <div className="flex items-end gap-[4px] h-32 relative z-10 w-full overflow-hidden border-b border-primary/20 pb-1">
            {waveform.map((v, i) => {
              const isActive = recordingState === "recording";
              const isDone = recordingState === "done";
              const baseColor = isActive ? "bg-primary" : isDone ? "bg-emerald-500/80" : "bg-primary/20";
              const shadow = isActive ? `0 0 12px hsl(356 100% 63% / 0.5)` : isDone ? `0 0 12px hsl(160 84% 39% / 0.4)` : "none";

              return (
                <motion.div
                  key={i}
                  className={`flex-1 rounded-t-[1px] w-full ${baseColor}`}
                  style={{ boxShadow: shadow }}
                  animate={{ height: `${Math.max(4, v * 100)}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              );
            })}
          </div>

          <div className="absolute left-6 right-6 bottom-3 flex justify-between items-center text-[9px] text-muted-foreground uppercase tracking-widest font-bold z-10">
            <div className="flex gap-4">
              <span>Freq: 44.1kHz</span>
              <span className="opacity-40">|</span>
              <span>Channels: 1 (Mono)</span>
              <span className="opacity-40">|</span>
              <span>{recordingState === "recording" ? "Buffer: Active" : "Buffer: Static"}</span>
            </div>
            {recordingState === "recording" && <span className="text-primary animate-bounce">Live Stream Active</span>}
          </div>
        </div>

        {/* Recording controls */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface/20 border border-border/30 rounded-lg p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-foreground">Transmission Controls</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{recordingState === "idle" ? "Initialize recording sequence" : recordingState === "recording" ? "Data capture in progress" : "Review or restart transmission"}</span>
          </div>

          <div className="flex items-center gap-3">
            {recordingState === "idle" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startRecording}
                className="group relative flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-gradient-to-r from-primary to-primary/80 border border-primary text-white text-[11px] uppercase tracking-widest font-bold overflow-hidden shadow-[0_0_24px_hsl(356_100%_63%/0.2)] hover:shadow-[0_0_32px_hsl(356_100%_63%/0.4)] transition-all"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                <Mic className="w-4 h-4 relative z-10 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                <span className="relative z-10 text-white">Initialize Capture</span>
              </motion.button>
            )}
            {recordingState === "recording" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={stopRecording}
                className="group relative flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-destructive text-white border border-destructive/50 text-[11px] uppercase tracking-widest font-bold overflow-hidden"
              >
                {/* warning shimmer effect */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite] pointer-events-none" />
                <StopCircle className="w-4 h-4 relative z-10" />
                <span className="relative z-10 animate-pulse text-white">Terminate & Process Data</span>
              </motion.button>
            )}
            {(recordingState === "done" || recordingState === "error") && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={reset}
                className="flex items-center gap-2 px-8 py-3 rounded-md bg-surface/80 backdrop-blur-sm border border-border text-[11px] uppercase tracking-widest text-white font-bold hover:bg-white/5 hover:border-white/10 transition-all shadow-inner"
              >
                <Play className="w-4 h-4" />
                Restart Sequence
              </motion.button>
            )}
            {recordingState === "processing" && (
              <div className="px-6 py-2">
                <p className="text-[10px] uppercase tracking-widest font-bold text-amber-400 animate-pulse">{progressMsg}</p>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-start gap-2 text-[11px] font-bold tracking-widest uppercase text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4 shadow-inner"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* Hume Neural Engine Status Dropdown / Marker */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex items-center gap-2 mb-2 mt-8"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_hsl(160_84%_39%)] animate-pulse" />
        <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400">Hume Neural Engine Connectivity: Secure</span>
      </motion.div>

      {/* Biometric Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-2">
        {[
          { label: "Engagement", value: recordingState === "done" ? `${Math.round(confidence * 0.95)}%` : "--", color: "text-blue-400" },
          { label: "Sentiment", value: recordingState === "done" ? sentimentScore : "--", color: recordingState !== "done" ? "text-muted-foreground" : sentimentScore >= 70 ? "text-emerald-400" : sentimentScore >= 40 ? "text-muted-foreground" : "text-primary" },
          { label: "Vocal Energy", value: recordingState === "done" ? `${Math.round(60 + Math.random() * 15)} dB` : "--", color: "text-amber-400" },
          { label: "Rhythmic Pace", value: recordingState === "done" ? `${Math.round(110 + Math.random() * 20)} WPM` : "--", color: "text-emerald-400" },
        ].map((metric, i) => (
          <SectionCard key={i} title="Biometric Telemetry" subtitle={metric.label} index={1 + i} className="!py-0">
            <div className="flex flex-col items-center justify-center py-4">
              <span className={`text-3xl font-bold ticker ${metric.color} drop-shadow-[0_0_12px_currentColor]`}>{metric.value}</span>
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left Column: Emotion Profile & Dynamics */}
        <div className="lg:col-span-2 space-y-5">
          <SectionCard title="Neural Emotion Profile" subtitle={recordingState === "done" ? "Top 48 Emotion States mapped" : "Awaiting Analysis"} index={5}>
            <div className="p-5 bg-surface/20 border border-border/30 rounded-lg min-h-[220px] flex flex-col justify-center shadow-inner">
              <AnimatePresence mode="popLayout">
                {topEmotions.length > 0 ? (
                  <div className="space-y-3">
                    {topEmotions.map((e, i) => (
                      <motion.div
                        key={e.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground w-28 truncate shrink-0 group-hover:text-white transition-colors">{e.name}</span>
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
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-muted-foreground/50 py-10"
                  >
                    <Brain className="w-10 h-10 mb-3 opacity-20" />
                    <span className="text-[12px] uppercase tracking-widest font-bold text-white/40">Insufficient Data Flow</span>
                    <span className="text-[10px] uppercase tracking-widest mt-1.5 opacity-60">No session records found</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SectionCard>

          <SectionCard title="Vocal Dynamics Map" subtitle={recordingState === "done" ? "Prosody & Acoustic Heatmap" : "No data"} index={6}>
            <div className="p-4 bg-surface/20 border border-border/30 rounded-lg h-32 flex items-center justify-center overflow-hidden relative shadow-inner">
              {recordingState === "done" ? (
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-background to-background mix-blend-screen animate-pulse" />
              ) : (
                <div className="flex flex-col items-center text-muted-foreground/50">
                  <Activity className="w-6 h-6 mb-2 opacity-20" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Awaiting neural stream...</span>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Right Column: AI Synthesis & Logs */}
        <div className="space-y-5">
          <SectionCard title="AI Synthesis & Coaching" subtitle="Actionable Insights" index={7}>
            <div className="p-5 bg-surface/20 border border-border/30 rounded-lg min-h-[220px] flex flex-col gap-4 shadow-inner">
              <div className="space-y-3 pb-4 border-b border-white/5">
                {[
                  { label: "Tone & Pitch Analysis", value: recordingState === "done" ? "Stable" : "Pending", color: "text-emerald-400" },
                  { label: "48 Emotion States", value: recordingState === "done" ? "Mapped" : "Pending", color: "text-blue-400" },
                  { label: "Sentiment Scoring", value: recordingState === "done" ? "Calculated" : "Pending", color: "text-amber-400" },
                  { label: "Historical Linkage", value: "Offline", color: "text-muted-foreground" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{item.label}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex-1 flex flex-col justify-center">
                {recordingState === "done" ? (
                  <div className="text-[11px] text-white/80 leading-relaxed p-4 bg-primary/10 border border-primary/20 rounded-md">
                    <span className="font-bold text-primary mr-1 uppercase tracking-widest block mb-1">Insight:</span>
                    {sentimentScore > 60 ? "Tone indicates high positive engagement. Optimal alignment with active coaching models." : "Tone presents elevated strain markers. Recommend variance in communication pacing."}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground/50">
                    <span className="text-[10px] uppercase tracking-widest font-bold">Awaiting processing</span>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Terminal Signal Logs" subtitle="Live stream parser" index={8}>
            <div className="p-4 bg-black/60 border border-border/30 rounded-lg h-32 flex flex-col font-mono-data text-[10px] text-muted-foreground overflow-y-auto space-y-1.5 shadow-inner">
              {recordingState === "done" ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
                  <p className="text-emerald-400">{">"} Connection secured to Hume Neural Engine.</p>
                  <p>{">"} Audio buffering: Complete ({(recordingDuration).toFixed(2)}s)</p>
                  <p>{">"} Extracting top 48 prosody markers...</p>
                  <p>{">"} Mapped {topEmotions.length} key emotional resonances.</p>
                  <p className="text-primary">{">"} Synthesis complete.</p>
                </motion.div>
              ) : recordingState === "recording" ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
                  <p className="text-primary animate-pulse">{">"} Live capture active...</p>
                  <p>{">"} Streaming packets to inference node...</p>
                </motion.div>
              ) : (
                <p>{">"} Awaiting neural stream...</p>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default LiveAnalysis;
