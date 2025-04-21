import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./styles/EWasteSubmit.css";

export default function EWasteSubmit() {
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [statusValue, setStatusValue] = useState("Pending");
    const [openSubmissionId, setOpenSubmissionId] = useState(null);
    const [originalStatus, setOriginalStatus] = useState("Pending");

    useEffect(() => {
        axios.get("http://localhost:3000/api/ecocollect/ewaste")
            .then((res) => {
                const formattedData = res.data
                    .filter(sub => sub.status === "Pending")
                    .map(sub => ({
                        id: sub._id,
                        name: sub.user?.name || "Unknown",
                        submissionDate: new Date(sub.createdAt).toLocaleDateString(),
                        status: sub.status || "Pending",
                        category: sub.category,
                        images: sub.attachments.map(img => `http://localhost:3000/${img.path}`),
                    }));
                setSubmissions(formattedData);
            })
            .catch((error) => {
                console.error("Error fetching submissions:", error);
            });
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

    const handleUpdateSubmission = async () => {
        try {
            // 1. Update status only (don't delete the document)
            const updateRes = await axios.put(`http://localhost:3000/api/ecocollect/ewaste/${selectedSubmission.id}/status`, {
                status: statusValue,
            });
    
            if (updateRes.status !== 200) {
                throw new Error("Failed to update status");
            }
    
            // 2. Remove it from the frontend table
            setSubmissions(prev => prev.filter(sub => sub.id !== selectedSubmission.id));
            setSelectedSubmission(null);
            setOpenSubmissionId(null);
    
            toast.success(`Submission ${statusValue.toLowerCase()} successfully.`);
        } catch (error) {
            console.error("Error updating submission:", error);
            toast.error("An error occurred while updating the submission.");
        }
    };    

    const handleDetailsClick = (submission) => {
        if (openSubmissionId === submission.id) {
            setOpenSubmissionId(null);
            setSelectedSubmission(null);
        } else {
            setOpenSubmissionId(submission.id);
            setSelectedSubmission(submission);
        }
    };

    useEffect(() => {
        setCurrentImageIndex(0);
        setStatusValue(selectedSubmission?.status || "Pending");
        setOriginalStatus(selectedSubmission?.status || "Pending");
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
                                    {submissions.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center", padding: "20px" , fontStyle: "italic"}}>
                                                No details to show yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        submissions.map((submission) => (
                                            <tr key={submission.id}>
                                                <td className="submission-id-cell">{submission.id}</td>
                                                <td>{submission.name}</td>
                                                <td>{submission.submissionDate}</td>
                                                <td>{submission.status}</td>
                                                <td>
                                                    <button onClick={() => handleDetailsClick(submission)}>
                                                        {openSubmissionId === submission.id ? "CLOSE" : "DETAILS"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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
                                        <select value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="panel-button">
                                    <button 
                                        className="button-update" 
                                        onClick={handleUpdateSubmission}
                                        disabled={statusValue === originalStatus}
                                    >
                                        UPDATE
                                    </button>
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
            {/* Hot Toast container to render toasts */}
            <div id="toast-container" />
        </>
    );
}