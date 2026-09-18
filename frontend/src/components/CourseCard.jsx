import { useState } from "react";
import { enrollmentApi } from "../api";
import { useAuth } from "../context/AuthContext";
import StatusMessage from "./StatusMessage";

export default function CourseCard({ course, isEnrolled = false }) {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: false, message: "", type: "" });
  const [showOverlay, setShowOverlay] = useState(false);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);


  const colors = {
    bgCanvas: "#0f172a",
    brandNeon: "#10b981",
    textPrimary: "#f8fafc",
    textMuted: "#94a3b8",
    border: "#334155",
    cardBg: "#1e293b",
    overlayBg: "rgba(15, 23, 42, 0.85)"
  };


  const courseChapters = course.chapters || [
    "Chapter 1: Core Fundamentals & Introduction",
    "Chapter 2: Working Environment Setup & Design Implementation",
    "Chapter 3: State Lifecycles and Practical Exercises",
    "Chapter 4: Advanced Optimizations & Real-world Delivery Workflow"
  ];

  async function enroll() {
    if (!user) {
      setState({ loading: false, message: "Please log in before enrolling.", type: "error" });
      return;
    }
    setState({ loading: true, message: "", type: "" });
    try {
      const result = await enrollmentApi.enroll(course.id);
      
      // Capture the exact timestamp string instantly upon resolution
      const dynamicTimestamp = new Date().toLocaleString();
      
      setEnrollmentDetails({
        title: course.title,
        description: course.description,
        timestamp: dynamicTimestamp,
        chapters: courseChapters
      });
      
      setState({ loading: false, message: result.message, type: "success" });
      setShowOverlay(true); // Fire up the layout window overlay modal container
    } catch (error) {
      const prefix = error.status === 401 ? "Your session has expired. " : error.status === 409 ? "Already enrolled. " : "";
      setState({ loading: false, message: prefix + error.message, type: "error" });
    }
  }

  const enrolled = isEnrolled || state.type === "success";

  return (
    <>
      <article 
        className={`course-card${enrolled ? " enrolled" : ""}`}
        style={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${enrolled ? colors.brandNeon : colors.border}`,
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          fontFamily: "sans-serif",
          boxShadow: enrolled ? `0 0 15px rgba(16, 185, 129, 0.1)` : "none"
        }}
      >
        <div className="course-topline" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="tag" style={{ backgroundColor: colors.bgCanvas, color: colors.brandNeon, padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
            {course.category}
          </span>
          <span className="price" style={{ color: colors.textPrimary, fontWeight: "bold" }}>
            {Number(course.price).toLocaleString()} RWF
          </span>
        </div>
        
        <h3 style={{ margin: "0", color: colors.textPrimary, fontSize: "18px" }}>{course.title}</h3>
        <p style={{ margin: "0", color: colors.textMuted, fontSize: "14px", lineHeight: "1.5" }}>{course.description}</p>
        
        <div className="course-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "12px", borderTop: `1px solid ${colors.border}` }}>
          <span className="muted" style={{ color: enrolled ? colors.brandNeon : colors.textMuted, fontSize: "13px", fontWeight: enrolled ? "bold" : "normal" }}>
            {enrolled ? "✓ Enrolled" : "Self-paced course"}
          </span>
          <button 
            className="button small" 
            onClick={enroll} 
            disabled={state.loading || enrolled}
            style={{
              padding: "8px 16px",
              backgroundColor: enrolled ? colors.border : colors.brandNeon,
              color: enrolled ? colors.textMuted : colors.bgCanvas,
              border: "none",
              borderRadius: "4px",
              cursor: state.loading || enrolled ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "13px"
            }}
          >
            {state.loading ? "Enrolling..." : enrolled ? "Enrolled" : "Enroll"}
          </button>
        </div>
        
        {state.message && <StatusMessage type={state.type}>{state.message}</StatusMessage>}
      </article>

      {/* Dynamic Overlay Success Div Window */}
      {showOverlay && enrollmentDetails && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: colors.overlayBg,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(6px)"
          }}
        >
          <div 
            style={{
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.brandNeon}`,
              borderRadius: "12px",
              padding: "32px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
              color: colors.textPrimary,
              fontFamily: "sans-serif"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <span style={{ color: colors.brandNeon, fontWeight: "bold", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                🎉 Enrollment Successful
              </span>
              <button 
                onClick={() => setShowOverlay(false)}
                style={{ background: "none", border: "none", color: colors.textMuted, cursor: "pointer", fontSize: "20px", fontWeight: "bold", padding: "0" }}
              >
                &times;
              </button>
            </div>

            <h2 style={{ margin: "0 0 8px 0", color: colors.textPrimary, fontSize: "24px" }}>{enrollmentDetails.title}</h2>
            <p style={{ margin: "0 0 20px 0", color: colors.textMuted, fontSize: "14px", lineHeight: "1.6" }}>{enrollmentDetails.description}</p>
            
            <div style={{ backgroundColor: colors.bgCanvas, border: `1px solid ${colors.border}`, padding: "12px 16px", borderRadius: "6px", marginBottom: "20px" }}>
              <span style={{ display: "block", fontSize: "12px", color: colors.textMuted, fontWeight: "bold", textTransform: "uppercase" }}>Registration Date & Time</span>
              <span style={{ color: colors.brandNeon, fontSize: "14px", fontWeight: "600" }}>{enrollmentDetails.timestamp}</span>
            </div>

            <h4 style={{ margin: "0 0 10px 0", color: colors.textPrimary, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Course Curriculum Chapters</h4>
            <ul style={{ margin: "0 0 24px 0", paddingLeft: "20px", color: colors.textMuted, fontSize: "14px", lineHeight: "1.8" }}>
              {enrollmentDetails.chapters.map((chap, idx) => (
                <li key={idx}>{chap}</li>
              ))}
            </ul>

            <button 
              onClick={() => setShowOverlay(false)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: colors.brandNeon,
                color: colors.bgCanvas,
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer"
              }}
            >
              Get Started Learning
            </button>
          </div>
        </div>
      )}
    </>
  );
}
