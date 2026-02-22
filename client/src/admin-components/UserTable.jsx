import { toast } from "react-hot-toast";
import { useEffect, useState, useRef, useMemo } from "react";
import { userAPI } from "../api/user";
import { activityLogAPI } from "../api/activityLog";
import { ewasteAPI } from "../api/ewaste";
import "./styles/UserTable.css";
import { FaSearch } from "react-icons/fa";
import AdminButton from "./AdminButton";

export default function UserTable({
  onViewUser,
  viewedUser,
  currentUserRole,
  refreshTrigger,
  onAddUser,
}) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [roleSubSort, setRoleSubSort] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRoleSubmenu, setShowRoleSubmenu] = useState(false);
  const [userActivities, setUserActivities] = useState({});
  const [userContributions, setUserContributions] = useState({});
  const dropdownRef = useRef(null);

  // Fetch users, activities, and contributions
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const usersRes = await userAPI.getAllUsers();

        // Filter users based on current user role
        let filteredUsers = usersRes.data;
        if (currentUserRole === "admin") {
          // Admin can only see users, not other admins or superadmins
          filteredUsers = usersRes.data.filter((user) => user.role === "user");
        } else if (currentUserRole === "superadmin") {
          // Super admin can see users and admins, but not other superadmins
          filteredUsers = usersRes.data.filter(
            (user) => user.role === "user" || user.role === "admin",
          );
        }

        setUsers(filteredUsers);
        setShowAll(true);

        const [activityRes, ewasteRes] = await Promise.all([
          activityLogAPI.getAllActivityLogs(),
          ewasteAPI.getAllSubmissions(),
        ]);

        // Group activity logs by userId
        const grouped = {};
        activityRes.data.forEach((log) => {
          if (!grouped[log.userId]) grouped[log.userId] = [];
          grouped[log.userId].push(log);
        });
        setUserActivities(grouped);

        // Count approved e-waste submissions per userId
        const counts = {};
        ewasteRes.data.forEach((sub) => {
          const uid = sub.user?._id || sub.user;
          // Only count approved submissions
          if (uid && sub.status === "Approved") {
            counts[uid] = (counts[uid] || 0) + 1;
          }
        });
        setUserContributions(counts);
      } catch {
        setUserActivities({});
        setUserContributions({});
      }
    };
    fetchAllData();
  }, [currentUserRole, refreshTrigger]);

  // Handle search/filter logic
  useEffect(() => {
    if (showAll) {
      setSearchResults(users);
      setSearchTerm("");
    } else {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [users, showAll]);

  // Sort results
  const sortedResults = useMemo(() => {
    let sorted = [...searchResults];
    if (sortOption === "name") {
      sorted.sort((a, b) => a.email.localeCompare(b.email));
    } else if (sortOption === "role" && roleSubSort) {
      sorted = sorted.filter((user) => user.role === roleSubSort);
    }
    return sorted;
  }, [searchResults, sortOption, roleSubSort]);

  // Handle dropdown close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowRoleSubmenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search helpers
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
    setShowAll(false);
  };

  const handleSearch = () => {
    const results = users.filter((user) => {
      const searchRegex = new RegExp(searchTerm, "i");
      return (
        searchRegex.test(user.email) ||
        searchRegex.test(user.role) ||
        (user._id && searchRegex.test(user._id))
      );
    });
    setSearchResults(results);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setShowAll(false);
      handleSearch();
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  // Render
  return (
    <div className="usertable">
      <div className="usertable-header">
        <div className="left-controls">
          <div className="usertable-sort-dropdown" ref={dropdownRef}>
            <button
              className="usertable-sort-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              type="button"
            >
              Sort By
              {sortOption === "name" && " : Name"}
              {sortOption === "role" &&
                roleSubSort &&
                ` : Role (${roleSubSort})`}
            </button>
            {showDropdown && (
              <div className="usertable-dropdown-menu">
                <div
                  className="usertable-dropdown-item"
                  onClick={() => {
                    setSortOption("name");
                    setRoleSubSort("");
                    setShowDropdown(false);
                  }}
                >
                  Name
                </div>
                <div
                  className="usertable-dropdown-item status-parent"
                  onMouseEnter={() => setShowRoleSubmenu(true)}
                  onMouseLeave={() => setShowRoleSubmenu(false)}
                >
                  Role &raquo;
                  {showRoleSubmenu && (
                    <div className="usertable-submenu">
                      <div
                        className="usertable-submenu-item"
                        onClick={() => {
                          setSortOption("role");
                          setRoleSubSort("admin");
                          setShowDropdown(false);
                          setShowRoleSubmenu(false);
                        }}
                      >
                        Admin
                      </div>
                      <div
                        className="usertable-submenu-item"
                        onClick={() => {
                          setSortOption("role");
                          setRoleSubSort("user");
                          setShowDropdown(false);
                          setShowRoleSubmenu(false);
                        }}
                      >
                        User
                      </div>
                      {currentUserRole === "superadmin" && (
                        <div
                          className="usertable-submenu-item"
                          onClick={() => {
                            setSortOption("role");
                            setRoleSubSort("superadmin");
                            setShowDropdown(false);
                            setShowRoleSubmenu(false);
                          }}
                        >
                          Super Admin
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <h2 className="user-title">Users</h2>

        <div className="search-container">
          {currentUserRole === "superadmin" && (
            <AdminButton type="add" size="medium" onClick={onAddUser}>
              Add User
            </AdminButton>
          )}
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search User"
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyPress}
            />
            <button
              type="submit"
              className="search-icon-button"
              onClick={handleSearch}
            >
              <FaSearch style={{ fontSize: "16px", color: "#245a1e" }} />
            </button>
          </div>
          {!showAll && (
            <button
              type="button"
              className="show-all-button"
              onClick={handleShowAll}
            >
              Show All
            </button>
          )}
        </div>
      </div>

      <div className="usertable-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Activity</th>
              <th>Total Contributions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.length > 0 ? (
              sortedResults.map((user) => {
                const activities = userActivities[user._id] || [];
                const lastActivity =
                  activities.length > 0
                    ? activities.sort(
                        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
                      )[0]
                    : null;
                const totalContributions = userContributions[user._id] || 0;
                return (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {lastActivity
                        ? `${lastActivity.action} (${new Date(
                            lastActivity.timestamp,
                          ).toLocaleString()})`
                        : "No activity"}
                    </td>
                    <td>{totalContributions}</td>
                    <td>
                      <AdminButton
                        type="view"
                        size="small"
                        isActive={viewedUser?._id === user._id}
                        onClick={() => {
                          if (viewedUser?._id === user._id) onViewUser(null);
                          else onViewUser(user);
                        }}
                      >
                        {viewedUser?._id === user._id ? "CLOSE" : "VIEW"}
                      </AdminButton>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="no-users">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
