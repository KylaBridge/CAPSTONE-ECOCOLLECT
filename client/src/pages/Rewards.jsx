import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import "./styles/Rewards.css";
import Header from "../components/Header";
import RewardsData from "../RewardsData";
import RewardsContainer from "../components/RewardsContainer";
import RewardsHeader from "../assets/headers/rewards-header.png";
import Sidebar from "../components/Sidebar";

export default function Rewards() {
  const [showNavbar, setShowNavbar] = useState(false);
  const { user } = useContext(UserContext);

  const currentPoints = user?.points || 0;
  const level = Math.floor(currentPoints / 100);
  const levelStart = level * 100;
  const levelEnd = (level + 1) * 100;
  const progressPercent = ((currentPoints - levelStart) / (levelEnd - levelStart)) * 100;

  const rewardImg = RewardsData.map((x) => (
    <RewardsContainer key={x.id} rewardsImg={x.img} rewardsPrice={x.price} />
  ));

  return (
    <>
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={RewardsHeader} headerText="Rewards" />

      <div className="rewards-main-container">
        <div className="outer-rewards-container">
          <h1>REWARDS STORE</h1>
          <span>Your points</span>
          <div className="points-bar">
            <div
              className="inner-points-bar"
              style={{ width: `${progressPercent}%` }}
            ></div>
            <p>{`${currentPoints}/${levelEnd}`}</p>
          </div>
        </div>
        <div className="inner-rewards-container">{rewardImg}</div>
      </div>
    </>
  );
}
