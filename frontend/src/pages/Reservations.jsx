import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // ✅ AJOUT UNIQUEMENT
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./Reservations.css";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get("/reservations");
        setReservations(res.data);
      } catch  {
        setError("Erreur lors du chargement des réservations");
        toast.error("Erreur lors du chargement des réservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Voulez-vous vraiment annuler cette réservation ?"
    );
    if (!confirmCancel) return;

    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
      toast.success("Réservation annulée avec succès");
    } catch  {
      toast.error("Erreur lors de l’annulation");
    }
  };

  return (
    <>
      <Navbar />

      <div className="reservations-container">
        <h1>Mes réservations</h1>

        {loading && <p>Chargement...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && reservations.length === 0 && (
          <p>Aucune réservation trouvée</p>
        )}

        {!loading && reservations.length > 0 && (
          <div className="reservations-list">
            {reservations.map((r) => (
              <div key={r._id} className="reservation-card">
                <h3>{r.stadium?.name}</h3>

                <p>
                  <strong>Date :</strong> {r.availability?.date}
                </p>

                <p>
                  <strong>Heure :</strong> {r.startTime} - {r.endTime}
                </p>

                <p>
                  <strong>Statut :</strong> {r.status}
                </p>

                <button
                  className="cancel-button"
                  onClick={() => handleCancel(r._id)}
                >
                  Annuler la réservation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Reservations;
