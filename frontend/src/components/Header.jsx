import { Link, useLocation } from "react-router-dom";

const NAV = [
  { to: "/dashboard", label: "Analyze" },
  { to: "/chain",     label: "Audit Chain" },
  { to: "/docs",      label: "API Docs" },
];

export default function Header({ chainLength = 0 }) {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header-brand">
        <ShieldIcon />
        <div>
          <span className="brand-name">Triage-O-Matic</span>
          <span className="brand-sub">Network Threat Detection</span>
        </div>
      </div>

      <nav className="header-nav">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={`nav-link ${pathname === n.to ? "active" : ""}`}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="header-status">
        {chainLength > 0 && (
          <span className="badge badge-success">{chainLength} events logged</span>
        )}
      </div>
    </header>
  );
}

function ShieldIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shield-icon">
      <rect width="32" height="32" rx="8" />
      <path d="M16 5L7 9v6c0 5 4 9.5 9 11 5-1.5 9-6 9-11V9L16 5z"
        strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="15" r="2" />
      <line x1="16" y1="17" x2="16" y2="20" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
