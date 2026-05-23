import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserContext } from "../context/userContext";
import { downloadApkAPI } from "../api/downloadApk";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import "./styles/Navbar.css";

const APK_FILE_NAME = "EcoCollect_Mobile.apk";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  function checkUser() {
    if (user) {
      return navigate("/home");
    } else {
      return navigate("/login");
    }
  }

  async function handleAppDownload(event) {
    event.preventDefault();

    try {
      const response = await downloadApkAPI.getSignedApkUrl();
      const signedUrl = response?.data?.signedUrl;
      const downloadName = response?.data?.fileName || APK_FILE_NAME;

      if (!signedUrl) {
        throw new Error("Missing signed APK URL.");
      }

      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setMenuOpen(false);
    } catch (error) {
      console.error("APK download failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "APK is not available right now. Please try again later.",
      );
    }
  }

  return (
    <header className={`navbar ${menuOpen ? "navbar-solid" : ""}`}>
      <div className="nav-bar-logo">
        <img src={EcoCollectLogo} alt="EcoCollect Logo" className="logo-icon" />
        EcoCollect
      </div>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </button>
      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a onClick={checkUser}>Log In</a>
        <a
          href="#"
          download={APK_FILE_NAME}
          onClick={handleAppDownload}
          className="get-app-btn"
        >
          Get App
        </a>
      </nav>
    </header>
  );
}
