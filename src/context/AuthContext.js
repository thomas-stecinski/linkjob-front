import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Inclut les cookies dans la requête
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data.user); // Définit l'utilisateur
      } catch (error) {
        console.error('Error fetching user:', error.message);
        setUser(null); // Pas d'utilisateur authentifié
      } finally {
        setLoading(false); // Chargement terminé
      }
    };

    fetchUser(); // Appelle la fonction pour charger l'utilisateur
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
