import "./styles/ViewUser.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import React, { useState, useEffect } from "react"; 
import defaultProfileImage from "../assets/icons/profile-pic.png"; 

export default function ViewUser({ user,  onUserDeleted }) {

  const [contributionHistory, setContributionHistory] = useState([]);
  const [rewardsRedeemed, setRewardsRedeemed] = useState([]);
  const [loadingContributions, setLoadingContributions] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);

   // Temporary place holder for simulation of data for the reward and contribution table
   useEffect(() => {
    setTimeout(() => {
        //fetch user's contribution history
        const sampleContributions = [
            { _id: 'c1', ewasteSubmitted: 'Laptop', date: '01-21-24', quantity: 1, pointsEarned: 10 },
            { _id: 'c2', ewasteSubmitted: 'Router', date: '01-21-24', quantity: 1, pointsEarned: 15 },
            { _id: 'c3', ewasteSubmitted: 'Router', date: '01-21-24', quantity: 1, pointsEarned: 15 },
            
        ];
        setContributionHistory(sampleContributions);
        setLoadingContributions(false);
    }, 1500);

    //etching rewards redeemed
    setTimeout(() => {
        //fetch user's reward redemption history
        const sampleRewards = [
            { _id: 'r1', type: 'NU Merch', date: '01-21-25', quantity: 1 },
            { _id: 'r2', type: 'Mobile Load', date: '01-21-24', quantity: 1 },
            { _id: 'r3', type: 'Discount Voucher', date: '02-15-24', quantity: 2 },
            
        ];
        setRewardsRedeemed(sampleRewards);
        setLoadingRewards(false);
    }, 1000);
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

  //place holders we can delete later on
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
                <h3 class="username-title">Name</h3>
                <p className="userprofile-info">Email: {user?.email || 'email@example.com'}</p>
                <p className="userprofile-info">Role: {user?.role || 'Role Placeholder'}</p>
                <p className="userprofile-info">ID: {user?._id || 'ID Placeholder'}</p>
                <button className="delete-btn" onClick={handleDelete} style={{ marginTop: "1rem" }}>
                  REMOVE USER
                </button>
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
