import { useState } from "react";
import { shortHash } from "../utils/hash";

const SEV_CLASS = { CRITICAL:"sev-critical", HIGH:"sev-high", MEDIUM:"sev-medium", LOW:"sev-low" };

export default function AuditChain({ chain = [], chainIntact = true }) {
  const [expanded, setExpanded] = useState(null);

  if (chain.length === 0) {
    return (
      <div className="empty-state">
        <p>No audit entries yet. Analyze a log dump to create the first block.</p>
      </div>
    );
  }

  return (
    <div className="chain-view">
      <div className="chain-header">
        <p className="chain-meta">{chain.length} block{chain.length > 1 ? "s" : ""} · SHA-256 · tamper-evident</p>
        <span className={`badge ${chainIntact ? "badge-success" : "badge-danger"}`}>
          {chainIntact ? "✓ Chain intact" : "⚠ Chain broken"}
        </span>
      </div>

      {chain.map((block, i) => {
        const threats = Array.isArray(block.analysis) ? block.analysis : [];
        const threatCount = threats.length;
        
        // Determine what to show on the collapsed header
        let displayTitle = "Healthy Traffic";
        let displaySeverity = "SAFE";
        let sevClass = "badge-success"; // Default green for safe

        if (threatCount === 1) {
          displayTitle = threats[0].attack_type;
          displaySeverity = threats[0].severity;
          sevClass = SEV_CLASS[displaySeverity] || "sev-medium";
        } else if (threatCount > 1) {
          displayTitle = `Multiple Threats Detected (${threatCount})`;
          displaySeverity = threats[0].severity; // Pull severity from the first threat in the list
          sevClass = SEV_CLASS[displaySeverity] || "sev-medium";
        }

        // Handle array inputs for the preview subtitle
        const firstLog = Array.isArray(block.input_data) ? block.input_data[0] : block.input_data;
        const sourceIp = firstLog?.source_ip || "?";
        const destIp = firstLog?.destination_ip || "?";

        const isOpen = expanded === block.id;

        return (
          <div key={block.id} className="chain-block-wrapper">
            {i > 0 && <div className="chain-connector" />}

            <div className="chain-block">
              {/* Block header row */}
              <div className="block-header" onClick={() => setExpanded(isOpen ? null : block.id)}>
                <div className={`block-id ${sevClass}`}>#{block.id}</div>
                <div className="block-meta">
                  <p className="block-attack">{displayTitle}</p>
                  <p className="block-sub mono">
                    {sourceIp} → {destIp} {Array.isArray(block.input_data) && block.input_data.length > 1 ? `(+${block.input_data.length - 1} more logs)` : ""} ·{" "}
                    {block.timestamp?.replace("T"," ").split(".")[0]} UTC
                  </p>
                </div>
                <span className={`badge ${sevClass}`}>{displaySeverity}</span>
                <span className="chevron">{isOpen ? "▲" : "▼"}</span>
              </div>

              {/* Hash chain preview (always visible) */}
              <div className="hash-preview">
                <HashRow label="Prev"    value={shortHash(block.previous_hash)} />
                <HashRow label="Data"    value={shortHash(block.data_hash)} />
                <HashRow label="Block"   value={shortHash(block.block_hash)} />
              </div>

              {/* Expanded full detail */}
              {isOpen && (
                <div className="block-detail">
                  <HashRow label="Previous hash (full)" value={block.previous_hash} full />
                  <HashRow label="Data hash (SHA-256)"  value={block.data_hash}     full />
                  <HashRow label="Block hash"           value={block.block_hash}    full />

                  <p className="section-label" style={{ marginTop: 16 }}>Full audit record</p>
                  <pre className="json-pre">
                    {JSON.stringify({
                      block_id:      block.id,
                      timestamp:     block.timestamp,
                      previous_hash: block.previous_hash,
                      data_hash:     block.data_hash,
                      block_hash:    block.block_hash,
                      analysis:      block.analysis,
                    }, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HashRow({ label, value, full = false }) {
  return (
    <div className="hash-row">
      <span className="hash-label">{label}</span>
      <code className={`hash-value ${full ? "hash-full" : ""}`}>{value}</code>
    </div>
  );
}