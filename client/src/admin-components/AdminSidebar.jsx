import "./styles/AdminSidebar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineBarChart,
  AiOutlineMonitor,
  AiOutlineCheckSquare,
  AiOutlineTrophy,
  AiOutlineIdcard,
  AiOutlineOrderedList,
  AiOutlineLogout,
} from "react-icons/ai";
import { IoRibbonOutline } from "react-icons/io5";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
// import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, refreshProfile } = useContext(UserContext);

  function loggingOut() {
    // Clear session on server, then immediately clear local state and navigate
    logout()
      .then(() => {
        // toast.success("User logged Out");
        navigate("/admin/login");
      });
  }

  return (
    <nav className="admin-sidebar">
      <img
        className="admin-sidebarlogo"
        src={EcoCollectLogo}
        alt="Ecocollect-Logo"
      />
      <div className="divider"></div>

      <div className="sidebar-content">
        <ul className="admin-sidebar-ul">
          <Link
            to="/admin/dashboard"
            className={location.pathname === "/admin/dashboard" ? "active" : ""}
            title="Dashboard"
          >
            <li>
              <AiOutlineHome size={20} /> <span>Dashboard</span>
            </li>
          </Link>
          <Link
            to="/admin/usermanagement"
            className={
              location.pathname === "/admin/usermanagement" ? "active" : ""
            }
            title="User Management"
          >
            <li>
              <AiOutlineUser size={20} /> <span>User Management</span>
            </li>
          </Link>
          <Link
            to="/admin/analyticsdashboard"
            className={
              location.pathname === "/admin/analyticsdashboard" ? "active" : ""
            }
            title="Analytics Dashboard"
          >
            <li>
              <AiOutlineBarChart size={20} /> <span>Analytics Dashboard</span>
            </li>
          </Link>
          <Link
            to="/admin/ewastebin"
            className={location.pathname === "/admin/ewastebin" ? "active" : ""}
            title="E-Waste Bin Monitoring"
          >
            <li>
              <AiOutlineMonitor size={20} /> <span>E-Waste Bin Monitoring</span>
            </li>
          </Link>
          <Link
            to="/admin/ewastesubmit"
            className={
              location.pathname === "/admin/ewastesubmit" ? "active" : ""
            }
            title="E-Waste Submit Validation"
          >
            <li>
              <AiOutlineCheckSquare size={20} /> <span>E-Waste Submit Validation</span>
            </li>
          </Link>
          <Link
            to="/admin/achieversmodule"
            className={
              location.pathname === "/admin/achieversmodule" ? "active" : ""
            }
            title="Achievers Module"
          >
            <li>
              <AiOutlineTrophy size={20} /> <span>Achievers Module</span>
            </li>
          </Link>
          <Link
            to="/admin/badgemanagement"
            className={
              location.pathname === "/admin/badgemanagement" ? "active" : ""
            }
            title="Badge Management"
          >
            <li>
              <AiOutlineIdcard size={20} /> <span>Badge Management</span>
            </li>
          </Link>
          <Link
            to="/admin/rewardmanagement"
            className={
              location.pathname === "/admin/rewardmanagement" ? "active" : ""
            }
            title="Reward Management"
          >
            <li>
              <IoRibbonOutline size={20} /> <span>Reward Management</span>
            </li>
          </Link>
          <Link
            to="/admin/activitylog"
            className={
              location.pathname === "/admin/activitylog" ? "active" : ""
            }
            title="Activity Log"
          >
            <li>
              <AiOutlineOrderedList size={20} /> <span>Activity Log</span>
            </li>
          </Link>
        </ul>

        <button className="loggingOut" onClick={loggingOut}>
          <AiOutlineLogout size={18} /> <span>LOGOUT</span>
        </button>
      </div>
    </nav>
  );
}
