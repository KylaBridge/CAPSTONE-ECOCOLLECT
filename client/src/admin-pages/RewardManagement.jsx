import React, { useState } from "react";
import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import "./styles/RewardManagement.css";
import { FaSearch } from "react-icons/fa";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import PlaceholderImg from "../assets/icons/mrcpu.png";

export default function RewardManagement() {
  const [rewards, setRewards] = useState([
    { id: 1, name: "Eco Tote Bag", category: "merch", points: 200, description: "Claim at GreenHub booth.", image: PlaceholderImg },
    { id: 2, name: "50 PHP Load", category: "mobile load", points: 150, description: "Will be sent to your number.", image: PlaceholderImg },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [newRewardId, setNewRewardId] = useState(null);
  const [originalReward, setOriginalReward] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredRewards = rewards.filter(r => {
    const matchesSearch = [r.name, r.category, String(r.id)].some(val => val.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredRewards.length / rowsPerPage);
  const paginatedRewards = filteredRewards.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleInputChange = (id, field, value) => {
    setRewards(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, [field]: value } : r);
      if (originalReward && id === originalReward.id) {
        const edited = updated.find(r => r.id === id);
        const changed = Object.keys(originalReward).some(key => edited[key] !== originalReward[key]);
        setHasChanges(changed);
      }
      return updated;
    });
  };

  const handleImageChange = (id, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result;
      setRewards(prev => {
        const updated = prev.map(r => r.id === id ? { ...r, image: imageDataUrl } : r);
        if (originalReward && id === originalReward.id) {
          const edited = updated.find(r => r.id === id);
          const changed = Object.keys(originalReward).some(key => edited[key] !== originalReward[key]);
          setHasChanges(changed);
        }
        return updated;
      });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleAddReward = () => {
    const newId = Date.now();
    const newReward = {
      id: newId,
      name: "",
      category: "merch",
      points: 0,
      description: "",
      image: ""
    };
    setRewards([newReward, ...rewards]);
    setEditId(newId);
    setNewRewardId(newId);
    setCurrentPage(1);
    setHasChanges(false);
  };

  const handleRemove = id => {
    setRewards(prev => prev.filter(r => r.id !== id));
    if (editId === id) setEditId(null);
    if (newRewardId === id) setNewRewardId(null);
  };

  const isAddFormComplete = () => {
  if (!newRewardId) return true; // not in add mode
  const newReward = rewards.find(r => r.id === newRewardId);
  if (!newReward) return true;
  return (
    newReward.name.trim() !== "" &&
    newReward.category.trim() !== "" &&
    newReward.points > 0 &&
    newReward.description.trim() !== "" &&
    newReward.image.trim() !== ""
  );
};

  const handleUpdate = () => {
    const current = rewards.find(r => r.id === editId);
    if (!current.name || !current.category || !current.points || !current.description || !current.image) {
      alert("All fields are required.");
      return;
    }
    setEditId(null);
    setNewRewardId(null);
    setOriginalReward(null);
    setHasChanges(false);
  };

  const handleCancelAdd = () => {
    setRewards(prev => prev.filter(r => r.id !== newRewardId));
    setEditId(null);
    setNewRewardId(null);
    setOriginalReward(null);
    setHasChanges(false);
  };

  const handleCancelEdit = () => {
    if (originalReward) {
      setRewards(prev => prev.map(r => r.id === originalReward.id ? originalReward : r));
    }
    setEditId(null);
    setOriginalReward(null);
    setHasChanges(false);
  };

  return (
    <div className="reward-management-container">
      <AdminSidebar />
      <Header pageTitle="Reward Management" adminName="Admin Name" />

      <div className="rewards-table-container">
        <div className="reward-header-controls">
          <button className="add-reward-button" onClick={handleAddReward}>+ Add Reward</button>
          <select className="sort-dropdown" onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="merch">Merch</option>
            <option value="mobile load">Mobile Load</option>
          </select>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search rewards"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
        </div>

        <div className="rewards-table-wrapper">
          <table className="rewards-table">
            <thead>
              <tr>
                <th>ID</th><th>Reward Name</th><th>Category</th>
                <th>Points</th><th>Description</th><th>Image</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
                {paginatedRewards.length === 0 ? (
                        <tr>
                        <td colSpan="7" style={{ textAlign: "center", padding: "20px", fontStyle: "italic", color: "#666" }}>
                            No rewards to display. Add one!
                        </td>
                        </tr>
                    ) : (
                paginatedRewards.map(reward => (
                <tr key={reward.id}>
                  <td>{reward.id}</td>

                  <td>
                    {editId === reward.id ? (
                      <input value={reward.name} onChange={e => handleInputChange(reward.id, "name", e.target.value)} />
                    ) : reward.name}
                  </td>

                  <td>
                    {editId === reward.id ? (
                      <select value={reward.category} onChange={e => handleInputChange(reward.id, "category", e.target.value)}>
                        <option value="merch">Merch</option>
                        <option value="mobile load">Mobile Load</option>
                      </select>
                    ) : reward.category}
                  </td>

                  <td>
                    {editId === reward.id ? (
                      <input type="number" value={reward.points} onChange={e => handleInputChange(reward.id, "points", e.target.value)} />
                    ) : reward.points}
                  </td>

                  <td>
                    {editId === reward.id ? (
                      <textarea className="desc-input-box" value={reward.description} onChange={e => handleInputChange(reward.id, "description", e.target.value)} />
                    ) : reward.description}
                  </td>

                  <td>
                    {reward.image && <img src={reward.image} className="preview-image" alt="Reward" />}
                    {editId === reward.id && (
                      <>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          style={{ display: "none" }}
                          id={`fileInput-${reward.id}`}
                          onChange={(e) => handleImageChange(reward.id, e.target.files[0])}
                        />
                        <button
                          className="replace-image-button"
                          onClick={() => document.getElementById(`fileInput-${reward.id}`).click()}
                        >
                          {reward.image ? "Replace Image" : "Add Image"}
                        </button>
                      </>
                    )}
                    {editId !== reward.id && !reward.image && "No image"}
                  </td>

                  <td>
                    {editId === reward.id ? (
                      <>
                        <button
                          className="update-button"
                          onClick={handleUpdate}
                          disabled={
                             (reward.id === newRewardId && !isAddFormComplete()) || // disable if adding and form incomplete
                             (!hasChanges && reward.id !== newRewardId) // disable if editing and no changes
                        }
                        >
                          {reward.id === newRewardId ? "Save" : "Update"}
                        </button>
                        {reward.id === newRewardId ? (
                          <button className="cancel-button" onClick={handleCancelAdd}>Cancel</button>
                        ) : (
                          <>
                            <button className="remove-button" onClick={() => handleRemove(reward.id)}>Delete</button>
                            <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                          </>
                        )}
                      </>
                    ) : (
                      <button
                        className="edit-button"
                        onClick={() => {
                          setOriginalReward({ ...reward });
                          setEditId(reward.id);
                          setHasChanges(false);
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <TbPlayerTrackPrevFilled size={15} color={currentPage === 1 ? "#ccc" : "#0e653f"} />
            </button>

            <span>Page {currentPage} of {totalPages}</span>

            <button
              onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              <TbPlayerTrackNextFilled size={15} color={currentPage === totalPages ? "#ccc" : "#0e653f"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
