import { useState } from "react";

export default function LogInput({ onAnalyze, loading }) {
  const [value, setValue] = useState("");
  const [dragActive, setDragActive] = useState(false);
  //const [jsonError, setJsonError] = useState(null);

  /*const validate = (text) => {
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
      <div className="card-header">
        <h2 className="card-title">Log Input</h2>
      </div>

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
      >
        {loading ? "Running AI analysis…" : "Analyze Dump →"}
      </button>
    </div>
  );
}