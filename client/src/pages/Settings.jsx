import { useState } from "react"
import "./styles/Settings.css"

// Components and Pages
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import SettingsHeaderTitle from "../assets/EcoCollect-Logo.png"
import MrCPU from "../assets/icons/mrcpu.png"
import MrCPU2 from "../assets/icons/mrcpu2.png"



export default function Settings() {
  const [showNavbar, setShowNavbar] = useState(false)
  
  return (
    <>
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <div className="settings-page">
                <Header headerImg={SettingsHeaderTitle} headerText="Settings" />
            </div>
            <div className="settings-main-container">
                <div className="faqs-ask-container">
                    <select>
                        <option selected>FAQ</option>
                        <option>How to donate?</option>
                        <option>Why recycle electronics?</option>
                        <option>How to earn points?</option>
                        <option>About Us</option>
                    </select>
                    <button>ASK</button>
                </div>
                <img src={MrCPU} />
                <p>"Hi there! Need help? Ask me anything about e-waste!"</p>
                <div className="settings-option-container">
                    <img src={MrCPU2} />
                    <p>Want to adjust the settings?</p>
                    <div className="settings">
                        <h1>SETTINGS</h1>
                        <div className="setting-settings">
                            <div className="on-off-bar"><div className="on-mode"></div></div>
                            <h2>Light Mode</h2>
                        </div>
                        <div className="setting-settings">
                            <div className="on-off-bar"><div className="on-mode"></div></div>
                            <h2>Notifications On</h2>
                        </div>
                    </div>
                </div> 
            </div>
    </>
  )
}
