import { useEffect, useState } from "react";
import { api } from "../api/client";
import AuditChain from "../components/AuditChain";

export default function ChainPage({ chain: localChain, chainIntact: localIntact }) {
  const [chain, setChain]       = useState(localChain);
  const [intact, setIntact]     = useState(localIntact);
  const [loading, setLoading]   = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const fetchChain = async () => {
    setLoading(true);
    try {
      const [blocks, verification] = await Promise.all([api.getChain(), api.verifyChain()]);
      setChain(blocks);
      setIntact(verification.intact);
      setLastSync(new Date().toLocaleTimeString());
    } catch { /* fallback to local state */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchChain(); }, []);

  return (
    <div className="page-single">
      <div className="page-header" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <h1 className="page-title">Audit Chain</h1>
          <p className="page-sub">
            Every analysis is stored as a SHA-256 hash-chained block.
            Tampering with any entry breaks all subsequent hashes.
          </p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
          <button className="btn btn-sm" onClick={fetchChain} disabled={loading}>
            {loading ? "Syncing…" : "↻ Refresh"}
          </button>
          {lastSync && <span style={{ fontSize:"0.7rem", color:"var(--muted)" }}>Last sync {lastSync}</span>}
        </div>
      </div>
      <AuditChain chain={chain} chainIntact={intact} />
    </div>
  );
}
