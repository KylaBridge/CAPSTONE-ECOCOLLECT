import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
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
          <p className="required-text">* Fields marked with an asterisk are mandatory</p>
          
          <form onSubmit={handleSubmit}>
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
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter message"
                rows="4"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>

        <div className="info-section">
          <div className="info-content">
            <h3>Reach Us</h3>
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <p>ecocollect@national-u.edu.ph</p>
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
                  National University Manila<br />
                  M.F. Jhocson Street, Sampaloc<br />
                  Manila, Philippines
                </p>
              </div>
            </div>

            <div className="secured-data">
              <h3>Secured Data</h3>
              <div className="info-item">
                {/* <FaShield className="info-icon" /> */}
                <p>Your data is protected and will only be used for EcoCollect communications.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
