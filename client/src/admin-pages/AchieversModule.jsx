import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import "./styles/AchieversModule.css";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaSearch } from "react-icons/fa";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled} from "react-icons/tb";
import axios from "axios";

export default function AchieversModule() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAll, setShowAll] = useState(true); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 7;

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/ecocollect/usermanagement');
            
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Invalid data format received');
            }

            // Sort users by experience points in descending order
            const sortedData = response.data
                .filter(user => user && typeof user === 'object') // Filter out invalid entries
                .sort((a, b) => (b.exp || 0) - (a.exp || 0));
            
            setData(sortedData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        setShowAll(false);
    };

    const rankedData = data.map((user, index) => ({
        ...user,
        position: index + 1,
    }));

    const filteredRankedData = rankedData.filter(user => {
        const name = (user.name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
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
            head: [["Position", "Name", "Email", "Current Badge", "Experience Points"]],
            body: rankedData.map(user => [
                user.position,
                user.name || 'N/A',
                user.email || 'N/A',
                user.rank || 'N/A',
                user.exp || 0
            ])
        });
        doc.save("Top_Contributors.pdf");
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
                                        <td>{user.name || 'N/A'}</td>
                                        <td>{user.email || 'N/A'}</td>
                                        <td>{user.rank || 'N/A'}</td>
                                        <td>{user.exp || 0}</td>
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
