import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom'; 
import { BACKEND_URL } from '../../config/config';

export default function Register() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appel à l'API pour l'inscription
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
        }),
        credentials: 'include', // Inclure les cookies pour la session
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Inscription échouée');
      }

      const data = await response.json();

      // Connexion réussie, redirection vers la page d'accueil
      navigate('/');
    } catch (err) {
      console.error('Erreur lors de l’inscription et connexion :', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-900">
      <Card className="w-full max-w-md p-4 bg-background/60 dark:bg-default-100/50 backdrop-blur-md">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Créer un compte</h1>
            <p className="text-default-500">
              Veuillez remplir le formulaire pour vous inscrire
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
          <Input
            label="Prénom"
            type="text"
            placeholder="Entrez votre prénom"
            variant="bordered"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <Input
            label="Nom"
            type="text"
            placeholder="Entrez votre nom"
            variant="bordered"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Entrez votre email"
            variant="bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="Entrez votre mot de passe"
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardBody>
        <CardFooter className="flex flex-col gap-3">
          <Button
            color="primary"
            className="w-full"
            size="lg"
            onClick={handleRegister}
            isLoading={loading}
          >
            S'inscrire
          </Button>
          <div className="text-center text-sm">
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="text-primary">
              Se connecter
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
