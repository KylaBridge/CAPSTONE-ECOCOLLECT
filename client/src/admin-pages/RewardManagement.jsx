import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../admin-components/AdminSidebar";
import Header from "../admin-components/Header";
import "./styles/RewardManagement.css";
import { FaSearch } from "react-icons/fa";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { toast } from "react-hot-toast";
import AdminButton from "../admin-components/AdminButton";

export default function RewardManagement() {
  const [rewards, setRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [newRewardId, setNewRewardId] = useState(null);
  const [originalReward, setOriginalReward] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 5;

  // Fetch rewards from backend
  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/ecocollect/rewards");
      const rewardsWithImageUrls = response.data.map(reward => ({
        ...reward,
        id: reward._id,
        image: reward.image ? `http://localhost:3000/${reward.image.path}` : null
      }));
      setRewards(rewardsWithImageUrls);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      toast.error("Failed to fetch rewards");
      setLoading(false);
    }
  };

  const filteredRewards = rewards.filter(r => {
    const matchesSearch = [r.name, r.category, String(r.id)].some(val => 
      val.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
      const updated = prev.map(r => 
        r.id === id 
          ? { ...r, [field]: field === "points" ? Number(value) : value } 
          : r
      );
      if (originalReward && id === originalReward.id) {
        const edited = updated.find(r => r.id === id);
        const changed = Object.keys(originalReward).some(key => edited[key] !== originalReward[key]);
        setHasChanges(changed);
      }
      return updated;
    });
  };

  const handleImageChange = async (id, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result;
      setRewards(prev => {
        const updated = prev.map(r => r.id === id ? { ...r, image: imageDataUrl, imageFile: file } : r);
        if (originalReward && id === originalReward.id) {
          setHasChanges(true);
        }
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddReward = () => {
    const newId = 'new-' + Date.now();
    const newReward = {
      id: newId,
      name: "",
      category: "merch",
      points: 0,
      description: "",
      image: null
    };
    setRewards([newReward, ...rewards]);
    setEditId(newId);
    setNewRewardId(newId);
    setCurrentPage(1);
    setHasChanges(false);
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reward?")) {
      return;
    }

    try {
      if (!id.startsWith('new-')) {
        await axios.delete(`http://localhost:3000/api/ecocollect/rewards/${id}`);
        toast.success("Reward deleted successfully");
      }
      setRewards(prev => prev.filter(r => r.id !== id));
      if (editId === id) setEditId(null);
      if (newRewardId === id) setNewRewardId(null);
    } catch (error) {
      console.error("Error deleting reward:", error);
      toast.error("Failed to delete reward");
    }
  };

  const isAddFormComplete = () => {
    if (!newRewardId) return true;
    const newReward = rewards.find(r => r.id === newRewardId);
    if (!newReward) return true;
    return (
      newReward.name.trim() !== "" &&
      newReward.category.trim() !== "" &&
      newReward.points > 0 &&
      newReward.description.trim() !== ""
    );
  };

  const handleUpdate = async () => {
    const current = rewards.find(r => r.id === editId);
    if (!current.name || !current.category || !current.points || !current.description) {
      toast.error("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", current.name);
      formData.append("category", current.category);
      formData.append("points", current.points);
      formData.append("description", current.description);
      if (current.imageFile) {
        formData.append("image", current.imageFile);
      }

      let response;
      if (current.id.startsWith('new-')) {
        response = await axios.post("http://localhost:3000/api/ecocollect/rewards", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Reward added successfully");
      } else {
        response = await axios.put(`http://localhost:3000/api/ecocollect/rewards/${current.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Reward updated successfully");
      }

      // Update the rewards list with the new data
      await fetchRewards();
      
      setEditId(null);
      setNewRewardId(null);
      setOriginalReward(null);
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving reward:", error);
      toast.error("Failed to save reward");
    }
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

  // Helper to check if in add/edit mode
  const isEditingOrAdding = editId !== null;

  // Handler to show toast if restricted
  const showEditWarning = () => {
    toast.error("Finish adding or editing the current reward before proceeding.", { position: "bottom-right" });
  };

  return (
    <div className="reward-management-container">
      <AdminSidebar />
      <Header pageTitle="Reward Management" adminName="Admin Name" />

      <div className="rewards-table-container">
        <div className="reward-header-controls">
          <AdminButton
            type="add"
            size="medium"
            onClick={isEditingOrAdding ? showEditWarning : handleAddReward}
            disabled={isEditingOrAdding}
          >
            Add Reward
          </AdminButton>
          <select
            className="sort-dropdown"
            onChange={isEditingOrAdding ? showEditWarning : (e) => setCategoryFilter(e.target.value)}
            value={categoryFilter}
            disabled={isEditingOrAdding}
          >
            <option value="all">All Categories</option>
            <option value="merch">Merch</option>
            <option value="mobile load">Mobile Load</option>
          </select>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search rewards"
              value={searchTerm}
              onChange={isEditingOrAdding ? showEditWarning : e => setSearchTerm(e.target.value)}
              className="search-input"
              disabled={isEditingOrAdding}
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
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    Loading rewards...
                  </td>
                </tr>
              ) : paginatedRewards.length === 0 ? (
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
                        <input 
                            type="number" 
                            value={reward.points} 
                            onChange={e => {
                                const value = e.target.value;
                                if (value === '') {
                                    handleInputChange(reward.id, "points", '');
                                } else {
                                    const numValue = parseInt(value);
                                    if (!isNaN(numValue) && numValue >= 0) {
                                        handleInputChange(reward.id, "points", numValue);
                                    }
                                }
                            }}
                            onBlur={e => {
                                const value = e.target.value;
                                if (value !== '') {
                                    const cleanValue = value.replace(/^0+/, '') || '0';
                                    handleInputChange(reward.id, "points", parseInt(cleanValue));
                                }
                            }}
                            min="0"
                        />
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
                          <AdminButton
                            type="upload"
                            size="small"
                            className="reward-table-btn"
                            onClick={() => document.getElementById(`fileInput-${reward.id}`).click()}
                          >
                            {reward.image ? "Replace Image" : "Add Image"}
                          </AdminButton>
                        </>
                      )}
                      {editId !== reward.id && !reward.image && "No image"}
                    </td>
                    <td>
                      {editId === reward.id ? (
                        <>
                          <AdminButton
                            type={reward.id === newRewardId ? "save" : "update"}
                            size="small"
                            className="reward-table-btn"
                            onClick={handleUpdate}
                            disabled={
                              (reward.id === newRewardId && !isAddFormComplete()) ||
                              (!hasChanges && reward.id !== newRewardId)
                            }
                          >
                            {reward.id === newRewardId ? "Save" : "Update"}
                          </AdminButton>
                          {reward.id === newRewardId ? (
                            <AdminButton type="cancel" size="small" className="reward-table-btn" onClick={handleCancelAdd}>Cancel</AdminButton>
                          ) : (
                            <>
                              <AdminButton type="remove" size="small" className="reward-table-btn" onClick={() => handleRemove(reward.id)}>Delete</AdminButton>
                              <AdminButton type="cancel" size="small" className="reward-table-btn" onClick={handleCancelEdit}>Cancel</AdminButton>
                            </>
                          )}
                        </>
                      ) : (
                        <AdminButton
                          type="update"
                          size="small"
                          className="reward-table-btn"
                          onClick={
                            isEditingOrAdding
                              ? showEditWarning
                              : () => {
                                  setOriginalReward({ ...reward });
                                  setEditId(reward.id);
                                  setHasChanges(false);
                                }
                          }
                          disabled={isEditingOrAdding}
                        >
                          Edit
                        </AdminButton>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button
              onClick={isEditingOrAdding ? showEditWarning : () => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isEditingOrAdding}
              className="pagination-button"
            >
              <TbPlayerTrackPrevFilled size={15} color={currentPage === 1 || isEditingOrAdding ? "#ccc" : "#0e653f"} />
            </button>

            <span>Page {currentPage} of {totalPages}</span>

            <button
              onClick={isEditingOrAdding ? showEditWarning : () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
              disabled={currentPage === totalPages || isEditingOrAdding}
              className="pagination-button"
            >
              <TbPlayerTrackNextFilled size={15} color={currentPage === totalPages || isEditingOrAdding ? "#ccc" : "#0e653f"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
