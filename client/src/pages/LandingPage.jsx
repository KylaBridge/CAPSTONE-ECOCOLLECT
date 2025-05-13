import React, { useState } from "react";
import { useEffect, useRef } from 'react';
import "./styles/LandingPage.css";
import headerImage from "../assets/icons/header-icon.png";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import ChipIcon from '../assets/icons/chipandtrash.png'
import { FaMapMarkerAlt, FaCamera, FaUpload, FaStar } from "react-icons/fa";
import Badge1 from '../assets/badges/badge3.png'
import Badge2 from '../assets/badges/badge4.png'
import Badge3 from '../assets/badges/badge5.png'
import NULogo from '../assets/nuLogo.png'
import MerchImg from '../assets/rewards/merchImg.png'
import { FaFacebook, FaTwitter, FaInstagram} from 'react-icons/fa';
import { BiLogoGmail } from "react-icons/bi";


export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const sectionIds = ["hero", "transform", "how-it-works", "track-badge", "landing-reward"];

  const sectionRefs = useRef([]);
  
  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("focused-section");
        } else {
          entry.target.classList.remove("focused-section");
        }
      });
    },
    { threshold: 0.6 }
  );

  sectionRefs.current.forEach((ref) => {
    if (ref) observer.observe(ref);
  });

  return () => {
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.unobserve(ref);
    });
  };
}, []);

  return (
    <div className="landing-container">
     <header className={`navbar ${menuOpen ? "navbar-solid" : ""}`}>
        <div className="logo">
          <img src={EcoCollectLogo} alt="EcoCollect Logo" className="logo-icon" />
            EcoCollect</div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="/landing">Home</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact Us</a>
          <a href="/">Log In</a>
        </nav>
      </header>

      <section className="landing-hero" id = "hero" ref={(el) => (sectionRefs.current[0] = el)}>
        <div className="hero-content">
          <h1>Welcome to EcoCollect</h1>
          <p>Turning E-Waste into Eco Wins — One Drop at a Time.
          NU’s gamified way to track, submit, and earn rewards for recycling right.</p>
          <a href="/" className="hero-btn">Start Recycling Now!</a>
        </div>
        {/* <div className="hero-image">
          <img src={headerImage} alt="Hero Visual" />
        </div> */}
      </section>

      <section className="transform-section" id = "transform"  ref={(el) => (sectionRefs.current[1] = el)}> 
        <div className="transform-text">
          <h2>TRANSFORM E-WASTE<br />INTO <span className="highlight">SUSTAINABLE</span><br />SOLUTION</h2>
          <p>
            Join our mission to create a greener future by recycling your old electronics.
            Through our innovative program, you can turn your e-waste into valuable rewards
            that inspire positive change.
          </p>
        </div>
       <div className="transform-image">
          <img src={ChipIcon} alt="Chip with Trash Bin" />
        </div>
      </section>

      <section className="how-it-works" id = "how-it-works"  ref={(el) => (sectionRefs.current[2] = el)}>
        <h2>HOW IT WORKS</h2>
        <div className="steps">
          <div className="step">
            <div className="icon-circle"><FaMapMarkerAlt /></div>
            <h3>FIND</h3>
            <p>Locate E-Waste Bins on NU campuses.</p>
          </div>
          <div className="step">
            <div className="icon-circle"><FaCamera /></div>
            <h3>SNAP</h3>
            <p>Take a photo of your e-waste before & after dropping it.</p>
          </div>
          <div className="step">
            <div className="icon-circle"><FaUpload /></div>
            <h3>SUBMIT</h3>
            <p>Upload the photos in the EcoCollect app.</p>
          </div>
          <div className="step">
            <div className="icon-circle"><FaStar /></div>
            <h3>SCORE</h3>
            <p>Get validated and earn points, badges and rewards!</p>
          </div>
        </div>
      </section>

     <section className="track-badge" id = "track-badge"  ref={(el) => (sectionRefs.current[3] = el)}>
        <div className="badges-wrapper">
          <div className="badge-images">
            <img src={Badge1} alt="Badge 1" />
            <img src={Badge2} alt="Badge 2" />
          </div>
          <div className="third-badge-wrapper">
            <img src={Badge3} alt="Badge 3" className="third-badge" />
          </div>
        </div>
        <div className="badge-description">
          <h2>TRACK YOUR BADGES</h2>
          <p>
            Celebrate your progress! Earn fun badges as you submit <br /> more e-waste. Each badge unlocks new ranks and bragging rights.
          </p>
        </div>
      </section>

      <section className="landing-reward-section" id = "landing-reward"  ref={(el) => (sectionRefs.current[4] = el)}>
           <div className="rewards-text">
              <h2>E-WASTE TO REWARDS</h2>
              <p>
                Turn your points into cool rewards — because saving the planet should come with perks.
                Earn points every time you submit valid e-waste and redeem them for exclusive goodies.
              </p>
            </div>
            <div className="rewards-images">
              <img src={MerchImg} alt="Rewards Image" />
            </div>
      </section>

     <footer className="landing-footer" id = "footer"  ref={(el) => (sectionRefs.current[5] = el)}>
        <div className="footer-left">
            <div className="footer-logo">
              <img src={NULogo} alt="NU Logo" />
              {/* <p>&copy; {new Date().getFullYear()} EcoCollect. All rights reserved.</p> */}
            </div>
            <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <span className="separator">|</span>
            <a href="/feedback">Send Feedback</a>
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


    </div>
  );
}
