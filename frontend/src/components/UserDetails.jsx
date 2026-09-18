import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import StatusMessage from "../components/StatusMessage";

export default function UserDetails() {
  const { id } = useParams(); // Extract dynamic parameter configuration identifier
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });

  // Cyber Minimalist & Dark Neon Brand Palette matching your style profiles
  const colors = {
    bgCanvas: "#0f172a",        
    brandNeon: "#10b981",       
    textPrimary: "#f8fafc",     
    textMuted: "#94a3b8",       
    border: "#334155",          
    cardBg: "#1e293b",          
    tagBg: "#064e3b",           
  };

  useEffect(() => { 
    setStatus({ loading: true, error: "" }); 
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => { 
        if (!response.ok) throw new Error("Practice user cohort profile not found"); 
        return response.json(); 
      })
      .then(setUser)
      .catch((error) => setStatus({ loading: false, error: error.message }))
      .finally(() => setStatus((current) => ({ ...current, loading: false }))); 
  }, [id]);

  return (
    <section 
      className="page-wrap detail-wrap" 
      style={{ 
        backgroundColor: colors.bgCanvas, 
        padding: "40px 20px", 
        minHeight: "100vh", 
        fontFamily: "sans-serif" 
      }}
    >
      <Link 
        className="quiet-link" 
        to="/users"
        style={{ 
          color: colors.brandNeon, 
          textDecoration: "none", 
          fontWeight: "600",
          fontSize: "14px",
          display: "inline-block",
          marginBottom: "24px",
          transition: "opacity 0.2s"
        }}
        onMouseEnter={(e) => e.target.style.opacity = "0.7"}
        onMouseLeave={(e) => e.target.style.opacity = "1"}
      >
        &lt;- Back to cohort directory
      </Link>

      {status.error && <StatusMessage>{status.error}</StatusMessage>}
      
      {status.loading ? (
        <Loader label="Fetching profile metrics" />
      ) : (
        user && (
          <article 
            className="detail-card"
            style={{ 
              backgroundColor: colors.cardBg, 
              border: `1px solid ${colors.border}`, 
              padding: "40px", 
              borderRadius: "12px", 
              maxWidth: "600px", 
              margin: "0 auto",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
              color: colors.textPrimary
            }}
          >
            <span 
              className="post-number"
              style={{ 
                backgroundColor: colors.tagBg, 
                color: colors.brandNeon, 
                padding: "4px 10px", 
                borderRadius: "4px", 
                fontSize: "11px", 
                fontWeight: "bold", 
                display: "inline-block", 
                marginBottom: "16px",
                letterSpacing: "1px",
                textTransform: "uppercase"
              }}
            >
              COHORT MEMBER #{user.id}
            </span>

            <h1 style={{ margin: "0 0 6px 0", color: colors.textPrimary, fontSize: "32px" }}>
              {user.name}
            </h1>
            <p style={{ color: colors.brandNeon, margin: "0 0 24px 0", fontSize: "15px", fontStyle: "italic" }}>
              @{user.username}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: `1px solid ${colors.border}`, paddingTop: "24px", fontSize: "15px", lineHeight: "1.6" }}>
              <div>📧 <strong style={{ color: colors.textMuted, marginRight: "8px" }}>Email Address:</strong> {user.email}</div>
              <div>📞 <strong style={{ color: colors.textMuted, marginRight: "8px" }}>Phone Connection:</strong> {user.phone}</div>
              <div>🌐 <strong style={{ color: colors.textMuted, marginRight: "8px" }}>Personal Website:</strong> {user.website}</div>
              <div>🏢 <strong style={{ color: colors.textMuted, marginRight: "8px" }}>Assigned Company:</strong> {user.company?.name}</div>
            </div>
          </article>
        )
      )}
    </section>
  );
}
