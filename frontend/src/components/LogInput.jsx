import { useState } from "react";

export default function LogInput({ onAnalyze, loading }) {
  const [value, setValue] = useState("");
<<<<<<< HEAD
  const [dragActive, setDragActive] = useState(false);
  //const [jsonError, setJsonError] = useState(null);

  /*const validate = (text) => {
=======
  const [jsonError, setJsonError] = useState(null);

  const validate = (text) => {
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
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
<<<<<<< HEAD
  };*/

  const submit = () => {
  if (value.trim() === "") return;

  onAnalyze(value); // send raw text directly
  };
  
  const handleFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setValue(e.target.result); // put file content into textarea
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <div
      className={`card ${dragActive ? "drag-active" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
=======
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
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
      <div className="card-header">
        <h2 className="card-title">Log Input</h2>
      </div>

<<<<<<< HEAD
      <p className="hint">Paste logs in ANY format (JSON, text, CSV, system logs, etc.)</p>

      <textarea
        className="json-editor"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        rows={18}
        placeholder="Example:
        [INFO] User login success from 192.168.1.1
        Failed password attempt for root
        GET /admin panel access"
      />

      <input
        type="file"
        accept=".txt,.log,.json,.csv"
        style={{ marginTop: "10px" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      
      <button
        className="btn btn-primary btn-block"
        onClick={submit}
        disabled={loading || value.trim() === ""}
=======
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
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
      >
        {loading ? "Running AI analysis…" : "Analyze Dump →"}
      </button>
    </div>
  );
}