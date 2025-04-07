import { useState } from "react";
import AdminSidebar from "../admin-components/AdminSidebar";
import UserTable from "../admin-components/UserTable";
import ViewUser from "../admin-components/ViewUser";
import Header from "../admin-components/Header";

import "./styles/UserManagement.css";

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <AdminSidebar />
      <div className="admin-container">
          <Header 
            pageTitle="User Management" 
            adminName="Admin Name" 
          />
        <ViewUser user={selectedUser} />
        <UserTable onViewUser={setSelectedUser} />
      </div>
    </>
  );
}
