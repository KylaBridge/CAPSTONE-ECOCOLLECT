import "./styles/ViewUser.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import React, { useState, useEffect } from "react"; 
import defaultProfileImage from "../assets/icons/profile-pic.png"; 
import AdminButton from "./AdminButton";

export default function ViewUser({ user, onUserDeleted }) {
  const [contributionHistory, setContributionHistory] = useState([]);
  const [rewardsRedeemed, setRewardsRedeemed] = useState([]);
  const [loadingContributions, setLoadingContributions] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) return;

      try {
        // Fetch user's e-waste submissions
        const submissionsResponse = await axios.get(`/api/ecocollect/ewaste/user/${user._id}`);
        const submissions = submissionsResponse.data.map(submission => ({
          _id: submission._id,
          ewasteSubmitted: submission.category,
          date: new Date(submission.createdAt).toLocaleDateString(),
          quantity: 1,
          pointsEarned: submission.status === "Approved" ? 5 : 0
        }));
        setContributionHistory(submissions);
        setLoadingContributions(false);

        // Fetch user's redeemed rewards
        const rewardsResponse = await axios.get(`/api/ecocollect/redeem/user/${user._id}`);
        const rewards = rewardsResponse.data.map(redemption => ({
          _id: redemption._id,
          type: redemption.rewardName,
          date: new Date(redemption.redemptionDate).toLocaleDateString(),
          quantity: 1
        }));
        setRewardsRedeemed(rewards);
        setLoadingRewards(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
        setLoadingContributions(false);
        setLoadingRewards(false);
      }
    };

    fetchUserData();
  }, [user?._id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/ecocollect/usermanagement/${user._id}`);
      toast.success("User deleted successfully");
      onUserDeleted();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  if (!user) {
    return <div className="view-user"><h2>Select a user to view details</h2></div>;
  }

  const renderPlaceholderRows = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <tr key={`placeholder-${index}`}>
        <td className="placeholder"></td>
        <td className="placeholder"></td>
        <td className="placeholder"></td>
        <td className="placeholder"></td>
      </tr>
    ));
  };

  const renderRewardPlaceholderRows = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <tr key={`reward-placeholder-${index}`}>
        <td className="placeholder"></td>
        <td className="placeholder"></td>
        <td className="placeholder"></td>
      </tr>
    ));
  };

  return (
    <div className="view-user">
      <h2>User Profile</h2>

      <div className="details-wrapper">
        <div className="details-left">
          <img
            src={user?.profilePicture || defaultProfileImage}
            alt="User Profile"
            className="user-profile-image"
          />
          <div className="user-details">
            <h3 className="username-title">Name</h3>
            <p className="userprofile-info">Email: {user?.email || 'N/A'}</p>
            <p className="userprofile-info">Role: {user?.role || 'N/A'}</p>
            <p className="userprofile-info">ID: {user?._id || 'N/A'}</p>
            <p className="userprofile-info">Experience Points: {user?.exp || 0}</p>
            <p className="userprofile-info">Current Badge: {user?.rank || 'N/A'}</p>
            <AdminButton 
              type="remove" 
              size="small"
              onClick={handleDelete}
              style={{ marginTop: "1rem" }}
            >
              REMOVE USER
            </AdminButton>
          </div>
        </div>

        <div className="user-contribution-container">
          <div className="user-contribution-section">
            <h3>Contribution History</h3>
            <div className="contribution-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>E-Waste Submitted</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Points Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingContributions ? (
                    renderPlaceholderRows(3)
                  ) : contributionHistory.length > 0 ? (
                    contributionHistory.map(contribution => (
                      <tr key={contribution._id}>
                        <td>{contribution.ewasteSubmitted}</td>
                        <td>{contribution.date}</td>
                        <td>{contribution.quantity}</td>
                        <td>{contribution.pointsEarned}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-data">No contribution history to show</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="user-rewards-section">
            <h3>Rewards Redeemed</h3>
            <div className="redeemed-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRewards ? (
                    renderRewardPlaceholderRows(2)
                  ) : rewardsRedeemed.length > 0 ? (
                    rewardsRedeemed.map(reward => (
                      <tr key={reward._id}>
                        <td>{reward.type}</td>
                        <td>{reward.date}</td>
                        <td>{reward.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-data">No rewards redeemed yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
