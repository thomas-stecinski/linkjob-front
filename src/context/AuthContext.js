import React, { createContext, useContext, useState, useEffect } from 'react';
import { BACKEND_URL } from '../config/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasCV, setHasCV] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        setUser(data.user);
        
        if (data.user) {
          const cvResponse = await fetch(`${BACKEND_URL}/api/cv/get-cv/${data.user.userid}`, {
            credentials: 'include'
          });
          setHasCV(cvResponse.ok);
        }
      } catch (error) {
        setUser(null);
        setHasCV(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, hasCV, setHasCV }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);