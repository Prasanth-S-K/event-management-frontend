// root\client\src\pages\EditEvent.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Styles/EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isAuthenticated = !!token;

  const fetchEvent = async () => {
    try {
      setLoading(true);
      // const res = await API.get(`/events/${id}`);
      const res = await API.get(`/api/events/${id}`);
      const eventData = res.data;
      setEvent(eventData);

      if (userId && eventData.registeredUsers?.includes(userId)) {
        setRegistered(true);
      } else {
        setRegistered(false);
      }
      setError("");
    } catch (err) {
      setError("Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      alert("Please login to register for events");
      navigate("/login");
      return;
    }

    setActionLoading(true);
    try {
      // await API.post(
      //   `/registrations/${id}`,
      //   {},
      //   { headers: { Authorization: `Bearer ${token}` } },
      await API.post(
        `/api/registrations/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRegistered(true);
      await fetchEvent();
      alert("✅ Successfully registered for the event!");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your registration?")) {
      return;
    }

    setActionLoading(true);
    try {
      // await API.delete(`/registrations/${event._id}`, {
      //   headers: { Authorization: `Bearer ${token}` },
      await API.delete(`/api/registrations/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistered(false);
      await fetchEvent();
      alert("✅ Registration cancelled successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      // await API.delete(`/events/${id}`);
      await API.delete(`/api/events/${id}`);
      alert("✅ Event deleted successfully");
      navigate("/events");
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  const viewRegistrations = () => {
    navigate(`/event-registrations/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const capacityPercentage = event
    ? (event.registeredCount / event.capacity) * 100
    : 0;
  const isFull = event?.registeredCount >= event?.capacity;

  if (loading) {
    return (
      <div className="event-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-details-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error</h2>
          <p>{error}</p>
          <button className="back-button" onClick={() => navigate("/events")}>
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-container">
        <div className="not-found-container">
          <div className="not-found-icon">🔍</div>
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist or has been removed.</p>
          <button className="back-button" onClick={() => navigate("/events")}>
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <div className="navigation-bar">
        <button className="back-button" onClick={() => navigate("/events")}>
          ← Back to Events
        </button>
        {event.category && (
          <span className="event-badge">{event.category}</span>
        )}
      </div>

      <div className="event-header">
        <h2>{event.title || event.name}</h2>
        {event.organizer && (
          <p style={{ color: "#666", marginTop: "0.5rem" }}>
            Organized by <strong>{event.organizer}</strong>
          </p>
        )}
      </div>

      <div className="event-info-grid">
        <div className="info-card">
          <span className="info-icon">📅</span>
          <div className="info-label">Date & Time</div>
          <div className="info-value">{formatDate(event.dateTime)}</div>
        </div>

        <div className="info-card">
          <span className="info-icon">📍</span>
          <div className="info-label">Location</div>
          <div className="info-value">{event.location || "TBD"}</div>
        </div>

        <div className="info-card">
          <span className="info-icon">👥</span>
          <div className="info-label">Capacity</div>
          <div className="info-value capacity">{event.capacity} people</div>
        </div>

        <div className="info-card">
          <span className="info-icon">✅</span>
          <div className="info-label">Registered</div>
          <div className="info-value registered">
            {event.registeredCount} attendees
          </div>
        </div>
      </div>

      <div className="capacity-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="progress-stats">
          <span>{event.registeredCount} registered</span>
          <span>{event.capacity - event.registeredCount} spots left</span>
        </div>
      </div>

      {event.description && (
        <div className="event-description">
          <h3>
            <span>📝</span> About This Event
          </h3>
          <p>{event.description}</p>
        </div>
      )}

      {isAuthenticated && (
        <div className="action-buttons">
          {registered ? (
            <button
              className="cancel-button"
              onClick={handleCancel}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>⏳ Cancelling...</>
              ) : (
                <>❌ Cancel Registration</>
              )}
            </button>
          ) : (
            <button
              className="register-button"
              onClick={handleRegister}
              disabled={isFull || actionLoading}
            >
              {actionLoading ? (
                <>⏳ Registering...</>
              ) : isFull ? (
                <>🔒 Event Full</>
              ) : (
                <>✅ Register Now</>
              )}
            </button>
          )}
        </div>
      )}

      {event.createdBy === userId && (
        <div className="admin-controls">
          <h3>
            <span>⚙️</span> Admin Controls
            <span className="admin-badge">Event Owner</span>
          </h3>
          <div className="admin-button-group">
            <button
              className="edit-button"
              onClick={() => navigate(`/edit-event/${id}`)}
            >
              ✏️ Edit Event
            </button>
            <button
              className="view-registrations-button"
              onClick={viewRegistrations}
            >
              👥 View Registrations
            </button>
            <button className="delete-button" onClick={handleDelete}>
              🗑️ Delete Event
            </button>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            padding: "1rem",
            background: "#f8f9fa",
            borderRadius: "10px",
          }}
        >
          <p style={{ color: "#666" }}>
            <span>🔐</span> Please{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#667eea",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              login
            </span>{" "}
            to register for this event.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
