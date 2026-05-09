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
<<<<<<< HEAD
    console.log("Analyzing input:", logData);
    sessionStorage.removeItem("currentAnalysis"); // Clear the old data
    
=======
    sessionStorage.removeItem("currentAnalysis"); // Clear the old data
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3

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
<<<<<<< HEAD
        {!loading && analysis && analysis.length > 0 && (
          <AnalysisView analysis={analysis} />
        )}

        {!loading && analysis && analysis.length === 0 && (
          <div className="empty-state">
            <p>No threats detected 🎉</p>
          </div>
        )}
=======
        {!loading && analysis && <AnalysisView analysis={analysis} />}
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
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