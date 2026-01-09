import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Stadiums from "./pages/Stadiums";
import StadiumDetails from "./pages/StadiumDetails";
import Reservations from "./pages/Reservations";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/stadiums"
        element={
          <ProtectedRoute>
            <Stadiums />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stadiums/:id"
        element={
          <ProtectedRoute>
            <StadiumDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <Reservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
