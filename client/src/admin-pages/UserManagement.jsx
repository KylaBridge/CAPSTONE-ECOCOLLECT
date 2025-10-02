import { useState, useContext } from "react";

// Components
import AdminSidebar from "../admin-components/AdminSidebar";
import UserTable from "../admin-components/UserTable";
import ViewUser from "../admin-components/ViewUser";
import Header from "../admin-components/Header";
import AddUserModal from "../admin-components/AddUserModal";

// Context
import { UserContext } from "../context/userContext";

import "./styles/UserManagement.css";

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useContext(UserContext);

  // Check if current user is super admin
  const isSuperAdmin = user?.role === "superadmin";

  const handleUserDeleted = () => {
    setSelectedUser(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUserAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <AdminSidebar />
      <div className="usermodule-container">
        <Header pageTitle="User Management" />
        <div className="usermodule-responsive-wrapper">
          <ViewUser
            user={selectedUser}
            onUserDeleted={handleUserDeleted}
            currentUserRole={user?.role}
          />
          <UserTable
            onViewUser={setSelectedUser}
            viewedUser={selectedUser}
            currentUserRole={user?.role}
            refreshTrigger={refreshTrigger}
            onAddUser={() => setIsAddUserModalOpen(true)}
          />
        </div>

        <AddUserModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onUserAdded={handleUserAdded}
          currentUserRole={user?.role}
        />
      </div>
    </>
  );
}
