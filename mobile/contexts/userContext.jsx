import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const API_BASE = "http://10.80.155.68:3000/api/ecocollect/auth"; // use your systems ip address and port 3000 to connect to backend
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { withCredentials: true };
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
        const res = await axios.get(`${API_BASE}/profile`, config);
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
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
      await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
