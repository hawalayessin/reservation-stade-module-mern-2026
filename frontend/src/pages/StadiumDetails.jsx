import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./StadiumDetails.css";

function StadiumDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stadium, setStadium] = useState(null);

  const [availabilities, setAvailabilities] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

 
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);


  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const userId = localStorage.getItem("userId");

 
  useEffect(() => {
    fetchStadium();
    fetchAvailabilities();
    fetchReviews();
  }, [id]);

  const fetchStadium = async () => {
    const res = await api.get(`/stadiums/${id}`);
    setStadium(res.data);
  };

  const fetchAvailabilities = async () => {
    const res = await api.get(`/availabilities/stadium/${id}`);
    setAvailabilities(res.data);
  };

  const fetchReviews = async () => {
    const res = await api.get(`/reviews/stadium/${id}`);
    setReviews(res.data);
  };

  const handleReservation = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      setError("Veuillez choisir un créneau");
      toast.error("Veuillez choisir un créneau");
      return;
    }

    try {
      await api.post("/reservations", {
        stadium: id,
        availability: selectedSlot,
      });

      setSuccess("Réservation effectuée avec succès");
      toast.success("Réservation effectuée avec succès");
      setTimeout(() => navigate("/reservations"), 1500);
    } catch {
      setError("Erreur lors de la réservation");
      toast.error("Erreur lors de la réservation");
    }
  };


  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview}`, {
          rating,
          comment,
        });
        toast.success("Avis modifié avec succès");
      } else {
        await api.post("/reviews", {
          stadium: id,
          rating,
          comment,
        });
        toast.success("Avis ajouté avec succès");
      }

      setRating(5);
      setComment("");
      setEditingReview(null);
      fetchReviews();
    } catch {
      alert("Erreur lors de l’envoi de l’avis");
      toast.error("Erreur lors de l’envoi de l’avis");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Supprimer votre avis ?")) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Avis supprimé"); 
      fetchReviews();
    } catch {
      toast.error("Erreur lors de la suppression de l’avis"); 
    }
  };

  const handleAnalyzeReviews = async () => {
    try {
      setLoadingAI(true);
      setAiAnalysis("");

      const res = await api.post(`/ai/analyze-reviews/${id}`);
      setAiAnalysis(res.data.analysis);
      toast.success("Analyse IA terminée");
    } catch {
      setAiAnalysis("Erreur lors de l’analyse des avis par l’IA");
      toast.error("Erreur lors de l’analyse des avis par l’IA");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="details-container">
        {stadium && (
          <div className="details-card">
            <h2>{stadium.name}</h2>
            <p>
              <strong>Location :</strong> {stadium.location}
            </p>
            <p>
              <strong>Type :</strong> {stadium.type}
            </p>
            <p>
              <strong>Prix :</strong> {stadium.pricePerHour} DT / heure
            </p>

            <h3>Réserver un créneau</h3>

            {availabilities.length === 0 && <p>Aucun créneau disponible</p>}

            {availabilities.length > 0 && (
              <form onSubmit={handleReservation} className="reservation-form">
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  required
                >
                  <option value="">-- Choisir un créneau --</option>
                  {availabilities.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.date} | {a.startTime} - {a.endTime}
                    </option>
                  ))}
                </select>

                <button type="submit">Réserver</button>
              </form>
            )}

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

         
            <div className="review-buttons">
              <button
                className="review-toggle"
                onClick={() => setShowReviews(!showReviews)}
              >
                {showReviews ? "Fermer les avis" : "Voir / Ajouter un avis"}
              </button>

              <button
                className="review-toggle ai"
                onClick={handleAnalyzeReviews}
                disabled={reviews.length === 0}
              >
                🧠 Analyser les avis (IA)
              </button>
            </div>

            {loadingAI && <p>Analyse des avis en cours...</p>}

            {aiAnalysis && (
              <div className="ai-result">
                <div className="ai-header">🧠 Analyse IA des avis</div>
                <div className="ai-content">{aiAnalysis}</div>
              </div>
            )}

            {showReviews && (
              <div className="reviews-section">
                <h3>Avis des utilisateurs</h3>

                {reviews.length === 0 && <p>Aucun avis pour ce stade</p>}

                {reviews.map((r) => (
                  <div key={r._id} className="review-card">
                    <p>
                      <strong>{r.user.username}</strong> — ⭐ {r.rating}/5
                    </p>
                    <p>{r.comment}</p>

                    {r.user._id === userId && (
                      <div className="review-actions">
                        <button
                          onClick={() => {
                            setEditingReview(r._id);
                            setRating(r.rating);
                            setComment(r.comment);
                          }}
                        >
                          Modifier
                        </button>
                        <button onClick={() => handleDeleteReview(r._id)}>
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <form onSubmit={handleReviewSubmit} className="review-form">
                  <h4>
                    {editingReview
                      ? "Modifier votre avis"
                      : "Ajouter un avis"}
                  </h4>

                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="1">⭐</option>
                  </select>

                  <textarea
                    placeholder="Votre commentaire"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />

                  <button type="submit">
                    {editingReview ? "Modifier" : "Envoyer"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StadiumDetails;
