import React from 'react';
import { BACKEND_URL } from '../config/config';
import { useAuth } from '../context/AuthContext';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from '@nextui-org/react';
import { UserIcon } from '@heroicons/react/24/solid';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, hasCV, setUser } = useAuth();
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
    <nav className="bg-gray-800 backdrop-blur-md sticky top-0 z-50 w-full">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-white w-[200px]">
          <Link to="/">LinkJob</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center justify-center flex-1 space-x-4">
          <Button
            as={Link}
            to="/news"
            variant="light"
            className="text-white w-[120px]"
          >
            Actualités
          </Button>
          <Button
            as={Link}
            to="/offers"
            variant="light"
            className="text-white w-[120px]"
          >
            Offres
          </Button>
          <Button
            as={Link}
            to="/cv"
            variant="light"
            className="text-white w-[120px]"
          >
            CVthèque
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Button 
                variant="light"
                className="text-white w-[120px]"
              >
                Mon CV
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {hasCV ? (
                <DropdownItem key="view-cv" onPress={() => navigate(`/cv/${user?.userid}`)}>
                  Voir mon CV
                </DropdownItem>
              ) : (
                <DropdownItem key="create-cv" onPress={() => navigate('/create-cv')}>
                  Créer mon CV
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* User Profile */}
        <div className="flex items-center justify-end w-[200px]">
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
              <Button
                as={Link}
                to="/login"
                variant="bordered"
                className="text-primary border-primary hover:bg-primary hover:text-white"
              >
                Connexion
              </Button>
              <Button
                as={Link}
                to="/register"
                color="primary"
                className="hover:bg-primary/90"
              >
                Inscription
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
