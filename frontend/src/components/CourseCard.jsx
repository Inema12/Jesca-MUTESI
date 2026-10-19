import { useState } from "react";
import { enrollmentApi } from "../api";
import { useAuth } from "../context/AuthContext";
import StatusMessage from "./StatusMessage";

// CHANGED: import images from src/assets/images (replace with YOUR real filenames)
import smallImg from "../assets/image/re.jpg";
import largeImg from "../assets/image/re.jpg";

// CHANGED: added priority prop
export default function CourseCard({ course, isEnrolled = false, priority = false }) {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: false, message: "", type: "" });

  // UNCHANGED: enroll logic
  async function enroll() {
    if (!user) {
      setState({ loading: false, message: "Please log in before enrolling.", type: "error" });
      return;
    }
    setState({ loading: true, message: "", type: "" });
    try {
      const result = await enrollmentApi.enroll(course.id);
      setState({ loading: false, message: result.message, type: "success" });
    } catch (error) {
      const prefix = error.status === 401 ? "Your session has expired. " : error.status === 409 ? "Already enrolled. " : "";
      setState({ loading: false, message: prefix + error.message, type: "error" });
    }
  }

  const enrolled = isEnrolled || state.type === "success";

  return (
    <article className={`course-card${enrolled ? " enrolled" : ""}`}>
      {/* CHANGED: image block */}
      <div className="course-media">
        <img
          src={course.image || smallImg}
          srcSet={course.image ? undefined : `${smallImg} 480w, ${largeImg} 1200w`}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          width="800"
          height="450"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          alt={`${course.title} course`}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = smallImg; }}
        />
      </div>
      <div className="course-topline">
        <span className="tag">{course.category}</span>
        <span className="price">{Number(course.price).toLocaleString()} RWF</span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="course-footer">
        <span className="muted">{enrolled ? "Enrolled" : "Self-paced course"}</span>
        <button className="button small" onClick={enroll} disabled={state.loading || enrolled}>
          {state.loading ? "Enrolling..." : enrolled ? "Enrolled" : "Enroll"}
        </button>
      </div>
      {state.message && <StatusMessage type={state.type}>{state.message}</StatusMessage>}
    </article>
  );
}