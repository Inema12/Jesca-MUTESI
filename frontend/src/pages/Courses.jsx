import { useEffect, useState } from "react";
import { courseApi, enrollmentApi } from "../api";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import StatusMessage from "../components/StatusMessage";

export default function Courses() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ search: "", category: "", sort: "", page: 1, limit: 6 });
  const [result, setResult] = useState({ courses: [], totalPages: 1, total: 0 });
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [categories, setCategories] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  // Cyber Minimalist Theme Configurations Map
  const colors = {
    bgCanvas: "#f8fafc",        
    brandNeon: "#10b981",       
    textPrimary: "#0f172a",     
    textMuted: "#94a3b8",       
    border: "#334155",          
    cardBg: "#364a6b"           
  };

  useEffect(() => {
    let active = true;
    setStatus({ loading: true, error: "" });
    courseApi.list(filters)
      .then((data) => { if (active) { setResult(data); setCategories((current) => current.length ? current : [...new Set(data.courses.map((course) => course.category))]); } })
      .catch((error) => active && setStatus({ loading: false, error: error.message }))
      .finally(() => active && setStatus((current) => ({ ...current, loading: false })));
    return () => { active = false; };
  }, [filters]);

  useEffect(() => {
    if (!user) {
      setEnrolledCourseIds([]);
      return;
    }
    enrollmentApi.mine()
      .then(({ courses }) => setEnrolledCourseIds(courses.map((course) => course.id)))
      .catch(() => setEnrolledCourseIds([]));
  }, [user]);

  function updateFilter(event) { setFilters((current) => ({ ...current, [event.target.name]: event.target.value, page: 1 })); }
  function changePage(page) { setFilters((current) => ({ ...current, page })); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return (
    <section className="page-wrap" style={{ backgroundColor: colors.bgCanvas, padding: '40px 20px', minHeight: '100vh', fontFamily: 'sans-serif' , minWidth: '100%'}}>
      
      {/* 1. Header Information Container */}
      <div className="page-heading split" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${colors.border}`, paddingBottom: '24px', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="eyebrow" style={{ textTransform: 'uppercase', color: colors.brandNeon, fontWeight: 'bold', letterSpacing: '1.5px', fontSize: '13px' }}>
            The course catalogue
          </span>
          <h1 style={{ color: colors.textPrimary, margin: '8px 0', fontSize: '32px' }}>
            Build skills that <i style={{ color: colors.brandNeon, fontStyle: "normal" }}>travel.</i>
          </h1>
          <p style={{ color: colors.textMuted, margin: '0', fontSize: '16px' }}>
            Practical paths for the next version of your career.
          </p>
        </div>
        
        {/* Total Available Stats Display Badge */}
        <div className="stat-block" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, padding: '16px 24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)' }}>
          <strong style={{ display: 'block', fontSize: '36px', color: colors.brandNeon, lineHeight: '1' }}>{result.total}</strong>
          <span style={{ fontSize: '12px', color: colors.textMuted, textTransform: 'uppercase', fontWeight: '600' }}>courses available</span>
        </div>
      </div>

      {/* 2. Interactive Search & Dropdown Filter Row Bar */}
      <div className="filter-bar" style={{ display: 'flex', gap: '16px', backgroundColor: colors.cardBg, padding: '20px', borderRadius: '8px', border: `1px solid ${colors.border}`, marginBottom: '30px', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)' }}>
        
        <label className="search-field" style={{ flex: '2', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: colors.textMuted }}>Search courses</span>
          <input 
            name="search" 
            value={filters.search} 
            onChange={updateFilter} 
            placeholder="Try React, database..." 
            style={{ padding: '10px 12px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgCanvas, color: colors.textPrimary, fontSize: '14px', outline: 'none' }}
          />
        </label>
        
        <label style={{ flex: '1', minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: colors.textMuted }}>Category</span>
          <select name="category" value={filters.category} onChange={updateFilter} style={{ padding: '10px 12px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgCanvas, color: colors.textPrimary, fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        
        <label style={{ flex: '1', minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: colors.textMuted }}>Sort by</span>
          <select name="sort" value={filters.sort} onChange={updateFilter} style={{ padding: '10px 12px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgCanvas, color: colors.textPrimary, fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
            <option value="">Most recent</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </label>
      </div>

      {/* 3. Conditional Layout Rendering Pipeline */}
      {status.error && <StatusMessage>{status.error}</StatusMessage>}
      
      {status.loading ? (
        <Loader label="Loading courses" />
      ) : result.courses.length ? (
        <>
          {/* Main Content Grid Output */}
          <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {result.courses.map((course) => (
              <CourseCard key={course.id} course={course} isEnrolled={enrolledCourseIds.includes(course.id)} />
            ))}
          </div>

          {/* Lower Pagination Component Controller Navigation bar */}
          <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '20px 0', borderTop: `1px solid ${colors.border}` }}>
            <button 
              className="button ghost" 
              disabled={filters.page <= 1} 
              onClick={() => changePage(filters.page - 1)}
              style={{ padding: '10px 20px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: filters.page <= 1 ? colors.border : colors.cardBg, color: colors.textPrimary, cursor: filters.page <= 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
            >
              Previous
            </button>
            
            <span style={{ color: colors.textMuted, fontSize: '15px' }}>
              Page <strong style={{ color: colors.brandNeon }}>{filters.page}</strong> of {result.totalPages}
            </span>
            
            <button 
              className="button ghost" 
              disabled={filters.page >= result.totalPages} 
              onClick={() => changePage(filters.page + 1)}
              style={{ padding: '10px 20px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: filters.page >= result.totalPages ? colors.border : colors.cardBg, color: colors.textPrimary, cursor: filters.page >= result.totalPages ? 'not-allowed' : 'pointer', fontWeight: '600' }}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <EmptyState title="No courses found">Try a broader search or clear one of your filters.</EmptyState>
      )}
    </section>
  );
}
