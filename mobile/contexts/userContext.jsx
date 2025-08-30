import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const API_BASE = "http://192.168.100.5:3000/api/ecocollect/auth";
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global axios interceptor to handle 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log("Global 401 error detected, clearing user data");
          setUser(null);
          setToken(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Fetch profile function
  const fetchProfile = async () => {
    try {
      const config = { withCredentials: true };
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }
      const res = await axios.get(`${API_BASE}/profile`, config);
      setUser(res.data);
      return res.data;
    } catch (err) {
      // Handle 401 Unauthorized error (token expired)
      if (err.response?.status === 401) {
        console.log("Token expired, clearing user data");
        setUser(null);
        setToken(null);
      } else {
        setUser(null);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data function
  const refreshUser = async () => {
    if (token) {
      try {
        await fetchProfile();
      } catch (err) {
        console.error("Failed to refresh user data:", err);
      }
    }
  };

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_BASE}/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.error) throw new Error(res.data.error);
      if (res.data.token) setToken(res.data.token);
      setUser(res.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Register function
  const register = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_BASE}/register`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.error) throw new Error(res.data.error);
      setUser(res.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear user data immediately to prevent other API calls
      setUser(null);
      setToken(null);

      // Then make the logout API call (but don't wait for it)
      axios
        .post(`${API_BASE}/logout`, {}, { withCredentials: true })
        .catch((err) => {
          console.log("Logout API call failed:", err.message);
          // Don't throw error since we already cleared the data
        });
    } catch (err) {
      console.log("Logout error:", err.message);
      // Ensure user data is cleared even if there's an error
      setUser(null);
      setToken(null);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
