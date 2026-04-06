import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import "./styles/EWasteBin.css";
import imgPlaceholder from "../assets/icons/mrcpu.png";
import React, { useState, useRef, useEffect } from "react";
import BinTable from "../admin-components/BinTable";
import AdminButton from "../admin-components/AdminButton";
import Alert from "../admin-components/Alert";
import { binsAPI } from "../api/bins";
import { activityLogAPI } from "../api/activityLog";

// Helper to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("/uploads")) {
    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  }
  return imagePath;
};

export default function EWasteBin() {
  const binColumns = ["binId", "location", "status", "lastUpdated", "action"];
  const [bins, setBins] = useState([]);
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
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showSaveConfirmAlert, setShowSaveConfirmAlert] = useState(false);
  const [showUpdateConfirmAlert, setShowUpdateConfirmAlert] = useState(false);
  const [showRemoveConfirmAlert, setShowRemoveConfirmAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successTitle, setSuccessTitle] = useState("");
  const [binToRemove, setBinToRemove] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchBins();
    fetchRecentActivities();
  }, []);

  const fetchBins = async () => {
    try {
      const res = await binsAPI.getAllBins();
      setBins(
        res.data.map((bin) => ({
          binId: bin._id,
          location: bin.location,
          status: bin.status,
          lastUpdated: timeAgo(
            bin.updatedAt || bin.lastUpdated || bin.createdAt,
          ),
          image: bin.image ? bin.image : null,
          remarks: bin.remarks || "",
        })),
      );
    } catch (err) {
      alert("Failed to fetch bins.");
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const res = await activityLogAPI.getAllActivityLogs();
      // Only keep bin management activities
      const binActions = ["Bin Added", "Bin Updated", "Bin Deleted"];
      setRecentActivities(
        res.data.filter((activity) => binActions.includes(activity.action)),
      );
    } catch (err) {
      setRecentActivities([]);
    }
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000 / 60); // minutes
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} minute${diff > 1 ? "s" : ""} ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const getSortedBins = () => {
    let sorted = [...bins];
    if (sortOption === "location") {
      sorted.sort((a, b) => a.location.localeCompare(b.location));
    } else if (sortOption === "status" && statusSubSort) {
      if (statusSubSort !== "All") {
        sorted = sorted.filter((bin) => bin.status === statusSubSort);
      }
    }
    return sorted;
  };

  const isFormValid =
    location &&
    status &&
    (selectedBin?.binId === "new" ||
      location !== initialBinValues?.location ||
      status !== initialBinValues?.status ||
      remarks !== initialBinValues?.remarks ||
      imagePreview !== initialBinValues?.image);

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
    setInitialBinValues({
      location: bin.location,
      status: bin.status,
      remarks: bin.remarks,
      image: bin.image,
    });
  };

  const handleAddBin = () => {
    setSelectedBin({
      binId: "new",
      location: "",
      status: "Full",
      lastUpdated: "Just now",
      image: null,
      remarks: "",
    });
    setIsPanelOpen(true);
    setNewBinId("");
    setLocation("");
    setStatus("Full");
    setRemarks("");
    setImagePreview(null);
    setIsImageSelected(false);
    setBinImg(null);
    setViewedFromTable(false);
    setInitialBinValues({
      location: "",
      status: "Full",
      remarks: "",
      image: null,
    }); // Initialize for new bin
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

  const handleRemoveBin = async (binToRemoveItem) => {
    setIsRemoving(true);
    try {
      await binsAPI.deleteBin(binToRemoveItem.binId);
      const updatedBins = bins.filter((bin) => bin.binId !== binToRemoveItem.binId);
      setBins(updatedBins);
      if (selectedBin?.binId === binToRemoveItem.binId) {
        handleClosePanel();
      }
      await fetchRecentActivities();
      setSuccessTitle("Bin Removed");
      setSuccessMessage(`Bin at "${binToRemoveItem.location}" has been removed successfully.`);
      setShowSuccessAlert(true);
      setShowRemoveConfirmAlert(false);
    } catch (err) {
      alert("Failed to remove bin.");
    } finally {
      setIsRemoving(false);
      setBinToRemove(null);
    }
  };

  const handleUpdateBin = async () => {
    if (!isFormValid) {
      alert("No changes to update or fields are empty.");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("location", location);
      formData.append("status", status);
      formData.append("remarks", remarks);
      if (binImg) formData.append("image", binImg);

      const res = await binsAPI.updateBin(selectedBin.binId, formData);

      const updatedBin = res.data;
      setBins(
        bins.map((bin) =>
          bin.binId === selectedBin.binId
            ? {
                binId: updatedBin._id,
                location: updatedBin.location,
                status: updatedBin.status,
                lastUpdated: timeAgo(
                  updatedBin.updatedAt ||
                    updatedBin.lastUpdated ||
                    updatedBin.createdAt,
                ),
                image: updatedBin.image,
                remarks: updatedBin.remarks,
              }
            : bin,
        ),
      );
      await fetchRecentActivities();
      handleClosePanel();
      setSuccessTitle("Bin Updated");
      setSuccessMessage(`Bin at "${selectedBin.location}" has been updated successfully.`);
      setShowSuccessAlert(true);
      setShowUpdateConfirmAlert(false);
    } catch (err) {
      alert("Failed to update bin.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubmitBin = async () => {
    if (!isFormValid) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("location", location);
      formData.append("status", status);
      formData.append("remarks", remarks);
      if (binImg) formData.append("image", binImg);

      const res = await binsAPI.addBin(formData);

      const bin = res.data;
      setBins([
        ...bins,
        {
          binId: bin._id,
          location: bin.location,
          status: bin.status,
          lastUpdated: timeAgo(
            bin.updatedAt || bin.lastUpdated || bin.createdAt,
          ),
          image: bin.image,
          remarks: bin.remarks,
        },
      ]);
      await fetchRecentActivities();
      handleClosePanel();
      setSuccessTitle("Bin Added");
      setSuccessMessage(`New bin "${bin.location}" has been added successfully.`);
      setShowSuccessAlert(true);
      setShowSaveConfirmAlert(false);
    } catch (err) {
      alert("Failed to add bin.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitBin = () => {
    if (selectedBin?.binId === "new") {
      setShowSaveConfirmAlert(true);
    } else {
      setShowUpdateConfirmAlert(true);
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
        <Header pageTitle="E-Waste Bin Monitoring" adminName="Admin Name" />
        <div className="main-content-scaler">
          <div className="top-section">
            <div className="bins-summary-wrapper">
              <div className="totalbins-container">
                <h2>Total Bins Monitored</h2>
                <p>{bins.length}</p>
              </div>

              <div className="fullbins-container">
                <h2>Bin Needs Emptying</h2>
                <p>{bins.filter((bin) => bin.status === "Full").length}</p>
              </div>
            </div>

            <div
              className={`binview-container ${!isPanelOpen ? "panel-closed" : ""}`}
            >
              <h2>
                {selectedBin?.binId === "new" ? "Add New Bin" : "Bin Details"}
              </h2>
              {isPanelOpen ? (
                <div className="bin-view-content">
                  <div className="image-section">
                    <div className="upload-placeholder">
                      {imagePreview ? (
                        <img
                          src={getImageUrl(imagePreview)}
                          alt="Bin Preview"
                        />
                      ) : (
                        <img
                          src={
                            getImageUrl(selectedBin?.image) || imgPlaceholder
                          }
                          alt="Placeholder"
                        />
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg, .gif"
                      onChange={handleImageChange}
                      id="imageInput"
                      style={{ display: "none" }}
                    />
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
                            onClick={() =>
                              document.getElementById("imageInput").click()
                            }
                          >
                            UPLOAD
                          </AdminButton>
                        </label>
                      )}
                      <p className="accepted-file-desc">
                        Accepted formats: png, jpg, gif
                      </p>
                    </div>
                  </div>

                  <div className="bin-info">
                    <div className="bin-id-status-location">
                      <h3>
                        {selectedBin?.binId === "new"
                          ? "New Bin"
                          : selectedBin?.binId}
                      </h3>
                      <div className="status-location-row">
                        <div>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="Status" disabled>
                              Select Bin Status
                            </option>
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
                      <textarea
                        placeholder="Enter Remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="bin-actions">
                      <AdminButton
                        type={selectedBin?.binId === "new" ? "save" : "update"}
                        size="medium"
                        onClick={handleSubmitBin}
                        disabled={!isFormValid || isSaving || isRemoving}
                      >
                        {isSaving
                          ? selectedBin?.binId === "new"
                            ? "SAVING..."
                            : "UPDATING..."
                          : selectedBin?.binId === "new"
                            ? "SAVE"
                            : "UPDATE"}
                      </AdminButton>
                      {viewedFromTable && selectedBin ? (
                        <AdminButton
                          type="remove"
                          size="medium"
                          onClick={() => {
                            setBinToRemove(selectedBin);
                            setShowRemoveConfirmAlert(true);
                          }}
                          disabled={isSaving || isRemoving}
                        >
                          {isRemoving ? "REMOVING..." : "REMOVE"}
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
                      {sortOption === "status" &&
                        statusSubSort &&
                        ` : Status (${statusSubSort})`}
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
                                setStatusSubSort("All");
                                setShowStatusSubmenu(false);
                              }}
                            >
                              All
                            </div>
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
                  <AdminButton type="add" size="medium" onClick={handleAddBin}>
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
                      {isPanelOpen && selectedBin?.binId === bin.binId
                        ? "CLOSE"
                        : "VIEW"}
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
                    <div
                      key={activity._id || index}
                      className="admin-activity-item"
                    >
                      <p>
                        {activity.action} - {activity.details}
                        <br />
                        <span style={{ fontSize: "0.85em", color: "#888" }}>
                          {new Date(activity.timestamp).toLocaleString(
                            "en-PH",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                              timeZone: "Asia/Manila",
                            },
                          )}
                        </span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Confirmation Alert */}
        <Alert
          type="confirm"
          title="Add New Bin"
          message="Are you sure you want to add this new bin? Please review the details before confirming."
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={() => handleAddSubmitBin()}
          onCancel={() => setShowSaveConfirmAlert(false)}
          isOpen={showSaveConfirmAlert}
        />

        {/* Update Confirmation Alert */}
        <Alert
          type="confirm"
          title="Update Bin"
          message={`Are you sure you want to update bin at "${selectedBin?.location}"? This will save all changes you made.`}
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={() => handleUpdateBin()}
          onCancel={() => setShowUpdateConfirmAlert(false)}
          isOpen={showUpdateConfirmAlert}
        />

        {/* Remove Confirmation Alert */}
        <Alert
          type="confirm"
          title="Remove Bin"
          message={`Are you sure you want to remove bin at "${binToRemove?.location}"? This action cannot be undone.`}
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={() => {
            if (binToRemove) {
              handleRemoveBin(binToRemove);
            }
          }}
          onCancel={() => {
            setShowRemoveConfirmAlert(false);
            setBinToRemove(null);
          }}
          isOpen={showRemoveConfirmAlert}
        />

        {/* Success Alert */}
        <Alert
          type="alert"
          title={successTitle}
          message={successMessage}
          okText="OK"
          onConfirm={() => setShowSuccessAlert(false)}
          isOpen={showSuccessAlert}
        />
      </div>
    </>
  );
}
