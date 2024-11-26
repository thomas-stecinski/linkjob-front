import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Assurez-vous du bon chemin
import Routes from './routes/routes'; // Votre fichier de routes principal
import EditCV from './pages/CV/EditCV';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Routes />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
