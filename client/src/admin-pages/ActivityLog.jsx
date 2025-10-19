import { useState, useMemo, useEffect, useRef } from "react";
import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import { FaChevronDown } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";
import "./styles/ActivityLog.css";

export default function ActivityLog() {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [activityTypeFilter, setActivityTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef(null);
  const logsPerPage = 10;

  // Handle click outside for export dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target)
      ) {
        setShowExportDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch activities data when component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);

        // Fetch activity logs from backend
        const response = await axios.get("/api/ecocollect/activity-logs");
        const formattedLogs = response.data.map((log) => ({
          id: log._id,
          email: log.userEmail || "Unknown User",
          role: (log.userRole || "user").toLowerCase(), // <-- Use userRole
          activity: log.action,
          description: log.details,
          dateTime: new Date(log.timestamp).toLocaleString(),
        }));

        // Sort by date (newest first)
        const allActivities = formattedLogs.sort(
          (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
        );

        setActivities(allActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Get unique roles for filter dropdown
  const roleOptions = useMemo(() => {
    const roles = activities.map(
      (log) => log.role && log.role.trim().toLowerCase()
    );
    return Array.from(new Set(roles)).filter(Boolean);
  }, [activities]);

  // Get unique activity types for filter dropdown
  const activityTypes = useMemo(() => {
    const types = activities.map((activity) => activity.activity);
    return Array.from(new Set(types));
  }, [activities]);

  // Filter activities based on search query and filters
  const filteredLogs = useMemo(() => {
    return activities.filter((log) => {
      const matchesSearch = log.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === "All" || log.role === roleFilter.toLowerCase();
      const matchesActivity =
        activityTypeFilter === "All" || log.activity === activityTypeFilter;

      return matchesSearch && matchesRole && matchesActivity;
    });
  }, [activities, searchQuery, roleFilter, activityTypeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * logsPerPage;
    return filteredLogs.slice(startIndex, startIndex + logsPerPage);
  }, [filteredLogs, currentPage]);

  // Export functions
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Activity Log", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["ID", "Email", "Role", "Activity", "Description", "Date & Time"]],
      body: filteredLogs.map((log) => [
        log.id,
        log.email || "N/A",
        log.role || "N/A",
        log.activity || "N/A",
        log.description || "N/A",
        log.dateTime || "N/A",
      ]),
    });
    doc.save("Activity_Log.pdf");
    setShowExportDropdown(false);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredLogs.map((log) => ({
        ID: log.id,
        Email: log.email || "N/A",
        Role: log.role || "N/A",
        Activity: log.activity || "N/A",
        Description: log.description || "N/A",
        "Date & Time": log.dateTime || "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Log");
    XLSX.writeFile(workbook, "Activity_Log.xlsx");
    setShowExportDropdown(false);
  };

  // Render loading state or empty state
  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" style={{ textAlign: "center" }}>
            Loading activities...
          </td>
        </tr>
      );
    }

    if (paginatedLogs.length === 0) {
      return (
        <tr>
          <td colSpan="6" style={{ textAlign: "center" }}>
            No records found.
          </td>
        </tr>
      );
    }

    return paginatedLogs.map((log) => (
      <tr key={log.id}>
        <td>{log.id}</td>
        <td>{log.email}</td>
        <td>{log.role}</td>
        <td>{log.activity}</td>
        <td>{log.description}</td>
        <td>{log.dateTime}</td>
      </tr>
    ));
  };

  return (
    <>
      <AdminSidebar />
      <div className="activitymodule-container">
        <Header pageTitle="Activity Log" adminName="Admin Name" />

        <div className="activity-table-container">
          {/* Search and Filter Controls */}
          <div className="activity-table-controls">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="activity-table-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              {roleOptions.map((role, idx) => (
                <option key={idx} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>

            <select
              className="activity-table-filter"
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

            <div className="export-dropdown" ref={exportDropdownRef}>
              <button
                className="export-button"
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                disabled={filteredLogs.length === 0}
              >
                Export{" "}
                <FaChevronDown
                  style={{ marginLeft: "5px", fontSize: "12px" }}
                />
              </button>
              {showExportDropdown && (
                <div className="export-dropdown-menu">
                  <div className="export-dropdown-item" onClick={exportToPDF}>
                    Export to PDF
                  </div>
                  <div className="export-dropdown-item" onClick={exportToExcel}>
                    Export to Excel
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Log Table */}
          <table className="activity-log-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Activity</th>
                <th>Description</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>{renderTableContent()}</tbody>
          </table>

          {/* Pagination Controls */}
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
