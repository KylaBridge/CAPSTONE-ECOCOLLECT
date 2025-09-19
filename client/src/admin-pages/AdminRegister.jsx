import "./styles/AdminRegister.css";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import BackgroundImage from "../assets/bgphoto-ecocollect.png";
import PartnershipLogos from "../assets/partnershiplogos.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineArrowLeft,
} from "react-icons/ai";

const passwordRequirements = [
  { label: "At least 10 characters", test: (pw) => pw.length >= 10 },
  {
    label: "At least one special character and one upper case",
    test: (pw) =>
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) && /[A-Z]/.test(pw),
  },
  { label: "At least one number", test: (pw) => /\d/.test(pw) },
];

export default function AdminRegister() {
  const navigate = useNavigate();
  const { registerEmailName, registerPassword, registerUserFinal } =
    useContext(UserContext);
  const [tempToken, setTempToken] = useState("");
  const [newTempToken, setNewTempToken] = useState("");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    code: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function isValidEmail(email) {
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
  }

  function allPasswordValid() {
    return passwordRequirements.every((req) => req.test(form.password));
  }

  async function handleNextStep1(e) {
    e.preventDefault();
    if (!form.email || !form.name) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      const data = await registerEmailName({
        email: form.email,
        name: form.name,
      });
      if (data.error) return toast.error(data.error);
      setTempToken(data.tempToken);
      setStep(2);
    } catch (err) {
      toast.error("Error");
    }
  }

  async function handleNextStep2(e) {
    e.preventDefault();
    if (!allPasswordValid()) {
      toast.error("Password does not meet requirements.");
      return;
    }
    setLoading(true);
    try {
      const data = await registerPassword({
        password: form.password,
        tempToken,
      });
      if (data.error) return toast.error(data.error);
      setNewTempToken(data.newTempToken);
      setStep(3);
      toast.success("Verification code sent to your email.");
    } catch (err) {
      toast.error("Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerUserFinal({
        code: form.code,
        newTempToken,
        role: form.role,
      });
      if (data.error) return toast.error(data.error);
      toast.success("Admin registered successfully");
      navigate("/admin/login");
    } catch (err) {
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-register-page">
      <div className="bg-form-container">
        <div className="admin-register-left">
          <img
            className="forest-characters"
            src={BackgroundImage}
            alt="EcoCollect Characters"
          />
        </div>
        <div className="admin-register-right">
          <img className="logo" src={EcoCollectLogo} alt="EcoCollect Logo" />
          <form
            className="admin-register-form"
            onSubmit={
              step === 1
                ? handleNextStep1
                : step === 2
                ? handleNextStep2
                : handleRegister
            }
          >
            <h1>Admin Registration</h1>
            <p className="welcome-title">Welcome to EcoCollect!</p>
            {step === 1 && (
              <>
                <div className="step-header">
                  <span className="step-indicator">Step 1 of 3</span>
                </div>
                <label htmlFor="email">Admin Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <div className="name-hint">
                  This name will appear on your profile
                </div>
                <button
                  className="register-btn"
                  type="submit"
                  disabled={
                    loading ||
                    !form.name ||
                    !form.email ||
                    !isValidEmail(form.email)
                  }
                >
                  Next
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <div className="step-header">
                  <button
                    type="button"
                    className="step-back"
                    aria-label="Back to previous step"
                    onClick={() => setStep(1)}
                  >
                    <AiOutlineArrowLeft size={20} />
                  </button>
                  <span className="step-indicator">Step 2 of 3</span>
                </div>
                <label htmlFor="password">Create Password</label>
                <div className="password-input">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="admin-register-password-toggle-visibility"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <AiOutlineEye size={20} />
                    ) : (
                      <AiOutlineEyeInvisible size={20} />
                    )}
                  </button>
                </div>
                <div className="password-checklist">
                  {passwordRequirements.map((req, idx) => (
                    <div
                      key={idx}
                      className={req.test(form.password) ? "valid" : ""}
                    >
                      {req.test(form.password) ? "✔" : "✖"} {req.label}
                    </div>
                  ))}
                </div>
                <button
                  className="register-btn"
                  type="submit"
                  disabled={loading || !form.password || !allPasswordValid()}
                >
                  {loading ? "Sending..." : "Next"}
                </button>
              </>
            )}
            {step === 3 && (
              <>
                <div className="step-header">
                  <button
                    type="button"
                    className="step-back"
                    aria-label="Back to previous step"
                    onClick={() => setStep(2)}
                  >
                    <AiOutlineArrowLeft size={20} />
                  </button>
                  <span className="step-indicator">Step 3 of 3</span>
                </div>
                <div className="verification-info">
                  A verification code has been sent to <b>{form.email}</b>.
                </div>
                <label htmlFor="code">Enter Verification Code</label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  value={form.code}
                  onChange={handleChange}
                  required
                />
                <button
                  className="register-btn2"
                  type="submit"
                  disabled={loading || !form.code}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </>
            )}
            <p className="or-separator">or</p>
            <p className="login-link">
              Already have an account? <Link to="/admin/login">Login</Link>
            </p>
          </form>
          <img
            className="partnership-logos"
            src={PartnershipLogos}
            alt="Partnership Logos"
          />
        </div>
      </div>
    </div>
  );
}
