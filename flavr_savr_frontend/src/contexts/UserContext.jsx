import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);
  
  useEffect(() => {
    const refreshAndFetchUser = async () => {
      try {
        // refresh access token
        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const accessToken = res.data.accessToken;
        setAccessToken(accessToken);

        // fetch full user data from server
        const userRes = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        setUser(userRes.data);
      } catch (err) {
        // User not logged in or refresh token expired - this is normal
        setUser(null);
        setAccessToken(null);
      }
    };

    refreshAndFetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};
