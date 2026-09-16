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
  useEffect(() => { fetch("https://jsonplaceholder.typicode.com/posts").then((response) => { if (!response.ok) throw new Error("Could not load posts"); return response.json(); }).then((data) => { setPosts(data); setFilteredPosts(data); }).catch((error) => setStatus({ loading: false, error: error.message })).finally(() => setStatus((current) => ({ ...current, loading: false }))); }, []);
  useEffect(() => { const query = searchTerm.toLowerCase(); setFilteredPosts(posts.filter((post) => post.title.toLowerCase().includes(query))); }, [searchTerm, posts]);
  return <section className="page-wrap"><div className="page-heading split"><div><span className="eyebrow">JSONPlaceholder / posts</span><h1>Practice the <i>request.</i></h1><p>Search a live collection, then open a dynamic detail route.</p></div><Link className="quiet-link" to="/users">View users -&gt;</Link></div><label className="wide-search"><span>Search posts by title</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search posts..." /></label>{status.error && <StatusMessage>{status.error}</StatusMessage>}{status.loading ? <Loader label="Fetching posts" /> : <><p className="result-count">Showing {filteredPosts.length} of {posts.length} posts</p><div className="card-grid">{filteredPosts.map((post) => <PostCard key={post.id} post={post} />)}</div></>}</section>;
}
