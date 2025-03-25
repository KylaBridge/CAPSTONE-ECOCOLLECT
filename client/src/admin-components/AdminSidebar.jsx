import './styles/AdminSidebar.css'
import { Link, useNavigate } from "react-router";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";

export default function AdminSidebar() {
    const navigate = useNavigate()

    function loggingOut() {
        navigate("/")
    }

    return (
        <nav>
            <img src={EcoCollectLogo} alt='Ecocollect-Logo' />
            <div className="divider"></div>
            <ul>
                <Link to='/admin/dashboard'> Dashboard </Link>
                <Link to='/admin/usermanagement'> User Management </Link>
                <Link to='/admin/analyticsdashboard'> Analytics Dashboard </Link>
                <Link to='/admin/ewastebin'> E-Waste Bin Monitoring </Link>
                <Link to='/admin/ewastesubmit'> E-Waste Submit Validation </Link>
                <Link to='/admin/achieversmodule'> Achievers Module </Link>
                <Link to='/admin/badgemanagement'> Badge Management </Link>
                <Link to='/admin/activitylog'> Activity Log </Link>
            </ul>
            <button onClick={loggingOut}>LOGOUT</button>
        </nav>
    )
}