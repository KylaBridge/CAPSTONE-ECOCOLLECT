import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineClose,
} from "react-icons/ai";
import "./styles/AddUserModal.css";

export default function AddUserModal({
  isOpen,
  onClose,
  onUserAdded,
  currentUserRole,
}) {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = () => {
    return (
      form.password.length >= 6 &&
      /\d/.test(form.password) &&
      /[A-Z]/.test(form.password) &&
      /[!@#$%^&*]/.test(form.password)
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.email || !form.name || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isPasswordValid()) {
      toast.error(
        "Password must be at least 6 characters long and contain at least one number, one uppercase letter, and one special character."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Role validation
    if (
      currentUserRole === "admin" &&
      (form.role === "admin" || form.role === "superadmin")
    ) {
      toast.error("You can only create regular users.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/ecocollect/usermanagement/add", {
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role,
      });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("User added successfully!");
        onUserAdded();
        onClose();
        setForm({
          email: "",
          name: "",
          password: "",
          confirmPassword: "",
          role: "user",
        });
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(error.response?.data?.error || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      role: "user",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-user-modal-overlay">
      <div className="add-user-modal-content">
        <div className="add-user-modal-header">
          <h2>Add New User</h2>
          <button className="add-user-modal-close-btn" onClick={handleClose}>
            <AiOutlineClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-user-modal-form">
          <div className="add-user-form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-user-form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-user-form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              {currentUserRole === "superadmin" && (
                <option value="admin">Admin</option>
              )}
            </select>
          </div>

          <div className="add-user-form-group">
            <label htmlFor="password">Password *</label>
            <div className="add-user-password-input">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="add-user-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </button>
            </div>
            <div className="add-user-password-requirements">
              <small
                className={
                  form.password.length >= 6
                    ? "add-user-requirement-valid"
                    : "add-user-requirement-invalid"
                }
              >
                • At least 6 characters
              </small>
              <small
                className={
                  /\d/.test(form.password)
                    ? "add-user-requirement-valid"
                    : "add-user-requirement-invalid"
                }
              >
                • At least one number
              </small>
              <small
                className={
                  /[A-Z]/.test(form.password)
                    ? "add-user-requirement-valid"
                    : "add-user-requirement-invalid"
                }
              >
                • At least one uppercase letter
              </small>
              <small
                className={
                  /[!@#$%^&*]/.test(form.password)
                    ? "add-user-requirement-valid"
                    : "add-user-requirement-invalid"
                }
              >
                • At least one special character (!@#$%^&*)
              </small>
            </div>
          </div>

          <div className="add-user-form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <div className="add-user-password-input">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="add-user-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </button>
            </div>
            {form.confirmPassword && (
              <small
                className={
                  form.password === form.confirmPassword
                    ? "add-user-requirement-valid"
                    : "add-user-requirement-invalid"
                }
              >
                {form.password === form.confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </small>
            )}
          </div>

          <div className="add-user-modal-actions">
            <button
              type="button"
              className="add-user-cancel-btn"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-user-submit-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
