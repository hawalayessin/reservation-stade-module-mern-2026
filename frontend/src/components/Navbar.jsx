import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);

  const isActive = (path) =>
    location.pathname === path ? "navbar-link active" : "navbar-link";

  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  if (!isAuthenticated) return null; 

  return (
    <nav className="navbar">
      <Link to="/stadiums" className="navbar-brand">
        Stadium Reservation
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/stadiums" className={isActive("/stadiums")}>
            Stadiums
          </Link>
        </li>

        <li>
          <Link to="/reservations" className={isActive("/reservations")}>
            My Reservations
          </Link>
        </li>

      
        {isAdmin && (
          <li>
            <Link to="/admin" className={isActive("/admin")}>
              Admin
            </Link>
          </li>
        )}

        <li>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
