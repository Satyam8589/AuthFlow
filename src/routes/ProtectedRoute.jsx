import { useAuth } from "../context";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
