import { useState } from "react"
import "../pages/styles/HomePage.css"
import Userprofile from "../components/Userprofile";
import Header from "../components/Header"
import HomeHeaderTitle from "../assets/headers/home-header.png"
import Badge from "../assets/badges/current-badge.png"
import ChainImg from "../assets/icons/lockedchain.png"
import NextBadge from "../assets/badges/next-badge.png"
import SubmissionCharacter from "../assets/icons/submissionchar.png"
import SmartDevicesIcon from "../assets/icons/smartdevicesicon.png"
import SmartIcon from "../assets/icons/smarticon.png"
import Sidebar from "../components/Sidebar"
import { FaCaretDown, FaCaretUp} from "react-icons/fa";


export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false)

   // Placeholder for user's rank and previous rank (for determining the icon)
   const [userRank, setUserRank] = useState(45);
   const [previousRank, setPreviousRank] = useState(46);
    //making the progress bar dynamic (testing)
   const currentPoints = 100;
   const totalPoints = 100;
   const progressPercent = (currentPoints / totalPoints) * 100;

  const getRankIcon = () => {
    if (previousRank === null) {
      return null;
    }
    if (userRank < previousRank) {
      return <FaCaretUp className="rank-icon up" />;
    } else if (userRank > previousRank) {
      return <FaCaretDown className="rank-icon down" />;
    } else {
      return null;
    }
  };
  
  return (
    <>
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={HomeHeaderTitle} headerText="Home" />
            <div className="home-main-container">
                <div className="user-profile">
                    <Userprofile/>
                </div>
                
                <h1 className="rank-title">Highest Rank</h1>
                <div className="rank-container">
                    <div className="merit">
                        <h2>BEGINNER</h2>
                    </div>
                    <div className="leaderboard-rank">
                    <h2 className="rank-number-container">
                        <span className="rank-label">RANK</span>
                        <div className="rank-icon-container">
                          {getRankIcon()}
                          <span className="user-rank-number">{userRank}</span>
                        </div>
                      </h2>
                    </div>
                </div>

                <div className="submission-container">
                  <div className="submission-content">
                    <div className="submission-text">
                      <h1>Submissions</h1>
                      <h2>Total Points</h2>
                      <div className="submission-bar">
                        <div className="submission-status" style={{ width: `${progressPercent}%` }}>
                        <span className="submission-text-inside">{`${currentPoints}/${totalPoints}`}</span>
                        </div>
                      </div>
                    </div>
                    <img
                      src={SubmissionCharacter}
                      alt="submission mascot"
                      className="submission-character"
                    />
                  </div>
                </div>
                <div className="badge-reward-container">
                <div className="current-reward-item">
                    <h1>Current Badge</h1>
                    <div className="current-reward-image-container">
                      <img src={Badge} alt="Current Badge Reward" />
                      <p>Get after joining</p>
                    </div>
                  </div>
                  <div className="next-reward-item">
                    <h1>Next Badge</h1>
                    <div className="next-reward-image-container">
                      <img src={NextBadge} alt="Next Badge Reward" />
                      <p>Earn 100 points to unlock</p>
                    </div>
                    <img src={ChainImg} alt="Locked" className="overlay-image" />
                  </div>
                </div>
                <div className="home-divider"></div>

                <div className="rewards-preview-container">
                <img src={SmartDevicesIcon} alt="Reward Mascot" className="reward-mascot" />
                  <div className="reward-text-container">
                    <img src={SmartIcon} alt="Smart Logo" className="smart-logo" />
                    <p className="reward-description">
                      Get a FREE load after unlocking the badge
                    </p>
                  </div>
                </div>
            </div>
    </>
  )
}
