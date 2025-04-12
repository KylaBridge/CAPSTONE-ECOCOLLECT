import React, { useState } from "react";
import AdminSidebar from "../admin-components/AdminSidebar";
import './styles/BadgeManagement.css';
import Header from "../admin-components/Header";
import BadgeTable from "../admin-components/BadgeTable";
import { AiOutlineUpload, AiOutlineDelete, AiFillFilter } from "react-icons/ai";
import placeholderBadge from "../assets/icons/mrcpu.png"

export default function BadgeManagement() {
    const [badgeName, setBadgeName] = useState("");
    const [milestoneCondition, setMilestoneCondition] = useState("");
    const [pointsRequired, setPointsRequired] = useState("");
    const [badgeDescription, setBadgeDescription] = useState("");
    const [badgeIcon, setBadgeIcon] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isImageSelected, setIsImageSelected] = useState(false);

    const isFormValid = badgeName && milestoneCondition && pointsRequired && badgeDescription && badgeIcon;

    const recentlyAddedBadges = [
        {
            name: "E-Waste Champ",
            description: "Achieve 10 pts",
            icon: placeholderBadge
        },
        {
            name: "Planet Protector",
            description: "Achieve 10 pts",
            icon: placeholderBadge
        },
        {
            name: "Green Advocate",
            description: "Achieve 10 pts",
            icon: placeholderBadge
        },
        {
            name: "Green Advocate",
            description: "Achieve 10 pts",
            icon: placeholderBadge
        }
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBadgeIcon(file);
            setImagePreview(URL.createObjectURL(file));
            setIsImageSelected(true);
        } else {
            setBadgeIcon(null);
            setImagePreview(null);
            setIsImageSelected(false);
        }
    };

    const handleRemoveImage = () => {
        setBadgeIcon(null);
        setImagePreview(null);
        setIsImageSelected(false);
    };

    return (
        <>
            <AdminSidebar />
            <div className="badge-management-page admin-container">
                <Header
                    pageTitle="Badge Management"
                    adminName="Admin Name"
                />

                {/* Main Grid Content Area */}
                <div className="badge-management-grid">

                    {/* --- Column 1: Total Badges --- */}
                    <div className="total-badges-container grid-col-1">
                        <h2>Total Badges</h2>
                        <p>50</p> {/* Replace with dynamic value */}
                    </div>

                    {/* --- Column 2: Recently Added  */}
                    <div className="middle-column grid-col-2"> {/* Wrapper for vertical stacking */}
                        <div className="recently-added-container">
                            <h3>Recently Added</h3>
                            <div className="badge-icons-grid">
                                {recentlyAddedBadges.map((badge, index) => (
                                    <div key={index} className="badge-item">
                                        <img src={badge.icon || placeholderBadge} alt={badge.name} className="badge-item-img" /> {/* Ensure placeholder */}
                                        <div className="badge-item-label">{badge.name}</div>
                                        <div className="badge-item-desc">{badge.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="badge-table-section grid-span-2">
                        <BadgeTable />
                    </div>

                    {/* --- Column 3: Badge Form --- */}
                    <div className="badge-form-section grid-col-3">
                         <h3>Badge View</h3> {/* Added header back */}
                        <div className="badge-form-grid"> {/* Internal grid for upload/form */}
                            <div className="upload-section">
                                <div className="upload-area">
                                    <div className="upload-placeholder">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Badge Preview" />
                                        ) : (
                                            <img src={placeholderBadge} alt="Placeholder" style={{ opacity: 0.5 }} /> // Show placeholder in preview
                                        )}
                                    </div>
                                    <input type="file" accept=".png, .jpg, .jpeg, .gif" onChange={handleImageChange} id="imageInput" style={{display: 'none'}} />

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
                                        <p className="accepted-file-desc">Accepted formats: png, jpg, gif</p> {/* Shorter text */}
                                    </div>
                                </div>
                            </div>

                            <div className="form-inputs">
                                <div className="input-group">
                                    <h4>Badge Name:</h4>
                                    <input type="text" value={badgeName} onChange={(e) => setBadgeName(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <h4>Milestone Condition:</h4>
                                    <input type="text" value={milestoneCondition} onChange={(e) => setMilestoneCondition(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <h4>Points Required:</h4>
                                    <input type="number" value={pointsRequired} onChange={(e) => setPointsRequired(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <h4>Badge Description:</h4>
                                    <textarea value={badgeDescription} onChange={(e) => setBadgeDescription(e.target.value)} placeholder="Enter description..."></textarea>
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" className="button-update" disabled={!isFormValid}>UPDATE</button>
                                    <button type="button" className="button-remove" disabled={!isFormValid}>REMOVE</button>
                                </div>
                            </div>
                        </div> {/* End badge-form-grid */}
                    </div> {/* End badge-form-section */}

                </div> {/* End badge-management-grid */}
            </div> {/* End badge-management-page */}
        </>
    );
}