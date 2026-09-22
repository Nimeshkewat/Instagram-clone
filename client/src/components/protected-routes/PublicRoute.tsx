import { useAuth } from "@/context/AuthContext";
import Loader from "../ui/Loader";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Loader size={30} />;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default PublicRoute;
