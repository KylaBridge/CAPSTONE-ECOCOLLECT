import { useState } from "react";

// Components
import AdminSidebar from "../admin-components/AdminSidebar";
import UserTable from "../admin-components/UserTable";
import ViewUser from "../admin-components/ViewUser";
import Header from "../admin-components/Header";

import "./styles/UserManagement.css";

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserDeleted = () => {
    setSelectedUser(null);
    window.location.reload();
  };

  return (
    <>
      <AdminSidebar />
      <div className="usermodule-container">
          <Header 
            pageTitle="User Management" 
          />
          <div className="usermodule-responsive-wrapper">
            <ViewUser user={selectedUser} onUserDeleted={handleUserDeleted} />
            <UserTable onViewUser={setSelectedUser} viewedUser={selectedUser} />
          </div>
       
      </div>
    </>
  );
}
