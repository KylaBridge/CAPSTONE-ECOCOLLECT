import React from "react";
import NULogo from "../assets/partnershiplogos.png";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
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
          <a href="https://www.facebook.com/share/17FFx33AkC/">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/ecocollectnu?igsh=eno1YnVkcjlqNHhi">
            <FaInstagram />
          </a>
          <a href="mailto:ecocollectnu@gmail.com?subject=EcoCollect Inquiry&body=Hello EcoCollect Team,%0D%0A%0D%0AI would like to inquire about...">
            <BiLogoGmail />
          </a>
        </div>
      </div>
      <div className="footer-right">
        <p>
          &copy; {new Date().getFullYear()} EcoCollect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
