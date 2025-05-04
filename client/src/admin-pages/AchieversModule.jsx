import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"
import "./styles/AchieversModule.css";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AchieversModule() {

     // Initial dummy data of achievers
    const originalData = [
        { id: 1, name: "Alice Cruz", total: 45, achievement: "Eco Warrior", date: new Date() }, // today
        { id: 2, name: "Ben Santos", total: 40, achievement: "Eco Knight", date: new Date(new Date().setDate(new Date().getDate() - 3)) }, // 3 days ago
        { id: 3, name: "Carla Dizon", total: 38, achievement: "Eco Advocate", date: new Date(new Date().setDate(new Date().getDate() - 10)) }, // 10 days ago
        { id: 4, name: "David Yu", total: 30, achievement: "Green Helper", date: new Date(new Date().setDate(new Date().getDate() - 15)) }, // 15 days ago
    ];

    //sort by weekly by default
    const [sortBy, setSortBy] = useState("weekly");
    const [data, setData] = useState([]);

    //Converts a full date into a simple YYYY-MM-DD format
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    };

    const filterAndSortData = (criteria) => {
        let filtered = [...originalData];

        if (criteria === "weekly") {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            filtered = filtered.filter(user => new Date(user.date) >= oneWeekAgo);
        }

        filtered.sort((a, b) => b.total - a.total);
        setData(filtered);
    };

    useEffect(() => {
        filterAndSortData(sortBy); // Run filter on load
    }, []);

    // Event handler for sorting logic based on dropdown value (weekly or all-time)
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        filterAndSortData(value);
    };

     // Auto-ranking function: Sorts data by total points descending + assigns rank
    const rankedData = [...data].map((user, index) => ({
        ...user,
        rank: index + 1,
    }));

    // Exports current achievers table (rankedData) to a PDF file
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

    return (
        <div className="achieversmodule-container">
            <AdminSidebar />
            <Header pageTitle="Achievers Module" adminName="Admin Name" />

            <div className="achievers-table-container">
                <div className="achievers-table-header">
                    <div className="sort-element">
                        <select className="sort-dropdown" value={sortBy} onChange={handleSortChange}>
                            <option value="weekly">Weekly</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>

                    <h2 className="achievers-title">Top Contributors</h2>
                    <button 
                        className="export-button" 
                        onClick={exportToPDF} 
                        disabled={rankedData.length === 0}
                    >
                        Export to PDF
                    </button>
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
                            {rankedData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="no-data-message">
                                        No contributors to display.
                                    </td>
                                </tr>
                            ) : (
                                rankedData.map((user) => (
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
                </div>
            </div>
        </div>
    );
}
