import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Background glowing effects */}
      <div className="glow-blob top-left"></div>
      <div className="glow-blob bottom-right"></div>

      {/* --- NEW: Top Right Navigation --- */}
      <nav className="landing-nav">
        <Link to="/login" className="nav-link-btn">Sign In</Link>
        <Link to="/signup" className="nav-link-btn primary">Create Account</Link>
      </nav>

      <div className="landing-content">
        <div className="hero-section">
          <div className="badge-pill">v2.0 Cloud-Ready SIEM</div>
          <h1 className="hero-title">
            Intelligent Threat Triage <br />
            <span className="text-gradient">Powered by AI.</span>
          </h1>
          <p className="hero-subtitle">
            Instantly analyze massive network logs, detect anomalies, and secure your findings in an immutable, cryptographically verifiable audit chain.
          </p>
          
          <Link to="/login" className="btn-launch">
            Launch Triage-O-Matic
            <span className="arrow">→</span>
          </Link>
        </div>

        <div className="features-grid">
          <div className="feature-card">
<<<<<<< HEAD
            <div className="feature-icon"></div>
            <h3>Automated AI Analysis</h3>
            <p>Paste logs in any format — raw text, JSON, CSV, or system logs. The AI intelligently filters out healthy noise and extracts critical threats in milliseconds.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"></div>
=======
            <div className="feature-icon">🧠</div>
            <h3>Automated AI Analysis</h3>
            <p>Paste raw JSON arrays containing mixed network traffic. The AI intelligently filters out healthy noise and extracts critical threats in milliseconds.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⛓️</div>
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
            <h3>Immutable Audit Log</h3>
            <p>Every analysis is hashed using SHA-256 and cryptographically chained to the previous event. Your threat intelligence data cannot be tampered with or retroactively altered.</p>
          </div>
          <div className="feature-card">
<<<<<<< HEAD
            <div className="feature-icon"></div>
=======
            <div className="feature-icon">🛡️</div>
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
            <h3>Zero-Trust Security</h3>
            <p>Designed for modern defense. All data is processed locally and stored in a secure SQLite vault, ensuring complete visibility and accountability.</p>
          </div>
        </div>
      </div>
    </div>
  );
}