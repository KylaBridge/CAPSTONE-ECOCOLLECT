import { useState } from "react";

// Components
import AdminSidebar from "../admin-components/AdminSidebar";
import UserTable from "../admin-components/UserTable";
import ViewUser from "../admin-components/ViewUser";

import "./styles/UserManagement.css";

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <AdminSidebar />
      <div className="admin-container">
        <div className="admin-profile">
          <h1>User Management</h1>
          <div className="block">
            <p>Admin</p>
          </div>
        </div>
        <ViewUser user={selectedUser} />
        <UserTable onViewUser={setSelectedUser} />
      </div>
    </>
  );
}
