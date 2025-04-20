import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"
import "./styles/EWasteBin.css"
import imgPlaceholder from "../assets/icons/mrcpu.png"
import React, { useState } from "react";
import { AiOutlineUpload, AiOutlineDelete, AiFillFilter } from "react-icons/ai";
import BinTable from "../admin-components/BinTable";

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

      return (
        <>
            <AdminSidebar />
            <div className="ewastemodule-container">
                <Header
                    pageTitle="E-Waste Bin Monitoring"
                    adminName="Admin Name"
                />

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

                                <div className="bin-info">
                                    <div className="bin-id-status-location">
                                        <h3>{selectedBin?.binId === 'new' ? 'New Bin' : selectedBin?.binId}</h3>
                                        <div className="status-location-row">
                                            <div>
                                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                                    <option value="Status" disabled>Select Bin Status</option>
                                                    <option value="Full">Full</option>
                                                    <option value="Needs Emptying">Needs Emptying</option>
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
                                        <button onClick={handleSubmitBin} disabled={!isFormValid}>
                                            {selectedBin?.binId === 'new' ? 'ADD' : 'UPDATE'}
                                        </button>
                                        {viewedFromTable && selectedBin ? (
                                            <button type="button" onClick={() => handleRemoveBin(selectedBin)}>
                                                REMOVE
                                            </button>
                                        ) : (
                                            <button type="button" onClick={handleClosePanel}>
                                                CLOSE
                                            </button>
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
                                <select className="sort-dropdown">
                                    <option value="">Sort By</option>
                                    <option value="binId">Bin ID</option>
                                    <option value="location">Location</option>
                                    <option value="status">Status</option>
                                </select>
                            </div>

                            <h2 className="bin-title">Bin List</h2>

                            <div className="right-controls">
                                <button className="add-button" onClick={handleAddBin}>Add Bin</button>
                            </div>
                        </div>

                        <BinTable
                            columns={binColumns}
                            data={bins.map((bin) => ({
                                ...bin,
                                action: (
                                  <button
                                      className="view-button"
                                      onClick={() => {
                                          if (isPanelOpen && selectedBin?.binId === bin.binId) {
                                              handleClosePanel();
                                          } else {
                                              handleViewBin(bin);
                                          }
                                      }}
                                  >
                                      {isPanelOpen && selectedBin?.binId === bin.binId ? 'CLOSE' : 'VIEW'}
                                  </button>
                                ),
                            }))}
                        />
                    </div>

                    <div className="recent-activity-container-admin">
                        <h2>Recent Activity</h2>
                        <div className="activity-item">
                            <p>Admin Mark updated BIN-002 (Cafeteria) to "Needs Emptying" - Dec 12, 2024 - 3:00 PM</p>
                        </div>
                        <div className="activity-item">
                            <p>Admin Mark added BIN-005 (Science Hall) - Dec 12, 2024 - 2:15 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}