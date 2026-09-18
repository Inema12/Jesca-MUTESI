import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Posts from "./pages/Posts";
import PostDetails from "./pages/PostDetails";
import Register from "./pages/Register";
import Users from "./pages/Users";
import UserDetails from "./components/UserDetails"; 
import CourseDetails from "./components/CourseDetails"; 

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function signOut() { logout(); navigate("/login"); }
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/"><span>CodeBridge <em></em></span></NavLink>
        <nav className="nav-links">
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/posts">Practice lab</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? (
            <><span className="user-chip">{user.full_name}</span><button className="button ghost" onClick={signOut}>Logout</button></>
          ) : (
            <><NavLink className="button ghost" to="/login">Log in</NavLink><NavLink className="button" to="/register">Join now</NavLink></>
          )}
        </div>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          
          {/* Practice Directory Routing Modules */}
          <Route path="/users" element={<Users />} />
          {/* 2. 👇 ADD THIS DYNAMIC PARAMETER KEY PATH FOR INDIVIDUAL USERS BELOW 👇 */}
          <Route path="/users/:id" element={<UserDetails />} />
          
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </main>
      
      <footer>
        <span>CodeBridge Academy</span>
        <span>Learn with momentum.</span>
      </footer>
    </div>
  );
}

export default function App() { return <Layout />; }
