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

  const navigate = useNavigate(); // Initialisation du hook

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
        credentials: 'include', // Inclut les cookies dans la requête
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
  
      // Met à jour l'état utilisateur
      setUser(data.user);
  
      navigate('/'); // Redirige vers la page d'accueil
    } catch (err) {
      console.error('Error during login:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  const handleSignUpRedirect = () => {
    navigate('/register'); // Redirection vers la page d'inscription
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-violet-500 to-fuchsia-500">
      <Card className="w-full max-w-md p-4 bg-background/60 dark:bg-default-100/50 backdrop-blur-md">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Welcome to LinkJob</h1>
            <p className="text-default-500">Please login to continue</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            variant="bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-between items-center">
            <label className="text-sm">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-sm text-primary">Forgot password?</a>
          </div>
        </CardBody>
        <CardFooter className="flex flex-col gap-3">
          <Button
            color="primary"
            className="w-full"
            size="lg"
            onClick={handleLogin}
            isLoading={loading}
          >
            Sign In
          </Button>
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <a onClick={handleSignUpRedirect} className="text-primary cursor-pointer">
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
