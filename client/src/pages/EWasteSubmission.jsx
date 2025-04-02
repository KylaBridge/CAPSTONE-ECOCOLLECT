import { useState } from "react"
import "./styles/EWasteSubmission.css"

// Components and Pages
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import EWasteHeaderTitle from "../assets/headers/ewaste-header.png"


export default function EWasteSubmission() {
  const [showNavbar, setShowNavbar] = useState(false)
  
  return (
    <>
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={EWasteHeaderTitle} headerText="E-Waste Submisison" />

      <div className="waste-main-container">
          <h1>Drop your E-Waste!</h1>
          <div className="insert-waste">
              <h1>+</h1>
          </div>
          <div className="item-selection-container">
              <h2>Item Selection</h2>
              <div className="items-container">
                  <p>Phone</p>
                  <p>Laptop</p>
                  <p>Battery</p>
                  <p>Charger</p>
                  <p>Other</p>
              </div>
          </div>
          <button>SUBMIT</button>
      </div>
    </>
  )
}
