import { useState, useEffect, useContext, useRef } from "react";
import "./styles/Achievements.css";
import {
  FiShare2,
  FiX,
  FiZoomIn,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiDownload,
} from "react-icons/fi";
import LockIcon from "../assets/icons/lockicon.png";
import axios from "axios";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Components and Pages
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BadgeShareCard from "../components/BadgeShareCard";
import { UserContext } from "../context/userContext";

//assets
import Badge1 from "../assets/badges/current-badge.png";
import HomeHeaderTitle from "../assets/headers/home-header.png";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";

export default function Achievements() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isGeneratingShareCard, setIsGeneratingShareCard] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const shareCardRef = useRef(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await axios.get("/api/ecocollect/badges");
        const badgesWithImages = response.data.map((badge) => ({
          ...badge,
          img: badge.image
            ? `${import.meta.env.VITE_API_URL}/${badge.image.path}`
            : Badge1,
          requiredPoints: badge.pointsRequired,
        }));
        // Sort badges by points required
        badgesWithImages.sort((a, b) => a.requiredPoints - b.requiredPoints);
        setBadges(badgesWithImages);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };

    fetchBadges();
  }, []);

  const generateShareCard = async () => {
    if (!shareCardRef.current) return null;

    setIsGeneratingShareCard(true);
    try {
      // Wait for the image to load before generating the canvas
      const badgeImage =
        shareCardRef.current.querySelector(".share-card-badge");
      if (badgeImage) {
        await new Promise((resolve, reject) => {
          if (badgeImage.complete) {
            resolve();
          } else {
            badgeImage.onload = resolve;
            badgeImage.onerror = reject;
          }
        });
      }

      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error generating share card:", error);
      return null;
    } finally {
      setIsGeneratingShareCard(false);
    }
  };

  const handleShare = async () => {
    if (!selectedBadge) return;

    // Generate a shareable URL for the badge
    const shareUrl = `${window.location.origin}/badge/${selectedBadge._id}`;
    const shareText = `I earned the ${selectedBadge.name} badge on EcoCollect!`;

    // Always show our custom share options first
    setShowShareOptions(true);

    if (navigator.share) {
      try {
        const shareData = {
          title: `EcoCollect Badge: ${selectedBadge.name}`,
          text: shareText,
          url: shareUrl,
        };

        if (shareCardRef.current) {
          const shareCardImage = await generateShareCard();
          if (shareCardImage) {
            try {
              const blob = await (await fetch(shareCardImage)).blob();
              const file = new File([blob], "badge-share.png", {
                type: "image/png",
              });
              shareData.files = [file];
            } catch (error) {
              console.error("Error creating share file:", error);
            }
          }
        }
      } catch (err) {
        console.error("Error preparing share data:", err);
      }
    }
  };

  const handleDownload = async () => {
    if (!selectedBadge) return;

    try {
      // Generate the share card image
      const shareCardImage = await generateShareCard();
      if (!shareCardImage) {
        throw new Error("Failed to generate share card");
      }

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = shareCardImage;
      link.download = `eco-collect-badge-certificate-${selectedBadge.name
        .toLowerCase()
        .replace(/\s+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading badge certificate:", error);
      alert("Failed to download badge certificate. Please try again.");
    }
  };

  const updateMetaTags = (badge) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/badge/${badge._id}`;
    const shareTitle = `${badge.name} - EcoCollect Badge`;
    const shareDescription = badge.description;
    const shareImage = badge.img;

    // Update Open Graph meta tags
    document
      .querySelector('meta[property="og:title"]')
      .setAttribute("content", shareTitle);
    document
      .querySelector('meta[property="og:description"]')
      .setAttribute("content", shareDescription);
    document
      .querySelector('meta[property="og:image"]')
      .setAttribute("content", shareImage);
    document
      .querySelector('meta[property="og:url"]')
      .setAttribute("content", shareUrl);

    // Update Twitter Card meta tags
    document
      .querySelector('meta[name="twitter:title"]')
      .setAttribute("content", shareTitle);
    document
      .querySelector('meta[name="twitter:description"]')
      .setAttribute("content", shareDescription);
    document
      .querySelector('meta[name="twitter:image"]')
      .setAttribute("content", shareImage);
  };

  const shareToSocialMedia = async (platform, badge) => {
    try {
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/badge/${badge._id}`;
      const shareTitle = `🏆 ${badge.name} Badge - EcoCollect`;
      const shareDescription = `I've earned the "${
        badge.name
      }" badge on EcoCollect! ${
        badge.description ||
        "Join me in making a difference for our environment!"
      }`;

      let shareLink = "";
      switch (platform) {
        case "facebook":
          // Facebook requires simpler URL format and may need debugging
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`;
          window.open(shareLink, "_blank", "width=600,height=400");
          break;
        case "twitter":
          shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(
            shareDescription
          )}&hashtags=EcoCollect,Sustainability,EcoFriendly`;
          window.open(shareLink, "_blank", "width=600,height=400");
          break;
        case "whatsapp":
          shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
            shareDescription + " " + shareUrl
          )}`;
          window.open(shareLink, "_blank", "width=600,height=400");
          break;
        case "telegram":
          shareLink = `https://t.me/share/url?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(shareDescription)}`;
          window.open(shareLink, "_blank", "width=600,height=400");
          break;
        case "linkedin":
          shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}&title=${encodeURIComponent(
            shareTitle
          )}&summary=${encodeURIComponent(shareDescription)}`;
          window.open(shareLink, "_blank", "width=600,height=400");
          break;
        case "pinterest":
          shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
            shareUrl
          )}&description=${encodeURIComponent(shareDescription)}`;
          window.open(shareLink, "_blank", "width=600,height=400");
          break;
        case "copy":
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard!");
          setShowShareOptions(false);
          return;
        default:
          return;
      }

      setShowShareOptions(false);
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share badge");
    }
  };

  return (
    <>
      <div className="body-achievements-module">
        <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
        <Header headerImg={HomeHeaderTitle} headerText="Achievements" />
        <div className="achievements-main-container">
          <h2 className="badge-header-title">
            Badge <br /> Collections
          </h2>
          <div className="badge-scroll-container">
            {badges.map((badge, index) => (
              <div
                key={badge._id || index}
                className="badge-card"
                onClick={() => setSelectedBadge(badge)}
              >
                <div className="badge-wrapper">
                  <div
                    className={`badge-bg-square ${
                      user?.exp < badge.requiredPoints ? "locked" : ""
                    }`}
                  >
                    <img
                      src={badge.img}
                      alt={badge.name}
                      className="badge-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = Badge1;
                      }}
                    />
                  </div>
                  {user?.exp < badge.requiredPoints && (
                    <img src={LockIcon} alt="Locked" className="lock-icon" />
                  )}
                  <span
                    className={`badge-tap-icon ${
                      user?.exp < badge.requiredPoints
                        ? "locked-icon"
                        : "unlocked-icon"
                    }`}
                  >
                    <FiZoomIn size={16} />
                  </span>
                </div>
                <p className="badge-name">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badge Share Card Component */}
      <BadgeShareCard
        user={user}
        selectedBadge={selectedBadge}
        shareCardRef={shareCardRef}
        isVisible={showShareCard}
      />

      {/* Modal */}
      {selectedBadge && (
        <div
          className="badge-modal-overlay"
          onClick={() => {
            setSelectedBadge(null);
            setShowShareOptions(false);
            setShowShareCard(false);
          }}
        >
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => {
                setSelectedBadge(null);
                setShowShareOptions(false);
                setShowShareCard(false);
              }}
            >
              <FiX size={24} />
            </button>
            <img
              src={selectedBadge.img}
              alt={selectedBadge.name}
              className="badge-modal-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = Badge1;
              }}
            />
            <h3>{selectedBadge.name}</h3>
            <p>{selectedBadge.description}</p>
            <p className="badge-milestone">
              <span className="milestone-value">
                {selectedBadge.milestoneCondition}
              </span>
            </p>
            <button
              className={`share-button ${
                user?.exp < selectedBadge.requiredPoints ? "disabled" : ""
              }`}
              disabled={
                user?.exp < selectedBadge.requiredPoints ||
                isGeneratingShareCard
              }
              onClick={handleShare}
            >
              {isGeneratingShareCard ? (
                "Generating..."
              ) : (
                <>
                  <FiShare2 /> Share
                </>
              )}
            </button>

            {showShareOptions && (
              <div className="share-options">
                <h4>Share to Social Media</h4>
                <div className="social-share-grid">
                  <button
                    onClick={() =>
                      shareToSocialMedia("facebook", selectedBadge)
                    }
                    className="social-share-btn facebook"
                  >
                    <FiFacebook /> Facebook
                  </button>
                  <button
                    onClick={() => shareToSocialMedia("twitter", selectedBadge)}
                    className="social-share-btn twitter"
                  >
                    <FiTwitter /> Twitter
                  </button>
                  <button
                    onClick={() =>
                      shareToSocialMedia("whatsapp", selectedBadge)
                    }
                    className="social-share-btn whatsapp"
                  >
                    <FiShare2 /> WhatsApp
                  </button>
                  <button
                    onClick={() =>
                      shareToSocialMedia("telegram", selectedBadge)
                    }
                    className="social-share-btn telegram"
                  >
                    <FiShare2 /> Telegram
                  </button>
                  <button
                    onClick={() =>
                      shareToSocialMedia("linkedin", selectedBadge)
                    }
                    className="social-share-btn linkedin"
                  >
                    <FiShare2 /> LinkedIn
                  </button>
                  <button
                    onClick={() =>
                      shareToSocialMedia("pinterest", selectedBadge)
                    }
                    className="social-share-btn pinterest"
                  >
                    <FiShare2 /> Pinterest
                  </button>
                  <button
                    onClick={() => shareToSocialMedia("copy", selectedBadge)}
                    className="social-share-btn copy"
                  >
                    <FiShare2 /> Copy Link
                  </button>
                  <button
                    onClick={handleDownload}
                    className="social-share-btn download"
                  >
                    <FiDownload /> Download Badge
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
