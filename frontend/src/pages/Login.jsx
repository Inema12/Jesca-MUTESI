import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusMessage from "../components/StatusMessage";

export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" }); const [status, setStatus] = useState({ loading: false, error: "" });
  async function submit(event) { event.preventDefault(); setStatus({ loading: true, error: "" }); try { await login(form); navigate(location.state?.from?.pathname || "/dashboard", { replace: true }); } catch (error) { setStatus({ loading: false, error: error.message }); } }
  return <section className="auth-page"><div className="auth-copy"><span className="eyebrow">Welcome back</span><h1>Your next chapter starts <i>here.</i></h1><p>Pick up where you left off and keep moving forward.</p></div><form className="form-card" onSubmit={submit}><h2>Log in</h2><p className="muted">Access your learning dashboard.</p>{status.error && <StatusMessage>{status.error}</StatusMessage>}<label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label><label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label><button className="button full" disabled={status.loading}>{status.loading ? "Logging in..." : "Log in"}</button><p className="form-foot">New to CodeBridge? <Link to="/register">Create an account</Link></p></form></section>;
}
