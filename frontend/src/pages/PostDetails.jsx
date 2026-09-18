import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import StatusMessage from "../components/StatusMessage";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });

  // Consistent Brand Color Palette
  const colors = {
    bgCanvas: "#fcfbf7",        // Light warm cream background
    brandGreen: "#1f4e3d",      // Premium deep forest green for accent links
    textPrimary: "#1e293b",     // Deep charcoal slate for headers
    textMuted: "#475569",       // Muted slate gray for standard body layout copy
    border: "#cbd5e1",          // Silver line border
    cardBg: "#ffffff",          // Clean white surface box
    tagBg: "#e8f0ec",           // Soft light green hue tint for the post badge indicator
  };

  useEffect(() => { 
    setStatus({ loading: true, error: "" }); 
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((response) => { 
        if (!response.ok) throw new Error("Post not found"); 
        return response.json(); 
      })
      .then(setPost)
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
      {/* Dynamic Back Control Navigation Link */}
      <Link 
        className="quiet-link" 
        to="/posts"
        style={{ 
          color: colors.brandGreen, 
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
        &lt;- Back to posts
      </Link>

      {status.error && <StatusMessage>{status.error}</StatusMessage>}
      
      {status.loading ? (
        <Loader label="Fetching post" />
      ) : (
        post && (
          <article 
            className="detail-card"
            style={{ 
              backgroundColor: colors.cardBg, 
              border: `1px solid ${colors.border}`, 
              padding: "40px", 
              borderRadius: "12px", 
              maxWidth: "700px", 
              margin: "0 auto",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
            }}
          >
            {/* Post ID Badge Element */}
            <span 
              className="post-number"
              style={{ 
                backgroundColor: colors.tagBg, 
                color: colors.brandGreen, 
                padding: "4px 10px", 
                borderRadius: "4px", 
                fontSize: "12px", 
                fontWeight: "bold", 
                display: "inline-block", 
                marginBottom: "16px",
                letterSpacing: "0.5px"
              }}
            >
              POST {post.id}
            </span>

            {/* Post Header Title */}
            <h1 
              style={{ 
                margin: "0 0 16px 0", 
                color: colors.textPrimary, 
                fontSize: "32px", 
                lineHeight: "1.25",
                textTransform: "capitalize"
              }}
            >
              {post.title}
            </h1>

            {/* Post Main Body Paragraph Content */}
            <p 
              style={{ 
                margin: "0", 
                color: colors.textMuted, 
                fontSize: "16px", 
                lineHeight: "1.7" 
              }}
            >
              {post.body}
            </p>
          </article>
        )
      )}
    </section>
  );
}
