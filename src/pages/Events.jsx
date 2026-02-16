// root\client\src\pages\Events.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Styles/Events.css";

const Events = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [filter, setFilter] = useState("all");
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await API.get(
          `/api/events?page=${currentPage}&filter=${filter}`,
        );

        console.log("Events fetched:", res.data.events);
        setEvents(res.data.events);
        setTotalPages(res.data.totalPages);
        setTotalEvents(res.data.totalEvents || res.data.events.length);
        setError("");
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, filter]);

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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isEventFull = (event) => {
    return event.registeredCount >= event.capacity;
  };

  const getCapacityPercentage = (event) => {
    return (event.registeredCount / event.capacity) * 100;
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading amazing events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <div className="header-left">
          <h1>Events</h1>
          <div className="action-buttons">
            <button
              className="primary-button"
              onClick={() => navigate("/create-event")}
            >
              <span>➕</span> Create Event
            </button>
            <button
              className="secondary-button"
              onClick={() => navigate("/my-registrations")}
            >
              <span>📋</span> My Registrations
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="stats-bar">
        <div
          className={`stat-item ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
          style={{ cursor: "pointer" }}
        >
          <span>📊</span> All Events ({totalEvents})
        </div>
        <div
          className={`stat-item ${filter === "upcoming" ? "active" : ""}`}
          onClick={() => setFilter("upcoming")}
          style={{ cursor: "pointer" }}
        >
          <span>🚀</span> Upcoming
        </div>
        <div
          className={`stat-item ${filter === "past" ? "active" : ""}`}
          onClick={() => setFilter("past")}
          style={{ cursor: "pointer" }}
        >
          <span>📅</span> Past
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No Events Found</h3>
          <p>There are no events to display at the moment.</p>
          <button
            className="primary-button"
            onClick={() => navigate("/create-event")}
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <>
          <div className="events-grid">
            {events.map((event, index) => (
              <div
                key={event._id}
                className="event-card"
                onClick={() => navigate(`/events/${event._id}`)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="event-image">
                  <span>{getInitials(event.name)}</span>
                  {event.category && (
                    <span className="event-category">{event.category}</span>
                  )}
                </div>
                <div className="event-content">
                  <h3>{event.name}</h3>
                  <p className="event-description">{event.description}</p>

                  <div className="event-meta">
                    <div className="meta-item">
                      <span>📅</span> {formatDate(event.dateTime)}
                    </div>
                    <div className="meta-item">
                      <span>📍</span> {event.location || "TBD"}
                    </div>
                    <div className="meta-item highlight">
                      <span>👥</span> {event.registeredCount}/{event.capacity}
                    </div>
                  </div>

                  <div className="event-footer">
                    <div className="capacity-indicator">
                      <span>Capacity:</span>
                      <div className="capacity-bar">
                        <div
                          className="capacity-fill"
                          style={{
                            width: `${Math.min(getCapacityPercentage(event), 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    {isEventFull(event) ? (
                      <span
                        className="registration-badge"
                        style={{ background: "#ef4444" }}
                      >
                        Full
                      </span>
                    ) : (
                      <span className="registration-badge">Available</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <span>←</span> Previous
              </button>

              <div className="page-info">
                Page <span>{currentPage}</span> of <span>{totalPages}</span>
              </div>

              <button
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next <span>→</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Events;
