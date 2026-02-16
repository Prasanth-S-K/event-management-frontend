// root\client\src\pages\MyRegistrations.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Styles/MyRegistrations.css";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await API.get("/api/registrations/me", {
          // const res = await API.get("/api/registrations/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegistrations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="my-registrations-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-registrations-container">
      <div className="header-section">
        <h2>My Registrations</h2>
        <div className="stats-container">
          <div className="stat-card">
            <h3>{registrations.length}</h3>
            <p>Total Registrations</p>
          </div>
          <div className="stat-card">
            <h3>{new Set(registrations.map((r) => r.event._id)).size}</h3>
            <p>Unique Events</p>
          </div>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>You haven't registered for any events yet.</p>
          <button className="back-button" onClick={() => navigate("/events")}>
            ← Browse Events
          </button>
        </div>
      ) : (
        <>
          <div className="registrations-grid">
            {registrations.map((reg, index) => (
              <div
                key={reg._id}
                className="registration-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <h4>{reg.event.name}</h4>
                  <div className="registration-date">
                    <span>📅</span>
                    Registered: {formatDate(reg.createdAt || new Date())}
                  </div>
                  <span className="status-badge confirmed">Confirmed</span>
                </div>

                <div className="card-body">
                  <p className="event-description">{reg.event.description}</p>

                  <div className="event-details">
                    {reg.event.date && (
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>Event Date: {formatDate(reg.event.date)}</span>
                      </div>
                    )}
                    {reg.event.location && (
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span>{reg.event.location}</span>
                      </div>
                    )}
                    {reg.event.category && (
                      <div className="detail-item">
                        <span className="detail-icon">🏷️</span>
                        <span>{reg.event.category}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    className="view-details-btn"
                    onClick={() => navigate(`/events/${reg.event._id}`)}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="back-button" onClick={() => navigate("/events")}>
            ← Back to Events
          </button>
        </>
      )}
    </div>
  );
};

export default MyRegistrations;
