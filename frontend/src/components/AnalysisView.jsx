const SEV_CLASS = {
  CRITICAL: "sev-critical",
  HIGH:     "sev-high",
  MEDIUM:   "sev-medium",
  LOW:      "sev-low",
};

export default function AnalysisView({ analysis }) {
  if (!analysis) return null;

  // Ensure analysis is treated as an array (for backwards compatibility if needed)
  const threats = Array.isArray(analysis) ? analysis : [analysis];

  // If the AI found 0 threats (all traffic is healthy)
  if (threats.length === 0) {
    return (
      <div className="card badge-success" style={{ padding: "2rem", textAlign: "center", border: "1px solid var(--success)" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>✓ No Threats Detected</h3>
        <p>The uploaded log dump contains only healthy or benign traffic.</p>
      </div>
    );
  }

  return (
    <div className="threats-container" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {threats.map((threat, index) => {
        const sevClass = SEV_CLASS[threat.severity] || "sev-medium";

        return (
          <div key={index} className="analysis-view card">
            <div className="card-header" style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              <h3 className="card-title">Threat #{index + 1}: {threat.attack_type}</h3>
              <span className={`badge ${sevClass}`}>{threat.severity}</span>
            </div>

            {/* Summary metrics */}
            <div className="metrics-grid">
              <MetricCard label="Confidence"    value={threat.confidence} />
              <MetricCard label="MITRE ATT&CK"  value={threat.mitre_attack || "N/A"} mono />
<<<<<<< HEAD
              <MetricCard label="Rule Matched"  value={threat.rule_matched || "N/A"} mono />
=======
              <MetricCard label="Rule Matched"  value={threat.rule_matched} mono />
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
              <MetricCard label="Severity"      value={threat.severity} className={sevClass} />
            </div>

            {/* Attack vector */}
            <Section label="Attack Vector">
<<<<<<< HEAD
              <p className="body-text">{threat.attack_vector || "Not available"}</p>
=======
              <p className="body-text">{threat.attack_vector}</p>
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
            </Section>

            {/* Two-column grid */}
            <div className="two-col">
              <Section label="Indicators of Compromise">
                <BulletList items={threat.indicators} accent="danger" />
              </Section>
              <Section label="Affected Systems">
<<<<<<< HEAD
                {(threat.affected_systems || []).map((s, i) => (
=======
                {threat.affected_systems.map((s, i) => (
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
                  <div key={i} className="tag">{s}</div>
                ))}
              </Section>
            </div>

            {/* Historical context */}
            <Section label="Historical Context & Insights" accent="info">
              <p className="body-text">{threat.historical_context}</p>
            </Section>

            {/* Actions */}
            <div className="two-col">
              <Section label="Immediate Actions">
                <NumberedList items={threat.immediate_actions} accent="danger" />
              </Section>
              <Section label="Long-Term Solutions">
                <NumberedList items={threat.long_term_solutions} accent="success" />
              </Section>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MetricCard({ label, value, className = "", mono = false }) {
  return (
    <div className={`metric-card ${className}`}>
      <span className="metric-label">{label}</span>
      <span className={`metric-value ${mono ? "mono" : ""}`}>{value}</span>
    </div>
  );
}

function Section({ label, accent, children }) {
  return (
    <div className={`section ${accent ? `section-${accent}` : ""}`}>
      <p className="section-label">{label}</p>
      {children}
    </div>
  );
}

function BulletList({ items }) {
  if (!items || items.length === 0) return <p className="body-text">None</p>;
  return (
    <ul className="bullet-list">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function NumberedList({ items, accent }) {
  if (!items || items.length === 0) return <p className="body-text">None</p>;
  return (
    <ol className={`numbered-list numbered-${accent}`}>
      {items.map((item, i) => (
        <li key={i}>
          <span className="num">{i + 1}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}