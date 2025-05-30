import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/UserTable.css";
import { FaSearch } from "react-icons/fa";
import AdminButton from "./AdminButton";


export default function UserTable({ onViewUser, viewedUser }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAll, setShowAll] = useState(true); 

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
                  <select className="sort-dropdown">
                  <option value="">Sort By</option>
                  <option value="name">Name</option>
                  <option value="points">Total Contributions</option>
                  </select>
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
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
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
                <td colSpan="4" className="no-users">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
 
    </div>
  );
}
