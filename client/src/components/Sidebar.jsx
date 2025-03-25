import { Link, useNavigate } from "react-router";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import "./styles/Sidebar.css";

export default function Sidebar({isShown, setIsShown}) {
    const navigate = useNavigate()

    function toggleNavbar() {
        setIsShown(prev => !prev)
    }

    function loggingOut() {
        navigate("/")
    }

    return (
        <nav className={isShown ? "navShown" : "navHidden"}>
            <h1 className="toggleBtn" onClick={toggleNavbar}>☰</h1>
            <img src={EcoCollectLogo} alt="EcoCollect-Logo" />
            <div className="divider"></div>
            <ul>
                <Link to="/home"><li>HOME</li></Link>
                <Link to="/wastesubmission"><li>E-WASTE SUBMISSION</li></Link>
                <Link to="/achievements"><li>ACHIEVEMENTS & BADGES</li></Link>
                <Link to="/rewards"><li>REWARDS</li></Link>
                <Link to="/settings"><li>SETTINGS & HELP</li></Link>
            </ul>
            <button onClick={loggingOut}>LOG OUT</button>
        </nav>
    );
}