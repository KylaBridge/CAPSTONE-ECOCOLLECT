import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import BinTable from "../admin-components/BinTable";
import { FaLaptop, FaMobileAlt, FaPlug, FaBatteryHalf, FaTshirt, FaMobile, FaUserAlt,FaTrash} from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdCable } from "react-icons/md";
import binIcon from "../assets/icons/binIcon.png"

import './styles/AdminDashboard.css';

export default function AdminDashboard(){

    const adminBinData = [
        {
          binId: 'BIN-001',
          binName: 'NU Manila Gate Bin',
          location: 'Gate 2',
          status: 'Full',
          category: 'Plastic',
        },
        {
          binId: 'BIN-002',
          binName: 'NU Fairview Hall A',
          location: 'Hall A',
          status: 'Overflowing',
          category: 'E-waste',
        },
        {
            binId: 'BIN-003',
            binName: 'NU Fairview Hall B',
            location: 'Hall B',
            status: 'Overflowing',
            category: 'E-waste',
          },
          {
            binId: 'BIN-004',
            binName: 'NU Fairview Hall c',
            location: 'Hall BV',
            status: 'Overflowing',
            category: 'E-waste',
          },
          {
            binId: 'BIN-004',
            binName: 'NU Fairview Hall c',
            location: 'Hall BV',
            status: 'Overflowing',
            category: 'E-waste',
          },
          {
            binId: 'BIN-004',
            binName: 'NU Fairview Hall c',
            location: 'Hall BV',
            status: 'Overflowing',
            category: 'E-waste',
          },
        // more bins...
      ];

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

                <div className="bottom-section">
                    <div className="reward-container">
                        <h2>Reward Redemptions</h2>

                        <div className="rewardtotal-bar">
                            <strong>Total: 142</strong>
                        </div>

                        <div className="rewards-grid">
                            <h4 className="rewards-label">Top rewards</h4>
                            <div className="rewards-breakdown">
                                <div className="reward-item">
                                <FaTshirt size={45} className="ewaste-icon" />
                                <p>NU Merch</p>
                                </div>
                                <div className="reward-item">
                                <FaMobile size={45} className="ewaste-icon" />
                                <p>Mobile Load</p>
                                </div>
                            </div>
                        </div>
                    </div>
            
            {/* ewaste bin monitoring */}
                    <div className="ewastebin-container">
                      <h2>Bins Need Emptying</h2>
                      <div className="bin-content-wrapper">

                            {/* Table remains on the left */}
                            <div className="bin-table">
                            <BinTable
                                columns={['binName', 'status']} // Make sure BinTable renders a <table>
                                data={adminBinData.filter(bin => bin.status === 'Full' || bin.status === 'Overflowing')} // Example: Filter/limit data if needed
                            />
                            </div>

                            {/* New wrapper for the summary on the right */}
                            <div className="bin-summary">
                                <div className="bintotal-bar">
                                    {/* Using span to separate text and number */}
                                    <span>Total:</span>
                                    {/* Calculate the actual number of bins needing emptying */}
                                    <strong>{adminBinData.filter(bin => bin.status === 'Full' || bin.status === 'Overflowing').length}</strong>
                                </div>
                                <div className="bin-icons">
                                    <img src={binIcon} alt="Trash Bin" className="bin-icon" />
                                    <img src={binIcon} alt="Trash Bin" className="bin-icon" />
                                </div>
                            </div>

                            </div> 
                        </div>


                </div>
            </div>
        </>
    )
}