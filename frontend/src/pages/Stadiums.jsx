import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Stadiums.css';
import Navbar from '../components/Navbar';

function Stadiums() {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const res = await api.get('/stadiums');
        setStadiums(res.data);
        setLoading(false);
      } catch {
        setError('Erreur lors du chargement des stades');
        setLoading(false);
      }
    };

    fetchStadiums();
  }, []);

  return (
    <>
      <Navbar />
    <div className="stadiums-container">
      <div className="stadiums-content">
        <div className="stadiums-header">
          <h1>Nos Stades</h1>
          <p>Découvrez et réservez votre stade préféré</p>
        </div>

        {loading && (
          <div className="loading-message">
            Chargement des stades...
          </div>
        )}

        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        
        {!loading && !error && stadiums.length === 0 && (
          <div className="no-stadiums">
            Aucun stade disponible
          </div>
        )}

        {!loading && !error && stadiums.length > 0 && (
          <div className="stadiums-grid">
            {stadiums.map((stadium) => (
              <div key={stadium._id} className="stadium-card">
                <h3>{stadium.name}</h3>

                <div className="stadium-info">
                  <p>
                    📍 Ville : <span>{stadium.location}</span>
                  </p>
                  <p>
                    🏟️ Type : <span>{stadium.type}</span>
                  </p>
                  <p>
                    💰 Prix / heure : <span>{stadium.pricePerHour} DT</span>
                  </p>
                </div>

                <Link
                  to={`/stadiums/${stadium._id}`}
                  className="stadium-button"
                >
                  Voir les créneaux
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div></>
  );
}

export default Stadiums;
