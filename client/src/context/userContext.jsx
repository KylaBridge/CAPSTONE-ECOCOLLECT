import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // If coming from Google redirect with token param, we still rely on cookie.
        const params = new URLSearchParams(window.location.search);
        const fromGoogle = params.get('auth') === 'google';
        axios.get("/api/ecocollect/auth/profile")
            .then(({ data }) => {
                setUser(data);
                setLoading(false);
                if (fromGoogle && data) {
                    // Navigate to home and clean query
                    navigate('/home', { replace: true });
                } else if (fromGoogle) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}
