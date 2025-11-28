// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ children }) {
  const session = supabase.auth.getSession();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}
