import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/UserTable.css";
import { FaSearch } from "react-icons/fa";


export default function UserTable({ onViewUser }) {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/ecocollect/usermanagement/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleView = (user) => {
    onViewUser(user)
  }

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
                  <option value="points">Points</option>
                  <option value="role">Role</option>
                  <option value="activity">Activity Level</option>
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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="view-btn" onClick={() => handleView(user)}>
                    VIEW
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                    DELETE
                  </button>
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
  );
}
