import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { redemptionAPI } from "../api/redemption";
import "./styles/ValidateRedeem.css";

export default function ValidateRedeem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [redemptionData, setRedemptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [storePassword, setStorePassword] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetchRedemptionData();
  }, [id]);

  const fetchRedemptionData = async () => {
    try {
      setLoading(true);
      setValidating(true);
      const response = await redemptionAPI.getRedemptionForValidation(id);
      setRedemptionData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching redemption data:", error);
      if (error.response?.status === 404) {
        setError("Redemption not found or invalid QR code.");
      } else if (error.response?.status === 410) {
        setError("This redemption has expired.");
      } else {
        setError("Failed to load redemption details.");
      }
    } finally {
      setLoading(false);
      setValidating(false);
    }
  };

  const handleConfirmRedemption = () => {
    if (redemptionData?.status === "Claimed") {
      toast.error("This reward has already been claimed.");
      return;
    }
    if (redemptionData?.status === "Expired") {
      toast.error("This redemption has expired.");
      return;
    }
    setShowPasswordModal(true);
    setPasswordError("");
  };

  const handlePasswordSubmit = async () => {
    if (!storeEmail.trim()) {
      setPasswordError("Please enter the admin email");
      return;
    }
    if (!storePassword.trim()) {
      setPasswordError("Please enter the admin password");
      return;
    }

    setConfirming(true);
    try {
      const response = await redemptionAPI.confirmRedemption(id, {
        storeEmail: storeEmail.trim(),
        storePassword: storePassword.trim(),
      });

      if (response.status === 200) {
        setConfirmed(true);
        setShowPasswordModal(false);
        toast.success("Reward successfully redeemed!");
        // Update local state
        setRedemptionData((prev) => ({
          ...prev,
          status: "Claimed",
          claimedAt: new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error("Error confirming redemption:", error);
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        setPasswordError("Invalid admin credentials. Please try again.");
      } else if (status === 409) {
        setPasswordError("This reward has already been claimed.");
      } else {
        setPasswordError("Failed to confirm redemption. Please try again.");
      }
    } finally {
      setConfirming(false);
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setStoreEmail("");
    setStorePassword("");
    setPasswordError("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "Issued":
        return {
          text: "Ready to Claim",
          className: "validate-redeem-status-issued",
          icon: "🕒",
        };
      case "Claimed":
        return {
          text: "Successfully Claimed",
          className: "validate-redeem-status-claimed",
          icon: "✅",
        };
      case "Expired":
        return {
          text: "Expired",
          className: "validate-redeem-status-expired",
          icon: "❌",
        };
      default:
        return {
          text: status,
          className: "validate-redeem-status-unknown",
          icon: "?",
        };
    }
  };

  const isExpired = () => {
    if (!redemptionData?.expiresAt) return false;
    return new Date() > new Date(redemptionData.expiresAt);
  };

  const getTimeRemaining = () => {
    if (!redemptionData?.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(redemptionData.expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} remaining`;
    return `${minutes} minute${minutes > 1 ? "s" : ""} remaining`;
  };

  if (loading) {
    return (
      <div className="validate-redeem-container">
        <div className="validate-redeem-card">
          <div className="validate-redeem-loading">
            <div className="validate-redeem-spinner"></div>
            <p>
              {validating
                ? "Validating redemption..."
                : "Loading redemption details..."}
            </p>
            <small>Please wait while we verify your QR code</small>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="validate-redeem-container">
        <div className="validate-redeem-card">
          <div className="validate-redeem-error">
            <h2>❌ Validation Error</h2>
            <p>{error}</p>
            <button
              className="validate-redeem-btn validate-redeem-btn-secondary"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!redemptionData) {
    return (
      <div className="validate-redeem-container">
        <div className="validate-redeem-card">
          <div className="validate-redeem-error">
            <h2>❌ No Data Found</h2>
            <p>Unable to load redemption information.</p>
          </div>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(redemptionData.status);
  const timeRemaining = getTimeRemaining();
  const expired = isExpired();

  return (
    <div className="validate-redeem-container">
      <div className="validate-redeem-card">
        {/* Header */}
        <div className="validate-redeem-header">
          <h1>🎁 Reward Validation</h1>
          <div className={`validate-redeem-status ${statusDisplay.className}`}>
            <span className="validate-redeem-status-icon">
              {statusDisplay.icon}
            </span>
            <span className="validate-redeem-status-text">
              {statusDisplay.text}
            </span>
          </div>
        </div>

        {/* Reward Details */}
        <div className="validate-redeem-details">
          {redemptionData.rewardImage && (
            <div className="validate-redeem-image-container">
              <img
                src={(() => {
                  const image = redemptionData.rewardImage;

                  // Handle if image is an object with path property
                  if (typeof image === "object" && image.path) {
                    return image.path.startsWith("http")
                      ? image.path
                      : `${import.meta.env.VITE_API_URL}/${image.path}`;
                  }

                  // Handle if image is a string
                  if (typeof image === "string") {
                    return image.startsWith("http")
                      ? image
                      : `${import.meta.env.VITE_API_URL}/${image}`;
                  }

                  // Fallback - return empty to hide image
                  return "";
                })()}
                alt={redemptionData.rewardName}
                className="validate-redeem-image"
                onError={(e) => {
                  console.error("Failed to load image:", e.target.src);
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          <div className="validate-redeem-info">
            <h2 className="validate-redeem-reward-name">
              {redemptionData.rewardName}
            </h2>

            <div className="validate-redeem-info-grid">
              <div className="validate-redeem-info-item">
                <span className="validate-redeem-info-label">
                  Redemption ID:
                </span>
                <span className="validate-redeem-info-value">
                  {redemptionData.redemptionId}
                </span>
              </div>

              <div className="validate-redeem-info-item">
                <span className="validate-redeem-info-label">
                  Points Value:
                </span>
                <span className="validate-redeem-info-value">
                  {redemptionData.pointsSpent} points
                </span>
              </div>

              <div className="validate-redeem-info-item">
                <span className="validate-redeem-info-label">Issued Date:</span>
                <span className="validate-redeem-info-value">
                  {formatDate(redemptionData.redemptionDate)}
                </span>
              </div>

              <div className="validate-redeem-info-item">
                <span className="validate-redeem-info-label">Expires:</span>
                <span className="validate-redeem-info-value">
                  {formatDate(redemptionData.expiresAt)}
                </span>
              </div>

              {timeRemaining && (
                <div className="validate-redeem-info-item">
                  <span className="validate-redeem-info-label">
                    Time Remaining:
                  </span>
                  <span
                    className={`validate-redeem-info-value ${
                      expired ? "validate-redeem-expired" : ""
                    }`}
                  >
                    {timeRemaining}
                  </span>
                </div>
              )}

              {redemptionData.claimedAt && (
                <div className="validate-redeem-info-item">
                  <span className="validate-redeem-info-label">
                    Claimed Date:
                  </span>
                  <span className="validate-redeem-info-value">
                    {formatDate(redemptionData.claimedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="validate-redeem-actions">
          {confirmed ? (
            <div className="validate-redeem-success">
              <h3>✅ Reward Successfully Redeemed!</h3>
              <p>Thank you for using EcoCollect rewards system.</p>
            </div>
          ) : redemptionData.status === "Issued" && !expired ? (
            <button
              className="validate-redeem-btn validate-redeem-btn-primary"
              onClick={handleConfirmRedemption}
              disabled={validating}
            >
              {validating ? "Validating..." : "Confirm Redemption"}
            </button>
          ) : redemptionData.status === "Claimed" ? (
            <div className="validate-redeem-already-claimed">
              <p>✅ This reward has already been claimed.</p>
            </div>
          ) : redemptionData.status === "Expired" || expired ? (
            <div className="validate-redeem-expired-notice">
              <p>❌ This redemption has expired.</p>
              <p>Points have been refunded to the user's account.</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div
          className="validate-redeem-modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="validate-redeem-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="validate-redeem-modal-header">
              <h3>Admin Authentication Required</h3>
              <button
                className="validate-redeem-modal-close"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <div className="validate-redeem-modal-body">
              <p>Please enter admin credentials to confirm this redemption:</p>

              <div className="validate-redeem-form-group">
                <label htmlFor="storeEmail">Admin Email:</label>
                <input
                  type="email"
                  id="storeEmail"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="validate-redeem-password-input"
                />
              </div>

              <div className="validate-redeem-form-group">
                <label htmlFor="storePassword">Admin Password:</label>
                <input
                  type="password"
                  id="storePassword"
                  value={storePassword}
                  onChange={(e) => setStorePassword(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handlePasswordSubmit()
                  }
                  placeholder="Enter admin password"
                  className="validate-redeem-password-input"
                />
              </div>

              {passwordError && (
                <div className="validate-redeem-error-message">
                  {passwordError}
                </div>
              )}
            </div>

            <div className="validate-redeem-modal-footer">
              <button
                className="validate-redeem-btn validate-redeem-btn-secondary"
                onClick={handleCloseModal}
                disabled={confirming}
              >
                Cancel
              </button>
              <button
                className="validate-redeem-btn validate-redeem-btn-primary"
                onClick={handlePasswordSubmit}
                disabled={
                  confirming || !storeEmail.trim() || !storePassword.trim()
                }
              >
                {confirming ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
