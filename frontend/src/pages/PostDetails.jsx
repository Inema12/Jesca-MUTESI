import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import StatusMessage from "../components/StatusMessage";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });
  useEffect(() => { setStatus({ loading: true, error: "" }); fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then((response) => { if (!response.ok) throw new Error("Post not found"); return response.json(); }).then(setPost).catch((error) => setStatus({ loading: false, error: error.message })).finally(() => setStatus((current) => ({ ...current, loading: false }))); }, [id]);
  return <section className="page-wrap detail-wrap"><Link className="quiet-link" to="/posts">&lt;- Back to posts</Link>{status.error && <StatusMessage>{status.error}</StatusMessage>}{status.loading ? <Loader label="Fetching post" /> : post && <article className="detail-card"><span className="post-number">POST {post.id}</span><h1>{post.title}</h1><p>{post.body}</p></article>}</section>;
}
