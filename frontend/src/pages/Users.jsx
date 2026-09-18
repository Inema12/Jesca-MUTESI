import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import Loader from "../components/Loader";
import StatusMessage from "../components/StatusMessage";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });

  // Consistent Brand Design Color Palette Map
  const colors = {
    bgCanvas: "#fcfbf7",        // Light warm cream background
    brandGreen: "#1f4e3d",      // Premium deep forest green accents
    textPrimary: "#1e293b",     // Sharp dark slate navy for headings
    textMuted: "#475569",       // Muted slate gray for secondary details
    border: "#cbd5e1",          // Clean silver dividing line rings
  };

  useEffect(() => { 
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => { 
        if (!response.ok) throw new Error("Could not load users"); 
        return response.json(); 
      })
      .then(setUsers)
      .catch((error) => setStatus({ loading: false, error: error.message }))
      .finally(() => setStatus((current) => ({ ...current, loading: false }))); 
  }, []);

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
      {/* 1. Header Information Heading Title Block */}
      <div 
        className="page-heading"
        style={{ 
          borderBottom: `2px solid ${colors.border}`, 
          paddingBottom: "24px", 
          marginBottom: "40px"
        }}
      >
        <span 
          className="eyebrow" 
          style={{ 
            textTransform: "uppercase", 
            color: colors.brandGreen, 
            fontWeight: "bold", 
            letterSpacing: "1px", 
            fontSize: "13px", 
            display: "block", 
            marginBottom: "8px" 
          }}
        >
          JSONPlaceholder / users
        </span>
        <h1 
          style={{ 
            color: colors.textPrimary, 
            margin: "0 0 12px 0", 
            fontSize: "36px", 
            lineHeight: "1.2" 
          }}
        >
          Meet the practice <i style={{ color: colors.brandGreen }}>cohort.</i>
        </h1>
        <p 
          style={{ 
            color: colors.textMuted, 
            margin: "0", 
            fontSize: "15px",
            lineHeight: "1.6",
            maxWidth: "700px"
          }}
        >
          A small API integration exercise: fetched, stored in state, and rendered with a reusable UserCard.
        </p>
      </div>

      {/* 2. Dynamic Structural Data Render Output Pipeline */}
      {status.error && <StatusMessage>{status.error}</StatusMessage>}
      
      {status.loading ? (
        <Loader label="Fetching users" />
      ) : (
        /* Reusable Card Item Presentation Grid Map Layout Container */
        <div 
          className="card-grid"
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "24px" 
          }}
        >
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </section>
  );
}
