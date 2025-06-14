import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Badge1 from "../assets/badges/current-badge.png";
import BadgeShareCard from './BadgeShareCard';

const ShareableBadge = ({ badgeId }) => {
  const { id: urlId } = useParams();
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shareCardRef = useRef(null);

  const updateMetaTags = (badgeData) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/badge/${badgeData._id}`;
    const shareTitle = `${badgeData.name} - EcoCollect Badge`;
    const shareDescription = badgeData.description;
    const shareImage = badgeData.image ? `${baseUrl}/${badgeData.image.path}` : Badge1;

    // Update Open Graph meta tags
    document.querySelector('meta[property="og:title"]').setAttribute('content', shareTitle);
    document.querySelector('meta[property="og:description"]').setAttribute('content', shareDescription);
    document.querySelector('meta[property="og:image"]').setAttribute('content', shareImage);
    document.querySelector('meta[property="og:url"]').setAttribute('content', shareUrl);

    // Update Twitter Card meta tags
    document.querySelector('meta[name="twitter:title"]').setAttribute('content', shareTitle);
    document.querySelector('meta[name="twitter:description"]').setAttribute('content', shareDescription);
    document.querySelector('meta[name="twitter:image"]').setAttribute('content', shareImage);
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
        const apiEndpoint = `${apiUrl}/api/ecocollect/badges/${badgeIdToUse}`;
        const response = await axios.get(apiEndpoint);
        if (!response.data) {
          setError("Badge not found (empty response)");
          setLoading(false);
          return;
        }
        const formattedBadge = {
          ...response.data,
          image: response.data.image ? `${apiUrl}/${response.data.image.path}` : Badge1
        };
        setBadge(formattedBadge);
        
        // Update meta tags with the fetched badge data
        updateMetaTags(formattedBadge);
      } catch (err) {
        setError("fetch-failed");
      } finally {
        setLoading(false);
      }
    };
    fetchBadge();
  }, [badgeId, urlId]);

  if (loading) return <div>Loading...</div>;

  // Fallback: If fetch fails, render a default badge certificate
  if (error === "fetch-failed") {
    const fallbackBadge = {
      name: "EcoCollect Badge",
      description: "Congratulations! You have earned a badge for your eco-friendly actions.",
      image: Badge1,
      earnedBy: {
        username: "Eco User",
        email: "user@example.com"
      },
      dateEarned: new Date().toLocaleDateString()
    };
    
    // Update meta tags with fallback badge data
    updateMetaTags(fallbackBadge);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <BadgeShareCard
          user={fallbackBadge.earnedBy}
          selectedBadge={fallbackBadge}
          shareCardRef={shareCardRef}
          isVisible={true}
        />
        <div style={{ color: "#d32f2f", marginTop: "1rem" }}>
          Could not fetch badge details. Showing a default certificate.
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;
  if (!badge) return <div>Badge Not Found</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <BadgeShareCard
        user={badge.earnedBy}
        selectedBadge={badge}
        shareCardRef={shareCardRef}
        isVisible={true}
      />
    </div>
  );
};

export default ShareableBadge;