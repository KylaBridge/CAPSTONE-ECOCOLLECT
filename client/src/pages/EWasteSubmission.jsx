import { useState } from "react"
import "./styles/EWasteSubmission.css"

// Components and Pages
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import EWasteHeaderTitle from "../assets/headers/ewaste-header.png"
import ChipIcon from "../assets/icons/chipandtrash.png"
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { MdDelete } from 'react-icons/md'; 

export default function EWasteSubmission() {
  const [showNavbar, setShowNavbar] = useState(false)
  const [attachments, setAttachments] = useState([]); // Store attachments
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true); 

   // Dummy data for recent activity
   const dummyActivityLog = [
    { id: 1234, status: "Pending", date: "Dec 12, 2025 - 3:00 PM" },
    { id: 5678, status: "Completed", date: "Nov 28, 2025 - 12:00 PM" },
    { id: 9012, status: "Submitted", date: "Dec 15, 2025 - 2:00 PM" },
    { id: 3456, status: "Processing", date: "Dec 16, 2025 - 10:00 AM" },
    { id: 7890, status: "Completed", date: "Dec 17, 2025 - 4:00 PM" },
    // Add more dummy data as needed
  ];

const handleUpload = (event) => {
  const files = event.target.files;

  if (files && files.length > 0) {
    const newAttachments = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type for ${file.name}. Please upload a JPEG, PNG, PDF, or DOC file.`);
        continue; // Skip to the next file
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File size exceeds the limit of 5MB for ${file.name}.`);
        continue;
      }

      newAttachments.push({ name: file.name, file }); // Store file name and file object

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          // Optionally update the attachments state with imageUrl
          setAttachments((prevAttachments) => {
            return prevAttachments.map((attachment, index) => {
              if (attachment.name === file.name) {
                return { ...attachment, imageUrl };
              }
              return attachment;
            });
          });
        };
        reader.readAsDataURL(file);
      }
    }
    setAttachments((prevAttachments) => [...prevAttachments, ...newAttachments]); // Add new attachments to the state
  }

  setIsSubmitDisabled(false);
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


  
  return (
    <>
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
          <li>
            <div className="instruction-icon-container">
              <IoMdArrowDroprightCircle className="instruction-icon" />
            </div>
            <div className="instruction-text">
              Let's focus on one e-waste item per submission.
            </div>
          </li>
          <li>
            <div className="instruction-icon-container">
              <IoMdArrowDroprightCircle className="instruction-icon" />
            </div>
            <div className="instruction-text">
              Tell us what kind of e-waste you're sending.
            </div>
          </li>
          <li>
            <div className="instruction-icon-container">
              <IoMdArrowDroprightCircle className="instruction-icon" />
            </div>
            <div className="instruction-text">
              Add as many pics as you need.
            </div>
          </li>
          <li>
            <div className="instruction-icon-container">
              <IoMdArrowDroprightCircle className="instruction-icon" />
            </div>
            <div className="instruction-text">
              We'll give it a once-over and let you know it's good to go!
            </div>
          </li>
        </ul>

            <div className="attachments-section">
              <h2>Attachments</h2>
              {attachments.length > 0 ? (
                <ul className="attachment-list">
                  {attachments.map((attachment, index) => (
                    <li key={index} className="attachment-item">
                      <span className="attachment-name">{attachment.name}</span> 
                      <MdDelete
                    style={{ fontSize: '16px', color: '#245a1e' }}
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
                <option value="" disabled>Select E-Waste Category</option>
                <option value="Phone">Phone</option>
                <option value="Laptop">Laptop</option>
                <option value="Battery">Battery</option>
                <option value="Charger">Charger</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button disabled={isSubmitDisabled}>SUBMIT</button>
          </div>
        </div>


        {/* User E-waste submission Log*/}
        <div className="log-container">
          <div className="recent-title-container">
            <h2>E-Waste Submissions</h2>
          </div>

          <div className="recent-activity-container">
            <h2>Recent Activity</h2>         
            
            <ul className="activity-list">
              {dummyActivityLog.map((activity) => (
                <li key={activity.id} className="activity-item">
                  <span className="activity-id">Submission ID: {activity.id}</span>
                  <span className="activity-status">Status: {activity.status}</span>
                  <span className="activity-date">{activity.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
