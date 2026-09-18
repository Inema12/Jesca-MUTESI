import { useEffect, useState } from "react";
import { enrollmentApi } from "../api";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import StatusMessage from "../components/StatusMessage";

export default function Dashboard() {
  const { user } = useAuth(); 
  const [courses, setCourses] = useState([]); 
  const [status, setStatus] = useState({ loading: true, error: "" });

  // Consistent Theme Color Palette Configuration
  const colors = {
    background: '#f8fafc',      
    primaryText: '#0f172a',     
    secondaryText: '#475569',   
    accentColor: '#2563eb',     
    dangerColor: '#ef4444',     
    cardBg: '#ffffff',         
    border: '#e2e8f0',        
    tagBg: '#eff6ff',           
    heroBg: '#1e293b'           
  };

  useEffect(() => { 
    enrollmentApi.mine()
      .then((data) => setCourses(data.courses))
      .catch((error) => setStatus({ loading: false, error: error.message }))
      .finally(() => setStatus((current) => ({ ...current, loading: false }))); 
  }, []);

  async function drop(courseId) { 
    try { 
      await enrollmentApi.drop(courseId); 
      setCourses((current) => current.filter((course) => course.id !== courseId)); 
    } catch (error) { 
      setStatus({ loading: false, error: error.message }); 
    } 
  }

  return (
    <section className="page-wrap" style={{ backgroundColor: colors.background, padding: '40px 20px', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 1. Dashboard Hero Banner Section */}
      <div className="dashboard-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.heroBg, color: '#ffffff', padding: '40px', borderRadius: '12px', marginBottom: '40px', flexWrap: 'wrap', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div>
          <span className="eyebrow" style={{ textTransform: 'uppercase', color: '#93c5fd', fontWeight: 'bold', letterSpacing: '1px', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Your learning dashboard
          </span>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#ffffff' }}>
            Keep going, <i style={{ color: '#93c5fd' }}>{user?.full_name?.split(" ")[0]}.</i>
          </h1>
          <p style={{ color: '#cbd5e1', margin: '0', fontSize: '14px' }}>{user?.email}</p>
        </div>
        
        {/* Total Enrolled Courses Badge */}
        <div className="learning-count" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '16px 28px', borderRadius: '8px', textAlign: 'center', backdropFilter: 'blur(4px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
          <strong style={{ display: 'block', fontSize: '40px', color: '#93c5fd', lineHeight: '1' }}>{courses.length}</strong>
          <span style={{ fontSize: '12px', color: '#e2e8f0', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>enrolled courses</span>
        </div>
      </div>

      {/* 2. Conditional State Rendering Pipelines */}
      {status.error && <StatusMessage>{status.error}</StatusMessage>}
      
      {status.loading ? (
        <Loader label="Loading your learning" />
      ) : courses.length ? (
        
        // 3. Main Enrollment List Layout Container
        <div className="enrollment-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {courses.map((course) => (
            <article 
              className="enrollment-row" 
              key={course.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flexWrap: 'wrap', gap: '20px' }}
            >
              {/* Course Title and Description Details Block */}
              <div style={{ flex: '1', minWidth: '280px' }}>
                <span className="tag" style={{ backgroundColor: colors.tagBg, color: colors.accentColor, padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '12px', textTransform: 'capitalize' }}>
                  {course.category}
                </span>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: colors.primaryText }}>
                  {course.title}
                </h3>
                <p style={{ margin: '0', color: colors.secondaryText, fontSize: '14px', lineHeight: '1.6' }}>
                  {course.description}
                </p>
              </div>

              {/* Course Meta Timestamp and Destructive Actions Block */}
              <div className="enrollment-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', minWidth: '150px', textAlign: 'right', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: colors.secondaryText, fontWeight: '500' }}>
                  Enrolled {new Date(course.enrolled_at).toLocaleDateString()}
                </span>
                <button 
                  className="text-button" 
                  onClick={() => drop(course.id)}
                  style={{ background: 'none', border: 'none', color: colors.dangerColor, cursor: 'pointer', fontWeight: '600', fontSize: '14px', padding: '4px 0', textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Drop course
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Your learning list is empty">
          Browse the catalogue and enroll in a course to see it here.
        </EmptyState>
      )}
    </section>
  );
}
