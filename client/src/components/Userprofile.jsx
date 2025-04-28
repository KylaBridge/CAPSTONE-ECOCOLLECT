import "./styles/Userprofile.css";
import ProfilePic from "../assets/icons/profile-pic.png";

import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Userprofile() {
    const {user} = useContext(UserContext)
    const totalSubmissions = user?.submissionCount;

    return (
        <div className="profile-container">
             <img src={user?.profilePicture || ProfilePic} alt="profile picture" className="profile-pic" />
                  <div className="profile-details">
                  {!!user ? (
                    <>
                    <h2 className="username">{user.username || 'USERNAME'}</h2>
                    <p className="user-id">ID: {user._id ? user._id.slice(-8) : 'ID Placeholder'}</p>
                    <p className="user-email">Email: {user.email || 'email@example.com'}</p>
                    <div className="submissions-bar">
                        <span className="submissions-label">E-Waste Submitted</span>
                        <span className="submissions-count">{totalSubmissions !== undefined ? totalSubmissions : '0'}</span>
                    </div>
                </>
                ) : (
                    <>
                        <h2 className="username">USERNAME</h2>
                        <p className="user-id">ID: ID Placeholder</p>
                        <p className="user-email">Email: email@example.com</p>
                        <div className="submissions-bar">
                            <span className="submissions-label">E-Waste Submitted</span>
                            <span className="submissions-count">10</span>
                        </div>
                    </>        
                )}
            </div>
        </div>
    );
}
