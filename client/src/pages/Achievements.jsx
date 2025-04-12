import { useState } from "react"
import "./styles/Achievements.css"

// Components and Pages
import Sidebar from "../components/Sidebar"
import Userprofile from "../components/Userprofile"
import Header from "../components/Header"

//assets
import Badge1 from "../assets/badges/current-badge.png"
import Badge2 from "../assets/badges/next-badge.png"
import Badge3 from "../assets/badges/badge3.png"
import Badge4 from "../assets/badges/badge4.png"
import Badge5 from "../assets/badges/badge5.png"
import Badge6 from "../assets/badges/badge6.png"
import Badge7 from "../assets/badges/badge7.png"
import Badge8 from "../assets/badges/badge8.png"
import Badge9 from "../assets/badges/badge9.png"
import Badge10 from "../assets/badges/badge10.png"
import Badge11 from "../assets/badges/badge11.png"
import HomeHeaderTitle from "../assets/headers/home-header.png"


export default function Achievements() {
  const [showNavbar, setShowNavbar] = useState(false)
  
  return (
    <>
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={HomeHeaderTitle} headerText="Achievements" />
      <div className="achievements-main-container">
                <fieldset className="badges-container">
                    <legend><button>Share</button></legend>
                    <img src={Badge1} alt="badge1" />
                    <img src={Badge2} alt="badge2" />
                    <img className="unlocked" src={Badge3} alt="badge3" />
                    <img className="unlocked" src={Badge4} alt="badge4" />
                    <img className="unlocked" src={Badge5} alt="badge5" />
                    <img className="unlocked" src={Badge6} alt="badge6" />
                    <img className="unlocked" src={Badge7} alt="badge7" />
                    <img className="unlocked" src={Badge8} alt="badge8" />
                    <img className="unlocked" src={Badge9} alt="badge9" />
                    <img className="unlocked" src={Badge10} alt="badge10" />
                    <img className="unlocked" src={Badge11} alt="badge11" />
                </fieldset>
                <h2>Donate to Unlock Badges!</h2>
            </div>
    </>
  )
}
