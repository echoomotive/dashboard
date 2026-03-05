import { SectionCard } from "@/components/SectionCard";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Mail, CheckCircle, Plus, Send, FileSpreadsheet, Loader2, Database, ShieldAlert, FileSearch } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Report {
  id: string;
  name: string;
  date: string;
  format: string;
  size: string;
}

const initialReports: Report[] = [
  { id: "R-84920", name: "Global Biometric Synopsis", date: "2026-03-01", format: "PDF", size: "2.4 MB" },
  { id: "R-84919", name: "Neural Tolerance Q1", date: "2026-02-28", format: "CSV", size: "840 KB" },
  { id: "R-84918", name: "Complete Acoustic Vector Trace", date: "2026-02-25", format: "JSON", size: "5.1 MB" },
  { id: "R-84917", name: "Trending Polarity Drift", date: "2026-02-20", format: "PDF", size: "3.7 MB" },
];

const Reports = () => {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [generating, setGenerating] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedType, setSelectedType] = useState("Global Biometric Synopsis");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          setTimeout(() => {
            const newReport: Report = {
              id: `R-${Math.floor(Math.random() * 90000 + 10000)}`,
              name: selectedType,
              date: new Date().toISOString().split('T')[0],
              format: selectedType.includes("Data Export") || selectedType.includes("Trace") ? "JSON" : "PDF",
              size: (Math.random() * 5 + 1).toFixed(1) + " MB"
            };
            setReports([newReport, ...reports]);
            setGenerating(false);
          }, 500);
          return 100;
        }
        return p + Math.random() * 20;
      });
    }, 250);
  };

  const handleEmailLast = () => {
    setEmailing(true);
    setTimeout(() => {
      setEmailing(false);
      toast.success("Payload successfully transmitted to Root Admin.");
    }, 2000);
  };

  const generatePDF = (report: Report) => {
    const doc = new jsPDF();

    // Add Tech Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(244, 63, 94); // Primary red
    doc.text("ECHOOMOTIVE AI MATRIX EXPORT", 20, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text(`CLASSIFICATION: ${report.name.toUpperCase()}`, 20, 30);
    doc.text(`ARTIFACT ID: ${report.id}`, 20, 36);
    doc.text(`GENERATION DATE: ${report.date}`, 20, 42);

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 48, 190, 48);

    autoTable(doc, {
      startY: 55,
      head: [['Session ID', 'Sentiment Vector', 'Confidence', 'Duration']],
      body: [
        ['S-1042', 'Calm', '94%', '4:32'],
        ['S-1041', 'Stress', '87%', '6:15'],
        ['S-1040', 'Joy', '91%', '3:48'],
        ['S-1039', 'Anger', '78%', '5:02'],
        ['S-1038', 'Sadness', '85%', '7:20']
      ],
      theme: 'grid',
      headStyles: { fillColor: [244, 63, 94], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 }
    });

    doc.save(`${report.name.replace(/\s+/g, '_')}_${report.id}.pdf`);
  };

  const generateCSV = (report: Report) => {
    const headers = ["Session ID", "Sentiment Vector", "Confidence", "Duration"];
    const rows = [
      ['S-1042', 'Calm', '94%', '4:32'],
      ['S-1041', 'Stress', '87%', '6:15'],
      ['S-1040', 'Joy', '91%', '3:48'],
      ['S-1039', 'Anger', '78%', '5:02'],
      ['S-1038', 'Sadness', '85%', '7:20']
    ];
    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${report.name.replace(/\s+/g, '_')}_${report.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateJSON = (report: Report) => {
    const data = {
      artifact_id: report.id,
      classification_name: report.name,
      generation_date: report.date,
      telemetry: [
        { session_id: 'S-1042', sentiment: 'Calm', confidence: 94, duration: '4:32' },
        { session_id: 'S-1041', sentiment: 'Stress', confidence: 87, duration: '6:15' },
        { session_id: 'S-1040', sentiment: 'Joy', confidence: 91, duration: '3:48' },
      ]
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `${report.name.replace(/\s+/g, '_')}_${report.id}.json`);
    link.click();
  };

  const handleExportAll = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      const report: Report = { id: "ALL_DUMP", name: "Execute_Schema_Dump", date: new Date().toISOString().split('T')[0], format: "PDF", size: "0MB" };
      generatePDF(report);
      toast.success("Matrix cloned. Raw PDF export securely stored.");
    }, 2500);
  };

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    const report = reports.find(r => r.id === id);
    setTimeout(() => {
      if (report) {
        if (report.format === 'PDF') generatePDF(report);
        else if (report.format === 'CSV') generateCSV(report);
        else if (report.format === 'JSON') generateJSON(report);
      }
      setDownloadingId(null);
      toast.success("Data decryption and download initiated.");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 font-heading tracking-wide">
            Data Export & Payload Generation
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase font-bold">Compile and secure matrix analytics into portable artifacts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Initialize Compilation" subtitle="Compile raw vectors to static" index={0}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Select Output Vector</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-12 px-4 rounded-lg bg-black/60 border border-white/10 text-[11px] uppercase font-bold tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 cursor-pointer shadow-inner appearance-none relative"
              >
                <option>Global Biometric Synopsis</option>
                <option>Trending Polarity Drift</option>
                <option>Node Connectivity Health</option>
                <option>Complete Acoustic Vector Trace</option>
              </select>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              disabled={generating}
              className="w-full h-12 rounded-lg bg-primary text-white text-[11px] uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_16px_hsl(356_100%_63%/0.4)] group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <div className="relative z-10 flex items-center gap-2">
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Compiling Matrices...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Generate Artifact
                  </>
                )}
              </div>
            </motion.button>

            <AnimatePresence>
              {generating && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 pt-2">
                  <div className="flex justify-between text-[9px] text-primary uppercase font-bold tracking-widest">
                    <span className="animate-pulse">Parsing acoustic headers...</span>
                    <span className="ticker">{Math.floor(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/60 border border-white/5 overflow-hidden shadow-inner relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_8px_hsl(356_100%_63%)]"
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionCard>

        <SectionCard title="Batch Execution" subtitle="Mass scale protocols" index={1}>
          <div className="space-y-3">
            <button
              onClick={handleEmailLast}
              disabled={emailing}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-black/60 border border-white/5 hover:border-primary/30 transition-all text-sm disabled:opacity-50 group bg-surface/20"
            >
              <div className="w-10 h-10 rounded-lg border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0 shadow-inner group-hover:shadow-[0_0_12px_hsl(356_100%_63%/0.3)] transition-all">
                {emailing ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Send className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />}
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-[12px] uppercase tracking-wide text-white">{emailing ? "Transmitting..." : "Push Artifact Array to Host"}</p>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Secure transmission via internal mail relay</p>
              </div>
            </button>

            <button
              onClick={handleExportAll}
              disabled={exporting}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-black/60 border border-white/5 hover:border-emerald-500/30 transition-all text-sm disabled:opacity-50 group bg-surface/20"
            >
              <div className="w-10 h-10 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0 shadow-inner group-hover:shadow-[0_0_12px_hsl(160_84%_39%/0.3)] transition-all">
                {exporting ? <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" /> : <Database className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />}
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-[12px] uppercase tracking-wide text-white">{exporting ? "Dumping Data..." : "Execute Schema Dump (PDF)"}</p>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Clones entire neural metric database to flat file</p>
              </div>
            </button>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Compiled Artifacts Registry" subtitle={`${reports.length} standard outputs available`} index={2}>
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-muted-foreground border-b border-white/10 relative">
                <th className="py-4 pl-4 font-bold">Artifact ID</th>
                <th className="py-4 font-bold">Classification Name</th>
                <th className="py-4 font-bold text-center">Format</th>
                <th className="py-4 font-bold text-right">Data Weight</th>
                <th className="text-right py-4 font-bold">Generation Date</th>
                <th className="text-right py-4 pr-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false} mode="popLayout">
                {reports.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 pl-4 font-mono-data text-[11px] text-muted-foreground group-hover:text-white transition-colors">
                      {r.id}
                    </td>
                    <td className="py-4 text-[12px] text-white/90 font-bold tracking-wide flex items-center gap-3">
                      <FileSearch className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                      {r.name}
                    </td>
                    <td className="py-4 text-center">
                      <span className={`text-[9px] uppercase font-bold tracking-widest border px-2 py-0.5 rounded shadow-inner ${r.format === 'JSON' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : r.format === 'CSV' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-blue-400/10 text-blue-400 border-blue-400/30'}`}>
                        {r.format}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-[10px] text-muted-foreground font-bold tracking-widest ticker">{r.size}</span>
                    </td>
                    <td className="py-4 text-right text-[10px] uppercase font-mono-data text-white/50">
                      {r.date}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <button
                        onClick={() => handleDownload(r.id)}
                        disabled={downloadingId === r.id}
                        className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-primary/50 text-muted-foreground hover:text-white transition-all disabled:opacity-50 inline-flex items-center justify-center bg-black/40 hover:bg-primary/20 hover:shadow-[0_0_12px_hsl(356_100%_63%/0.3)] group/btn"
                        title="Decrypt & Download"
                      >
                        {downloadingId === r.id ? (
                          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5 group-hover/btn:text-primary transition-colors" />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default Reports;
