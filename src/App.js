import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Assurez-vous du bon chemin
import Routes from './routes/routes'; // Votre fichier de routes principal

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
