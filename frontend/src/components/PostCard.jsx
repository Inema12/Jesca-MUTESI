import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return <article className="data-card post-card"><span className="post-number">{String(post.id).padStart(2, "0")}</span><h3>{post.title}</h3><p>{post.body}</p><Link className="text-link" to={`/posts/${post.id}`}>Read post <span aria-hidden="true">-&gt;</span></Link></article>;
}
