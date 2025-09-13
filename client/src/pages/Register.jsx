import "./styles/Register.css";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import PartnershipLogos from "../assets/partnershiplogos.png";
import GoogleIcon from "../assets/google-icon.svg";

const passwordRequirements = [
  { label: "At least 10 characters", test: (pw) => pw.length >= 10 },
  {
    label: "At least one special character and one upper case",
    test: (pw) =>
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) && /[A-Z]/.test(pw),
  },
  { label: "At least one number", test: (pw) => /\d/.test(pw) },
];

export default function Register() {
  const navigate = useNavigate();
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    try {
      const { data } = await axios.post("/api/ecocollect/auth/register/email", {
        email: form.email,
        name: form.name,
      });
      if (data.error) return toast.error(data.error);
      setTempToken(data.tempToken);
      setStep(2);
    } catch (err) {
      toast.error(err.response.data.error);
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
      const { data } = await axios.post(
        "/api/ecocollect/auth/register/password",
        {
          password: form.password,
          tempToken,
        }
      );
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
      const { data } = await axios.post("/api/ecocollect/auth/register", {
        code: form.code,
        newTempToken,
      });
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
    const base = import.meta.env.VITE_API_URL || "";
    window.location.href = `${base}/api/ecocollect/auth/google`;
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
            <label htmlFor="email">Email</label>
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
            <div
              style={{
                fontSize: "0.7rem",
                color: "#fff",
                marginBottom: "10px",
                marginLeft: "5px",
              }}
            >
              This name will appear on your profile
            </div>
            <button
              className="register-btn2"
              type="submit"
              disabled={loading || !form.email || !form.name}
            >
              Next
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
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
            <div
              style={{
                fontSize: "0.8rem",
                color: "#fff",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
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
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="button"
                className="back-btn2"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
              <button
                className="register-btn2"
                type="submit"
                disabled={loading || !form.code}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </>
        )}
        <p className="or-seperator">or</p>
        <button
          onClick={handleGoogleRegister}
          type="button"
          className="google-btn"
        >
          <img src={GoogleIcon} alt="Google" className="google-icon" />
          Continue with Google
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
