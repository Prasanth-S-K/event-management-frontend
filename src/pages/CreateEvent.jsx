// pages/CreateEvent.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Styles/CreateEvents.css";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dateTime: "",
    organizer: "",
    location: "",
    capacity: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const categories = [
    "Conference",
    "Workshop",
    "Seminar",
    "Meetup",
    "Webinar",
    "Networking",
    "Training",
    "Other",
  ];

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
  };

  const handleCategorySelect = (category) => {
    setFormData({
      ...formData,
      category: category,
    });
  };

  const validateForm = () => {
    const errors = {};

    if (formData.name.length < 3) {
      errors.name = "Event name must be at least 3 characters";
    }

    if (formData.description.length < 20) {
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // await API.post("/events", formData);
      await API.post("/api/events", formData);
      alert("Event created successfully!");
      navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <div className="header-section">
        <h1>Create New Event</h1>
        <p className="header-subtitle">
          Fill in the details to create an amazing event
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="input-group">
            <label>
              <i>📅</i> Event Name *
            </label>
            <input
              type="text"
              name="name"
              className={`input-field ${fieldErrors.name ? "error" : ""}`}
              placeholder="e.g., Tech Conference 2024"
              onChange={handleChange}
              value={formData.name}
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
              <i>👤</i> Organizer *
            </label>
            <input
              type="text"
              name="organizer"
              className="input-field"
              placeholder="e.g., John Doe or Company Name"
              onChange={handleChange}
              value={formData.organizer}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>
              <i>📍</i> Location *
            </label>
            <input
              type="text"
              name="location"
              className="input-field"
              placeholder="e.g., New York, NY"
              onChange={handleChange}
              value={formData.location}
              required
            />
          </div>

          <div className="input-group">
            <label>
              <i>⏰</i> Date & Time *
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              className={`input-field ${fieldErrors.dateTime ? "error" : ""}`}
              onChange={handleChange}
              value={formData.dateTime}
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
            <i>📝</i> Description *
          </label>
          <textarea
            name="description"
            className={`input-field ${fieldErrors.description ? "error" : ""}`}
            placeholder="Describe your event in detail..."
            onChange={handleChange}
            value={formData.description}
            required
            maxLength="500"
          />
          {fieldErrors.description && (
            <div className="field-error">
              <span>⚠️</span> {fieldErrors.description}
            </div>
          )}
          <div
            className={`char-counter ${formData.description.length > 450 ? "warning" : formData.description.length > 480 ? "danger" : ""}`}
          >
            {formData.description.length}/500
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>
              <i>👥</i> Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              className={`input-field ${fieldErrors.capacity ? "error" : ""}`}
              placeholder="e.g., 100"
              onChange={handleChange}
              value={formData.capacity}
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
              <i>🏷️</i> Category *
            </label>
            <input
              type="text"
              name="category"
              className="input-field"
              placeholder="Select or type category"
              onChange={handleChange}
              value={formData.category}
              required
              list="categories"
            />
            <datalist id="categories">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="category-tags">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`category-tag ${formData.category === cat ? "selected" : ""}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="button-group">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/events")}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Creating...
              </>
            ) : (
              "✨ Create Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
