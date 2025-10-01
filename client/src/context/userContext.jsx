import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth token on app start
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      console.log("Restoring saved auth token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  // Helper to set and persist auth token
  const setAuthToken = (token) => {
    console.log("Setting auth token");
    localStorage.setItem("authToken", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Helper to clear auth token
  const clearAuthToken = () => {
    console.log("Clearing auth token");
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Exposed helper to re-fetch profile and sync user state
  const refreshProfile = async () => {
    try {
      // Use default axios configuration (which includes Authorization header if set)
      const { data } = await axios.get("/api/ecocollect/auth/profile");
      setUser(data || null);
      return data || null;
    } catch (e) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Exposed helper to logout and clear local user state immediately
  const logout = async () => {
    try {
      await axios.post("/api/ecocollect/auth/logout");
    } catch (e) {
      // Ignore network or server errors here; we still clear local state
    } finally {
      // Clear user state
      setUser(null);
      // Clear auth token and authorization header
      clearAuthToken();
    }
  };

  // Login helper - sets user on success, returns server response
  const login = async ({ email, password, isAdminLogin = false }) => {
    try {
      const { data } = await axios.post("/api/ecocollect/auth/login", {
        email,
        password,
        isAdminLogin,
      });
      if (!data?.error) {
        setUser(data);
        // If the response includes a token and we're on iOS Chrome, persist it
        if (data.token && /CriOS/i.test(navigator.userAgent)) {
          console.log("iOS Chrome detected - persisting login token");
          setAuthToken(data.token);
        }
      }
      return data;
    } catch (e) {
      return e?.response?.data || { error: "Login failed" };
    }
  };

  // Registration helpers (3-step flow)
  const registerEmailName = async ({ email, name }) => {
    try {
      const { data } = await axios.post("/api/ecocollect/auth/register/email", {
        email,
        name,
      });
      return data; // { message, tempToken }
    } catch (e) {
      return e?.response?.data || { error: "Registration step 1 failed" };
    }
  };

  const registerPassword = async ({ password, tempToken }) => {
    try {
      const { data } = await axios.post(
        "/api/ecocollect/auth/register/password",
        {
          password,
          tempToken,
        }
      );
      return data; // { message, newTempToken }
    } catch (e) {
      return e?.response?.data || { error: "Registration step 2 failed" };
    }
  };

  const registerUserFinal = async ({ code, newTempToken, role }) => {
    try {
      const { data } = await axios.post("/api/ecocollect/auth/register", {
        code,
        newTempToken,
        role,
      });
      return data; // { message, user }
    } catch (e) {
      return e?.response?.data || { error: "Registration failed" };
    }
  };

  // Helper to construct Google OAuth URL based on env
  const getGoogleAuthUrl = () => {
    const base = import.meta.env.VITE_API_URL || "";
    return `${base}/api/ecocollect/auth/google`;
  };

  useEffect(() => {
    // If coming from Google redirect with token param, we still rely on cookie.
    const params = new URLSearchParams(window.location.search);
    const fromGoogle = params.get("auth") === "google";
    const urlToken = params.get("token"); // For iOS Chrome fallback

    // Handle iOS Chrome token from URL
    if (fromGoogle && urlToken) {
      console.log("Detected iOS Chrome OAuth flow with URL token");
      // Clean URL immediately
      window.history.replaceState({}, document.title, window.location.pathname);

      // For iOS Chrome, persist the token and set it in axios headers
      setAuthToken(urlToken);

      // Verify token and get user profile
      refreshProfile()
        .then((data) => {
          if (data) {
            console.log("iOS Chrome OAuth success:", data.name);
            // Success - token is already persisted, navigate to home
            navigate("/home", { replace: true });
          } else {
            console.log("iOS Chrome OAuth failed - no user data");
            // Failed - cleanup
            clearAuthToken();
            navigate("/login", { replace: true });
          }
        })
        .catch((error) => {
          console.error("iOS Chrome OAuth error:", error);
          // Error - cleanup
          clearAuthToken();
          navigate("/login", { replace: true });
        });
    } else {
      // Standard flow - check for cookies
      refreshProfile().then((data) => {
        if (fromGoogle && data) {
          console.log("Standard OAuth success:", data.name);
          // Navigate to home and clean query
          navigate("/home", { replace: true });
        } else if (fromGoogle) {
          console.log("Standard OAuth failed - cleaning URL");
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      });
    }
  }, []);

  // Global 401 handler: clear user and redirect without reload
  useEffect(() => {
    let didRedirect = false;
    const id = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status !== 401) return Promise.reject(err);

        if (!didRedirect) {
          didRedirect = true;
          setUser(null);
          // Clear auth token and authorization header
          clearAuthToken();
          const path = location.pathname || "";
          const target = path.startsWith("/admin") ? "/admin/login" : "/login";
          if (path !== target) {
            navigate(target, { replace: true, state: { from: location } });
          }
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [location, navigate]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshProfile,
        logout,
        login,
        registerEmailName,
        registerPassword,
        registerUserFinal,
        getGoogleAuthUrl,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
