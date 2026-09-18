import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import StatusMessage from "../components/StatusMessage";

export default function Register() {
  const navigate = useNavigate(); 
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirmPassword: "" }); 
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  
  // Cyber Minimalist & Dark Neon Brand Palette
  const colors = {
    bgCanvas: "#0f172a",       
    brandNeon: "#10b981",      
    textPrimary: "#f8fafc",     
    textMuted: "#94a3b8",      
    border: "#334155",          
    cardBg: "#1e293b",          
  };

  function validate() { 
    if (!form.full_name.trim()) return "Name is required."; 
    if (form.password.length < 6) return "Password must be at least 6 characters."; 
    if (form.password !== form.confirmPassword) return "Passwords do not match."; 
    return ""; 
  }

  async function submit(event) { 
    event.preventDefault(); 
    const validationError = validate(); 
    if (validationError) return setStatus({ loading: false, error: validationError, success: "" }); 
    setStatus({ loading: true, error: "", success: "" }); 
    try { 
      const result = await authApi.register({ full_name: form.full_name, email: form.email, password: form.password }); 
      setStatus({ loading: false, error: "", success: result.message }); 
      setTimeout(() => navigate("/login"), 900); 
    } catch (error) { 
      setStatus({ loading: false, error: error.message, success: "" }); 
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
      {/* 1. Left Side Copy Hero Brand Introduction */}
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
          Start learning
        </span>
        <h1 style={{ fontSize: "42px", color: colors.textPrimary, margin: "0 0 16px 0", lineHeight: "1.2" }}>
          Make room for <i style={{ color: colors.brandNeon, fontStyle: "normal", textShadow: `0 0 10px rgba(16, 185, 129, 0.2)` }}>better work.</i>
        </h1>
        <p style={{ color: colors.textMuted, fontSize: "16px", margin: "0", lineHeight: "1.6" }}>
          Create your learner account and find a course with a clear next step.
        </p>
      </div>

      {/* 2. Right Side Interactive Registration Card Container */}
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
          <h2 style={{ margin: "0 0 6px 0", color: colors.textPrimary, fontSize: "28px", fontWeight: "700" }}>Create account</h2>
          <p className="muted" style={{ margin: "0 0 24px 0", color: colors.textMuted, fontSize: "14px" }}>
            Your learning path begins with the basics.
          </p>

          {status.error && <StatusMessage>{status.error}</StatusMessage>}
          {status.success && <StatusMessage type="success">{status.success}</StatusMessage>}

          {/* Full Name Input field label block */}
          <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", fontWeight: "600", fontSize: "14px", color: colors.textPrimary }}>
            Full name
            <input 
              value={form.full_name} 
              onChange={(event) => setForm({ ...form, full_name: event.target.value })} 
              required 
              style={{ padding: "12px", borderRadius: "6px", border: `1px solid ${colors.border}`, backgroundColor: colors.bgCanvas, color: colors.textPrimary, fontSize: "15px", outline: "none", fontWeight: "normal", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = colors.brandNeon}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </label>

          {/* Email Input field label block */}
          <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", fontWeight: "600", fontSize: "14px", color: colors.textPrimary }}>
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

          {/* Password Input field label block */}
          <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", fontWeight: "600", fontSize: "14px", color: colors.textPrimary }}>
            Password
            <input 
              type="password" 
              minLength="6" 
              value={form.password} 
              onChange={(event) => setForm({ ...form, password: event.target.value })} 
              required 
              style={{ padding: "12px", borderRadius: "6px", border: `1px solid ${colors.border}`, backgroundColor: colors.bgCanvas, color: colors.textPrimary, fontSize: "15px", outline: "none", fontWeight: "normal", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = colors.brandNeon}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </label>

          {/* Password Confirmation field label block */}
          <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px", fontWeight: "600", fontSize: "14px", color: colors.textPrimary }}>
            Confirm password
            <input 
              type="password" 
              value={form.confirmPassword} 
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} 
              required 
              style={{ padding: "12px", borderRadius: "6px", border: `1px solid ${colors.border}`, backgroundColor: colors.bgCanvas, color: colors.textPrimary, fontSize: "15px", outline: "none", fontWeight: "normal", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = colors.brandNeon}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </label>

          {/* Submission Action CTA Execution Button */}
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
            {status.loading ? "Creating account..." : "Create account"}
          </button>

          {/* Bottom redirection flow direction layout foot link line options */}
          <p className="form-foot" style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: colors.textMuted, marginBottom: "0" }}>
            Already registered?{" "}
            <Link to="/login" style={{ color: colors.brandNeon, textDecoration: "none", fontWeight: "bold" }} onMouseEnter={(e) => e.target.style.textDecoration = "underline"} onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
