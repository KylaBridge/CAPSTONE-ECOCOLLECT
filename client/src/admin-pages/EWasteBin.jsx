import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"
import "./styles/EWasteBin.css"
import imgPlaceholder from "../assets/icons/mrcpu.png"
import React, { useState,  useRef } from "react";
import BinTable from "../admin-components/BinTable";
import AdminButton from "../admin-components/AdminButton";

export default function EWasteBin() {

  const initialBinData = [
    {
        binId: 'BIN-001',
        location: 'NU Main Entrance',
        status: 'Full',
        lastUpdated: '1 hour ago',
        image: null,
        remarks: ''
    },
    {
        binId: 'BIN-002',
        location: 'Cafeteria',
        status: 'Needs Emptying',
        lastUpdated: '3 hours ago',
        image: null,
        remarks: ''
    },
    {
        binId: 'BIN-003',
        location: 'Library',
        status: 'Available',
        lastUpdated: '5 hours ago',
        image: null,
        remarks: ''
    },
    {
        binId: 'BIN-004',
        location: 'Engineering Building',
        status: 'Available',
        lastUpdated: '6 hours ago',
        image: null,
        remarks: ''
    },
    {
        binId: 'BIN-005',
        location: 'Science Hall',
        status: 'Full',
        lastUpdated: '8 hours ago',
        image: null,
        remarks: ''
    },
    {
        binId: 'BIN-006',
        location: 'Dormitory Area',
        status: 'Needs Emptying',
        lastUpdated: '10 hours ago',
        image: null,
        remarks: ''
    },
];

      const binColumns = ['binId', 'location', 'status', 'lastUpdated', 'action'];
      const [bins, setBins] = useState(initialBinData);
      const [imagePreview, setImagePreview] = useState(null);
      const [isImageSelected, setIsImageSelected] = useState(false);
      const [selectedBin, setSelectedBin] = useState(null);
      const [isPanelOpen, setIsPanelOpen] = useState(false);
      const [viewedFromTable, setViewedFromTable] = useState(false);
      const [newBinId, setNewBinId] = useState("");
      const [location, setLocation] = useState("");
      const [status, setStatus] = useState("Full");
      const [remarks, setRemarks] = useState("");
      const [binImg, setBinImg] = useState(null);
      const [initialBinValues, setInitialBinValues] = useState(null);
      const [recentActivities, setRecentActivities] = useState([]);
      const [sortOption, setSortOption] = useState("");
      const [statusSubSort, setStatusSubSort] = useState("");
      const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
      const dropdownRef = useRef(null);

      const getSortedBins = () => {
        let sorted = [...bins];
        if (sortOption === "location") {
            sorted.sort((a, b) => a.location.localeCompare(b.location));
        } else if (sortOption === "status" && statusSubSort) {
            // Show bins with selected status first, then the rest
            sorted.sort((a, b) => {
                if (a.status === statusSubSort && b.status !== statusSubSort) return -1;
                if (a.status !== statusSubSort && b.status === statusSubSort) return 1;
                return 0;
            });
        }
        return sorted;
    };
    
      const logActivity = (message) => {
        const timestamp = new Date().toLocaleString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Asia/Manila'
        });
        setRecentActivities(prevActivities => [{ message, timestamp }, ...prevActivities]);
    };


      const isFormValid = location && status && (
        selectedBin?.binId === 'new' ||
        location !== initialBinValues?.location ||
        status !== initialBinValues?.status ||
        remarks !== initialBinValues?.remarks ||
        imagePreview !== initialBinValues?.image
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBinImg(file);
            setImagePreview(URL.createObjectURL(file));
            setIsImageSelected(true);
        } else {
            setBinImg(null);
            setImagePreview(selectedBin?.image || null);
            setIsImageSelected(false);
        }
    };

    const handleRemoveImage = () => {
        setBinImg(null);
        setImagePreview(null);
        setIsImageSelected(false);
    };

    const handleViewBin = (bin, fromTable = true) => {
        setSelectedBin(bin);
        setIsPanelOpen(true);
        setNewBinId(bin.binId);
        setLocation(bin.location);
        setStatus(bin.status);
        setRemarks(bin.remarks);
        setImagePreview(bin.image);
        setIsImageSelected(!!bin.image);
        setViewedFromTable(fromTable);
        setInitialBinValues({ location: bin.location, status: bin.status, remarks: bin.remarks, image: bin.image });
    };

    const handleAddBin = () => {
        setSelectedBin({ binId: 'new', location: '', status: 'Full', lastUpdated: 'Just now', image: null, remarks: '' });
        setIsPanelOpen(true);
        setNewBinId("");
        setLocation("");
        setStatus("Full");
        setRemarks("");
        setImagePreview(null);
        setIsImageSelected(false);
        setBinImg(null);
        setViewedFromTable(false);
        setInitialBinValues({ location: '', status: 'Full', remarks: '', image: null }); // Initialize for new bin
    };

    const handleClosePanel = () => {
        setSelectedBin(null);
        setIsPanelOpen(false);
        setViewedFromTable(false);
        setInitialBinValues(null);
        setLocation(""); // Reset form fields on close
        setStatus("Full");
        setRemarks("");
        setImagePreview(null);
        setIsImageSelected(false);
        setBinImg(null);
    };

    const handleRemoveBin = (binToRemove) => {
        const updatedBins = bins.filter(bin => bin.binId !== binToRemove.binId);
        setBins(updatedBins);
        if (selectedBin?.binId === binToRemove.binId) {
            handleClosePanel();
        }
        logActivity(`Admin removed BIN "${binToRemove.binId}"`);
        alert(`Bin "${binToRemove.binId}" removed!`);
    };

    const handleUpdateBin = () => {
        if (!isFormValid) {
            alert("No changes to update or fields are empty.");
            return;
        }

        const updatedBins = bins.map(bin =>
            bin.binId === selectedBin.binId
                ? { ...bin, location, status, remarks, image: imagePreview }
                : bin
        );
        setBins(updatedBins);
        logActivity(`Admin updated BIN "${selectedBin.binId}" (${selectedBin.location})`);
        handleClosePanel();
        alert(`Bin "${selectedBin.binId}" updated!`);
    };

    const handleAddSubmitBin = () => {
        if (!isFormValid) {
            alert("Please fill in all required fields.");
            return;
        }
        const newBin = {
            binId: `BIN-${Date.now().toString().slice(-3)}`,
            location,
            status,
            lastUpdated: 'Just now',
            image: imagePreview,
            remarks
        };
        setBins([...bins, newBin]);
        logActivity(`Admin added BIN "${newBin.binId}" (${location})`);
        handleClosePanel();
        alert(`New bin "${newBin.binId}" added!`);
    };

    const handleSubmitBin = () => {
        if (selectedBin?.binId === 'new') {
            handleAddSubmitBin();
        } else {
            handleUpdateBin();
        }
    };

     React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowStatusSubmenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

      return (
        <>
            <AdminSidebar />
            <div className="ewastemodule-container">
                <Header
                    pageTitle="E-Waste Bin Monitoring"
                    adminName="Admin Name"
                />
                <div className="main-content-scaler">
                    <div className="top-section">
                        <div className="bins-summary-wrapper">
                            <div className="totalbins-container">
                                <h2>Total Bins Monitored</h2>
                                <p>{bins.length}</p>
                            </div>

                            <div className="fullbins-container">
                                <h2>Bin Needs Emptying</h2>
                                <p>{bins.filter(bin => bin.status === 'Needs Emptying').length}</p>
                            </div>
                        </div>

                        <div className={`binview-container ${!isPanelOpen ? 'panel-closed' : ''}`}>
                            <h2>{selectedBin?.binId === 'new' ? 'Add New Bin' : 'Bin Details'}</h2>
                            {isPanelOpen ? (
                                <div className="bin-view-content">
                                    <div className="image-section">
                                        <div className="upload-placeholder">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Bin Preview" />
                                            ) : (
                                                <img src={selectedBin?.image || imgPlaceholder} alt="Placeholder" style={{ opacity: 0.5 }} />
                                            )}
                                        </div>
                                        <input type="file" accept=".png, .jpg, .jpeg, .gif" onChange={handleImageChange} id="imageInput" style={{ display: 'none' }} />
                                        <div className="upload-action-group">
                                            {isImageSelected ? (
                                                <AdminButton 
                                                    type="remove" 
                                                    size="small"
                                                    onClick={handleRemoveImage}
                                                >
                                                    REMOVE
                                                </AdminButton>
                                            ) : (
                                                <label htmlFor="imageInput">
                                                    <AdminButton 
                                                        type="upload" 
                                                        size="small"
                                                        onClick={() => document.getElementById('imageInput').click()}
                                                    >
                                                        UPLOAD
                                                    </AdminButton>
                                                </label>
                                            )}
                                            <p className="accepted-file-desc">Accepted formats: png, jpg, gif</p>
                                        </div>
                                    </div>

                                    <div className="bin-info">
                                        <div className="bin-id-status-location">
                                            <h3>{selectedBin?.binId === 'new' ? 'New Bin' : selectedBin?.binId}</h3>
                                            <div className="status-location-row">
                                                <div>
                                                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                                        <option value="Status" disabled>Select Bin Status</option>
                                                        <option value="Full">Full</option>
                                                        <option value="Available">Available</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Location"
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="remarks">
                                            <h3>Remarks</h3>
                                            <textarea placeholder="Enter Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)}></textarea>
                                        </div>
                                        <div className="bin-actions">
                                            <AdminButton 
                                                type={selectedBin?.binId === 'new' ? 'save' : 'update'}
                                                size="medium"
                                                onClick={handleSubmitBin}
                                                disabled={!isFormValid}
                                            >
                                                {selectedBin?.binId === 'new' ? 'SAVE' : 'UPDATE'}
                                            </AdminButton>
                                            {viewedFromTable && selectedBin ? (
                                                <AdminButton 
                                                    type="remove"
                                                    size="medium"
                                                    onClick={() => handleRemoveBin(selectedBin)}
                                                >
                                                    REMOVE
                                                </AdminButton>
                                            ) : (
                                                <AdminButton 
                                                    type="cancel"
                                                    size="medium"
                                                    onClick={handleClosePanel}
                                                >
                                                    CANCEL
                                                </AdminButton>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="empty-panel-message">
                                    <p>View Bin or Add New Bin to show the details.</p>
                                </div>
                            )}
                        </div>
                    </div>

                     <div className="bottom-section">
                    <div className="binlist-container">
                        <div className="binlist-header">
                            <div className="left-controls">
                                <div className="custom-sort-dropdown" ref={dropdownRef}>
                                    <button
                                        className="sort-btn"
                                        onClick={() => setShowStatusSubmenu(false)}
                                        type="button"
                                    >
                                        Sort By
                                        {sortOption === "location" && " : Location"}
                                        {sortOption === "status" && statusSubSort && ` : Status (${statusSubSort})`}
                                    </button>
                                    <div className="dropdown-menu">
                                        <div
                                            className="dropdown-item"
                                            onClick={() => {
                                                setSortOption("location");
                                                setStatusSubSort("");
                                                setShowStatusSubmenu(false);
                                            }}
                                        >
                                            Location
                                        </div>
                                        <div
                                            className="dropdown-item status-parent"
                                            onMouseEnter={() => setShowStatusSubmenu(true)}
                                            onMouseLeave={() => setShowStatusSubmenu(false)}
                                        >
                                            Status &raquo;
                                            {showStatusSubmenu && (
                                                <div className="submenu">
                                                    <div
                                                        className="submenu-item"
                                                        onClick={() => {
                                                            setSortOption("status");
                                                            setStatusSubSort("Available");
                                                            setShowStatusSubmenu(false);
                                                        }}
                                                    >
                                                        Available
                                                    </div>
                                                    <div
                                                        className="submenu-item"
                                                        onClick={() => {
                                                            setSortOption("status");
                                                            setStatusSubSort("Full");
                                                            setShowStatusSubmenu(false);
                                                        }}
                                                    >
                                                        Full
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="bin-title">Bin List</h2>

                            <div className="right-controls">
                                <AdminButton 
                                    type="add"
                                    size="medium"
                                    onClick={handleAddBin}
                                >
                                    Add Bin
                                </AdminButton>
                            </div>
                        </div>

                        <BinTable
                            columns={binColumns}
                            data={getSortedBins().map((bin) => ({
                                ...bin,
                                action: (
                                    <AdminButton 
                                        type="view"
                                        size="small"
                                        isActive={isPanelOpen && selectedBin?.binId === bin.binId}
                                        onClick={() => {
                                            if (isPanelOpen && selectedBin?.binId === bin.binId) {
                                                handleClosePanel();
                                            } else {
                                                handleViewBin(bin);
                                            }
                                        }}
                                    >
                                        {isPanelOpen && selectedBin?.binId === bin.binId ? 'CLOSE' : 'VIEW'}
                                    </AdminButton>
                                ),
                            }))}
                        />
                    </div>

                    <div className="recent-activity-container-admin">
                        <h2>Recent Activity</h2>
                        <div className="recent-activity-items-wrapper">
                            {recentActivities.length === 0 ? (
                                <div className="admin-empty-activity-message">
                                    <p>No activities yet</p>
                                </div>
                            ) : (
                                recentActivities.map((activity, index) => (
                                    <div key={index} className="admin-activity-item">
                                        <p>{activity.message} - {activity.timestamp}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}