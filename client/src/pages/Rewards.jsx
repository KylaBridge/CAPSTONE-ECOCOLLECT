import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import "./styles/Rewards.css";
import Header from "../components/Header";
import RewardsContainer from "../components/RewardsContainer";
import RewardsHeader from "../assets/headers/rewards-header.png";
import Sidebar from "../components/Sidebar";
import { toast } from "react-hot-toast";

export default function Rewards() {
  const [showNavbar, setShowNavbar] = useState(false);
  const { user } = useContext(UserContext);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [claimStub, setClaimStub] = useState("");
  const [insufficientPoints, setInsufficientPoints] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentPoints = user?.points || 0;

  // Fetch rewards from backend
  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/ecocollect/rewards");
      const formattedRewards = response.data.map(reward => ({
        id: reward._id,
        name: reward.name,
        price: reward.points,
        description: reward.description,
        img: reward.image ? `http://localhost:3000/${reward.image.path}` : null
      }));
      setRewards(formattedRewards);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      toast.error("Failed to load rewards");
      setLoading(false);
    }
  };

  const handleRewardClick = (reward) => {
    setSelectedReward(reward);
    setIsModalOpen(true);
    setRedeemSuccess(false);
    setClaimStub("");
    setInsufficientPoints(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReward(null);
  };

  const handleRedeem = () => {
    if (!selectedReward) return;

    if (currentPoints >= selectedReward.price) {
      // TODO: Implement actual redemption through backend
      const stub = Math.random().toString(36).substring(2, 15).toUpperCase();
      setClaimStub(stub);
      setRedeemSuccess(true);
      setInsufficientPoints(false);
    } else {
      setInsufficientPoints(true);
      setRedeemSuccess(false);
      setClaimStub("");
      setTimeout(() => {
        setInsufficientPoints(false);
      }, 3000);
    }
  };

  return (
    <>
      <div className="body-rewards-module">
        <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
        <Header headerImg={RewardsHeader} headerText="Rewards" />

        <div className="rewards-main-container">
          <div className="outer-rewards-container">
            <h1>REWARDS STORE</h1>
            <span>Points: {currentPoints}</span>
          </div>
          <div className="inner-rewards-container">
            {loading ? (
              <div className="loading-message">Loading rewards...</div>
            ) : rewards.length === 0 ? (
              <div className="no-rewards-message">No rewards available at the moment.</div>
            ) : (
              rewards.map((reward) => (
                <RewardsContainer
                  key={reward.id}
                  reward={reward}
                  onRewardClick={handleRewardClick}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedReward && (
        <div className="reward-modal-overlay">
          <div className="reward-modal">
            <button className="modal-close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <img src={selectedReward.img} alt={selectedReward.name} className="modal-image" />
            <h2 className="modal-title">{selectedReward.name}</h2>
            <p className="modal-points">Worth: {selectedReward.price} points</p>
            <div className="modal-description">
              <h3>How to Claim:</h3>
              <p>{selectedReward.description || 'No description available.'}</p>
            </div>

            {!redeemSuccess ? (
              <button
                className="modal-redeem-button"
                onClick={handleRedeem}
                disabled={redeemSuccess}
              >
                Redeem
              </button>
            ) : (
              <div className="redeem-success">
                <h3>Redemption Successful!</h3>
                <p>Your Claim Stub:</p>
                <div className="claim-stub">{claimStub}</div>
              </div>
            )}

            {insufficientPoints && (
              <div className="insufficient-points">Insufficient points!</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}