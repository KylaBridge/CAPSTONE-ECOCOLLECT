import { toast } from "react-hot-toast";
import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import "./styles/UserTable.css";
import { FaSearch } from "react-icons/fa";
import AdminButton from "./AdminButton";

export default function UserTable({ onViewUser, viewedUser }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [roleSubSort, setRoleSubSort] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRoleSubmenu, setShowRoleSubmenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (showAll) {
      setSearchResults(users);
      setSearchTerm("");
    } else {
      handleSearch();
    }
  }, [users, showAll]);


  const sortedResults = useMemo(() => {
    let sorted = [...searchResults];
    if (sortOption === "name") {
      sorted.sort((a, b) => a.email.localeCompare(b.email));
    } else if (sortOption === "role" && roleSubSort) {
      sorted = sorted.filter(user => user.role === roleSubSort);
    }
    return sorted;
  }, [searchResults, sortOption, roleSubSort]);

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

  const fetchUsers = () => {
    axios
      .get("/api/ecocollect/usermanagement")
      .then((response) => {
        setUsers(response.data);
        setShowAll(true);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleView = (user) => {
    if (viewedUser?._id === user._id) {
      onViewUser(null);
    } else {
      onViewUser(user);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
    setShowAll(false);
  };

  const handleSearch = () => {
    const results = users.filter((user) => {
      const searchRegex = new RegExp(searchTerm, 'i');
      return (
        searchRegex.test(user.email) ||
        searchRegex.test(user.role) ||
        (user._id && searchRegex.test(user._id))
      );
    });
    setSearchResults(results);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setShowAll(false);
    handleSearch();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setShowAll(false);
      handleSearch();
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

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
              {sortOption === "role" && roleSubSort && ` : Role (${roleSubSort})`}
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
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <h2 className="user-title">Users</h2>

        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search User"
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyPress}
            />
            <button type="submit" className="search-icon-button">
              <FaSearch style={{ fontSize: '16px', color: '#245a1e' }} />
            </button>
          </div>
          {!showAll && (
            <button type="button" className="show-all-button" onClick={handleShowAll}>
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
              sortedResults.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>Placeholder</td> 
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>Placeholder</td> 
                  <td>Placeholder</td>
                  <td>
                    <AdminButton 
                      type="view" 
                      size="small"
                      isActive={viewedUser?._id === user._id}
                      onClick={() => handleView(user)}
                    >
                      {viewedUser?._id === user._id ? 'CLOSE' : 'VIEW'}
                    </AdminButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-users">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
