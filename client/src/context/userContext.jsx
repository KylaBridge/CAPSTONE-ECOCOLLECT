import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Exposed helper to re-fetch profile and sync user state
  const refreshProfile = async () => {
    try {
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
      setUser(null);
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
    refreshProfile().then((data) => {
      if (fromGoogle && data) {
        // Navigate to home and clean query
        navigate("/home", { replace: true });
      } else if (fromGoogle) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    });
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
