// pages/EditEvent.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Styles/EditEvent.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    organizer: "",
    location: "",
    dateTime: "",
    description: "",
    capacity: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/events/${id}`);
        const event = res.data;

        const formattedEvent = {
          ...event,
          dateTime: event.dateTime?.slice(0, 16),
        };

        setFormData(formattedEvent);
        setOriginalData(formattedEvent);
        setError("");
      } catch (err) {
        setError("Failed to load event. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }

    if (success) {
      setSuccess("");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (formData.name.length < 3) {
      errors.name = "Event name must be at least 3 characters";
    }

    if (formData.description && formData.description.length < 20) {
      errors.description = "Description must be at least 20 characters";
    }

    if (new Date(formData.dateTime) < new Date()) {
      errors.dateTime = "Event date must be in the future";
    }

    if (formData.capacity < 1) {
      errors.capacity = "Capacity must be at least 1";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    if (JSON.stringify(formData) === JSON.stringify(originalData)) {
      setSuccess("No changes were made to the event.");
      setTimeout(() => {
        navigate(`/events/${id}`);
      }, 1500);
      return;
    }

    setSubmitting(true);

    try {
      // await API.put(`/events/${id}`, formData);
      await API.put(`/api/events/${id}`, formData);
      setSuccess("✅ Event updated successfully!");

      setOriginalData(formData);

      setTimeout(() => {
        navigate(`/events/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        // await API.delete(`/events/${id}`);
        await API.delete(`/api/events/${id}`);
        alert("Event deleted successfully!");
        navigate("/events");
      } catch (err) {
        alert("Failed to delete event");
      }
    }
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  if (loading) {
    return (
      <div className="edit-event-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-event-container">
      <div className="header-section">
        <h1>Edit Event</h1>
        <p className="header-subtitle">
          <span>Event ID: {id.slice(-6)}</span>
          Update your event details below
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <span>✅</span> {success}
        </div>
      )}

      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="input-group">
            <label>
              <i>📅</i> Event Name <span className="required-star">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${fieldErrors.name ? "error" : ""}`}
              placeholder="Enter event name"
              required
              maxLength="100"
            />
            {fieldErrors.name && (
              <div className="field-error">
                <span>⚠️</span> {fieldErrors.name}
              </div>
            )}
            <div
              className={`char-counter ${formData.name.length > 90 ? "warning" : ""}`}
            >
              {formData.name.length}/100
            </div>
          </div>

          <div className="input-group">
            <label>
              <i>👤</i> Organizer <span className="required-star">*</span>
            </label>
            <input
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter organizer name"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>
              <i>📍</i> Location <span className="required-star">*</span>
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter event location"
              required
            />
          </div>

          <div className="input-group">
            <label>
              <i>⏰</i> Date & Time <span className="required-star">*</span>
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className={`input-field ${fieldErrors.dateTime ? "error" : ""}`}
              required
            />
            {fieldErrors.dateTime && (
              <div className="field-error">
                <span>⚠️</span> {fieldErrors.dateTime}
              </div>
            )}
          </div>
        </div>

        <div className="input-group">
          <label>
            <i>📝</i> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`input-field ${fieldErrors.description ? "error" : ""}`}
            placeholder="Describe your event..."
            maxLength="500"
          />
          {fieldErrors.description && (
            <div className="field-error">
              <span>⚠️</span> {fieldErrors.description}
            </div>
          )}
          <div
            className={`char-counter ${formData.description?.length > 450 ? "warning" : formData.description?.length > 480 ? "danger" : ""}`}
          >
            {formData.description?.length || 0}/500
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>
              <i>👥</i> Capacity <span className="required-star">*</span>
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className={`input-field ${fieldErrors.capacity ? "error" : ""}`}
              placeholder="Enter maximum capacity"
              required
              min="1"
            />
            {fieldErrors.capacity && (
              <div className="field-error">
                <span>⚠️</span> {fieldErrors.capacity}
              </div>
            )}
          </div>

          <div className="input-group">
            <label>
              <i>🏷️</i> Category
            </label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter event category"
              list="categories"
            />
            <datalist id="categories">
              <option value="Conference" />
              <option value="Workshop" />
              <option value="Seminar" />
              <option value="Meetup" />
              <option value="Webinar" />
            </datalist>
          </div>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(`/events/${id}`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={submitting || !hasChanges}
          >
            {submitting ? (
              <>
                <span className="loading-spinner"></span>
                Updating...
              </>
            ) : (
              "💾 Update Event"
            )}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
          >
            🗑️ Delete Event
          </button>
        </div>

        {originalData && (
          <div className="last-updated">
            <i>🕒</i> Last updated: {new Date().toLocaleDateString()}
          </div>
        )}
      </form>
    </div>
  );
};

export default EditEvent;
