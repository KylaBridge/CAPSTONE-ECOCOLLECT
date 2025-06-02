 import React from 'react';
import "./styles/BadgeShareCard.css";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import NUxSmCaresLogo from "../assets/NUxSmCaresLogo.png";
import Badge1 from "../assets/badges/current-badge.png";

const BadgeShareCard = ({ user, selectedBadge, shareCardRef }) => {
  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
      <div ref={shareCardRef} className="share-card-template">
        <div className="share-card-content">
          <div className="share-card-header">
            <h1>🎉 Congratulations, {user?.name}! 🎉</h1>
            <p>You've just unlocked a new badge!</p>
          </div>

          <div className="share-card-badge-section">
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
            <h2 className="badge-title">{selectedBadge?.name}</h2>
            <div className="badge-details">
              <p className="badge-description">Awarded for: {selectedBadge?.description}</p>
              <p className="badge-date">Date Earned: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className="badge-earner">Earned by: {user?.name}</p>
            </div>
          </div>

          <div className="share-card-footer">
            <div className="share-card-cta">
              <p>♻️ Keep saving the planet, one gadget at a time!</p>
              <p>📱 Download EcoCollect now and start earning rewards.</p>
              <p>🌍 www.ecocollect.ph</p>
              <div className="share-card-hashtags">
                <span>#EcoCollect</span>
                <span>#BadgeUnlocked</span>
                <span>#GreenIsCool</span>
                <span>#GamifyThePlanet</span>
              </div>
            </div>
            <div className="share-card-logos">
              <div className="logo-left">
                <img 
                  src={NUxSmCaresLogo} 
                  alt="NUxSmCares" 
                  className="share-card-logo"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="logo-right">
                <img 
                  src={EcoCollectLogo} 
                  alt="EcoCollect" 
                  className="share-card-logo"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeShareCard; 