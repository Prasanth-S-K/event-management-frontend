// pages/EventRegistrations.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Styles/EventRegistrations.css";

const EventRegistrations = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventDetails, setEventDetails] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // const registrationsRes = await API.get(
        //   `/registrations/${eventId}/registrations`,
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //   },
        const registrationsRes = await API.get(
          `/api/registrations/${eventId}/registrations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setRegistrations(registrationsRes.data);

        try {
          const eventRes = await API.get(`/events/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEventDetails(eventRes.data);
        } catch (err) {
          console.error("Failed to fetch event details:", err);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch registrations",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, token]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="event-registrations-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-registrations-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error</h2>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
        <div className="bottom-actions">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-registrations-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="header-section">
        <div>
          <h2>Registered Users</h2>
          {eventDetails && (
            <p style={{ color: "#666", marginTop: "0.5rem" }}>
              for {eventDetails.name}
            </p>
          )}
        </div>
        <div className="stats-card">
          <span>{registrations.length}</span>
          <p>Registered</p>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p>No users registered for this event yet.</p>
          <button className="events-button" onClick={() => navigate("/events")}>
            Browse Events →
          </button>
        </div>
      ) : (
        <>
          <div className="users-grid">
            {registrations.map((reg, index) => (
              <div
                key={reg._id}
                className="user-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="user-avatar">{getInitials(reg.user.name)}</div>
                <div className="user-info">
                  <h4>{reg.user.name}</h4>
                  <p>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    {reg.user.email}
                  </p>
                  {reg.createdAt && (
                    <div className="registration-date">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Registered: {formatDate(reg.createdAt)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bottom-actions">
            <button
              className="events-button"
              onClick={() => navigate("/events")}
            >
              ← Back to Events
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventRegistrations;
