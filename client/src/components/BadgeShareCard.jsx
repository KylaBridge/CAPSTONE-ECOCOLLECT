//badge certificate card that shows when you download a badge
import React from "react";
import { createPortal } from "react-dom";
import "./styles/BadgeShareCard.css";
import Badge1 from "../assets/badges/current-badge.png";
import ECOBADGEBackground from "../assets/ECOBADGE_background.png";

const BadgeShareCard = ({
  user,
  selectedBadge,
  shareCardRef,
  isVisible = false,
  isDownloading = false,
}) => {
  // Keep the card rendered in the DOM so it can be measured and captured.
  // When visible, show as a centered overlay; when hidden, keep it
  // at the document origin with zero opacity so html2canvas can measure it.

  const badgeImage = selectedBadge?.image
    ? typeof selectedBadge.image === "string"
      ? selectedBadge.image.startsWith("http")
        ? selectedBadge.image
        : `${import.meta.env.VITE_API_URL}/${selectedBadge.image}`
      : `${import.meta.env.VITE_API_URL}/${selectedBadge.image.path}`
    : selectedBadge?.img || Badge1;

    const containerStyle = isVisible
      ? {
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          background: "rgba(0,0,0,0.4)",
          pointerEvents: "auto",
        }
      : {
          // Render offscreen so it never affects page layout or creates whitespace
          position: "fixed",
          left: "-10000px",
          top: "-10000px",
          opacity: 1,
          pointerEvents: "none",
          zIndex: -1,
        };

    const card = (
      <div style={containerStyle}>
        <div
          ref={shareCardRef}
          className={`share-card-template ${isDownloading ? 'download-mode' : ''}`}
          style={{
            background: `url(${ECOBADGEBackground}) no-repeat center center/cover`,
          }}
        >
          <div className="share-card-content">
            <div className="share-card-header">
              <h1>CONGRATULATIONS</h1>
              <div className="username">
                {user?.name || user?.username || user?.email}
              </div>
              <p>You've unlocked a new Badge!</p>
            </div>

            <div className="share-card-badge-section">
              <img
                src={badgeImage}
                alt={selectedBadge?.name}
                className="share-card-badge"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Badge1;
                }}
              />
              <h2 className="badge-title">{selectedBadge?.name}</h2>
              <div className="badge-details">
                <p className="badge-description">
                  {selectedBadge?.description ||
                    selectedBadge?.milestoneCondition}
                </p>
                <p className="badge-date">
                  Date Earned: {" "}
                  {selectedBadge?.dateEarned
                    ? new Date(selectedBadge.dateEarned).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                </p>
              </div>
            </div>

            <div className="share-card-footer">
              <p
                style={{
                  color: "#284c42",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                EcoCollect - Making a Difference Together
              </p>
            </div>
          </div>
        </div>
      </div>
    );

    if (typeof document !== "undefined") {
      return createPortal(card, document.body);
    }

    return card;
  }
  
export default BadgeShareCard;
