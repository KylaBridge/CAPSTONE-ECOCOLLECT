import { useState, useEffect, useContext } from "react"
import "./styles/Achievements.css"
import { FiShare2, FiX, FiZoomIn} from "react-icons/fi"
import LockIcon  from "../assets/icons/lockicon.png"
import axios from "axios"

// Components and Pages
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { UserContext } from "../context/userContext"

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
  const [badges, setBadges] = useState([])
  const [selectedBadge, setSelectedBadge] = useState(null)
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

      {/* Modal */}
      {selectedBadge && (
        <div className="badge-modal-overlay" onClick={() => setSelectedBadge(null)}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedBadge(null)}>
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
            <button
              className={`share-button ${user?.exp < selectedBadge.requiredPoints ? 'disabled' : ''}`}
              disabled={user?.exp < selectedBadge.requiredPoints}
            >
              <FiShare2 /> Share
            </button>
          </div>
        </div>
      )}
    </>
  )
}
