import { Link, useLocation } from "react-router-dom";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import {
  AiOutlineHome,
  AiOutlineTrophy,
  AiOutlineCrown,
  AiOutlineFileDone,
  AiOutlineLogout,
} from "react-icons/ai";
import { toast } from "react-hot-toast";
import "./styles/Sidebar.css";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Sidebar({ isShown, setIsShown }) {
  const location = useLocation();
  const { logout } = useContext(UserContext);

  function toggleNavbar() {
    setIsShown((prev) => !prev);
  }

  function loggingOut() {
    logout().then(() => {
      toast.success("User logged Out");
    });
  }

  return (
    <>
      {/* Dark translucent overlay */}
      <div
        className={`sidebar-overlay ${isShown ? 'show' : ''}`}
        onClick={() => setIsShown(false)}
        aria-hidden={!isShown}
      />
      {/* Toggle button placed outside nav so it stays visible when sidebar is hidden */}
      <button
        className={`toggleBtn ${isShown ? 'open' : ''}`}
        onClick={toggleNavbar}
        aria-label={isShown ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {isShown ? '×' : '☰'}
      </button>
      <nav className={isShown ? "navShown" : "navHidden"}>
        <img
          className="user-sidebar-logo"
          src={EcoCollectLogo}
          alt="EcoCollect-Logo"
        />
        <div className="divider"></div>
        <ul className="user-sidebar-ul">
          <Link
            to="/home"
            className={location.pathname === "/home" ? "active" : ""}
          >
            <li>
              <AiOutlineHome size={20} /> HOME
            </li>
          </Link>
          <Link
            to="/ewastesubmission"
            className={location.pathname === "/ewastesubmission" ? "active" : ""}
          >
            <li>
              <AiOutlineFileDone size={20} /> E-WASTE SUBMISSION
            </li>
          </Link>
          <Link
            to="/achievements"
            className={location.pathname === "/achievements" ? "active" : ""}
          >
            <li>
              <AiOutlineCrown size={20} /> ACHIEVEMENTS & BADGES
            </li>
          </Link>
          <Link
            to="/rewards"
            className={location.pathname === "/rewards" ? "active" : ""}
          >
            <li>
              <AiOutlineTrophy size={20} /> REWARDS
            </li>
          </Link>
        </ul>
        <button onClick={loggingOut}>
          <AiOutlineLogout size={18} /> LOG OUT
        </button>
      </nav>
    </>
  );
}
