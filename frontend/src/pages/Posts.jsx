import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import StatusMessage from "../components/StatusMessage";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });

  // Cyber Minimalist & Dark Neon Brand Palette
  const colors = {
    bgCanvas: "#f8fafc",        // Rich deep slate/black canvas backdrop
    brandNeon: "#10b981",       // Electric emerald neon green accents
    textPrimary: "#0f172a",     // Crisp bright off-white for headers
    textMuted: "#94a3b8",       // Slate gray for secondary sub-labels
    border: "#334155",          // Muted dark silver structural panel rings
    cardBg: "#1e293b",          // Solid dark charcoal gray for input modules
  };

  useEffect(() => { 
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => { 
        if (!response.ok) throw new Error("Could not load posts"); 
        return response.json(); 
      })
      .then((data) => { 
        setPosts(data); 
        setFilteredPosts(data); 
      })
      .catch((error) => setStatus({ loading: false, error: error.message }))
      .finally(() => setStatus((current) => ({ ...current, loading: false }))); 
  }, []);

  useEffect(() => { 
    const query = searchTerm.toLowerCase(); 
    setFilteredPosts(posts.filter((post) => post.title.toLowerCase().includes(query))); 
  }, [searchTerm, posts]);

  return (
    <section 
      className="page-wrap"
      style={{ 
        backgroundColor: colors.bgCanvas, 
        padding: "40px 20px", 
        minHeight: "100vh", 
        fontFamily: "sans-serif" 
      }}
    >
      {/* 1. Header Information & Navigation Link Container */}
      <div 
        className="page-heading split"
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-end", 
          borderBottom: `2px solid ${colors.border}`, 
          paddingBottom: "24px", 
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        <div>
          <span className="eyebrow" style={{ textTransform: "uppercase", color: colors.brandNeon, fontWeight: "bold", letterSpacing: "1.5px", fontSize: "13px", display: "block", marginBottom: "8px" }}>
            JSONPlaceholder / posts
          </span>
          <h1 style={{ color: colors.textPrimary, margin: "0 0 8px 0", fontSize: "36px", lineHeight: "1.2" }}>
            Practice the <i style={{ color: colors.brandNeon, fontStyle: "normal" }}>request.</i>
          </h1>
          <p style={{ color: colors.textMuted, margin: "0", fontSize: "15px" }}>
            Search a live collection, then open a dynamic detail route.
          </p>
        </div>
        
        {/* View Users Link Action Trigger */}
        <Link 
          className="quiet-link" 
          to="/users"
          style={{ 
            color: colors.brandNeon, 
            textDecoration: "none", 
            fontWeight: "600", 
            fontSize: "15px",
            paddingBottom: "4px",
            transition: "opacity 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.opacity = "0.7"}
          onMouseLeave={(e) => e.target.style.opacity = "1"}
        >
          View users -&gt;
        </Link>
      </div>

      {/* 2. Full-Width Filter Search Bar Text Element Input Wrapper */}
      <label 
        className="wide-search"
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px", 
          backgroundColor: colors.cardBg, 
          padding: "20px", 
          borderRadius: "8px", 
          border: `1px solid ${colors.border}`, 
          marginBottom: "30px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.2)"
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: "bold", color: colors.textMuted }}>Search posts by title</span>
        <input 
          value={searchTerm} 
          onChange={(event) => setSearchTerm(event.target.value)} 
          placeholder="Search posts..." 
          style={{ 
            padding: "12px 14px", 
            borderRadius: "6px", 
            border: `1px solid ${colors.border}`, 
            backgroundColor: colors.bgCanvas,
            color: colors.textPrimary,
            fontSize: "15px", 
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = colors.brandNeon}
          onBlur={(e) => e.target.style.borderColor = colors.border}
        />
      </label>

      {/* 3. Dynamic Structural Data Render Output pipeline */}
      {status.error && <StatusMessage>{status.error}</StatusMessage>}
      
      {status.loading ? (
        <Loader label="Fetching posts" />
      ) : (
        <>
          {/* Active items query results count feedback indicator text */}
          <p 
            className="result-count"
            style={{ 
              color: colors.textMuted, 
              fontSize: "14px", 
              fontWeight: "600", 
              marginBottom: "16px" 
            }}
          >
            Showing {filteredPosts.length} of {posts.length} posts
          </p>
          
          {/* Main Structural Layout Grid Column Map */}
          <div 
            className="card-grid"
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
              gap: "24px" 
            }}
          >
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
