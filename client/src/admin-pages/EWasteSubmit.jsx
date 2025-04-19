import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import { useEffect, useState } from "react";
import "./styles/EWasteSubmit.css";
import placeholderImg from "../assets/icons/mrcpu.png";
import binIcon from "../assets/icons/binIcon.png";


export default function EWasteSubmit() {
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // To track the current image

    const placeholderSubmissions = [
        {
            id: "12345",
            name: "John Cena",
            submissionDate: "1-12-24",
            status: "Pending",
            category: "Battery",
            images: [placeholderImg, binIcon] // Array of images
        },
        {
            id: "BDG002",
            name: "JonaMarie Cruz",
            submissionDate: "1-12-24",
            status: "Pending",
            category: "Charger",
            images: [placeholderImg]
        },
        {
            id: "BDG003",
            name: "James Allan",
            submissionDate: "1-12-24",
            status: "Pending",
            category: "Phone",
            images: [placeholderImg, binIcon] // Array of images
        },
        {
            id: "B45667",
            name: "Chichi Ponkan",
            submissionDate: "1-12-24",
            status: "Pending",
            category: "Cable",
            images: [placeholderImg]
        },
        {
            id: "B45668",
            name: "Willie Johnson",
            submissionDate: "1-12-24",
            status: "Pending",
            category: "Mouse",
            images: [binIcon]
        }
    ];

    useEffect(() => {
        setSubmissions(placeholderSubmissions);
    }, []);

    const handleNextImage = () => {
        if (selectedSubmission?.images?.length > 1 && currentImageIndex < selectedSubmission.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const handlePrevImage = () => {
        if (selectedSubmission?.images?.length > 1 && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    useEffect(() => {
        // Reset image index when a new submission is selected
        setCurrentImageIndex(0);
    }, [selectedSubmission]);

    return (
        <>
            <AdminSidebar />
            <div className="main-container">
                <Header
                    pageTitle="E-Waste Submission Validation"
                    adminName="Admin Name"
                />
                <div className="flex-container">
                    <div className="submittedewaste-table-container">
                        <div className="submit-table-header">
                            <div className="sort-element">
                                <select className="sort-dropdown">
                                    <option value="">Sort By</option>
                                    <option value="name">Date</option>
                                    <option value="points">Status</option>
                                </select>
                            </div>

                            <h2 className="submission-title">Submission List</h2>
                        </div>

                        <div className="submit-table-wrapper">
                            <table className="submit-table">
                                <thead>
                                    <tr>
                                        <th>Submission ID</th>
                                        <th>User</th>
                                        <th>Submission Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="badge-table-body">
                                    {submissions.map((submission) => (
                                        <tr key={submission.id}>
                                            <td>{submission.id}</td>
                                            <td>{submission.name}</td>
                                            <td>{submission.submissionDate}</td>
                                            <td>{submission.status}</td>
                                            <td>
                                                <button onClick={() => setSelectedSubmission(submission)}>
                                                    DETAILS
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PANEL */}
                    <div className={`submitewaste-panel-container ${!selectedSubmission ? "empty" : ""}`}>
                        <h3>Submission View</h3>
                        {selectedSubmission ? (
                            <div className="panel-grid">
                                <div className="submitimage-container">
                                    <div className="submitimage-section">
                                        {selectedSubmission?.images?.length > 1 && (
                                            <button className="nav-button prev" onClick={handlePrevImage}>{'<'}</button>
                                        )}
                                        <img
                                            src={Array.isArray(selectedSubmission.images) ? selectedSubmission.images[currentImageIndex] : selectedSubmission.images}
                                            alt="Submission"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/assets/fallback.png";
                                            }}
                                            style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
                                        />
                                        {selectedSubmission?.images?.length > 1 && (
                                            <button className="nav-button next" onClick={handleNextImage}>{'>'}</button>
                                        )}
                                    </div>
                                </div>
                                <div className="panel-form"> {/* The details form */}
                                    <div className="panel-detail">
                                        <span>Submission ID:</span>
                                        <p>{selectedSubmission.id}</p>
                                    </div>
                                    <div className="panel-detail">
                                        <span>User:</span>
                                        <p>{selectedSubmission.name}</p>
                                    </div>
                                    <div className="panel-detail">
                                        <span>Submission Date:</span>
                                        <p>{selectedSubmission.submissionDate}</p>
                                    </div>
                                    <div className="panel-detail">
                                        <span>E-Waste Category:</span>
                                        <p>{selectedSubmission.category}</p>
                                    </div>
                                    <div className="panel-detail">
                                        <h4>Status:</h4>
                                        <select defaultValue={selectedSubmission.status}>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="panel-button">
                                        <button className="button-update">UPDATE</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-message">
                            <p>Select details of a user to view.</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}