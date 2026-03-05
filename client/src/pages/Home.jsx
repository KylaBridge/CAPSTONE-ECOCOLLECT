import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import "../pages/styles/HomePage.css";
import Userprofile from "../components/Userprofile";
import Header from "../components/Header";
import HomeHeaderTitle from "../assets/headers/home-header.png";
import Badge from "../assets/badges/current-badge.png";
import LockIcon from "../assets/icons/lockicon.png";
import NextBadge from "../assets/badges/next-badge.png";
import SubmissionCharacter from "../assets/icons/submissionchar.png";
import SmartDevicesIcon from "../assets/icons/smartdevicesicon.png";
import SmartIcon from "../assets/icons/smarticon.png";
import Sidebar from "../components/Sidebar";
import LeaderboardPage from "../components/LeaderboardPage";
import { ewasteAPI } from "../api/ewaste";
import { badgesAPI } from "../api/badges";
import { userAPI } from "../api/user";

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false);
  const { user, loading } = useContext(UserContext);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [currentBadge, setCurrentBadge] = useState(null);
  const [nextBadge, setNextBadge] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userRank, setUserRank] = useState(null);

  const navigate = useNavigate();
  const currentPoints = user?.points || 0;

  useEffect(() => {
    if (user) {
      // Fetch submission count
      ewasteAPI
        .getUserSubmitCount(user._id)
        .then((response) => {
          setSubmissionCount(response.data.submissionCount);
        })
        .catch((error) => {
          console.error("Error fetching submission count:", error);
        });

      // Fetch badges
      badgesAPI
        .getAllBadges()
        .then((response) => {
          const badges = response.data;
          // Find current badge based on user's rank
          const current = badges.find((badge) => badge.name === user.rank);
          if (current) {
            setCurrentBadge({
              ...current,
              image: current.image
                ? `${import.meta.env.VITE_API_URL}/${current.image.path}`
                : Badge,
            });
          }

          // Find next badge (the one with higher points required)
          const sortedBadges = badges.sort(
            (a, b) => a.pointsRequired - b.pointsRequired,
          );
          const next = sortedBadges.find(
            (badge) => badge.pointsRequired > user.exp,
          );
          if (next) {
            setNextBadge({
              ...next,
              image: next.image
                ? `${import.meta.env.VITE_API_URL}/${next.image.path}`
                : NextBadge,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching badges:", error);
        });

      // Fetch leaderboard (top contributors)
      userAPI
        .getLeaderboards()
        .then((response) => {
          if (Array.isArray(response.data)) {
            // Sort by exp descending
            const sorted = [...response.data]
              .filter((u) => u && typeof u === "object")
              .sort((a, b) => (b.exp || 0) - (a.exp || 0));
            setLeaderboard(sorted.slice(0, 10)); // Top 10
            // Find user's rank
            const index = sorted.findIndex((u) => u._id === user._id);
            setUserRank(index !== -1 ? index + 1 : null);
          }
        })
        .catch((error) => {
          console.error("Error fetching leaderboard:", error);
        });
    }
  }, [user]);

  return (
    <>
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={HomeHeaderTitle} headerText="Home" />
      <div className="home-main-container">
        <div className="home-content-wrapper">
          <div className="user-profile">
            <Userprofile />
          </div>

          <div className="home-content-scroll-wrapper">
            <h1 className="rank-title">Rank</h1>
            <div className="rank-container">
              <div className="merit">
                <h2>{(user?.rank && user.rank !== "Unranked") ? user.rank : "No badge yet!"}</h2>
              </div>
              <div className="leaderboard-rank" onClick={() => navigate("/leaderboard")} style={{ cursor: "pointer" }}>
                <h2 className="rank-number-container">
                  <span className="rank-label">Leaderboards</span>
                  <div className="rank-icon-container">
                    <span className="user-rank-number">
                      {userRank ? `#${userRank}` : "Not ranked"}
                    </span>
                  </div>
                </h2>
              </div>
            </div>

            <div className="submission-container">
              <div className="submission-content">
                <div className="submission-text">
                  <h1>Activity</h1>
                  <div className="points-display">
                    <h2>Total Points: {currentPoints}</h2>
                  </div>
                  <div className="submission-items-display">
                    <h2>Submissions:</h2>
                    <span className="submission-count">{submissionCount}</span>
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
                  {currentBadge ? (
                    <>
                      <img
                        src={currentBadge.image}
                        alt={currentBadge.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = Badge;
                        }}
                      />
                      <p>{currentBadge?.description}</p>
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        padding: "8px 4px",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          fontFamily: "Tahoma",
                          fontWeight: 400,
                          fontSize: "0.8rem",
                          lineHeight: "1.4",
                          margin: 0,
                        }}
                      >
                        No badge yet! Submit your first e-waste to start earning.
                      </p>
                      <button
                        onClick={() => navigate("/ewastesubmission")}
                        style={{
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          borderRadius: "20px",
                          padding: "9px 20px",
                          fontSize: "0.78rem",
                          fontFamily: "Tahoma",
                          cursor: "pointer",
                          fontWeight: 700,
                          letterSpacing: "0.4px",
                          boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Submit E-Waste
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="next-reward-item" onClick={() => navigate("/achievements")} style={{ cursor: "pointer" }}>
                <h1>Next Badge</h1>
                <div className="next-reward-image-container">
                  <img
                    src={nextBadge?.image || NextBadge}
                    alt={nextBadge?.name || "Next Badge"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = NextBadge;
                    }}
                  />
                  <p>
                    {nextBadge
                      ? `Earn ${nextBadge.pointsRequired} exp to unlock`
                      : "Earn 100 points to unlock"}
                  </p>
                </div>
                <img src={LockIcon} alt="Locked" className="overlay-image" />
              </div>
            </div>

            <div className="home-divider"></div>

            <div className="rewards-preview-container" onClick={() => navigate("/rewards")} style={{ cursor: "pointer" }}>
              <img
                src={SmartDevicesIcon}
                alt="Reward Mascot"
                className="reward-mascot"
              />
              <div className="reward-text-container">
                <img src={SmartIcon} alt="Smart Logo" className="smart-logo" />
                <p className="reward-description">
                  Get a FREE load after unlocking the badge
                </p>
              </div>
            </div>
          </div>

       
        </div>
      </div>
    </>
  );
}
