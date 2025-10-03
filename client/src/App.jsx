import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { UserContextProvider, UserContext } from "./context/userContext.jsx";

// Components and Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import EWasteSubmission from "./pages/EWasteSubmission.jsx";
import Achievements from "./pages/Achievements.jsx";
import AdminDashboard from "./admin-pages/AdminDashboard.jsx";
import UserManagement from "./admin-pages/UserManagement.jsx";
import AnalyticsDashboard from "./admin-pages/AnalyticsDashboard.jsx";
import EWasteBin from "./admin-pages/EWasteBin.jsx";
import EWasteSubmit from "./admin-pages/EWasteSubmit.jsx";
import AchieversModule from "./admin-pages/AchieversModule.jsx";
import BadgeManagement from "./admin-pages/BadgeManagement.jsx";
import RewardManagement from "./admin-pages/RewardManagement.jsx";
import ActivityLog from "./admin-pages/ActivityLog.jsx";
import Rewards from "./pages/Rewards.jsx";
import AdminLogIn from "./admin-pages/AdminLogIn.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ShareableBadge from "./components/ShareableBadge.jsx";
import ValidateRedeem from "./pages/ValidateRedeem.jsx";

// Protected route for authenticated users
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  // Wait for the authentication check to finish
  if (loading)
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  if (!user) return <Navigate to="/" replace />;
  return children;
}

// Protected route for admin users
function AdminProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  // Wait for the authentication check to finish
  if (loading)
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  if (!user || (user.role !== "admin" && user.role !== "superadmin"))
    return <Navigate to="/admin/login" replace />;
  return children;
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <UserContextProvider>
      <Toaster 
        position="bottom-right" 
        toastOptions={{ duration: 5000 }} 
      />
      <Routes>
        {/* Public User Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/badge/:id" element={<ShareableBadge />} />
        <Route path="/redemption/validate/:id" element={<ValidateRedeem />} />

        {/* Protected User Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ewastesubmission"
          element={
            <ProtectedRoute>
              <EWasteSubmission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <Rewards />
            </ProtectedRoute>
          }
        />

        {/* Admin Auth Routes */}
        <Route path="/admin/login" element={<AdminLogIn />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/usermanagement"
          element={
            <AdminProtectedRoute>
              <UserManagement />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/analyticsdashboard"
          element={
            <AdminProtectedRoute>
              <AnalyticsDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/ewastebin"
          element={
            <AdminProtectedRoute>
              <EWasteBin />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/ewastesubmit"
          element={
            <AdminProtectedRoute>
              <EWasteSubmit />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/achieversmodule"
          element={
            <AdminProtectedRoute>
              <AchieversModule />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/badgemanagement"
          element={
            <AdminProtectedRoute>
              <BadgeManagement />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/rewardmanagement"
          element={
            <AdminProtectedRoute>
              <RewardManagement />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/activitylog"
          element={
            <AdminProtectedRoute>
              <ActivityLog />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </UserContextProvider>
  );
}