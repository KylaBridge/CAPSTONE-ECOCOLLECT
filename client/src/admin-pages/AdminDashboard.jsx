import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import { FaUserAlt } from "react-icons/fa";
import { FaLaptop, FaMobileAlt, FaPlug, FaBatteryHalf } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdCable } from "react-icons/md";
import './styles/AdminDashboard.css';

export default function AdminDashboard(){
    return (
        <>
            <AdminSidebar/>
            <div className="admin-container">
                <Header 
                    pageTitle="Dashboard Overview" 
                    adminName="Admin Name" 
                />
                <div className="top-section">
                    <div className="total-users-container">
                        <h2>Total Users Registered</h2>
                        <div className="user-grid">
                            <div className="user-card">
                            <FaUserAlt className="icon"  size={65}/>
                            <p>Student</p>
                            <h3>30</h3>
                            </div>
                            <div className="user-card">
                            <FaUserAlt className="icon"  size={65}/>
                            <p>Faculty</p>
                            <h3>12</h3>
                            </div>
                            <div className="user-card">
                            <FaUserAlt className="icon"  size={65} />
                            <p>Staff</p>
                            <h3>100</h3>
                            </div>
                        </div>

                        <div className="total-bar">
                            <strong>Total: 142</strong>
                        </div>
                    </div>

                    <div className="ewaste-collected-container">
                        <h2>Top E-Waste Collected</h2>
                        <div className = "ewaste-grid">

                        <div className="ewaste-total-wrapper">
                            <div className="ewaste-total">
                            <h3>Total:</h3>
                            <span className="total-number">60</span>
                            <p>pcs</p>
                            </div>

                            <div className="view-details-container">
                            <a href="#">View Details</a>
                            </div>
                        </div>

                            <div className="ewaste-categories">

                                 <h4 className="ewaste-label">Categories</h4>
                                <div className="ewaste-breakdown">
                                    <div className="ewaste-item">
                                        <FaMobileAlt size={45} className="ewaste-icon" />
                                        <p>Mobile</p>
                                        <span>5 pcs</span>
                                    </div>

                                <div className="ewaste-item">
                                    <FaLaptop size={45} className="ewaste-icon" />
                                    <p>Laptop</p>
                                    <span>15 pcs</span>
                                </div>
                                <div className="ewaste-item">
                                    <BsFillTelephoneFill size={45} className="ewaste-icon" />
                                    <p>Communication</p>
                                    <span>10 pcs</span>
                                </div>
                                <div className="ewaste-item">
                                    <MdCable size={45} className="ewaste-icon" />
                                    <p>Cable</p>
                                    <span>5 pcs</span>
                                </div>
                                <div className="ewaste-item">
                                    <FaBatteryHalf size={45} className="ewaste-icon" />
                                    <p>Battery</p>
                                    <span>15 pcs</span>
                                </div>
                                <div className="ewaste-item">
                                    <FaPlug size={45} className="ewaste-icon" />
                                    <p>Power Accessories</p>
                                    <span>10 pcs</span>
                                </div>
                            </div>   
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}