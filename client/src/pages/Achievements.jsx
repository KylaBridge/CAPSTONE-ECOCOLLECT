import { useState, useEffect, useContext, useRef } from "react"
import "./styles/Achievements.css"
import { FiShare2, FiX, FiZoomIn, FiFacebook, FiTwitter, FiInstagram, FiDownload } from "react-icons/fi"
import LockIcon  from "../assets/icons/lockicon.png"
import axios from "axios"
import html2canvas from 'html2canvas'

// Components and Pages
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { UserContext } from "../context/userContext"

//assets
import Badge1 from "../assets/badges/current-badge.png"
import HomeHeaderTitle from "../assets/headers/home-header.png"
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";

export default function Achievements() {
  const [showNavbar, setShowNavbar] = useState(false)
  const [badges, setBadges] = useState([])
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [isGeneratingShareCard, setIsGeneratingShareCard] = useState(false)
  const shareCardRef = useRef(null)
  const { user } = useContext(UserContext)

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await axios.get('/api/ecocollect/badges')
        const badgesWithImages = response.data.map(badge => ({
          ...badge,
          img: badge.image ? `http://localhost:3000/${badge.image.path}` : Badge1,
          requiredPoints: badge.pointsRequired
        }))
        // Sort badges by points required
        badgesWithImages.sort((a, b) => a.requiredPoints - b.requiredPoints)
        setBadges(badgesWithImages)
      } catch (error) {
        console.error('Error fetching badges:', error)
      }
    }

    fetchBadges()
  }, [])

  const generateShareCard = async () => {
    if (!shareCardRef.current) return null;
    
    setIsGeneratingShareCard(true);
    try {
      // Wait for the image to load before generating the canvas
      const badgeImage = shareCardRef.current.querySelector('.share-card-badge');
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
        useCORS: true, // Enable CORS for images
        allowTaint: true, // Allow cross-origin images
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating share card:', error);
      return null;
    } finally {
      setIsGeneratingShareCard(false);
    }
  };

  const handleShare = async () => {
    const shareCard = await generateShareCard();
    if (!shareCard) {
      setShowShareOptions(true);
      return;
    }

    const shareData = {
      title: `EcoCollect Badge: ${selectedBadge.name}`,
      text: `I earned the ${selectedBadge.name} badge on EcoCollect!`,
      url: window.location.href,
      files: [new File([await (await fetch(shareCard)).blob()], 'badge.png', { type: 'image/png' })]
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
        setShowShareOptions(true);
      }
    } else {
      setShowShareOptions(true);
    }
  };

  const shareToSocialMedia = async (platform) => {
    const shareCard = await generateShareCard();
    if (!shareCard) {
      alert('Failed to generate share card. Please try again.');
      return;
    }

    const shareText = encodeURIComponent(`I earned the ${selectedBadge.name} badge on EcoCollect!`);
    const shareUrl = encodeURIComponent(window.location.href);
    
    let shareLink = '';
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
        break;
      case 'instagram':
        // For Instagram, we'll provide a download option
        const link = document.createElement('a');
        link.href = shareCard;
        link.download = 'eco-collect-badge.png';
        link.click();
        alert('Badge image downloaded! You can now share it on Instagram.');
        return;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  return (
    <>
    <div className="body-achievements-module">
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={HomeHeaderTitle} headerText="Achievements" />
      <div className="achievements-main-container">
          <h2 className="badge-header-title">Badge <br /> Collections</h2>
          <div className="badge-scroll-container">
          {badges.map((badge, index) => (
            <div key={badge._id || index} className="badge-card" onClick={() => setSelectedBadge(badge)}>
              <div className="badge-wrapper">
                <div className={`badge-bg-square ${user?.exp < badge.requiredPoints ? 'locked' : ''}`}>
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
                  className={`badge-tap-icon ${user?.exp < badge.requiredPoints ? 'locked-icon' : 'unlocked-icon'}`}
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

      {/* Hidden Share Card Template */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={shareCardRef} className="share-card-template">
          <div className="share-card-content">
            <img 
              src={selectedBadge?.img} 
              alt={selectedBadge?.name} 
              className="share-card-badge"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = Badge1;
              }}
            />
            <h2>{selectedBadge?.name}</h2>
            <p>{selectedBadge?.description}</p>
            <div className="share-card-footer">
              <img 
                src={EcoCollectLogo} 
                alt="EcoCollect" 
                className="share-card-logo"
                crossOrigin="anonymous"
              />
              <p>EcoCollect Achievement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedBadge && (
        <div className="badge-modal-overlay" onClick={() => {
          setSelectedBadge(null);
          setShowShareOptions(false);
        }}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => {
              setSelectedBadge(null);
              setShowShareOptions(false);
            }}>
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
              <span className="milestone-value">{selectedBadge.milestoneCondition}</span>
            </p>
            <button
              className={`share-button ${user?.exp < selectedBadge.requiredPoints ? 'disabled' : ''}`}
              disabled={user?.exp < selectedBadge.requiredPoints || isGeneratingShareCard}
              onClick={handleShare}
            >
              {isGeneratingShareCard ? 'Generating...' : <><FiShare2 /> Share</>}
            </button>

            {showShareOptions && (
              <div className="share-options">
                <button onClick={() => shareToSocialMedia('facebook')} className="social-share-btn facebook">
                  <FiFacebook /> Facebook
                </button>
                <button onClick={() => shareToSocialMedia('twitter')} className="social-share-btn twitter">
                  <FiTwitter /> Twitter
                </button>
                <button onClick={() => shareToSocialMedia('instagram')} className="social-share-btn instagram">
                  <FiInstagram /> Download for Instagram
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
