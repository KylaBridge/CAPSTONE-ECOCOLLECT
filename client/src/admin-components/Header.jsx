import React from "react";
import PropTypes from "prop-types";
import "./styles/Header.css";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const Header = ({ pageTitle }) => {
  const { user } = useContext(UserContext);

  // Get the first letter of the email, or "A" as fallback
  const emailInitial = user?.email ? user.email.charAt(0).toUpperCase() : "A";

  return (
    <div className="header-container">
      <div className="page-title">
        <h1>{pageTitle}</h1>
      </div>
      <div className="admin-profile">
        <div className="admin-details">
          <div className="admin-name">{user?.email || "Loading..."}</div>
          <div className="admin-role">
            {user?.role === "superadmin" ? "Super Admin" : "Admin"}
          </div>
        </div>
        {/* Show initial in a circle if no profilePicture */}
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Admin Profile"
            className="admin-icon"
          />
        ) : (
          <div className="admin-initial-avatar">{emailInitial}</div>
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  adminName: PropTypes.string.isRequired,
};

export default Header;
