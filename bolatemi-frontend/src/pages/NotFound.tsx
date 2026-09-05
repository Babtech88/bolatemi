import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty-state">
      <h2 style={{ marginBottom: 12 }}>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-dark" style={{ marginTop: 16 }}>Back to Home</Link>
    </div>
  );
}
