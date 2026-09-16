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

  return <section className="page-wrap"><div className="page-heading split"><div><span className="eyebrow">The course catalogue</span><h1>Build skills that <i>travel.</i></h1><p>Practical paths for the next version of your career.</p></div><div className="stat-block"><strong>{result.total}</strong><span>courses available</span></div></div><div className="filter-bar"><label className="search-field"><span>Search courses</span><input name="search" value={filters.search} onChange={updateFilter} placeholder="Try React, database..." /></label><label><span>Category</span><select name="category" value={filters.category} onChange={updateFilter}><option value="">All categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label><label><span>Sort by</span><select name="sort" value={filters.sort} onChange={updateFilter}><option value="">Most recent</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></label></div>{status.error && <StatusMessage>{status.error}</StatusMessage>}{status.loading ? <Loader label="Loading courses" /> : result.courses.length ? <><div className="course-grid">{result.courses.map((course) => <CourseCard key={course.id} course={course} isEnrolled={enrolledCourseIds.includes(course.id)} />)}</div><div className="pagination"><button className="button ghost" disabled={filters.page <= 1} onClick={() => changePage(filters.page - 1)}>Previous</button><span>Page <strong>{result.page}</strong> of {result.totalPages}</span><button className="button ghost" disabled={filters.page >= result.totalPages} onClick={() => changePage(filters.page + 1)}>Next</button></div></> : <EmptyState title="No courses found">Try a broader search or clear one of your filters.</EmptyState>}</section>;
}
