import { useState } from "react"

// Components and Pages
import Sidebar from "../components/Sidebar"

export default function Rewards() {
  const [showNavbar, setShowNavbar] = useState(false)
  
  return (
    <>
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
    </>
  )
}
