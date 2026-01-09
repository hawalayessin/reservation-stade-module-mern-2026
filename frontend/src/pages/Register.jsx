import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; 
import api from "../api/axios";
import "./Login.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      toast.success("Compte créé avec succès"); 
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du compte");
      toast.error("Erreur lors de la création du compte"); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Register</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="login-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
            Register
          </button>

          <p className="login-link">
            Vous avez déjà un compte ? <Link to="/">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
