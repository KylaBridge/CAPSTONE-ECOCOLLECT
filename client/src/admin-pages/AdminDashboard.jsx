import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import BinTable from "../admin-components/BinTable";
import {
  FaLaptop,
  FaMobileAlt,
  FaPlug,
  FaBatteryHalf,
  FaTshirt,
  FaMobile,
  FaUserAlt,
  FaTrash,
  FaUserShield,
  FaBoxes,
} from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdCable, MdOutlineRouter } from "react-icons/md";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import binIcon from "../assets/icons/binIcon.png";
import "./styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(UserContext);
  const [roleCounts, setRoleCounts] = useState({
    userCount: 0,
    adminCount: 0,
    superadminCount: 0,
  });
  const [redemptionCount, setRedemptionCount] = useState(0);
  const totalUsers =
    roleCounts.userCount + roleCounts.adminCount + roleCounts.superadminCount;

  const [ewasteCount, setEwasteCount] = useState({
    telephoneCount: 0,
    routerCount: 0,
    mobileCount: 0,
    tabletCount: 0,
    laptopCount: 0,
    chargerCount: 0,
    batteryCount: 0,
    cordCount: 0,
    powerbankCount: 0,
    usbCount: 0,
    othersCount: 0,
  });

  const totalEwastes = Object.values(ewasteCount).reduce(
    (sum, val) => sum + val,
    0
  );
  const [binList, setBinList] = useState([]);

  useEffect(() => {
    const fetchRoleCount = async () => {
      try {
        const response = await axios.get("/api/ecocollect/user/role-count");
        setRoleCounts(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchEwasteCount = async () => {
      try {
        const response = await axios.get("/api/ecocollect/user/ewastes");
        setEwasteCount(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRedemptionCount = async () => {
      try {
        const response = await axios.get(
          "/api/ecocollect/rewards/redemption-count"
        );
        setRedemptionCount(response.data.count);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBins = async () => {
      try {
        const response = await axios.get("/api/ecocollect/bins");
        setBinList(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoleCount();
    fetchEwasteCount();
    fetchRedemptionCount();
    fetchBins();
  }, []);

  const iconMap = {
    telephoneCount: {
      label: "Telephone",
      icon: <BsFillTelephoneFill size={30} className="ewaste-icon" />,
    },
    routerCount: {
      label: "Router",
      icon: <MdOutlineRouter size={30} className="ewaste-icon" />,
    },
    mobileCount: {
      label: "Mobile",
      icon: <FaMobileAlt size={30} className="ewaste-icon" />,
    },
    tabletCount: {
      label: "Tablet",
      icon: <FaMobile size={30} className="ewaste-icon" />,
    },
    laptopCount: {
      label: "Laptop",
      icon: <FaLaptop size={30} className="ewaste-icon" />,
    },
    chargerCount: {
      label: "Charger",
      icon: <FaPlug size={30} className="ewaste-icon" />,
    },
    batteryCount: {
      label: "Battery",
      icon: <FaBatteryHalf size={30} className="ewaste-icon" />,
    },
    cordCount: {
      label: "Cords",
      icon: <MdCable size={30} className="ewaste-icon" />,
    },
    powerbankCount: {
      label: "Powerbank",
      icon: <FaBatteryHalf size={30} className="ewaste-icon" />,
    },
    usbCount: {
      label: "USB",
      icon: <FaPlug size={30} className="ewaste-icon" />,
    },
    othersCount: {
      label: "Others",
      icon: <FaBoxes size={30} className="ewaste-icon" />,
    },
  };

  const topCategories = Object.entries(ewasteCount)
    .filter(([key, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Filter bins that need emptying
  const binsNeedEmptying = binList.filter(
    (bin) => bin.status === "Full" || bin.status === "Needs Emptying"
  );

  return (
    <>
      <AdminSidebar />
      <div className="dashboard-container">
        <Header pageTitle="Dashboard Overview" adminName="Admin Name" />

        <div className="admin-dashboard-top-section">
          {/* Total Users */}
          <div className="total-users-container">
            <h2>Total Users Registered</h2>
            <div
              className={`user-grid ${
                user?.role === "admin" ? "admin-only" : ""
              }`}
            >
              <div className="user-card">
                <FaUserAlt className="icon" size={28} />
                <p>Users</p>
                <h3>{roleCounts.userCount || "..."}</h3>
              </div>
              {user?.role === "superadmin" && (
                <>
                  <div className="user-card">
                    <FaUserAlt className="icon" size={28} />
                    <p>Admin</p>
                    <h3>{roleCounts.adminCount || "..."}</h3>
                  </div>
                  <div className="user-card">
                    <FaUserShield className="icon" size={28} />
                    <p>Super Admin</p>
                    <h3>{roleCounts.superadminCount || "..."}</h3>
                  </div>
                </>
              )}
            </div>
            <div className="total-bar">
              <strong>
                {user?.role === "admin"
                  ? roleCounts.userCount || "loading.."
                  : totalUsers || "loading.."}
              </strong>
            </div>
          </div>

          {/* Top E-Waste Collected */}
          <div className="ewaste-collected-container">
            <h2>Top E-Waste Collected</h2>
            <div className="ewaste-grid">
              <div className="ewaste-total-wrapper">
                <div className="ewaste-total">
                  <h3>Total:</h3>
                  <span className="total-number">
                    {totalEwastes || "Loading.."}
                  </span>
                  <p>pcs</p>
                </div>
                <div className="view-details-container">
                  <a href="/admin/analyticsdashboard">View Details</a>
                </div>
              </div>

              <div className="ewaste-categories">
                <h4 className="ewaste-label">Categories</h4>
                <div className="ewaste-breakdown">
                  {topCategories.length > 0 ? (
                    topCategories.map(([key, count]) => (
                      <div key={key} className="ewaste-item">
                        {iconMap[key]?.icon}
                        <p>{iconMap[key]?.label}</p>
                        <span>{count} pcs</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-items-msg">No items to display yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="admin-dashboard-bottom-section">
          {/* Rewards */}
          <div className="reward-container">
            <h2>Reward Redemptions</h2>
            <div className="rewardtotal-bar">
              <strong>Total: {redemptionCount || "..."}</strong>
            </div>
            <div className="rewards-grid">
              <h4 className="rewards-label">Top rewards</h4>
              <div className="rewards-breakdown">
                <div className="reward-item">
                  <FaTshirt size={35} className="ewaste-icon" />
                  <p>NU Merch</p>
                </div>
                <div className="reward-item">
                  <FaMobile size={35} className="ewaste-icon" />
                  <p>Mobile Load</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bins */}
          <div className="ewastebin-container">
            <h2>Bins Need Emptying</h2>
            <div className="bin-content-wrapper">
              <div className="bin-table">
                <BinTable
                  columns={["location", "status"]}
                  data={binsNeedEmptying.map((bin) => ({
                    location: bin.location,
                    status: bin.status,
                  }))}
                  maxHeight="150px"
                />
              </div>
              <div className="bin-summary">
                <div className="bintotal-bar">
                  <span>Total:</span>
                  <strong>{binsNeedEmptying.length}</strong>
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
  );
}
