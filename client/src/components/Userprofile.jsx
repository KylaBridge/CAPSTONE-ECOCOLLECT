import "./styles/Userprofile.css";
import ProfilePic from "../assets/icons/profile-pic.png";

import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Userprofile() {
    const {user} = useContext(UserContext)

    const currentPoints = 50;
    const totalPoints = 100;
    const progressPercent = (currentPoints / totalPoints) * 100;

    return (
        <div className="profile-container">
            <img src={ProfilePic} alt="profile picture" className="profile-pic" />
            <div className="profile-details">
                {!!user && (<h1>{user.email}</h1>)}
                <div className="exp-bar">
                    <div className="progress-bar" style={{ width: `${progressPercent}%` }}>
                        <span className="progress-text-inside">XP {`${currentPoints}/${totalPoints}`}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
