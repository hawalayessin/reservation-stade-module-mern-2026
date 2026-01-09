import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [stadiums, setStadiums] = useState([]);
  const [editingStadium, setEditingStadium] = useState(null);
  const [stadiumForm, setStadiumForm] = useState({
    name: "",
    location: "",
    type: "",
    pricePerHour: "",
  });

  
  const [selectedStadium, setSelectedStadium] = useState("");
  const [availabilities, setAvailabilities] = useState([]);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [availabilityForm, setAvailabilityForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });


  useEffect(() => {
    fetchStadiums();
  }, []);

  const fetchStadiums = async () => {
    try {
      const res = await api.get("/stadiums");
      setStadiums(res.data);
    } catch {
      toast.error("Erreur lors du chargement des stades");
    }
  };

  const fetchAvailabilities = async (stadiumId) => {
    try {
      const res = await api.get(`/availabilities/admin/stadium/${stadiumId}`);
      setAvailabilities(res.data);
    } catch {
      toast.error("Erreur lors du chargement des créneaux");
    }
  };

  const handleStadiumSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStadium) {
        await api.put(`/stadiums/${editingStadium}`, stadiumForm);
        toast.success("Stade modifié avec succès");
      } else {
        await api.post("/stadiums", stadiumForm);
        toast.success("Stade créé avec succès");
      }

      setEditingStadium(null);
      setStadiumForm({
        name: "",
        location: "",
        type: "",
        pricePerHour: "",
      });

      fetchStadiums();
    } catch {
      toast.error("Erreur lors de l’enregistrement du stade");
    }
  };

  const handleDeleteStadium = async (id) => {
    if (!window.confirm("Supprimer ce stade ?")) return;

    try {
      await api.delete(`/stadiums/${id}`);
      toast.success("Stade supprimé");
      fetchStadiums();
    } catch {
      toast.error("Erreur lors de la suppression du stade");
    }
  };


  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();

    if (!selectedStadium) return;

    try {
      if (editingAvailability) {
        await api.put(
          `/availabilities/${editingAvailability}`,
          availabilityForm
        );
        toast.success("Créneau modifié avec succès");
      } else {
        await api.post("/availabilities", {
          stadium: selectedStadium,
          ...availabilityForm,
        });
        toast.success("Créneau créé avec succès");
      }

      setEditingAvailability(null);
      setAvailabilityForm({ date: "", startTime: "", endTime: "" });
      fetchAvailabilities(selectedStadium);
    } catch {
      toast.error("Erreur lors de l’enregistrement du créneau");
    }
  };

  const handleDeleteAvailability = async (id) => {
    if (!window.confirm("Supprimer ce créneau ?")) return;

    try {
      await api.delete(`/availabilities/${id}`);
      toast.success("Créneau supprimé");
      fetchAvailabilities(selectedStadium);
    } catch {
      toast.error("Erreur lors de la suppression du créneau");
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        <section className="admin-section">
          <h2>Gestion des stades</h2>

          <form onSubmit={handleStadiumSubmit}>
            <input
              placeholder="Nom"
              value={stadiumForm.name}
              onChange={(e) =>
                setStadiumForm({ ...stadiumForm, name: e.target.value })
              }
              required
            />
            <input
              placeholder="Location"
              value={stadiumForm.location}
              onChange={(e) =>
                setStadiumForm({ ...stadiumForm, location: e.target.value })
              }
              required
            />
            <input
              placeholder="Type"
              value={stadiumForm.type}
              onChange={(e) =>
                setStadiumForm({ ...stadiumForm, type: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Prix / heure"
              value={stadiumForm.pricePerHour}
              onChange={(e) =>
                setStadiumForm({
                  ...stadiumForm,
                  pricePerHour: e.target.value,
                })
              }
              required
            />
            <button>{editingStadium ? "Modifier" : "Créer"}</button>
          </form>

          {stadiums.map((s) => (
            <div key={s._id} className="admin-item">
              <span>{s.name}</span>
              <button
                onClick={() => {
                  setEditingStadium(s._id);
                  setStadiumForm(s);
                }}
              >
                Modifier
              </button>
              <button onClick={() => handleDeleteStadium(s._id)}>
                Supprimer
              </button>
            </div>
          ))}
        </section>

    
        <section className="admin-section">
          <h2>Gestion des créneaux</h2>

          <select
            value={selectedStadium}
            onChange={(e) => {
              setSelectedStadium(e.target.value);
              fetchAvailabilities(e.target.value);
            }}
            required
          >
            <option value="">-- Choisir un stade --</option>
            {stadiums.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          {selectedStadium && (
            <>
              <form onSubmit={handleAvailabilitySubmit}>
                <input
                  type="date"
                  value={availabilityForm.date}
                  onChange={(e) =>
                    setAvailabilityForm({
                      ...availabilityForm,
                      date: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="time"
                  value={availabilityForm.startTime}
                  onChange={(e) =>
                    setAvailabilityForm({
                      ...availabilityForm,
                      startTime: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="time"
                  value={availabilityForm.endTime}
                  onChange={(e) =>
                    setAvailabilityForm({
                      ...availabilityForm,
                      endTime: e.target.value,
                    })
                  }
                  required
                />
                <button>
                  {editingAvailability ? "Modifier" : "Créer"}
                </button>
              </form>

              {availabilities.length === 0 && (
                <p>Aucun créneau trouvé</p>
              )}

              {availabilities.map((a) => (
                <div key={a._id} className="admin-item">
                  <span>
                    {a.date} | {a.startTime} - {a.endTime}
                    <span
                      className={
                        a.isAvailable
                          ? "badge available"
                          : "badge reserved"
                      }
                    >
                      {a.isAvailable ? "Disponible" : "Réservé"}
                    </span>
                  </span>

                  <button
                    onClick={() => {
                      setEditingAvailability(a._id);
                      setAvailabilityForm({
                        date: a.date,
                        startTime: a.startTime,
                        endTime: a.endTime,
                      });
                    }}
                  >
                    Modifier
                  </button>
                  <button onClick={() => handleDeleteAvailability(a._id)}>
                    Supprimer
                  </button>
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default AdminDashboard;
