import React, { useState } from 'react';
import { Card, Input, Button, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../config/config';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      localStorage.setItem('token', data.token);
      
      setUser(data.user);
  
      navigate('/'); 
    } catch (err) {
      console.error('Error during login:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  const handleSignUpRedirect = () => {
    navigate('/register'); 
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-900">
      <Card className="w-full max-w-md p-4 bg-background/60 dark:bg-default-100/50 backdrop-blur-md">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Bienvenue sur LinkJob</h1>
            <p className="text-default-500">Veuillez vous connecter pour continuer</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
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
            onClick={handleLogin}
            isLoading={loading}
          >
            Se connecter
          </Button>
          <div className="text-center text-sm">
            Vous n'avez pas de compte ?{' '}
            <a onClick={handleSignUpRedirect} className="text-primary cursor-pointer">
              S'inscrire
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
