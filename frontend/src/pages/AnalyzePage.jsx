import { useState } from "react";
import { api } from "../api/client";
import LogInput from "../components/LogInput";
import AnalysisView from "../components/AnalysisView";

export default function AnalyzePage({ onNewBlock }) {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  // --- NEW: Lazy Initialization ---
  // When this page loads, check if we have an analysis saved in memory!
  const [analysis, setAnalysis] = useState(() => {
    const saved = sessionStorage.getItem("currentAnalysis");
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  });

  const handleAnalyze = async (logData) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    sessionStorage.removeItem("currentAnalysis"); // Clear the old data

    try {
      const result = await api.analyze(logData);
      
      // Update the screen
      setAnalysis(result.analysis);
      
      // --- NEW: Save to Memory ---
      // Save the fresh analysis to the browser so it survives navigation
      sessionStorage.setItem("currentAnalysis", JSON.stringify(result.analysis));
      
      onNewBlock(result.block);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-layout">
      <div className="left-panel">
        <LogInput onAnalyze={handleAnalyze} loading={loading} />
      </div>
      <div className="right-panel">
        {error && <div className="error-banner">{error}</div>}
        {loading && <Spinner />}
        {!loading && analysis && <AnalysisView analysis={analysis} />}
        {!loading && !analysis && !error && <EmptyAnalysis />}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p className="spinner-label mono">Running AI threat analysis…</p>
    </div>
  );
}

function EmptyAnalysis() {
  return (
    <div className="empty-state">
      <p>Submit a log on the left to see the AI analysis here.</p>
    </div>
  );
}