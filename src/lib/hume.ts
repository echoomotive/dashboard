// Hume Emotion Expression API integration
// Uses Hume's batch API to analyze audio files for emotional prosody

const Hume_API_KEY = import.meta.env.VITE_HUME_API_KEY;

export interface HumeEmotionScore {
    name: string;
    score: number;
}

export interface HumeProsodyPrediction {
    time: { begin: number; end: number };
    emotions: HumeEmotionScore[];
}

export interface HumeAnalysisResult {
    jobId: string;
    status: "pending" | "completed" | "failed" | "no_speech";
    predictions?: HumeProsodyPrediction[];
    topEmotion?: HumeEmotionScore;
    topEmotions?: HumeEmotionScore[];
    sentimentScore?: number;
}

const Hume_BASE = "https://api.hume.ai/v0";

/**
 * Submit an audio file (Blob/File) to Hume for prosody analysis.
 * Returns the job ID for polling.
 */
export async function submitHumeJob(audioBlob: Blob, filename = "recording.webm"): Promise<string> {
    const formData = new FormData();
    formData.append("file", audioBlob, filename);
    formData.append(
        "json",
        JSON.stringify({
            models: { prosody: {} },
        })
    );

    const res = await fetch(`${Hume_BASE}/batch/jobs`, {
        method: "POST",
        headers: {
            "X-Hume-Api-Key": Hume_API_KEY,
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Hume submit error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.job_id as string;
}

/**
 * Poll Hume for job results.
 */
export async function getHumeJobResult(jobId: string): Promise<HumeAnalysisResult> {
    // 1. Check job status first
    const statusRes = await fetch(`${Hume_BASE}/batch/jobs/${jobId}`, {
        headers: { "X-Hume-Api-Key": Hume_API_KEY }
    });

    if (!statusRes.ok) {
        console.error("Failed to fetch job status", await statusRes.text());
        return { jobId, status: "failed" };
    }

    const statusData = await statusRes.json();
    const state = statusData?.state?.status;

    if (state === "QUEUED" || state === "IN_PROGRESS") {
        return { jobId, status: "pending" };
    }

    if (state === "FAILED") {
        console.error("Hume job failed:", statusData);
        return { jobId, status: "failed" };
    }

    // 2. Fetch predictions if completed
    const predRes = await fetch(`${Hume_BASE}/batch/jobs/${jobId}/predictions`, {
        headers: {
            "X-Hume-Api-Key": Hume_API_KEY,
            "Content-Type": "application/json",
        },
    });

    if (!predRes.ok) {
        console.error("Failed to fetch predictions", await predRes.text());
        return { jobId, status: "failed" };
    }

    const data = await predRes.json();

    // Navigate the response structure
    const predictions: HumeProsodyPrediction[] =
        data?.[0]?.results?.predictions?.[0]?.models?.prosody?.grouped_predictions?.[0]?.predictions ?? [];

    if (!predictions.length) {
        return { jobId, status: "no_speech" };
    }

    // Find top emotion across all time segments (average)
    const emotionTotals: Record<string, number> = {};
    let segCount = 0;
    for (const seg of predictions) {
        segCount++;
        for (const e of seg.emotions) {
            emotionTotals[e.name] = (emotionTotals[e.name] ?? 0) + e.score;
        }
    }
    const averaged = Object.entries(emotionTotals).map(([name, total]) => ({
        name,
        score: total / segCount,
    }));
    averaged.sort((a, b) => b.score - a.score);

    const topEmotion = averaged[0];

    // Derive simple sentiment score (0-100) from positive vs negative emotions
    const positiveEmotions = ["Joy", "Happiness", "Contentment", "Amusement", "Excitement", "Satisfaction", "Relief", "Calm"];
    const negativeEmotions = ["Anger", "Frustration", "Stress", "Sadness", "Fear", "Disgust", "Anxiety", "Distress"];

    let posScore = 0;
    let negScore = 0;
    for (const e of averaged) {
        if (positiveEmotions.some(p => e.name.toLowerCase().includes(p.toLowerCase()))) posScore += e.score;
        if (negativeEmotions.some(n => e.name.toLowerCase().includes(n.toLowerCase()))) negScore += e.score;
    }
    const sentimentScore = Math.round(50 + (posScore - negScore) * 100);

    return {
        jobId,
        status: "completed",
        predictions,
        topEmotion,
        topEmotions: averaged,
        sentimentScore: Math.max(0, Math.min(100, sentimentScore)),
    };
}

/**
 * Poll until job is done or timeout.
 */
export async function waitForHumeResult(
    jobId: string,
    onProgress?: (msg: string) => void,
    maxAttempts = 30,
    intervalMs = 2000
): Promise<HumeAnalysisResult> {
    for (let i = 0; i < maxAttempts; i++) {
        onProgress?.(`Analyzing… (${i + 1}/${maxAttempts})`);
        const result = await getHumeJobResult(jobId);
        if (result.status !== "pending") return result;
        await new Promise(r => setTimeout(r, intervalMs));
    }
    return { jobId, status: "failed" };
}

/**
 * Map Hume emotion name to our app emotion categories.
 */
export function mapHumeEmotionToApp(HumeName: string): string {
    const lower = HumeName.toLowerCase();
    if (["joy", "happiness", "amusement", "excitement", "elation"].some(k => lower.includes(k))) return "Joy";
    if (["anger", "frustration", "contempt", "irritation"].some(k => lower.includes(k))) return "Anger";
    if (["sadness", "grief", "melancholy", "disappointment"].some(k => lower.includes(k))) return "Sadness";
    if (["calm", "contentment", "serenity", "relief", "satisfaction"].some(k => lower.includes(k))) return "Calm";
    if (["stress", "anxiety", "fear", "distress", "worry"].some(k => lower.includes(k))) return "Stress";
    return "Neutral";
}
