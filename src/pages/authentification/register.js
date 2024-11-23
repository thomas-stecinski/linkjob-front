import React, { useState } from 'react';
import { Card, Input, Button, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom'; // Utiliser useNavigate pour la redirection
import { BACKEND_URL } from '../../config/config';

export default function Register() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialisation de useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appel à l'API pour enregistrer l'utilisateur
      const registerResponse = await fetch(`${BACKEND_URL}/api/auth/register`, {
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
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Une fois l'inscription réussie, connexion automatique
      const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include', // Inclure les cookies pour la session
      });

      if (!loginResponse.ok) {
        const loginError = await loginResponse.json();
        throw new Error(loginError.message || 'Login failed');
      }

      const loginData = await loginResponse.json();

      // Redirection vers la page Home après connexion
      navigate('/');
    } catch (err) {
      console.error('Error during registration or login:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-violet-500 to-fuchsia-500">
      <Card className="w-full max-w-md p-4 bg-background/60 dark:bg-default-100/50 backdrop-blur-md">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-default-500">Please fill the form to register</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
          <Input
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            variant="bordered"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <Input
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            variant="bordered"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
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
        </CardBody>
        <CardFooter className="flex flex-col gap-3">
          <Button
            color="primary"
            className="w-full"
            size="lg"
            onClick={handleRegister}
            isLoading={loading}
          >
            Register
          </Button>
          <div className="text-center text-sm">
            Already have an account? <a href="/login" className="text-primary">Login</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
