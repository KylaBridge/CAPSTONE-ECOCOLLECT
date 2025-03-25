import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/UserTable.css";

export default function UserTable({ onViewUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("/api/ecocollect/usermanagement")
      .then((response) => setUsers(response.data))
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

  return (
    <div className="usertable">
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
          {users.map((user) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
