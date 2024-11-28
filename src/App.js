import React from 'react';
import { AuthProvider } from './context/AuthContext'; 
import Routes from './routes/routes'; 
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
