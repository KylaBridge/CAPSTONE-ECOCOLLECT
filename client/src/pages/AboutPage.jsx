import React from "react";
import { useEffect, useRef } from 'react';
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import SmCaresxNuLogo from "../assets/NUxSmCaresLogo.png";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { teamData } from "../data/teamData";
import "./styles/AboutPage.css";

export default function AboutPage() {
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
      <Navbar />

      <section className="about-intro" id="about-intro" ref={(el) => (sectionRefs.current[0] = el)}>
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
          The development of EcoCollect is closely tied to the ongoing collaboration between National University (NU) Manila and SM Cares, 
          the corporate social responsibility arm of SM Supermalls. This partnership birthed the E-Waste Collection Project, 
          an initiative to raise awareness and provide accessible disposal bins for electronic waste within the university premises. 
          As NU students, we saw an opportunity to boost engagement in this advocacy through an interactive platform that speaks 
          to the digital-native generation.
        </p>
      </section>

      <section className="mission-vision" id="mission-vision" ref={(el) => (sectionRefs.current[1] = el)}>
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

      <section className="collaborators" id="collaborators" ref={(el) => (sectionRefs.current[2] = el)}>
        <h2>Partnership</h2>
        <div className="partnership-container">
          <div className="partner-logos">
            <img src={SmCaresxNuLogo} alt="NUxSM" className="partner-logo" />
          </div>
          <div className="partnership-description">
            <p>
              National University Manila, a premier educational institution in the Philippines, has joined forces with SM Cares, 
              the corporate social responsibility arm of SM Supermalls, in a groundbreaking initiative for environmental sustainability. 
              This collaboration focuses on the E-Waste Collection Project, which aims to address the growing concern of electronic waste 
              management within the university community.
            </p>
            <p>
              Through strategically placed e-waste collection bins across the campus and the innovative EcoCollect platform, 
              this partnership demonstrates both institutions' commitment to environmental stewardship and sustainable development. 
              The project serves as a model for how educational institutions and corporate entities can work together to create 
              meaningful environmental impact while engaging the younger generation in sustainable practices.
            </p>
          </div>
        </div>
      </section>

      <section className="dev-team" id="dev-team" ref={(el) => (sectionRefs.current[3] = el)}>
        <h2>Meet the Team</h2>
        <div className="team-grid">
          {teamData.map((member) => (
            <div key={member.id} className="team-member">
              <div className="member-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="position">{member.position}</p>
                <p className="college">{member.college}</p>
                <div className="social-links">
                  <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                  <a href="#" target="_blank" rel="noopener noreferrer"><BiLogoGmail /></a>
                  <a href="#" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
