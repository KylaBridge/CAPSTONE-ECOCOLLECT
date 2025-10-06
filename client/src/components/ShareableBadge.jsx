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
  const {
    id: urlId,
    userName: pathUserName,
    userEmail: pathUserEmail,
  } = useParams();
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shareCardRef = useRef(null);

  const updateMetaTags = (badgeData, userInfo) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/badge/${badgeData._id}${
      userInfo.userName ? `/${encodeURIComponent(userInfo.userName)}` : ""
    }${userInfo.userEmail ? `/${encodeURIComponent(userInfo.userEmail)}` : ""}`;
    const shareTitle = `🏆 ${userInfo.userName || "Someone"} earned the ${
      badgeData.name
    } Badge - EcoCollect`;
    const shareDescription = `${
      userInfo.userName || "An EcoCollect user"
    } has earned the "${badgeData.name}" badge on EcoCollect! ${
      badgeData.description ||
      "Join us in making a difference for our environment!"
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

      // Temporarily reset any scaling transforms to capture original size
      const originalTransform = shareCardRef.current.style.transform;
      shareCardRef.current.style.transform = "none";

      // Ensure the certificate renders at its original size (900x850)
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 900, // Force original width
        height: 850, // Force original height
        windowWidth: 900,
        windowHeight: 850,
      });

      // Restore the original transform
      shareCardRef.current.style.transform = originalTransform;

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

        // Extract user information from URL path
        let userName = null;
        let userEmail = null;
        let userId = null;

        // First, try to get from React Router params
        if (pathUserName) {
          try {
            userName = decodeURIComponent(pathUserName);
          } catch (e) {
            userName = pathUserName;
          }
        }

        if (pathUserEmail) {
          try {
            userEmail = decodeURIComponent(pathUserEmail);
          } catch (e) {
            userEmail = pathUserEmail;
          }
        }

        // Fallback: Extract from URL path manually for backwards compatibility
        if (!userName || !userEmail) {
          const pathParts = window.location.pathname
            .split("/")
            .filter((part) => part);
          // Expected format: ['badge', badgeId, userName, userEmail]
          if (pathParts.length >= 4) {
            try {
              userName = userName || decodeURIComponent(pathParts[2]);
              userEmail = userEmail || decodeURIComponent(pathParts[3]);
            } catch (e) {
              userName = userName || pathParts[2];
              userEmail = userEmail || pathParts[3];
            }
          }
        }

        // Final fallback: Try legacy query parameters for backwards compatibility
        if (!userName || !userEmail) {
          const urlParams = new URLSearchParams(window.location.search);
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );

          // Also try regex extraction for encoded URLs
          const fullUrl = window.location.href;
          const urlMatches = {
            userId: fullUrl.match(/[?&]userId=([^&#]*)/i),
            userName: fullUrl.match(/[?&]userName=([^&#]*)/i),
            userEmail: fullUrl.match(/[?&]userEmail=([^&#]*)/i),
          };

          let additionalParams = {};
          Object.keys(urlMatches).forEach((key) => {
            if (urlMatches[key] && urlMatches[key][1]) {
              try {
                additionalParams[key] = decodeURIComponent(urlMatches[key][1]);
              } catch (e) {
                additionalParams[key] = urlMatches[key][1];
              }
            }
          });

          userId =
            urlParams.get("userId") ||
            hashParams.get("userId") ||
            additionalParams.userId;
          userName =
            userName ||
            urlParams.get("userName") ||
            hashParams.get("userName") ||
            additionalParams.userName;
          userEmail =
            userEmail ||
            urlParams.get("userEmail") ||
            hashParams.get("userEmail") ||
            additionalParams.userEmail;
        }

        console.log("Extracted user data:", { userId, userName, userEmail }); // Debug log

        // Build API endpoint with user parameters if available
        let apiEndpoint = `${apiUrl}/api/ecocollect/badges/public/${badgeIdToUse}`;
        if (userId || userName || userEmail) {
          const queryParams = new URLSearchParams();
          if (userId) queryParams.append("userId", userId);
          if (userName) queryParams.append("userName", userName);
          if (userEmail) queryParams.append("userEmail", userEmail);
          apiEndpoint += `?${queryParams.toString()}`;
        }

        console.log("API Endpoint:", apiEndpoint); // Debug log

        const response = await axios.get(apiEndpoint);

        console.log("API Response:", response.data); // Debug log

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
          // Ensure user data is properly formatted
          earnedBy: response.data.earnedBy || {
            name:
              response.data.earnedByName ||
              response.data.userDetails?.name ||
              userName || // Use userName from URL params as fallback
              "EcoCollect Champion",
            username:
              response.data.earnedByUsername ||
              response.data.userDetails?.username,
            email:
              response.data.earnedByEmail ||
              response.data.userDetails?.email ||
              userEmail || // Use userEmail from URL params as fallback
              "champion@ecocollect.com",
          },
          // Use the actual earned date from the response, or preserve existing dateEarned
          dateEarned:
            response.data.dateEarned ||
            response.data.earnedDate ||
            response.data.createdAt,
        };

        setBadge(formattedBadge);
        updateMetaTags(formattedBadge, { userName, userEmail, userId });

        console.log("Final formatted badge with user data:", formattedBadge); // Debug log
        console.log(
          "User data being passed to BadgeShareCard:",
          formattedBadge.earnedBy
        ); // Debug log
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
    // Extract user data using the same path-based approach
    let userName = null;
    let userEmail = null;

    // Try React Router params first
    if (pathUserName) {
      try {
        userName = decodeURIComponent(pathUserName);
      } catch (e) {
        userName = pathUserName;
      }
    }

    if (pathUserEmail) {
      try {
        userEmail = decodeURIComponent(pathUserEmail);
      } catch (e) {
        userEmail = pathUserEmail;
      }
    }

    // Fallback to manual path extraction
    if (!userName || !userEmail) {
      const pathParts = window.location.pathname
        .split("/")
        .filter((part) => part);
      if (pathParts.length >= 4) {
        try {
          userName = userName || decodeURIComponent(pathParts[2]);
          userEmail = userEmail || decodeURIComponent(pathParts[3]);
        } catch (e) {
          userName = userName || pathParts[2];
          userEmail = userEmail || pathParts[3];
        }
      }
    }

    // Final fallback to legacy query parameters
    if (!userName || !userEmail) {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      const fullUrl = window.location.href;
      const urlMatches = {
        userName: fullUrl.match(/[?&]userName=([^&#]*)/i),
        userEmail: fullUrl.match(/[?&]userEmail=([^&#]*)/i),
      };

      let additionalParams = {};
      Object.keys(urlMatches).forEach((key) => {
        if (urlMatches[key] && urlMatches[key][1]) {
          try {
            additionalParams[key] = decodeURIComponent(urlMatches[key][1]);
          } catch (e) {
            additionalParams[key] = urlMatches[key][1];
          }
        }
      });

      userName =
        userName ||
        urlParams.get("userName") ||
        hashParams.get("userName") ||
        additionalParams.userName ||
        "Eco User";
      userEmail =
        userEmail ||
        urlParams.get("userEmail") ||
        hashParams.get("userEmail") ||
        additionalParams.userEmail ||
        "user@example.com";
    }

    // Ensure we have fallback values
    userName = userName || "Eco User";
    userEmail = userEmail || "user@example.com";

    console.log("Fallback - Extracted user data:", { userName, userEmail }); // Debug log

    const fallbackBadge = {
      _id: "fallback",
      name: "EcoCollect Badge",
      description:
        "Congratulations! You have earned a badge for your eco-friendly actions.",
      image: Badge1,
      img: Badge1,
      earnedBy: {
        name: userName,
        email: userEmail,
      },
      dateEarned: new Date().toISOString(), // Keep current date for fallback only
    };

    updateMetaTags(fallbackBadge, { userName, userEmail });

    return (
      <div className="certificate-container">
        <div className="certificate-header">
          <h1>🏆 Certificate of Achievement</h1>
          <p>EcoCollect Environmental Badge</p>
        </div>

        {/* Hidden certificate for download functionality only */}
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <BadgeShareCard
            user={fallbackBadge.earnedBy}
            selectedBadge={fallbackBadge}
            shareCardRef={shareCardRef}
            isVisible={false}
          />
        </div>

        <div className="certificate-details">
          <div className="badge-info">
            <h2>{fallbackBadge.name}</h2>
            <p className="shareablebadge-description">
              {fallbackBadge.description}
            </p>

            <div className="badge-metadata">
              <div className="badge-earned-date">
                <strong>Date Earned:</strong>{" "}
                {new Date(fallbackBadge.dateEarned).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
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

      {/* Hidden certificate for download functionality only */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <BadgeShareCard
          user={badge.earnedBy}
          selectedBadge={badge}
          shareCardRef={shareCardRef}
          isVisible={false}
        />
      </div>

      <div className="certificate-details">
        <div className="badge-info">
          <h2>{badge.name}</h2>
          <p className="shareablebadge-description">
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
                : "Date not available"}
            </div>

            {badge.earnedBy && (
              <div className="badge-earner">
                <strong>Earned By:</strong>{" "}
                {badge.earnedBy.name ||
                  badge.earnedBy.username ||
                  badge.earnedBy.email ||
                  "EcoCollect Champion"}
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
