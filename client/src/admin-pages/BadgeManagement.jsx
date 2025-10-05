import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../admin-components/AdminSidebar";
import './styles/BadgeManagement.css';
import Header from "../admin-components/Header";
import { AiOutlineUpload, AiOutlineDelete } from "react-icons/ai";
import placeholderBadge from "../assets/icons/mrcpu.png";
import AdminButton from "../admin-components/AdminButton";
import axios from 'axios';

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
    const [badges, setBadges] = useState([]);
    const [viewedFromTable, setViewedFromTable] = useState(false);
    const [initialBadgeValues, setInitialBadgeValues] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState("");
    const [sortedBadges, setSortedBadges] = useState([]);
    const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch badges on component mount
    useEffect(() => {
        fetchBadges();
    }, []);

    // Update sorted badges when badges or sort option changes
    useEffect(() => {
        sortBadges();
    }, [badges, sortOption]);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowStatusSubmenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchBadges = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/ecocollect/badges');
            const badgesWithImageUrls = response.data.map(badge => ({
                ...badge,
                id: badge._id,
                image: badge.image ? `${import.meta.env.VITE_API_URL}/${badge.image.path}` : null
            }));
            setBadges(badgesWithImageUrls);
            setError(null);
        } catch (err) {
            setError('Failed to fetch badges');
            console.error('Error fetching badges:', err);
        } finally {
            setLoading(false);
        }
    };

    const sortBadges = () => {
        let sorted = [...badges];
        switch (sortOption) {
            case "name":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "points":
                sorted.sort((a, b) => b.pointsRequired - a.pointsRequired);
                break;
            default:
                // Default sort by creation date (newest first)
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        setSortedBadges(sorted);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBadgeIcon(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setIsImageSelected(true);
        } else {
            setBadgeIcon(null);
            setImagePreview(selectedBadge?.image || null);
            setIsImageSelected(false);
        }
    };

    const handleViewBadge = (badge, fromTable = true) => {
        setSelectedBadge(badge);
        setIsPanelOpen(true);
        setBadgeName(badge.name);
        setMilestoneCondition(badge.milestoneCondition);
        setPointsRequired(badge.pointsRequired);
        setBadgeDescription(badge.description);
        setImagePreview(badge.image);
        setIsImageSelected(true);
        setViewedFromTable(fromTable);
        setInitialBadgeValues({
            name: badge.name,
            milestoneCondition: badge.milestoneCondition,
            pointsRequired: badge.pointsRequired,
            description: badge.description,
            imageUrl: badge.image
        });
    };

    const handleAddBadge = () => {
        setSelectedBadge({ id: 'new', name: '', description: '', imageUrl: null, milestoneCondition: '', pointsRequired: '' });
        setIsPanelOpen(true);
        setBadgeName("");
        setMilestoneCondition("");
        setPointsRequired("");
        setBadgeDescription("");
        setImagePreview(null);
        setIsImageSelected(false);
        setBadgeIcon(null);
        setViewedFromTable(false);
        setInitialBadgeValues({ name: '', milestoneCondition: '', pointsRequired: '', description: '', imageUrl: null });
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

    const handleRemoveBadge = async (badgeToRemove) => {
        setIsRemoving(true);
        try {
            await axios.delete(`/api/ecocollect/badges/${badgeToRemove._id}`);
            setBadges(badges.filter(badge => badge._id !== badgeToRemove._id));
            if (selectedBadge?._id === badgeToRemove._id) {
                handleClosePanel();
            }
            alert(`Badge "${badgeToRemove.name}" removed!`);
        } catch (err) {
            console.error('Error deleting badge:', err);
            alert('Failed to delete badge');
        } finally {
            setIsRemoving(false);
        }
    };

    const handleSubmitBadge = async (e) => {
        e.preventDefault();
        // Prevent negative points
        if (isNaN(pointsRequired) || Number(pointsRequired) < 0) {
            alert('Points Required must be a non-negative number.');
            return;
        }
        
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', badgeName);
            formData.append('description', badgeDescription);
            formData.append('milestoneCondition', milestoneCondition);
            formData.append('pointsRequired', pointsRequired);
            if (badgeIcon) {
                formData.append('image', badgeIcon);
            }

            if (selectedBadge?.id === 'new') {
                const response = await axios.post('/api/ecocollect/badges', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                // Transform image path for immediate preview
                const newBadge = {
                    ...response.data.badge,
                    id: response.data.badge._id,
                    image: response.data.badge.image ? `${import.meta.env.VITE_API_URL}/${response.data.badge.image.path}` : null
                };
                setBadges([...badges, newBadge]);
                handleClosePanel();
                alert('New badge added!');
            } else {
                const response = await axios.put(`/api/ecocollect/badges/${selectedBadge._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                // Transform image path for immediate preview
                const updatedBadge = {
                    ...response.data.badge,
                    id: response.data.badge._id,
                    image: response.data.badge.image ? `${import.meta.env.VITE_API_URL}/${response.data.badge.image.path}` : null
                };
                setBadges(badges.map(badge =>
                    badge._id === selectedBadge._id ? updatedBadge : badge
                ));
                handleClosePanel();
                alert('Badge updated!');
            }
        } catch (err) {
            console.error('Error saving badge:', err);
            alert('Failed to save badge');
        } finally {
            setIsSaving(false);
        }
    };

    const isFormValid =
        badgeName &&
        milestoneCondition &&
        pointsRequired !== "" &&
        !isNaN(pointsRequired) &&
        Number(pointsRequired) >= 0 &&
        badgeDescription &&
        (selectedBadge?.id === 'new' ||
        badgeName !== initialBadgeValues?.name ||
        milestoneCondition !== initialBadgeValues?.milestoneCondition ||
        pointsRequired !== initialBadgeValues?.pointsRequired ||
        badgeDescription !== initialBadgeValues?.description ||
        imagePreview !== initialBadgeValues?.imageUrl ||
        isImageSelected !== !!initialBadgeValues?.imageUrl);

    return (
        <>
            <AdminSidebar />
            <div className="badge-management-page admin-container">
                <Header
                    pageTitle="Badge Management"
                    adminName="Admin Name"
                />

                <div className="badgemanagement-page-scaler"> 
                    <div className="responsive-wrapper">
                        <div className="badge-management-grid">
                            <div className="total-badges-container grid-col-1">
                                <h2>Total Badges</h2>
                                <p>{badges.length}</p>
                            </div>

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
                                                <div key={badge._id} className="badge-item">
                                                    <div className="badge-img-wrapper">
                                                        <img
                                                            src={badge.image || placeholderBadge}
                                                            alt={badge.name}
                                                            className="badge-item-img"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = placeholderBadge;
                                                            }}
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
                                    <div className="badge-table-sort-dropdown" ref={dropdownRef}>
                                        <button
                                            className="badge-table-sort-btn"
                                            onClick={() => setShowStatusSubmenu(!showStatusSubmenu)}
                                            type="button"
                                        >
                                            Sort By
                                            {sortOption === "name" && " : Name"}
                                            {sortOption === "points" && " : Points"}
                                        </button>
                                        {showStatusSubmenu && (
                                            <div className="badge-table-dropdown-menu">
                                                <div
                                                    className="badge-table-dropdown-item"
                                                    onClick={() => {
                                                        setSortOption("name");
                                                        setShowStatusSubmenu(false);
                                                    }}
                                                >
                                                    Name
                                                </div>
                                                <div
                                                    className="badge-table-dropdown-item"
                                                    onClick={() => {
                                                        setSortOption("points");
                                                        setShowStatusSubmenu(false);
                                                    }}
                                                >
                                                    Points
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <h3>Badge List</h3>
                                    <AdminButton type="add" size="medium" onClick={handleAddBadge}>Add New Badge</AdminButton>
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
                                            {sortedBadges.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                                                        No badges found. Try adding one!
                                                    </td>
                                                </tr>
                                            ) : (
                                                sortedBadges.map((badge) => (
                                                    <tr key={badge._id}>
                                                        <td>{badge._id}</td>
                                                        <td>{badge.name}</td>
                                                        <td>{badge.pointsRequired}</td>
                                                        <td>
                                                            <AdminButton
                                                                type="view"
                                                                size="small"
                                                                isActive={selectedBadge?._id === badge._id && isPanelOpen && viewedFromTable}
                                                                onClick={() => {
                                                                    if (selectedBadge?._id === badge._id && isPanelOpen && viewedFromTable) {
                                                                        handleClosePanel();
                                                                    } else {
                                                                        handleViewBadge(badge);
                                                                    }
                                                                }}
                                                            >
                                                                {selectedBadge?._id === badge._id && isPanelOpen && viewedFromTable ? "CLOSE" : "VIEW"}
                                                            </AdminButton>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={`badge-form-section grid-col-3 ${!isPanelOpen ? 'panel-closed' : ''}`}>
                                <h3>{selectedBadge?.id === 'new' ? 'Add New Badge' : 'Badge Details'}</h3>
                                {isPanelOpen ? (
                                    <div className="badge-form-grid">
                                        <div className="upload-section">
                                            <div className="upload-area">
                                                <div className="upload-placeholder">
                                                    {imagePreview ? (
                                                        <img 
                                                            src={imagePreview} 
                                                            alt="Badge Preview" 
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = placeholderBadge;
                                                            }}
                                                        />
                                                    ) : (
                                                        <img src={placeholderBadge} alt="Placeholder" style={{ opacity: 0.5 }} />
                                                    )}
                                                </div>
                                                <input type="file" accept=".png, .jpg, .jpeg, .gif" onChange={handleImageChange} id="imageInput" style={{ display: 'none' }} />
                                                <div className="upload-action-group">
                                                    {isImageSelected ? (
                                                        <AdminButton type="remove" size="small" onClick={() => {
                                                            setImagePreview(null);
                                                            setIsImageSelected(false);
                                                        }}>Replace</AdminButton>
                                                    ) : (
                                                        <label htmlFor="imageInput">
                                                            <AdminButton type="upload" size="small" onClick={() => document.getElementById('imageInput').click()}>UPLOAD</AdminButton>
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
                                                <input 
                                                    type="number" 
                                                    value={pointsRequired} 
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '') {
                                                            setPointsRequired('');
                                                        } else {
                                                            const numValue = parseInt(value);
                                                            if (!isNaN(numValue) && numValue >= 0) {
                                                                setPointsRequired(numValue);
                                                            }
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '') {
                                                            setPointsRequired(0);
                                                        } else {
                                                            const cleanValue = value.replace(/^0+/, '') || '0';
                                                            setPointsRequired(parseInt(cleanValue));
                                                        }
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    min="0"
                                                    required 
                                                />
                                            </div>
                                            <div className="input-group">
                                                <h4>Badge Description:</h4>
                                                <textarea value={badgeDescription} onChange={(e) => setBadgeDescription(e.target.value)} placeholder="Enter description..." required></textarea>
                                            </div>
                                            <div className="form-buttons">
                                                <AdminButton
                                                    type={selectedBadge?.id === 'new' ? 'save' : 'update'}
                                                    size="medium"
                                                    onClick={handleSubmitBadge}
                                                    disabled={!isFormValid || isSaving || isRemoving}
                                                >
                                                    {isSaving 
                                                        ? (selectedBadge?.id === 'new' ? 'SAVING...' : 'UPDATING...') 
                                                        : (selectedBadge?.id === 'new' ? 'SAVE' : 'UPDATE')
                                                    }
                                                </AdminButton>
                                                {viewedFromTable && selectedBadge ? (
                                                    <AdminButton 
                                                        type="remove" 
                                                        size="medium" 
                                                        onClick={() => handleRemoveBadge(selectedBadge)}
                                                        disabled={isSaving || isRemoving}
                                                    >
                                                        {isRemoving ? 'REMOVING...' : 'REMOVE'}
                                                    </AdminButton>
                                                ) : (
                                                    <AdminButton 
                                                        type="cancel" 
                                                        size="medium" 
                                                        onClick={handleClosePanel}
                                                        disabled={isSaving || isRemoving}
                                                    >
                                                        CANCEL
                                                    </AdminButton>
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
            </div>
        </>
    );
}