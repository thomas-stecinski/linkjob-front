import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Card, CardBody, Button, Image } from "@nextui-org/react";
import { BACKEND_URL } from "../../config/config";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Récupérer l'utilisateur connecté
  const [hasCV, setHasCV] = useState(false); // État pour vérifier si l'utilisateur a un CV
  const [isLoading, setIsLoading] = useState(true); // État de chargement

  useEffect(() => {
    const fetchCVStatus = async () => {
      if (!user?.userid) {
        setHasCV(false);
        setIsLoading(false);
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
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setHasCV(data.hasCV || false);
      } catch (error) {
        console.error("Erreur lors de la vérification du CV :", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCVStatus();
  }, [user]);

  const handleGetStarted = () => {
    if (!user) {
      navigate("/login"); // Rediriger vers la connexion si non connecté
      return;
    }

    if (hasCV) {
      navigate(`/cv/${user.userid}`); // Rediriger vers le CV existant
    } else {
      navigate("/create-cv"); // Rediriger vers la création de CV
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-gray-800">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Trouvez votre <span className="text-blue-500">emploi de rêve</span> dès maintenant avec{" "}
              <span className="text-blue-600">LinkJob</span> !
            </h1>
            <p className="text-lg mb-8">
              Entrez en contact avec des entreprises et découvrez des opportunités qui correspondent à vos compétences et
              à vos ambitions.
            </p>
            <div className="flex gap-4">
              {/* Redirection vers la page des CVs */}
              <Button size="lg" color="primary" variant="shadow" onClick={() => navigate("/cv")}>
                Commencer à rechercher
              </Button>

              {/* Logique conditionnelle pour "Se lancer" */}
              <Button
                size="lg"
                variant="bordered"
                className="text-blue-500 border-blue-500"
                onClick={handleGetStarted}
                disabled={isLoading} // Désactiver le bouton pendant le chargement
              >
                {isLoading ? "Chargement..." : "Se lancer"}
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="https://illustrations.popsy.co/white/developer.svg"
              alt="Illustration développeur"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-md rounded-md">
            <CardBody className="text-center">
              <div className="text-4xl mb-4 text-blue-600">🎯</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Matching Intelligents</h3>
              <p className="text-gray-600">
                Notre système alimenté par l’IA vous connecte avec des emplois adaptés à vos compétences et expériences.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white shadow-md rounded-md">
            <CardBody className="text-center">
              <div className="text-4xl mb-4 text-blue-600">💼</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Opportunités à Distance</h3>
              <p className="text-gray-600">
                Trouvez des emplois en télétravail auprès d’entreprises du monde entier.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white shadow-md rounded-md">
            <CardBody className="text-center">
              <div className="text-4xl mb-4 text-blue-600">🚀</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Évolution de Carrière</h3>
              <p className="text-gray-600">
                Accédez à des outils et ressources pour faire avancer votre carrière dans la tech.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
