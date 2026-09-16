import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import Loader from "../components/Loader";
import StatusMessage from "../components/StatusMessage";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });
  useEffect(() => { fetch("https://jsonplaceholder.typicode.com/users").then((response) => { if (!response.ok) throw new Error("Could not load users"); return response.json(); }).then(setUsers).catch((error) => setStatus({ loading: false, error: error.message })).finally(() => setStatus((current) => ({ ...current, loading: false }))); }, []);
  return <section className="page-wrap"><div className="page-heading"><span className="eyebrow">JSONPlaceholder / users</span><h1>Meet the practice <i>cohort.</i></h1><p>A small API integration exercise: fetched, stored in state, and rendered with a reusable UserCard.</p></div>{status.error && <StatusMessage>{status.error}</StatusMessage>}{status.loading ? <Loader label="Fetching users" /> : <div className="card-grid">{users.map((user) => <UserCard key={user.id} user={user} />)}</div>}</section>;
}
