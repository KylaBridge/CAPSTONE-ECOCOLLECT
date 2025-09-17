import "./styles/AdminLoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import BackgroundImage from "../assets/bgphoto-ecocollect.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import PartnershipLogos from "../assets/partnershiplogos.png";
import GoogleIcon from "../assets/google-icon.svg";

export default function AdminLogIn() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  async function loggingIn(formData) {
    const data = Object.fromEntries(formData);
    const { email, password } = data;

    try {
      const { data: response } = await axios.post(
        "/api/ecocollect/auth/login",
        {
          email,
          password,
          isAdminLogin: true,
        }
      );

      console.log("Server Response:", response);

      if (response.error) {
        toast.error(response.error);
      } else if (response.role === "user") {
        toast.error("You are not authorized to access this page");
      } else {
        setUser(response);
        toast.success("Admin logged in");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="bg-form-container">
        <div className="admin-login-left">
          <img
            className="forest-characters"
            src={BackgroundImage}
            alt="EcoCollect Characters"
          />
        </div>

        <div className="admin-login-right">
          <img className="logo" src={EcoCollectLogo} alt="EcoCollect Logo" />
          <form action={loggingIn}>
            <h1>Admin Login</h1>
            <p className="welcome-title">Welcome to EcoCollect!</p>

            <label htmlFor="email">Admin Email</label>
            <input id="email" type="email" name="email" required />

            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input id="password" type={showPassword ? "text" : "password"} name="password" required />
              <button
                type="button"
                className="admin-login-password-toggle-visibility"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
              </button>
            </div>

            <button className="login-btn">LOG IN</button>
            <p className="register-admin-el">
              Don't have an account?{" "}
              <Link to="/admin/register" className="register-link">
                Register
              </Link>
            </p>
            <p className="or-separator">or</p>
            <Link className="go-home-btn" to={"/"}>
              Go to Home
            </Link>
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
