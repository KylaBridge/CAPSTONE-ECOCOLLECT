import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { FaSpinner } from 'react-icons/fa';
import Badge1 from "../assets/badges/current-badge.png";

const ShareableBadge = () => {
  const { id } = useParams();
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadge = async () => {
      try {
        if (!id) {
          setError("Badge ID is missing");
          setLoading(false);
          return;
        }

        // First try to get the badge from the ecocollect endpoint
        const response = await axios.get(`/api/ecocollect/badges/${id}`);
        
        if (!response.data) {
          setError("Badge not found");
          setLoading(false);
          return;
        }

        // Format the badge data to match the expected structure
        const formattedBadge = {
          ...response.data,
          image: response.data.image ? `${import.meta.env.VITE_API_URL}/${response.data.image.path}` : Badge1
        };

        setBadge(formattedBadge);
      } catch (err) {
        console.error("Error fetching badge:", err);
        setError(err.response?.status === 404 
          ? "Badge not found" 
          : "An error occurred while fetching the badge");
      } finally {
        setLoading(false);
      }
    };

    fetchBadge();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!badge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Badge Not Found</h1>
          <p className="text-gray-600">The requested badge could not be found.</p>
        </div>
      </div>
    );
  }

  // Construct absolute URLs for meta tags
  const baseUrl = window.location.origin;
  const badgeImageUrl = badge.image.startsWith('http') 
    ? badge.image 
    : `${baseUrl}${badge.image}`;

  return (
    <>
      <Helmet>
        <title>{badge.name} - EcoCollect Badge</title>
        <meta name="description" content={badge.description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/badge/${badge._id}`} />
        <meta property="og:title" content={`${badge.name} - EcoCollect Badge`} />
        <meta property="og:description" content={badge.description} />
        <meta property="og:image" content={badgeImageUrl} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${baseUrl}/badge/${badge._id}`} />
        <meta property="twitter:title" content={`${badge.name} - EcoCollect Badge`} />
        <meta property="twitter:description" content={badge.description} />
        <meta property="twitter:image" content={badgeImageUrl} />
        
        {/* Additional meta tags */}
        <meta name="theme-color" content="#245a1e" />
        <meta name="author" content="EcoCollect" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{badge.name}</h1>
                <p className="text-lg text-gray-600 mb-8">{badge.description}</p>
                <div className="flex justify-center mb-8">
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className="w-48 h-48 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = Badge1;
                    }}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>Earned on: {new Date(badge.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareableBadge; 