import { useState, useContext, useEffect } from "react"
import { UserContext } from "../context/userContext";
import "../pages/styles/HomePage.css"
import Userprofile from "../components/Userprofile";
import Header from "../components/Header"
import HomeHeaderTitle from "../assets/headers/home-header.png"
import Badge from "../assets/badges/current-badge.png"
import LockIcon  from "../assets/icons/lockicon.png"
import NextBadge from "../assets/badges/next-badge.png"
import SubmissionCharacter from "../assets/icons/submissionchar.png"
import SmartDevicesIcon from "../assets/icons/smartdevicesicon.png"
import SmartIcon from "../assets/icons/smarticon.png"
import Sidebar from "../components/Sidebar"
import axios from "axios";

export default function Home() {
    const [showNavbar, setShowNavbar] = useState(false)
    const { user, loading } = useContext(UserContext);
    const [submissionCount, setSubmissionCount] = useState(0);

    const currentPoints = user?.points || 0;

    useEffect(() => {
        if (user) {
            // Fetch submission count
            axios
                .get(`/api/ecocollect/ewaste/user/${user._id}/count`)
                .then((response) => {
                    setSubmissionCount(response.data.submissionCount);
                })
                .catch((error) => {
                    console.error("Error fetching submission count:", error);
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
                        <Userprofile/>
                    </div>

                    <h1 className="rank-title">Highest Rank</h1>
                    <div className="rank-container">
                        <div className="merit">
                            <h2>{user?.rank || "Loading..."}</h2>
                        </div>
                        <div className="leaderboard-rank">
                            <h2 className="rank-number-container">
                                <span className="rank-label">Leaderboards</span>
                                <div className="rank-icon-container">
                                    <span className="user-rank-number">coming soon..</span>
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
                                    <span className="submission-count">{submissionCount} Items</span>
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
                            <img src={LockIcon} alt="Locked" className="overlay-image" />
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
            </div>
        </>
    )
}