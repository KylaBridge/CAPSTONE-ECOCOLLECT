import React, { useState, useEffect } from "react";
import AdminSidebar from "../admin-components/AdminSidebar";
import './styles/BadgeManagement.css';
import Header from "../admin-components/Header";
import { AiOutlineUpload, AiOutlineDelete } from "react-icons/ai";
import placeholderBadge from "../assets/icons/mrcpu.png";

// Placeholder data for badges
const placeholderBadgesData = [
    { id: 'badge001', name: 'Eco Warrior', description: 'Awarded for significant environmental contributions', imageUrl: '../assets/badges/badge3.png', milestoneCondition: 'Contribute significantly', pointsRequired: 10 },
    { id: 'badge002', name: 'Recycling Hero', description: 'Given to users with high recycling rates', imageUrl: '../assets/badges/badge4.png', milestoneCondition: 'High recycling rate', pointsRequired: 15 },
    { id: 'badge003', name: 'Green Advocate', description: 'Recognizing consistent environmental efforts', imageUrl: '../assets/badges/badge5.png', milestoneCondition: 'Consistent effort', pointsRequired: 20 },
    { id: 'badge004', name: 'Green Advocate', description: 'Recognizing consistent environmental efforts', imageUrl: '../assets/badges/badge5.png', milestoneCondition: 'Consistent effort', pointsRequired: 20 },
    { id: 'badge005', name: 'Green Advocate', description: 'Recognizing consistent environmental efforts', imageUrl: '../assets/badges/badge5.png', milestoneCondition: 'Consistent effort', pointsRequired: 20 },
    { id: 'badge006', name: 'Green Advocate', description: 'Recognizing consistent environmental efforts', imageUrl: '../assets/badges/badge5.png', milestoneCondition: 'Consistent effort', pointsRequired: 20 },
    { id: 'badge007', name: 'Green Advocate', description: 'Recognizing consistent environmental efforts', imageUrl: '../assets/badges/badge5.png', milestoneCondition: 'Consistent effort', pointsRequired: 20 },
    { id: 'badge008', name: 'Green Advocate', description: 'Recognizing consistent environmental efforts', imageUrl: '../assets/badges/badge5.png', milestoneCondition: 'Consistent effort', pointsRequired: 20 },
];

export default function BadgeManagement() {
    const [badgeName, setBadgeName] = useState("");
    const [milestoneCondition, setMilestoneCondition] = useState("");
    const [pointsRequired, setPointsRequired] = useState("");
    const [badgeDescription, setBadgeDescription] = useState("");
    const [badgeIcon, setBadgeIcon] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [badges, setBadges] = useState(placeholderBadgesData); // Using placeholder data
    const [viewedFromTable, setViewedFromTable] = useState(false);
    const [initialBadgeValues, setInitialBadgeValues] = useState(null); 

    const isFormValid =
        badgeName &&
        milestoneCondition &&
        pointsRequired &&
        badgeDescription &&
        (selectedBadge?.id === 'new' || // If it's a new badge, all fields must be filled
        badgeName !== initialBadgeValues?.name ||
        milestoneCondition !== initialBadgeValues?.milestoneCondition ||
        pointsRequired !== initialBadgeValues?.pointsRequired ||
        badgeDescription !== initialBadgeValues?.description ||
        imagePreview !== initialBadgeValues?.imageUrl ||
        isImageSelected !== !!initialBadgeValues?.imageUrl // Check if a new image is selected or removed
        );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBadgeIcon(file);
            setImagePreview(URL.createObjectURL(file));
            setIsImageSelected(true);
        } else {
            setBadgeIcon(null);
            setImagePreview(selectedBadge?.imageUrl || null);
            setIsImageSelected(false);
        }
    };

    const handleRemoveImage = () => {
        setBadgeIcon(null);
        setImagePreview(null);
        setIsImageSelected(false);
    };

    const handleViewBadge = (badge, fromTable = true) => {
        setSelectedBadge(badge);
        setIsPanelOpen(true);
        setBadgeName(badge.name);
        setMilestoneCondition(badge.milestoneCondition);
        setPointsRequired(badge.pointsRequired);
        setBadgeDescription(badge.description);
        setImagePreview(badge.imageUrl);
        setIsImageSelected(true); 
        setViewedFromTable(fromTable);
        setInitialBadgeValues({
            name: badge.name,
            milestoneCondition: badge.milestoneCondition,
            pointsRequired: badge.pointsRequired,
            description: badge.description,
            imageUrl: badge.imageUrl,
            // Note: We are not tracking changes to the file itself, only the preview URL
            });
    };

    const handleAddBadge = () => {
        setSelectedBadge({ id: 'new', name: '', description: '', imageUrl: null, milestoneCondition: '', pointsRequired: '' }); // Set a temporary ID for new badge
        setIsPanelOpen(true);
        setBadgeName("");
        setMilestoneCondition("");
        setPointsRequired("");
        setBadgeDescription("");
        setImagePreview(null);
        setIsImageSelected(false);
        setBadgeIcon(null);
        setViewedFromTable(false);
        setInitialBadgeValues({ name: '', milestoneCondition: '', pointsRequired: '', description: '', imageUrl: null }); // Initialize for new badge
    };

    const handleClosePanel = () => {
        setSelectedBadge(null);
        setIsPanelOpen(false);
        setViewedFromTable(false);
        setInitialBadgeValues(null);
        setBadgeName("");
        setMilestoneCondition("");
        setPointsRequired("");
        setBadgeDescription("");
        setImagePreview(null);
        setIsImageSelected(false);
        setBadgeIcon(null);
    };

    const handleRemoveBadge = (badgeToRemove) => {
        const updatedBadges = badges.filter(badge => badge.id !== badgeToRemove.id);
        setBadges(updatedBadges);
        if (selectedBadge?.id === badgeToRemove.id) {
            handleClosePanel();
        }
        alert(`Badge "${badgeToRemove.name}" removed!`);
    };

    const handleSubmitBadge = (e) => {
        e.preventDefault();
        if (selectedBadge?.id === 'new') {
            const newBadge = {
                id: `badge${Date.now()}`, // Temporary ID
                name: badgeName,
                description: badgeDescription,
                milestoneCondition: milestoneCondition,
                pointsRequired: pointsRequired,
                imageUrl: imagePreview,
            };
            setBadges([...badges, newBadge]);
            handleClosePanel();
            alert('New badge added!');
        } else {
            const updatedBadges = badges.map(badge =>
                badge.id === selectedBadge.id
                    ? { ...badge, name: badgeName, description: badgeDescription, milestoneCondition: milestoneCondition, pointsRequired: pointsRequired, imageUrl: imagePreview }
                    : badge
            );
            setBadges(updatedBadges);
            handleClosePanel();
            alert('Badge updated!');
        }
    };

    return (
        <>
            <AdminSidebar />
            <div className="badge-management-page admin-container">
                <Header
                    pageTitle="Badge Management"
                    adminName="Admin Name"
                />

                <div className="responsive-wrapper">
                    {/* Main Grid Content Area */}
                    <div className="badge-management-grid">

                        {/* --- Column 1: Total Badges --- */}
                        <div className="total-badges-container grid-col-1">
                            <h2>Total Badges</h2>
                            <p>{badges.length}</p> {/* Dynamic total */}
                        </div>

                        {/* --- Column 2: Recently Added --- */}
                        <div className="middle-column grid-col-2">
                            <div className="recently-added-container">
                                <h3>Recently Added</h3>
                                <div className="badge-icons-grid">
                                    {badges.length === 0 ? (
                                        <div className="empty-placeholder">
                                        <img src={placeholderBadge} alt="No badges" className="placeholder-img" />
                                        <p className="placeholder-text">No recent badges yet. Be the first to add one!</p>
                                        </div>
                                    ) : (
                                        badges.slice(-4).map((badge) => (
                                        <div key={badge.id} className="badge-item">
                                            <div className="badge-img-wrapper">
                                            <img
                                                src={badge.imageUrl || placeholderBadge}
                                                alt={badge.name}
                                                className="badge-item-img"
                                            />
                                            </div>
                                            <div className="badge-text-wrapper">
                                            <div className="badge-item-label">{badge.name}</div>
                                            <div className="badge-item-desc">{badge.description}</div>
                                            </div>
                                        </div>
                                        ))
                                    )}
                                    </div>
                            </div>
                        </div>

                        <div className="badge-table-section grid-span-2">
                            <div className="table-header">
                                    <select className="sort-dropdown">
                                        <option value="">Sort By</option>
                                        <option value="name">Name</option>
                                        <option value="points">Points</option>
                                    </select>
                                <h3>Badge List</h3>
                                <button className="add-button" onClick={handleAddBadge}>Add New Badge</button>
                            </div>
                            <div className="badge-table-wrapper">
                                <table className="badge-table-section">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Points Required</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {badges.length === 0 ? (
                                            <tr>
                                            <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                                                No badges found. Try adding one!
                                            </td>
                                            </tr>
                                        ) : (
                                            badges.map((badge) => (
                                            <tr key={badge.id}>
                                                <td>{badge.id}</td>
                                                <td>{badge.name}</td>
                                                <td>{badge.pointsRequired}</td>
                                                <td>
                                                <button
                                                    onClick={() => {
                                                    if (selectedBadge?.id === badge.id && isPanelOpen && viewedFromTable) {
                                                        handleClosePanel();
                                                    } else {
                                                        handleViewBadge(badge);
                                                    }
                                                    }}
                                                >
                                                    {selectedBadge?.id === badge.id && isPanelOpen && viewedFromTable
                                                    ? "CLOSE"
                                                    : "VIEW"}
                                                </button>
                                                </td>
                                            </tr>
                                            ))
                                        )}
                                        </tbody>
                                </table>
                            </div>
                        </div>

                        {/* --- Column 3: Badge Form --- */}
                        <div className={`badge-form-section grid-col-3 ${!isPanelOpen ? 'panel-closed' : ''}`}>
                            <h3>{selectedBadge?.id === 'new' ? 'Add New Badge' : 'Badge Details'}</h3>
                            {isPanelOpen ? (
                                <div className="badge-form-grid">
                                    {/* ... form fields ... */}
                                    <div className="upload-section">
                                        <div className="upload-area">
                                            <div className="upload-placeholder">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Badge Preview" />
                                                ) : (
                                                    <img src={placeholderBadge} alt="Placeholder" style={{ opacity: 0.5 }} />
                                                )}
                                            </div>
                                            <input type="file" accept=".png, .jpg, .jpeg, .gif" onChange={handleImageChange} id="imageInput" style={{ display: 'none' }} />
                                            <div className="upload-action-group">
                                                {isImageSelected ? (
                                                    <button type="button" className="remove-button" onClick={handleRemoveImage}>
                                                        <AiOutlineDelete size={20} style={{ marginRight: "5px" }} /> REMOVE
                                                    </button>
                                                ) : (
                                                    <label htmlFor="imageInput" className="upload-button">
                                                        <AiOutlineUpload size={20} style={{ marginRight: "5px" }} /> UPLOAD
                                                    </label>
                                                )}
                                                <p className="accepted-file-desc">Accepted formats: png, jpg, gif</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-inputs">
                                        <div className="input-group">
                                            <h4>Badge Name:</h4>
                                            <input type="text" value={badgeName} onChange={(e) => setBadgeName(e.target.value)} required />
                                        </div>
                                        <div className="input-group">
                                            <h4>Milestone Condition:</h4>
                                            <input type="text" value={milestoneCondition} onChange={(e) => setMilestoneCondition(e.target.value)} required />
                                        </div>
                                        <div className="input-group">
                                            <h4>Points Required:</h4>
                                            <input type="number" value={pointsRequired} onChange={(e) => setPointsRequired(e.target.value)} required />
                                        </div>
                                        <div className="input-group">
                                            <h4>Badge Description:</h4>
                                            <textarea value={badgeDescription} onChange={(e) => setBadgeDescription(e.target.value)} placeholder="Enter description..." required></textarea>
                                        </div>
                                        <div className="form-buttons">
                                            <button type="button" className="button-update" onClick={handleSubmitBadge} disabled={!isFormValid}>
                                                {selectedBadge?.id === 'new' ? 'ADD' : 'UPDATE'}
                                            </button>
                                            {viewedFromTable && selectedBadge ? (
                                                <button type="button" className="button-remove" onClick={() => handleRemoveBadge(selectedBadge)}>
                                                    REMOVE
                                                </button>
                                            ) : (
                                                <button type="button" className="button-remove" onClick={handleClosePanel}>
                                                    CLOSE
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="empty-panel-message">
                                    <p>View Badge or Add New Badge to show the details.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}