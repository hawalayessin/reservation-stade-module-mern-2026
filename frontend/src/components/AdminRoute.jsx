import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  if (!isAdmin) {
    return <Navigate to="/stadiums" replace />;
  }


  return children;
}

export default AdminRoute;
