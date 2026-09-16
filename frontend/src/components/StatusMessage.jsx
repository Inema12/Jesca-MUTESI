export default function StatusMessage({ type = "error", children }) {
  return <div className={`status-message ${type}`}>{children}</div>;
}
