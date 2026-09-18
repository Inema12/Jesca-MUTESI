import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import StatusMessage from "../components/StatusMessage";

export default function CourseDetails() {
  const { id } = useParams(); // Extract the dynamic ID from the URL path
  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });

  // Cyber Minimalist & Dark Neon Brand Palette matching your style profiles
  const colors = {
    bgCanvas: "#0f172a",        
    brandNeon: "#10b981",       
    textPrimary: "#f8fafc",     
    textMuted: "#94a3b8",       
    border: "#334155",          
    cardBg: "#1e293b",          
    tagBg: "#064e3b"
  };

  useEffect(() => { 
    setStatus({ loading: true, error: "" }); 
    
    // FETCHING THE LOCAL COURSE API ENDPOINT EXACTLY
    // Notice the correct forward slashes (/) separating the path parameters and variables!
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then((response) => { 
        if (!response.ok) throw new Error("Course information profile not found."); 
        return response.json(); 
      })
      .then((data) => {
        // Handle whether your backend returns { course } wrapped or the raw item object
        setCourse(data.course || data); 
      })
      .catch((error) => setStatus({ loading: false, error: error.message }))
      .finally(() => setStatus((current) => ({ ...current, loading: false }))); 
  }, [id]);

  if (status.loading) return <section style={{ backgroundColor: colors.bgCanvas, minHeight: '100vh', padding: '40px' }}><Loader label="Fetching course metrics..." /></section>;
  if (status.error) return <section style={{ backgroundColor: colors.bgCanvas, minHeight: '100vh', padding: '40px' }}><StatusMessage>{status.error}</StatusMessage></section>;

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
        to="/courses"
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
        &lt;- Back to course catalogue
      </Link>
      
      {course && (
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span 
              className="tag"
              style={{ 
                backgroundColor: colors.tagBg, 
                color: colors.brandNeon, 
                padding: "4px 10px", 
                borderRadius: "4px", 
                fontSize: "11px", 
                fontWeight: "bold", 
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              {course.category}
            </span>
            <span style={{ color: colors.brandNeon, fontWeight: "bold", fontSize: "18px" }}>
              {Number(course.price).toLocaleString()} RWF
            </span>
          </div>

          <h1 style={{ margin: "0 0 12px 0", color: colors.textPrimary, fontSize: "32px", lineHeight: "1.2" }}>
            {course.title}
          </h1>
          
          <p style={{ color: colors.textMuted, margin: "0 0 24px 0", fontSize: "15px", lineHeight: "1.6" }}>
            {course.description}
          </p>

          <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: colors.textMuted }}>Course reference code: #{course.id}</span>
            <span style={{ fontSize: "13px", color: colors.textMuted }}>Status: Self-paced access</span>
          </div>
        </article>
      )}
    </section>
  );
}
