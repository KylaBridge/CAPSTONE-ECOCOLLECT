import { useState } from "react"
import "./styles/Rewards.css"
import Header from "../components/Header"
import RewardsData from "../RewardsData"
import RewardsContainer from "../components/RewardsContainer"

import RewardsHeader from "../assets/headers/rewards-header.png"

import Sidebar from "../components/Sidebar"

export default function Rewards() {
  const [showNavbar, setShowNavbar] = useState(false)
  const rewardImg = RewardsData.map((x) => {
    return (
        <RewardsContainer 
        rewardsImg={x.img}
        rewardsPrice={x.price} />
    )
})
  
  return (
    <>
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={RewardsHeader} headerText="Rewards" />

      <div className="rewards-main-container">
          <div className="outer-rewards-container">
              <h1>REWARDS STORE</h1>
              <span>Your points</span>
              <div className="points-bar">
                  <div className="inner-points-bar"></div>
                  <p>40/100</p>
              </div>
          </div>
          <div className="inner-rewards-container">
              {rewardImg}
          </div>
      </div>
      </>
  )
}
