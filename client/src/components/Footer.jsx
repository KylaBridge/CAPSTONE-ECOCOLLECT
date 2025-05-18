import React from "react";
import NULogo from '../assets/partnershiplogos.png';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { BiLogoGmail } from "react-icons/bi";
import "./styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-logo">
          <img src={NULogo} alt="NU Logo" />
        </div>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <span className="separator">|</span>
          <a href="/contact">Send Feedback</a>
        </div>
        <div className="footer-social">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><BiLogoGmail /></a>
        </div>
      </div>
      <div className="footer-right">
        <p>&copy; {new Date().getFullYear()} EcoCollect. All rights reserved.</p>
      </div>
    </footer>
  );
} 