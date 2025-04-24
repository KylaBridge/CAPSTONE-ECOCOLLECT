import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import "./styles/EWasteSubmission.css";

// Components and Assets
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EWasteHeaderTitle from "../assets/headers/ewaste-header.png";
import ChipIcon from "../assets/icons/chipandtrash.png";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { MdDelete } from 'react-icons/md';

export default function EWasteSubmission() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [submissionLogs, setSubmissionLogs] = useState([]);
  const { user } = useContext(UserContext);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}`);
        return;
      }

      if (file.size > maxSize) {
        alert(`File too large: ${file.name}`);
        return;
      }

      setAttachments(prev => [...prev, file]);
      setIsSubmitDisabled(false);
    });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setIsSubmitDisabled(attachments.length === 0 || !event.target.value);
  };

  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    setIsSubmitDisabled(newAttachments.length === 0 || !selectedCategory);
  };

  const fetchSubmissionLogs = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`http://localhost:3000/api/ecocollect/ewaste/user/${user._id}`);
      setSubmissionLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch submission logs", err);
    }
  };

  const handleSubmit = async () => {
    if (!user?._id) {
      alert("User not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("category", selectedCategory);
    attachments.forEach(file => formData.append("attachments", file));

    try {
      const response = await axios.post("http://localhost:3000/api/ecocollect/ewaste", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("E-Waste submitted successfully!");
        setAttachments([]);
        setSelectedCategory("");
        setIsSubmitDisabled(true);
        fetchSubmissionLogs();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting.");
    }
  };

  useEffect(() => {
    fetchSubmissionLogs();
  }, [user]);

  return (
    <div className="body-submission-module">
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={EWasteHeaderTitle} headerText="E-Waste Submission" />

      <div className="waste-main-container">
        <div className="drop-ewaste-container">
          <h1>Drop your E-Waste!</h1>
          <div className="upload-button-container">
            <input type="file" id="file-upload" style={{ display: "none" }} onChange={handleUpload} multiple />
            <label htmlFor="file-upload">UPLOAD</label>
          </div>
          <img src={ChipIcon} alt="Chip and Trash Icon" className="chip-icon" />

          <div className="upload-content-wrapper">
            <ul className="instruction-list">
              <li><IoMdArrowDroprightCircle className="instruction-icon" /> Let's focus on one e-waste item per submission.</li>
              <li><IoMdArrowDroprightCircle className="instruction-icon" /> Tell us what kind of e-waste you're sending.</li>
              <li><IoMdArrowDroprightCircle className="instruction-icon" /> Add as many pics as you need.</li>
              <li><IoMdArrowDroprightCircle className="instruction-icon" /> We'll give it a once-over and let you know it's good to go!</li>
            </ul>

            <div className="attachments-section">
              <h2>Attachments</h2>
              {attachments.length > 0 ? (
                <ul className="attachment-list">
                  {attachments.map((file, index) => (
                    <li key={index} className="attachment-item">
                      <span className="attachment-name">{file.name}</span>
                      <MdDelete style={{ fontSize: '16px', color: '#245a1e' }} onClick={() => handleRemoveAttachment(index)} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-attachments">No attachments yet.</p>
              )}
            </div>

            <div className="item-selection-container">
              <select className="category-select" value={selectedCategory || ""} onChange={handleCategoryChange}>
                <option value="" disabled>Select E-Waste Category</option>
                <option value="Telephone">Telephone</option>
                <option value="Router">Router</option>
                <option value="Mobile Phone">Mobile Phone</option>
                <option value="Tablet">Tablet</option>
                <option value="Laptop">Laptop</option>
                <option value="Charger">Charger</option>
                <option value="Batteries">Batteries</option>
                <option value="Cords">Cords</option>
                <option value="Powerbank">Powerbank</option>
                <option value="USB">USB</option>
              </select>
            </div>

            <button onClick={handleSubmit} disabled={isSubmitDisabled}>SUBMIT</button>
          </div>
        </div>

        {/* User E-waste submission Log */}
        <div className="log-container">
          <div className="recent-title-container">
            <h2>E-Waste Submissions</h2>
          </div>

          <div className="recent-activity-container">
            <h2>Recent</h2>
            <ul className="activity-list">
              {submissionLogs.length > 0 ? submissionLogs.map((activity) => (
                <li key={activity._id} className="activity-item">
                  <span className="activity-id">Submission ID: {activity._id}</span>
                  <span className="activity-status">Category: {activity.category}</span>
                  <span className="activity-date">{new Date(activity.createdAt).toLocaleString()}</span>
                  <span className={`activity-result ${activity.status?.toLowerCase()}`}>Status: {activity.status || "Pending"}</span>
                </li>
              )) : (
                <li>No submissions yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
