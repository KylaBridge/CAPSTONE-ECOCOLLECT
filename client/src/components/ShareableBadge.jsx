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

  useEffect(() => {
    const fetchBadge = async () => {
      try {
        const badgeIdToUse = badgeId || urlId;
        if (!badgeIdToUse) {
          setError("Badge ID is missing");
          setLoading(false);
          return;
        }
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await axios.get(`${apiUrl}/api/ecocollect/badges/${badgeIdToUse}`);
        if (!response.data) {
          setError("Badge not found");
          setLoading(false);
          return;
        }
        const formattedBadge = {
          ...response.data,
          image: response.data.image ? `${apiUrl}/${response.data.image.path}` : Badge1
        };
        setBadge(formattedBadge);
      } catch (err) {
        setError("An error occurred while fetching the badge");
      } finally {
        setLoading(false);
      }
    };
    fetchBadge();
  }, [badgeId, urlId]);

  if (loading) return <div>Loading...</div>;
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