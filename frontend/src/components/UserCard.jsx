export default function UserCard({ user }) {
  return <article className="data-card"><span className="eyebrow">Learner profile</span><h3>{user.name}</h3><p className="muted">@{user.username}</p><dl className="details"><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Phone</dt><dd>{user.phone}</dd></div><div><dt>Website</dt><dd>{user.website}</dd></div></dl></article>;
}
