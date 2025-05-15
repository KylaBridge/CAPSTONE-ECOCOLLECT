import { useState, useMemo } from "react";
import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled} from "react-icons/tb";
import "./styles/ActivityLog.css";

export default function ActivityLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [activityTypeFilter, setActivityTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const logs = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      role: "Admin",
      activity: "Modified E-Waste Bin",
      description: "Updated bin location to Building B - 2nd Floor",
      dateTime: "2025-05-12 10:45 AM",
    },
    {
      id: 2,
      name: "Maria Santos",
      role: "User",
      activity: "Submitted E-Waste",
      description: "Dropped off old phone cables",
      dateTime: "2025-05-12 09:30 AM",
    },
    {
      id: 3,
      name: "Admin Sample",
      role: "Admin",
      activity: "Approved Submission",
      description: "Approved Maria's e-waste submission",
      dateTime: "2025-05-12 11:00 AM",
    },
    {
      id: 4,
      name: "Carlos Reyes",
      role: "User",
      activity: "Redeemed Reward",
      description: "Exchanged points for eco tote bag",
      dateTime: "2025-05-12 11:15 AM",
    },
        {
      id: 5,
      name: "Carlos Reyes",
      role: "User",
      activity: "Redeemed Reward",
      description: "Exchanged points for eco tote bag",
      dateTime: "2025-05-12 11:15 AM",
    },
        {
      id: 6,
      name: "Carlos Reyes",
      role: "User",
      activity: "Redeemed Reward",
      description: "Exchanged points for eco tote bag",
      dateTime: "2025-05-12 11:15 AM",
    },
        {
      id: 7,
      name: "Carlos Reyes",
      role: "User",
      activity: "Redeemed Reward",
      description: "Exchanged points for eco tote bag",
      dateTime: "2025-05-12 11:15 AM",
    },
        {
      id: 8,
      name: "Carlos Reyes",
      role: "User",
      activity: "Redeemed Reward",
      description: "Exchanged points for eco tote bag",
      dateTime: "2025-05-12 11:15 AM",
    },
        {
      id: 9,
      name: "Carlos Reyes",
      role: "User",
      activity: "Redeemed Reward",
      description: "Exchanged points for eco tote bag",
      dateTime: "2025-05-12 11:15 AM",
    },
            {
      id: 10,
      name: "Carlos Reyes",
      role: "User",
      activity: "Redeemed Reward",
      description: "Exchanged points for eco tote bag",
      dateTime: "2025-05-12 11:15 AM",
    },
    {
      id: 11,
      name: "Carlos Reyes",
      role: "User",
      activity: "Redeemed Reward",
      description: "Exchanged points for eco tote bag",
      dateTime: "2025-05-12 11:15 AM",
    },
    // Add more for testing pagination
  ];

  const activityTypes = useMemo(() => {
    const types = logs.map((log) => log.activity);
    return Array.from(new Set(types));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = log.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === "All" || log.role === roleFilter;
      const matchesActivity =
        activityTypeFilter === "All" || log.activity === activityTypeFilter;

      return matchesSearch && matchesRole && matchesActivity;
    });
  }, [logs, searchQuery, roleFilter, activityTypeFilter]);

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * logsPerPage;
    return filteredLogs.slice(startIndex, startIndex + logsPerPage);
  }, [filteredLogs, currentPage]);

  return (
    <>
      <AdminSidebar />
      <div className="activitymodule-container">
        <Header pageTitle="Activity Log" adminName="Admin Name" />

        <div className="activity-table-container">
          <div className="activity-table-controls">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            <select
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value)}
            >
              <option value="All">All Activities</option>
              {activityTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <table className="activity-log-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Activity</th>
                <th>Description</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.name}</td>
                    <td>{log.role}</td>
                    <td>{log.activity}</td>
                    <td>{log.description}</td>
                    <td>{log.dateTime}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <TbPlayerTrackPrevFilled
                size={15}
                color={currentPage === 1 ? "#ccc" : "#0e653f"}
              />
            </button>

            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              <TbPlayerTrackNextFilled
                size={15}
                color={currentPage === totalPages ? "#ccc" : "#0e653f"}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
