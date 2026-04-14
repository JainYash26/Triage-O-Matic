import { useState } from "react";

export default function LogInput({ onAnalyze, loading }) {
  const [value, setValue] = useState("");
  const [jsonError, setJsonError] = useState(null);

  const validate = (text) => {
    setValue(text);
    
    // Don't show an error if the box is completely empty
    if (text.trim() === "") {
      setJsonError(null);
      return;
    }
    
    try { 
      JSON.parse(text); 
      setJsonError(null); 
    } catch (e) { 
      setJsonError(e.message); 
    }
  };

  const submit = () => {
    if (value.trim() === "") {
      setJsonError("Please enter some JSON data.");
      return;
    }

    try {
      const parsed = JSON.parse(value);
      onAnalyze(parsed);
    } catch (e) {
      setJsonError(e.message);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Log Input</h2>
      </div>

      <p className="hint">Paste a single log object or an array of bulk logs as JSON.</p>

      <textarea
        className={`json-editor ${jsonError ? "error" : ""}`}
        value={value}
        onChange={(e) => validate(e.target.value)}
        spellCheck={false}
        rows={18}
        placeholder="[&#10;  {&#10;    &quot;timestamp&quot;: &quot;2024-04-14T10:00:00Z&quot;,&#10;    &quot;event&quot;: &quot;paste your data here...&quot;&#10;  }&#10;]"
      />

      {jsonError && <p className="error-msg">{jsonError}</p>}

      <button
        className="btn btn-primary btn-block"
        onClick={submit}
        disabled={loading || !!jsonError || value.trim() === ""}
      >
        {loading ? "Running AI analysis…" : "Analyze Dump →"}
      </button>
    </div>
  );
}