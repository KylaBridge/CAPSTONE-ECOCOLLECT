import React, { useState } from "react";
import AdminSidebar from "../admin-components/AdminSidebar";
import './styles/BadgeManagement.css';
import Header from "../admin-components/Header";
import BadgeTable from "../admin-components/BadgeTable";
import { AiOutlineUpload, AiOutlineDelete } from "react-icons/ai";

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
            icon: null
        },
        {
            name: "Planet Protector",
            description: "Achieve 10 pts",
            icon: null
        },
        {
            name: "Green Advocate",
            description: "Achieve 10 pts",
            icon: null
        },
        {
            name: "Green Advocate",
            description: "Achieve 10 pts",
            icon: null
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
            <div className="admin-container">
                <Header 
                    pageTitle="Badge Management" 
                    adminName="Admin Name" 
                />
                <div className="badge-content">
                    <div className="badge-header">
                        <div className="total-badges">
                            <h2>Total Badges</h2>
                            <p>50</p>
                        </div>
                    </div>
                
                 <div className="recently-added">
                            <h3>Recently Added</h3>
                            <div className="badge-icons">
                                {recentlyAddedBadges.map((badge, index) => (
                                    <div key={index} className="badge-icon">
                                        <img src={badge.icon} alt={badge.name} className="badge-img" />
                                        <div className="badge-label">{badge.name}</div>
                                        <div className="badge-desc">{badge.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="badge-view">
                            <div className="upload-section">
                                <h3>Badge View</h3>
                                <div className="upload-icon">
                                    <div className="upload-placeholder">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Badge Preview" />
                                        ) : (
                                            "IMAGE PREVIEW"
                                        )}
                                        
                                    </div>
                                    <input 
                                        type="file" 
                                        accept=".png, .jpg, .jpeg, .gif" 
                                        onChange={handleImageChange} 
                                        id="imageInput" 
                                        style={{ display: 'none' }} 
                                    />
                                    
                                    <div className="upload-action-group">
                                        {isImageSelected ? (
                                            <button className="remove-button" onClick={handleRemoveImage}>
                                                <AiOutlineDelete size={24} style={{ marginRight: "8px" }} />
                                                REMOVE
                                            </button>
                                        ) : (
                                            <label htmlFor="imageInput" className="upload-button">
                                                <AiOutlineUpload size={24} style={{ marginRight: "8px" }} />
                                                UPLOAD
                                            </label>
                                        )}
                                        <p className="accepted-file-desc">Accepted formats: .png, .jpg, .jpeg, .gif</p>
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
                                        <textarea value={badgeDescription} onChange={(e) => setBadgeDescription(e.target.value)}></textarea>
                                    </div>
                                    <div className="buttons">
                                        <button disabled={!isFormValid}>UPDATE</button>
                                        <button disabled={!isFormValid}>REMOVE</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>    
                 <div className="badge-table-container">
                    <BadgeTable />
                </div>
            </div>
        </>
    );
}