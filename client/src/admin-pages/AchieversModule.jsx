import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import "./styles/AchieversModule.css";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaSearch } from "react-icons/fa";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled} from "react-icons/tb";


export default function AchieversModule() {
    // Initial dummy data of achievers
    const originalData = [
        { id: 1, name: "Alice Cruz", total: 45, achievement: "Eco Warrior", date: new Date() },
        { id: 2, name: "Ben Santos", total: 40, achievement: "Eco Knight", date: new Date(new Date().setDate(new Date().getDate() - 3)) },
        { id: 3, name: "Carla Dizon", total: 38, achievement: "Eco Advocate", date: new Date(new Date().setDate(new Date().getDate() - 10)) },
        { id: 4, name: "David Yu", total: 30, achievement: "Green Helper", date: new Date(new Date().setDate(new Date().getDate() - 15)) },
        { id: 5, name: "Emily Reyes", total: 50, achievement: "Eco Warrior", date: new Date() },
        { id: 6, name: "Ferdinand Marcos", total: 20, achievement: "Green Helper", date: new Date() },
        { id: 7, name: "Gemma De Leon", total: 60, achievement: "Eco Knight", date: new Date() },
        { id: 8, name: "Hector Villareal", total: 25, achievement: "Eco Advocate", date: new Date() },
        { id: 9, name: "Ivy Perez", total: 55, achievement: "Eco Warrior", date: new Date() },
        { id: 10, name: "Jake Cuenca", total: 35, achievement: "Eco Knight", date: new Date() },
        { id: 11, name: "Katherine Bernardo", total: 42, achievement: "Eco Advocate", date: new Date() },
        { id: 12, name: "Leo Dicaprio", total: 32, achievement: "Green Helper", date: new Date() },
        { id: 13, name: "Maria Santos", total: 48, achievement: "Eco Warrior", date: new Date() },
        { id: 14, name: "Noel Cruz", total: 39, achievement: "Eco Knight", date: new Date(new Date().setDate(new Date().getDate() - 2)) },
        { id: 15, name: "Olivia Dizon", total: 41, achievement: "Eco Advocate", date: new Date(new Date().setDate(new Date().getDate() - 8)) },
        { id: 16, name: "Paolo Yu", total: 28, achievement: "Green Helper", date: new Date(new Date().setDate(new Date().getDate() - 12)) },
        { id: 17, name: "Quennie Reyes", total: 52, achievement: "Eco Warrior", date: new Date() },
        { id: 18, name: "Ricardo Marcos", total: 22, achievement: "Green Helper", date: new Date() },
        { id: 19, name: "Samantha De Leon", total: 58, achievement: "Eco Knight", date: new Date() },
        { id: 20, name: "Timothy Villareal", total: 27, achievement: "Eco Advocate", date: new Date() },
        { id: 21, name: "Ursula Perez", total: 57, achievement: "Eco Warrior", date: new Date() },
        { id: 22, name: "Victor Cuenca", total: 37, achievement: "Eco Knight", date: new Date() },
        { id: 23, name: "Wendy Bernardo", total: 44, achievement: "Eco Advocate", date: new Date() },
        { id: 24, name: "Xavier Dicaprio", total: 34, achievement: "Green Helper", date: new Date() },
    ];

    const [sortBy, setSortBy] = useState("weekly");
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAll, setShowAll] = useState(true); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const itemsPerPage = 7;

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    };

const filterAndSortData = (criteria) => {
    let filtered = [...originalData];
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    switch (criteria) {
        case "weekly":
            filtered = filtered.filter(user => new Date(user.date) >= oneWeekAgo);
            break;
        case "weekly-eco-warrior":
            filtered = filtered.filter(user => new Date(user.date) >= oneWeekAgo && user.achievement === "Eco Warrior");
            break;
        case "weekly-eco-knight":
            filtered = filtered.filter(user => new Date(user.date) >= oneWeekAgo && user.achievement === "Eco Knight");
            break;
        case "all-eco-warrior":
            filtered = filtered.filter(user => user.achievement === "Eco Warrior");
            break;
        case "all-eco-knight":
            filtered = filtered.filter(user => user.achievement === "Eco Knight");
            break;
        default:
            // "all" or fallback: show all
            break;
    }

    filtered.sort((a, b) => b.total - a.total);
    setData(filtered);
    setCurrentPage(1);
};

    useEffect(() => {
        filterAndSortData(sortBy);
    }, []);

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        filterAndSortData(value);
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        setShowAll(false);
    };

    const rankedData = [...data].map((user, index) => ({
        ...user,
        rank: index + 1,
    }));

    const filteredRankedData = rankedData.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            head: [["ID", "Rank", "Name", "Total Points", "Achievement", "Date"]],
            body: rankedData.map(user => [
                user.id,
                user.rank,
                user.name,
                user.total,
                user.achievement,
                formatDate(user.date)
            ])
        });
        doc.save("Top_Contributors.pdf");
    };

    const handleShowAll = () => {
        setSearchTerm("");
        setShowAll(true);
    };

    const handleSort = (criteria) => {
    setSortBy(criteria);
    filterAndSortData(criteria);
};

    return (
        <div className="achieversmodule-container">
            <AdminSidebar />
            <Header pageTitle="Achievers Module" adminName="Admin Name" />

            <div className="achievers-table-container">
                <div className="achievers-table-header">
          <div className="sort-element">
            <div className="sort-dropdown-wrapper">
                <button className="sort-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                Sort ▾
                </button>

                {dropdownOpen && (
                <div className="sort-dropdown">
                    <div
                    className="menu-item"
                    onMouseEnter={() => setHovered("weekly")}
                    onMouseLeave={() => setHovered(null)}
                    >
                    Weekly ▸
                    {hovered === "weekly" && (
                        <div className="submenu">
                        <div onClick={() => handleSort("weekly")}>All</div>
                        <div onClick={() => handleSort("weekly-eco-warrior")}>Eco Warrior</div>
                        <div onClick={() => handleSort("weekly-eco-knight")}>Eco Knight</div>
                        </div>
                    )}
                    </div>

                    <div
                    className="menu-item"
                    onMouseEnter={() => setHovered("all")}
                    onMouseLeave={() => setHovered(null)}
                    >
                    All Time ▸
                    {hovered === "all" && (
                        <div className="submenu">
                        <div onClick={() => handleSort("all")}>All</div>
                        <div onClick={() => handleSort("all-eco-warrior")}>Eco Warrior</div>
                        <div onClick={() => handleSort("all-eco-knight")}>Eco Knight</div>
                        </div>
                    )}
                    </div>
                </div>
                )}
            </div>
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

                <div className="achievers-table-wrapper">
                    <table className="achievers-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Total Points</th>
                                <th>Highest Achievement</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="no-data-message">
                                        No contributors to display.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.rank}</td>
                                        <td>{user.name}</td>
                                        <td>{user.total}</td>
                                        <td>{user.achievement}</td>
                                        <td>{formatDate(user.date)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="table-footer">
                        <div className="pagination-controls">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                <TbPlayerTrackPrevFilled size={15} color={currentPage === 1 ? "#ccc" : "#0e653f"} />
                            </button>

                            <span>Page {currentPage} of {totalPages}</span>

                            <button
                                onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                <TbPlayerTrackNextFilled size={15} color={currentPage === totalPages ? "#ccc" : "#0e653f"} />
                            </button>
                        </div>

                        <button
                            className="export-button"
                            onClick={exportToPDF}
                            disabled={rankedData.length === 0}
                        >
                            Export to PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
