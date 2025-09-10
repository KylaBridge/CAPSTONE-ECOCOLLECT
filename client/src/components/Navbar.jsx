import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import "./styles/Navbar.css";

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

  return (
    <header className={`navbar ${menuOpen ? "navbar-solid" : ""}`}>
      <div className="nav-bar-logo">
        <img src={EcoCollectLogo} alt="EcoCollect Logo" className="logo-icon" />
        EcoCollect
      </div>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a onClick={checkUser}>Log In</a>
      </nav>
    </header>
  );
} 