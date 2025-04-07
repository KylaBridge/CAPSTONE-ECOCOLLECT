import "./styles/Userprofile.css";
import ProfilePic from "../assets/icons/profile-pic.png";
import ChipIcon from "../assets/icons/chipIcon2.png";
import ChipIcon2 from "../assets/icons/chipandtrash.png"

import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Userprofile() {
    const {user} = useContext(UserContext)

    return (
        <div className="profile-container">
            <img src={ProfilePic} alt="profile picture" className="profile-pic" />
            <img src={ChipIcon} alt="chip icon" className="chip-icon left" />
            <img src={ChipIcon2} alt="chip icon" className="chip-icon right" />
            <div className="profile-details">
                {!!user && (<h1>{user.email}</h1>)}
                <div className="xp-bar-container">
                    <div className="xp-bar">
                        <div className="xp-progress" style={{ width: "420px" }}></div>
                    </div>
                    <p className="xp-text">XP 420/500</p>
                </div>
            </div>
        </div>
    );
}
