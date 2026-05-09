import { Link, useLocation } from "react-router-dom";

const NAV = [
  { to: "/dashboard", label: "Analyze" },
  { to: "/chain",     label: "Audit Chain" },
<<<<<<< HEAD
  
=======
  { to: "/docs",      label: "API Docs" },
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
];

export default function Header({ chainLength = 0 }) {
  const { pathname } = useLocation();

  return (
    <header className="header">
<<<<<<< HEAD
      {/* ── CHANGE: Wrapped brand in a Link to reroute to Landing Page ── */}
      <Link to="/" className="header-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
=======
      <div className="header-brand">
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
        <ShieldIcon />
        <div>
          <span className="brand-name">Triage-O-Matic</span>
          <span className="brand-sub">Network Threat Detection</span>
        </div>
<<<<<<< HEAD
      </Link>
=======
      </div>
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3

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
<<<<<<< HEAD
}
=======
}
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
