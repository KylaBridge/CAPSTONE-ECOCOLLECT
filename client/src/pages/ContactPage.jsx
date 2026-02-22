import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { contactAPI } from "../api/contact";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./styles/ContactPage.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitSuccess(false);
      return;
    }
    try {
      setSubmitting(true);
      setErrors({});
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
      };
      await contactAPI.sendContactMessage(payload);
      setSubmitSuccess(true);
      toast.success("Your message has been sent.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        "Failed to send message. Please try again later.";
      setSubmitError(msg);
      setSubmitSuccess(false);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <Navbar />

      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>Have questions about EcoCollect? We're here to help!</p>
      </div>

      <div className="contact-content">
        <div className="form-section">
          <h2>PLEASE FILL IN THE FORM BELOW</h2>
          <p className="required-text">
            * Fields marked with an asterisk are mandatory
          </p>
          {submitSuccess && (
            <div className="success-message">
              Thanks! Your message has been sent.
            </div>
          )}
          {submitError && <div className="error-banner">{submitError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter message"
                rows="4"
                required
              ></textarea>
              {errors.message && (
                <span className="error-message">{errors.message}</span>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>

        <div className="info-section">
          <div className="info-content">
            <h3>Reach Us</h3>
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <p>ecocollectnu@gmail.com</p>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <p>+63 2 8712 1900</p>
            </div>

            <h3>Location</h3>
            <div className="location-group">
              <h4>Main Office</h4>
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <p>
                  National University Manila
                  <br />
                  M.F. Jhocson Street, Sampaloc
                  <br />
                  Manila, Philippines
                </p>
              </div>
            </div>

            <div className="secured-data">
              <h3>Secured Data</h3>
              <div className="info-item">
                <p>
                  Your data is protected and will only be used for EcoCollect
                  communications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
