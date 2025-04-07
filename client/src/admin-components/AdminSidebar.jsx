import './styles/AdminSidebar.css'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineHome, AiOutlineUser, AiOutlineBarChart, AiOutlineMonitor, AiOutlineCheckSquare, AiOutlineTrophy, AiOutlineIdcard, AiOutlineOrderedList, AiOutlineLogout } from 'react-icons/ai';
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    function loggingOut() {
        axios.post("/api/ecocollect/auth/logout", {}, {
            withCredentials: true 
        })
        .then(() => {
            toast.success("User logged Out")
            navigate("/")
        })
        .catch(err => {
            console.error("Logout failed:", err)
        });
    }

    return (
        <nav>
            <img src={EcoCollectLogo} alt='Ecocollect-Logo' />
            <div className="divider"></div>

            <div className="sidebar-content">
                <ul>
                    <Link to='/admin/dashboard' className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
                        <li><AiOutlineHome size={20} /> Dashboard</li> 
                    </Link>
                    <Link to='/admin/usermanagement' className={location.pathname === '/admin/usermanagement' ? 'active' : ''}>
                        <li><AiOutlineUser size={20} /> User Management</li> 
                    </Link>
                    <Link to='/admin/analyticsdashboard' className={location.pathname === '/admin/analyticsdashboard' ? 'active' : ''}>
                        <li><AiOutlineBarChart size={20} /> Analytics Dashboard</li> 
                    </Link>
                    <Link to='/admin/ewastebin' className={location.pathname === '/admin/ewastebin' ? 'active' : ''}>
                        <li><AiOutlineMonitor size={20} /> E-Waste Bin Monitoring</li>
                    </Link>
                    <Link to='/admin/ewastesubmit' className={location.pathname === '/admin/ewastesubmit' ? 'active' : ''}>
                        <li><AiOutlineCheckSquare size={20} /> E-Waste Submit Validation</li> 
                    </Link>
                    <Link to='/admin/achieversmodule' className={location.pathname === '/admin/achieversmodule' ? 'active' : ''}>
                        <li><AiOutlineTrophy size={20} /> Achievers Module</li> 
                    </Link>
                    <Link to='/admin/badgemanagement' className={location.pathname === '/admin/badgemanagement' ? 'active' : ''}>
                        <li><AiOutlineIdcard size={20} /> Badge Management</li> 
                    </Link>
                    <Link to='/admin/activitylog' className={location.pathname === '/admin/activitylog' ? 'active' : ''}>
                        <li><AiOutlineOrderedList size={20} /> Activity Log</li> 
                    </Link>
                </ul>

                <button className="loggingOut" onClick={loggingOut}>
                    <AiOutlineLogout size={18} /> LOGOUT
                </button>
            </div>
        </nav>
    )
}
