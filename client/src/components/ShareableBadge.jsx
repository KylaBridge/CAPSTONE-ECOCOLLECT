import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Badge1 from "../assets/badges/current-badge.png";
import BadgeShareCard from "./BadgeShareCard";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-hot-toast";
import html2canvas from "html2canvas";
import "./styles/ShareableBadge.css";

const ShareableBadge = ({ badgeId }) => {
  const { id: urlId } = useParams();
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shareCardRef = useRef(null);

  const updateMetaTags = (badgeData) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/badge/${badgeData._id}`;
    const shareTitle = `🏆 ${badgeData.name} Badge - EcoCollect`;
    const shareDescription = `I've earned the "${
      badgeData.name
    }" badge on EcoCollect! ${
      badgeData.description ||
      "Join me in making a difference for our environment!"
    }`;
    const shareImage = badgeData.img || badgeData.image || Badge1;

    // Update document title
    document.title = shareTitle;

    // Update existing meta tags or create them
    const updateOrCreateMeta = (property, content, isProperty = true) => {
      const selector = isProperty
        ? `meta[property="${property}"]`
        : `meta[name="${property}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement("meta");
        if (isProperty) {
          meta.setAttribute("property", property);
        } else {
          meta.setAttribute("name", property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Open Graph meta tags
    updateOrCreateMeta("og:title", shareTitle);
    updateOrCreateMeta("og:description", shareDescription);
    updateOrCreateMeta("og:image", shareImage);
    updateOrCreateMeta("og:url", shareUrl);
    updateOrCreateMeta("og:type", "website");

    // Twitter Card meta tags
    updateOrCreateMeta("twitter:card", "summary_large_image", false);
    updateOrCreateMeta("twitter:title", shareTitle, false);
    updateOrCreateMeta("twitter:description", shareDescription, false);
    updateOrCreateMeta("twitter:image", shareImage, false);
  };

  const handleDownloadBadge = async () => {
    try {
      if (!shareCardRef.current) return;

      // Wait a bit for the component to render fully
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: shareCardRef.current.offsetWidth,
        height: shareCardRef.current.offsetHeight,
        windowWidth: shareCardRef.current.scrollWidth,
        windowHeight: shareCardRef.current.scrollHeight,
      });

      const link = document.createElement("a");
      link.download = `${badge.name}-badge-certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Badge certificate downloaded successfully!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download badge certificate");
    }
  };

  useEffect(() => {
    const fetchBadge = async () => {
      try {
        const badgeIdToUse = badgeId || urlId;
        if (!badgeIdToUse) {
          setError("Badge ID is missing");
          setLoading(false);
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
        // Use the public endpoint that doesn't require authentication
        const apiEndpoint = `${apiUrl}/api/ecocollect/badges/public/${badgeIdToUse}`;
        const response = await axios.get(apiEndpoint);

        if (!response.data) {
          setError("Badge not found (empty response)");
          setLoading(false);
          return;
        }

        const formattedBadge = {
          ...response.data,
          image: response.data.image
            ? `${apiUrl}/${response.data.image.path}`
            : Badge1,
          img: response.data.image
            ? `${apiUrl}/${response.data.image.path}`
            : Badge1,
        };

        setBadge(formattedBadge);
        updateMetaTags(formattedBadge);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("fetch-failed");
      } finally {
        setLoading(false);
      }
    };

    fetchBadge();
  }, [badgeId, urlId]);

  if (loading) {
    return (
      <div className="certificate-container">
        <div className="loading-spinner">Loading certificate...</div>
      </div>
    );
  }

  // Fallback for fetch failures
  if (error === "fetch-failed") {
    const fallbackBadge = {
      _id: "fallback",
      name: "EcoCollect Badge",
      description:
        "Congratulations! You have earned a badge for your eco-friendly actions.",
      image: Badge1,
      img: Badge1,
      earnedBy: {
        name: "Eco User",
        email: "user@example.com",
      },
      dateEarned: new Date().toISOString(),
    };

    updateMetaTags(fallbackBadge);

    return (
      <div className="certificate-container">
        <div className="certificate-header">
          <h1>🏆 Certificate of Achievement</h1>
          <p>EcoCollect Environmental Badge</p>
        </div>

        <div className="certificate-display">
          <BadgeShareCard
            user={fallbackBadge.earnedBy}
            selectedBadge={fallbackBadge}
            shareCardRef={shareCardRef}
            isVisible={true}
          />
        </div>

        <div className="certificate-details">
          <div className="badge-info">
            <h2>{fallbackBadge.name}</h2>
            <p className="badge-description">{fallbackBadge.description}</p>

            <div className="badge-metadata">
              <div className="badge-earned-date">
                <strong>Date Earned:</strong>{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="badge-earner">
                <strong>Earned By:</strong> {fallbackBadge.earnedBy.name}
              </div>
            </div>
          </div>
        </div>

        <div className="certificate-actions">
          <button
            onClick={handleDownloadBadge}
            className="download-btn"
            title="Download Certificate"
          >
            <FaDownload /> Download Certificate
          </button>
        </div>

        <div className="error-notice">
          Could not fetch badge details. Showing a default certificate.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificate-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!badge) {
    return (
      <div className="certificate-container">
        <div className="error-message">Badge Not Found</div>
      </div>
    );
  }

  return (
    <div className="certificate-container">
      <div className="certificate-header">
        <h1>🏆 Certificate of Achievement</h1>
        <p>EcoCollect Environmental Badge</p>
      </div>

      <div className="certificate-display">
        <BadgeShareCard
          user={badge.earnedBy || { 
            name: badge.earnedByName || "EcoCollect Champion",
            email: badge.earnedByEmail || "champion@ecocollect.com"
          }}
          selectedBadge={badge}
          shareCardRef={shareCardRef}
          isVisible={true}
        />
      </div>

      <div className="certificate-details">
        <div className="badge-info">
          <h2>{badge.name}</h2>
          <p className="badge-description">
            {badge.description || badge.milestoneCondition}
          </p>

          <div className="badge-metadata">
            {badge.pointsRequired && (
              <div className="badge-requirement">
                <strong>Points Required:</strong> {badge.pointsRequired} XP
              </div>
            )}

            {badge.milestoneCondition && (
              <div className="badge-milestone">
                <strong>Achievement Requirement:</strong>{" "}
                {badge.milestoneCondition}
              </div>
            )}

            <div className="badge-earned-date">
              <strong>Date Earned:</strong>{" "}
              {badge.dateEarned
                ? new Date(badge.dateEarned).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
            </div>

            {badge.earnedBy && (
              <div className="badge-earner">
                <strong>Earned By:</strong>{" "}
                {badge.earnedBy.name ||
                  badge.earnedBy.username ||
                  badge.earnedBy.email}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="certificate-actions">
        <button
          onClick={handleDownloadBadge}
          className="download-btn"
          title="Download Certificate"
        >
          <FaDownload /> Download Certificate
        </button>
      </div>
    </div>
  );
};

export default ShareableBadge;
