import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import "./styles/AchieversModule.css";
import React, { useState, useEffect, useRef, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import axios from "axios";

export default function AchieversModule() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("exp");
  const [badgeFilter, setBadgeFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBadgeSubmenu, setShowBadgeSubmenu] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const exportDropdownRef = useRef(null);
  const itemsPerPage = 7;

  const badges = [
    "EcoStarter",
    "Recycling Rookie",
    "Green Beginner",
    "EcoExplorer",
    "EcoLearner",
    "Earth Ally",
    "Green Enthusiast",
    "E-Waste Guardian",
    "EcoNovice",
    "Green Advocate",
    "Planet Protector",
    "E-Waste Champion",
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowBadgeSubmenu(false);
      }
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

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/ecocollect/usermanagement");

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid data format received");
      }

      // Sort users by experience points in descending order and filter out admins
      const sortedData = response.data
        .filter((user) => user && typeof user === "object") // Filter out invalid entries
        .filter((user) => user.role === "user") // Only include users, exclude admins and superadmins
        .filter((user) => user.rank !== "Unranked" && (user.exp || 0) > 0) // Filter out unranked users with 0 exp
        .sort((a, b) => (b.exp || 0) - (a.exp || 0));

      setData(sortedData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setShowAll(false);
  };

  const sortedData = useMemo(() => {
    let sorted = [...data];
    if (sortOption === "exp") {
      sorted.sort((a, b) => (b.exp || 0) - (a.exp || 0));
    } else if (sortOption === "badge" && badgeFilter) {
      sorted = sorted.filter((user) => user.rank === badgeFilter);
    }
    return sorted;
  }, [data, sortOption, badgeFilter]);

  const rankedData = sortedData.map((user, index) => ({
    ...user,
    position: index + 1,
  }));

  const filteredRankedData = rankedData.filter((user) => {
    const name = (user.name || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  const paginatedData = filteredRankedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRankedData.length / itemsPerPage);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Top Contributors", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [
        ["Position", "Name", "Email", "Current Badge", "Experience Points"],
      ],
      body: rankedData.map((user) => [
        user.position,
        user.name || "N/A",
        user.email || "N/A",
        user.rank || "N/A",
        user.exp || 0,
      ]),
    });
    doc.save("Top_Contributors.pdf");
    setShowExportDropdown(false);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      rankedData.map((user) => ({
        Position: user.position,
        Name: user.name || "N/A",
        Email: user.email || "N/A",
        "Current Badge": user.rank || "N/A",
        "Experience Points": user.exp || 0,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Top Contributors");
    XLSX.writeFile(workbook, "Top_Contributors.xlsx");
    setShowExportDropdown(false);
  };

  const handleShowAll = () => {
    setSearchTerm("");
    setShowAll(true);
  };

  return (
    <div className="achieversmodule-container">
      <AdminSidebar />
      <Header pageTitle="Achievers Module" adminName="Admin Name" />

      <div className="achievers-table-container">
        <div className="achievers-table-header">
          <div className="achievers-sort-dropdown" ref={dropdownRef}>
            <button
              className="achievers-sort-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Sort By:{" "}
              {sortOption === "exp"
                ? "Experience Points"
                : badgeFilter
                ? badgeFilter
                : "Badge"}
            </button>
            {showDropdown && (
              <div className="achievers-dropdown-menu">
                <div
                  className="achievers-dropdown-item"
                  onClick={() => {
                    setSortOption("exp");
                    setBadgeFilter("");
                    setShowDropdown(false);
                  }}
                >
                  Experience Points
                </div>
                <div
                  className="achievers-dropdown-item status-parent"
                  onMouseEnter={() => setShowBadgeSubmenu(true)}
                  onMouseLeave={() => setShowBadgeSubmenu(false)}
                >
                  Badge
                  {showBadgeSubmenu && (
                    <div className="achievers-submenu">
                      <div
                        className="achievers-submenu-item"
                        onClick={() => {
                          setSortOption("badge");
                          setBadgeFilter("");
                          setShowDropdown(false);
                          setShowBadgeSubmenu(false);
                        }}
                      >
                        All Badges
                      </div>
                      {badges.map((badge, index) => (
                        <div
                          key={index}
                          className="achievers-submenu-item"
                          onClick={() => {
                            setSortOption("badge");
                            setBadgeFilter(badge);
                            setShowDropdown(false);
                            setShowBadgeSubmenu(false);
                          }}
                        >
                          {badge}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <h2 className="achievers-title">Top Contributors</h2>

          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search User"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <button type="submit" className="search-icon-button">
                <FaSearch style={{ fontSize: "16px", color: "#245a1e" }} />
              </button>
            </div>
            {!showAll && (
              <button
                type="button"
                className="show-all-button"
                onClick={handleShowAll}
              >
                Show All
              </button>
            )}
            <div className="export-dropdown" ref={exportDropdownRef}>
              <button
                className="export-button"
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                disabled={rankedData.length === 0}
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
        </div>

        <div className="achievers-table-wrapper">
          <table className="achievers-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Email</th>
                <th>Current Badge</th>
                <th>Experience Points</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="no-data-message">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="no-data-message error">
                    {error}
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data-message">
                    No contributors to display.
                  </td>
                </tr>
              ) : (
                paginatedData.map((user) => (
                  <tr key={user._id || user.position}>
                    <td>{user.position}</td>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.email || "N/A"}</td>
                    <td>{user.rank || "N/A"}</td>
                    <td>{user.exp || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="table-footer">
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

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
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
      </div>
    </div>
  );
}
