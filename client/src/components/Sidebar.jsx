import { Link, useNavigate, useLocation  } from "react-router";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import { AiOutlineHome, AiOutlineTrophy, AiOutlineCrown, AiOutlineSetting, AiOutlineFileDone, AiOutlineLogout } from 'react-icons/ai';
import "./styles/Sidebar.css";

export default function Sidebar({ isShown, setIsShown }) {
    const navigate = useNavigate();
    const location = useLocation();


    function toggleNavbar() {
        setIsShown(prev => !prev);
    }

    function loggingOut() {
        navigate("/");
    }

    return (
        <nav className={isShown ? "navShown" : "navHidden"}>
            <h1 className="toggleBtn" onClick={toggleNavbar}>☰</h1>
            <img src={EcoCollectLogo} alt="EcoCollect-Logo" />
            <div className="divider"></div>
            <ul>
                <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
                    <li><AiOutlineHome size={20} /> HOME</li>
                </Link>
                <Link to="/ewastesubmission" className={location.pathname === '/ewastesubmission' ? 'active' : ''}>
                    <li><AiOutlineFileDone size={20} /> E-WASTE SUBMISSION</li>
                </Link>
                <Link to="/achievements" className={location.pathname === '/achievements' ? 'active' : ''}>
                    <li><AiOutlineCrown size={20} /> ACHIEVEMENTS & BADGES</li>
                </Link>
                <Link to="/rewards" className={location.pathname === '/rewards' ? 'active' : ''}>
                    <li><AiOutlineTrophy size={20} /> REWARDS</li>
                </Link>
                <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
                    <li><AiOutlineSetting size={20} /> SETTINGS & HELP</li>
                </Link>
            </ul>
            <button onClick={loggingOut}>
                <AiOutlineLogout size={18} /> LOG OUT
            </button>
        </nav>
    );
}
