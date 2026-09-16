import { useEffect, useState } from "react";
import { enrollmentApi } from "../api";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import StatusMessage from "../components/StatusMessage";

export default function Dashboard() {
  const { user } = useAuth(); const [courses, setCourses] = useState([]); const [status, setStatus] = useState({ loading: true, error: "" });
  useEffect(() => { enrollmentApi.mine().then((data) => setCourses(data.courses)).catch((error) => setStatus({ loading: false, error: error.message })).finally(() => setStatus((current) => ({ ...current, loading: false }))); }, []);
  async function drop(courseId) { try { await enrollmentApi.drop(courseId); setCourses((current) => current.filter((course) => course.id !== courseId)); } catch (error) { setStatus({ loading: false, error: error.message }); } }
  return <section className="page-wrap"><div className="dashboard-hero"><div><span className="eyebrow">Your learning dashboard</span><h1>Keep going, <i>{user?.full_name?.split(" ")[0]}.</i></h1><p>{user?.email}</p></div><div className="learning-count"><strong>{courses.length}</strong><span>enrolled courses</span></div></div>{status.error && <StatusMessage>{status.error}</StatusMessage>}{status.loading ? <Loader label="Loading your learning" /> : courses.length ? <div className="enrollment-list">{courses.map((course) => <article className="enrollment-row" key={course.id}><div><span className="tag">{course.category}</span><h3>{course.title}</h3><p>{course.description}</p></div><div className="enrollment-meta"><span>Enrolled {new Date(course.enrolled_at).toLocaleDateString()}</span><button className="text-button" onClick={() => drop(course.id)}>Drop course</button></div></article>)}</div> : <EmptyState title="Your learning list is empty">Browse the catalogue and enroll in a course to see it here.</EmptyState>}</section>;
}
