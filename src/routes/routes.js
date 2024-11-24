import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../context/ProtectedRoute';
import Home from '../pages/home/home';
import Login from '../pages/authentification/login';
import Register from '../pages/authentification/register';
import ViewCVs from '../pages/CV/ViewCVs'; 
import GetCV from '../pages/CV/GetCV'; 
import CreateCV from '../pages/CV/CreateCV'; 
// import Offers from '../pages/offers/Offers';
// import News from '../pages/news/News'; 

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
            path="/cv/:userid"
            element={
              <ProtectedRoute>
                <GetCV />
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
