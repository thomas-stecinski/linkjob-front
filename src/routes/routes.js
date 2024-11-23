import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../context/ProtectedRoute';
import Home from '../pages/home/home';
import Login from '../pages/authentification/login';
import Register from '../pages/authentification/register';
import ViewCVs from '../pages/View/ViewCVs'; // Page pour afficher tous les CV
import CreateCV from '../pages/Create/CreateCV'; // Page pour créer un CV
// import Offers from '../pages/offers/Offers'; // Page pour afficher les offres
// import News from '../pages/news/News'; // Page pour les actualités

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cv"
            element={
              <ProtectedRoute>
                <ViewCVs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-cv"
            element={
              <ProtectedRoute>
                <CreateCV />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <Offers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <News />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
