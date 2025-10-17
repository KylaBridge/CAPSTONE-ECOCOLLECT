import "./styles/Register.css";
import { useState, useContext, useEffect } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import PartnershipLogos from "../assets/partnershiplogos.png";
import GoogleIcon from "../assets/google-icon.svg";
import { initiateGoogleAuth } from "../utils/googleAuth";

const passwordRequirements = [
  { label: "At least 10 characters", test: (pw) => pw.length >= 10 },
  {
    label: "At least one special character and one upper case",
    test: (pw) =>
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) && /[A-Z]/.test(pw),
  },
  { label: "At least one number", test: (pw) => /\d/.test(pw) },
];

// Name validation - allow letters, numbers, spaces, hyphens, apostrophes, and underscores
const isValidName = (name) => {
  return /^[a-zA-Z0-9\s\-'_]+$/.test(name);
};

export default function Register() {
  const navigate = useNavigate();
  const {
    registerEmailName,
    checkUsernameAvailability,
    registerPassword,
    registerUserFinal,
    getGoogleAuthUrl,
  } = useContext(UserContext);
  const [tempToken, setTempToken] = useState("");
  const [newTempToken, setNewTempToken] = useState("");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    code: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({
    isChecking: false,
    isAvailable: null,
    message: "",
  });

  // Debounce timer for username check
  const [usernameDebounceTimer, setUsernameDebounceTimer] = useState(null);

  // Check username availability
  async function checkUsername(name) {
    if (!name || name.length < 2) {
      setUsernameStatus({ isChecking: false, isAvailable: null, message: "" });
      return;
    }

    if (!isValidName(name)) {
      setUsernameStatus({
        isChecking: false,
        isAvailable: false,
        message:
          "Username can only contain letters, numbers, spaces, hyphens, apostrophes, and underscores.",
      });
      return;
    }

    setUsernameStatus({
      isChecking: true,
      isAvailable: null,
      message: "Checking availability...",
    });

    try {
      const data = await checkUsernameAvailability({ name: name.trim() });
      if (data.error) {
        setUsernameStatus({
          isChecking: false,
          isAvailable: null,
          message: "Error checking username availability",
        });
        return;
      }

      setUsernameStatus({
        isChecking: false,
        isAvailable: data.available,
        message: data.message,
      });
    } catch (err) {
      setUsernameStatus({
        isChecking: false,
        isAvailable: null,
        message: "Error checking username availability",
      });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    // For name field, filter out invalid characters in real-time
    if (name === "name") {
      // Remove any characters that don't match our allowed pattern
      const filteredValue = value.replace(/[^a-zA-Z0-9\s\-'_]/g, "");
      setForm({ ...form, [name]: filteredValue });

      // Clear existing timer
      if (usernameDebounceTimer) {
        clearTimeout(usernameDebounceTimer);
      }

      // Set new timer for username check
      const newTimer = setTimeout(() => {
        checkUsername(filteredValue);
      }, 500); // 500ms debounce

      setUsernameDebounceTimer(newTimer);
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  // Cleanup effect for username debounce timer
  useEffect(() => {
    return () => {
      if (usernameDebounceTimer) {
        clearTimeout(usernameDebounceTimer);
      }
    };
  }, [usernameDebounceTimer]);

  function allPasswordValid() {
    return passwordRequirements.every((req) => req.test(form.password));
  }

  async function handleNextStep1(e) {
    e.preventDefault();
    if (!form.email || !form.name) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!isValidName(form.name)) {
      toast.error(
        "Name can only contain letters, numbers, spaces, hyphens, apostrophes, and underscores."
      );
      return;
    }
    if (usernameStatus.isAvailable === false) {
      toast.error(
        "Username is already taken. Please choose a different username."
      );
      return;
    }
    if (usernameStatus.isChecking) {
      toast.error("Please wait while we check username availability.");
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
      toast.error(err?.response?.data?.error || "Request failed");
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
      const data = await registerUserFinal({ code: form.code, newTempToken });
      if (data.error) return toast.error(data.error);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleRegister(e) {
    e.preventDefault();
    initiateGoogleAuth(getGoogleAuthUrl);
  }

  return (
    <div className="form-container">
      <img
        className="EcoCollect-logo"
        src={EcoCollectLogo}
        alt="EcoCollect-Logo"
      />
      <form
        className="register-form"
        onSubmit={
          step === 1
            ? handleNextStep1
            : step === 2
            ? handleNextStep2
            : handleRegister
        }
      >
        <h1>Register</h1>
        <p className="welcome-el">Create your EcoCollect account</p>
        {step === 1 && (
          <>
            <div className="step-header">
              <span className="step-indicator">Step 1 of 3</span>
            </div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="name">Username</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
            {/* Username availability status */}
            {usernameStatus.message && (
              <div
                className={`username-status ${
                  usernameStatus.isChecking
                    ? "checking"
                    : usernameStatus.isAvailable === true
                    ? "available"
                    : usernameStatus.isAvailable === false
                    ? "unavailable"
                    : "error"
                }`}
              >
                {usernameStatus.isChecking && (
                  <span className="spinner">⏳</span>
                )}
                {usernameStatus.isAvailable === true && (
                  <span className="check">✅</span>
                )}
                {usernameStatus.isAvailable === false && (
                  <span className="cross">❌</span>
                )}
                {usernameStatus.message}
              </div>
            )}
            <div className="name-hint">
              This name will appear on your profile
            </div>
            <button
              className="register-btn2"
              type="submit"
              disabled={
                loading ||
                !form.email ||
                !form.name ||
                usernameStatus.isChecking ||
                usernameStatus.isAvailable === false
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
                className="register-password-toggle-visibility"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
              className="register-btn2"
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
        <p className="or-seperator">or</p>
        <button
          onClick={handleGoogleRegister}
          type="button"
          className="google-btn"
        >
          <img src={GoogleIcon} alt="Google" className="google-icon" />
          Sign Up with Google
        </button>
        <p className="register-el">
          Already have an account?
          <Link className="login-btn2" to="/login">
            {" "}
            Log in
          </Link>
        </p>
      </form>
      <img
        className="partnership-logo"
        src={PartnershipLogos}
        alt="NU x SM Cares Partnership"
      />
    </div>
  );
}
