import { Routes, Route } from "react-router-dom"
import axios from "axios"
import { Toaster } from "react-hot-toast"
import { UserContextProvider } from "./context/userContext.jsx"

// Components and Pages
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import AdminRegister from "./admin-pages/AdminRegister.jsx"
import EWasteSubmission from "./pages/EWasteSubmission.jsx"
import Achievements from "./pages/Achievements.jsx"
import AdminDashboard from "./admin-pages/AdminDashboard.jsx"
import UserManagement from "./admin-pages/UserManagement.jsx"
import AnalyticsDashboard from "./admin-pages/AnalyticsDashboard.jsx"
import EWasteBin from "./admin-pages/EWasteBin.jsx"
import EWasteSubmit from "./admin-pages/EWasteSubmit.jsx"
import AchieversModule from "./admin-pages/AchieversModule.jsx"
import BadgeManagement from "./admin-pages/BadgeManagement.jsx"
import RewardManagement from "./admin-pages/RewardManagement.jsx"
import ActivityLog from "./admin-pages/ActivityLog.jsx"
import Rewards from "./pages/Rewards.jsx"
import AdminLogIn from "./admin-pages/AdminLogIn.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import AboutPage from "./pages/AboutPage.jsx"
import ContactPage from "./pages/ContactPage.jsx"

axios.defaults.baseURL = "http://localhost:3000"
axios.defaults.withCredentials = true

export default function App() {

  return (
    <UserContextProvider>
      <Toaster position="bottom-right" toastOptions={{duration: 2000}} />
      <Routes>
        {/*User Routes*/}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ewastesubmission" element={<EWasteSubmission/>} />
        <Route path="/achievements" element={<Achievements/>} />
        <Route path="/rewards" element={<Rewards/>} />


        {/*Admin Routes */}
        <Route path="/admin/login" element={<AdminLogIn />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/usermanagement" element={<UserManagement />} />
        <Route path="/admin/analyticsdashboard" element={<AnalyticsDashboard />} />
        <Route path="/admin/ewastebin" element={<EWasteBin />} />
        <Route path="/admin/ewastesubmit" element={<EWasteSubmit />} />
        <Route path="/admin/achieversmodule" element={<AchieversModule />} />
        <Route path="/admin/badgemanagement" element={<BadgeManagement />} />
        <Route path="/admin/rewardmanagement" element={<RewardManagement />} />
        <Route path="/admin/activitylog" element={<ActivityLog />} />
      </Routes>
    </UserContextProvider>
  )
}