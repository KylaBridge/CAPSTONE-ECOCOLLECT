import { useState } from "react"
import "../pages/styles/HomePage.css"
import Userprofile from "../components/Userprofile";
import Header from "../components/Header"
import HomeHeaderTitle from "../assets/headers/home-header.png"
import Badge from "../assets/badges/current-badge.png"
import NextBadge from "../assets/badges/next-badge.png"
import Sidebar from "../components/Sidebar"

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false)
  
  return (
    <>
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={HomeHeaderTitle} headerText="Home" />
            <div className="home-main-container">
                <Userprofile className="user-profile"/>
                <h1>Rank</h1>
                <div className="rank-container">
                    <h2>BEGINNER</h2>
                    <h2>RANK PTS 0</h2>
                </div>
                <h1>Submission</h1>
                <div className="submission-container">
                    <h2>Total Points</h2>
                    <div className="submission-bar">
                        <div className="submission-status"></div>
                        <span>40/100</span>
                    </div>
                </div>
                <div className="badge-reward-container">
                    <div className="badge-container">
                        <h1>Current Badge</h1>
                        <img src={Badge} alt="current-badge" />
                    </div>
                    <div className="next-reward-container">
                        <h1>Next Badge</h1>
                        <img src={NextBadge} alt="Next Badge Reward" />
                    </div>
                </div>
                <div className="home-divider"></div>
                <div className="home-divider2"></div>
                <div className="home-divider3"></div>
            </div>
    </>
  )
}
