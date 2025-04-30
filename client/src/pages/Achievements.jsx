import { useState } from "react"
import "./styles/Achievements.css"
import { FiShare2, FiX, FiZoomIn} from "react-icons/fi"
import LockIcon  from "../assets/icons/lockicon.png"

// Components and Pages
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

//assets
import Badge1 from "../assets/badges/current-badge.png"
import Badge2 from "../assets/badges/next-badge.png"
import Badge3 from "../assets/badges/badge3.png"
import Badge4 from "../assets/badges/badge4.png"
import Badge5 from "../assets/badges/badge5.png"
import Badge6 from "../assets/badges/badge6.png"
import Badge7 from "../assets/badges/badge7.png"
import Badge8 from "../assets/badges/badge8.png"
import Badge9 from "../assets/badges/badge9.png"
import Badge10 from "../assets/badges/badge10.png"
import Badge11 from "../assets/badges/badge11.png"
import HomeHeaderTitle from "../assets/headers/home-header.png"

export default function Achievements() {
  const [showNavbar, setShowNavbar] = useState(false)
  // Mock data
  const userPoints = 30; // This would be dynamic based on the user's data

  const [selectedBadge, setSelectedBadge] = useState(null)

  const badges = [
    { id: 1, name: "Eco Starter", img: Badge1, requiredPoints: 10, description: "Donate your first E-waste" },
    { id: 2, name: "Eco Explorer", img: Badge2, requiredPoints: 20, description: "Donate three times!" },
    { id: 3, name: "Green Beginner", img: Badge3, requiredPoints: 30, description: "Off to a great start!" },
    { id: 4, name: "Recycling Rookie", img: Badge4, requiredPoints: 40, description: "You're getting there!" },
    { id: 5, name: "Eco Learner", img: Badge5, requiredPoints: 50, description: "Donate your organs to unlock" },
    { id: 6, name: "Green Enthusiast", img: Badge6, requiredPoints: 60, description: "You're in the zone!" },
    { id: 7, name: "Earth Ally", img: Badge7, requiredPoints: 70, description: "The planet thanks you!" },
    { id: 8, name: "E-Waste Guardian", img: Badge8, requiredPoints: 80, description: "A true defender!" },
    { id: 9, name: "Eco Novice", img: Badge9, requiredPoints: 90, description: "On your way to legend!" },
    { id: 10, name: "Eco Starter", img: Badge10, requiredPoints: 100, description: "Back to basics badge." },
    { id: 11, name: "Eco Explorer", img: Badge11, requiredPoints: 110, description: "Explorer vibes 2.0!" },
  ]


  return (
    <>
    <div className="body-achievements-module">
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={HomeHeaderTitle} headerText="Achievements" />
      <div className="achievements-main-container">
          <h2 className="badge-header-title">Badge <br /> Collections</h2>
          <div className="badge-scroll-container">
          {badges.map((badge, index) => (
            <div key={index} className="badge-card" onClick={() => setSelectedBadge(badge)}>
              <div className="badge-wrapper">
                <div className={`badge-bg-square ${userPoints < badge.requiredPoints ? 'locked' : ''}`}>
                  <img src={badge.img} alt={badge.name} className="badge-img" />
                </div>    
                  {userPoints < badge.requiredPoints && (
                    <img src={LockIcon} alt="Locked" className="lock-icon" />
                  )}
                <span
                  className={`badge-tap-icon ${userPoints < badge.requiredPoints ? 'locked-icon' : 'unlocked-icon'}`}
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

      {/* Modal */}
      {selectedBadge && (
        <div className="badge-modal-overlay" onClick={() => setSelectedBadge(null)}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedBadge(null)}>
              <FiX size={24} />
            </button>
            <img src={selectedBadge.img} alt={selectedBadge.name} className="badge-modal-img" />
            <h3>{selectedBadge.name}</h3>
            <p>{selectedBadge.description}</p>
            <button
              className={`share-button ${userPoints < selectedBadge.requiredPoints ? 'disabled' : ''}`}
              disabled={userPoints < selectedBadge.requiredPoints}
            >
              <FiShare2 /> Share
            </button>
          </div>
        </div>
      )}
    </>
  )
}
