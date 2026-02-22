import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { ewasteAPI } from "../api/ewaste";
import toast from "react-hot-toast";
import { MdOutlineZoomOutMap } from "react-icons/md";
import "./styles/EWasteSubmit.css";
import AdminButton from "../admin-components/AdminButton";

export default function EWasteSubmit() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [statusValue, setStatusValue] = useState("Pending");
  const [openSubmissionId, setOpenSubmissionId] = useState(null);
  const [originalStatus, setOriginalStatus] = useState("Pending");
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
  const [points, setPoints] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    ewasteAPI
      .getAllSubmissions()
      .then((res) => {
        const formattedData = res.data
          .filter((sub) => sub.status === "Pending")
          .map((sub) => ({
            id: sub._id,
            name: sub.user?.name || "Unknown",
            submissionDate: new Date(sub.createdAt).toLocaleDateString(),
            status: sub.status || "Pending",
            category: sub.category,
            images: sub.attachments.map(
              (img) => `${import.meta.env.VITE_API_URL}/${img.path}`,
            ),
          }));
        setSubmissions(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching submissions:", error);
      });
  }, []);

  const handleNextImage = () => {
    if (
      selectedSubmission?.images?.length > 1 &&
      currentImageIndex < selectedSubmission.images.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedSubmission?.images?.length > 1 && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleUpdateSubmission = async () => {
    if (isUpdating) return; // Prevent multiple submissions

    setIsUpdating(true);

    try {
      // Prepare update data
      const updateData = {
        status: statusValue,
      };

      // Add points if category is "others"
      if (selectedSubmission.category === "others" && points) {
        updateData.points = parseInt(points);
      }

      const updateRes = await ewasteAPI.updateSubmissionStatus(
        selectedSubmission.id,
        updateData,
      );

      if (updateRes.status !== 200) {
        throw new Error("Failed to update status");
      }

      setSubmissions((prev) =>
        prev.filter((sub) => sub.id !== selectedSubmission.id),
      );
      setSelectedSubmission(null);
      setOpenSubmissionId(null);

      toast.success(`Submission ${statusValue.toLowerCase()} successfully.`);
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error("An error occurred while updating the submission.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePointsChange = (e) => {
    const value = e.target.value;
    // Only allow positive integers
    if (value === "" || /^[1-9]\d*$/.test(value)) {
      setPoints(value);
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

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusSubmenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add sorting logic using useMemo
  const sortedSubmissions = useMemo(() => {
    let sorted = [...submissions];
    if (sortOption === "date") {
      sorted.sort(
        (a, b) => new Date(b.submissionDate) - new Date(a.submissionDate),
      );
    } else if (sortOption === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [submissions, sortOption]);

  return (
    <>
      <div className="ewaste-submit-main-container">
        <AdminSidebar />
        <Header
          pageTitle="E-Waste Submission Validation"
          adminName="Admin Name"
        />
        <div className="flex-container">
          <div className="submittedewaste-table-container">
            <div className="submit-table-header">
              <div className="submit-table-sort-dropdown" ref={dropdownRef}>
                <button
                  className="submit-table-sort-btn"
                  onClick={() => setShowStatusSubmenu(!showStatusSubmenu)}
                  type="button"
                >
                  Sort By
                  {sortOption === "date" && " : Date"}
                  {sortOption === "name" && " : Name"}
                </button>
                {showStatusSubmenu && (
                  <div className="submit-table-dropdown-menu">
                    <div
                      className="submit-table-dropdown-item"
                      onClick={() => {
                        setSortOption("date");
                        setShowStatusSubmenu(false);
                      }}
                    >
                      Date
                    </div>
                    <div
                      className="submit-table-dropdown-item"
                      onClick={() => {
                        setSortOption("name");
                        setShowStatusSubmenu(false);
                      }}
                    >
                      Name
                    </div>
                  </div>
                )}
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
                <tbody>
                  {sortedSubmissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          fontStyle: "italic",
                        }}
                      >
                        No details to show yet.
                      </td>
                    </tr>
                  ) : (
                    sortedSubmissions.map((submission) => (
                      <tr key={submission.id}>
                        <td className="submission-id-cell">{submission.id}</td>
                        <td>{submission.name}</td>
                        <td>{submission.submissionDate}</td>
                        <td>{submission.status}</td>
                        <td>
                          <AdminButton
                            type="view"
                            size="small"
                            isActive={openSubmissionId === submission.id}
                            onClick={() => handleDetailsClick(submission)}
                          >
                            {openSubmissionId === submission.id
                              ? "CLOSE"
                              : "VIEW"}
                          </AdminButton>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PANEL */}
          <div
            className={`submitewaste-panel-container ${!selectedSubmission ? "empty" : ""}`}
          >
            <h3>Submission View</h3>
            {selectedSubmission ? (
              <div className="panel-grid">
                <div className="submitimage-container">
                  <div className="submitimage-section">
                    {selectedSubmission?.images?.length > 1 && (
                      <button
                        className="nav-button prev"
                        onClick={handlePrevImage}
                      >
                        {"<"}
                      </button>
                    )}
                    <div
                      className="zoomable-image-wrapper"
                      onClick={() => {
                        setModalImageIndex(currentImageIndex);
                        setImageModalOpen(true);
                      }}
                    >
                      <img
                        src={selectedSubmission.images[currentImageIndex]}
                        alt="Submission"
                        onError={(e) => {
                          e.target.src = "/assets/fallback.png";
                        }}
                        className="zoomable-image"
                      />
                      <div className="zoom-icon">
                        <MdOutlineZoomOutMap size={24} />
                      </div>
                    </div>
                    {selectedSubmission?.images?.length > 1 && (
                      <button
                        className="nav-button next"
                        onClick={handleNextImage}
                      >
                        {">"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="panel-form">
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
                  {selectedSubmission.category === "others" && (
                    <div className="panel-detail">
                      <span>Points:</span>
                      <input
                        type="text"
                        value={points}
                        onChange={handlePointsChange}
                        placeholder="Enter points"
                        className="points-input"
                      />
                    </div>
                  )}
                  <div className="panel-detail">
                    <h4>Status:</h4>
                    <select
                      value={statusValue}
                      onChange={(e) => setStatusValue(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="panel-button">
                    <AdminButton
                      type="update"
                      size="medium"
                      onClick={handleUpdateSubmission}
                      disabled={
                        isUpdating ||
                        statusValue === originalStatus ||
                        (selectedSubmission.category === "others" &&
                          statusValue === "Approved" &&
                          !points)
                      }
                    >
                      {isUpdating ? "UPDATING..." : "UPDATE"}
                    </AdminButton>
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

      {isImageModalOpen && selectedSubmission?.images?.length > 0 && (
        <div
          className="image-modal-backdrop"
          onClick={() => setImageModalOpen(false)}
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setImageModalOpen(false)}
            >
              ✖
            </button>
            <div className="modal-image-wrapper">
              {selectedSubmission.images.length > 1 && (
                <button
                  className="modal-nav-button left"
                  onClick={() =>
                    setModalImageIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={modalImageIndex === 0}
                >
                  {"<"}
                </button>
              )}
              <img
                src={selectedSubmission.images[modalImageIndex]}
                alt="Zoomed"
                className="modal-image"
              />

              {selectedSubmission.images.length > 1 && (
                <button
                  className="modal-nav-button right"
                  onClick={() =>
                    setModalImageIndex((prev) =>
                      Math.min(selectedSubmission.images.length - 1, prev + 1),
                    )
                  }
                  disabled={
                    modalImageIndex === selectedSubmission.images.length - 1
                  }
                >
                  {">"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
