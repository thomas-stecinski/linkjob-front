import React from 'react';
import { BACKEND_URL } from '../config/config';
import { useAuth } from '../context/AuthContext';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from '@nextui-org/react';
import { UserIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Échec lors de la déconnexion');
      }

      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error.message);
    }
  };

  return (
    <nav className="bg-gray-800 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-white">
          <a href="/">LinkJob</a>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <a href="/news" className="text-white hover:text-primary flex items-center gap-2">
            Actualités
          </a>
          <a href="/offers" className="text-white hover:text-primary flex items-center gap-2">
            Offres
          </a>
          <a href="/cv" className="text-white hover:text-primary flex items-center gap-2">
            CV
          </a>
          <a href="/create-cv" className="text-white hover:text-primary flex items-center gap-2">
            Créer un CV
          </a>
        </div>

        {/* User Profile */}
        <div className="space-x-4 flex items-center">
          {user ? (
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center space-x-3 cursor-pointer">
                  <span className="text-white font-medium">
                    {user.firstname} {user.lastname}
                  </span>
                  <Avatar
                    src={user.avatar || ''}
                    alt="Profile"
                    className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
                    icon={!user.avatar && <UserIcon className="h-5 w-5 text-gray-600" />}
                  />
                </div>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="logout" color="error" onClick={handleLogout}>
                  Déconnexion
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <>
              <a
                href="/login"
                className="text-primary border border-primary px-4 py-2 rounded-md hover:bg-primary hover:text-white transition"
              >
                Connexion
              </a>
              <a
                href="/register"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
              >
                Inscription
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
