import { useState } from "react";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import AnalyzePage from "./pages/AnalyzePage";
import ChainPage from "./pages/ChainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import "./styles.css";


// --- The Route Guard Component ---
// If the user isn't logged in, kick them back to the login page!
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [chain, setChain] = useState([]);
  const [chainIntact, setChainIntact] = useState(true);
  
  // Fake authentication state (defaults to false so the app is locked!)
  // Check if they already have a token saved in their browser
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const addBlock = (block) => {
    setChain((prev) => [...prev, block]);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Public Routes (No Header) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected App Routes (With Header) */}
          <Route path="/*" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <>
                <Header chainLength={chain.length} />
                <main className="main">
                  <Routes>
                    <Route path="/dashboard" element={<AnalyzePage onNewBlock={addBlock} />} />
                    <Route path="/chain" element={<ChainPage chain={chain} chainIntact={chainIntact} />} />
                    <Route path="/docs" element={<DocsRedirect />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </main>
              </>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Redirects to FastAPI's auto-generated docs
function DocsRedirect() {
  useEffect(() => {
    window.location.href = "http://localhost:8000/docs";
  }, []);

  return <p>Redirecting to API docs…</p>;
}