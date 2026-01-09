import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext"; 

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      login({
        token: res.data.token,
        user: res.data.user,
      });

      toast.success("Connexion réussie");
      navigate("/stadiums");
    } catch {
      setError("Email ou mot de passe incorrect");
      toast.error("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="login-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        <p className="login-link">
          Vous n’avez pas de compte ?{" "}
          <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
