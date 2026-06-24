import React, { useEffect, useRef } from "react";
import "./styles/TermsOfUseModal.css";

const TermsOfUseModal = ({ isOpen, onClose }) => {
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
    if (e.target.classList.contains("tou-modal-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="tou-modal-overlay"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="tou-modal-container"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
        {/* Header */}
        <div className="tou-modal-header">
          <div className="tou-modal-title-group">
            <h2 id="terms-modal-title">Terms of Use</h2>
            <p className="tou-modal-subtitle">Last Updated: June 2026</p>
          </div>
          <button
            className="tou-modal-close-x"
            onClick={onClose}
            aria-label="Close Terms of Use Modal"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="tou-modal-body">
          <section className="tou-modal-section">
            <h3>Acceptance of Terms</h3>
            <p>
              By creating an account or using EcoCollect, users agree to comply
              with these terms. If you do not agree, you should not access or use
              the platform.
            </p>
          </section>

          <section className="tou-modal-section">
            <h3>Authorized Use</h3>
            <p>Users agree to:</p>
            <ul>
              <li>Provide accurate account information.</li>
              <li>Use the platform only for lawful purposes.</li>
              <li>Submit truthful e-waste collection information.</li>
              <li>Protect their account credentials.</li>
            </ul>
          </section>

          <section className="tou-modal-section">
            <h3>Prohibited Activities</h3>
            <p>Users must not:</p>
            <ul>
              <li>Attempt unauthorized access to the system.</li>
              <li>Upload malicious files or harmful content.</li>
              <li>Impersonate another individual.</li>
              <li>Submit fraudulent collection requests.</li>
              <li>Interfere with system operations.</li>
            </ul>
          </section>

          <section className="tou-modal-section">
            <h3>Intellectual Property</h3>
            <p>
              EcoCollect, including its content, interface designs, and source
              code, remains the intellectual property of the project developers
              and National University where applicable.
            </p>
          </section>

          <section className="tou-modal-section">
            <h3>Limitation of Liability</h3>
            <p>
              EcoCollect is an academic project provided on an "as available"
              basis. While reasonable efforts are made to maintain accuracy and
              availability, the project team does not guarantee uninterrupted
              service.
            </p>
          </section>

          <section className="tou-modal-section">
            <h3>Termination</h3>
            <p>
              The project team reserves the right to suspend or terminate
              accounts that violate these terms.
            </p>
          </section>

          <section className="tou-modal-section">
            <h3>Changes to Terms</h3>
            <p>
              The Terms of Use may be updated periodically and continued use of
              the platform constitutes acceptance of any revisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUseModal;
