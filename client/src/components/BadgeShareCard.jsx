import React from "react";
import "./styles/BadgeShareCard.css";
import Badge1 from "../assets/badges/current-badge.png";
import ECOBADGEBackground from "../assets/ECOBADGE_background.png";

const BadgeShareCard = ({
  user,
  selectedBadge,
  shareCardRef,
  isVisible = false,
}) => {
  console.log("BadgeShareCard received user data:", user); // Debug log
  console.log("BadgeShareCard received badge data:", selectedBadge); // Debug log

  const badgeImage = selectedBadge?.image
    ? typeof selectedBadge.image === "string"
      ? selectedBadge.image.startsWith("http")
        ? selectedBadge.image
        : `${import.meta.env.VITE_API_URL}/${selectedBadge.image}`
      : `${import.meta.env.VITE_API_URL}/${selectedBadge.image.path}`
    : selectedBadge?.img || Badge1;

  const containerStyle = isVisible
    ? { position: "relative" }
    : { position: "absolute", left: "-9999px", top: "-9999px" };

  return (
    <div style={containerStyle}>
      <div
        ref={shareCardRef}
        className="share-card-template"
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
                Date Earned:{" "}
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
};

export default BadgeShareCard;
