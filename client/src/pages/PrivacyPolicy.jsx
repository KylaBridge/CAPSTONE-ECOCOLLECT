import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="pp-page-container">
        <div className="pp-page-header">
          <h1>Privacy Policy</h1>
          <p className="pp-page-subtitle">Your privacy is important to us</p>
        </div>

        <div className="pp-main-content">
          <div className="pp-navigation-tabs">
            <div className="pp-tabs-container">
              <a href="#information-collection" className="pp-tab-link">
                <span className="pp-tab-full">Information We Collect</span>
                <span className="pp-tab-short">Info Collection</span>
              </a>
              <a href="#information-use" className="pp-tab-link">
                <span className="pp-tab-full">How We Use Information</span>
                <span className="pp-tab-short">Info Use</span>
              </a>
              <a href="#information-sharing" className="pp-tab-link">
                <span className="pp-tab-full">Information Sharing</span>
                <span className="pp-tab-short">Info Sharing</span>
              </a>
              <a href="#data-security" className="pp-tab-link">
                <span className="pp-tab-full">Data Security</span>
                <span className="pp-tab-short">Security</span>
              </a>
              <a href="#user-rights" className="pp-tab-link">
                <span className="pp-tab-full">Your Rights</span>
                <span className="pp-tab-short">Rights</span>
              </a>
              <a href="#contact-info" className="pp-tab-link">
                <span className="pp-tab-full">Contact Information</span>
                <span className="pp-tab-short">Contact</span>
              </a>
            </div>
          </div>

          <div className="pp-content-sections">
            <section id="information-collection" className="pp-content-section">
              <h2>Information We Collect</h2>
              <div className="pp-section-body">
                <h3>Personal Information</h3>
                <p>When you register for EcoCollect, we may collect:</p>
                <ul>
                  <li>Name and email address</li>
                  <li>Profile information you choose to provide</li>
                  <li>Photos of electronic waste submissions</li>
                </ul>

                <h3>Usage Data</h3>
                <p>
                  We automatically collect information about how you use our
                  platform:
                </p>
                <ul>
                  <li>App usage patterns and feature interactions</li>
                  <li>Device information and operating system</li>
                  <li>Performance and error logs</li>
                </ul>
              </div>
            </section>

            <section id="information-use" className="pp-content-section">
              <h2>How We Use Your Information</h2>
              <div className="pp-section-body">
                <p>We use the collected information to:</p>
                <ul>
                  <li>
                    Provide and improve our electronic waste collection service
                  </li>
                  <li>Process reward redemptions and track achievements</li>
                  <li>Verify waste submissions and prevent fraud</li>
                  <li>
                    Send important updates about your account and the program
                  </li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Ensure compliance with environmental regulations</li>
                </ul>
              </div>
            </section>

            <section id="information-sharing" className="pp-content-section">
              <h2>Information Sharing and Disclosure</h2>
              <div className="pp-section-body">
                <p>
                  We do not sell your personal information. We may share
                  information only in these circumstances:
                </p>
                <ul>
                  <li>
                    <strong>With NU Administration:</strong> Aggregate data for
                    environmental impact reporting
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Third-party services
                    that help us operate the platform
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or
                    to protect our rights
                  </li>
                  <li>
                    <strong>Emergency Situations:</strong> To prevent harm to
                    users or the public
                  </li>
                </ul>

                <p>
                  Any data shared is anonymized whenever possible and subject to
                  strict confidentiality agreements.
                </p>
              </div>
            </section>

            <section id="data-security" className="pp-content-section">
              <h2>Data Security</h2>
              <div className="pp-section-body">
                <p>
                  We implement comprehensive security measures to protect your
                  information:
                </p>
                <ul>
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>
                    Access controls limiting who can view your information
                  </li>
                  <li>
                    Secure cloud infrastructure with industry-standard
                    protections
                  </li>
                </ul>

                <p>
                  While we strive to protect your information, no method of
                  transmission over the internet is 100% secure. We encourage
                  you to use strong passwords and keep your login credentials
                  confidential.
                </p>
              </div>
            </section>

            <section id="user-rights" className="pp-content-section">
              <h2>Your Rights and Choices</h2>
              <div className="pp-section-body">
                <p>
                  You have the following rights regarding your personal
                  information:
                </p>
                <ul>
                  <li>
                    <strong>Access:</strong> Request a copy of the personal
                    information we have about you
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account
                    and associated data
                  </li>
                  <li>
                    <strong>Data Portability:</strong> Receive your data in a
                    machine-readable format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from promotional
                    communications
                  </li>
                </ul>

                <p>
                  To exercise these rights, please contact us using the
                  information provided below. We will respond to your request
                  within 30 days.
                </p>
              </div>
            </section>

            <section id="contact-info" className="pp-content-section">
              <h2>Contact Information</h2>
              <div className="pp-section-body">
                <p>
                  If you have questions about this Privacy Policy or our data
                  practices, please contact us:
                </p>
                <div className="pp-contact-info">
                  <p>
                    <strong>Email:</strong> privacy@ecocollect.nu.edu.ph
                  </p>
                  <p>
                    <strong>Address:</strong> National University, 551 M.F.
                    Jhocson St, Sampaloc, Manila
                  </p>
                  <p>
                    <strong>Phone:</strong> +63 (2) 8123-4567
                  </p>
                </div>

                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="pp-page-footer">
          <Link to="/" className="pp-back-button">
            ← Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
