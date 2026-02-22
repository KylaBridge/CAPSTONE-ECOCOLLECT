import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { ewasteAPI } from "../api/ewaste";
import "./styles/EWasteSubmission.css";

// Components and Assets
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Logs from "../components/Logs";
import EWasteHeaderTitle from "../assets/headers/ewaste-header.png";
import ChipIcon from "../assets/icons/chipandtrash.png";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaCamera } from "react-icons/fa";

export default function EWasteSubmission() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submissionLogs, setSubmissionLogs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(UserContext);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;
    const maxImages = 5;

    // Check if adding new files would exceed the limit
    if (attachments.length + files.length > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}`);
        return;
      }

      if (file.size > maxSize) {
        alert(`File too large: ${file.name}`);
        return;
      }

      // Double check we don't exceed limit when adding individual files
      if (attachments.length < maxImages) {
        setAttachments((prev) => [...prev, file]);
      }
    });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const fetchSubmissionLogs = async () => {
    if (!user?._id) return;
    try {
      const res = await ewasteAPI.getUserSubmissions(user._id);
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

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("category", selectedCategory);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      const response = await ewasteAPI.submitEWaste(formData);

      if (response.status === 201) {
        alert("E-Waste submitted successfully!");
        setAttachments([]);
        setSelectedCategory("");
        fetchSubmissionLogs();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
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
            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleUpload}
              multiple
              disabled={attachments.length >= 5}
            />
            <label
              htmlFor="file-upload"
              className={attachments.length >= 5 ? "disabled-upload" : ""}
              style={{
                pointerEvents: attachments.length >= 5 ? "none" : "auto",
                opacity: attachments.length >= 5 ? 0.6 : 1,
              }}
            >
              <FaCamera className="camera-icon" />
              {attachments.length >= 5 ? "MAX" : "UPLOAD"}
            </label>
          </div>
          <img src={ChipIcon} alt="Chip and Trash Icon" className="chip-icon" />

          <div className="upload-content-wrapper">
            <ul className="instruction-list">
              <li>
                <IoMdArrowDroprightCircle className="instruction-icon" /> Let's
                focus on one e-waste item per submission.
              </li>
              <li>
                <IoMdArrowDroprightCircle className="instruction-icon" /> Tell
                us what kind of e-waste you're sending.
              </li>
              <li>
                <IoMdArrowDroprightCircle className="instruction-icon" /> Add
                pics at least 1 to 5. Only upload 5 pics.
              </li>
              <li>
                <IoMdArrowDroprightCircle className="instruction-icon" /> We'll
                give it a once-over and let you know it's good to go!
              </li>
            </ul>

            <div className="attachments-section">
              <h2>Attachments</h2>
              {attachments.length > 0 ? (
                <ul className="attachment-list">
                  {attachments.map((file, index) => (
                    <li key={index} className="attachment-item">
                      <span className="attachment-name">{file.name}</span>
                      <MdDelete
                        style={{ fontSize: "16px", color: "#245a1e" }}
                        onClick={() => handleRemoveAttachment(index)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-attachments">No attachments yet.</p>
              )}
            </div>

            <div className="item-selection-container">
              <select
                className="category-select"
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
              >
                <option value="" disabled>
                  Select E-Waste Category
                </option>
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
                <option value="others">Others</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={
                !attachments.length || !selectedCategory || isSubmitting
              }
              className={
                !attachments.length || !selectedCategory || isSubmitting
                  ? "disabled-button"
                  : ""
              }
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </div>
        </div>

        <Logs submissionLogs={submissionLogs} />
      </div>
    </div>
  );
}
