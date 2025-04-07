import React from 'react';
import PropTypes from 'prop-types';
import './styles/Header.css'; 
import adminIcon from '../assets/icons/profile-pic.png';

const Header = ({ pageTitle, adminName }) => {
    return (
        <div className="header-container">
            <div className="page-title">
                <h1>{pageTitle}</h1>
            </div>
            <div className="admin-profile">
                <div className="admin-details">
                    <div className="admin-name">{adminName}</div>
                    <div className="admin-role">Admin</div>
                </div>
                <img src={adminIcon} alt="Admin Profile" className="admin-icon" />
            </div>
        </div>
    );
};

Header.propTypes = {
    pageTitle: PropTypes.string.isRequired,
    adminName: PropTypes.string.isRequired,
};

export default Header;