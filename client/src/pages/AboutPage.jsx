import React from "react";
import { useEffect, useRef, useState } from 'react';
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import NULogo from "../assets/nuLogo.png";
import member1 from "../assets/people/kyla.jpg";
import member2 from "../assets/people/kyla.jpg";
import member3 from "../assets/people/kyla.jpg";
import member4 from "../assets/people/kyla.jpg";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import "./styles/AboutPage.css";

export default function AboutPage() {
      const [menuOpen, setMenuOpen] = useState(false);
    
      const sectionIds = ["about-intro", "mission-vision", "collaborators", "dev-team"];
    
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
    <div className="about-container">
     <header className={`navbar ${menuOpen ? "navbar-solid" : ""}`}>
        <div className="logo">
          <img src={EcoCollectLogo} alt="EcoCollect Logo" className="logo-icon" />
            EcoCollect</div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="/landing">Home</a>
          <a href="/about">About Us</a>
          <a href="#contact">Contact Us</a>
          <a href="/">Log In</a>
        </nav>
      </header>

      <section className="about-intro" id = "about-intro" ref={(el) => (sectionRefs.current[1] = el)}>
        <h1>About EcoCollect</h1>
        <p>
         EcoCollect is a gamified web-based mobile application initiated by National University College of Information Technology. 
         The system was designed with a purpose-driven goal: to inspire sustainable habits in the NU community through the power of technology and gamification.
        </p>
        <p>
        At its core, EcoCollect encourages proper e-waste disposal by transforming recycling into a rewarding experience. 
        Users can earn points, collect badges, and redeem prizes by participating in eco-friendly activities—all through 
        an intuitive and engaging mobile interface.
        </p>

        <p>
        The development of EcoCollect is closely tied to the ongoing collaboration between National University (NU) and SM Cares, 
        the corporate social responsibility arm of SM Supermalls. This partnership birthed the E-Waste Collection Project, 
        an initiative to raise awareness and provide accessible disposal bins for electronic waste within the university premises. 
        As NU students, we saw an opportunity to boost engagement in this advocacy through an interactive platform that speaks 
        to the digital-native generation.
        </p>
      </section>

      <section className="mission-vision" id = "mission-vision" ref={(el) => (sectionRefs.current[2] = el)}>
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            To encourage proper e-waste disposal by providing an engaging platform that motivates users through
            gamified elements such as points, badges, and rewards.
          </p>
        </div>
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
            A sustainable NU community where every stakeholder actively contributes to responsible e-waste
            management, powered by technology and community involvement.
          </p>
        </div>
      </section>

      <section className="collaborators" id = "collaborators" ref={(el) => (sectionRefs.current[3] = el)}>
        <h2>In Collaboration With</h2>
        <ul>
          <li>NU Community Extension Office</li>
          <li>SM Cares</li>
          <li>Smart Communications, Inc.</li>
        </ul>
      </section>

      <section className="dev-team" id = "dev-team" ref={(el) => (sectionRefs.current[4] = el)}>
        <h2>Meet the Developers</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src={member1} alt="Developer 1" />
            <p>Dev One</p>
          </div>
          <div className="team-member">
            <img src={member2} alt="Developer 2" />
            <p>Dev Two</p>
          </div>
          <div className="team-member">
            <img src={member3} alt="Developer 3" />
            <p>Dev Three</p>
          </div>
            <div className="team-member">
            <img src={member4} alt="Developer 3" />
            <p>Dev Three</p>
          </div>
        </div>
      </section>

     <footer className="about-footer" id = "footer"  ref={(el) => (sectionRefs.current[5] = el)}>
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
