import "./styles/ViewUser.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import React, { useState, useEffect, useContext } from "react";
import defaultProfileImage from "../assets/icons/profile-pic.png";
import AdminButton from "./AdminButton";
import { UserContext } from "../context/userContext";

export default function ViewUser({ user, onUserDeleted, currentUserRole }) {
  const [contributionHistory, setContributionHistory] = useState([]);
  const [rewardsRedeemed, setRewardsRedeemed] = useState([]);
  const [loadingContributions, setLoadingContributions] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [newRole, setNewRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const { user: currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) return;

      try {
        // Fetch user's e-waste submissions
        const submissionsResponse = await axios.get(
          `/api/ecocollect/ewaste/user/${user._id}`
        );
        const submissions = submissionsResponse.data.map((submission) => ({
          _id: submission._id,
          ewasteSubmitted: submission.category,
          date: new Date(submission.createdAt).toLocaleDateString(),
          quantity: 1,
          pointsEarned: submission.status === "Approved" ? 5 : 0,
        }));
        setContributionHistory(submissions);
        setLoadingContributions(false);

        // Fetch user's redeemed rewards
        const rewardsResponse = await axios.get(
          `/api/ecocollect/redeem/user/${user._id}`
        );
        const rewards = rewardsResponse.data.map((redemption) => ({
          _id: redemption._id,
          type: redemption.rewardName,
          date: new Date(redemption.redemptionDate).toLocaleDateString(),
          quantity: 1,
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
    setIsDeleting(true);
    try {
      // Verify password before deletion
      const response = await axios.post(
        "/api/ecocollect/auth/verify-password",
        {
          email: currentUser.email,
          password: passwordConfirmation,
        }
      );

      if (response.data.success) {
        await axios.delete(`/api/ecocollect/usermanagement/${user._id}`);
        toast.success("User deleted successfully");
        setShowDeleteModal(false);
        setPasswordConfirmation("");
        onUserDeleted();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response?.status === 401) {
        toast.error("Incorrect password");
      } else {
        toast.error("Error deleting user");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangeRole = async () => {
    setIsChangingRole(true);
    try {
      // Verify password before role change
      const response = await axios.post(
        "/api/ecocollect/auth/verify-password",
        {
          email: currentUser.email,
          password: passwordConfirmation,
        }
      );

      if (response.data.success) {
        await axios.patch(`/api/ecocollect/usermanagement/role/${user._id}`, {
          role: newRole,
        });
        toast.success(`User role changed to ${newRole} successfully`);
        setShowChangeRoleModal(false);
        setPasswordConfirmation("");
        setNewRole("");
        onUserDeleted(); // Refresh the user data
      }
    } catch (error) {
      console.error("Error changing user role:", error);
      if (error.response?.status === 401) {
        toast.error("Incorrect password");
      } else {
        toast.error("Error changing user role");
      }
    } finally {
      setIsChangingRole(false);
    }
  };

  if (!user) {
    return (
      <div className="view-user">
        <h2>Select a user to view details</h2>
      </div>
    );
  }

  // Get the initial from name (preferred) or email as fallback
  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "?";

  // Decide which avatar image (if any) to show
  const displayAvatar = user?.avatar || user?.profilePicture || null;

  // Check if current user can delete this user
  const canDeleteUser = () => {
    if (currentUserRole === "superadmin") {
      // Super admin can delete users and admins, but not other superadmins
      return user.role !== "superadmin";
    } else if (currentUserRole === "admin") {
      // Regular admin can only delete users
      return user.role === "user";
    }
    return false;
  };

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
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="User Profile"
              className="user-profile-image"
            />
          ) : (
            <div className="user-initial-avatar">{userInitial}</div>
          )}
          <div className="user-details">
            <h3 className="username-title">{user?.name || "Name"}</h3>
            <p className="userprofile-info">Email: {user?.email || "N/A"}</p>
            <p className="userprofile-info">Role: {user?.role || "N/A"}</p>
            <p className="userprofile-info">ID: {user?._id || "N/A"}</p>
            <p className="userprofile-info">
              Experience Points: {user?.exp || 0}
            </p>
            <p className="userprofile-info">
              Current Badge: {user?.rank || "N/A"}
            </p>

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {/* Change Role Button - only for superadmin */}
              {currentUserRole === "superadmin" &&
                user.role !== "superadmin" && (
                  <AdminButton
                    type="primary"
                    size="small"
                    onClick={() => {
                      setNewRole(user.role === "user" ? "admin" : "user");
                      setShowChangeRoleModal(true);
                    }}
                  >
                    CHANGE ROLE
                  </AdminButton>
                )}

              {/* Remove Button - for both admin and superadmin with restrictions */}
              {canDeleteUser() && (
                <AdminButton
                  type="remove"
                  size="small"
                  onClick={() => setShowDeleteModal(true)}
                >
                  REMOVE USER
                </AdminButton>
              )}
            </div>
          </div>
        </div>

        {/* Only show contribution container for users, not for admins */}
        {user.role === "user" && (
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
                      contributionHistory.map((contribution) => (
                        <tr key={contribution._id}>
                          <td>{contribution.ewasteSubmitted}</td>
                          <td>{contribution.date}</td>
                          <td>{contribution.quantity}</td>
                          <td>{contribution.pointsEarned}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data">
                          No contribution history to show
                        </td>
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
                      rewardsRedeemed.map((reward) => (
                        <tr key={reward._id}>
                          <td>{reward.type}</td>
                          <td>{reward.date}</td>
                          <td>{reward.quantity}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="no-data">
                          No rewards redeemed yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="view-user-modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="view-user-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="view-user-modal-title">Confirm User Deletion</h3>
            <p className="view-user-modal-text">
              Are you sure you want to delete{" "}
              <strong>{user?.name || user?.email}</strong>?
            </p>
            <p className="view-user-modal-warning">
              This action cannot be undone. Please enter your password to
              confirm.
            </p>

            <div className="view-user-form-group">
              <label htmlFor="deletePassword" className="view-user-form-label">
                Your Password:
              </label>
              <input
                type="password"
                id="deletePassword"
                className="view-user-form-input"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="view-user-modal-buttons">
              <button
                className="view-user-modal-btn view-user-modal-btn-cancel"
                onClick={() => {
                  setShowDeleteModal(false);
                  setPasswordConfirmation("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="view-user-modal-btn view-user-modal-btn-delete"
                onClick={handleDelete}
                disabled={!passwordConfirmation || isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Confirmation Modal */}
      {showChangeRoleModal && (
        <div
          className="view-user-modal-overlay"
          onClick={() => setShowChangeRoleModal(false)}
        >
          <div
            className="view-user-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="view-user-modal-title">Confirm Role Change</h3>
            <p className="view-user-modal-text">
              Change <strong>{user?.name || user?.email}</strong>'s role from{" "}
              <strong>{user?.role}</strong> to <strong>{newRole}</strong>?
            </p>
            <p className="view-user-modal-warning-role">
              Please enter your password to confirm this action.
            </p>

            <div className="view-user-form-group">
              <label htmlFor="rolePassword" className="view-user-form-label">
                Your Password:
              </label>
              <input
                type="password"
                id="rolePassword"
                className="view-user-form-input"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="view-user-modal-buttons">
              <button
                className="view-user-modal-btn view-user-modal-btn-cancel"
                onClick={() => {
                  setShowChangeRoleModal(false);
                  setPasswordConfirmation("");
                  setNewRole("");
                }}
                disabled={isChangingRole}
              >
                Cancel
              </button>
              <button
                className="view-user-modal-btn view-user-modal-btn-confirm"
                onClick={handleChangeRole}
                disabled={!passwordConfirmation || isChangingRole}
              >
                {isChangingRole ? "Changing..." : "Change Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
