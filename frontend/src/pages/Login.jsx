import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusMessage from "../components/StatusMessage";

export default function Login() {
  const { login } = useAuth(); 
  const navigate = useNavigate(); 
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" }); 
  const [status, setStatus] = useState({ loading: false, error: "" });

  // Cyber Minimalist & Dark Neon Brand Palette
  const colors = {
    bgCanvas: "#0f172a",        // Rich deep slate/black main canvas backdrop
    brandNeon: "#10b981",       // Electric emerald/neon green accent color for call-to-actions
    textPrimary: "#f8fafc",     // Crisp bright off-white for highly readable text headlines
    textMuted: "#94a3b8",       // Slate gray for subtle description subtitles and input placeholders
    border: "#334155",          // Muted dark silver border for sleek input structures
    cardBg: "#1e293b"           // Solid dark charcoal gray for form card panels
  };

  async function submit(event) { 
    event.preventDefault(); 
    setStatus({ loading: true, error: "" }); 
    try { 
      await login(form); 
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true }); 
    } catch (error) { 
      setStatus({ loading: false, error: error.message }); 
    } 
  }

  return (
    <section 
      className="auth-page" 
      style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        minHeight: "100vh", 
        backgroundColor: colors.bgCanvas, 
        fontFamily: "sans-serif" 
      }}
    >
      {/* 1. Left Side Branding Hero Intro Block */}
      <div 
        className="auth-copy" 
        style={{ 
          flex: "1", 
          minWidth: "300px", 
          padding: "60px 40px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center",
          maxWidth: "600px",
          margin: "0 auto"
        }}
      >
        <span className="eyebrow" style={{ textTransform: "uppercase", color: colors.brandNeon, fontWeight: "bold", letterSpacing: "1.5px", fontSize: "13px", marginBottom: "12px", display: "block" }}>
          Welcome back
        </span>
        <h1 style={{ fontSize: "42px", color: colors.textPrimary, margin: "0 0 16px 0", lineHeight: "1.2" }}>
          To CodeBridge  <i style={{ color: colors.brandNeon, fontStyle: "normal", textShadow: `0 0 10px rgba(16, 185, 129, 0.2)` }}>Academy</i>
        </h1>
        <p style={{ color: colors.textMuted, fontSize: "16px", margin: "0", lineHeight: "1.6" }}>
          Pick up where you left off and keep moving forward.
        </p>
      </div>

      {/* 2. Right Side Interactive Form Card Container */}
      <div 
        style={{ 
          flex: "1", 
          minWidth: "320px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "40px 20px" 
        }}
      >
        <form 
          className="form-card" 
          onSubmit={submit}
          style={{ 
            backgroundColor: colors.cardBg, 
            border: `1px solid ${colors.border}`, 
            padding: "40px", 
            borderRadius: "12px", 
            width: "100%", 
            maxWidth: "400px", 
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" 
          }}
        >
          <h2 style={{ margin: "0 0 6px 0", color: colors.textPrimary, fontSize: "28px", fontWeight: "700" }}>Log in</h2>
          <p className="muted" style={{ margin: "0 0 24px 0", color: colors.textMuted, fontSize: "14px" }}>
            Access your learning dashboard.
          </p>

          {status.error && <StatusMessage>{status.error}</StatusMessage>}

          {/* Email input field wrapper element */}
          <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px", fontWeight: "600", fontSize: "14px", color: colors.textPrimary }}>
            Email
            <input 
              type="email" 
              value={form.email} 
              onChange={(event) => setForm({ ...form, email: event.target.value })} 
              required 
              style={{ padding: "12px", borderRadius: "6px", border: `1px solid ${colors.border}`, backgroundColor: colors.bgCanvas, color: colors.textPrimary, fontSize: "15px", outline: "none", fontWeight: "normal", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = colors.brandNeon}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </label>

          {/* Password input field wrapper element */}
          <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px", fontWeight: "600", fontSize: "14px", color: colors.textPrimary }}>
            Password
            <input 
              type="password" 
              value={form.password} 
              onChange={(event) => setForm({ ...form, password: event.target.value })} 
              required 
              style={{ padding: "12px", borderRadius: "6px", border: `1px solid ${colors.border}`, backgroundColor: colors.bgCanvas, color: colors.textPrimary, fontSize: "15px", outline: "none", fontWeight: "normal", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = colors.brandNeon}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </label>

          {/* Core Submission Trigger CTA Action button element */}
          <button 
            className="button full" 
            disabled={status.loading}
            style={{ 
              width: "100%", 
              padding: "14px", 
              backgroundColor: colors.brandNeon, 
              color: "#0f172a", 
              border: "none", 
              borderRadius: "6px", 
              fontWeight: "bold", 
              fontSize: "16px", 
              cursor: status.loading ? "not-allowed" : "pointer", 
              opacity: status.loading ? 0.7 : 1,
              transition: "transform 0.1s ease, box-shadow 0.2s ease" 
            }}
            onMouseEnter={(e) => { if(!status.loading) e.target.style.boxShadow = `0 0 15px ${colors.brandNeon}`; }}
            onMouseLeave={(e) => { if(!status.loading) e.target.style.boxShadow = "none"; }}
          >
            {status.loading ? "Logging in..." : "Log in"}
          </button>

          {/* Footer Account Alternative Direction anchor elements layout text */}
          <p className="form-foot" style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: colors.textMuted, marginBottom: "0" }}>
            New to CodeBridge?{" "}
            <Link to="/register" style={{ color: colors.brandNeon, textDecoration: "none", fontWeight: "bold" }} onMouseEnter={(e) => e.target.style.textDecoration = "underline"} onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
