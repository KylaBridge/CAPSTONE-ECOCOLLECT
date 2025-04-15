import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"
import "./styles/EWasteBin.css"
import imgPlaceholder from "../assets/icons/mrcpu.png"
import React, { useState } from "react";
import { AiOutlineUpload, AiOutlineDelete, AiFillFilter } from "react-icons/ai";
import BinTable from "../admin-components/BinTable";

export default function EWasteBin() {

    const [imagePreview, setImagePreview] = useState(null);
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Full");

    const binData = [
        {
          binId: 'BIN-001',
          location: 'NU Main Entrance',
          status: 'Full',
          lastUpdated: '1 hour ago',
        },
        {
          binId: 'BIN-002',
          location: 'Cafeteria',
          status: 'Needs Emptying',
          lastUpdated: '3 hours ago',
        },
        {
          binId: 'BIN-003',
          location: 'Library',
          status: 'Available',
          lastUpdated: '5 hours ago',
        },
        {
            binId: 'BIN-003',
            location: 'Library',
            status: 'Available',
            lastUpdated: '5 hours ago',
          },
          {
            binId: 'BIN-003',
            location: 'Library',
            status: 'Available',
            lastUpdated: '5 hours ago',
          },
          {
            binId: 'BIN-003',
            location: 'Library',
            status: 'Available',
            lastUpdated: '5 hours ago',
          },
      ];
    
      const binColumns = ['binId', 'location', 'status', 'lastUpdated', 'action'];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBinImg(file);
            setImagePreview(URL.createObjectURL(file));
            setIsImageSelected(true);
        } else {
            setBinImg(null);
            setImagePreview(null);
            setIsImageSelected(false);
        }
    };

    const handleRemoveImage = () => {
        setBinImg(null);
        setImagePreview(null);
        setIsImageSelected(false);
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
    };

    return (
        <>
            <AdminSidebar />
            <div className="admin-container">
                <Header 
                    pageTitle="E-Waste Bin Monitoring" 
                    adminName="Admin Name" 
                />

        <div className="top-section">       
            
            <div className="bins-summary-wrapper">
              <div className="totalbins-container">
                <h2>Total Bins Monitored</h2>
                <p> 15 </p>
              </div>

              <div className="fullbins-container">
                <h2>Bin Needs Emptying</h2>
                <p> 15 </p>
              </div>
            </div>

            <div className="binview-container">
              <h2>Bin View</h2>
              <div className="bin-view-content">
                <div className="image-section">
                  <div className="upload-placeholder">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Bin Preview" />
                    ) : (
                      <img src={imgPlaceholder} alt="Placeholder" style={{ opacity: 0.5 }} />
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
                <h3>BIN-001</h3>
                <div className="status-location-row">
                  <div>
                    <select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                      <option value="Status">Select Bin Status</option>
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
                    <button>UPDATE</button>
                    <button>REMOVE</button>
                  </div>
                </div>
              </div>
            </div>
        </div>

        <div className="bottom-section">
            <div className="binlist-container">
                    <div className="binlist-header">
                    <div className="left-controls">
                        <select className="sort-dropdown">
                        <option value="">Sort By</option>
                        <option value="name">Name</option>
                        <option value="points">Points</option>
                        </select>
                    </div>

                    <h2 className="bin-title">Bin List</h2>

                    <div className="right-controls">
                        <button className="add-button">Add Bin</button>
                  </div>
                    </div>

                    <BinTable
                        columns={binColumns}
                        data={binData.map((bin) => ({
                        ...bin,
                        action: <button className="view-button">VIEW</button>,
                        }))}
                    />
                    </div>

                    <div className="recent-activity-container">
                      <h2>Recent Activity</h2>
                    <div className="activity-item">
                        <p>Admin Mark updated BIN-002 (Cafeteria) to "Needs Emptying" - Dec 12, 2024 - 3:00 PM</p>
                    </div>
                    <div className="activity-item">
                        <p>Admin Mark updated BIN-002 (Cafeteria) to "Needs Emptying" - Dec 12, 2024 - 3:00 PM</p>
                    </div>
                    </div>
        </div>
            </div>
        </>
    )
}