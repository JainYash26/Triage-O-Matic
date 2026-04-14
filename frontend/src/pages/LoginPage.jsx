import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Login failed");
      }

      const data = await response.json();
      
      // Save the VIP pass (JWT token) to the browser
      localStorage.setItem("token", data.access_token);
      
      onLogin(); // Tell App.jsx we are logged in
      navigate("/dashboard"); // Boom, into the vault!
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="glow-blob top-left"></div>
      <div className="glow-blob bottom-right"></div>
      
      <div className="auth-card card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-sub">Sign in to access Triage-O-Matic</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="auth-input" 
              placeholder="analyst@soc.local" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="auth-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block">Sign In</button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Request Access</Link>
        </p>
      </div>
    </div>
  );
}