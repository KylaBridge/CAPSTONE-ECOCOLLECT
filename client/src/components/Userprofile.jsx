import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import "./styles/Userprofile.css";
import ProfilePic from "../assets/icons/profile-pic.png";
import axios from "axios";

export default function Userprofile() {
    const { user } = useContext(UserContext);
    const [submissionCount, setSubmissionCount] = useState(0);

    useEffect(() => {
        if (user) {
            // Fetch submission count
            axios
                .get(`/api/ecocollect/ewaste/user/${user._id}/count`) 
                .then((response) => {
                    setSubmissionCount(response.data.submissionCount);
                })
                .catch((error) => {
                    console.error("Error fetching submission count:", error);
                });
        }
    }, [user]);

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
                            <span className="submissions-count">{submissionCount}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="username">USERNAME</h2>
                        <p className="user-id">ID: ID Placeholder</p>
                        <p className="user-email">Email: email@example.com</p>
                        <div className="submissions-bar">
                            <span className="submissions-label">E-Waste Submitted</span>
                            <span className="submissions-count">0</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
