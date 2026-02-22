import axios from "axios";
import { authAPI } from "../api/auth";
import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState(null); // epoch ms
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionWarningFired, setSessionWarningFired] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [countdownClass, setCountdownClass] = useState("normal");
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isIdle, setIsIdle] = useState(false);
  const [autoExtendTriggered, setAutoExtendTriggered] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Session timing configuration from environment variables
  const IDLE_TIMEOUT =
    parseInt(import.meta.env.VITE_IDLE_TIMEOUT) || 2 * 60 * 1000; // Default: 2 minutes
  const EXTEND_THRESHOLD =
    parseInt(import.meta.env.VITE_EXTEND_THRESHOLD) || 10 * 60 * 1000; // Default: 10 minutes
  const WARNING_LEAD =
    parseInt(import.meta.env.VITE_WARNING_LEAD) || 5 * 60 * 1000; // Default: 5 minutes

  // Load persisted token (iOS Chrome fallback path)
  useEffect(() => {
    const saved = localStorage.getItem("authToken");
    if (saved)
      axios.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
  }, []);

  const setAuthToken = (token) => {
    localStorage.setItem("authToken", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };
  const clearAuthToken = () => {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
  };

  const clearSessionTimers = () => {
    setSessionExpiresAt(null);
    setShowSessionModal(false);
    setSessionWarningFired(false);
    setAutoExtendTriggered(false);
  };

  const fetchSessionInfo = async () => {
    try {
      const { data } = await authAPI.getSession();
      if (data?.expiresAt) setSessionExpiresAt(data.expiresAt);
      else setSessionExpiresAt(null);
    } catch {
      setSessionExpiresAt(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const { data } = await authAPI.getProfile();
      setUser(data || null);
      if (data) fetchSessionInfo();
      else clearSessionTimers();
      return data || null;
    } catch {
      setUser(null);
      clearSessionTimers();
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password, isAdminLogin = false }) => {
    try {
      const { data } = await authAPI.login({
        email,
        password,
        isAdminLogin,
      });
      if (!data?.error) {
        setUser(data);
        if (data.token && /CriOS/i.test(navigator.userAgent))
          setAuthToken(data.token);
        fetchSessionInfo();
      }
      return data;
    } catch (e) {
      return e?.response?.data || { error: "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {}
    setUser(null);
    clearAuthToken();
    clearSessionTimers();
  };

  const extendSession = async () => {
    try {
      const { data } = await authAPI.extendSession();
      if (data?.expiresAt) {
        setSessionExpiresAt(data.expiresAt);
        setShowSessionModal(false);
        setSessionWarningFired(false);
        setAutoExtendTriggered(false); // Reset for next session cycle
        setLastActivity(Date.now()); // Reset activity on manual extend
        setIsIdle(false);
        if (data.token) setAuthToken(data.token);
      }
    } catch {
      logout();
    }
  };

  // Registration helpers
  const registerEmailName = async ({ email, name }) => {
    try {
      const { data } = await authAPI.registerEmailName({
        email,
        name,
      });
      return data;
    } catch (e) {
      return e?.response?.data || { error: "Registration step 1 failed" };
    }
  };
  const checkUsernameAvailability = async ({ name }) => {
    try {
      const { data } = await authAPI.checkUsernameAvailability({
        name,
      });
      return data;
    } catch (e) {
      return e?.response?.data || { error: "Username check failed" };
    }
  };
  const registerPassword = async ({ password, tempToken }) => {
    try {
      const { data } = await authAPI.registerPassword({ password, tempToken });
      return data;
    } catch (e) {
      return e?.response?.data || { error: "Registration step 2 failed" };
    }
  };
  const registerUserFinal = async ({ code, newTempToken, role }) => {
    try {
      const { data } = await authAPI.register({
        code,
        newTempToken,
        role,
      });
      return data;
    } catch (e) {
      return e?.response?.data || { error: "Registration failed" };
    }
  };

  const getGoogleAuthUrl = () => {
    const base = import.meta.env.VITE_API_URL || "";
    return `${base}/api/ecocollect/auth/google`;
  };

  // OAuth redirect handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromGoogle = params.get("auth") === "google";
    const urlToken = params.get("token");
    if (fromGoogle && urlToken) {
      window.history.replaceState({}, document.title, window.location.pathname);
      setAuthToken(urlToken);
      refreshProfile().then((data) => {
        if (data) navigate("/home", { replace: true });
        else {
          clearAuthToken();
          navigate("/login", { replace: true });
        }
      });
    } else {
      refreshProfile().then((data) => {
        if (fromGoogle && data) navigate("/home", { replace: true });
        else if (fromGoogle)
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
      });
    }
  }, []);

  // Activity tracking - detect user interactions
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      setLastActivity(Date.now());
      setIsIdle(false);
      // Removed auto-extension when modal is showing
      // User must manually choose to extend via modal buttons
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [user, showSessionModal]);

  // Auto-extend session for active users (sliding session)
  useEffect(() => {
    if (
      !user ||
      !sessionExpiresAt ||
      isIdle ||
      showSessionModal ||
      autoExtendTriggered
    )
      return;

    const now = Date.now();
    const msLeft = sessionExpiresAt - now;

    // If active user has threshold time or less remaining, auto-extend
    if (msLeft <= EXTEND_THRESHOLD) {
      console.log(
        `[SESSION] Auto-extending session for active user (${Math.floor(
          msLeft / 60000,
        )}m left)`,
      );
      setAutoExtendTriggered(true); // Prevent multiple calls
      extendSession();
    }
  }, [
    user,
    sessionExpiresAt,
    isIdle,
    lastActivity,
    showSessionModal,
    autoExtendTriggered,
  ]);

  // Idle detection - check if user has been inactive
  useEffect(() => {
    if (!user) return;

    const idleChecker = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      const shouldBeIdle = timeSinceActivity >= IDLE_TIMEOUT;

      if (shouldBeIdle !== isIdle) {
        setIsIdle(shouldBeIdle);
        console.log(
          `[SESSION] User is now ${shouldBeIdle ? "IDLE" : "ACTIVE"}`,
        );
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(idleChecker);
  }, [user, lastActivity, isIdle, IDLE_TIMEOUT]);

  // Warning scheduler (only triggers when user is idle)
  useEffect(() => {
    if (!user || !sessionExpiresAt || !isIdle) {
      // Don't auto-dismiss modal when user becomes active
      // User must manually choose via modal buttons
      return;
    }

    const now = Date.now();
    const msLeft = sessionExpiresAt - now;
    if (msLeft <= 0) {
      refreshProfile();
      return;
    }
    if (msLeft <= WARNING_LEAD && !sessionWarningFired) {
      setShowSessionModal(true);
      setSessionWarningFired(true);
      return;
    }
    const timeoutId = setTimeout(() => {
      setShowSessionModal(true);
      setSessionWarningFired(true);
    }, msLeft - WARNING_LEAD);
    return () => clearTimeout(timeoutId);
  }, [user, sessionExpiresAt, sessionWarningFired, isIdle]);

  // Countdown in modal
  useEffect(() => {
    if (!showSessionModal || !sessionExpiresAt) {
      setCountdown("");
      setCountdownClass("normal");
      return;
    }
    const format = (ms) => {
      if (ms <= 0) return "00:00";
      const total = Math.floor(ms / 1000);
      const m = Math.floor(total / 60);
      const s = total % 60;
      return `${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    };
    const classify = (ms) => {
      const sec = Math.floor(ms / 1000);
      if (sec <= 5) return "critical";
      if (sec <= 10) return "danger";
      if (sec <= 30) return "warn";
      return "normal";
    };
    const tick = () => {
      const diff = sessionExpiresAt - Date.now();
      if (diff <= 0) {
        setCountdown("00:00");
        setCountdownClass("critical");
        logout();
        return false;
      }
      setCountdown(format(diff));
      setCountdownClass(classify(diff));
      return true;
    };
    if (!tick()) return; // initial
    const id = setInterval(() => {
      if (!tick()) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [showSessionModal, sessionExpiresAt]);

  // Periodic sync
  useEffect(() => {
    if (!user) return;
    const id = setInterval(fetchSessionInfo, 2 * 60 * 1000);
    return () => clearInterval(id);
  }, [user]);

  // Fallback fetch if profile loaded but no expiry
  useEffect(() => {
    if (user && !sessionExpiresAt) fetchSessionInfo();
  }, [user, sessionExpiresAt]);

  // Console log remaining session time (every 10 minutes) with activity status
  useEffect(() => {
    if (!sessionExpiresAt) return;

    const logInterval = setInterval(
      () => {
        const ms = sessionExpiresAt - Date.now();
        if (ms <= 0) {
          console.log("[SESSION] expired or about to expire (<=0ms)");
          return; // let other logic handle logout
        }
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        const activityStatus = isIdle ? "IDLE" : "ACTIVE";
        const timeSinceActivity = Math.floor(
          (Date.now() - lastActivity) / 1000,
        );
        console.log(
          `[SESSION] ${mins}m ${secs}s remaining | Status: ${activityStatus} | Idle for: ${timeSinceActivity}s`,
        );
      },
      5 * 60 * 1000,
    ); // Log every 5 minutes, Log per second if testing

    return () => clearInterval(logInterval);
  }, [sessionExpiresAt, isIdle, lastActivity]);

  // Global 401 handler
  useEffect(() => {
    let redirected = false;
    const interceptor = axios.interceptors.response.use(
      (r) => r,
      (err) => {
        // Only handle 401s here. Pass through other errors.
        if (err?.response?.status !== 401) return Promise.reject(err);
        if (!redirected) {
          redirected = true;
          setUser(null);
          clearAuthToken();
          const path = location.pathname || "";
          const target = path.startsWith("/admin") ? "/admin/login" : "/login";
          if (path !== target)
            navigate(target, { replace: true, state: { from: location } });
        }
        return Promise.reject(err);
      },
    );
    return () => axios.interceptors.response.eject(interceptor);
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
        checkUsernameAvailability,
        registerPassword,
        registerUserFinal,
        getGoogleAuthUrl,
        sessionExpiresAt,
        showSessionModal,
        extendSession,
        setShowSessionModal,
        clearSessionTimers,
      }}
    >
      {children}
      {showSessionModal && (
        <div className="session-timeout-modal">
          <div className="session-timeout-modal-backdrop" />
          <div
            className="session-timeout-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-timeout-title"
            aria-describedby="session-timeout-desc"
          >
            <div className="session-timeout-header">
              <h2 id="session-timeout-title">Session Timeout Notice</h2>
            </div>
            <p id="session-timeout-desc" className="session-timeout-message">
              Your secure session will end soon. Please choose an action to
              continue or you will be automatically logged out.
            </p>
            <p className="session-countdown-text" aria-live="polite">
              Auto logout in{" "}
              <span className={`session-countdown-value ${countdownClass}`}>
                {countdown}
              </span>
            </p>
            <div className="session-timeout-actions">
              <button
                onClick={extendSession}
                className="extend-session-btn"
                autoFocus
              >
                Stay Signed In
              </button>
              <button onClick={logout} className="logout-session-btn">
                Logout Now
              </button>
            </div>
            <button
              className="session-close-btn"
              onClick={logout}
              aria-label="Close and logout"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
