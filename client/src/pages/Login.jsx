import "./styles/Login.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineArrowLeft,
} from "react-icons/ai";
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

export default function Login() {
  const navigate = useNavigate();
  const { login, getGoogleAuthUrl } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: email, 2: verification, 3: new password
  const [loading, setLoading] = useState(false);
  const [resetForm, setResetForm] = useState({
    email: "",
    code: "",
    newPassword: "",
  });

  function handleResetFormChange(e) {
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });
  }

  function allPasswordValid() {
    return passwordRequirements.every((req) => req.test(resetForm.newPassword));
  }

  async function loggingIn(formData) {
    const data = Object.fromEntries(formData);
    const { email, password } = data;
    try {
      const response = await login({ email, password });
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("User logged in");
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleGoogleLogin(e) {
    e.preventDefault();
    initiateGoogleAuth(getGoogleAuthUrl);
  }

  function handleForgotPassword() {
    setIsPasswordReset(true);
    setResetStep(1);
  }

  function handleBackToLogin() {
    setIsPasswordReset(false);
    setResetStep(1);
    setResetForm({ email: "", code: "", newPassword: "" });
  }

  async function handleResetStep1(e) {
    e.preventDefault();
    if (!resetForm.email) {
      toast.error("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      // TODO: API call to send verification code for password reset
      // const response = await fetch("/api/ecocollect/auth/forgot-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify({ email: resetForm.email }),
      // });
      // const data = await response.json();

      // if (data.error) {
      //   toast.error(data.error);
      //   return;
      // }

      // Simulate API call for UI flow
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Verification code sent to your email.");
      setResetStep(2);
    } catch (err) {
      toast.error("Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetStep2(e) {
    e.preventDefault();
    if (!resetForm.code) {
      toast.error("Please enter the verification code.");
      return;
    }
    setLoading(true);
    try {
      // TODO: API call to verify the code
      // Simulate API call for UI flow
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Code verified successfully.");
      setResetStep(3);
    } catch (err) {
      toast.error("Invalid verification code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetStep3(e) {
    e.preventDefault();
    if (!allPasswordValid()) {
      toast.error("Password does not meet requirements.");
      return;
    }
    setLoading(true);
    try {
      // TODO: API call to reset password

      // Simulate API call for UI flow
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Password reset successfully!");
      handleBackToLogin();
    } catch (err) {
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <img
        className="EcoCollect-logo"
        src={EcoCollectLogo}
        alt="EcoCollect-Logo"
      />

      {!isPasswordReset ? (
        // Login Form
        <form className="login-form" action={loggingIn}>
          <h1>Login</h1>
          <p className="welcome-el">Welcome to EcoCollect!</p>

          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />

          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
            />
            <button
              type="button"
              className="password-toggle-visibility"
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

          <button
            type="button"
            className="forgot-password-btn"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>

          <button className="login-btn">LOG IN</button>
          <p className="register-el">
            Don't have an account?
            <Link className="register-link" to="/register">
              {" "}
              Register
            </Link>
          </p>
          <p className="or-seperator">or</p>
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="google-btn"
          >
            <img src={GoogleIcon} alt="Google" className="google-icon" />
            Continue with Google
          </button>
          <Link className="go-back-btn" to={"/"}>
            Go Back to Main
          </Link>
        </form>
      ) : (
        // Password Reset Form
        <form
          className="login-form"
          onSubmit={
            resetStep === 1
              ? handleResetStep1
              : resetStep === 2
              ? handleResetStep2
              : handleResetStep3
          }
        >
          <h1>Reset Password</h1>
          <p className="welcome-el">Reset your EcoCollect password</p>

          {resetStep === 1 && (
            <>
              <div className="step-header">
                <span className="step-indicator">Step 1 of 3</span>
              </div>
              <label htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                name="email"
                type="email"
                value={resetForm.email}
                onChange={handleResetFormChange}
                required
              />
              <button
                className="login-btn"
                type="submit"
                disabled={loading || !resetForm.email}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </>
          )}

          {resetStep === 2 && (
            <>
              <div className="step-header">
                <button
                  type="button"
                  className="step-back"
                  aria-label="Back to previous step"
                  onClick={() => setResetStep(1)}
                >
                  <AiOutlineArrowLeft size={20} />
                </button>
                <span className="step-indicator">Step 2 of 3</span>
              </div>
              <div className="verification-info">
                A verification code has been sent to <b>{resetForm.email}</b>.
              </div>
              <label htmlFor="reset-code">Enter Verification Code</label>
              <input
                id="reset-code"
                name="code"
                type="text"
                value={resetForm.code}
                onChange={handleResetFormChange}
                required
              />
              <button
                className="login-btn"
                type="submit"
                disabled={loading || !resetForm.code}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </>
          )}

          {resetStep === 3 && (
            <>
              <div className="step-header">
                <button
                  type="button"
                  className="step-back"
                  aria-label="Back to previous step"
                  onClick={() => setResetStep(2)}
                >
                  <AiOutlineArrowLeft size={20} />
                </button>
                <span className="step-indicator">Step 3 of 3</span>
              </div>
              <label htmlFor="new-password">New Password</label>
              <div className="password-input">
                <input
                  id="new-password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={resetForm.newPassword}
                  onChange={handleResetFormChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-visibility"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowNewPassword((v) => !v)}
                >
                  {showNewPassword ? (
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
                    className={req.test(resetForm.newPassword) ? "valid" : ""}
                  >
                    {req.test(resetForm.newPassword) ? "✔" : "✖"} {req.label}
                  </div>
                ))}
              </div>
              <button
                className="login-btn"
                type="submit"
                disabled={
                  loading || !resetForm.newPassword || !allPasswordValid()
                }
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          <button
            type="button"
            className="go-back-btn"
            onClick={handleBackToLogin}
          >
            Back to Login
          </button>
        </form>
      )}

      <img
        className="partnership-logo"
        src={PartnershipLogos}
        alt="NU x SM Cares Partnership"
      />
    </div>
  );
}
