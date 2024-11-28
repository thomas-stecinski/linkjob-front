import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../config/config";
import { useAuth } from "../context/AuthContext";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from "@nextui-org/react";
import { UserIcon } from "@heroicons/react/24/solid";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour gérer le menu mobile
  const [hasCV, setHasCV] = useState(false); // État pour savoir si l'utilisateur a un CV
  const [isLoadingCV, setIsLoadingCV] = useState(true); // État pour suivre le chargement du CV

  // Vérification de la présence d'un CV à chaque chargement ou changement d'utilisateur
  useEffect(() => {
    const fetchCVStatus = async () => {
      if (!user?.userid) {
        setHasCV(false);
        setIsLoadingCV(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/cv/check/${user.userid}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          console.error(`Erreur API : ${response.statusText}`);
          setHasCV(false);
          setIsLoadingCV(false);
          return;
        }

        const data = await response.json();
        setHasCV(data.hasCV || false);
      } catch (error) {
        console.error("Erreur lors de la vérification du CV :", error.message);
      } finally {
        setIsLoadingCV(false);
      }
    };

    fetchCVStatus();
  }, [user]);

  // Gestion de la déconnexion
  const handleLogout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Échec lors de la déconnexion");
      }

      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  return (
    <nav className="bg-gray-800 backdrop-blur-md sticky top-0 z-50 w-full">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-white w-[200px]">
          <Link to="/">LinkJob</Link>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            className="text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`md:flex items-center justify-center flex-1 space-x-4 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <Button
            as={Link}
            to="/"
            variant="light"
            className="text-white w-[120px]"
          >
            Accueil
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
              <Button variant="light" className="text-white w-[120px]">
                Mon CV
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {isLoadingCV ? (
                <DropdownItem key="loading" disabled>
                  Chargement...
                </DropdownItem>
              ) : hasCV ? (
                <DropdownItem
                  key="view-cv"
                  onPress={() => navigate(`/cv/${user?.userid}`)}
                >
                  Voir mon CV
                </DropdownItem>
              ) : (
                <DropdownItem
                  key="create-cv"
                  onPress={() => navigate("/create-cv")}
                >
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
                    src={user.avatar || ""}
                    alt="Profile"
                    className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
                    icon={
                      !user.avatar && (
                        <UserIcon className="h-5 w-5 text-gray-600" />
                      )
                    }
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