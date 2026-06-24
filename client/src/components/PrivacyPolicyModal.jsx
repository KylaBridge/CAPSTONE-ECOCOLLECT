import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./styles/PrivacyPolicyModal.css";

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Find all focusable elements
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when opening
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab: if on first element, wrap to last
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    modalElement.addEventListener("keydown", handleTabKey);
    return () => {
      modalElement.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("ppm-modal-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="ppm-modal-overlay"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="ppm-modal-container"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        {/* Header */}
        <div className="ppm-modal-header">
          <div className="ppm-modal-title-group">
            <h2 id="privacy-modal-title">Privacy Policy</h2>
            <p className="ppm-modal-subtitle">Last Updated: June 2026</p>
          </div>
          <button
            className="ppm-modal-close-x"
            onClick={onClose}
            aria-label="Close Privacy Policy Modal"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="ppm-modal-body">
          <section className="ppm-modal-section">
            <h3>Introduction</h3>
            <p>
              EcoCollect is an academic capstone project developed by students of
              the College of Computing and Information Technologies (CCIT) at
              National University. The platform supports electronic waste
              collection, monitoring, and environmental awareness initiatives.
            </p>
            <p>
              We are committed to protecting your personal information and
              handling it responsibly in accordance with the Data Privacy Act of
              2012 (Republic Act No. 10173).
            </p>
          </section>

          <section className="ppm-modal-section">
            <h3>Information We Collect</h3>
            <p>We may collect:</p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Contact number (if applicable)</li>
              <li>Account credentials for authentication</li>
              <li>Profile information voluntarily provided by users</li>
              <li>Photos and details submitted as part of e-waste collection requests</li>
              <li>Device, browser, and system usage information</li>
              <li>Login activity and system logs</li>
            </ul>
          </section>

          <section className="ppm-modal-section">
            <h3>How We Use Your Information</h3>
            <p>Collected information may be used to:</p>
            <ul>
              <li>Create and manage user accounts</li>
              <li>Authenticate users and secure platform access</li>
              <li>Process e-waste collection requests</li>
              <li>Verify submitted information and uploaded materials</li>
              <li>Communicate account and collection updates</li>
              <li>Monitor system performance and security</li>
              <li>Generate academic and research-related reports</li>
              <li>Support environmental awareness initiatives</li>
            </ul>
          </section>

          <section className="ppm-modal-section">
            <h3>Information Sharing</h3>
            <p>EcoCollect does not sell, rent, or trade personal information.</p>
            <p>Information may only be disclosed:</p>
            <ul>
              <li>To authorized project members, advisers, and administrators</li>
              <li>To National University offices when required for project evaluation</li>
              <li>When required by law</li>
              <li>To protect the security and integrity of the platform</li>
            </ul>
            <p>Where possible, reports will use anonymized or aggregated data.</p>
          </section>

          <section className="ppm-modal-section">
            <h3>Data Security</h3>
            <p>
              EcoCollect implements reasonable organizational, physical, and
              technical safeguards to protect personal information against
              unauthorized access, disclosure, alteration, misuse, or loss.
            </p>
            <p>Security measures may include:</p>
            <ul>
              <li>Authentication and access controls</li>
              <li>Secure cloud-hosted infrastructure</li>
              <li>Restricted administrative access</li>
              <li>System monitoring and maintenance</li>
            </ul>
            <p>
              While reasonable efforts are taken to secure data, no internet-based
              system can guarantee absolute security.
            </p>
          </section>

          <section className="ppm-modal-section">
            <h3>Data Retention</h3>
            <p>Personal information is retained only as long as necessary for:</p>
            <ul>
              <li>Project operations</li>
              <li>Academic requirements</li>
              <li>Legal obligations</li>
            </ul>
            <p>Information may be securely deleted, anonymized, or archived when no longer needed.</p>
          </section>

          <section className="ppm-modal-section">
            <h3>Your Rights</h3>
            <p>
              Under the Data Privacy Act of 2012, users may exercise the
              following rights:
            </p>
            <ul>
              <li>Right to be informed</li>
              <li>Right to access personal information</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to object where applicable</li>
              <li>Right to request deletion subject to limitations</li>
              <li>Right to data portability where feasible</li>
              <li>Right to file a complaint regarding privacy concerns</li>
            </ul>
          </section>

          <section className="ppm-modal-section ppm-modal-contact-section">
            <h3>Contact Information</h3>
            <p><strong>API Team</strong></p>
            <p>College of Computing and Information Technologies (CCIT)</p>
            <p>National University</p>
            <p>
              Email:{" "}
              <a href="mailto:ecocollectnu@gmail.com" className="ppm-modal-mail-link">
                ecocollectnu@gmail.com
              </a>
            </p>
            <p className="ppm-modal-address">
              <strong>Address:</strong>
              <br />
              National University
              <br />
              551 M.F. Jhocson Street
              <br />
              Sampaloc, Manila
            </p>
          </section>

          <div className="ppm-modal-full-link-container">
            <Link to="/privacy" className="ppm-modal-full-link" onClick={onClose}>
              View the complete Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
